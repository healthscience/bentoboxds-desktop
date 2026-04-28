<template>
  <div class="stroke-toggle-container">
    <div class="toggle-group">
      <button 
        v-for="(profile, key) in profiles" 
        :key="key"
        :class="['stroke-btn', { active: currentStroke === key }]"
        @click="$emit('change-stroke', key)"
        :style="{ '--stroke-color': profile.color }"
      >
        <span class="icon">{{ getIcon(key) }}</span>
        <span class="name">{{ profile.name }}</span>
      </button>
    </div>
  </div>
</template>

<script setup>
defineProps(['profiles', 'currentStroke']);
defineEmits(['change-stroke']);

const getIcon = (key) => {
  const icons = { butterfly: '🦋', backstroke: '🏊‍♂️', breaststroke: '🐸', freestyle: '⚡' };
  return icons[key] || '🌊';
};
</script>

<style scoped>
.toggle-group {
  display: flex;
  gap: 8px;
  background: rgba(255, 255, 255, 0.05);
  padding: 4px;
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.stroke-btn {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 8px;
  background: transparent;
  border: 1px solid transparent;
  border-radius: 8px;
  color: #888;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.stroke-btn.active {
  background: rgba(255, 255, 255, 0.08);
  border-color: var(--stroke-color);
  color: white;
  box-shadow: 0 0 10px var(--stroke-color);
}

.icon { font-size: 1.2rem; margin-bottom: 4px; }
.name { font-size: 0.65rem; text-transform: uppercase; font-weight: bold; }
</style>