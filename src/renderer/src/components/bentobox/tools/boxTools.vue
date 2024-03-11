<template>
  <div class="box-tools">
    <div id="bb-toolbar">
      <div class="bb-bar-main">a bentobox</div>
      <div class="bb-bar-main"><button @click="clickSummaryLib(props.bboxid)">Lib</button></div>
      <div class="bb-bar-main"><button @click="clickExpandBentobox(props.bboxid)">expand</button></div>
      <div class="bb-bar-main"><button class="space-button" @click="clickAddbentoSpace(props.bboxid)">+ space</button></div>
      <div class="bb-bar-main"><button @click="clickShareSpace(props.bboxid)">share</button>
        <div id="spaces-list" v-if="shareSelect">
          <select class="select-space-save" id="space-options-save" v-model="spaceSave" @change="selectBentoSpace()">
            <option selected="" v-for="sp in spaceList" :value="sp.spaceid">
              {{ sp.name }}
            </option>
          </select>
        </div>
      </div>
      <div class="bb-bar-main"><button @click="clickVisTools(props.bboxid)">Tools</button></div>
      <!--<div class="bb-bar-main"><button id="network-vis">social</button></div>
      <div class="bb-bar-main"><button id="network-map">map</button></div>
      <div class="bb-bar-main"><button id="bb-copy">copy</button></div>-->
    </div>
  </div>
  <div id="share-form" v-if="shareForm">
    <form id="ask-ai-form" @submit.prevent="storeAccount.shareProtocol(props.bboxid)">
      <label for="sharepeer"></label>
      <input type="input" id="sharekey" placeholder="publickey" v-model="storeAccount.sharePubkey" autofocus>
      <button id="share-send" type="submit">
      Send invite
    </button>
    </form>
  </div>
  <bb-tools v-if="boxToolsShow" :bboxid="props.bboxid"></bb-tools>
  <div id="library-summary" v-if="libSum">
    <div id="lib-summary">
      Library summary: {{ boxLibrarySummary.key[0] }}
      <button @click="openLibrary">open library</button>
    </div>
    <div id="lib-modules">
      Modules:
      <div class="mod-key" v-for="mod in boxLibrarySummary.modules" :key="mod.id">
       {{ mod }}
      </div>
    </div>
  </div>
</template>


<script setup>
import BbTools from '@/components/bentobox/tools/vistoolBar.vue'
import { ref, computed } from 'vue'
import { bentoboxStore } from '@/stores/bentoboxStore.js'
import { aiInterfaceStore } from '@/stores/aiInterface.js'
import { accountStore } from '@/stores/accountStore.js'
import { libraryStore } from '@/stores/libraryStore.js'

  const storeAccount = accountStore()
  const storeAI = aiInterfaceStore()
  const storeBentobox = bentoboxStore()
  const storeLibrary = libraryStore()

  let shareSelect = ref(false)
  const shareForm = ref(false)
  let libSum = ref(false)
  let spaceSave = ref('')

const props = defineProps({
    bboxid: String
  })

const timeformatoptions = ref([
  { text: 'Time series', value: 'timeseries', id: 0 },
  { text: 'Overlay', value: 'overlay', id: 1 }
])

const selectedTimeFormat = ref('timeseries')

/* computed */
const clickVisTools = (boxid) => {
  storeBentobox.boxtoolsShow[boxid] = !storeBentobox.boxtoolsShow[boxid]
}

const boxToolsShow = computed(() => {
  return storeBentobox.boxtoolsShow[props.bboxid]
})

  /* methods */
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
  }

  const selectBentoSpace = () => {
    storeAI.bentoboxList[spaceSave.value].push(props.bboxid)
    clickAddbentoSpace(props.bboxid)
    // add location default if not already set?
    storeBentobox.setLocationBbox(spaceSave.value, props.bboxid)
  }

  const clickShareSpace = (boxid) => {
    shareForm.value = !shareForm.value
  }

  const chartSelect = () => {
    console.log('char ttype')
  }

  /*  computed */
  const boxSettings = computed(() => {
    return storeBentobox.boxToolStatus[props.bboxid]
  })

  const openDataLive = computed(() => {
    return storeBentobox.openDatatools[props.bboxid]
  })

  const visToolbarStatusLive = computed(() => {
    return storeBentobox.vistoolsStatus[props.bboxid]
  })

  const spaceList = computed(() => {
    return storeBentobox.spaceList
  })

  /*
  * library summary
  */
  const boxLibrarySummary = computed(() => {
    let NXPcontract = {}
    NXPcontract.key = Object.keys(storeAI.boxLibSummary[props.bboxid].data)
    let modKeys = []
    for (let mod of storeAI.boxLibSummary[props.bboxid].data[NXPcontract.key].modules) {
      modKeys.push(mod.key)
    }
    NXPcontract.modules = modKeys
    return NXPcontract
    // return Object.keys(storeAI.boxLibSummary.data)
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
  grid-template-columns: 4fr 1fr 1fr 1fr 1fr 1fr;
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
    z-index: 9;
  }

  .space-button {
    width: 100px;
  }
  
  #spaces-list {
    display: grid;
    position: absolute;
    left: -99px;
    border: 2px solid red;
  }

  #bentobox-cell {
    display: block;
    min-height: inherit;
    min-width: inherit;
    z-index: 9;
  }

  #bb-toolbar {
    display: grid;
    grid-template-columns: 4fr 1fr 1fr 1fr 1fr 1fr;
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