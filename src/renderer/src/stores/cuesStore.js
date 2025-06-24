import { defineStore } from 'pinia'
import { useSocketStore } from '@/stores/socket.js'
import { libraryStore } from '@/stores/libraryStore.js'
import { aiInterfaceStore } from '@/stores/aiInterface.js'
import CuesUtilty from '@/stores/hopUtility/cuesUtility.js'
import MarkersUtilty from '@/stores/hopUtility/biomarkerUtility.js'
import FlakeUtilty from '@/stores/hopUtility/flakeUtility.js'

export const cuesStore = defineStore('cues', {
  state: () => ({
    storeLibrary: libraryStore(),
    storeAI: aiInterfaceStore(),
    cueUtil: new CuesUtilty(),
    flakeUtil: new FlakeUtilty(),
    markerUtil: new MarkersUtilty(),
    sendSocket: useSocketStore(),
    bentopathState: false,
    pathListActive: true,
    cuesList: [],
    markerList: [],
    cueMatchMarkersLive: [],
    gaiaStart: false,
    gaiaCount: 0,
    pathName: '',
    activeCueSegment: {},
    activeCue: '',
    activeDougnnutData: {},
    bentopathLive: [],
    bentopathStages: [],
    stageCount: 0,
    pathRefContracts: {},
    cueColumnA: {},
    cueColumnB: {},
    cuesmenuList: [],
    hopCues: {},
    cuesLongevity: {},
    selectCues: {},
    natureBoundries: {},
    mediaMatch: {},
    researchPapers: {},
    markerMatch: {},
    productMatch: {},
    oracleAttention: [], // [{ spaceid: 123221, name: 'cueOne', oracle: 'let me show you . . .'}, { spaceid: 223221, name: 'cueTwo', oracle: 'take a look at'}]
    waitingCues: [],
    liveCueContext: 'menu',
    flakeCues: {},
    cueContext: 'cueall',
    cueKnowledge: 'concept',
    cuesFlakeList: [],
    cuesListFilter: [],
    cuesFlakeCount: 0,
    glueRelActive: '',
    minCuesStatus: true,
    minCuesText: 'Minimise',
    spaceListHistory: [],
    cuesHistoryList: [],
    cueMenuHistory: [],
    cueHistory: [],
    glueHistory: [],
    historyCuesStatus: false
  }),
  actions: {
    processReply (received) {
      // console.log('oracle replies coming in, update bentobox')
      // console.log(received)
    },
    prepareCueContract (cueInfo) {
      let cueContract = this.cueUtil.prepareCuesContractPrime(cueInfo)
      this.sendSocket.send_message(cueContract)
    },
    refreshGetCues () {
      const cueContract = {}
      cueContract.type = 'library'
      cueContract.action = 'cues'
      cueContract.reftype = 'start-cues'
      cueContract.task = 'GET'
      cueContract.privacy = 'public'
      this.sendSocket.send_message(cueContract)
    },
    cueDisplayBuilder (cueKey, cueRel, liveWheel) {
      let cueDisplay = this.cueUtil.cueDisplayMake(cueKey, cueRel, liveWheel)
      // keep track of history
      this.glueHistory.push({ key: cueKey, data: cueDisplay })
      this.cueHistory.push({ key: cueKey, data: cueDisplay })
      return cueDisplay
    },
    cogGlueSpace (spaceID) {
      let spaceContract = this.cueUtil.cueMatch(spaceID, this.cuesList)
      this.markerMatch[spaceID] = []
      if (spaceContract?.value?.computational?.relationships?.measure !== undefined) {
        for (let relc of spaceContract.value.computational.relationships['measure']) {
          let matchMarker = this.markerUtil.markerMatch(relc, this.markerList)
          this.markerMatch[spaceID].push(matchMarker)
        }
      }
    }, 
    cueGluePrepare (glueType) {
      // match cue to its contract
      this.glueRelActive = glueType
      if (glueType === 'down' || glueType === 'up' || glueType === 'equal') {
        // need to match glue type to specific path
        if (glueType === 'up') {
         // look at history of down and go back one stage
         let lastDown = this.glueHistory[this.glueHistory.length - 2]
         // could be single or multiple cude data structure
         if (lastDown.data.wheeldata !== undefined) {
          this.activeDougnnutData = lastDown.data.wheeldata
         } else {
          this.activeDougnnutData = lastDown.data     
         }
         this.checkCueContext()
        } else {
          let cueContract = this.cueUtil.cueMatch(this.activeCue, this.cuesList)
          let cueWheel = this.cueUtil.prepareGlueWheel(glueType, cueContract, this.cuesList)
          this.activeCueExpanded = cueWheel.expandedcues
          if (cueWheel?.wheeldata?.labels.length > 0) {
            // keep track of glue history
            this.glueHistory.push({ type: glueType, data: cueWheel })
            this.activeDougnnutData = cueWheel.wheeldata
            this.checkCueContext()
          }
          this.storeAI.cuesFeedback = cueWheel.feedback
        }
      } else if (glueType === 'measure') {
        let cueContract = this.cueUtil.cueMatch(this.activeCue, this.cuesList)
        let relAvailable = Object.keys(cueContract?.value?.computational?.relationships)
        // does the cogglue have any reltation listed?
        let relCheck = relAvailable.includes(glueType)
        if (relCheck === true) {
          if (cueContract?.value?.computational?.relationships[glueType].length > 0) {
            let markerContract = this.markerUtil.markerMatch(cueContract.value.computational.relationships[glueType], this.markerList)
            // double check for empty element
            let cleanList = []
            for (let marker of markerContract) {
              if (marker.length > 0) {
                cleanList.push(marker)
              }
            }
            this.cueMatchMarkersLive = cleanList
          } else {
            console.log('no markers')
          }
          // if flake mode update
          if (this.liveCueContext === 'flake') {
            this.cuesFlakeMeasure()
          }
        } else {
          console.log('no relation')  // need to make beebee feedback message TODO
        }
      }
    },
    matchCueContract (cueInfo) {
      this.cueUtil.cueMatch(this.activeCue, this.cuesList)

    },
    matchCueContractLabel (cueInfo) {
      // what wheel is active itterate over to match on label name
      let matchLabel = {}
      for (let cue of this.cuesList) {
        if (cue.value.concept.name === cueInfo.label) {
          matchLabel = cue
        }
      }
      return matchLabel
    },
    checkCueContext () {
      // keep track of history ie popularity of a cue
      this.cueMenuHistory.push(this.activeCue)
      this.cuesFlakeList = []
      this.flakeCues = {}
      // what cue context is active, menu, space, flake
      if (this.liveCueContext === 'menu') {
        // what cue is active
        this.flakeCuesList()
      } else if (this.liveCueContext === 'space') {
      } else if (this.liveCueContext === 'flake') {
        // any relationships active?
        this.minCuesStatus = false
        this.minCuesText = 'Show'
        if (this.glueRelActive === 'down') {
          this.cuesFlakeCount = 0
          for (let cueE of this.activeCueExpanded) {
            this.flakeCuesListGlue(cueE)
            this.prepareFlakeExpanded(cueE.key)
          }
        } else if (this.glueRelActive === 'measure') {
          this.cuesFlakeMeasure()
        } else {
          // need to prepare/ map to sub cues and then to N=1/decisions to show boundry state ie. low just right  concern
          this.cuesFlakeList = []
          let prepList =this.flakeCuesList()
          this.prepareFlake()
        }
      }
    },
    updateCueTimestamp (cueid) {
      let cueContract = this.cueUtil.cueMatch(cueid, this.cuesList)
      let updateCueContract = this.cueUtil.updateTimestamp(cueContract)
      // update the library saved contract
      let cueMessage = this.cueUtil.updateCuesContract(cueContract)
      this.sendSocket.send_message(cueMessage)
      // need to update current menu and save now or flag to do
      let updateCueList = []
      for (let cue of this.cuesList) {
        if (cue.key === cueContract.key) {
          updateCueList.push(updateCueContract)
        } else {
          updateCueList.push(cue)
        }
      }
      // now time order
      this.getMostLastusedItems(updateCueList)
    },
    getMostLastusedItems (array) {
      // Sort the array by lastUsedTime in descending order
      let lastusedHistory = array.sort((a, b) => {
        const lastUsedTimeA = new Date(a.value.time.lastTimestamp).getTime()
        const lastUsedTimeB = new Date(b.value.time.lastTimestamp).getTime()
        return lastUsedTimeB - lastUsedTimeA
      })
      this.cuesHistoryList = []
      for (let cue of lastusedHistory) {
        this.storeLibrary.prepareCueMenuHistory(cue)
      }
    },
    getMostPopularItems (array) {
      // Create a map to store the count of each item
      const itemCountMap = new Map()
      // Count occurrences of each item in the array
      array.forEach(item => {
        if (itemCountMap.has(item)) {
          itemCountMap.set(item, itemCountMap.get(item) + 1)
        } else {
          itemCountMap.set(item, 1)
        }
      })
      // Convert the map to an array of [item, count] pairs and sort by count in descending order
      const sortedItems = Array.from(itemCountMap.entries()).sort((a, b) => b[1] - a[1])
      // limit to ten
      const limitHistory = sortedItems.slice(0, 10)
      // Return the sorted array of items with their counts
      this.cuesHistoryList = []
      for (let cue of limitHistory) {
        this.storeLibrary.prepareCueMenuHistory(cue[0])
      }
    },
    flakeCuesList () {
      // need to add rotation
      // let branchItems = { nature: { transform: 'rotate('  + '30' + 'deg)'} }
      // how many cues in flake?
      let cueRadian = 360 / this.cuesFlakeList.length
      let flakePosition = { transform: 'rotate(' + cueRadian + 'deg)'} 
      this.cuesFlakeList.push({ cue: this.activeCue, style: flakePosition })
      return true
    },
    flakeCuesListGlue (cueContract) {
      // need to add rotation
      // let branchItems = { nature: { transform: 'rotate('  + '30' + 'deg)'} }
      // how many cues in flake?
      this.cuesFlakeCount++
      let cueRadian = 360 / this.activeCueExpanded.length
      let flakePosition = { transform: 'rotate(' + (cueRadian * this.cuesFlakeCount) + 'deg)'} 
      this.cuesFlakeList.push({ cue: cueContract.key, style: flakePosition, name: cueContract.value.concept.name })
    },
    prepareFlake () {
      // let cueContract = this.cueUtil.cueMatch(this.activeCue, this.cuesList)
      // what cues have rel to the prime cue?

      // match cues to wheel
      let cueContract = this.cueUtil.cueMatch(this.activeCue, this.cuesList)
      // this.flakeCues = cueWheel
      this.flakeCues[this.activeCue] = this.flakeUtil.prepareFlakeCues(cueContract)
    },
    prepareFlakeExpanded (cueKey) {
      // match cues to contracts
      let expCuesContracts = {}
      for (let cue of this.cuesList) {
        if (cue.key === cueKey) {
          expCuesContracts = cue
        }
       }
      // look at relationships and find measure bentoboxes to get state
      let relMarkers = {}
      if (expCuesContracts.value.computational.relationships?.measure !== undefined) {
        relMarkers = expCuesContracts.value.computational.relationships?.measure
      }
      if (relMarkers.length > 0) {
       let markerContract = this.markerUtil.markerMatch(relMarkers, this.markerList)
        let measurePerCue = []
        for (let marker of markerContract) {
          measurePerCue.push(this.flakeUtil.prepareHexFlake(expCuesContracts, marker[0]))
        }
        this.flakeCues[cueKey] = measurePerCue
      } else {
        this.flakeCues[cueKey] = [this.flakeUtil.prepareHexFlakeEmpty(expCuesContracts, cueKey)]
      }
    },
    cuesFlakeMeasure () {
      // the markers live for this cue
      this.cuesFlakeList = []
      this.cuesFlakeCount = 0
      for (let marker of this.cueMatchMarkersLive) {
        this.flakeMarkersList(marker[0])
      }
      this.flakeCues = []
      // when single cue show the bentobox decision color state
      let cueContract = this.cueUtil.cueMatch(this.activeCue, this.cuesList)
      this.flakeCues = this.flakeUtil.prepareFlakeCuesMarkers(cueContract, this.cueMatchMarkersLive)
    },
    flakeMarkersList (marker) {
      // need to add rotation
      this.cuesFlakeCount++
      let cueRadian = 360 / this.cueMatchMarkersLive.length
      let flakePosition =  { transform: 'rotate(' + (cueRadian * this.cuesFlakeCount) + 'deg)'}
      this.cuesFlakeList.push({ cue: marker.key, style: flakePosition, name: marker.value.concept.name })
    },
    prepareGaia () {
      // get gaia datatype contract info.
      let listDatatypes = this.cueUtil.prepareDTnatureMessage()

      for (let dtg of listDatatypes) {
        this.sendSocket.send_message(dtg)
      }
     /* for (let dtg of listDatatypes1) {
        this.sendSocket.send_message(dtg)
      }
      for (let dtg of listDatatypes2) {
        this.sendSocket.send_message(dtg)
      }
      for (let dtg of listDatatypes3) {
        this.sendSocket.send_message(dtg)
      } */
      // need to listen save success and then prepare cue contracts
      // this.gaiaStart = true
    },
    prepareAging () {
      // hallmarks of aging
      let listDatatypes = this.cueUtil.prepareDTagingMessage()
      for (let dtg of listDatatypes) {
        this.sendSocket.send_message(dtg)
      }
    },
    preparePlanet () {
      // planet boundries
      let listDatatypes = this.cueUtil.prepareDTplanetMessage()
      for (let dtg of listDatatypes) {
        this.sendSocket.send_message(dtg)
      }
    },
    prepareBody () {
      // body datatypes
      let listDatatypes = this.cueUtil.prepareDTbodyMessage()
      for (let dtg of listDatatypes) {
        this.sendSocket.send_message(dtg)
      }
    },
    prepareBodyBiomarkers () {
      // body biomarkers
      let listDatatypes = this.markerUtil.prepareContractbiomarkersMessage()
      for (let dtg of listDatatypes) {
        this.sendSocket.send_message(dtg)
      }
    },
    filterCuesByToday (cues) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return cues.filter(cue => new Date(cue.value.lastUsed) >= today);
    },
    filterCuesByThisWeek (cues) {
      const today = new Date();
      const startOfWeek = new Date(today.setDate(today.getDate() - today.getDay()));
      startOfWeek.setHours(0, 0, 0, 0);
      return cues.filter(cue => new Date(cue.value.lastUsed) >= startOfWeek);
    },
    filterCuesByThisMonth (cues) {
      const today = new Date();
      const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
      startOfMonth.setHours(0, 0, 0, 0);
      return cues.filter(cue => new Date(cue.value.lastUsed) >= startOfMonth);
    }
  }
})