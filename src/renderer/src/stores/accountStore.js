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
    inviteListGenerated: [],
    pendingInvites: [],
    invitedPeers: [],
    beebeeAccountFeedback: '',
    beebeeConnectFeedback: '',
    publickeyDrive: [],
    publicKeysList: [],
    sharePubkey: '',
    shareBoardNXP: {}
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
      } else if (received.action === 'drive-pubkey') {
        this.publickeyDrive = received.data
      } else if (received.action === 'warm-peers') {
        this.warmPeers = received.data
      } else if (received.action === 'network-keys') {
        this.networkInfo.publickey = received.data.publickey
      } else if (received.action === 'peer-new-relationship') {
        this.checkPeerStatus(received.data.data)
      } else if (received.action === 'peer-share-topic') {
        this.updateTopicSetter(received.data)
      } else if (received.action === 'network-peer-disconnect') {
        this.updatePeerDisconnect(received.data)
      } else if (received.action === 'invite-live-accepted') {
        this.updatePeerlive(received.data)
      } else if (received.action === 'network-peer-name') {
        this.updatePeerName(received.data)
      } else if (received.action === 'complete-topic-save') {
      } else if (received.action === 'peer-share-fail') {
        // ask peer if want to save and try again?
        this.setNotifyFailConnection(received.data)
      } else if (received.action === 'peer-history') {
        this.warmPeers = received.data
      } else if (received.action === 'network-peer-live') {
        this.updateWarmPeerLive(received.data)
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
    },
    retryPeertoNetwork (peer) {
      // try to see if other peer is live on network
      let shareInfo = {}
      shareInfo.type = 'network'
      shareInfo.action = 'retry'
      shareInfo.task = 'peer-retry-connect'
      shareInfo.reftype = 'null'
      shareInfo.privacy = 'private'
      shareInfo.data = peer
      this.sendMessageHOP(shareInfo)
    },
    updateTopicSetter (update) {
      let updatePeerList = []
      for (let wpeer of this.warmPeers) {
        if (wpeer.key === update.key) {
          updatePeerList.push(update)
          // update peer invite gen list
          this.updateGeninviteList(update)
        } else {
          updatePeerList.push(wpeer)
        }
      }
      this.warmPeers = updatePeerList
      // remove from pending list
      let updatePendList = []
      for (let pendP of this.pendingInvites) {
        let splitInvite = pendP.publickey.split('-')
        if(splitInvite[1] === update.key) {
          // remove
        } else {
          updatePendList.push(pendP)
        }
      }
      this.pendingInvites = updatePendList
    },
    updateTopicPeertoNetwork (update) {
      // update warmpeer item to at drop
      /* let updateWarmPeers = []
      for (let wpeer of this.warmPeers) {
        if (wpeer.key === update.publickey) {
          wpeer.value.live = update.live
          wpeer.value.topic = update.topic
          updateWarmPeers.push(wpeer)
        } else {
          updateWarmPeers.push(wpeer)
        }
      } */
      // this.warmPeers = updateWarmPeers
    },
    updatePeerName (update) {
      let updateNameList = []
      for (let wpeer of this.warmPeers) {
        if (wpeer.key === update.key) {
          let peerOrg = wpeer
          peerOrg.value.name = update.value.name
          updateNameList.push(peerOrg)
        } else {
          updateNameList.push(wpeer)
        }
      }
      this.warmPeers = updateNameList  
    },
    updatePeerlive (update) {
      let updateNameList = []
      for (let wpeer of this.warmPeers) {
        if (wpeer.key === update.data.publickey) {
          let peerOrg = wpeer
          peerOrg.value.matchted = true
          peerOrg.value.live = true
          updateNameList.push(peerOrg)
        } else {
          updateNameList.push(wpeer)
        }
      }
      this.warmPeers = updateNameList
    },
    updatePeerDisconnect (update) {
      let updateNameList = []
      for (let wpeer of this.warmPeers) {
        if (wpeer.key === update.publickey) {
          let peerOrg = wpeer
          peerOrg.value.matchted = true
          peerOrg.value.live = false
          updateNameList.push(peerOrg)
        } else {
          updateNameList.push(wpeer)
        }
      }
      this.warmPeers = updateNameList
    },
    updateGeninviteList (peer) {
      // also set feedback connection message
      this.beebeeConnectFeedback = 'Connected to ' + peer.value.name
      let updateInviteList = []
      for (let invite of this.inviteListGenerated) {
        if (invite.name === peer.value.name) {
          invite.matched = true
          updateInviteList.push(invite)
        } else {
          updateInviteList.push(invite)
        }
      }
      this.inviteListGenerated = updateInviteList
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
        console.log('update live stust true already set')
      }
      // set notification
      let peerConnectNot = {}
      peerConnectNot.type = 'network-notification'
      peerConnectNot.action = 'warm-peer-connect'
      peerConnectNot.data = {}
      this.storeAI.processNotification(peerConnectNot)
    },
    updateWarmPeerLive (peerIn) {
      // update warm peer set status to live connection
      let livePeerList = []
      for (let wpeer of this.warmPeers) {
        if (wpeer.key === peerIn.publickey) {
          wpeer.value.live = true
          livePeerList.push(wpeer)
        } else {
          livePeerList.push(wpeer)
        }
      }
      this.warmPeers = livePeerList
    },
    shareProtocol (boxid, shareType) {
      // existing peer relationshiop? or first time
      let existingMatch = this.utilPeers.checkPeerMatch(this.warmPeers, this.sharePubkey.key)
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
    shareCodename (peerInvite) {
      let shareInfo = {}
      shareInfo.type = 'network'
      shareInfo.action = 'share'
      shareInfo.task = 'peer-share-codename'
      shareInfo.reftype = 'null'
      shareInfo.privacy = 'private'
      shareInfo.data = peerInvite
      this.sendMessageHOP(shareInfo)
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
      peerDetails.publickey = this.sharePubkey.key
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
      shareContext.publickey = this.sharePubkey.key
      shareContext.data = dataShare
      let shareInfo = {}
      shareInfo.type = 'network'
      shareInfo.action = 'share'
      shareInfo.task = 'peer-share-invite'
      shareInfo.reftype = 'null'
      shareInfo.privacy = 'private'
      shareInfo.data = shareContext
      this.sendMessageHOP(shareInfo)
      this.sharePubkey = ''
    },
    prepareSpaceShareDirect (boxid) {
      // gather space context and prepare share data
      // need utilty for each putling together
      let spaceContent = {}
      // get the cue contract spaceid NOTE
      spaceContent.cuecontract = this.storeAI.liveBspace
      // what bentobox N1 are active in this cue space?
      let publicLibrary = ''
      for (let hbee of this.publicKeysList) {
        if (hbee.store === 'publiclibrary') {
          publicLibrary = hbee.pubkey
        }
      }
      spaceContent.bbn1 = this.utilPeers.n1Match(this.sharePubkey.key, publicLibrary, this.storeAI.liveBspace.cueid, this.storeAI.bentoboxList[this.storeAI.liveBspace.cueid], this.storeLibrary.peerLibrary.experiment, this.storeBentoBox.locationBbox[this.storeAI.liveBspace.cueid])
      spaceContent.media = this.utilSpacecontent.mediaMatch(this.storeCues.mediaMatch[this.storeAI.liveBspace.cueid])
      spaceContent.research = this.utilSpacecontent.researchMatch(this.storeCues.researchPapers[this.storeAI.liveBspace.cueid])
      spaceContent.markers = this.utilSpacecontent.markerMatch(this.storeCues.markerMatch[this.storeAI.liveBspace.cueid])
      spaceContent.products = this.utilSpacecontent.productMatch(this.storeCues.productMatch[this.storeAI.liveBspace.cueid])
      let spaceDetails = {}
      spaceDetails.name = 'private-cue-space'
      spaceDetails.type = 'private-cue-space'
      spaceDetails.publickey = this.sharePubkey.key
      spaceDetails.content = spaceContent
      spaceDetails.cueid = this.storeAI.liveBspace.cueid
      // this.warmPeers = this.utilPeers.checkPeerMatch(this.warmPeers, spaceDetails)
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
      this.sendMessageHOP(shareInfo)
      this.sharePubkey = ''
    },
    prepareN1ShareDirect () {
      let publicLibrary = ''
      for (let hbee of this.publicKeysList) {
        if (hbee.store === 'publiclibrary') {
          publicLibrary = hbee.pubkey
        }
      }
      let peerDetails = {}
      peerDetails.name = 'peer'
      peerDetails.type = 'public-n1-experiment'
      peerDetails.publickey = this.sharePubkey.key
      peerDetails.datastores = publicLibrary
      peerDetails.boardID = this.shareBoardNXP.id
      peerDetails.boardname = this.shareBoardNXP.name
      // this.warmPeers = this.utilPeers.checkPeerMatch(this.warmPeers, peerDetails)
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
      this.sendMessageHOP(shareInfo)
      this.sharePubkey = ''
    },
    sendMessageHOP (message) {
      this.sendSocket.send_message(message)
    }
  }
})