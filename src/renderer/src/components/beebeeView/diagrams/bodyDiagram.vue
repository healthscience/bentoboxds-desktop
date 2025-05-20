<template>
  <div id="body-diagram-parts">
    Human body navigation
    <!--<img class="right-display-menu" src="@/assets/human-diagram.png" alt="human body">-->
    <canvas id="human-canvas" width="600px" height="900px" ref="canvas" @mousemove="handleMouseMove" @mouseleave="handleMouseLeave" @click="handleCanvasClick($event)"></canvas>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import picBody from '@/assets/human-diagram.png'
import { cuesStore } from '@/stores/cuesStore.js'
import { aiInterfaceStore } from '@/stores/aiInterface.js'
import { bentoboxStore } from '@/stores/bentoboxStore.js'

  const storeCues = cuesStore()
  const storeAI = aiInterfaceStore()
  const storeBentobox = bentoboxStore()

  let canvas = ref(null)
  let ctx = ref({})
  let selectedArea = ref({})
  let organAreas = ref(
    [
      { name: 'Heart', cueid: 'b96fa316c2f7eddf9b842da8c9ac2780f36abdff', coords: { x: 170, y: 200, width: 40, height: 50 } },
      { name: 'Lungs-left', cueid: 'c9bb966242109ae21f9d8ce289d9272ea72aa17e', coords: { x: 120, y: 180, width: 50, height: 50 } },
      { name: 'Liver', cueid: '77e188e3647df3d63a1ab5cff9cf88d491f81c89', coords: { x: 120, y: 302, width: 80, height: 50 } },
      { name: 'Kidney-right', cueid: 'd088619e69211f9246cb01406e10c209dc83de50', coords: { x: 210, y: 300, width: 30, height: 50 } },
      { name: 'Brain', cueid: 'f944e1fcf72e59b1f6159bea347402cd4490c211', coords: { x: 146, y: 10, width: 70, height: 30 } },
      { name: 'Circulation', cueid: '296ce0efc66045c5842707d4652186e440f2fc21', coords: { x: 280, y: 330, width: 40, height: 60 } },
      { name: 'Large intestine', cueid: 'e1e2dd4471981d2fae620525f4dab22824c7bfac', coords: { x: 164, y: 370, width: 50, height: 50 } },
      { name: 'Skeleton', cueid: '88107b7b9891d8afe586c96658955e40effadbe7', coords: { x: 44, y: 320, width: 50, height: 70 } },
      { name: 'Joints', cueid: '9411b6d422ccd2766eb303a834ae8bf0caa85bcc', coords: { x: 124, y: 630, width: 50, height: 50 } },
      { name: 'Eye-right', cueid: '48654b856be3d1e8f5149335999d879658d9d1b1', coords: { x: 190, y: 42, width: 20, height: 20 } },
      { name: 'Eye-left', cueid: '48654b856be3d1e8f5149335999d879658d9d1b1', coords: { x: 146, y: 42, width: 20, height: 20 } }
    ])
  let organName = ref('')
  const currentOrgan = ref(null)

  /* on mount */
  onMounted(() => {
    drawBodyImage()
  })


  const drawBodyImage = () => {
    canvas = document.getElementById('human-canvas')
    ctx = canvas.getContext("2d")
    const image = new Image()
    let imageD = picBody
    image.src = imageD
    image.onload = () => {
       ctx.drawImage(image, 0, 0, image.width * 1.4, image.height * 1.4)
       drawOransAreas()
    }
  }

  const drawOransAreas = () => {
    organAreas.value.forEach((organ) => {
      ctx.beginPath()
      ctx.strokeStyle = '#D3D3D3'
      ctx.rect(organ.coords.x, organ.coords.y, organ.coords.width, organ.coords.height)
      ctx.stroke()
    })
  }

  const handleMouseMove = (event) => {
    const canvasElement = document.getElementById('human-canvas')
    const rect = canvasElement.getBoundingClientRect()
    const x = event.clientX - rect.left
    const y = event.clientY - rect.top

    const organNameHover = isOverOrgan(x, y)
    
    if (organNameHover) {
      if (organNameHover !== currentOrgan.value) {
        currentOrgan.value = organNameHover // Update the current organ
        canvasElement.style.cursor = 'pointer' // Change cursor
        organName.value = organNameHover // Set organ name based on the area
        // Clear the canvas
        ctx.clearRect(0, 0, canvasElement.width, canvasElement.height)
        // Draw the body image and organ areas
        drawBodyImage() // Draw the body image
        drawOransAreas() // Draw the organ areas
      }
      // Get the organ's coordinates for static text position
      const organ = organAreas.value.find(o => o.name === currentOrgan.value)
      if (organ) {
        // Set text properties
        ctx.fillStyle = 'black' // Set text color
        ctx.font = '16px Arial' // Set font size and family
        // Draw the organ name at a static position within the organ area
        const textX = organ.coords.x + 5 // Adjust for padding
        const textY = organ.coords.y + 20 // Adjust for padding
        ctx.fillText(organName.value, textX, textY) // Draw the organ name
      }
    } else {
      resetCursor()
    }
  }

  const handleMouseLeave = (event) => {
    resetCursor()
  }

  const resetCursor = () => {
    const canvasElement = document.getElementById('human-canvas')
    canvasElement.style.cursor = 'default' // Reset cursor
    organName.value = '' // Clear organ name
    currentOrgan.value = null // Reset current organ
  }

  const isOverOrgan = (x, y) => {
    // Logic to determine if the mouse is over an organ area
    for (let organ of organAreas.value) {
      if (x >= organ.coords.x && x <= organ.coords.x + organ.coords.width &&
          y >= organ.coords.y && y <= organ.coords.y + organ.coords.height) {
        return organ.name
      }
    }
    // Example: return true if (x, y) is within certain bounds
    return null
  }

  const handleCanvasClick = (ev) => {
    selectedArea.value = {}
    const rect = canvas
    const x = (ev.clientX - rect.offsetParent.offsetLeft)
    const y = (ev.clientY - (rect.offsetTop + 20) )
    organAreas.value.forEach(area => {
      if (x >= area.coords.x && x <= area.coords.x + area.coords.width &&
          y >= area.coords.y && y <= area.coords.y + area.coords.height) {
        selectedArea.value = area
        // Optionally, highlight the area or display more info
      } else {
        
      }
      // open the cue bentospace
      if (Object.keys(selectedArea.value).length > 0) {
        bentoSpaceOpen(selectedArea.value)
      }
    })
  }

  const bodypartSelect = (ev) => {
    // get mouse position 
    let mouseLoc = offSetCalc(ev)
    // ctx.beginPath()
    // ctx.fillRect(mouseLoc.x, mouseLoc.y, 10, 10)
    // ctx.fillStyle = 'blue'
    // ctx.fill()
    // ctx.stroke()
    const pointColour = ctx.getImageData(mouseLoc.x, mouseLoc.y, 2, 2).data
    function rgbToHex(r, g, b) {
      return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)
    }
    let hexColor = rgbToHex(pointColour[0], pointColour[1], pointColour[2])
    if (hexColor === '#e2552a' || hexColor === '#f05f22' || hexColor === '#f26522') {
    } else if (hexColor === '#fd1e32' || hexColor === '#f4e9d7') {
    }
  }

  const offSetCalc = (ev) => {
    let x = 0
    let y = 0
    var offsetX = 0, offsetY = 0
    let element = canvas
    if (element.offsetParent) {
      do {
        offsetX += element.offsetLeft
        offsetY += element.offsetTop
      } while ((element = element.offsetParent))
    }
    x = ev.pageX - offsetX
    y = ev.pageY - offsetY
    let mousePos = {}
    mousePos.x = x
    mousePos.y = y
    return mousePos
  }

  const bentoSpaceOpen = (cueInfo) => {
    // prepare chat for space
    let newChatItem = {}
    newChatItem.name = cueInfo.name
    newChatItem.chatid = cueInfo.cueid
    newChatItem.active = true
    //setup chat history holder
    storeAI.setupChatHistory(newChatItem)
    storeAI.chatAttention = cueInfo.cueid
    storeCues.cueContext = 'space'
    storeAI.beebeeContext = 'chatspace'
    storeAI.bentospaceState = true
    storeAI.liveBspace = { name: cueInfo.name, cueid: cueInfo.cueid, gluedown: 'down', active: true, expand: true }
    // make button green
    let spaceLiveList = []
    for (let spi of storeBentobox.spaceList) {
      if (spi.cueid === cueInfo.cueid) {
        spi.active = true
        spaceLiveList.push(spi)
      } else {
        spi.active = false
        spaceLiveList.push(spi)
      }
    }
    storeBentobox.spaceList = spaceLiveList
    // prepare cue wheel context
    let cueContract = storeCues.cueUtil.cueMatch(cueInfo.cueid, storeCues.cuesList)
    prepareCue(cueInfo.cueid, cueInfo.cueid, cueContract)
    // close the body diagram
    storeAI.bodyDiagramShow = false
  }

  const prepareCue = (spaceID, cueKey, cueR) => {
    // reset any context
    storeCues.cueMatchMarkersLive = [] 
    storeCues.cueKnowledge = 'concept'
    storeCues.activeCue = cueKey
    storeCues.activeDougnnutData = storeCues.cueDisplayBuilder(cueKey, cueR, {})
    // check in other context e.g. flake
    storeCues.glueRelActive = ''
    storeCues.checkCueContext()
    // look for cogGlue e.g. measure to marker
    // storeCues.cogGlueSpace(spaceID.cueid)
  }

</script>


<style scoped>
#body-diagram-parts {
  display: grid;
  grid-template-columns: 1fr;
}

#human-canvas {
  display: block;
  /*background-image: url("@/assets/human-diagram.png");
  background-repeat: no-repeat; */
  width: 600px;
  height: 900px;
}


@media (min-width: 1024px) {
  #body-diagram-parts {
    display: block;
  }

  #human-canvas {
    display: block;
    width: 600px;
    height: 900px;
    /*background-image: url("@/assets/human-diagram.png");
    background-repeat: no-repeat; */
    z-index: 88;
  }
}

</style>