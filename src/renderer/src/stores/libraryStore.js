import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { aiInterfaceStore } from '@/stores/aiInterface.js'
import LibraryUtility from '@/stores/hopUtility/libraryUtility.js'
import { useSocketStore } from '@/stores/socket.js'
import hashObject from 'object-hash'

export const libraryStore = defineStore('librarystore', {
  state: () => ({
    libraryStatus: false,
    libPeerview: false,
    newNXP: false,
    storeAI: aiInterfaceStore(),
    utilLibrary: new LibraryUtility(),
    sendSocket: useSocketStore(),
    startLibrary: false,
    libraryMessage: '',
    uploadStatus: false,
    restStatus: false,
    peerExperimentList: {
      data: [1, 2, 3],
      column: ['a', 'b', 'c']
    },
    publicLibrary: [],
    peerLibrary: [],
    peerResults: [],
    peerLedger: [],
    peerLibraryNXP: [],
    newRefcontractForm: {},
    genesisModules: [],
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
      columns: []
    },
    newPackagingForm:
    {
      authrequired: false,
      type: '',
      filename: '',
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
    newModuleList: [],
    buildNewExperiment: [],
    refcontractOption: [ { ref: true, id: 'ref1', name: 'compute' }],
    dtcolumns: [],
    fileSaveStatus: false,
    fileFeedback: ''
  }),
  actions: {
    // since we rely on `this`, we cannot use an arrow function
    processReply (message, questionStart) {
      // console.log('library back')
      // console.log(message)
      if (message.action === 'save-file') {
        // set message
        if (message.task === 'sqlite') {
          // need to extract out to chat prepare utility TODO
          console.log('prepare chat')
          console.log(message)
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
					bbReply.data = { text: 'Summary of tables in SQLite file, heading are:', filedata: { type: 'sqlite', file: message.data.path, columns: 'one', grid: [] }, prompt: 'Select data to chart:', options: headerLocal[hashQuestion], }
					bbReply.bbid = hashQuestion
					let newPair = {}
					newPair.question = question
					newPair.reply = bbReply
					this.storeAI.historyPair[this.storeAI.chatAttention].push(newPair)


        } else {
          this.libraryMessage = message.data
          this.newPackagingForm.apicolumns = message.data.data.headerinfo.splitwords
        }
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
          this.publicLibrary = message.referenceContracts
        }
      } else if (message.action === 'library-peerlibrary') {
        // prepare network experiment lists
        let newPair = {}
        newPair.question = questionStart
        newPair.reply = message.data
        this.storeAI.historyPair[this.storeAI.chatAttention].push(newPair)
        // peer library data
        this.peerLibrary = message.data.data.referenceContracts
        // prepare the list of peer experiments for library display
        if (message.data.data.networkPeerExpModules.length > 0) {
          this.peerExperimentList = this.utilLibrary.prepareBentoSpaceJoinedNXPlist(message.data.data.networkPeerExpModules)
          // keep track NXP contract bundle
          this.peerLibraryNXP = message.data.data.networkPeerExpModules
        }
      } else if (message.action === 'new-experiment') {
        console.log('new NXP')
        console.log(message)
        this.genesisModules = message.data.modules
      } else if (message.action === 'replicate-publiclibrary') {
        this.sendMessage('get-library')
        this.sendMessage('get-results')
      } else if (message.action === 'results') {
        this.peerResults = message.data
      } else if (message.action === 'ledger') {
        this.peerLedger = message.data
      }
    },
    prepareLibraryMessage (contractID, action) {
      let contractData = this.utilLibrary.matchNXPcontract(contractID, this.peerLibraryNXP)
      let libMessageout = {}
      libMessageout.type = 'library'
      libMessageout.action = 'contracts'
      libMessageout.reftype = 'experiment'
      libMessageout.privacy = 'private'
      libMessageout.task = 'assemble'
      libMessageout.data = contractData
      libMessageout.bbid = 'nxp-123'
      this.sendSocket.send_message(libMessageout)
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
        // refContract2.jwt = this.state.jwttoken
        this.sendSocket.send_message(refContract2)
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