import { defineStore } from 'pinia'
import { useSocketStore } from '@/stores/socket.js'
import { cuesStore } from "@/stores/cuesStore.js"
import { aiInterfaceStore } from '@/stores/aiInterface.js'
import { libraryStore } from '@/stores/libraryStore.js'
import { bentoboxStore } from "@/stores/bentoboxStore.js"
import PeersUtility from '@/stores/hopUtility/peersUtility.js'
import SpaceUtility from '@/stores/hopUtility/spaceContentUtil.js'

export const accountStore = defineStore('account', {
  state: () => ({
    sendSocket: useSocketStore(),
    storeCues: cuesStore(),
    storeAI: aiInterfaceStore(),
    storeLibrary: libraryStore(),
    storeBentoBox: bentoboxStore(),
    utilPeers: new PeersUtility(),
    utilSpacecontent: new SpaceUtility(),
    accountMenu: 'Sign-in',
    accountStatus: false,
    peerauth: false,
    socketLive: false,
    HOPFlow: false,
    networkInfo: {},
    warmPeers: [],
    publickeyDrive: [],
    publicKeysList: [],
    sharePubkey: '',
    shareBoardNXP: {},
    agentList: [{ name: 'cale-gpt4all', active: false, loading: false }, {name: 'cale-evolution', active: false, loading: false }]
  }),
  actions: {
    processReply (received) {
      if (received.action === 'hop-verify') {
        // set token for subsequent HOP messages
        this.sendSocket.jwt = received.data.jwt
        // reply is verified
        this.HOPFlow = true
        this.peerauth = true
        this.storeAI.startChat = false
        this.accountStatus = false
        this.accountMenu = 'account'
        // get start public library
        this.storeLibrary.startLibrary()
        // get starting account info.
        let saveBentoBoxsetting = {}
        saveBentoBoxsetting.type = 'bentobox'
        saveBentoBoxsetting.reftype = 'chat-history'
        saveBentoBoxsetting.action = 'start'
        saveBentoBoxsetting.task = 'start'
        saveBentoBoxsetting.data = ''
        saveBentoBoxsetting.bbid = ''
        this.storeAI.sendMessageHOP(saveBentoBoxsetting) 
      } else if (received.action === 'hyperbee-pubkeys') {
        this.publicKeysList = received.data
      } else if (received.action === 'drive-pubkeys') {
        this.publickeyDrive = received.data
      } else if (received.action === 'warm-peers') {
        this.warmPeers = received.data
      } else if (received.action === 'network-keys') {
        this.networkInfo.publickey = received.data.publickey
      }
    },
    shareProtocol (boxid, shareType) {
      // set peer live
      if (shareType === 'privatechart') {
        let peerDetails = {}
        peerDetails.name = 'peer'
        peerDetails.publickey = this.sharePubkey
        peerDetails.datastores = ''
        this.warmPeers = this.utilPeers.checkPeerMatch(this.warmPeers, peerDetails)
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
        this.sendMessageHOP(shareInfo)
      } else if (shareType === 'cue-space') {
        // gather space context and prepare share data
        // need utilty for each putling together
        let spaceContent = {}
        // get the cue contract spaceid NOTE
        spaceContent.cuecontract = this.storeAI.liveBspace
        spaceContent.n1 = this.utilSpacecontent.n1Match()
        spaceContent.media = this.utilSpacecontent.mediaMatch(this.storeCues.mediaMatch[this.storeAI.liveBspace.spaceid])
        spaceContent.research = this.utilSpacecontent.researchMatch(this.storeCues.researchPapers[this.storeAI.liveBspace.spaceid])
        spaceContent.markers = this.utilSpacecontent.markerMatch(this.storeCues.markerMatch[this.storeAI.liveBspace.spaceid])
        spaceContent.products = this.utilSpacecontent.productMatch(this.storeCues.productMatch[this.storeAI.liveBspace.spaceid])
        let spaceDetails = {}
        spaceDetails.name = 'cue-space'
        spaceDetails.publickey = this.sharePubkey
        spaceDetails.content = spaceContent
        spaceDetails.spaceid = this.storeAI.liveBspace.spaceid
        this.warmPeers = this.utilPeers.checkPeerMatch(this.warmPeers, spaceDetails)
        let shareContext = {}
        shareContext.publickey = spaceDetails.publickey
        shareContext.data = spaceDetails
        let shareInfo = {}
        shareInfo.type = 'network'
        shareInfo.action = 'share'
        shareInfo.task = 'cue-space'
        shareInfo.reftype = 'null'
        shareInfo.privacy = 'private'
        shareInfo.data = shareContext
        this.sendMessageHOP(shareInfo)
      } else if (shareType === 'publicboard') {
        // the public library key to allow discover
        let publicLibrary = ''
        for (let hbee of this.publicKeysList) {
          if (hbee.store === 'publiclibrary') {
            publicLibrary = hbee.pubkey
          }
        }
        let peerDetails = {}
        peerDetails.name = 'peer'
        peerDetails.publickey = this.sharePubkey
        peerDetails.datastores = publicLibrary
        peerDetails.boardID = this.shareBoardNXP.id
        peerDetails.boardname = this.shareBoardNXP.name
        this.warmPeers = this.utilPeers.checkPeerMatch(this.warmPeers, peerDetails)
        // now build public library info to be share (replicated)
        let shareContext = {}
        shareContext.publickey = peerDetails.publickey
        shareContext.data = peerDetails
        let shareInfo = {}
        shareInfo.type = 'network'
        shareInfo.action = 'share'
        shareInfo.task = 'peer-board'
        shareInfo.reftype = 'null'
        shareInfo.privacy = 'public'
        shareInfo.data = shareContext
        this.sendMessageHOP(shareInfo)
      }
    },
    processAgentStatus (data) {
      for (let agent of this.agentList) {
        if (agent.name === data.name) {
          if (data.status === 'loaded') {
            agent.active = true
            agent.loading = false
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