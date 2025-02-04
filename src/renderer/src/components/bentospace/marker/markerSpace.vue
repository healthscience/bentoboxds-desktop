<template>
  <vue-resizable
    class="resizable"
    ref="resizableComponent"
    :dragSelector="dragSelector"
    :active="handlers"
    :fit-parent="fit"
    :max-width="spaceLocation.tW | checkEmpty"
    :max-height="spaceLocation.tH | checkEmpty"
    :min-width="minW | checkEmpty"
    :min-height="minH | checkEmpty"
    :width="spaceLocation.width"
    :height="spaceLocation.height"
    :left="spaceLocation.left"
    :top="spaceLocation.top"
    @resize:move="eHandler"
    @resize:start="eHandler"
    @resize:end="eHandler"
    @drag:move="eHandler"
    @drag:start="eHandlerTimerStart"
    @drag:end="eHandlerTimerStop"
  >
    <!-- bentobox -->
    <div id="marker-holder">
      <div id="mkr-toolbar" v-bind:class="{ active: bboxActive }">-</div>
      <marker-box :bstag="props.bstag" :bsresearch="props.bsmedia"></marker-box>
    </div>
    <button id="bm-remove" @click="removeMboxSpace">remove</button>
  </vue-resizable>
</template>

<script setup>
import VueResizable from 'vue-resizable'
import MarkerBox from '@/components/bentospace/marker/markerViewer.vue'
import { ref, computed } from 'vue'
import { libraryStore } from '@/stores/libraryStore.js'
import { bentoboxStore } from '@/stores/bentoboxStore.js'
import { aiInterfaceStore } from '@/stores/aiInterface.js'
import { mapminiStore } from '@/stores/mapStore.js'

  const storeLibrary = libraryStore()
  const storeAI = aiInterfaceStore()
  const storeBentobox = bentoboxStore()
  const storeMmap = mapminiStore()

  const props = defineProps({
    bstag: String,
    bsmedia: String
  })

  let bboxActive = ref(false)
  let modulesShow = ref(false)

  /* drag drop move resize */
  const tW = 880
  const tH = 440
  const handlers = ["r", "rb", "b", "lb", "l", "lt", "t", "rt"]
  // let left = ref(`calc(2% - ${tW / 2}px)`)
  // let top = ref(`calc(8% - ${tH / 2}px)`)
  // let height = ref('fit-content')
  // let width = ref('fit-content')
  let maxW = ref('100%')
  let maxH = ref('100%')
  let minW = ref('20vw')
  let minH = ref('20vh')
  let fit = ref(false)
  let event = ref('')
  const dragSelector = ref('#marker-bar, .drag-container-2')
  let timerPress = ref(0)


  /* computed */
  const spaceLocation = computed(() => {
    if (storeBentobox.locationMarkerbox[storeAI.liveBspace.spaceid][props.bsmedia] !== undefined) {
      return storeBentobox.locationMarkerbox[storeAI.liveBspace.spaceid][props.bsmedia]
    } else {
      return {}
    }
  })

  const checkEmpty = computed((value) => {
    return typeof value !== "number" ? 0 : value;
  })

  /* methods */
  const updateBoxLocation = (location) => {
    /* drag drop move resize */
    let updateBox = {}
    updateBox.tW = '100%' // 880
    updateBox.tH = '100%' // 480
    updateBox.handlers = ref(["r", "rb", "b", "lb", "l", "lt", "t", "rt"])
    updateBox.left = location.left // ref(`calc(2% - ${tW / 2}px)`) // set posotion on space
    updateBox.top = location.top // ref(`calc(8% - ${tH / 2}px)`)  // set position on space
    updateBox.height = location.height
    updateBox.width = location.width
    updateBox.maxW = maxW.value
    updateBox.maxH = maxH.value
    updateBox.minW = minW.value
    updateBox.minH = minH.value
    updateBox.fit = fit.value
    updateBox.event = ''
    updateBox.dragSelector = dragSelector.value
    storeBentobox.locationMarkerbox[storeAI.liveBspace.spaceid][props.bsmedia] = updateBox
    storeMmap.actionDashBmove(updateBox)
  }

  const eHandler = (data) => {
    /* width = data.width;
    height = data.height;
    left = data.left;
    top = data.top;
    event = data.eventName; */
    event.value = data.eventName
    updateBoxLocation(data)
  }

  const eHandlerStart = (data) => {
    // console.log('ehand start')
    // updateBoxLocation(data)
  }

  const longHoldCheck = () => {
    const nowTime = new Date()
    let timeDiff = nowTime - timerPress
    if (timeDiff < 2000) {
      setTimeout(longHoldCheck, 1)
    } else {
      storeAI.longPress = true
    }
  }

  const eHandlerTimerStart = (data) => {
    bboxActive.value = true
    // console.log(data)
    // set timer start
    //timerPress = new Date()
    // console.log(timerPress)
    // setTimeout(longHoldCheck, 1)
  }

  const eHandlerTimerStop = (data) => {
    // set timer start
    bboxActive.value = false
    // timerPress = new Date()
    // if (startTime > 20000) {
    //   timeLong = true
    // }
  }

  const removeMboxSpace = () => {
    // remove from spaceList and location
    let currentSpaceMboxes = storeBentobox.markerMedia[storeAI.liveBspace.spaceid]
    let updateMblist = []
    for (let bm of currentSpaceMboxes) {
      if (bm.key !== props.bsmedia) {
        updateMblist.push(bm)
      }
    }
    storeBentobox.markerMedia[storeAI.liveBspace.spaceid] = updateMblist
    // update miniMap of removal
    // storeMmap.actionDashBRemove(props.bboxid)
    // delete from store
    let delMessage = {}
    delMessage.type = 'library'
    delMessage.action = 'marker'
    delMessage.reftype = 'marker'
    delMessage.task = 'DEL'
    delMessage.privacy = 'public'
    delMessage.data = { id: props.bsmedia }
    storeLibrary.sendMessage(delMessage)    
  }

  const expandModules = () => {
    modulesShow.value = !modulesShow.value
  }


