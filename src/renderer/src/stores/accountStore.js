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
    invitedPeers: [],
    beebeeAccountFeedback: '',
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
      } else if (received.action === 'peer-new-relationship') {
        this.checkPeerStatus(received.data.data)
      } else if (received.action === 'peer-share-topic') {
        this.updateTopicSetter(received.data)
      } else if (received.action === 'complete-topic-save') {
      } else if (received.action === 'peer-share-fail') {
        // ask peer if want to save and try again?
        this.setNotifyFailConnection(received.data)
      } else if (received.action === 'peer-history') {
        this.warmPeers = received.data
      }
    },
    addPeertoNetwork (peer) {
      // try to see if other peer is live on network
      let shareInfo = {}
      shareInfo.type = 'network'
      shareInfo.action = 'share'
      shareInfo.task = 'peer-share-invite'
      shareInfo.reftype = 'null'
      shareInfo.privacy = 'private'
      shareInfo.data = peer
      // keep tabs of invite details
      this.invitedPeers.push(peer)
      this.sendMessageHOP(shareInfo)


      // if not save details (timed accept?  TODO)
      /* let libMessageout = {}
      libMessageout.type = 'library'
      libMessageout.action = 'account'
      libMessageout.reftype = 'new-peer'
      libMessageout.privacy = 'private'
      libMessageout.task = 'PUT'
      libMessageout.data = peer
      libMessageout.bbid = ''
      this.sendSocket.send_message(libMessageout)*/
    },
    updateTopicSetter (update) {
      let updatePeerList = []
      for (let wpeer of this.warmPeers) {
        if (wpeer.key === update.key) {
          updatePeerList.push(update)
        } else {
          updatePeerList.push(wpeer)
        }
      }
      this.warmPeers = updatePeerList
    },
    updateTopicPeertoNetwork (update) {
      // update warmpeer item to at drop
      let updateWarmPeers = []
      for (let wpeer of this.warmPeers) {
        if (wpeer.key === update.publickey) {
          wpeer.value.live = update.live
          wpeer.value.topic = update.topic
          updateWarmPeers.push(wpeer)
        } else {
          updateWarmPeers.push(wpeer)
        }
      }
      this.warmPeers = updateWarmPeers
    },
    checkPeerStatus (peer) {
      // brand new peer first time or update save for topic
      let warmMatch = {}
      for (let wpeer of this.warmPeers) {
        if (wpeer.key === peer.key) {
          warmMatch = wpeer
        }
      }
      if (Object.keys(warmMatch).length === 0) {
        this.warmPeers.push(peer)
      } else {
        console.log('update live stust true already stt')
      }
      // set notification
      let peerConnectNot = {}
      peerConnectNot.type = 'network-notification'
      peerConnectNot.action = 'warm-peer-connect'
      peerConnectNot.data = {}
      this.storeAI.processNotification(peerConnectNot)
    },
    shareProtocol (boxid, shareType) {
      console.log('shareProtocol', boxid, shareType)
      // existing peer relationshiop? or first time
      let existingMatch = this.utilPeers.checkPeerMatch(this.warmPeers, this.sharePubkey)
      let existingPeer = false
      let topicSet = ''
      // check if warm peer of first time
      if (Object.keys(existingMatch).length === 0) {
        existingPeer = false
      } else {
        existingPeer = true
        // put logic test as 1 can be first time ongoing or returning using topic
        // topicSet = existingMatch.value.topic
      }

      if (existingPeer === true) {
        // has the topic between establish or is this first timme
        if (topicSet.length !== 0) {
          // use topic to generative topic, connect that way then upgrade to direct connect
          //  Buffer.alloc(32).fill('hello world')
          let shareInfo = {}
          shareInfo.type = 'network'
          shareInfo.action = 'share'
          shareInfo.task = 'peer-share-topic'
          shareInfo.reftype = 'null'
          shareInfo.privacy = 'private'
          shareInfo.data = topicSet
          this.sendMessageHOP(shareInfo)
        } else {
          // start normal first time warm peer direct connect
          if (shareType === 'privatechart') {
            this.prepareChartShareDirect(boxid)
          } else if (shareType === 'cue-space') {
            this.prepareSpaceShareDirect(boxid)
          } else if (shareType === 'n=1-experiment') {
            console.log('share n1')
            this.prepareN1ShareDirect(boxid)
          }
        }
      } else {
        if (shareType === 'privatechart') {
          this.prepareChartShareDirect(boxid) 
        } else if (shareType === 'cue-space') {
          this.prepareSpaceShareDirect(boxid)
        } else if (shareType === 'n=1-experiment') {
          // the public library key to allow discover

        }
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
    setNotifyFailConnection (data) {
      this.beebeeAccountFeedback = 'Connecting taking a long time or has failed with' + data.publickey
    },
    removePeerfromNetwork (peer) {
      // remove from warmpeers list
      let updatePeer = []
      for (let wpeer of this.warmPeers) {
        if (wpeer.key !== peer.key) {
          updatePeer.push(wpeer)
        }
      }
      this.warmPeers = updatePeer
      // send message via HOP
      let shareInfo = {}
      shareInfo.type = 'library'
      shareInfo.action = 'account'
      shareInfo.task = 'DEL'
      shareInfo.reftype = 'null'
      shareInfo.privacy = 'private'
      shareInfo.data = peer
      this.sendMessageHOP(shareInfo)
    },
    prepareChartShareDirect (boxid) {
      let peerDetails = {}
      peerDetails.name = 'peer'
      peerDetails.publickey = this.sharePubkey
      peerDetails.datastores = ''
      // this.warmPeers = this.utilPeers.checkPeerMatch(this.warmPeers, peerDetails)
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
      let dataShare = {}
      dataShare.type = 'private-chart'
      dataShare.display = 'html'
      dataShare.bbid = boxid
      dataShare.data = this.storeAI.visData[boxid]
      shareContext.hop = sfSummary.summary
      shareContext.publickey = this.sharePubkey
      shareContext.data = dataShare
      let shareInfo = {}
      shareInfo.type = 'network'
      shareInfo.action = 'share'
      shareInfo.task = 'peer-share-invite'
      shareInfo.reftype = 'null'
      shareInfo.privacy = 'private'
      shareInfo.data = shareContext
      console.log(shareInfo)
      this.sendMessageHOP(shareInfo)
    },
    prepareSpaceShareDirect (boxid) {
      // gather space context and prepare share data
      // need utilty for each putling together
      let spaceContent = {}
      // get the cue contract spaceid NOTE
      spaceContent.cuecontract = this.storeAI.liveBspace
      spaceContent.n1 = this.utilSpacecontent.n1Match()
      spaceContent.media = this.utilSpacecontent.mediaMatch(this.storeCues.mediaMatch[this.storeAI.liveBspace.cueid])
      spaceContent.research = this.utilSpacecontent.researchMatch(this.storeCues.researchPapers[this.storeAI.liveBspace.cueid])
      spaceContent.markers = this.utilSpacecontent.markerMatch(this.storeCues.markerMatch[this.storeAI.liveBspace.cueid])
      spaceContent.products = this.utilSpacecontent.productMatch(this.storeCues.productMatch[this.storeAI.liveBspace.cueid])
      let spaceDetails = {}
      spaceDetails.name = 'private-cue-space'
      spaceDetails.publickey = this.sharePubkey
      spaceDetails.content = spaceContent
      spaceDetails.cueid = this.storeAI.liveBspace.cueid
      this.warmPeers = this.utilPeers.checkPeerMatch(this.warmPeers, spaceDetails)
      let shareContext = {}
      shareContext.type = 'private-cue-space'
      shareContext.display = 'space'
      shareContext.publickey = spaceDetails.publickey
      shareContext.data = spaceDetails
      let shareInfo = {}
      shareInfo.type = 'network'
      shareInfo.action = 'share'
      shareInfo.task = 'cue-space'
      shareInfo.reftype = 'null'
      shareInfo.privacy = 'private'
      shareInfo.data = shareContext
      console.log(shareInfo)
      this.sendMessageHOP(shareInfo)
    },
    prepareN1ShareDirect () {
      console.log('share n1 parpe')
      let publicLibrary = ''
      for (let hbee of this.publicKeysList) {
        if (hbee.store === 'publiclibrary') {
          publicLibrary = hbee.pubkey
        }
      }
      let peerDetails = {}
      peerDetails.name = 'peer'
      peerDetails.type = 'public-n1-experiment'
      peerDetails.publickey = this.sharePubkey
      peerDetails.datastores = publicLibrary
      peerDetails.boardID = this.shareBoardNXP.id
      peerDetails.boardname = this.shareBoardNXP.name
      this.warmPeers = this.utilPeers.checkPeerMatch(this.warmPeers, peerDetails)
      // now build public library info to be share (replicated)
      let shareContext = {}
      shareContext.type = 'public-n1-experiment'
      shareContext.boardID = this.shareBoardNXP.id
      shareContext.publickey = peerDetails.publickey
      shareContext.data = peerDetails
      let shareInfo = {}
      shareInfo.type = 'network'
      shareInfo.action = 'share'
      shareInfo.task = 'public-n1-experiment'
      shareInfo.reftype = 'null'
      shareInfo.privacy = 'public'
      shareInfo.data = shareContext
      console.log(shareInfo)
      this.sendMessageHOP(shareInfo)
    },
    sendMessageHOP (message) {
      this.sendSocket.send_message(message)
    }
  }
})