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
    // console.log('social peer change')
    // console.log(storeAccount.warmPeers)
    return storeAccount.warmPeers
  })

  /* watch */
  watch(() => storeAccount.warmPeers, (newPeers, existingPeers) => {
    // addPeerToGraph()
  },
   { deep: true }
  )
  

  /* methods */
  const drawbentoGraph = () => {
    /* const graph = new Graph()
    graph.addNode("1", { label: "Node 1", x: 0, y: 0, size: 10, color: "blue" })
    graph.addNode("2", { label: "Node 2", x: 1, y: 1, size: 20, color: "red" })
    graph.addEdge("1", "2", { size: 5, color: "purple" })
    */
   socialGraph = new Graph()
   // add peers (test)
    // addPeerToGraph()
    let peerGraph = document.getElementById("graph-container")
    const sigmaInstance = new Sigma(socialGraph, peerGraph)
    // take know peer connection and chart, then watcher will pick up others
    // put peer account at center of graph
    socialGraph.addNode("1", { label: "me", x: 0, y: 0, size: 20, color: "blue" })
    let peerCount = 1
    for (let pg of peerConnections.value) {
      if (pg.name === 'new-peer') {
        socialGraph.addNode(pg.publickey, { label: pg.name, x: peerCount, y: peerCount, size: 20, color: "red" })
        socialGraph.addEdge("1", pg.publickey, { size: 5, color: "purple" })
        peerCount++
      }
    }
  }

  const addPeerToGraph = (peerIn) => {
    socialGraph.addNode("1", { label: "me", x: 0, y: 0, size: 20, color: "blue" })
    socialGraph.addNode("2", { label: "Peer2", x: 1, y: 1, size: 10, color: "red" })
    socialGraph.addEdge("1", "2", { size: 5, color: "purple" })
  }

  const addPeerNode = () => {
    peerGraphLive.value.push({ name: 'peer3' })
  }

</script>

<style scoped>

#graph-container {
  height: 30vh;
  width: 80vw;
  border: 1px solid lightgrey;
  background-color: whitesmoke;
  margin: 2em;
}


@media (min-width: 1024px) {
 
  #graph-container {
    height: 30vh;
    width: 80vw;
  }

}

</style>