</script>

<style scoped>
.resizable {
  background-position: top left;
  width: 150px;
  height: 150px;
  padding: 0;
  border: 4px solid red; /*rgb(106, 114, 224);*/
  font-weight: normal;
  color: #0d0d0d;
  position: relative;
}

.drag-container-1,
.drag-container-2 {
  width: 100%;
  height: 40px;
  background: rgb(141, 145, 226);
  color: white;
  text-align: center;
  cursor: pointer;
  z-index: 9;
}

#mkr-toolbar {
  display: grid;
  grid-template-columns: 1fr;
  justify-items: center;
  width: 100%;
}

#bb-network-graph {
  display: none;
}

#bb-world-map {
  display: none;
}

#bentobox-holder {
  position: relative;
  border: 1px solid rgb(128, 128, 128);
}

.active {
  background-color: green;
}

@media (min-width: 1024px) {

  .resizable {
    background-position: top left;
    min-width: 150px;
    min-height: 150px;
    height: auto;
    padding: 0;
    border: 4px solid rgb(106, 114, 224);
    font-weight: normal;
    color: #0d0d0d;
    position: relative;
  }

  .drag-container-1,
  .drag-container-2 {
    width: 100%;
    height: 40px;
    background: rgb(141, 145, 226);
    color: white;
    text-align: center;
    cursor: pointer;
    z-index: 9;
  }

  #bm-remove {
    position: relative;
    display: grid;
    grid-template-columns: 1fr;
    height:'100px';
    border: 2px solid red;
  }

  #mkr-toolbar {
    display: grid;
    grid-template-columns: 1fr;
    justify-items: center;
    width: 100%;
    /* background-color:rgb(141, 145, 226); */
  }

  #bb-network-graph {
    display: none;
  }

  #bb-world-map {
   display: none;
  }

  #bentobox-holder {
    position: relative;
    border: 1px solid blue;
    display: grid;
    grid-template-columns: 1fr;
    background-color: beige;
    /* min-height: inherit;
    min-width: inherit; */
  }

  #beebee-tooblar.active {
    display: grid;
    background-color: rgb(105, 216, 105);
    z-index: 10;
  }

}

</style>
