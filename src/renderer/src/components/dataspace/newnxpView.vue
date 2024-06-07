<template>
  <div id="build-new-nxp">
    <header>Board Builder</header>
    <module-builder></module-builder>
    <button class="contribute-nxp-button" @click="contributeNXP" >Contribute</button>
    <div v-if="savenxpSuccess" class="newnxp-form-feeback">
        <div id="hop-feedback">
          New network experiment saved.
        </div>
      </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import moduleBuilder from '@/components/dataspace/modules/moduleBuilder.vue'
import { libraryStore } from '@/stores/libraryStore.js'

  const storeLibrary = libraryStore()

  // a computed ref
  const savenxpSuccess = computed(() => {
    return storeLibrary.saveSuccessnxp
  })

  const peerNXPlib = computed(() => {
    return storeLibrary.peerExperimentList
  })

  const contributeNXP = () => {
    storeLibrary.prepareGenesisContract(storeLibrary.newnxp)
    storeLibrary.newNXP = false
  }

</script>

<style scoped>

  @media (min-width: 1024px) {

    #build-new-nxp {
      display: grid;
      grid-template-columns: 1fr;
      background-color: rgb(247, 234, 206);
    }

    .contribute-nxp-button {
      display: grid;
      grid-template-columns: 1fr;
      justify-self: center;
      width: 30%;
      font-size: 1.2em;
      margin-top: 1em;
    }

  }
</style>