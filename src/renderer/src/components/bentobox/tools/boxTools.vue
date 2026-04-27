<template>
  <div class="box-tools">
    <div id="bb-toolbar">
      <div class="bb-bar-main">a bentobox</div>
      <div class="bb-bar-main">
        <bb-nexus-toolbar
          anchor="bottom-right"
          :initial-open="false"
          :inline="true"
          @action="handleNexusAction"
        />
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
        <spaces-list v-if="shareSelect" :bboxid="props.bboxid"></spaces-list>
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
        <button id="expand-bentobox" @click="clickExpandBentobox(props.bboxid)">
         expand
        </button>
      </div>
    </div>
  </div>
  <div id="share-form" v-if="shareForm">
    <share-protocol :bboxid="props.bboxid" :shareType="'privatechart'"></share-protocol>
  </div>
  <bb-tools v-if="boxToolsShow" :bboxid="props.bboxid"></bb-tools>
  <besearch-create-form
    :show="showBesearchCreate"
    :initial-data="besearchPrefill"
    @close="closeBesearchCreate"
    @save="handleCreateBesearchCycle"
  />
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
import BbNexusToolbar from '@/components/nexus/bbNexusToolbar.vue'
import BesearchCreateForm from '@/components/besearch/lifetools/besearchCreateForm.vue'
import SpacesList from '@/components/bentobox/tools/share/spacesList.vue'
import ShareProtocol from '@/components/bentobox/tools/shareForm.vue'
import { ref, computed } from 'vue'
import { bentoboxStore } from '@/stores/bentoboxStore.js'
import { aiInterfaceStore } from '@/stores/aiInterface.js'
import { accountStore } from '@/stores/accountStore.js'
import { libraryStore } from '@/stores/libraryStore.js'
import { teachingStore } from '@/stores/teachingStore.js'
import { besearchStore } from '@/stores/besearchStore.js'

  const storeAccount = accountStore()
  const storeAI = aiInterfaceStore()
  const storeBentobox = bentoboxStore()
  const storeLibrary = libraryStore()
  const storeTeaching = teachingStore()
  const storeBesearch = besearchStore()

  let shareSelect = ref(false)
  const shareForm = ref(false)
  let libSum = ref(false)
  const showBesearchCreate = ref(false)
  const besearchPrefill = ref({})

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
    if (storeTeaching.isTeachingMode) {
      storeTeaching.logAction('boxTools', 'clickVisTools', [boxid], storeBentobox.boxtoolsShow[boxid])
    }
  }

  /* computed */
  const boxToolsShow = computed(() => {
    return storeBentobox.boxtoolsShow[props.bboxid]
  })

  const expandFocus = computed(() => {
    return storeBentobox.expandBentobox[props.bboxid]    
  })

  /* methods */
  const buildBesearchPrefill = () => {
    const cueContext = storeAI.liveBspace || {}
    const cueId = cueContext.cueid || cueContext.spaceid || null
    const cueName = cueContext.name || ''

    const summary = storeAI.boxLibSummary?.[props.bboxid]?.data
    const { contractKey: nxpContractId, contract: nxpContract } = storeLibrary.utilLibrary.resolveNXPFromSummary(
      summary,
      storeLibrary.peerLibraryNXP
    )
    const nxpName = nxpContract?.value?.name || nxpContract?.value?.concept?.name || ''

    const computeMods = storeLibrary.utilLibrary.extractComputeModules(summary, nxpContractId)

    const computeContract = null
    const computeOptions = []
    const computeContractId = ''

    besearchPrefill.value = {
      name: nxpName ? `${nxpName} cycle` : (cueName ? `${cueName} cycle` : ''),
      description: cueName ? `Derived from ${cueName} cue space` : '',
      category: '',
      status: '',
      networkExperiment: nxpContractId || '',
      marker: '',
      frequency: '',
      cueId,
      bboxid: props.bboxid,
      nxpContractId,
      computeContract,
      computeContractId,
      computeOptions
    }
  }

  const openBesearchCreate = () => {
    storeAI.prepareLibrarySummary(props.bboxid)
    buildBesearchPrefill()
    showBesearchCreate.value = true
    if (storeTeaching.isTeachingMode) {
      storeTeaching.logAction('boxTools', 'besearchCreate', [props.bboxid], true)
    }
  }

  const closeBesearchCreate = () => {
    showBesearchCreate.value = false
  }

  const handleCreateBesearchCycle = (formData) => {
    const newCycle = {
      id: `cycle-${Date.now()}`,
      name: formData.name,
      description: formData.description,
      category: formData.category,
      status: formData.status,
      networkExperimentId: formData.networkExperiment,
      markerIds: formData.marker ? [formData.marker] : [],
      frequency: formData.frequency,
      cueId: formData.cueId || storeAI.liveBspace?.cueid || null,
      bboxid: formData.bboxid || props.bboxid,
      nxpContractId: formData.nxpContractId || null,
      computeContract: formData.computeContract || null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    console.log('New besearch cycle fae BB:', newCycle)
    // storeBesearch.saveToHOP(newCycle)
  }

  const handleNexusAction = (action) => {
    if (action === 'world:body') {
      storeAI.bentobesearchState = true
      storeBesearch.setNexusWorld('body')
      return
    }
    if (action === 'world:cue') {
      storeAI.bentobesearchState = true
      storeBesearch.setNexusWorld('cues')
      return
    }
    if (action === 'world:earth') {
      storeAI.bentobesearchState = true
      storeBesearch.setNexusWorld('earth')
      return
    }
    if (action === 'besearch:create') {
      openBesearchCreate()
      return
    }
    if (action === 'besearch:start' || action === 'besearch:stop') {
      return
    }
    if (action === 'context:cues') {
      storeAI.bentocuesState = true
      storeBesearch.setNexusContext({ source: 'bentobox', cueId: storeAI.liveBspace?.cueid || null })
      return
    }
    if (action === 'context:library') {
      storeAI.dataBoxStatus = true
      storeLibrary.uploadStatus = false
      storeLibrary.libraryStatus = true
      storeBesearch.setNexusContext({ source: 'bentobox' })
      return
    }
    if (action === 'context:space') {
      storeAI.bentospaceState = true
      storeBesearch.setNexusContext({ source: 'bentobox', spaceId: storeAI.liveBspace?.spaceid || null })
      return
    }
    if (action === 'data:devices') {
      storeAI.dataBoxStatus = true
      storeLibrary.uploadStatus = false
      storeLibrary.libraryStatus = false
      storeBesearch.setNexusContext({ source: 'bentobox' })
      return
    }
    if (action === 'peers:add' || action === 'peers:share') {
      storeAccount.accountStatus = true
      storeBesearch.setNexusContext({ source: 'bentobox' })
    }
  }

  const openLibrary = () => {
    storeAI.dataBoxStatus = true
    storeAI.uploadStatus = false
    storeLibrary.libraryStatus = true
    if (storeTeaching.isTeachingMode) {
      storeTeaching.logAction('boxTools', 'openLibrary', [], null)
    }
  }

  const clickExpandBentobox = (boxid) => {
    storeBentobox.expandBentobox[boxid] = true
    if (storeTeaching.isTeachingMode) {
      storeTeaching.logAction('boxTools', 'clickExpandBentobox', [boxid], true)
    }
  }

  const clickSummaryLib = (boxid) => {
    libSum.value = !libSum.value
    storeAI.prepareLibrarySummary(boxid)
    if (storeTeaching.isTeachingMode) {
      storeTeaching.logAction('boxTools', 'clickSummaryLib', [boxid], libSum.value)
    }
  }

  const clickShareSpace = (boxid) => {
    shareForm.value = !shareForm.value
    if (storeTeaching.isTeachingMode) {
      storeTeaching.logAction('boxTools', 'clickShareSpace', [boxid], shareForm.value)
    }
  }

  const clickAddbentoSpace = (boxid) => {
    // show the space list
    shareSelect.value = !shareSelect.value
    storeAI.prepareLibrarySummary(boxid)
    if (storeTeaching.isTeachingMode) {
      storeTeaching.logAction('boxTools', 'clickAddbentoSpace', [boxid], shareSelect.value)
    }
  }

  /*  computed */


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
        if (mod !== undefined) {
          modKeys.push(mod.key)
        }
      }
      NXPcontract.modules = modKeys
      return NXPcontract
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
  overflow: visible;
}

#bentobox-cell {
  display: block;
  border: 0px solid grey;
  z-index: 9;
}

#bb-toolbar {
  display: grid;
  grid-template-columns: 4fr 1fr 1fr 1fr 1fr 1fr 1fr;
  align-items: center;
  overflow: visible;
  position: relative;
  z-index: 30;
}

.bb-bar-main {
  position: relative;
  overflow: visible;
  z-index: 31;
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
