<template>
  <div id="bentobox-quants" ref="bentoboxQuants" @mouseup.prevent="EndDrag()" @mousemove.prevent="OnDrag($event)">
    <div id="bentobox-tools">
      <box-tools :bboxid="props.bboxid"></box-tools>
      <div id="bentobox-mini"> <!-- switch on of bentobox quants -->
        <div id="bentobox-row">
          <div id="bentobox-now" class="mini-quant-off" @click="bentoboxQuant('n')"  v-bind:class="{ active: quantSelect['now'] }">
            n
          </div>
          <div id="bentobox-future" class="mini-quant-off"  @click="bentoboxQuant('f')" v-bind:class="{ active: quantSelect['future'] }">
            f
          </div>
        </div>
        <div id="bentobox-row">
          <div id="network-bentobox-now" class="mini-quant-off"  @click="bentoboxQuant('nn')" v-bind:class="{ active: quantSelect['nnow'] }">
            nn
          </div>
          <div id="network-bentobox-future" class="mini-quant-off"  @click="bentoboxQuant('nf')" v-bind:class="{ active: quantSelect['nfuture'] }">
            nf
          </div>
        </div>
      </div>
    </div>
    <div id="box-now" ref="nowBBox" class="bentobox-cell" v-bind:style="{ display: liveBoxNow }">
      <div id="bentobox-network">
        <div id="bentobox-holder" v-if="graphLive">
          <div id="bb-network-graph">Network graph</div>
          <div id="network-bentobox">
              <social-graph></social-graph>
          </div>
        </div>
        <div id="bb-world-map" v-if="mapLive">
          <map-openstreet></map-openstreet>
        </div>
      </div>
      <div id="bento-past" v-if="quantSelect['now']">
        <!--<div id="past-box">past toolbar <button id="full-past-toolbar">Tools</button></div>-->
        <bar-chart v-if="storeBentobox.chartStyle[props.bboxid] === 'bar'" :chartData="chartData"></bar-chart>-
        <line-chart v-if="storeBentobox.chartStyle[props.bboxid] === 'line'" :chartData="chartData"></line-chart>
      </div>
    </div>
    <div id="vertdragbar" @mousedown="StartRightDrag()"  v-bind:style="{ display: liveBoxNow }"></div> <!-- vertical slider -->
    <div id="box-future" ref="futureBBox" class="bentobox-cell"  v-bind:style="{ display: liveBoxFuture }">
      <div id="bentobox-network">
        <div id="bentobox-holder" v-if="graphLive">
          <div id="bb-network-graph">Network graph</div>
          <div id="network-bentobox">
              <social-graph></social-graph>
          </div>
        </div>
        <div id="bb-world-map" v-if="mapLive">
          <map-openstreet></map-openstreet>
        </div>
      </div>
      <div id="bento-future" v-if="quantSelect['future']">
        <select class="select-model-save" id="bbox-model-save" v-model="modelFuture" @change="selectPredModel()">
            <option selected="" v-for="fm in computeList" :value="fm.key">
              {{ fm.value.computational.name }}
            </option>
          </select>
          <button id="full-future-toolbar" @click="predictFuture()">Predict</button>
        <!--<button id="full-future-toolbar" @click="predictFuture()">Predict</button>-->
        <!-- <div id="future-box">future toolbar <button id="full-future-toolbar">full</button></div>-->
        <bar-chart v-if="storeBentobox.chartStyle[props.bboxid] === 'bar'" :chartData="chartfutureData" ></bar-chart>
        <line-chart v-if="storeBentobox.chartStyle[props.bboxid] === 'line'" :chartData="chartfutureData"></line-chart>
      </div>
    </div>
    <div id="expand" @mousedown="StartExpandDrag()"></div>
  </div>
  <!--network bentoboxes-->
  <div id="network-bentobox-quants" ref="networkbentoboxQuants" @mouseup.prevent="netEndDrag()" @mousemove.prevent="netOnDrag($event)">
    <div id="networkbox-now" ref="nnowBBox" class="bentobox-cell"  v-bind:style="{ display: liveBoxNetNow }">
      <div id="bentobox-network">
        <div id="bentobox-holder" v-if="graphLive">
          <div id="bb-network-graph">Network graph</div>
          <div id="network-bentobox">
              <social-graph></social-graph>
          </div>
        </div>
        <div id="bb-world-map" v-if="mapLive">
          <map-openstreet></map-openstreet>
        </div>
      </div>
      <div id="bento-past" v-if="quantSelect['nnow']">
        <!--<div id="past-box">past toolbar <button id="full-past-toolbar">Tools</button></div>-->
        <bar-chart v-if="storeBentobox.chartStyle[props.bboxid] === 'bar'" :chartData="chartData"></bar-chart>-
        <line-chart v-if="storeBentobox.chartStyle[props.bboxid] === 'line'" :chartData="chartData"></line-chart>
      </div>
    </div>
    <div id="vertdragbar" @mousedown="StartNetworkRightDrag()"></div> <!-- vertical slider -->
    <div id="networkbox-future" ref="nfutureBBox" class="bentobox-cell"  v-bind:style="{ display: liveBoxNetFuture }">
      <div id="bentobox-network">
        <div id="bentobox-holder" v-if="graphLive">
          <div id="bb-network-graph">Network graph</div>
          <div id="network-bentobox">
              <social-graph></social-graph>
          </div>
        </div>
        <div id="bb-world-map" v-if="mapLive">
          <map-openstreet></map-openstreet>
        </div>
      </div>
      <div id="bento-future" v-if="quantSelect['nfuture']">
        <select class="select-model-save" id="bbox-model-save" v-model="modelFuture" @change="selectPredModel()">
            <option selected="" v-for="fm in computeList" :value="fm.key">
              {{ fm.value.computational.name }}
            </option>
          </select>
          <button id="full-future-toolbar" @click="predictFuture()">Predict</button>
        <!--<div id="future-box">future toolbar <button id="full-future-toolbar">full</button></div>-->
        <bar-chart v-if="storeBentobox.chartStyle[props.bboxid] === 'bar'" :chartData="chartfutureData" ></bar-chart>
        <line-chart v-if="storeBentobox.chartStyle[props.bboxid] === 'line'" :chartData="chartfutureData"></line-chart>
      </div>
    </div>
    <div id="network-expand" @mousedown="StartNetworkExpandDrag()"></div>
  </div>
  <div id="bentobox-modules">
    <div id="bb-expand-size" @click="expandModules">modules v</div>
    <modules-list v-if="modulesShow" :bboxid="props.bboxid"></modules-list>
  </div>
