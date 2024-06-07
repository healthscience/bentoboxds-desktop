import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { aiInterfaceStore } from '@/stores/aiInterface.js'

export const bentoboxStore = defineStore('bentostore', {
  state: () => ({
    storeAI: aiInterfaceStore(),
    historyActive: false,
    chatList: [
      {
        name:'latest', chatid:'0123456543210', active: true
      }
    ],
    spaceList: [
      {
        name:'openspace', spaceid:'91919191', active: true
      }
    ],
    chartStyle: {},
    bbToolbarOpendata: {},
    boxToolStatus: {},
    /* {
      opendatatools: { active: false },
      boxtoolshow: { active: false },
      vistoolsstatus: { active: false },
      scalezoom: 1,
      location: {}
    } */
    networkGraph: false,
    geoMap: false,
    devicesettings: {},
    settings: {
      xaxis: '',
      yaxis: [],
      category: ''
    },
    openDatatools: {},
    boxtoolsShow: {},
    vistoolsStatus : {},
    openDataSettings: {},
    locationStart: 90,
    scaleZoom: 1,
    locationBbox: {
      91919191: {}
    },
    boxLocation:
    {
      x: 200,
      y: 200
    },
    locX: 140,
    locY: 140
  }),
  actions: {
    // since we rely on `this`, we cannot use an arrow function
    setChartstyle (id, style) {
      if (style !== undefined) {
      this.chartStyle[id] = style
      } else {
        this.chartStyle[id] = 'line'
      }
    },
    setBoxlocation (loc) {
      // const tempLoc = {}
      // tempLoc.x = 10
      // tempLoc.y = 10
      this.boxLocation = loc
      this.locX = loc.x
      this.locY = loc.y
    },
    processReply (message) {
      // console.log('message bentobox')
      // console.log(message)
      // prepare chat menu and pairs
      if (message.reftype.trim() === 'chat-history') {
        if (message.action.trim() === 'start') {
          // set the saved chats for peer
          let chatMenu = []
          for (let cm of message.data) {
            if(cm?.value?.chat) {
              chatMenu.push(cm.value.chat)
            }
            // build datapair
            if (cm?.value?.pair) {
              // is setting for chat or space?
              if ('space' in cm.value !== true ) {
                this.storeAI.historyPair[cm.key] = cm.value.pair
                // toolbars
                this.boxtoolsShow[cm.key] = false
                this.bbToolbarOpendata[cm.key] = false
                this.openDataSettings[cm.key] = {}
                // loop over boxids for this chat
                let pairCount = 0
                for (let pair of cm?.value?.pair) {
                  this.storeAI.beebeeChatLog[pair.reply.bbid] = true
                  if (cm.value?.visData) {
                    let hopDataChart = {}
                    hopDataChart.datasets = [ { data: cm.value?.visData[pairCount]?.datasets[0]?.data } ]
                    hopDataChart.labels = cm.value?.visData[pairCount]?.labels
                    this.storeAI.visData[pair.reply.bbid] = hopDataChart
                    if (cm.value?.hop !== undefined) {
                      let summaryHOP = cm.value?.hop[0]
                      summaryHOP.bbid = pair.reply.bbid
                      console.log('start HOP summary')
                      console.log(summaryHOP)
                      this.storeAI.hopSummary.push({ HOPid: pair.reply.bbid, summary: summaryHOP })
                    }
                  }
                  // set box detail setings
                  this.boxToolStatus[pair.reply.bbid] = {}
                  let boxSettings = 
                  {
                    opendatatools: { active: false },
                    boxtoolshow: { active: false },
                    vistoolsstatus: { active: false },
                    scalezoom: 1,
                    location: {},
                    chartstyle: 'line'
                  }
                  this.boxToolStatus[pair.reply.bbid] = boxSettings
                  this.devicesettings[pair.reply.bbid] = {}
                  this.devicesettings[pair.reply.bbid] = this.settings
                  console.log('device settings set')
                  this.chartStyle[pair.reply.bbid] = 'line'
                  pairCount++
                }
              } else {
                // add to menu list  no duplicate and TODO set one as active
                if (this.spaceList[0].spaceid !== cm.value.space.spaceid) {
                  this.spaceList.push(cm.value.space)
                }
                this.storeAI.liveBspace = cm.value.space
                if (cm.value.bboxlist.length > 0) {
  
                  this.storeAI.bentoboxList[cm.value.space.spaceid] = cm.value.bboxlist
                  // set the default or save location of box in space
                  for (let bbox of cm.value.bboxlist) {
                    const tW = 440
                    const tH = 440
                    let updateBox = {}
                    updateBox.tW = 480
                    updateBox.tH = 480
                    updateBox.handlers = ref(["r", "rb", "b", "lb", "l", "lt", "t", "rt"])
                    updateBox.left = 90 // ref(`calc(2% - ${tW / 2}px)`)
                    updateBox.top = 90 // ref(`calc(8% - ${tH / 2}px)`)
                    updateBox.height = ref('fit-content')
                    updateBox.width = ref('fit-content')
                    updateBox.maxW = ref('100%')
                    updateBox.maxH = ref('100%')
                    updateBox.minW = ref('20vw')
                    updateBox.minH = ref('20vh')
                    updateBox.fit = ref(false)
                    updateBox.event = ref('')
                    updateBox.dragSelector = ref('.drag-container-1, .drag-container-2')
                    this.locationBbox[cm.value.space.spaceid] = {}
                    this.locationBbox[cm.value.space.spaceid][bbox] = updateBox
                  }
                } else {
                  this.storeAI.bentoboxList[cm.value.space.spaceid] = {}
                }
              }
            }
            // check for location spaces info. already saved
            if (cm?.value?.location) {
              // add to menu list
              // console.log(cm?.value)
              // this.spaceList.push(cm.value.space)
              // set bbox settings
              this.storeAI.bentoboxList[cm.value.spaceshort] = cm?.value?.boxlist
              // if location space not set set it
              if (cm.value.spaceshort in this.locationBbox) {
              } else {
                this.locationBbox[cm.value.spaceshort] = {}
              }
              for (let boxsp of cm?.value?.boxlist) {
                for (let cord of cm?.value?.location) {
                  if (cord.bbox === boxsp) {
                    if (cord.coord !== undefined) {
                      this.locationBbox[cm.value.spaceshort][boxsp] = cord.coord
                    }
                  }
                } 
              }
            } else {
              // console.log('no locat d oroords')
            }
          }
          if (chatMenu.length > 0) {
            this.chatList = chatMenu
          }
          /* if (this.chatList.length !== 0) {
            this.chatList.push({ name:'latest', chatid:'0123456543210', active: true })
          } */
          // set the chat list live
          this.storeAI.historyList = 'history'
          this.storeAI.chatAttention = this.chatList[0].chatid
          // if no chats offer up default chat

          this.storeAI.setupChatHistory(this.chatList[0])
          this.historyActive = true
        } else if (message.action.trim() === 'save') {
          console.log('saved feedback')
        }
      }
    },
    setLocationBbox (space, bbox) {
      // check not already set
      let spaceLive = this.locationBbox[space]
      if (bbox in spaceLive) {
      } else {
        const tW = 440
        const tH = 440
        let updateBox = {}
        updateBox.tW = 480
        updateBox.tH = 480
        updateBox.handlers = ref(["r", "rb", "b", "lb", "l", "lt", "t", "rt"])
        updateBox.left = '90px' // ref(`calc(2% - ${tW / 2}px)`)
        updateBox.top = this.locationStart + 'px' // ref(`calc(8% - ${tH / 2}px)`)
        // updateBox.height = ref('fit-content')
        // updateBox.width = ref('fit-content')
        // updateBox.maxW = ref('100%')
        // updateBox.maxH = ref('100%')
        // updateBox.minW = ref('20vw')
        // updateBox.minH = ref('20vh')
        updateBox.fit = ref(false)
        updateBox.event = ref('')
        updateBox.dragSelector = ref('.drag-container-1, .drag-container-2')
        this.locationBbox[space][bbox] = updateBox
        this.locationStart+= 40
        console.log(this.locationStart)
      }
    },
    saveLayoutSpace (spaceID) {
      // save layout per space
      // gather info per box
      let boxLocList = []
      for (let bbox of this.storeAI.bentoboxList[spaceID]) {
        let locInfo = this.locationBbox[spaceID][bbox]
        boxLocList.push({ bbox: bbox, coord: locInfo })
      }
      let spaceInfo = {}
      spaceInfo.spaceid = 's-' + spaceID
      spaceInfo.spaceshort = spaceID
      spaceInfo.boxlist = this.storeAI.bentoboxList[spaceID]
      spaceInfo.location = boxLocList
      let spaceSave = {}
      spaceSave.type = 'bentobox'
      spaceSave.reftype = 'space-history'
      spaceSave.action = 'save-position'
      spaceSave.data = spaceInfo
      spaceSave.bbid = ''
      this.storeAI.sendMessageHOP(spaceSave)
    }
  }
})
