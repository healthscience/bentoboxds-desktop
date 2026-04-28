import { ref, onMounted, onUnmounted, watch } from 'vue';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import OrganSyncSystem from '../systems/OrganSyncSystem.js';

export function useThreeBody(containerRef, zoomDepthRef, lensPosRef, linkedCueRef) {
  let scene, camera, renderer, animationId;
  let bodyMesh = null;
  let heartMesh = null;
  const isInitialized = ref(false);
  const bodyScale = ref(1.0);
  const bodyPulse = ref(1.0);
  
  // Raycaster setup
  const raycaster = new THREE.Raycaster();
  const mouse = new THREE.Vector2();
  let interactableMeshes = [];

  const initThree = () => {
    if (!containerRef.value) {
      console.error('[useThreeBody] containerRef is null!');
      return;
    }

    // Setup Scene
    scene = new THREE.Scene();
    
    // Setup Camera
    let width = containerRef.value.clientWidth || 800;
    let height = containerRef.value.clientHeight || 600;
    
    camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 0, 8);
    camera.lookAt(0, 0, 0);

    // Setup Renderer
    renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.domElement.style.width = '100%';
    renderer.domElement.style.height = '100%';
    renderer.domElement.style.display = 'block';
    containerRef.value.appendChild(renderer.domElement);

    // Add basic lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.0);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1.2);
    directionalLight.position.set(5, 10, 7);
    scene.add(directionalLight);

    const pointLight = new THREE.PointLight(0xffffff, 1.0);
    pointLight.position.set(-5, -5, -5);
    scene.add(pointLight);

    // Load Models
    loadModels();

    // Handle Resize
    const handleResize = () => {
      if (!containerRef.value || !camera || !renderer) return;
      const newWidth = containerRef.value.clientWidth;
      const newHeight = containerRef.value.clientHeight;
      if (newWidth === 0 || newHeight === 0) return;
      
      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);
    };
    
    const resizeObserver = new ResizeObserver(() => {
      handleResize();
    });
    resizeObserver.observe(containerRef.value);

    // Animation Loop
    const animate = () => {
      animationId = requestAnimationFrame(animate);
      
      try {
        if (bodyMesh) {
          // Simple rotation for the body
          bodyMesh.rotation.y += 0.005;
          
          const currentScale = parseFloat(bodyScale.value) || 1.0;
          bodyMesh.scale.set(currentScale, currentScale, currentScale);
        }

        // Update OrganSyncSystem with metabolic state
        const currentPulse = parseFloat(bodyPulse.value) || 1.0;
        OrganSyncSystem.update({ pulse: currentPulse });

        // Raycasting
        if (lensPosRef && lensPosRef.value && containerRef.value && interactableMeshes.length > 0) {
          const rect = containerRef.value.getBoundingClientRect();
          if (rect.width > 0 && rect.height > 0) {
            mouse.x = ((lensPosRef.value.x - rect.left) / rect.width) * 2 - 1;
            mouse.y = -((lensPosRef.value.y - rect.top) / rect.height) * 2 + 1;

            raycaster.setFromCamera(mouse, camera);
            const intersects = raycaster.intersectObjects(interactableMeshes, true);

            // Reset hover state
            interactableMeshes.forEach(mesh => {
              mesh.userData.isHovered = false;
              if (mesh.material && mesh.material.emissive) {
                mesh.material.emissive.setHex(0x000000);
              }
            });

            if (intersects.length > 0) {
              let hitMesh = intersects[0].object;
              while (hitMesh && !hitMesh.userData.id && hitMesh.parent) {
                hitMesh = hitMesh.parent;
              }

              if (hitMesh && hitMesh.userData.id) {
                hitMesh.userData.isHovered = true;
                if (hitMesh.material && hitMesh.material.emissive) {
                  hitMesh.material.emissive.setHex(0x550000);
                } else if (hitMesh.children) {
                  hitMesh.children.forEach(child => {
                    if (child.material && child.material.emissive) {
                      child.material.emissive.setHex(0x550000);
                    }
                  });
                }
                
                if (linkedCueRef) {
                  linkedCueRef.value = {
                    id: hitMesh.userData.id,
                    name: hitMesh.userData.name || hitMesh.userData.id,
                    coherence: 100
                  };
                }
              }
            } else {
              if (linkedCueRef) {
                linkedCueRef.value = null;
              }
            }
          }
        }

        renderer.render(scene, camera);
      } catch (err) {
        console.error('[useThreeBody] Error in animation loop:', err);
      }
    };
    animate();

    isInitialized.value = true;

    return () => {
      resizeObserver.disconnect();
      cancelAnimationFrame(animationId);
      if (renderer && renderer.domElement && containerRef.value) {
        containerRef.value.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  };

  const loadModels = () => {
    const loader = new GLTFLoader();
    
    // Full Body Model (Surface)
    loader.load('/assets/models/body_surface.glb', (gltf) => {
      console.log('[useThreeBody] Body loaded');
      bodyMesh = gltf.scene;
      bodyMesh.name = "Body_Surface";
      bodyMesh.userData = { id: 'Skin', name: 'Skin' };
      
      // Add all meshes in the model to interactable list
      bodyMesh.traverse((child) => {
        if (child.isMesh) {
          interactableMeshes.push(child);
        }
      });
      
      scene.add(bodyMesh);
    }, undefined, (error) => {
      console.warn('[useThreeBody] Could not load body, using placeholder', error);
      createPlaceholderBody();
    });

    // Load specific organs if needed or handle via zoomDepth
    createPlaceholderHeart();
  };

  const createPlaceholderBody = () => {
    const group = new THREE.Group();
    const torsoGeom = new THREE.CapsuleGeometry(0.8, 1.5, 8, 16);
    const material = new THREE.MeshStandardMaterial({ 
      color: 0x00ffc8, 
      transparent: true,
      opacity: 0.7,
      roughness: 0.3,
      metalness: 0.2
    });
    const torso = new THREE.Mesh(torsoGeom, material);
    group.add(torso);

    const headGeom = new THREE.SphereGeometry(0.4, 16, 16);
    const head = new THREE.Mesh(headGeom, material);
    head.position.y = 1.5;
    group.add(head);

    const limbGeom = new THREE.CapsuleGeometry(0.2, 1.2, 4, 8);
    
    const leftArm = new THREE.Mesh(limbGeom, material);
    leftArm.position.set(-1, 0.5, 0);
    leftArm.rotation.z = Math.PI / 4;
    group.add(leftArm);

    const rightArm = new THREE.Mesh(limbGeom, material);
    rightArm.position.set(1, 0.5, 0);
    rightArm.rotation.z = -Math.PI / 4;
    group.add(rightArm);

    const leftLeg = new THREE.Mesh(limbGeom, material);
    leftLeg.position.set(-0.4, -1.5, 0);
    group.add(leftLeg);

    const rightLeg = new THREE.Mesh(limbGeom, material);
    rightLeg.position.set(0.4, -1.5, 0);
    group.add(rightLeg);

    bodyMesh = group;
    bodyMesh.name = "Placeholder_Body_Group";
    bodyMesh.userData = { id: 'Placeholder_Skin', name: 'Skin' };
    interactableMeshes.push(torso, head, leftArm, rightArm, leftLeg, rightLeg);
    
    scene.add(bodyMesh);
  };

  const createPlaceholderHeart = () => {
    const heartGeometry = new THREE.SphereGeometry(0.3, 16, 16);
    const heartMaterial = new THREE.MeshStandardMaterial({ color: 0xff0000 });
    heartMesh = new THREE.Mesh(heartGeometry, heartMaterial);
    heartMesh.userData = { id: 'Heart_01', name: 'Heart', isHovered: false };
    interactableMeshes.push(heartMesh);

    if (bodyMesh) {
      OrganSyncSystem.init(bodyMesh, heartMesh);
    }
  };

  const updateMetabolism = (data) => {
    // Update metabolic state for the 3D world
    if (data.heartRate) {
      bodyPulse.value = 1.0 + (data.heartRate / 100.0) * 0.1;
    }
  };

  let cleanup = null;

  onMounted(() => {
    cleanup = initThree();
  });

  onUnmounted(() => {
    if (cleanup) cleanup();
  });

  watch(zoomDepthRef, (newDepth) => {
    if (!camera) return;
    if (newDepth === 0) {
      camera.position.z = 5;
    } else if (newDepth === 1) {
      camera.position.z = 3;
    } else if (newDepth === 2) {
      camera.position.z = 1.5;
    }
  });

  return {
    isInitialized,
    updateMetabolism
  };
}
