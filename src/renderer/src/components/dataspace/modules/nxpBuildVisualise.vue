<template>
  <div id="visualise-nxp-build">
    <header>VISUALISE BUILDER:</header> {{ livePackaging }}
    <div id="prime-visualise-build" v-if="props.refFocus === 'visualise'">
      <header>Type of visualisation:</header>
      <div  v-if="refContractVisualise">
        <div class="vis-refcontract" v-for="visc of refContractVisualise">
          <div class="vis-key">{{ visc.key }}</div>
          <div class="vis-key">{{ visc.value.computational.name }}</div>
          <div class="vis-key">{{ visc.value.computational.description }}</div>
          <div class="vis-key"> --- </div>
        </div>
      </div>
      <div class="visualise-medium-item">
        <div>
          Contract:
          <input v-model="visualRefCont" placeholder="Reference Contract">
          <button type="button" class="btn" @click="refContractLookup()">Lookup</button>
          <opendata-tool :bboxid="'genesis-123579'"></opendata-tool>
          <!--<chart-builder v-if="type === 'chart.js'" :shellID="shellID" :moduleCNRL="moduleCNRL" :moduleType="moduleType" :mData="mData"></chart-builder>-->
        </div>
      </div>
    </div>
    <div v-else>
      <div class="vis-key">{{ refContractVisualise[0]?.value.computational.name }}</div>
    </div>

  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import OpendataTool from '@/components/bentobox/tools/opendataToolsBuild.vue'
import { libraryStore } from '@/stores/libraryStore.js'


  const storeLibrary = libraryStore()

  let visualRefCont = ref('')

  const props = defineProps({
    refFocus: String
  })

  /* computed */
  const refContractVisualise = computed (() => {

    return storeLibrary.newnxp.visualiseLive
  })

</script>

<style scoped>

@media (min-width: 1024px) {
  #k-toolkit {
    border: 0px solid red;
  }

  .vis-refcontract {
    border: 1px solid white;
    margin: 1em;
  }

  .vis-key {
    background-color: bisque;
    width: 96%;
  }
}
</style>
