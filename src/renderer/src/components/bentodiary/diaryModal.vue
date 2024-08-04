<template>
  <Transition name="modal">
    <div v-if="show" class="modal-mask">
      <div class="modal-container">
        <div class="modal-header">
          <slot name="header">default header</slot>
        </div>
        <div class="modal-body">
          <div id="ecdiary">Diary Please {{ smartDiary }}</div>
          <slot name="body">
            
            default body
          </slot>
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
import { ref, nextTick, computed, onMounted, onUpdated } from 'vue'
import { diaryStore } from '@/stores/diaryStore.js'

  const storeDiary = diaryStore()  

  const props = defineProps({
    show: Boolean
  })

  let ec = ref({})

  onMounted(() => {
    storeDiary.createEvents()
  })

  onUpdated(() => {
      let smartCal = document.getElementById('ecdiary')
      ec = new EventCalendar(smartCal, eventDiary.value)
  })

  /* computed */
  const eventDiary = computed(() => {
    return storeDiary.eventList
  })

  const smartDiary = computed(() => {
    return storeDiary.diarySmart
  })

</script>

<style scoped>
.modal-mask {
  position: fixed;
  z-index: 9;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  transition: opacity 0.3s ease;
  opacity: 1;
}

.modal-container {
  z-index: 10;
  width: 92vw;
  height: 92vh;
  margin: auto;
  padding: 20px 30px;
  background: white;
  border-radius: 2px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.33);
  transition: all 0.3s ease;
  overflow: scroll;
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