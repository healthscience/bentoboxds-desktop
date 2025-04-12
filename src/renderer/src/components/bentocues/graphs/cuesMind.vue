<template>
  <div id="peer-graph">
    <div class="controls">
      <button @click="zoomIn" title="Zoom In" class="control-btn">
        <span class="icon">+</span>
      </button>
      <button @click="zoomOut" title="Zoom Out" class="control-btn">
        <span class="icon">-</span>
      </button>
      <button @click="resetView" title="Reset View" class="control-btn">
        <span class="icon">↻</span>
      </button>
      <button @click="centerView" title="Center View" class="control-btn">
        <span class="icon">CENTER</span>
      </button>
    </div>
    <div id="graph-container"></div>
  </div>
</template>

<script setup>
import Graph from "graphology"
import Sigma from "sigma"
import { ref, watch, computed, onMounted } from 'vue'
import { cuesStore } from '@/stores/cuesStore.js'
import { accountStore } from '@/stores/accountStore.js'

const storeCues = cuesStore()
const storeAccount = accountStore()
let cuesGraph = ref(new Graph())
let sigmaInstance = ref(null)

/* computed */
const cuesConnections = computed(() => {
  return storeCues.cuesList
})

/* watch */
watch(() => storeCues.cuesList, (newCues, existingCues) => {
  updateMindRelationships(newCues)
},
 { deep: true }
)

/* methods */
const drawbentoGraph = () => {
  // Clear any existing graph
  if (cuesGraph.value) {
    cuesGraph.value.clear()
  }
  
  // Ensure container exists
  let peerGraph = document.getElementById("graph-container")
  if (!peerGraph) {
    console.error('Graph container not found')
    return
  }

  // Create new graph
  cuesGraph.value = new Graph()
  
  // Create new Sigma instance with proper settings
  sigmaInstance.value = new Sigma(cuesGraph.value, peerGraph, {
    allowInvalidContainer: true,
    settings: {
      // Camera controls
      enableCameraZooming: true,
      enableCameraPanning: true,
      enableCameraRotation: true,
      
      // Zoom boundaries
      minCameraRatio: 0.1,
      maxCameraRatio: 10,
      
      // Pan boundaries
      cameraPanBoundaries: { tolerance: 20 },
      
      // Zoom settings
      zoomingRatio: 1.2,
      doubleClickZoomingRatio: 2,
      zoomingAnimationDuration: 500,
      zoomingAnimationEasing: 'quadraticInOut',
      
      // Pan settings
      panningRatio: 1,
      panningAnimationDuration: 500,
      panningAnimationEasing: 'quadraticInOut',
      
      // Node and edge settings
      nodeReducer: (node, data) => ({
        ...data,
        label: data.label,
        size: data.size || 10,
        color: data.color
      }),
      edgeReducer: (edge, data) => ({
        ...data,
        size: data.size || 1,
        color: data.color || '#999'
      }),
      defaultNodeColor: '#999',
      defaultEdgeColor: '#999',
      nodeLabel: 'label',
      labelSize: 12,
      labelColor: '#333',
      labelFont: 'Arial',
      labelWeight: 'normal',
      labelSizeRatio: 0.5,
      minNodeSize: 5,
      maxNodeSize: 20,
      minEdgeSize: 1,
      maxEdgeSize: 3,
      zIndex: true,
      renderLabels: true
    }
  })

  // Add click event listener
  sigmaInstance.value.on('clickNode', cueNodeClick)

  // Add hover effects
  sigmaInstance.value.on('overNode', (event) => {
    const { node } = event
    const nodeData = sigmaInstance.value.getGraph().getNodeAttributes(node)
    
    // Highlight node and its connections
    sigmaInstance.value.getGraph().
      setNodeAttribute(node, 'color', '#FF0000')
    
    // Highlight connected edges
    sigmaInstance.value.getGraph().
      forEachEdge((edge) => {
        const [source, target] = sigmaInstance.value.getGraph().getEdgeExtremities(edge)
        if (source === node || target === node) {
          sigmaInstance.value.getGraph().
            setEdgeAttribute(edge, 'color', '#FF0000')
        }
      })
    
    sigmaInstance.value.refresh()
  })

  sigmaInstance.value.on('outNode', (event) => {
    const { node } = event
    const nodeData = sigmaInstance.value.getGraph().getNodeAttributes(node)
    
    // Restore original colors
    sigmaInstance.value.getGraph().
      setNodeAttribute(node, 'color', nodeData.originalColor)
    
    sigmaInstance.value.getGraph().
      forEachEdge((edge) => {
        const [source, target] = sigmaInstance.value.getGraph().getEdgeExtremities(edge)
        if (source === node || target === node) {
          sigmaInstance.value.getGraph().
            setEdgeAttribute(edge, 'color', '#6666cc')
        }
      })
    
    sigmaInstance.value.refresh()
  })

  // Add central mind node
  cuesGraph.value.addNode("1", { 
    label: "mind", 
    x: 0, 
    y: 0, 
    size: 20, 
    color: "#0066cc"
  })

  // Force a refresh
  sigmaInstance.value.refresh()
  
  // Update relationships
  updateMindRelationships(storeCues.cuesList)

  // Return cleanup function
  return () => {
    sigmaInstance.value.kill()
  }
}

