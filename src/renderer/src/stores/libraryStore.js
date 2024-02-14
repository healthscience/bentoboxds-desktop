import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { aiInterfaceStore } from '@/stores/aiInterface.js'
import LibraryUtility from '@/stores/hopUtility/libraryUtility.js'
import { useSocketStore } from '@/stores/socket.js'

export const libraryStore = defineStore('librarystore', {
  state: () => ({
    libraryStatus: false,
    libPeerview: false,
    liveBentoBox: aiInterfaceStore(),
    utilLibrary: new LibraryUtility(),
    sendSocket: useSocketStore(),
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
    linesLimit: [],
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
    dtcolumns: [],
    fileSaveStatus: false,
    fileFeedback: ''
  }),
  actions: {
    // since we rely on `this`, we cannot use an arrow function
    processReply (message, questionStart) {
      if (message.action === 'save-file') {
        // set message
        this.libraryMessage = message.data
        this.newPackagingForm.apicolumns = message.data.data.headerinfo.splitwords
      } else if (message.type === 'publiclibrary') {
        // prepare public library
        // let newPair = {}
        // newPair.question = questionStart
        // newPair.reply = message.data
        // this.liveBentoBox.historyPair.push(newPair)
        this.publicLibrary = message.referenceContracts
      } else if (message.action === 'library-peerlibrary') {
        // prepare network experiment lists
        let newPair = {}
        newPair.question = questionStart
        newPair.reply = message.data
        this.liveBentoBox.historyPair[this.liveBentoBox.chatAttention].push(newPair)
        // peer library data
        this.peerLibrary = message.data.data.referenceContracts
        // prepare the list of peer experiments for library display
        this.peerExperimentList = this.utilLibrary.prepareBentoSpaceJoinedNXPlist(message.data.data.networkPeerExpModules)
        // keep track NXP contract bundle
        this.peerLibraryNXP = message.data.data.networkPeerExpModules
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