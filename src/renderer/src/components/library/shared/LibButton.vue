<template>
  <button 
    class="lib-button" 
    :class="[variant, { 'is-loading': loading }]"
    :disabled="disabled || loading"
    @click="$emit('click', $event)"
  >
    <span v-if="loading" class="lib-loader"></span>
    <slot v-else></slot>
  </button>
</template>

<script setup>
defineProps({
  variant: {
    type: String,
    default: 'primary' // primary, secondary, danger
  },
  loading: Boolean,
  disabled: Boolean
})

defineEmits(['click'])
</script>

<style scoped>
.lib-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.75rem 1.5rem;
  border-radius: var(--sov-pill);
  font-weight: 600;
  font-size: 0.9rem;
  cursor: pointer;
  transition: var(--sov-transition-med);
  border: 1px solid transparent;
  gap: 0.5rem;
  min-width: 120px;
}

.lib-button.primary {
  background: var(--sov-accent);
  color: white;
  box-shadow: 0 4px 12px var(--sov-accent-glow);
}

.lib-button.primary:hover:not(:disabled) {
  background: #00b38f;
  transform: translateY(-1px);
  box-shadow: 0 6px 16px var(--sov-accent-glow);
}

.lib-button.secondary {
  background: var(--sov-bg-soft);
  color: var(--sov-text);
  border-color: rgba(0, 0, 0, 0.1);
}

.lib-button.secondary:hover:not(:disabled) {
  border-color: var(--sov-accent);
  color: var(--sov-accent);
}

.lib-button.danger {
  background: #ff4d4d;
  color: white;
}

.lib-button.danger:hover:not(:disabled) {
  background: #e60000;
}

.lib-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none !important;
}

.lib-loader {
  width: 16px;
  height: 16px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top-color: white;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}
</style>
