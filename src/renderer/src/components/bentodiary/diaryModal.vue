<template>
  <Transition name="modal">
    <div v-if="show" class="modal-mask">
      <div class="modal-container">
        <div class="modal-header">
          <slot name="header">default header</slot>
        </div>
        <div class="modal-body">
          <div id="time-travel">
            <button @click="clockStyle('heli')">Heli</button>
            <button @click="clockStyle('test')">Test</button>
            <button @click="clockStyle('old')">Old</button>
          </div>
          <heli-clock v-if="clockLive === 'heli'"></heli-clock>
          <heli-test v-if="clockLive === 'heli'"></heli-test>
          <swim-case></swim-case>
          <!--<div id="old-world-calendar">
            <div id="ecdiary">Old World Calendar {{ smartDiary }}</div>
            <slot name="body">
              
              default body
            </slot>
          </div>-->
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
import heliClock from '@/components/bentodiary/heliStart.vue'
import heliTest from '@/components/bentodiary/projectionHeli.vue'
// import DigitalCalendar from '@/components/bentodiary/digitalSolarCalendar.vue'
import SwimCase from '@/components/bentodiary/peercase/SwimEmulator.vue'
import { diaryStore } from '@/stores/diaryStore.js'

  const storeDiary = diaryStore()  

  const props = defineProps({
    show: Boolean
  })

  let ec = ref({})
  let clockLive = ref('heli')

  onMounted(() => {
    storeDiary.createEvents()
  })

  onUpdated(() => {
      let smartCal = {} // document.getElementById('ecdiary')
      // ec = new EventCalendar(smartCal, eventDiary.value)
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
  z-index: 25;
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
  z-index: 25;
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