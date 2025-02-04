<template>
  <div class="box-tools">
    <div id="bb-toolbar">
      <div class="bb-bar-main">a bentobox</div>
      <div class="bb-bar-main">
        <button @click="besearchCycle(props.bboxid)">
          besearch
        </button>
        <div id="besearch-cycle" v-if="besearchSelect">
          <select class="select-cycle-save" id="besearch-options-save" v-model="besearchSave" @change="selectBesearchCycle()">
            <option selected="" v-for="bsc in besearchList" :value="bsc.key">
              {{ bsc.name }}
            </option>
          </select>
        </div>
      </div>
      <div class="bb-bar-main">
        <button @click="clickSummaryLib(props.bboxid)" v-bind:class="{ active: libSum }">
          Lib
        </button>
      </div>
      <div class="bb-bar-main">
        <button class="space-button" @click="clickAddbentoSpace(props.bboxid)">
          + space
        </button>
        <div id="spaces-list" v-if="shareSelect">
          <select class="select-space-save" id="space-options-save" v-model="spaceSave" @change="selectBentoSpace()">
            <option selected="" v-for="sp in spaceList" :value="sp.key">
              {{ sp.value.concept.name }}
            </option>
          </select>
        </div>
      </div>
      <div class="bb-bar-main">
        <button @click="clickShareSpace(props.bboxid)" v-bind:class="{ active: shareForm}">
          share
        </button>
      </div>
      <div class="bb-bar-main">
        <button @click="clickVisTools(props.bboxid)" v-bind:class="{ active: boxToolsShow}">
          Tools
        </button>
      </div>
      <div class="bb-bar-main" v-if="expandFocus !== true">
        <button @click="clickExpandBentobox(props.bboxid)">
         expand
        </button>
      </div>
    </div>
  </div>
  <div id="share-form" v-if="shareForm">
    <share-protocol :bboxid="props.bboxid" :shareType="'privatechart'"></share-protocol>
  </div>
  <bb-tools v-if="boxToolsShow" :bboxid="props.bboxid"></bb-tools>
  <div id="library-summary" v-if="libSum">
    <div id="lib-summary">
      Library summary: {{ expLibrarySummary.key[0] }}
      <button @click="openLibrary">open library</button>
    </div>
    <div id="lib-modules">
      Modules:
      <div class="mod-key" v-for="mod in expLibrarySummary.modules" :key="mod.id">
       {{ mod }}
      </div>
    </div>
  </div>
</template>


<script setup>
import BbTools from '@/components/bentobox/tools/vistoolBar.vue'
import ShareProtocol from '@/components/bentobox/tools/shareForm.vue'
import { ref, computed } from 'vue'
import { cuesStore } from '@/stores/cuesStore.js'
import { bentoboxStore } from '@/stores/bentoboxStore.js'
import { aiInterfaceStore } from '@/stores/aiInterface.js'
import { accountStore } from '@/stores/accountStore.js'
import { libraryStore } from '@/stores/libraryStore.js'

  const storeCues = cuesStore()
  const storeAccount = accountStore()
  const storeAI = aiInterfaceStore()
  const storeBentobox = bentoboxStore()
  const storeLibrary = libraryStore()

  let shareSelect = ref(false)
  const shareForm = ref(false)
  let libSum = ref(false)
  let spaceSave = ref('')
  let peerPshare = ref('')
  let besearchList = ref([
    { key: 'bsc-1111111', name: '24 hours' },
    { key: 'bsc-2222222', name: '7 days' },
    { key: 'bsc-3333333', name: '1 month' },
    { key: 'bsc-4444444', name: '3 months' },
    { key: 'bsc-5555555', name: '1 year' },
  ])
  let besearchSelect = ref('')
  let besearchSave = ref('')

const props = defineProps({
    bboxid: String
  })

const timeformatoptions = ref([
  { text: 'Time series', value: 'timeseries', id: 0 },
  { text: 'Overlay', value: 'overlay', id: 1 }
])

