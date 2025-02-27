<template>
  <Transition name="modal">
    <div v-if="show" class="modal-mask" @click="emit('close')">
      <div class="modal-container" @click.stop>
        <div class="modal-header">
          <slot name="header"></slot>
        </div>

        <div class="modal-body">
          <slot name="body">default body</slot>
        </div>
        <div class="modal-tabs">
          <slot name="tabs"></slot>
        </div>
        <div class="modal-connect">
          <slot name="connect"></slot>
        </div>
        <div class="modal-footer">
          <slot name="footer">
            default footer
            <button
              class="modal-default-button"
              @click="$emit('close')"
            >close</button>
          </slot>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup>
const props = defineProps({
  show: Boolean
})

const emit = defineEmits(['close'])

</script>

<style scoped>
.modal-mask {
  z-index: 299;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  transition: opacity 0.3s ease;
  background-color: rgba(82, 84, 171, 0.4); /* #5254ab; */

}

.modal-container {
  width: 90vw;
  height: 92vh;
  margin: auto;
  padding: 20px 30px;
  background: white;
  border-radius: 2px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.33);
  transition: all 0.3s ease;
  overflow: scroll;
  opacity: 1;
}

.modal-header h3 {
  margin-top: 0;
  color: #42b983;
}

.modal-body {
  margin: 20px 0;
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