<template>
  <div class="lib-card">
    <div v-if="$slots.header" class="lib-card-header">
      <slot name="header"></slot>
    </div>
    <div class="lib-card-body">
      <slot></slot>
    </div>
    <div v-if="$slots.footer" class="lib-card-footer">
      <slot name="footer"></slot>
    </div>
  </div>
</template>

<style scoped>
.lib-card {
  background: var(--sov-glass);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: var(--sov-border-radius);
  box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.07);
  margin-bottom: 1.5rem;
  overflow: hidden;
  transition: var(--sov-transition-med);
}

.lib-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 40px 0 rgba(31, 38, 135, 0.1);
}

.lib-card-header {
  padding: 1rem 1.5rem;
  background: rgba(0, 204, 163, 0.05);
  border-bottom: 1px solid rgba(0, 204, 163, 0.1);
  font-weight: 600;
  color: var(--sov-accent);
}

.lib-card-body {
  padding: 1.5rem;
}

.lib-card-footer {
  padding: 1rem 1.5rem;
  background: rgba(0, 0, 0, 0.02);
  border-top: 1px solid rgba(0, 0, 0, 0.05);
}

[data-theme='dark'] .lib-card {
  background: rgba(26, 26, 26, 0.8);
  border: 1px solid rgba(255, 255, 255, 0.05);
}
</style>
