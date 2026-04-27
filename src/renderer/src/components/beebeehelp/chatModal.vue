<template>
  <Transition name="modal">
    <div v-if="show" class="modal-mask"@click="emit('close')">
      <div class="modal-container" @click.stop>
        <div class="modal-header">
          <slot name="header">default header</slot>
        </div>
        <div class="modal-body">
          <slot name="body">default body</slot>
        </div>

        <div class="modal-footer">
          <slot name="footer">
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
    position: fixed;
    z-index: 1299;
    top: 0;
    right: 0;
    width: 33%;
    height: 98%;
    background-color: rgba(82, 84, 171, 0.4); /* #5254ab; */
    display: flex;
    transition: opacity 0.3s ease;
    opacity: 1;
  }

  .modal-container {
    display: grid;
    justify-content: end;
    width: 99vw;
    height: 92vh;
    margin: auto;
    padding: 10px 10px;
    background: white;
    border-radius: 2px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.33);
    transition: all 0.3s ease;
    overflow: scroll;
    background-color: #e5e5f7;
    opacity: 1;
    background-image:  linear-gradient(30deg, #d9dbf1 12%, transparent 12.5%, transparent 87%, #d9dbf1 87.5%, #d9dbf1), linear-gradient(150deg, #d9dbf1 12%, transparent 12.5%, transparent 87%, #d9dbf1 87.5%, #d9dbf1), linear-gradient(30deg, #d9dbf1 12%, transparent 12.5%, transparent 87%, #d9dbf1 87.5%, #d9dbf1), linear-gradient(150deg, #d9dbf1 12%, transparent 12.5%, transparent 87%, #d9dbf1 87.5%, #d9dbf1), linear-gradient(60deg, #d9dbf177 25%, transparent 25.5%, transparent 75%, #d9dbf177 75%, #d9dbf177), linear-gradient(60deg, #d9dbf177 25%, transparent 25.5%, transparent 75%, #d9dbf177 75%, #d9dbf177);
    background-size: 20px 35px;
    background-position: 0 0, 0 0, 10px 18px, 10px 18px, 0 0, 10px 18px;
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