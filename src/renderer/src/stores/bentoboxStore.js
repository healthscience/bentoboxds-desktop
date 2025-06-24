import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { aiInterfaceStore } from '@/stores/aiInterface.js'
import { libraryStore } from '@/stores/libraryStore.js'
import { cuesStore } from '@/stores/cuesStore.js'
import ChatUtilty from '@/stores/hopUtility/chatUtility.js'

export const bentoboxStore = defineStore('bentostore', {
  state: () => ({
    storeLibrary: libraryStore(),
    storeAI: aiInterfaceStore(),
    storeCues: cuesStore(),
    liveChatUtil: new ChatUtilty(),
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
    locationMbox: {
      91919191: {}
    },
    locationRbox: {
      81819191: {}
    },
    locationMarkerbox: {
      84819191: {}
    },
    locationProductbox: {
      3319191: {}
    },
    boxLocation:
    {
      x: 200,
      y: 200
    },
    locX: 140,
    locY: 140,
    videoMedia: {},
    researchMedia: {},
    markerMedia: {},
    productMedia: {},
    libraryCheck: false,
    isBentospaceActive: false
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
          // prepare chat dialogues
          let chatMenu = []
          if (message.data.length !== 0) {
            chatMenu = this.liveChatUtil.prepareChatMenu(message.data)
            this.storeAI.chatAttention = chatMenu[0].chatid
            let setOneActive = []
            let chatAct = 0
            for (let chat of chatMenu) {
              if (chat.active === true && chatAct === 0) {
                chatAct++
                setOneActive.push(chat)
                // set attention of chat
                this.storeAI.chatAttention = chat.chatid
              } else {
                chat.active = false
                setOneActive.push(chat)
              }
              this.storeAI.setupChatHistory(chat)
            } 
            this.chatList = setOneActive
            // what items was last uses ie time or could be favourite ie most frequent use
            this.storeAI.chatAttention = this.chatList[0].chatid
          } else {
            let firstChatmenu = this.liveChatUtil.prepareChatMenu([])
            this.chatList = firstChatmenu
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
            this.storeAI.chatAttention = this.chatList[0].chatid
            this.storeAI.setupChatHistory(this.chatList[0])
          }
          // set the chat list live
          this.storeAI.historyList = true
        }
      } else if (message.reftype.trim() === 'agent-history') {
        this.storeAI.agentModelDefault = message.data
        // look for onstart model and ass beebee to start via HOP
        let onstartModel = {}
        if (this.storeAI.agentModelDefault.length > 0) {
          for (let agent of this.storeAI.agentModelDefault) {
            if (agent.value.computational.onstart === true) {
              onstartModel = agent
            }
          }
          if (Object.keys(onstartModel).length > 0) {
            this.storeAI.modelLoading = true
            this.storeAI.sendModelControl(onstartModel.value.computational, 'learn-agent-start')
          }
        }
      } else if (message.reftype.trim() === 'spaces-history') {
        // loop through saved spaces bentobox and their location in space
        for (let space of message.data) {
          this.storeAI.bentoboxList[space.key] = space.value.bboxlist
          if (this.locationBbox[space.key] !== undefined) {
            for (let bboxloc of space.value.location) {
              this.locationBbox[space.key][bboxloc.bboxid] = bboxloc.location
            }
          } else {
            this.locationBbox[space.key] = {}
            if (space.value.location !== undefined) {
              for (let bboxloc of space.value.location) {
                this.locationBbox[space.key][bboxloc.bboxid] = bboxloc.location
              }
            }
          }
        }
      } else if (message.reftype.trim() === 'cues-history') {
        if (this.storeLibrary.publicLibrary.referenceContracts !== undefined) {
          this.libraryCheck = true
          // expand cues via library
          let updateCueExpand = []
          for (let cueContract of message.data) {
            let expandDTCue = this.storeLibrary.utilLibrary.expandCuesDTSingle(cueContract, this.storeLibrary.publicLibrary.referenceContracts)
            updateCueExpand.push(expandDTCue)
          }
          this.storeCues.cuesList = updateCueExpand
          // filter for most current used time or frequency
          // freq.
          this.storeCues.getMostLastusedItems(this.storeCues.cuesList)
          // time
          // this.storeCues.getMostPopularItems(this.storeCues.cuesList)
        } else {
          this.storeCues.waitingCues = message.data
        }
      } else if (message.reftype.trim() === 'media-history') {
        this.prepareMediaSpace(message.data)
      } else if (message.reftype.trim() === 'research-history') {
        this.prepareResearchSpace(message.data)
      } else if (message.reftype.trim() === 'marker-history') {
        this.prepareMarkerSpace(message.data)
        // any measure cue cogglue to include?
        // this.storeCues.
      } else if (message.reftype.trim() === 'product-history') {
        this.prepareProductSpace(message.data)
      } else if (message.reftype.trim() === 'bentobox-history') {
      }
    },
    prepareMediaSpace (mData) {
      let medBoxList = []
      let tempSpaceID = ''
      this.locationMbox = {}
      for (let mkey of mData) {
        tempSpaceID = mkey.value.concept.cueid
        if (this.locationMbox[tempSpaceID] === undefined) {
          this.locationMbox[tempSpaceID] = {}
          this.videoMedia[tempSpaceID] = []
          this.storeCues.mediaMatch[tempSpaceID] = []
        }
        medBoxList.push({ key: mkey.key, tag: 'video', id: mkey.value.concept })
        this.setLocationMbox(tempSpaceID, mkey.key)
        this.videoMedia[tempSpaceID].push({ key: mkey.key, tag: 'video', id: mkey.value.concept })
        this.storeCues.mediaMatch[tempSpaceID].push(mkey)
      }
    },
    prepareResearchSpace (rData) {
      let resBoxList = []
      let tempSpaceID = ''
      for (let rkey of rData) {
        tempSpaceID = rkey.value.concept.cueid
        if (this.locationRbox[tempSpaceID] === undefined) {
          this.locationRbox[tempSpaceID] = {}
          this.researchMedia[tempSpaceID] = []
          this.storeCues.researchPapers[tempSpaceID] = []
        }
        resBoxList.push({ key: rkey.key, tag: 'research', id: rkey.value.concept })
        this.setLocationRbox(tempSpaceID, rkey.key)
        this.researchMedia[tempSpaceID].push({ key: rkey.key, tag: 'research', id: rkey.value.concept })
        this.storeCues.researchPapers[tempSpaceID].push(rkey)
      }
    },
    prepareMarkerSpace (mData) {
      // list of active markers
      this.storeCues.markerList = mData
      let markerBoxList = []
      let tempSpaceID = ''
      for (let mkkey of mData) {
        // match from cue relations or marker contract?
        // list of incoming markers
        if (mkkey.value.concept.spaceid !== undefined) {
          tempSpaceID = mkkey.value.concept.spaceid
          if (this.locationMarkerbox[tempSpaceID] === undefined) {
            this.locationMarkerbox[tempSpaceID] = {}
            this.markerMedia[tempSpaceID] = []
            this.storeCues.markerMatch[tempSpaceID] = []
          }
          markerBoxList.push({ key: mkkey.key, tag: 'marker', id: mkkey.value.concept })
          // only set location in space if value present saved
          // this.setLocationMarkerbox(tempSpaceID, mkkey.key)
          this.markerMedia[tempSpaceID].push({ key: mkkey.key, tag: 'marker', id: mkkey.value.concept })
          this.storeCues.markerMatch[tempSpaceID].push(mkkey)
        } else {
          // run through cues and match maker to relathionships and add to cue space, marker in context
        }
      }
    },
    prepareProductSpace (pData) {
      let tempSpaceID = ''
      let productBoxList = []
      for (let prokey of pData) {
        tempSpaceID = prokey.value.concept.cueid
        if (this.locationProductbox[tempSpaceID] === undefined) {
          this.locationProductbox[tempSpaceID] = {}
          this.productMedia[tempSpaceID] = []
          this.storeCues.productMatch[tempSpaceID] = []
        }
        productBoxList.push({ key: prokey.key, tag: 'product', id: prokey.value.concept.product })
        this.setLocationProductbox(tempSpaceID, prokey.key)
        this.productMedia[tempSpaceID].push({ key: prokey.key, tag: 'product', id: prokey.value.concept.product })
        this.storeCues.productMatch[tempSpaceID].push(prokey)
      }
    },
    setLocationBbox (space, bbox) {
      // check not already set
      let spaceLive = this.locationBbox[space]
      if (bbox in spaceLive) {
      } else {
        const tW = 840
        const tH = 440
        let updateBox = {}
        updateBox.tW = tW
        updateBox.tH = tH
        updateBox.handlers = ["r", "rb", "b", "lb", "l", "lt", "t", "rt"]
        updateBox.left = '90px' // ref(`calc(2% - ${tW / 2}px)`)
        updateBox.top = this.locationStart + 'px' // ref(`calc(8% - ${tH / 2}px)`)
        updateBox.height = 'auto'
        updateBox.width = '40vw'
        updateBox.maxW = '100%'
        updateBox.maxH = '100%'
        updateBox.minW = '40vw'
        updateBox.minH = '20vh'
        updateBox.fit = false
        updateBox.event = ''
        updateBox.dragSelector = '#bb-toolbar, .drag-container-2'
        this.locationBbox[space][bbox] = updateBox
        // TODO make location start per space
        this.locationStart+= 40
      }
    },
    setLocationMbox (space, mbox) {
      // check not already set
      let spaceLive = this.locationMbox[space]
      if (mbox in spaceLive) {
      } else {
        const tW = 840
        const tH = 440
        let updateBox = {}
        updateBox.tW = tW
        updateBox.tH = tH
        updateBox.handlers = ["r", "rb", "b", "lb", "l", "lt", "t", "rt"]
        updateBox.left = '90px' // ref(`calc(2% - ${tW / 2}px)`)
        updateBox.top = this.locationStart + 'px' // ref(`calc(8% - ${tH / 2}px)`)
        updateBox.height = 'auto'
        updateBox.width = '20vw'
        updateBox.maxW = '100%'
        updateBox.maxH = '100%'
        updateBox.minW = '20vw'
        updateBox.minH = '20vh'
        updateBox.fit = false
        updateBox.event = ''
        updateBox.dragSelector = '#bb-toolbar, .drag-container-2'
        this.locationMbox[space][mbox] = updateBox
        this.locationStart+= 40
      }
    },
    setLocationRbox (space, rbox) {
      // check not already set
      let spaceLive = this.locationRbox[space]
      if (rbox in spaceLive) {
      } else {
        const tW = 840
        const tH = 440
        let updateBox = {}
        updateBox.tW = tW
        updateBox.tH = tH
        updateBox.handlers = ["r", "rb", "b", "lb", "l", "lt", "t", "rt"]
        updateBox.left = '90px' // ref(`calc(2% - ${tW / 2}px)`)
        updateBox.top = this.locationStart + 'px' // ref(`calc(8% - ${tH / 2}px)`)
        updateBox.height = 'auto'
        updateBox.width = '20vw'
        updateBox.maxW = '100%'
        updateBox.maxH = '100%'
        updateBox.minW = '20vw'
        updateBox.minH = '20vh'
        updateBox.fit = false
        updateBox.event = ''
        updateBox.dragSelector = '#br-toolbar, .drag-container-2'
        this.locationRbox[space][rbox] = updateBox
        this.locationStart+= 40
      }
    },
    setLocationMarkerbox (space, mbox) {
      // check not already set
      let mID = mbox
      let spaceLive = this.locationMarkerbox[space]
      if (mbox in spaceLive) {
      } else {
        const tW = 840
        const tH = 440
        let updateBox = {}
        updateBox.tW = tW
        updateBox.tH = tH
        updateBox.handlers = ["r", "rb", "b", "lb", "l", "lt", "t", "rt"]
        updateBox.left = '90px' // ref(`calc(2% - ${tW / 2}px)`)
        updateBox.top = this.locationStart + 'px' // ref(`calc(8% - ${tH / 2}px)`)
        updateBox.height = 'auto'
        updateBox.width = '20vw'
        updateBox.maxW = '100%'
        updateBox.maxH = '100%'
        updateBox.minW = '20vw'
        updateBox.minH = '20vh'
        updateBox.fit = false
        updateBox.event = ''
        updateBox.dragSelector = '#marker-bar, .drag-container-2'
        this.locationMarkerbox[space][mID] = updateBox
        this.locationStart+= 40
      }
    },
    setLocationProductbox (space, pbox) {
      // check not already set
      let pID = pbox
      let spaceLive = this.locationProductbox[space]
      if (pbox in spaceLive) {
      } else {
        const tW = 840
        const tH = 440
        let updateBox = {}
        updateBox.tW = tW
        updateBox.tH = tH
        updateBox.handlers = ["r", "rb", "b", "lb", "l", "lt", "t", "rt"]
        updateBox.left = '90px' // ref(`calc(2% - ${tW / 2}px)`)
        updateBox.top = this.locationStart + 'px' // ref(`calc(8% - ${tH / 2}px)`)
        updateBox.height = 'auto'
        updateBox.width = '20vw'
        updateBox.maxW = '100%'
        updateBox.maxH = '100%'
        updateBox.minW = '20vw'
        updateBox.minH = '20vh'
        updateBox.fit = false
        updateBox.event = ''
        updateBox.dragSelector = '#product-bar, .drag-container-2'
        this.locationProductbox[space][pID] = updateBox
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
      mMapinfo.cueid = spaceid
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
        spaceInfo.cueid = 's-' + spaceID
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
