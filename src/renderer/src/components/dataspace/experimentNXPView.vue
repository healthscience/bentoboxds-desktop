<template>
  <div>
    <Teleport to="#data-box-section-header" v-if="isMounted">
      <div class="compact-section-header">
        <h2 class="section-title-compact">Experiments</h2>
        <span class="section-subtitle-compact">Peer & Public networks</span>
      </div>
    </Teleport>
    <div id="live-network-experiment">
      <div id="show-nxplists" v-if="spaceType === 'Boards'">
        <list-contracts v-if="spaceState === 'private' && peerNXPlib.columns?.length > 0" class="experiment-info"
          :experiments="peerNXPlib.data"
          :columns="peerNXPlib.columns"
          :privacy="'private'"
        >
        </list-contracts>
        <!--<start-experience id="start-demo-nxp" v-else></start-experience>-->
      </div>
      <div id="show-nxplists" v-if="spaceType === 'Boards'">Public experiments
        <list-contracts v-if="libraryState === 'public' && publicNXPlib.data?.length > 0" class="experiment-info"
          :experiments="publicNXPlib.data"
          :columns="publicNXPlib.columns"
          :privacy="'public'"
        >
        </list-contracts>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import ListContracts from '@/components/library/contracts/list/ListContracts.vue'
import { libraryStore } from '@/stores/libraryStore.js'

  const storeLibrary = libraryStore()

  const spaceType = ref('Boards')
  const spaceState = ref('private')
  const libraryState = ref('public')

  const isMounted = ref(false)
  onMounted(() => {
    isMounted.value = true
  })

  // a computed ref
  const peerNXPlib = computed(() => {
    return storeLibrary.peerExperimentList
  })

  const publicNXPlib = computed(() => {
    return storeLibrary.listPublicNXP
  })

</script>

<style scoped>

  @media (min-width: 1024px) {
  #live-network-experiment {
    width: 100%;
    z-index: 23;
    border: 0px dashed blue;
  }

  .nxplist-showspace {
    padding-left: 2em;
  }

  .nxplist-space.active {
    font-size: 1.2em;
    background-color: #4CAF50; /* Green */
    border: none;
    color: white;
    padding: 6px 14px;
    margin-right: 2em;
    margin-left: 2em;
    text-align: center;
  }

  .nxp-experimentslist {
    padding: 1em;
  }

  .experiment-info {
    border: 0px solid grey;
    text-align: center;
  }
}

.compact-section-header {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.section-title-compact {
  font-size: 1.4rem;
  font-weight: 800;
  color: var(--sov-accent, #3b82f6);
  margin: 0;
  letter-spacing: -0.02em;
}

.section-subtitle-compact {
  font-size: 0.8rem;
  color: var(--sov-text-muted, #64748b);
  margin: 0;
}
</style>