const selectedTimeFormat = ref('timeseries')


  const clickVisTools = (boxid) => {
    storeBentobox.boxtoolsShow[boxid] = !storeBentobox.boxtoolsShow[boxid]
  }

  /* computed */
  const boxToolsShow = computed(() => {
    return storeBentobox.boxtoolsShow[props.bboxid]
  })

  const expandFocus = computed(() => {
    return storeAI.expandBentobox[props.bboxid]    
  })

  const peerWarmlist = computed(() => {
    // warm peers filter to unique
    let peerUnqiue = []
    const uniquePeers = storeAccount.warmPeers.filter((value, index, self) =>
      index === self.findIndex((t) => (
          t.publickey === value.publickey
      ))
    )
    return uniquePeers
  })

  /* methods */
  const besearchCycle = () => {
    // display cycle option
    besearchSelect.value = !besearchSelect.value
  }

  const selectBesearchCycle = () => {
    console.log('select besearch cycle')
    console.log(besearchSave.value)
  }

  const openLibrary = () => {
    storeAI.dataBoxStatus = true
    storeAI.uploadStatus = false
    storeLibrary.libraryStatus = true
  }

  const clickExpandBentobox = (boxid) => {
    storeAI.expandBentobox[boxid] = true
  }

  const clickSummaryLib = (boxid) => {
      libSum.value = !libSum.value
      storeAI.prepareLibrarySummary(boxid)
    }

  const clickAddbentoSpace = (boxid) => {
    // show the space list
    shareSelect.value = !shareSelect.value
    storeAI.prepareLibrarySummary(boxid)
  }

  const clickSummaryLibSilent = (boxid) => {
      storeAI.prepareLibrarySummary(boxid)
    }

  const selectBentoSpace = () => {
    console.log('select bento space')
    console.log(spaceSave.value)
    console.log(storeAI.bentoboxList)
    console.log(props.bboxid)
    console.log(expLibrarySummary.value.key[0])
    let bidPair = { bboxid: props.bboxid, contract: expLibrarySummary.value.key[0]}
    // check object set in list
    if (storeAI.bentoboxList[spaceSave.value] === undefined) {
      storeAI.bentoboxList[spaceSave.value] = []
    }
    if (storeBentobox.locationBbox[spaceSave.value] === undefined) {
      storeBentobox.locationBbox[spaceSave.value] = []
    }
    storeAI.bentoboxList[spaceSave.value].push(bidPair)
    clickAddbentoSpace(props.bboxid)
    // add location default if not already set?
    storeBentobox.setLocationBbox(spaceSave.value, props.bboxid)
    spaceSave.value = 0
  }

  const clickShareSpace = (boxid) => {
    shareForm.value = !shareForm.value
  }

  const chartSelect = () => {
  }

  const selectPeerShare = () => {
    storeAccount.sharePubkey = peerPshare.value 
  }

  /*  computed */
  const spaceList = computed(() => {
    return storeCues.cuesList
  })

  /*
  * library summary
  */
  const expLibrarySummary = computed(() => {
    if (storeAI?.boxLibSummary[props.bboxid].data === undefined) {
      return false
    } else {
      let NXPcontract = {}
      NXPcontract.key = Object.keys(storeAI?.boxLibSummary[props.bboxid].data)
      let modKeys = []
      for (let mod of storeAI.boxLibSummary[props.bboxid].data.modules) { // [NXPcontract.key].modules) {
        modKeys.push(mod.key)
      }
      NXPcontract.modules = modKeys
      return NXPcontract
      // return Object.keys(storeAI.boxLibSummary.data)
    }
  })


</script>


<style scoped>

.box-tools {
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
  grid-template-columns: 4fr 1fr 1fr 1fr 1fr 1fr 1fr;
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

.bb-bar-main {
  border: 0px solid rgb(182, 182, 236);
}

#library-summary {
  border: 1px solid rgb(236, 201, 134);
}

.mod-key {
  padding-left: 1em;
}

@media (min-width: 1024px) {

  .box-tools {
    width: 100%;
    height: 40px;
    background: rgb(141, 145, 226);
    color: white;
    text-align: center;
    cursor: pointer;
    z-index: 3;
  }

  .space-button {
    width: 100px;
  }
  
  #spaces-list {
    display: grid;
    position: relative;
    /*top: 0;
    left: -109px;
    border: 0px solid red; */
    z-index: 52;
  }

  .elect-space-save {
    z-index: 44;
  }

  #bentobox-cell {
    display: block;
    min-height: inherit;
    min-width: inherit;
    z-index: 9;
  }

  #bb-toolbar {
    position: relative;
    display: grid;
    grid-template-columns: 4fr 1fr 1fr 1fr 1fr 1fr 1fr;
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

  .active {
    background-color: rgb(113, 172, 114);
    border: 1px solid green;
  }

  .bb-bar-main {
    border: 0px solid rgb(182, 182, 236);
    margin-left: 0.3em;
    padding-top: 0.4em;
  }

  #share-form {
    position: relative;
    background-color: rgb(224, 227, 243);
    border-bottom: 2px solid rgb(167, 199, 209);
    padding: 1em;
    padding-left: 4em;
  }

}

</style>