// Camera control functions
const zoomIn = () => {
  if (sigmaInstance.value) {
    const camera = sigmaInstance.value.getCamera()
    console.log('Current ratio:', camera.ratio) // Add debug log
    camera.ratio = Math.min(10, camera.ratio * 1.2) // Add max limit
    sigmaInstance.value.refresh() // Force refresh
  }
}

const zoomOut = () => {
  if (sigmaInstance.value) {
    const camera = sigmaInstance.value.getCamera()
    console.log('Current ratio:', camera.ratio) // Add debug log
    camera.ratio = Math.max(0.1, camera.ratio * 0.8) // Add min limit
    sigmaInstance.value.refresh() // Force refresh
  }
}

const resetView = () => {
  if (sigmaInstance.value) {
    const camera = sigmaInstance.value.getCamera()
    console.log('Resetting view') // Add debug log
    camera.position = [0, 0]
    camera.ratio = 1
    sigmaInstance.value.refresh() // Force refresh
  }
}

const centerView = () => {
  if (sigmaInstance.value) {
    const camera = sigmaInstance.value.getCamera()
    console.log('Centering view') // Add debug log
    camera.position = [0, 0]
    sigmaInstance.value.refresh() // Force refresh
  }
}

const updateMindRelationships = (updateCues) => {
  if (updateCues.length > 0) { 
    cuesGraph.value.clear()
    
    // Add central mind node
    cuesGraph.value.addNode("1", { 
      label: "mind", 
      x: 0, 
      y: 0, 
      size: 20, 
      color: "#0066cc",
      originalColor: "#0066cc"
    })

    // Calculate circular positions
    const radius = 150
    const angleStep = (2 * Math.PI) / updateCues.length
    
    let angle = 0
    for (let cue of updateCues) {
      const x = Math.cos(angle) * radius
      const y = Math.sin(angle) * radius
      
      // Determine color based on relationships
      let color = '#ff6600'
      if (cue.value.computational.relationships && Object.keys(cue.value.computational.relationships).length > 0) {
        color = '#00cc66'
      }
      
      // Store original color for hover effects
      cuesGraph.value.addNode(cue.key, { 
        label: cue.value.concept.name, 
        x: x, 
        y: y, 
        size: 15, 
        color: color,
        originalColor: color
      })
      
      // Add straight edge to center
      cuesGraph.value.addEdge("1", cue.key, { 
        size: 2, 
        color: '#6666cc'
      })
      
      angle += angleStep
    }
  } else {
    cuesGraph.value.clear()
    cuesGraph.value.addNode("1", { 
      label: "mind", 
      x: 0, 
      y: 0, 
      size: 20, 
      color: "#0066cc",
      originalColor: "#0066cc"
    })
  }

  // Force a refresh to update the visualization
  if (sigmaInstance.value) {
    sigmaInstance.value.refresh()
  }
}

const resetGraph = () => {
  if (cuesGraph.value) {
    cuesGraph.value.clear()
  }
  drawbentoGraph()
}

const cueNodeClick = (event) => {
  const { node } = event
  const nodeData = sigmaInstance.value.getGraph().getNodeAttributes(node)
  
  // Handle different types of nodes
  if (node === '1') {
    // Handle mind node click
    console.log('Mind node clicked')
    // Reset the graph or show overview
    resetGraph()
  } else {
    // Handle concept node click
    console.log('Concept clicked:', nodeData.label)
    
    // Get the concept data
    const concept = storeCues.cuesList.find(cue => cue.key === node)
    if (concept) {
      // Show concept details
      console.log('Concept details:', concept)
      
      // Example: Show related concepts
      if (concept.value.computational.relationships) {
        const relatedConcepts = Object.keys(concept.value.computational.relationships)
        console.log('Related concepts:', relatedConcepts)
      }
    }
  }

  // Add visual feedback
  sigmaInstance.value.getGraph().
    setNodeAttribute(node, 'color', '#FF0000')
  sigmaInstance.value.refresh()

  // Reset color after a short delay
  setTimeout(() => {
    sigmaInstance.value.getGraph().
      setNodeAttribute(node, 'color', nodeData.originalColor)
    sigmaInstance.value.refresh()
  }, 500)
}

// Initialize the graph when component mounts
onMounted(() => {
  drawbentoGraph()
})

</script>

<style scoped>
#peer-graph {
  position: relative;
  display: grid;
  height: 1200px;
  width: 1200px;
}

#graph-container {
  display: grid;
  position: relative;
  height: 1200px;
  width: 1200px;
}

.controls {
  position: absolute;
  top: 20px;
  right: 20px;
  display: flex;
  gap: 10px;
  z-index: 1000;
}

.control-btn {
  padding: 10px 16px;
  font-size: 14px;
  border: none;
  border-radius: 6px;
  background: #f8f9fa;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #495057;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.control-btn:hover {
  background: #e9ecef;
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(0,0,0,0.15);
}

.control-btn:active {
  transform: translateY(0);
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.control-btn .icon {
  font-size: 16px;
  font-weight: bold;
  margin-right: 4px;
}

.control-btn:first-child .icon {
  color: #28a745;
}

.control-btn:nth-child(2) .icon {
  color: #dc3545;
}

.control-btn:nth-child(3) .icon {
  color: #007bff;
}

.control-btn:last-child .icon {
  color: #6c757d;
}

@media (min-width: 1024px) {
  #peer-graph {
    display: grid;
    height: 1200px;
    width: 1200px;
  } 

  #graph-container {
    display: grid;
    position: relative;
    height: 1200px;
    width: 1200px;
  }
}
</style>