</template>

<script setup>
import { now, useToString } from '@vueuse/core'
import BoxTools from '@/components/bentobox/tools/boxTools.vue'
import barChart from '@/components/visualisation/charts/barChart.vue'
import lineChart from '@/components/visualisation/charts/lineChart.vue'
import ModulesList from '@/components/bentobox/modules/modulesList.vue'
import SocialGraph from '@/components/bentobox/graph/socialGraph.vue'
import MapOpenstreet from '@/components/bentobox/graph/openStreetMap.vue'
import { ref, computed, onMounted, nextTick } from 'vue'
import { bentoboxStore } from '@/stores/bentoboxStore.js'
import { aiInterfaceStore } from '@/stores/aiInterface.js'
import { libraryStore } from '@/stores/libraryStore.js'

  const storeAI = aiInterfaceStore()
  const storeBentobox = bentoboxStore()
  const storeLibrary = libraryStore()
  
  const props = defineProps({
    bboxid: String,
    bbwidth: String
  })

  let bentoboxWidth = props.bbwidth
  let bentoboxQuants = ref(null)
  let networkbentoboxQuants = ref(null)
  let nowBBox = ref(null)
  let futureBBox = ref(null)
  let nnowBBox = ref(null)
  let nfutureBBox = ref(null)
  let modulesShow = ref(false)
  let modelFuture = ref('')
  let quantSelect = ref({ now: true, future: false, nnow: false, nfuture: false })
  let isRightDragging = ref(false)
  let isNetworkRightDragging = ref(false)
  let isExpandDragging = ref(false)
  let isNetworkExpandDragging = ref(false)
  let liveBoxNow = ref('block')
  let liveBoxFuture = ref('block')
  let liveBoxNetNow = ref('block')
  let liveBoxNetFuture = ref('block')

  let event = ref('')
  let timerPress = ref(0)

  /* methods */
  const bentoboxQuant = (quant) => {
    if (quant === 'n') {
      quantSelect.value.now = !quantSelect.value.now
      if (quantSelect.value.now !== true) {
        liveBoxNow.value = 'none'
      } else {
        liveBoxNow.value = 'block'
      }
    } else if (quant === 'f') {
      quantSelect.value.future = !quantSelect.value.future
      if (quantSelect.value.future !== true) {
      liveBoxFuture.value = 'none'
      } else {
        liveBoxFuture.value = 'block'
      }
    } else if (quant === 'nn') {
      quantSelect.value.nnow = !quantSelect.value.nnow
      if (quantSelect.value.nnow !== true) {
      liveBoxNetNow.value = 'none'
      } else {
        liveBoxNetNow.value = 'block'
      }
    } else if (quant === 'nf') {
      quantSelect.value.nfuture = !quantSelect.value.nfuture
      if (quantSelect.value.nfuture !== true) {
      liveBoxNetFuture.value = 'none'
      } else {
        liveBoxNetFuture.value = 'block'
      }
    }
  }

  const SetCursor = (cursor) => {
    let page = bentoboxQuants.value
    page.style.cursor = cursor
  }

  const StartRightDrag = () => {
    isRightDragging.value = true
    SetCursor("ew-resize")
  }

  const StartNetworkRightDrag = () => {
    isNetworkRightDragging.value = true
    SetCursor("ew-resize")
  }

  const StartExpandDrag = () => {
    isExpandDragging.value = true
    SetCursor("ns-resize")
  }

  const StartNetworkExpandDrag = () => {
    isNetworkExpandDragging.value = true
    SetCursor("ns-resize")
  }

  const EndDrag = () => {
    isRightDragging.value = false
    isExpandDragging.value = false
    isNetworkRightDragging.value = false
    isNetworkExpandDragging.value = false
    SetCursor("default")
  }

  const netEndDrag = () => {
    isRightDragging.value = false
    isExpandDragging.value = false
    isNetworkRightDragging.value = false
    isNetworkExpandDragging.value = false
    SetCursor("default")
  }

  const OnDrag = async (event) => {
    if(isExpandDragging.value) {
      let page = bentoboxQuants.value
      let leftcol = nowBBox.value
      let rightcol = futureBBox.value

      let leftColHeight = isExpandDragging ? event.clientY : event.clientY
      let rightColHeight = isExpandDragging ? event.clientY : event.clientY
      let dragbarHeight = 6
      
      let rows = [
        '20',
        leftColHeight,
        '30',
      ]
      
      let updateString = ''
      let newColDefn = rows.map(c => {
        let pv = useToString(c)
        let newPv = (pv.value + "px")
        updateString = updateString + ' ' + newPv
        return updateString
      })
      page.style.gridTemplateRows = newColDefn.pop()
      // chart.canvas.parentNode.style.height = leftColHeight
      event.preventDefault()
    }

    if(isRightDragging.value) {
      let page = bentoboxQuants.value
      let leftcol = nowBBox.value
      let rightcol = futureBBox.value	

      let leftColWidth = isRightDragging ? event.clientX : leftcol.clientWidth
      let rightColWidth = isRightDragging ? page.clientWidth - (6) - leftColWidth : 500
      
      let dragbarWidth = 6
      
      let cols = [
        leftColWidth,
        dragbarWidth,
        rightColWidth // calc of left size for grid
      ]

      let updateString = ''
      let newColDefn = cols.map(c => {
        let pv = useToString(c)
        let newPv = (pv.value + "px")
        updateString = updateString + ' ' + newPv
        return updateString
      })
      page.style.gridTemplateColumns = newColDefn.pop()
      // chart.canvas.parentNode.style.width = leftColWidth
      event.preventDefault()
    }
  }

  const netOnDrag = async (event) => {
    if (isNetworkExpandDragging.value) {
      let page = networkbentoboxQuants.value
      let leftcol = nnowBBox.value
      let rightcol = nfutureBBox.value

      let leftColHeight = isNetworkExpandDragging ? event.clientY : event.clientY
      let rightColHeight = isNetworkExpandDragging ? event.clientY : event.clientY
      let dragbarHeight = 6
      
      let rows = [
        leftColHeight,
        '30',
      ]
      
      let updateString = ''
      let newColDefn = rows.map(c => {
        let pv = useToString(c)
        let newPv = (pv.value + "px")
        updateString = updateString + ' ' + newPv
        return updateString
      })
      page.style.gridTemplateRows = newColDefn.pop()
      // chart.canvas.parentNode.style.height = leftColHeight
      event.preventDefault()
    }

    if(isNetworkRightDragging.value) {
      let page = networkbentoboxQuants.value
      let leftcol = nnowBBox.value
      let rightcol = nfutureBBox.value	

      let leftColWidth = isNetworkRightDragging ? event.clientX : leftcol.clientWidth
      let rightColWidth = isNetworkRightDragging ? page.clientWidth - (6) - leftColWidth : 500
      
      let dragbarWidth = 6
      
      let cols = [
        leftColWidth,
        dragbarWidth,
        rightColWidth // calc of left size for grid
      ]

      let updateString = ''
      let newColDefn = cols.map(c => {
        let pv = useToString(c)
        let newPv = (pv.value + "px")
        updateString = updateString + ' ' + newPv
        return updateString
      })
      page.style.gridTemplateColumns = newColDefn.pop()
      // chart.canvas.parentNode.style.width = leftColWidth
      event.preventDefault()
    }
  }

  const selectPredModel = (model) => {
    console.log(model)
    console.log(modelFuture)
  }

  /* computed */
  const mapLive = computed(() => {
    return storeBentobox.geoMap
  })

  const graphLive = computed(() => {
    return storeBentobox.networkGraph
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

  const computeList = computed(() => {
    return storeLibrary.publicLibrary.referenceContracts.compute
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


@media (min-width: 1024px) {

  #bentobox-quants {
    display: grid;
    grid-template-areas:
    'bentobox-tools bentobox-tools bentobox-tools'
    'boxnow vertdragbar boxfuture'
    'expand expand expand';
    grid-template-rows: 1fr 300px 30px;
    grid-template-columns: 4fr 6px 1fr;
    height: auto;
    width: var(--bentoboxWidth);
    border: 2px solid rgb(141, 145, 226);
  }

  #network-bentobox-quants {
    display: grid;
    grid-template-areas:
    'netboxnow vertdragbar netboxfuture'
    'networkexpand networkexpand networkexpand';
    grid-template-rows: 9fr 6px;
    grid-template-columns: 4fr 6px 1fr;
    height: auto;
    width: var(--bentoboxWidth);
    border: 2px solid rgb(141, 145, 226);
  }

  #bentobox-tools {
    background-color: rgb(224, 227, 243);
    grid-area: bentobox-tools;
  }

  #bentobox-mini {
    display: grid;
    position: absolute;
    top: 0px;
    left: 200;
    background-color: blue;
    border: 1px solid darkblue;
    width: 64px;
    z-index: 12;
  }

  #bentobox-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
  }

  #bentobox-now {
    width: 31px;
    color: antiquewhite;
  }

  #network-bentobox-now {
    width: 31px;
    color: antiquewhite;
  }

  #bentobox-future {
    width: 31px;
    color: antiquewhite;
  }

  #network-bentobox-future {
    width: 31px;
    color: antiquewhite;    
  }

  .mini-quant-off {
    background-color: rgb(141, 145, 226);
    border: 1px solid darkblue;
    text-align: center;
  }

  .active {
    background-color: darkblue;
    border: 1px solid lightblue;
  }

  #box-now {
    background-color: rgb(245, 247, 245);
    grid-area: boxnow;
    overflow: hidden;
    min-height: 30vh;
  }

  #vertdragbar {
    background-color: darkblue;
    grid-area: vertdragbar;
    cursor: ew-resize;
  }

  #box-future {
    background-color: rgb(241, 238, 231);
    grid-area: boxfuture;
    overflow: hidden;
    min-height: 30vh;
  }

  #expand {
    display: block;
    background-color: darkblue;
    grid-area: expand;
    cursor: ns-resize;
    height: 16px;
  }

  #network-expand {
    background-color: darkblue;
    grid-area: networkexpand;
    cursor: ns-resize;
    height: 6px;
  }


  #networkbox-now {
    background-color: rgb(245, 247, 245);
    grid-area: netboxnow;
    overflow: hidden;
    min-height: 30vh;
  }

  #networkbox-future {
    background-color: rgb(241, 238, 231);
    grid-area: netboxfuture;
    overflow: hidden;
    min-height: 30vh;
  }

  #bento-past {
    position: relative;
    height: 80%;
    min-width: 20vw;
    margin: 2em;
    border: 0px solid orange;
  }

  #bento-future {
    position: relative;
    height: 80%;
    min-width: 20vw;
    margin: 2em;
    border: 0px solid orange;
  }
  /* modules css */
  #bentobox-modules {
    display: grid;
    grid-template-columns: 1fr;
    grid-area: bbmodules;
    cursor: default;
  }

  .bentobox-cell {
    display: grid;
  }

  #bb-toolbar {
    display: grid;
    grid-template-columns: 1fr;
    height: 400px;
    width: 100%;
    background-color:rgb(141, 145, 226);
  }

  /* network graph and social map */
  #bentobox-network {
    display: grid;
    grid-template-columns: 1fr;
    border: 0px solid red;
    height: 1vh;
  }

  #bb-network-graph {
    display: grid;
    grid-template-columns: 1fr;
  }

  #bb-world-map {
   display: grid;
   grid-template-columns: 1fr;
  }

  #bentobox-holder {
    position: relative;
    border: 1px solid blue;
    display: grid;
    grid-template-columns: 1fr;
    background-color: beige;
    height: 10vh;
  }

  #network-bentobox {
    border: 1px solid grey;
    display: grid;
    grid-template-columns: 1fr 1fr;
    margin: 1em;
  }

  #past-box, #future-box {
    position: relative;
  }
  
  #past-box {
    background-color: rgb(236, 236, 243);
  }

  #future-box {
    background-color:#fff4f4;
  }

  #bb-expand-size {
    position: relative;
    width: 100%;
    background-color: rgb(141, 145, 226);
  }

}

</style>