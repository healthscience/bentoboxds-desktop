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
    <div id="bb-toolbar" v-bind:class="{ active: bboxActive }">Active bar</div>
    <bento-box :bboxid="props.bboxid" :contractid="props.contractid" :bbwidth="bentoboxWidth"></bento-box>
    <button id="bb-remove" @click="removeBboxSpace">remove</button>
  </vue-resizable>
</template>

<script setup>
import VueResizable from 'vue-resizable'
import BentoBox from  '@/components/bentobox/bentoBox.vue' 
import { ref, computed, onMounted } from 'vue'
import { bentoboxStore } from '@/stores/bentoboxStore.js'
import { aiInterfaceStore } from '@/stores/aiInterface.js'
import { mapminiStore } from '@/stores/mapStore.js'

  const storeAI = aiInterfaceStore()
  const storeBentobox = bentoboxStore()
  const storeMmap = mapminiStore()

  const props = defineProps({
    bboxid: String,
    contractid: String
  })

  let bentoboxWidth = '30vw'
  let bboxActive = ref(false)
  let modulesShow = ref(false)

  /* drag drop move resize */
  const tW = 880
  const tH = 440
  const handlers = ref(["r", "rb", "b", "lb", "l", "lt", "t", "rt"])
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
  const dragSelector = ref('#bb-toolbar, .drag-container-2')
  let timerPress = ref(0)


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
    storeBentobox.locationBbox[storeAI.liveBspace.spaceid][props.bboxid] = updateBox
    storeMmap.actionDashBmove(updateBox)
  }

  const eHandler = (data) => {
    // console.log(data)
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

  const removeBboxSpace = () => {
    // remove from spaceList and location
    let currentSpaceBboxes = storeAI.bentoboxList[storeAI.liveBspace.spaceid]
    let updateBblist = []
    for (let bb of currentSpaceBboxes) {
      if (bb.bboxid !== props.bboxid) {
        updateBblist.push(bb)
      }
    }
    storeAI.bentoboxList[storeAI.liveBspace.spaceid] = updateBblist
    // update miniMap of removal
    storeMmap.actionDashBRemove(props.bboxid)
  }

  const expandModules = () => {
    modulesShow.value = !modulesShow.value
  }

  /* computed */
  const spaceLocation = computed(() => {
    return storeBentobox.locationBbox[storeAI.liveBspace.spaceid][props.bboxid]
  })

  const checkEmpty = computed((value) => {
    return typeof value !== "number" ? 0 : value;
  })

  /* data flow work */
    // const dataValues = ref([2, 4, 7])
  /* const dataValues = computed(() => {
    return storeAI.tempNumberData[props.bboxid]
  })

  const dataLabel = computed(() => {
    return storeAI.tempLabelData[props.bboxid]
  }) */

  const chartData = computed(() => {
    return storeAI.visData[props.bboxid]
    /* {
      // labels: dataLabel.value, // [ 'January', 'February', 'March' ],
      // datasets: [ { data: dataValues.value } ]
    } */
   })

     /*
  * predict future
  */
  const predictFuture = () => {
    storeAI.prepareFuture(props.bboxid)
  }

  const futureBox = computed(() => {
    return storeAI.activeFuture[props.bboxid]
  })

  const futuredataValues = computed(() => {
    return storeAI.futureNumberData[props.bboxid]
  })

  const futuredataLabel = computed(() => {
    return storeAI.futureLabelData[props.bboxid]
  })

  const chartfutureData = computed(() => {
    return {
      labels: futuredataLabel.value,
      datasets: [ { data: futuredataValues.value } ]
    }
  })

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

#bb-toolbar {
  display: grid;
  grid-template-columns: 5fr 1fr 1fr 1fr 1fr;
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

  #bb-toolbar {
    display: grid;
    grid-template-columns: 5fr 1fr 1fr 1fr 1fr;
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