import { ref, computed, shallowRef, defineAsyncComponent } from 'vue'
import { defineStore } from 'pinia'
import { aiInterfaceStore } from '@/stores/aiInterface.js'
import LibraryUtility from '@/stores/hopUtility/libraryUtility.js'
import { bentoboxStore } from "@/stores/bentoboxStore.js"
import { useSocketStore } from '@/stores/socket.js'
import hashObject from 'object-hash'

export const libraryStore = defineStore('librarystore', {
  state: () => ({
    libraryStatus: false,
    libPeerview: false,
    newNXPstatus: false,
    joinNXP: false,
    joinSelected: {},
    joinFeedback: false,
    storeAI: aiInterfaceStore(),
    storeBentoBox: bentoboxStore(),
    utilLibrary: new LibraryUtility(),
    sendSocket: useSocketStore(),
    startLibrary: false,
    libraryMessage: '',
    uploadStatus: false,
    describeSource: {},
    restStatus: false,
    peerExperimentList: {
      columns: ['id', 'name', 'description', 'time', 'device', 'action'],
      data: []
    },
    publicLibrary: {},
    listPublicNXP: [],
    peerLibrary: [],
    peerResults: [],
    peerLedger: [],
    peerLibraryNXP: [],
    newRefcontractForm: {},
    genesisModules: [],
    saveSuccessnxp: false,
    newnxp: {
      questionLive: [],
      packagingLive: [],
      computeLive: [],
      visualiseLive: []
    },
    questionForm: {
      primary: Boolean,
      name: ''
    },
    datatypeForm: {
      primary: Boolean,
      name: '',
      description: '',
      wiki: '',
      rdf: '',
      measurement: '',
      datatypeType: ''
    },
    newComputeForm: {
      primary: Boolean,
      name: '',
      description: '',
      dtprefix: '',
      code: '',
      hash: ''
    },
    newDatafile: {
      columns: [],
      devicecolumns: [],
      path: '',
      device: []
    },
    newPackagingForm:
    {
      authrequired: false,
      type: '',
      filename: '',
      path: '',
      sqlitetablename: '',
      baseapi: '',
      jsonpath: '',
      authtoken: '',
      apicolumns: [],
      apicolHolder: [[]],
      catHolder: {},
      tidyHolder: {},
      catCount: 0,
      tidyCount: 0,
      category: {},
      tidy: {},
      devicesList: [],
      deviceColumns: [],
      device:
      {
        id: '',
        device_name: '',
        device_manufacturer: '',
        device_mac: '',
        device_type: '',
        device_model: '',
        query: '',
        location_lat: '',
        location_long: '',
        firmware: '',
        mobileapp: ''
      }
    },
    joinOptions: {},
    fileBund: {},
    fileBundleList: [],
    linesLimit: {},
    csvpreviewLive: false,
    lineBundle:
    {
      cnumber: '',
      dataline: '',
      delimiter: '',
      datetype: ''
    },
    catForm: {
      category: '',
      categorycolumn: '',
      categoryrule: '',
    },
    newVisualiseForm: {
      primary: Boolean,
      name: '',
      description: '',
      structureName: '',
      visHolder: [],
    },
    deviceForm:
    {
      query: '',
      name: '',
      mac_address: '',
      location_lat: '',
      location_long: '',
      firmware: '',
      mobileapp: ''
    },
    sourceDataSelected: false,
    newLists: {},
    newListsave: {},
    newModuleList: [],
    buildNewExperiment: [],
    moduleNxpActive: 'question',
    dtcolumns: [],
    fileSaveStatus: false,
    fileFeedback: ''
  }),
  actions: {
    // since we rely on `this`, we cannot use an arrow function
    defaultLibContracts () {
      // set up three contract & send messages
      let defaultConts = this.utilLibrary.prepareDefaultContracts()
      for (let contract of defaultConts) {
        this.sendMessage(contract)
      }
    },
    startLibrary () {
      // ask network library for contracts via HOP
      this.sendMessage('get-library')
      this.sendMessage('get-results')
    },
    processReply (message, questionStart) {
      // console.log('library process')
      // console.log(message)
      if (message.action === 'save-file') {
        this.describeSource = message.data
        // set message
        if (message.task === 'sqlite') {
          // need to extract out to chat prepare utility TODO
					this.storeAI.qcount++
					let question = {}
					question.type ='bbai'
					question.reftype = 'ignore'
					question.action = 'question'
					question.data = { "count": this.storeAI.qcount, "text": "Upload of file", "active": true, "time": new Date() }
					let hashQuestion = hashObject(question.data + message.data.path)
					// extract headers assume first line
					let headerLocal = {}
          headerLocal[hashQuestion] = message.data.columns // localHeaderExtract(splitLines[0])

					question.bbid = hashQuestion
					let bbReply = {}
					bbReply.type = 'bbai-reply'
					bbReply.data = { text: 'Summary of tables in SQLite file, heading are:', filedata: { type: 'sqlite', file: message.data.path, columns: 'one', grid: [] }, prompt: 'Select data table to chart:', options: headerLocal[hashQuestion], }
					bbReply.bbid = hashQuestion
					let newPair = {}
					newPair.question = question
					newPair.reply = bbReply
					this.storeAI.historyPair[this.storeAI.chatAttention].push(newPair)
          this.newDatafile.columns = message.data.columns
          this.newDatafile.path = 'sqlite'
          this.newDatafile.file = message.data.path
        } else {
          this.libraryMessage = message.data
          this.newPackagingForm.apicolumns = message.data.data.headerinfo.splitwords
          this.newDatafile.columns = message.data.columns
          this.newDatafile.path = 'sqlite'
          this.newDatafile.file = message.data.path
        }
      } else if (message.action === 'source') {
        if (message.reftype === 'sqlite') {
          // what is data
          let desribesD = Object.keys(message.data)
          for (let dd of desribesD) {
            if (dd === 'headers') {
              this.newDatafile.columns = message.data.headers
            }
            if (dd === 'tables') {
              this.newDatafile.devicecolumns = message.data.tables.headers
            }
            if (dd === 'devices') {
              this.newDatafile.device = message.data.devices
            }
          }
        }
      } else if (message.type === 'library-open') {
      } else if (message.type === 'publiclibrary') {
        let typeRefcontracts = Object.keys(message.referenceContracts)
        // look over and see if the library has been setup?
        let setupContracts = []
        for (let typeContract of typeRefcontracts) {
          if(message.referenceContracts[typeContract].length !== 0) {
            setupContracts.push(true)
          }
        }
        let checkLogic = (element) => element  === true;
        let checkSetup = setupContracts.some(checkLogic)
        if (checkSetup === false) {
          this.startLibrary = true
        } else {
          this.publicLibrary = message
        }
      } else if (message.action === 'referenc-contract') {
        // call HOP to get latest changes to public library
        this.sendMessage('get-public-library')
      } else if (message.action === 'peer-library') {
        // prepare network experiment lists
        let newPair = {}
        newPair.question = questionStart
        newPair.reply = message.data
        // check if library is start?
        if (this.storeAI.chatAttention.length !== 0) {
          this.storeAI.historyPair[this.storeAI.chatAttention].push(newPair)
        } else {
          this.storeAI.historyPair['library-start'] = []
          this.storeAI.historyPair['library-start'].push(newPair)
        }
        // peer library data
        this.peerLibrary = message.referenceContracts
        // prepare the list of peer experiments for library display
        if (message.networkPeerExpModules.length > 0) {
          this.peerExperimentList = this.utilLibrary.prepareBentoSpaceJoinedNXPlist(message.networkPeerExpModules, this.publicLibrary.referenceContracts)
          // keep track NXP contract bundle
          this.peerLibraryNXP = message.networkPeerExpModules
        }
      } else if (message.action === 'new-modules') {
        this.genesisModules = message.data.modules
      } else if (message.action === 'new-experiment') {
        // notify peer created success
        this.saveSuccessnxp = true
        // now clear the module builder forms hodlers
        let resetNXP = {
          questionLive: [],
          packagingLive: [],
          computeLive: [],
          visualiseLive: []
        }
        this.newnxp = resetNXP
      } else if (message.action === 'replicate-publiclibrary') {
        this.sendMessage('get-library')
        this.sendMessage('get-results')
      } else if (message.action === 'join-experiment') {
        // clear and close join form
        this.joinNXP = false
        // add to private nxp list
        let expList = []
        expList.push(message.data)
        let addJoinExp = this.utilLibrary.prepareBentoSpaceJoinedNXPlist(expList, this.publicLibrary.referenceContracts)
        for(let jlist of addJoinExp.data) {
          this.peerExperimentList.data.push(jlist)
        }
        // call the peer library to get all the new modules active in Library
        this.sendMessage('get-library')
      } else if (message.action === 'results') {
        this.peerResults = message.data
      } else if (message.action === 'ledger') {
        this.peerLedger = message.data
      }
    },
    prepareExperimentSettings (bboxid) {
      // let NXPcontract = storeLibrary.prepareExperimentSummary(props.bboxid)
      // let NXPcontract = this.storeAI.boxLibSummary[bboxid].data
      // let key = Object.keys(this.storeAI.boxLibSummary[bboxid].data)
      // let modulesContracts = NXPcontract[key].modules
      // let extractedSettings = this.utilLibrary.moduleExtractSettings(modulesContracts)
      // console.log('textract setings----------------')
      // console.log(extractedSettings)
      // NXPcontract.modules = this.utilLibrary.boxLibrarySummary(modules)
      // temp test
      let datatypeContext = {}
      datatypeContext.xaxis = ['time']
      datatypeContext.yaxis = [11, 22, 33]
      datatypeContext.category = [22, 22, 22]
      this.storeBentoBox.openDataSettings[bboxid] = datatypeContext
      // this.openDataSettings[bboxid] = extractedSettings
    },
    prepareJoinNXPMessage (genContract, settings) {
      //let updateJoinSettings = this.utilLibrary.updateSettings(genContract, settings)
      let updateJoinSettings = {}
      updateJoinSettings.genesisnxp = genContract.value
      updateJoinSettings.updates = settings
      let libMessageout = {}
      libMessageout.type = 'library'
      libMessageout.action = 'contracts'
      libMessageout.reftype = 'experiment'
      libMessageout.privacy = 'private'
      libMessageout.task = 'join'
      libMessageout.data = updateJoinSettings
      libMessageout.bbid = 'lib' + genContract.value.exp.key
      this.sendSocket.send_message(libMessageout)
    },
    prepareLibraryViewMessage (contract, action) {
      // create a bbid
      let boxID = {}
      boxID.contract = contract
      boxID.active = true
      let date = new Date()
      // get the time as a string
      let time = date.toLocaleTimeString()
      boxID.time =  time
      let contractQuery = this.utilLibrary.matchNXPcontract(contract.id, this.peerLibraryNXP)
      let bbidHash = hashObject(boxID)
      let libMessageout = {}
      libMessageout.type = 'library'
      libMessageout.action = 'contracts'
      libMessageout.reftype = 'experiment'
      libMessageout.privacy = 'private'
      libMessageout.task = 'assemble'
      libMessageout.data = contractQuery
      libMessageout.bbid = bbidHash
      // keep track of message
      this.storeAI.helpchatHistory.push(libMessageout)
      // prepare historypair for receiving HOP data
      let pairBB = {}
      let question = {}
      question.data = { active: true }
      question.bbid = bbidHash
      pairBB.question = question
      let reply = {}
      reply.time = new Date()
      reply.type = 'experiment'
      reply.data = {}
      pairBB.reply = reply
      this.storeAI.historyPair[this.storeAI.chatAttention] = []
      this.storeAI.historyPair[this.storeAI.chatAttention].push(pairBB)
      // console.log('view jioned NXP')
      // console.log(libMessageout)
      this.sendSocket.send_message(libMessageout)
    },
    prepareGenesisModContracts (message) {
      let aiMessageout = {}
      aiMessageout.type = 'library'
      aiMessageout.reftype = 'ignore'
      aiMessageout.action = 'contracts'
      aiMessageout.task = 'modules-genesis'
      aiMessageout.privacy = 'public'
      aiMessageout.data = {}
      aiMessageout.bbid = ''
      this.sendSocket.send_message(aiMessageout)
    },
    prepareGenesisContract (message) {
      let libMessage = {}
      libMessage.type = 'library'
      libMessage.reftype = 'ignore'
      libMessage.action = 'contracts'
      libMessage.task = 'experiment-genesis'
      libMessage.privacy = 'public'
      libMessage.data = message
      libMessage.bbid = ''
      // this.sendMessageHOP(aiMessageout)
      this.sendSocket.send_message(libMessage)
    },
    prepPublicNXPlist () {
      this.listPublicNXP = this.utilLibrary.preparePublicNXPlist(this.publicLibrary.referenceContracts)
    },
    updateHOPqueryContracts (HOPq) {
      // let hashQuestion = hashObject(this.inputAskHistory[this.qcount])
      let aiMessageout = {}
      aiMessageout.type = 'library'
      aiMessageout.reftype = 'ignore'
      aiMessageout.action = 'contracts'
      aiMessageout.task = 'update-hopquery'
      aiMessageout.data = HOPq
      aiMessageout.bbid = HOPq.bbid
      // console.log('LIB--update QUERY out')
      // console.log(aiMessageout)
      this.sendSocket.send_message(aiMessageout)
      this.storeAI.helpchatHistory.push(aiMessageout)
      this.storeAI.qcount++
    },
    matchGenesisContract (gid)  {
      let genesisContract = this.utilLibrary.matchPublicNXPcontract(gid.id, this.publicLibrary.networkExpModules)
      return genesisContract
    },
    removeExpModContract (data, privacy) {
      const refContract = {}
      refContract.type = 'library'
      refContract.action = 'contracts'
      refContract.privacy = privacy
      refContract.reftype = privacy
      refContract.task = 'DEL'
      refContract.data = data
      this.sendSocket.send_message(refContract)
    },
    sendMessage (hopMessage) {
      if (hopMessage === 'get-library') {
        // peer library start contracts
        const refContract = {}
        refContract.type = 'library'
        refContract.action = 'contracts'
        refContract.privacy = 'public' // 'public library'
        refContract.reftype = 'public' // 'public library'
        refContract.task = 'GET'
        // refContract.jwt = this.state.jwttoken
        this.sendSocket.send_message(refContract)
        const refContract2 = {}
        refContract2.type = 'library'
        refContract2.action = 'contracts'
        refContract2.privacy = 'private' // 'privatelibrary'
        refContract2.reftype = 'private' // 'privatelibrary'
        refContract2.task = 'GET'
        this.sendSocket.send_message(refContract2)
      } else if (hopMessage === 'get-public-library') {
        // peer library start contracts
        const refContract = {}
        refContract.type = 'library'
        refContract.action = 'contracts'
        refContract.privacy = 'public' // 'public library'
        refContract.reftype = 'public' // 'public library'
        refContract.task = 'GET'
        // refContract.jwt = this.state.jwttoken
        this.sendSocket.send_message(refContract)
      } else if (hopMessage === 'get-results')  {
        const resultsPeer = {}
        resultsPeer.type = 'library'
        resultsPeer.action = 'results'
        resultsPeer.privacy = 'private'
        resultsPeer.reftype = 'results' // peer results index
        resultsPeer.task = 'GET'
        // resultsPeer.jwt = this.state.jwttoken
        this.sendSocket.send_message(resultsPeer)
        const ledgerPeer = {}
        ledgerPeer.type = 'library'
        ledgerPeer.action = 'ledger'
        ledgerPeer.privacy = 'private'
        ledgerPeer.reftype = 'ledger' // peer results index
        ledgerPeer.task = 'GET'
        // ledgerPeer.jwt = this.state.jwttoken
        this.sendSocket.send_message(ledgerPeer)
      } else {
        this.sendSocket.send_message(hopMessage)
      }
    }
  }
})