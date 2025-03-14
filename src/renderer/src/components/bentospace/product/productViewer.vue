<template>
  <div id="product-box">
    <div id="product-bar" >
      <div id="box-bar">
        Product Bar
      </div>
      <div id="decision-tools">
        <button @click="addCueDecision()">+ decision</button>
        <div id="bento-cue-decicion" v-if="spaceDecision === true">
            <decision-cue></decision-cue>
        </div>
      </div>
    </div>
      <div id="product-content">
        {{ props.bstag }}
      </div>
      <div id="product-content-details">
        {{ productInfo.value.concept.product }} 
        <button @click="viewSourceproduct(productInfo.value.concept.ecomm)">{{ productInfo.value.concept.product }}</button>
      </div>

  </div>
</template>

<script setup>
import DecisionCue from '@/components/bentocues/decisions/decisionCues.vue'
import { ref, computed } from 'vue'
import { cuesStore } from '@/stores/cuesStore.js'
import { bentoboxStore } from '@/stores/bentoboxStore.js'
import { aiInterfaceStore } from '@/stores/aiInterface.js'
import { libraryStore } from '@/stores/libraryStore.js'

  const storeCues = cuesStore()
  const storeAI = aiInterfaceStore()
  const storeBentobox = bentoboxStore()
  const storeLibrary = libraryStore()
  let spaceDecision = ref(false)
  
  const props = defineProps({
    bstag: String,
    bsproduct: String
  })

  /* computed */
  const productInfo = computed(() => {
    let productMatch = {}
    for (let product of storeCues.productMatch[storeAI.liveBspace.cueid]) {
      if (product.key === props.bsproduct) {
        productMatch = product
      }
    }
    return productMatch
  })

  /* methods */
  const addCueDecision = () => {
    spaceDecision.value = !spaceDecision.value
    // storeAI.decisionDoughnutCue = !storeAI.decisionDoughnutCue
  }

  const viewSourceproduct = (paper) => {
    // visit source in new tab
    window.open(paper, '_blank')
  }
</script>

<style scoped>
.active {
  background-color: darkblue;
  border: 1px solid lightblue;
}

@media (min-width: 1024px) {

 #product-box {
    height: 300px;
    width: 100%;
  }

  .active {
    background-color: darkblue;
    border: 1px solid lightblue;
  }

  #product-bar {
    display: grid;
    grid-template-columns: 1fr 1fr;
    justify-items: center;
    align-items: center;
    width: 100%;
    height: 3em;
    background-color:  rgb(141, 145, 226);
  }

}

</style>