<template>
  <div class="alphabet-filter" :class="[`size-${size}`]">
    <div class="alphabet-row">
      <button 
        v-for="letter in alphabet" 
        :key="letter"
        class="filter-letter"
        :class="{ active: modelValue === letter }"
        @click="toggleLetter(letter)"
      >
        {{ letter }}
      </button>
      <button v-if="showReset" class="clear-btn" @click="reset">Reset</button>
      <slot name="extra"></slot>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  modelValue: {
    type: String,
    default: ''
  },
  showReset: {
    type: Boolean,
    default: false
  },
  size: {
    type: String,
    default: 'sm' // 'sm' or 'md'
  }
})

const emit = defineEmits(['update:modelValue', 'reset'])

const alphabet = 'abcdefghijklmnopqrstuvwxyz'.split('')

const toggleLetter = (letter) => {
  if (props.modelValue === letter) {
    emit('update:modelValue', '')
  } else {
    emit('update:modelValue', letter)
  }
}

const reset = () => {
  emit('update:modelValue', '')
  emit('reset')
}
</script>

<style scoped>
.alphabet-row {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
}

.filter-letter {
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid rgba(0, 0, 0, 0.1);
  background: transparent;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s;
  text-transform: uppercase;
  color: #4a5568;
}

/* size-sm matches CuesPortal */
.size-sm .filter-letter {
  width: 20px;
  height: 20px;
  font-size: 0.65rem;
}

/* size-md matches libraryCues */
.size-md .filter-letter {
  width: 30px;
  height: 30px;
  font-size: 0.8rem;
  border-radius: 6px;
  background: white;
}

.filter-letter:hover, .filter-letter.active {
  background: #3b82f6;
  color: white;
  border-color: #3b82f6;
}

.clear-btn {
  font-size: 0.65rem;
  padding: 2px 6px;
  border-radius: 4px;
  border: 1px solid rgba(0, 0, 0, 0.1);
  background: #edf2f7;
  cursor: pointer;
}

/* Extra styling for slot content if it needs to match clear-btn */
:deep(.clear-btn) {
  font-size: 0.65rem;
  padding: 2px 6px;
  border-radius: 4px;
  border: 1px solid rgba(0, 0, 0, 0.1);
  background: #edf2f7;
  cursor: pointer;
}
</style>
