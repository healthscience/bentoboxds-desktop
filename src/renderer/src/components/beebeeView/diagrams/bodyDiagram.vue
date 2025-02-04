<template>
  <div id="body-diagram-parts">
    Human body navigation
    <!--<img class="right-display-menu" src="@/assets/human-diagram.png" alt="human body">-->
    <canvas id="human-canvas" width="600px" height="900px" @click="handleCanvasClick($event)"></canvas>
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

  let bodycanvas = ref(null)
  let canvas = ref({})
  let ctx = ref({})
  let selectedArea = ref({})
  let organAreas = ref(
    [
      { name: 'Heart', cueid: 'b96fa316c2f7eddf9b842da8c9ac2780f36abdff', coords: { x: 170, y: 200, width: 40, height: 50 } },
      { name: 'Lungs-left', cueid: 'c9bb966242109ae21f9d8ce289d9272ea72aa17e', coords: { x: 120, y: 180, width: 50, height: 50 } }
    ])

  /* on mount */
  onMounted(() => {
    drawBodyImage()
  })


  const drawBodyImage = () => {
    canvas = document.getElementById('human-canvas')
    ctx = canvas.getContext("2d")
    const image = new Image()
    let imageD = picBody
    image.src = imageD // 'https://www.bentoboxds.org/assets/logo-CQ0an4it.png'
    image.onload = () => {
       ctx.drawImage(image, 0, 0, image.width * 1.4, image.height * 1.4)
       drawOransAreas()
    }
  }

  const drawOransAreas = () => {
    organAreas.value.forEach((organ) => {
      ctx.beginPath()
      ctx.strokeStyle = '#000000'
      ctx.rect(organ.coords.x, organ.coords.y, organ.coords.width, organ.coords.height)
      ctx.stroke()
    })
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
        console.log('no area')
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