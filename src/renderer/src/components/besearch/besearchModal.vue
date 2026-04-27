<template>
  <div v-if="show" class="modal-mask" :style="{ '--z-index': zIndex }" @click="emit('close')">
    <div class="modal-container" @click.stop>
      <div class="modal-header">
        <slot name="header">default header</slot>
      </div>
      <div class="modal-body">
        <slot name="body">
          default body
        </slot>
      </div>
      <div class="modal-footer">
        <slot name="footer">
          Cues
          <button
            class="modal-default-button"
            @click="$emit('close')"
          >
            close
          </button>
        </slot>
      </div>
    </div>
  </div>
</template>
  
  <script setup>
  
  
    const props = defineProps({
      show: Boolean,
      zIndex: {
        type: Number,
        default: 1300
      }
    })

    const emit = defineEmits(['close'])
  
    /* computed */
  
  </script>
  
  <style scoped>
  .modal-mask {
    position: fixed;
    z-index: var(--z-index, 1300);
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(82, 84, 171, 0.4);
    display: grid;
    place-items: center;
    transition: opacity 0.3s ease;
    opacity: 1;
  }
  
  .modal-container {
    display: grid;
    grid-template-rows: minmax(auto, max-content) minmax(0, 1fr) minmax(auto, max-content);
    width: 100vw;
    height: 100vh;
    margin: 0;
    padding: 20px 30px;
    background: white;
    border-radius: 0;
    box-shadow: none;
    transition: all 0.3s ease;
    overflow: hidden;
    box-sizing: border-box;
    gap: 0;
  }
  
  .modal-header {
    grid-row: 1;
    margin: 0;
    color: #42b983;
  }

  .modal-body {
    grid-row: 2;
    display: grid;
    grid-template-rows: 1fr auto; /* Simplified - let grid distribute space */
    overflow: hidden;
    min-height: 0;
    height: 100%; /* Force body to take full grid cell height */
    gap: 0;
  }

  .modal-footer {
    grid-row: 3;
  }

  .modal-default-button {
    float: right;
  }

/*
 * The following styles are auto-applied to elements with
 * transition="modal" when their visibility is toggled
 * by Vue.js.
 *
 * You can easily play with the modal transition by editing
 * these styles.
 */

.modal-enter-from {
  opacity: 0;
}

.modal-leave-to {
  opacity: 0;
}

.modal-enter-from .modal-container,
.modal-leave-to .modal-container {
  -webkit-transform: scale(1.1);
  transform: scale(1.1);
}
</style>
