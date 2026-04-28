<template>
  <div
    id="bento-frame"
    :class="['bento-frame', activeClass, { 'is-docked': docked }]"
  >
    <div
      v-for="(quad, index) in quadrants"
      :key="quad.id"
      :id="quad.id"
      class="bento-quadrant"
      :class="{
        focused: activeQuadrants.includes(quad.id),
        'me-pair': index < 2,
        'us-pair': index >= 2,
      }"
      @click="toggleQuadrant(quad.id)"
    >
      <span class="label-full">{{ quad.label }}</span>
      <span class="label-short">{{ quad.short }}</span>
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  activeQuadrants: {
    type: Array,
    default: () => ["now-me"],
  },
  docked: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(["update:activeQuadrants"]);

const quadrants = [
  { id: "now-me", label: "NOW ME", short: "M" },
  { id: "future-me", label: "FUTURE ME", short: "FM" },
  { id: "now-us", label: "NOW US", short: "U" },
  { id: "future-us", label: "FUTURE US", short: "FU" },
];

const activeClass = computed(() => {
  if (props.activeQuadrants.length === 0) return "";
  // Use the last selected quadrant for the border color
  const lastActive = props.activeQuadrants[props.activeQuadrants.length - 1];
  return `active-${lastActive}`;
});

const toggleQuadrant = (id) => {
  let newActive = [...props.activeQuadrants];
  if (newActive.includes(id)) {
    // Don't allow deselecting if it's the only one
    if (newActive.length > 1) {
      newActive = newActive.filter((q) => q !== id);
    }
  } else {
    newActive.push(id);
  }
  emit("update:activeQuadrants", newActive);
};
</script>

<style scoped>
.bento-frame {
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: 1fr 1fr;
  border: 1px solid transparent;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  width: 160px;
  height: 160px;
  background: rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 8px;
  overflow: hidden;
  pointer-events: auto;
}

.bento-frame.is-docked {
  grid-template-columns: repeat(4, 1fr);
  grid-template-rows: 1fr;
  width: 100%;
  height: 40px;
  border-width: 1px;
  background: transparent;
  backdrop-filter: none;
  border-radius: 0;
}

/* Dynamic Border Shifts */
.active-now-me {
  border-color: #00f2ff;
}
.active-future-me {
  border-color: #4b0082;
}
.active-now-us {
  border-color: #ffbf00;
}
.active-future-us {
  border-color: #8a2be2;
}

.bento-quadrant {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  font-size: 10px;
  font-weight: bold;
  color: #2e5052;
  cursor: pointer;
  opacity: 0.6;
  transition: all 0.3s ease;
  border: 1px solid rgba(255, 255, 255, 0.1);
  text-align: center;
  padding: 4px;
}

.label-short {
  display: none;
}

.is-docked .label-full {
  display: none;
}

.is-docked .label-short {
  display: block;
}

/* Central Divider for Docked Mode */
.is-docked .me-pair:nth-child(2) {
  border-right: 4px solid rgba(255, 255, 255, 0.2);
}

.bento-quadrant.focused {
  opacity: 1;
  transform: scale(1.02);
  background: #003366;
  color: white;
}

.bento-quadrant:hover {
  opacity: 0.8;
}
</style>
