<template>
  <div
    class="context-filter-container"
    :class="{ 'is-collapsed': isCollapsed }"
    @dblclick.stop="toggleExpand"
  >
    <div class="filter-header">
      <span class="header-label">CONTEXT FILTERS</span>
      <div v-if="isCollapsed" class="expand-hint">DBL CLICK</div>
    </div>
    <div v-if="!isCollapsed" class="filter-menu">
      <button
        v-for="filter in filters"
        :key="filter.id"
        class="filter-button"
        @mousedown.stop
        @click.stop="selectFilter(filter.id)"
      >
        <!--<span class="button-label">{{ filter.label }}</span> -->
        <div class="button-indicator"></div>
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";

const isCollapsed = ref(true);

const filters = [
  { id: 1, label: "filter 1" },
  { id: 2, label: "filter 2" },
  { id: 3, label: "filter 3" },
];

const toggleExpand = () => {
  isCollapsed.value = !isCollapsed.value;
};

const selectFilter = (id) => {
  console.log(`Filter ${id} selected`);
};
</script>

<style scoped>
.context-filter-container {
  width: 160px;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(8px);
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 12px;
  padding: 12px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5);
  user-select: none;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.context-filter-container.is-collapsed {
  width: 130px;
  padding: 8px 12px;
  gap: 0;
  cursor: pointer;
}

.filter-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  padding-bottom: 6px;
  margin-bottom: 2px;
  transition: border 0.3s ease;
}

.is-collapsed .filter-header {
  border-bottom-color: transparent;
  margin-bottom: 0;
  padding-bottom: 0;
}

.header-label {
  font-size: 0.6rem;
  letter-spacing: 0.1em;
  color: rgba(255, 255, 255, 0.5);
  font-weight: 600;
}

.expand-hint {
  font-size: 0.5rem;
  color: rgba(0, 242, 255, 0.6);
  letter-spacing: 0.05em;
  font-weight: 700;
}

.filter-menu {
  display: flex;
  flex-direction: column;
  gap: 6px;
  animation: slideDown 0.3s ease-out;
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-5px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.filter-button {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 6px;
  padding: 8px 12px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
  transition: all 0.2s ease;
  text-align: left;
}

.filter-button:hover {
  background: rgba(255, 255, 255, 0.12);
  border-color: rgba(255, 255, 255, 0.3);
  transform: translateX(2px);
}

.filter-button:active {
  background: rgba(255, 255, 255, 0.2);
  transform: scale(0.98);
}

.button-label {
  color: #fff;
  font-size: 0.8rem;
  font-weight: 400;
  text-transform: capitalize;
}

.button-indicator {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.2);
  transition: background 0.3s ease;
}

.filter-button:hover .button-indicator {
  background: #00f2ff;
  box-shadow: 0 0 8px #00f2ff;
}
</style>
