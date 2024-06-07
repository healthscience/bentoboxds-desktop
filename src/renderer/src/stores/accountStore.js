import { defineStore } from 'pinia'
import { useSocketStore } from '@/stores/socket.js'
import { aiInterfaceStore } from '@/stores/aiInterface.js'
import { libraryStore } from '@/stores/libraryStore.js'

export const accountStore = defineStore('account', {
  state: () => ({
    sendSocket: useSocketStore(),
    storeAI: aiInterfaceStore(),
    storeLibrary: libraryStore(),
    accountMenu: 'Sign-in',
    accountStatus: false,
    peerauth: false,
    networkInfo: {},
    warmPeers: [],
    publickeyDrive: [],
    publicKeysList: [],
    sharePubkey: '',
    agentList: [{ name: 'cale-gpt4all', active: false }, {name: 'cale-evolution', active: false }]
  }),
  actions: {
    processReply (received) {
      if (received.action === 'hyperbee-pubkeys') {
        this.publicKeysList = received.data
        // ask for library
        this.storeLibrary.startLibrary()
      } else if (received.action === 'drive-pubkeys') {
        this.publickeyDrive = received.data
      } else if (received.action === 'warm-peers') {
        this.warmPeers = received.data
      } else if (received.action === 'network-keys') {
        this.networkInfo.publickey = received.data.publickey
      }
    },
    shareProtocol (boxid) {
      // set peer live
      let peerDetails = {}
      peerDetails.name = 'peer'
      peerDetails.publickey = this.sharePubkey
      peerDetails.datastores = ''
      // check if peer already added
      if (this.warmPeers.length > 0) {
        for (let wp of this.warmPeers) {
          if (wp.publickey === peerDetails.publickey) {
            
          } else {
            this.warmPeers.push(peerDetails)
          }
        }
      } else {
        this.warmPeers.push(peerDetails)
      }
      let shareContext = {}
      // need to lookup nxp from boxid
      let sfMatch = {}
      for (let histMatch of this.storeAI.bbidHOPid) {
        if (histMatch.bbid === boxid) {
          sfMatch = histMatch
        }
      }
      // match to summary from SafeFlow (could be first time or saved)
      let sfSummary = {}
      for (let sumSF of this.storeAI.hopSummary) {
        if (sumSF.summary.bbid === boxid) {
          sfSummary = sumSF
        }
      }
      shareContext.hop = sfSummary.summary
      shareContext.publickey = this.sharePubkey
      shareContext.data = this.storeAI.visData[boxid]
      let shareInfo = {}
      shareInfo.type = 'network'
      shareInfo.action = 'share'
      shareInfo.task = 'peer-join'
      shareInfo.reftype = 'null'
      shareInfo.privacy = 'private'
      shareInfo.data = shareContext
      console.log('share')
      console.log(shareInfo)
      this.sendMessageHOP(shareInfo)
    },
    processAgentStatus (data) {
      for (let agent of this.agentList) {
        if (agent.name === data.name) {
          if (data.status === 'loaded') {
            agent.active = true
          } else if (data.status === 'closed') {
            agent.active = false
          }
        }
      }
    },
    sendMessageHOP (message) {
      this.sendSocket.send_message(message)
    }
  }
})