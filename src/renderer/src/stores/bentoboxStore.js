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
    openDataControls: {},
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
                this.openDataControls[cm.key] = {}
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
                      if (cm.value.hop.length === 0) {
                        console.log('no HOP data')
                      } else {
                        let summaryHOP = cm.value?.hop[0]
                        summaryHOP.bbid = pair.reply.bbid
                        this.storeAI.hopSummary.push({ HOPid: pair.reply.bbid, summary: summaryHOP })
                      }
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
                  this.chartStyle[pair.reply.bbid] = 'line'
                  pairCount++
                }
              } else {
                // BENTOSPACES setup on start
                // add to menu list  no duplicate and TODO set one as active
                if (this.spaceList[0].spaceid !== cm.value.space.spaceid) {
                  this.spaceList.push(cm.value.space)
                }
                this.storeAI.liveBspace = cm.value.space
                if (cm.value.bboxlist.length > 0) {
                  this.storeAI.bentoboxList[cm.value.space.spaceid] = cm.value.bboxlist
                  // set the default or save location of box in space
                  for (let bbox of cm.value.bboxlist) {
                    // setup default tempate i.e. prepare for adding to space
                    const tW = 440
                    const tH = 440
                    let updateBox = {}
                    updateBox.tW = 480
                    updateBox.tH = 480
                    updateBox.handlers = ["r", "rb", "b", "lb", "l", "lt", "t", "rt"]
                    updateBox.left = 90 // ref(`calc(2% - ${tW / 2}px)`)
                    updateBox.top = 90 // ref(`calc(8% - ${tH / 2}px)`)
                    updateBox.height = 'fit-content'
                    updateBox.width = 'fit-content'
                    updateBox.maxW = '100%'
                    updateBox.maxH = '100%'
                    updateBox.minW = '20vw'
                    updateBox.minH = '20vh'
                    updateBox.fit = false
                    updateBox.event = ''
                    updateBox.dragSelector = '.drag-container-1, .drag-container-2'
                    if (this.locationBbox[cm.value.space.spaceid] === undefined) {
                      this.locationBbox[cm.value.space.spaceid] = {}
                    }
                    this.locationBbox[cm.value.space.spaceid][bbox.bboxid] = updateBox
                  }
                } else {
                  this.storeAI.bentoboxList[cm.value.space.spaceid] = {}
                }

                // check for location spaces info. already saved
                if (cm?.value?.location) {
                  // add to menu list
                  // this.spaceList.push(cm.value.space)
                  // set bbox settings
                  this.storeAI.bentoboxList[cm.value.space.spaceid] = cm?.value?.bboxlist
                  // if location space not set set it
                  if (cm.value.space.spaceid in this.locationBbox) {
                  } else {
                    // this.locationBbox[cm.value.space.spaceid] = {}
                  }
                  if (cm.value.bboxlist !== undefined) {
                    if (cm.value.bboxlist.length > 0) {
                      for (let boxsp of cm?.value.bboxlist) {
                        for (let cord of cm?.value.location) {
                          if (cord.bboxid === boxsp.bboxid) {
                            if (cord.location !== undefined && Object.keys(cord.location).length > 0) {
                              this.locationBbox[cm.value.space.spaceid][boxsp.bboxid] = cord.location
                            } else {
                              // this.locationBbox[cm.value.space.spaceid][boxsp.bboxid] = {}
                            }
                          }
                        } 
                      }
                    }
                  }
                } else {
                  console.log('no locat d oroords')
                }

              }
            }
          }
          // back to  chat logic
          if (chatMenu.length > 0) {
            this.chatList = chatMenu
          } else {
            // save latest first time only
            let saveData = {}
            saveData.pair = []
            saveData.chat = this.chatList[0]
            saveData.visData = []
            saveData.hop = []
            let saveBentoBoxsetting = {}
            saveBentoBoxsetting.type = 'bentobox'
            saveBentoBoxsetting.reftype = 'chat-history'
            saveBentoBoxsetting.action = 'save'
            saveBentoBoxsetting.task = 'save'
            saveBentoBoxsetting.data = saveData
            saveBentoBoxsetting.bbid = ''
            this.storeAI.sendMessageHOP(saveBentoBoxsetting)
            // this.storeAI.prepareBentoBoxSave(saveBentoBoxsetting)
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
      }
    },
    setMiniMap (spaceid, bboxid) {
      // setup miniMap  (should be per space  just one for NOW TODO UPSDATE)
      // let c = document.getElementById('minimap-canvas')
      // let ctx = c.getContext('2d')
      // this.storeMmap.actionSetminmaph(ctx)
      let cords = this.locationBbox[spaceid][bboxid]
      // inform mini map of info
      let mMapinfo = {}
      mMapinfo.bboxid = bboxid
      mMapinfo.spaceid = spaceid
      mMapinfo.nxp = ''
      mMapinfo.coord = cords
      mMapinfo.type = 'saved'
      this.storeMmap.actionPostionCoord(mMapinfo)
    },
    saveLayoutSpace (spaceID) {
      // save layout per space
      // gather info per box
      let boxLocList = []
      if (this.storeAI.bentoboxList[spaceID] !== undefined && Object.keys(this.storeAI.bentoboxList[spaceID]).length > 0) {
        for (let bbox of this.storeAI.bentoboxList[spaceID]) {
          let locInfo = this.locationBbox[spaceID][bbox.bboxid]
          boxLocList.push({ bbox: bbox.bboxid, coord: locInfo })
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
  }
})
