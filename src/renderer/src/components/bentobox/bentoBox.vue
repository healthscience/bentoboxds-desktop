<template>
  <box-tools :bboxid="props.bboxid"></box-tools>
  <!--<div class="drag-container-1">
    <div id="bb-toolbar">
      <div class="bb-bar-main">a bentobox active</div>
      <bb-tools v-if="boxToolsShow" :bboxid="props.bboxid"></bb-tools>
      <div class="bb-bar-main"><button id="network-vis">social</button></div>
      <div class="bb-bar-main"><button id="network-map">map</button></div>
      <div class="bb-bar-main"><button id="bb-copy">copy</button></div>
    </div>
  </div> -->
  <div id="bentobox-cell">
    <div id="bb-network-graph">Network</div>
    <div id="bb-world-map">map</div>
    <div id="bentobox-holder">
      <div id="network-bentobox">
        network bentobox
      </div>
      <div id="peer-bentobox">
        <div id="bento-past">
          <!--<div id="past-box">past toolbar <button id="full-past-toolbar">Tools</button></div>-->
          <bar-chart v-if="storeBentobox.chartStyle[props.bboxid] === 'bar'" :chartData="chartData"></bar-chart>
          <line-chart v-if="storeBentobox.chartStyle[props.bboxid] === 'line'" :chartData="chartData"></line-chart>
        </div>
        <div id="bento-future">future
          <button id="full-future-toolbar" @click="predictFuture()">Predict</button>
          <!--<div id="future-box">future toolbar <button id="full-future-toolbar">full</button></div>-->
          <bar-chart v-if="storeBentobox.chartStyle[props.bboxid] === 'bar'" :chartData="chartfutureData" ></bar-chart>
          <line-chart v-if="storeBentobox.chartStyle[props.bboxid] === 'line'" :chartData="chartfutureData"></line-chart>
        </div>
      </div>
    </div>
  </div>
  <div id="bb-expand-size" @click="expandModules">modules v</div>
    <modules-list v-if="modulesShow" :bboxid="props.bboxid"></modules-list>
</template>

<script setup>
import BoxTools from '@/components/bentobox/tools/boxTools.vue'
import barChart from '@/components/visualisation/charts/barChart.vue'
import lineChart from '@/components/visualisation/charts/lineChart.vue'
import ModulesList from '@/components/bentobox/modules/modulesList.vue'
import { ref, computed, onMounted } from 'vue'
import { bentoboxStore } from '@/stores/bentoboxStore.js'
import { aiInterfaceStore } from '@/stores/aiInterface.js'

  const storeAI = aiInterfaceStore()
  const storeBentobox = bentoboxStore()
  
  let modulesShow = ref(false)

  const props = defineProps({
    bboxid: String
  })

  /* drag drop move resize */
  const tW = 440
  const tH = 440
  const handlers = ref(["r", "rb", "b", "lb", "l", "lt", "t", "rt"])
  let left = ref(`calc(2% - ${tW / 2}px)`)
  let top = ref(`calc(8% - ${tH / 2}px)`)
  let height = ref('fit-content')
  let width = ref('fit-content')
  let maxW = ref('100%')
  let maxH = ref('100%')
  let minW = ref('20vw')
  let minH = ref('20vh')
  let fit = ref(false)
  let event = ref('')
  const dragSelector = ref('.drag-container-1, .drag-container-2')
  let timerPress = ref(0)

  const eHandler = (data) => {
    width = data.width;
    height = data.height;
    left = data.left;
    top = data.top;
    event = data.eventName;
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
    timerPress = new Date()
    setTimeout(longHoldCheck, 1)
   }

   const eHandlerTimerStop = (data) => {
    // set timer start
    timerPress = new Date()
    if (startTime > 20000) {
      timeLong = true
    }
   }

  const checkEmpty = computed((value) => {
    return typeof value !== "number" ? 0 : value;
  })

  /* data flow work */
    // const dataValues = ref([2, 4, 7])
    const dataValues = computed(() => {
    return storeAI.tempNumberData[props.bboxid]
  })

  const dataLabel = computed(() => {
    return storeAI.tempLabelData[props.bboxid]
  })

   const chartData = computed(() => {
    return storeAI.visData[props.bboxid]
    /* {
      // labels: dataLabel.value, // [ 'January', 'February', 'March' ],
      // datasets: [ { data: dataValues.value } ]
    } */
   })

   const boxToolsShow = computed(() => {
    return storeBentobox.boxtoolsShow[props.bboxid]
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
  border: 4px solid #a6ff00;
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

#bentobox-cell {
  display: block;
  border: 0px solid grey;
  z-index: 9;
}

#bb-toolbar {
  display: grid;
  grid-template-columns: 1fr;
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

#peer-bentobox {
  position: relative;
  border: 1px solid grey;
  display: grid;
  grid-template-columns: 1fr;
  margin: 1em;
}

#bento-past {
  position: relative;
  border: 2px dashed blue;
  min-width: 10vw;
  min-height: 10vh;
}

#bento-future {
  position: relative;
  border:1px dashed orange;
  min-width: 10vw;
  min-height: 10vh;
}


#bb-expand-size {
  display: block;
  width: 100%;
  background-color:  rgb(141, 145, 226);
}

@media (min-width: 1024px) {

  .resizable {
    background-position: top left;
    width: 150px;
    height: 150px;
    padding: 0;
    border: 4px solid #a6ff00;
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

  #bentobox-cell {
    display: block;
    min-height: inherit;
    min-width: inherit;
    z-index: 9;
  }

  #bb-toolbar {
    display: grid;
    grid-template-columns: 1fr;
    height: 400px;
    width: 100%;
    background-color:rgb(141, 145, 226);
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

  #peer-bentobox {
    position: relative;
    border: 1px solid grey;
    display: grid;
    grid-template-columns: 1fr 1fr;
    margin: 1em;
  }

  #network-bentobox {
    border: 1px solid grey;
    display: none;
    grid-template-columns: 1fr 1fr;
    margin: 1em;
  }

  #past-box, #future-box {
    position: relative;
    border:1px dashed blue;
  }
  
  #past-box {
    background-color: rgb(236, 236, 243);
  }

  #future-box {
    background-color:#fff4f4;
  }

  #bento-past {
    position: relative;
    border:1px dashed blue;
    height: auto;
    width: auto;
  }

  #bento-future {
    position: relative;
    border: 2px dashed orange;
    height: auto;
    width: auto;
  }

  #bb-expand-size {
    position: relative;
    width: 100%;
    height: 40px;
    background-color: rgb(141, 145, 226);
  }

}


</style>