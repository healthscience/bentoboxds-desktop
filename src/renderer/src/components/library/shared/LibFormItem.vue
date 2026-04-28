<template>
  <div class="lib-form-item">
    <label v-if="label" :for="id" class="lib-label">{{ label }}</label>
    <div class="lib-input-container">
      <slot></slot>
      <span v-if="required" class="lib-required-dot">*</span>
    </div>
  </div>
</template>

<script setup>
defineProps({
  label: String,
  id: String,
  required: Boolean
})
</script>

<style scoped>
.lib-form-item {
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: 1.5rem;
  align-items: start;
  padding: 0.75rem 0;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
}

.lib-label {
  justify-self: end;
  font-weight: 500;
  color: var(--sov-text);
  font-size: 0.9rem;
  padding-top: 0.5rem;
}

.lib-input-container {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  width: 100%;
}

.lib-required-dot {
  color: var(--sov-accent);
  font-weight: bold;
}

@media (max-width: 1023px) {
  .lib-form-item {
    grid-template-columns: 1fr;
    gap: 0.5rem;
  }
  
  .lib-label {
    justify-self: start;
  }
}
</style>
