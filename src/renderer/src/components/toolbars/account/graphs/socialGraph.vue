<template>
  <div id="peer-graph">
    Social Graph<!--<button id="add-peer" @click="addPeerNode()">add peer</button>-->
    <div id="graph-container"></div>
  </div>
</template>

<script setup>
import Graph from "graphology"
import Sigma from "sigma"
import { ref, watch, computed, onMounted } from 'vue'
import { accountStore } from '@/stores/accountStore.js'

  const storeAccount = accountStore()

  let socialGraph = ref({})
  let peerGraphLive = ref([])

  /* on mount */
  onMounted(() => {
    drawbentoGraph()
  })

  /* computed */
  const peerConnections = computed(() => {
    return storeAccount.warmPeers
  })

  /* watch */
  watch(() => storeAccount.warmPeers, (newPeers, existingPeers) => {
    updatePeerRelationships(newPeers)
  },
   { deep: true }
  )
  

  /* methods */
  const drawbentoGraph = () => {
   socialGraph = new Graph()
   // add peers (test)
    let peerGraph = document.getElementById("graph-container")
    const sigmaInstance = new Sigma(socialGraph, peerGraph)
    // take know peer connection and chart, then watcher will pick up others
    // put peer account at center of graph
    socialGraph.addNode("1", { label: "me", x: 0, y: 0, size: 20, color: "blue" })
    updatePeerRelationships(storeAccount.warmPeers)
  }

  const updatePeerRelationships = (updatePeers) => {
    if (updatePeers.length > 0) { 
      socialGraph.clear()
      let peerCount = 1
      socialGraph.addNode("1", { label: "me", x: 0, y: 0, size: 20, color: "blue" })
      for (let pg of updatePeers) {
        let colorSet = 'red'
        if (pg.value.live === true) {
          colorSet = 'green'
        }
        socialGraph.addNode(pg.key, { label: pg.value.name, x: "1", y: peerCount, size: 20, color: colorSet })
        socialGraph.addEdge("1", pg.key, { size: 5, color: "purple" })
        peerCount++
      }
    } else if (updatePeers.length == 0) {
      socialGraph.clear()
      socialGraph.addNode("1", { label: "me", x: 0, y: 0, size: 20, color: "blue" })
    }
  }

</script>

<style scoped>

#peer-graph {
  position: relative;
  display:grid;
  height: 500px;
  width: 800px;
}

#graph-container {
  position: relative;
  height: 500px;
  width: 800px;
  border: 1px solid lightgrey;
  background-color: whitesmoke;
}


@media (min-width: 1024px) {

  #peer-graph {
    position: relative;
    display:grid;
    height: 500px;
    width: 800px;
  } 

  #graph-container {
    position: relative;
    height: 500px;
    width: 900px;
  }

}

</style>