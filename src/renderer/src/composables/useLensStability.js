import { ref, computed, onMounted, onUnmounted } from 'vue';
import { diaryStore } from '@/stores/diaryStore'; 

export function useLensStability(options = { dampening: 0.1, snapRadius: 50 }) {

  const storeDiary = diaryStore()

  const mouse = ref({ x: 0, y: 0 });      // Actual mouse position
  const target = ref({ x: 0, y: 0 });     // Where the lens "wants" to be
  const lensPos = ref({ x: 0, y: 0 });    // The smoothed, dampened position
  
  const isLocked = ref(false);
  const isFixed = ref(false); // New: Fixed in place by click
  const isFineTuning = ref(false); // Triggered by [Space]
  const zoomScale = ref(1);        // Visual zoom
  const linkedCue = ref(null);     // Currently snapped cue

  const zoomDepth = computed({
    get: () => storeDiary.zoomDepth,
    set: (val) => { storeDiary.zoomDepth = val }
  });

  // Mocked cues for magnetic snapping (disabled for 3D raycasting)
  const mockCues = [
    // { id: 'heart', name: 'Heart', x: 400, y: 300, coherence: 82 },
    // { id: 'pancreas', name: 'Pancreas', x: 450, y: 400, coherence: 95 },
    // { id: 'liver', name: 'Liver', x: 350, y: 380, coherence: 78 }
  ];

  const findNearestCue = (x, y) => {
    let nearest = null;
    let minDist = options.snapRadius;

    for (const cue of mockCues) {
      const dist = Math.hypot(cue.x - x, cue.y - y);
      if (dist < minDist) {
        minDist = dist;
        nearest = cue;
      }
    }
    return nearest;
  };

  // Dampened Animation Loop
  let rafHandle = null;
  const update = () => {
    if (!isLocked.value && !isFixed.value) {
      const factor = isFineTuning.value ? 0.02 : options.dampening;
      
      // Check for magnetic snapping
      const nearest = findNearestCue(target.value.x, target.value.y);
      // linkedCue.value = nearest; // Let 3D raycasting handle this now

      let finalTargetX = target.value.x;
      let finalTargetY = target.value.y;

      if (nearest) {
        // Apply gravity well
        finalTargetX = nearest.x;
        finalTargetY = nearest.y;
      }

      // Interpolation logic: x = x + (target - x) * factor
      lensPos.value.x += (finalTargetX - lensPos.value.x) * factor;
      lensPos.value.y += (finalTargetY - lensPos.value.y) * factor;
    }
    rafHandle = requestAnimationFrame(update);
  };

  const handleMouseMove = (e) => {
    if (isLocked.value || isFixed.value) return;
    
    // Get coordinates relative to the container
    const rect = e.currentTarget.getBoundingClientRect();
    target.value = { 
      x: e.clientX - rect.left, 
      y: e.clientY - rect.top 
    };
  };

  const toggleLock = () => {
    isLocked.value = !isLocked.value;
    if (isLocked.value) isFixed.value = false; // Unlock also unfixes
  };

  const toggleFixed = () => {
    if (isLocked.value) return;
    isFixed.value = !isFixed.value;
  };

  const handleKeyDown = (e) => {
    if (e.code === 'Space' || e.code === 'ShiftLeft' || e.code === 'ShiftRight') {
      isFineTuning.value = true;
    }
  };

  const handleKeyUp = (e) => {
    if (e.code === 'Space' || e.code === 'ShiftLeft' || e.code === 'ShiftRight') {
      isFineTuning.value = false;
    }
  };

  onMounted(() => {
    rafHandle = requestAnimationFrame(update);
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
  });

  onUnmounted(() => {
    cancelAnimationFrame(rafHandle);
    window.removeEventListener('keydown', handleKeyDown);
    window.removeEventListener('keyup', handleKeyUp);
  });

  return { 
    lensPos, 
    target, 
    isLocked, 
    isFixed,
    zoomScale, 
    zoomDepth, 
    linkedCue,
    handleMouseMove, 
    toggleLock,
    toggleFixed
  };
}
