import { ref, onMounted, onUnmounted } from 'vue';
import * as THREE from 'three';

/**
 * useEvolutionRenderer: Renders the Cannon-es physics bodies using Three.js
 */
export function useEvolutionRenderer(containerRef, vessel) {
    let scene, camera, renderer, animationId;
    const meshes = new Map();

    const init = () => {
        if (!containerRef.value) {
            console.warn('useEvolutionRenderer: containerRef is null');
            return;
        }

        scene = new THREE.Scene();
        scene.background = new THREE.Color(0x050505);

        const width = containerRef.value.clientWidth || 800;
        const height = containerRef.value.clientHeight || 600;
        console.log(`useEvolutionRenderer: Initializing with ${width}x${height}`);

        camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
        camera.position.set(0, 2, 5);
        camera.lookAt(0, 1, 0);

        renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setSize(width, height);
        containerRef.value.appendChild(renderer.domElement);

        // Lights
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
        scene.add(ambientLight);
        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
        directionalLight.position.set(5, 10, 7);
        scene.add(directionalLight);

        // Ground
        const groundGeom = new THREE.PlaneGeometry(100, 100);
        const groundMat = new THREE.MeshStandardMaterial({ color: 0x111111 });
        const groundMesh = new THREE.Mesh(groundGeom, groundMat);
        groundMesh.rotation.x = -Math.PI / 2;
        scene.add(groundMesh);

        // Grid helper
        const grid = new THREE.GridHelper(100, 100, 0x00ffc8, 0x222222);
        scene.add(grid);

        // Create meshes for biped parts
        createMesh(vessel.torso, 0.4, 0.8, 0.4, 0x00ffc8);
        createMesh(vessel.leftLeg, 0.2, 0.8, 0.2, 0x0088ff);
        createMesh(vessel.rightLeg, 0.2, 0.8, 0.2, 0x0088ff);

        animate();
    };

    const createMesh = (body, w, h, d, color) => {
        const geometry = new THREE.BoxGeometry(w, h, d);
        const material = new THREE.MeshStandardMaterial({ color });
        const mesh = new THREE.Mesh(geometry, material);
        scene.add(mesh);
        meshes.set(body, mesh);
    };

    const animate = () => {
        animationId = requestAnimationFrame(animate);
        
        // Step physics if not in evolution mode (real-time preview)
        if (vessel.world && !vessel.isEvolving) {
            vessel.step(1/60);
        }

        // Sync Three.js meshes with Cannon-es bodies
        meshes.forEach((mesh, body) => {
            mesh.position.copy(body.position);
            mesh.quaternion.copy(body.quaternion);
        });

        // Follow the torso with the camera
        if (vessel.torso) {
            camera.position.x = vessel.torso.position.x;
            camera.lookAt(vessel.torso.position.x, 1, 0);
        }

        renderer.render(scene, camera);
    };

    onMounted(() => {
        init();
    });

    onUnmounted(() => {
        cancelAnimationFrame(animationId);
        if (renderer) {
            renderer.dispose();
            if (containerRef.value && renderer.domElement) {
                containerRef.value.removeChild(renderer.domElement);
            }
        }
    });

    return {
        scene,
        camera,
        renderer
    };
}
