<template>
  <div class="drag-container-1">
    <div id="bb-toolbar">
      <div class="bb-bar-main">a bentobox</div>
      <div class="bb-bar-main"><button @click="clickExpandBentobox(props.bboxid)">expand</button></div>
      <div class="bb-bar-main"><button @click="clickAddbentoSpace(props.bboxid)">+ space</button></div>
      <!--<div class="bb-bar-main"><button id="network-vis">social</button></div>
      <div class="bb-bar-main"><button id="network-map">map</button></div>
      <div class="bb-bar-main"><button id="bb-copy">copy</button></div>-->
    </div> 
  </div>
  <div id="bentobox-cell">
    <div id="bb-network-graph">Network</div>
    <div id="bb-world-map">map</div>
    <div id="bentobox-holder">
      <div id="network-bentobox">
        network bentobox
      </div>
      <div id="peer-bentobox">
        <div id="bento-past">
          <div id="past-box"> {{ futureBox }}
            <button id="full-past-toolbar">tools</button>
            <button id="full-future-toolbar" @click="predictFuture()">future</button>
          </div>
          <div id="past-vis">
            <bar-chart v-if="bbliveStore.chartStyle[props.bboxid] === 'bar'" :chartData="chartData"></bar-chart>
             <line-chart v-if="bbliveStore.chartStyle[props.bboxid] === 'line'" :chartData="chartData"></line-chart>
           </div>
        </div>
        <div id="bento-future" class="future-show" :class="{ active: futureBox }">
          <div id="future-box"><button id="full-future-toolbar">full</button></div>
          <bar-chart v-if="bbliveStore.chartStyle[props.bboxid] === 'bar'" :chartData="chartfutureData" ></bar-chart>
          <line-chart v-if="bbliveStore.chartStyle[props.bboxid] === 'line'" :chartData="chartfutureData"></line-chart>
        </div>
      </div>
    </div>
  </div>
  <bentobox-focus v-if="storeAI.expandBentobox[props.bboxid] === true" :bboxid="props.bboxid"></bentobox-focus>
</template>

<script setup>
import BentoboxFocus from '@/components/bentobox/bentoboxFocus.vue'
import barChart from '@/components/visualisation/charts/barChart.vue'
import lineChart from '@/components/visualisation/charts/lineChart.vue'
import { ref, computed, onMounted } from 'vue'
import { bentoboxStore } from '@/stores/bentoboxStore.js'
import { aiInterfaceStore } from '@/stores/aiInterface.js'

  const storeAI = aiInterfaceStore()
  const bbliveStore = bentoboxStore()
  const futureStatus = ref(true)

  const props = defineProps({
    bboxid: String
  })

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
    // set timer start
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

   const clickExpandBentobox = (boxid) => {
    storeAI.expandBentobox[boxid] = true
   }

   const clickAddbentoSpace = (boxid) => {
    storeAI.bentoboxList['space1'].push(boxid)
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
    return {
      labels: dataLabel.value, // [ 'January', 'February', 'March' ],
      datasets: [ { data: dataValues.value } ]
    }
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

.drag-container-1 {
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
  grid-template-columns: 5fr 1fr 1fr 1fr;
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
  display: grid;
  grid-template-columns: 1fr;
  min-width: 10vw;
  min-height: 10vh;
}

#past-box, #future-box {
  position: relative;
}

#past-vis {
  position: relative;
  min-width: 10vw;
  min-height: 10vh;
}

#bento-future {
  position: relative;
  border:1px dashed orange;
  min-width: 10vw;
  min-height: 10vh;
}

.future-show {
  display: none;
}


.future-show.active {
  display: block;
}

#bb-expand-size {
  display: block;
  width: 100%;
  background-color:  rgb(141, 145, 226);
}

@media (min-width: 1024px) {

  .drag-container-1 {
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
    grid-template-columns: 5fr 1fr 1fr 1fr;
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
    grid-template-columns: 1fr;
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
  }
  
  #past-box {
    background-color: rgb(236, 236, 243);
  }

  .future-show {
    display: none;
  }

  .future-show.active {
    display: block;
  }

  #future-box {
    background-color:#fff4f4;
  }

  #bento-past {
    display: grid;
    grid-template-columns: 1fr;
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