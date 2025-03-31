import { shallowRef, markRaw, nextTick } from 'vue'
import { defineStore } from 'pinia'
import hashObject from 'object-hash'
import { useSocketStore } from '@/stores/socket.js'
import { bentoboxStore } from "@/stores/bentoboxStore.js"
import { libraryStore } from '@/stores/libraryStore.js'
import DataPraser from '@/stores/hopUtility/dataParse.js'
import ChatUtilty from '@/stores/hopUtility/chatUtility.js'
import ChatspaceUtilty from '@/stores/hopUtility/chatspaceUtility.js'
import { accountStore } from "@/stores/accountStore.js"
import { cuesStore } from "@/stores/cuesStore.js"

export const aiInterfaceStore = defineStore('beebeeAIstore', {
  state: () => ({
    storeAcc: accountStore(),
    sendSocket: useSocketStore(),
    storeCues: cuesStore(),
    storeBentoBox: bentoboxStore(),
    storeLibrary: libraryStore(),
    liveDataParse: new DataPraser(),
    liveChatUtil: new ChatUtilty(),
    liveChatspaceUtil: new ChatspaceUtilty(),
    cuesFeedback: '',
    cuesRelationshipFeedback: {},
    startChat: true,
    chatAttention: '',
    historyList: '',
    historyBar: false,
    beginChat: false,
    beebeeStatus: false,
    qcount: 0,
    dataBoxStatus: false,
    chatBottom: 0,
    beebeeContext: 'chat',
    decisionDoughnutCue: false,
    agentList: [{name: 'cale-evolution', active: false, loading: false, onstart: false }],
    llmModelsList: [],
    oracleData: { type: 'oracle', action: 'decision', elements: [{ label: 'muscle mass', datasets: { backgroundColor: '#01923c', data: 30 }}, { label: 'brain', datasets: { backgroundColor: '#71923c', data: 30 }}], concerns: [{ label: 'kidneys', datasets: { backgroundColor: '#b90e28', data: 30 }}, { label: 'pee more', datasets: { backgroundColor: '#e62643', data: 30 }}]},
    askQuestion: {
      text: ''
    },
    bodyDiagramShow: false,
    inputAskHistory: [],
    statusCALE:
    {
      text: 'off',
      active: false
    },
    helpchatAsk: markRaw(
    {
      text: '',
      time: '',
      active: true
    }),
    helpchatReply: '',
    helpchatHistory: shallowRef([]),
    currentQuestion: {},
    historyPair: {},
    chatSpacePair: {},
    bbidHOPid: [],
    hopSummary: [],
    futurePids: [],
    beebeeReply:
    {
      text: '... .. ...',
      time: '',
      data: {},
      active: false
    },
    boxSettings: 
    {
      opendatatools: { active: false },
      boxtoolshow: { active: false },
      vistoolsstatus: { active: false },
      scalezoom: 1,
      location: {},
      chartstyle: 'line',
      legends: true
    },
    liveFutureCollection: { active: false },
    visData: {},
    tempNumberData: {},
    tempLabelData: {},
    expandBentobox: {},
    activeFuture: {},
    futureLabelData: {},
    futureNumberData: {},
    beebeeChatLog: {},
    historySpacePair: {},
    bentochatState: false,
    bentospaceState: false,
    bentocuesState: false,
    bentodiaryState: false,
    bentoflakeState: false,
    bentographState: false,
    longPress: false,
    liveBspace: '',
    bentoboxList: { '91919191': [] },
    countNotifications: 0,
    notifList: [],
    sharePeer: {},
    boxLibSummary: {},
    boxModelUpdate: {},
    computeModuleLast: {},
    bentobesearchState: false,
    cueAction: 'cues',
    agentStatus: false,
    modelLoading: false,
    agentModelDefault: {},
    previousLLM: {}
  }),
  actions: {
    sendMessageHOP (message) {
      this.sendSocket.send_message(message)
    },
    clearData () {
      // clear all chat, space, account data
      let chatKeys = Object.keys(this.historyPair)
      for (let ck of chatKeys) {
        delete this.historyPair[ck]
      }
      // for web refresh
      location.reload()
    },
    actionBBAI () {
      // filter a list of Kentity bundles given the Experiment CNRL
      // check current state and reverse
      if (this.statusCALE.active === false) {
        this.statusCALE.active = true
        thisstate.statusCALE.text = on
      } else {
        this.state.statusCALE.active = false
        this.state.statusCALE.text = 'off'
      }
    },
    actionBBstate (context) {
      this.beebeeStatus = !this.beebeeStatus
    },
    actionNatlangIn (event, update) {
      // set context
      if (event.key === 'Enter') {
        // process the input
        this.submitAsk()
      } else {
        console.log(this.askQuestion)
      }
    },
    setupChatHistory (chat) {
      // does the chat history exist if not setup
      if (this.historyPair.hasOwnProperty(chat.chatid) === false) {
        this.historyPair[chat.chatid] = []
      }
      this.beginChat = true
    },
    submitAsk (dataInfo) {
      // check for context of beebee default is Chat, other option spaces, cues(decisions)
      if (this.beebeeContext === 'chat') {
        // remove start boxes
        this.startChat = false
        this.historyBar = true
        let saveQ = {}
        saveQ.count = this.qcount
        saveQ.text = this.askQuestion.text
        saveQ.active = true
        let date = new Date()
        // get the time as a string
        let time = date.toLocaleTimeString()
        saveQ.time = time
        this.inputAskHistory.push(saveQ)
        // provide feedback else forward to beebeeLogic via HOP
        if (this.askQuestion.text === 'yes') {
          let lastQuestion = this.historyPair[this.chatAttention].slice(-1)
          lastQuestion[0].reply.data.content = lastQuestion.reply.data.grid // this.storeLibrary.linesLimit
          this.actionFileAskInput(lastQuestion[0].reply)
        } else if (dataInfo?.id) {
          // if bbid match to that
          let matchBBox = {}
          let questionCount = []
          for (let hpair of this.historyPair[this.chatAttention]) {
            if (hpair.reply.bbid === dataInfo.bbid) {
              matchBBox = hpair
              questionCount.push(hpair)
            }
          }
          if (questionCount.length > 1) {
            matchBBox = questionCount[0]
          }
          if (matchBBox) {
            let lastQuestion = matchBBox
            lastQuestion.reply.data.content = matchBBox.reply.data.filedata.grid
            lastQuestion.reply.data.context = dataInfo
            this.currentQuestion = lastQuestion
            this.actionFileAskInput(lastQuestion.reply)
          } else {
            // need to check if same pair but different data type context?
            let checkCurrentQ = Object.keys(this.currentQuestion)
            if (checkCurrentQ.length > 0) {
              let lastQuestion = this.currentQuestion
              lastQuestion[0].reply.data.context = dataInfo
              this.actionFileAskInput(lastQuestion[0].reply)
            } else {
              let lastQuestion = this.historyPair[this.chatAttention].slice(-1)
              lastQuestion[0].reply.data.content = this.storeLibrary.linesLimit
              lastQuestion[0].reply.data.context = dataInfo
              this.currentQuestion = lastQuestion
              this.actionFileAskInput(lastQuestion[0].reply)
            }
          }
        } else {
          this.actionHelpAskInput()
        }
      } else if (this.beebeeContext === 'chatspace') {
        let spaceChatPrep = this.liveChatspaceUtil.prepareChatQandA(this.askQuestion, this.liveBspace)
        // check pair has been setup
        if (this.historyPair[this.liveBspace.cueid] === undefined) {
          this.historyPair[this.liveBspace.cueid] = []
        }
        this.historyPair[this.liveBspace.cueid].push(spaceChatPrep)
        // send to HOP and route to Agents required to reply
        this.actionAgentQuestion(spaceChatPrep.question)
        this.askQuestion.text = ''
      } else if (this.beebeeContext === 'graph') {
      } else if (this.beebeeContext === 'cues-decision') {
        this.decisionDoughnutCue = true
      }
    },
    largeFilesubmitAsk (dataInfo) {
      // console.log('large file prep')
      // console.log(dataInfo)
    },
    actionFileAskInput (fileData) {
      let aiMessageout = {}
      aiMessageout.type = 'bbai'
      aiMessageout.reftype = 'ignore'
      aiMessageout.action = 'question'
      aiMessageout.data = fileData.data
      aiMessageout.bbid = fileData.bbid
      this.sendSocket.send_message(aiMessageout)
      this.helpchatHistory.push(aiMessageout)
      this.askQuestion.text = ''
      this.qcount++      
    },
    actionAgentQuestion (question) {
      let hashQuestion = hashObject(question)
      let aiMessageout = {}
      aiMessageout.type = 'bbai'
      aiMessageout.reftype = 'ignore'
      aiMessageout.action = 'question'
      aiMessageout.data = question
      aiMessageout.bbid = hashQuestion
      this.sendSocket.send_message(aiMessageout)
      this.helpchatHistory.push(aiMessageout)
      this.qcount++
    },
    actionHelpAskInput () {
      // match question
      let matchQuestion = {}
      for (let inquest of this.inputAskHistory) {
        if (inquest.count == this.qcount) {
          matchQuestion = inquest
        } else {
        }
      }
      if (matchQuestion.text.length > 0) {
        let hashQuestion = hashObject(matchQuestion)
        let aiMessageout = {}
        aiMessageout.type = 'bbai'
        aiMessageout.reftype = 'ignore'
        aiMessageout.action = 'question'
        aiMessageout.data = matchQuestion
        aiMessageout.bbid = hashQuestion
        this.sendSocket.send_message(aiMessageout)
        this.helpchatHistory.push(aiMessageout)
        this.askQuestion.text = ''
        this.qcount++
      } else {
        // local AI
        let date = new Date()
        // get the time as a string
        let time = date.toLocaleTimeString()
        this.beebeeReply.text = 'beebee is not connected'
        this.beebeeReply.time = time
        this.beebeeReply.active = false
      }
    },
    processReply (received) {
      if (received.action === 'agent-task') {
        if (received.task === 'cale-evolution') {
          this.boxModelUpdate[received.context.bbid] = {}
          this.boxModelUpdate[received.context.bbid] = received.model.model
        }
      } else if (received.type === 'hop-learn') {
        if (received.action === 'cale-evolution') {
          if (received.task === 'begin') {
            this.processAgentStatus(received.data)
          } else if (received.task === 'closed') {
            this.processAgentStatus(received.data)
          }
        } else if (received.action === 'cale-gpt4all') {
          if (received.task === 'begin') {
            this.processAgentStatus(received.data)
          } else if (received.task === 'closed') {
            this.processAgentStatus(received.data)
          } else if (received.task === 'models') {
            this.llmModelsList = received.data
          }
        }
      } else if (received.action === 'hop-learn-feedback') {
        if (received.data.agent === 'not-active') {
          let pairBB = {}
          pairBB.question = received.data.input
          pairBB.reply = received
          this.historyPair[this.chatAttention].push(pairBB)
        }
      } else if (received.action === 'no-data') {
        console.log('no data')
      } else {
        // match to question via bbid
        if (received.data) {
          let questionStart = {}
          let questionCount = []
          for (let histMatch of this.helpchatHistory) {
            if (histMatch.bbid === received.bbid) {
              questionCount.push(histMatch)
              questionStart = histMatch
            }
          }
        
          if (questionCount.length === 1) {
            // does the question exist from file upload?
            if (questionCount[0].data?.filedata) {
              // set box detail setings
              let opendataToolbar = this.liveChatUtil.setOpendataToolbar()
              this.storeBentoBox.boxToolStatus[received.bbid] = {}
              this.storeBentoBox.boxToolStatus[received.bbid] = opendataToolbar
              /* let boxSettings = 
              {
                opendatatools: { active: false },
                boxtoolshow: { active: false },
                vistoolsstatus: { active: false },
                scalezoom: 1,
                location: {},
                storeBentoboxstoreBentobox: 'line'
              } */
              this.storeBentoBox.devicesettings[received.bbid] = {}
              this.storeBentoBox.devicesettings[received.bbid] = this.storeBentoBox.settings
              this.storeBentoBox.chartStyle[received.bbid] = this.boxSettings.chartstyle  // 'line'
            } else {
              let pairBB = {}
              pairBB.question = questionStart
              pairBB.reply = received
              // is the peer signed in?
              if (this.storeAcc.peerauth === false) {
              } else {
                this.historyPair[this.chatAttention].push(pairBB)
                this.storeBentoBox.boxToolStatus[received.bbid] = this.boxSettings
                this.storeBentoBox.devicesettings[received.bbid] = {}
                this.storeBentoBox.devicesettings[received.bbid] = this.storeBentoBox.settings
              }
            }
          }
          if (received.action === 'library-peerlibrary' || 'publiclibrary') {
            this.storeLibrary.processReply(received, questionStart)
          }
          // check if reply is upload?  If yes, present upload interface
          if (received.action === 'upload') {
            // this.uploadStatus = true
          } 
          this.beginChat = true 
          this.chatBottom++
        }
      }
    },
    processAgentStatus (data) {
      // upload agent model status
      let updateModelActive = []
      for (let agentM of this.agentModelDefault) {
        if (agentM.value.computational.model === data.model) {
          agentM.value.computational.active = true
          updateModelActive.push(agentM)
        } else {
          updateModelActive.push(agentM)
        }
      }
      this.agentModelDefault = updateModelActive
      this.agentStatus = true
      this.modelLoading = false
      /*for (let agent of this.agentList) {
        if (agent.name === data.name) {
          if (data.status === 'loaded') {
            agent.active = true
            agent.loading = false
          } else if (data.status === 'closed') {
            agent.active = false
          }
        }
      }*/
    },
    processNotification (received) {
      this.countNotifications++
      this.notifList.push(received)
      // add to chart part list (do now or on requrest?)
      if (received.action === 'chart') {
        // match peer to name or public key
        let peerMatch = this.storeAcc.warmPeers.find(peer => peer.key === received.data.publickey)
        let pairBB = {}
        let question = {}
        question.bbid = received.data.data.bbid
        question.data = { active: true, text: received.action }
        pairBB.question = question
        let reply = {}
        reply.time = new Date()
        reply.type = received.action
        reply.data = { text: received.text + ' ' + peerMatch.value.name }
        reply.network = true
        pairBB.reply = reply
        this.historyPair[this.chatAttention].push(pairBB)
        this.beginChat = true
        this.chatBottom++
      } else if (received.action === 'warm-peer-connect') {
        // set via account store - just add to notify list here.
      } else if (received.action === 'warm-peer-topic') {
        // update list and make longterm true
        /* let wpeerStatus = false
        let existingPeer = {}
        for (let peer of this.storeAcc.warmPeers) {
          if (peer.key === received.data.publickey) {
            wpeerStatus = true
            existingPeer = peer
          }
        }
        // check if first time or existing
        if (wpeerStatus === true) {
          console.log('eesiting----')
          console.log(existingPeer)
          // form structure for updating warm peer saved topic
          let peerPair = {}
          peerPair.publickey = existingPeer.key
          peerPair.name = existingPeer.value.name
          peerPair.longterm = existingPeer.value.longterm
          peerPair.topic = received.data.data
          peerPair.live = true
          // for live session make true
          // this.storeAcc.updateTopicPeertoNetwork(peerPair)
          existingPeer.value.live = true
          // update warm to live
          let updateWarmPeerList = []
          for (let wpeer of this.storeAcc.warmPeers) {
            if (wpeer.key === existingPeer.key) {
              updateWarmPeerList.push(existingPeer)
            } else {
              updateWarmPeerList.push(wpeer)
            }
          }
          this.storeAcc.warmPeers = updateWarmPeerList
          
        } else {
          console.log('new pairing')
          // need to update warm peer with topic for future discovery
          let peerPair = {}
          peerPair.publickey = received.data.publickey
          peerPair.name = 'newpeer'
          peerPair.longterm = false
          peerPair.topic = received.data.data
          peerPair.live = false 
          // send message to HOP to save relationship
          let libMessageout = {}
          libMessageout.type = 'library'
          libMessageout.action = 'account'
          libMessageout.reftype = 'new-peer'
          libMessageout.privacy = 'private'
          libMessageout.task = 'PUT'
          libMessageout.data = peerPair
          libMessageout.bbid = ''
          this.sendSocket.send_message(libMessageout)
        }
        */
      } else if (received.action === 'warm-peer-topic') {
      } else if (received.action === 'network-library-n1') {
        // create a notification accept public board and save?
      } else if (received.action === 'cue-space') {
        // populate space  check if cue needing setup then fill and notify
        console.log('share cue space')
      }
    },
    preparePublicConfirm (item) {
      // match to peerid  name
      let matchPeername = this.storeAcc.warmPeers.find(peer => peer.key === item.data.publickey)
      // produce a pair for the current chat
      let newBBID = '23232'
      let pairBB = {}
      let question = {}
      question.bbid = newBBID 
      question.data = { active: true, text: 'Please confirm adding board to public library sent by ' + matchPeername.value.name }
      pairBB.question = question
      let reply = {}
      reply.time = new Date()
      reply.type = item.action
      reply.data = { text: item.data.data }
      reply.network = true
      pairBB.reply = reply
      this.historyPair[this.chatAttention].push(pairBB)
      this.beginChat = true
      this.chatBottom++
    },
    prepareCuespace (notItem) {
      // notify peer that this cue content came from a shared peer
      // match name to publickey
      let matchPeername = this.storeAcc.warmPeers.find(peer => peer.key === notItem.data.publickey)
      this.sharePeer[notItem.data.data.content.cuecontract.spaceid] = matchPeername.value.name
      // have any bentoboxn1 been sent?
      // check if n1 with cue space
      if (notItem.data.data.content.bbn1.publicN1contracts !== undefined) {
        if (notItem.data.data.content.bbn1.publicN1contracts.length > 0) {
          for (let bbn1 of notItem.data.data.content.bbn1.publicN1contracts) {
            this.preparePublicConfirm({ action: 'network-library-n1', data: bbn1 })          
          }
        }
      }
      let cueContract = notItem.data.data.content.cuecontract
      let notCuespace = ''
      this.beebeeContext = 'chatspace'
      this.bentospaceState = !this.bentospaceState
      this.liveBspace = cueContract // get from notificationspaceID
      // make button green
      let spaceLiveList = []
      for (let spi of this.storeBentoBox.spaceList) {
        if (spi.spaceid === cueContract.spaceid) {
          spi.active = true
          spaceLiveList.push(spi)
        } else {
          spi.active = false
          spaceLiveList.push(spi)
        }
      }
      this.storeBentoBox.spaceList = spaceLiveList
      // now setup N=1 media, research, markers, products
      let contentTypes = Object.keys(notItem.data.data.content)
      for (let spcont of contentTypes) {
        // media, research etc.
        if (spcont === 'media') {
          this.storeBentoBox.prepareMediaSpace(notItem.data.data.content[spcont])
        } else if (spcont === 'research') {
          this.storeBentoBox.prepareResearchSpace(notItem.data.data.content[spcont])
        } else if (spcont === 'markers') {
          this.storeBentoBox.prepareMarkerSpace(notItem.data.data.content[spcont])
        } else if (spcont === 'products') {
          this.storeBentoBox.prepareProductSpace(notItem.data.data.content[spcont])
        }
      }
    },
    processPeerData (dataNetwork) {
      let matchBBID = dataNetwork.bbid
      let hopDataChart = dataNetwork.data
      // create a pair for chat display
      this.visData[matchBBID] = hopDataChart
      this.storeBentoBox.setChartstyle(matchBBID, 'line')
      this.expandBentobox[matchBBID] = false
      this.beebeeChatLog[matchBBID] = true
      this.bentoboxList['space1'] = []
    },
    processHOPsummary (dataSummary) {
      // match bbid to HOP ID
      let inputID = Object.keys(dataSummary.data)
      let HOPshell = dataSummary.data[inputID[0]].shellID
      this.bbidHOPid.push({ bbid: dataSummary.bbid, HOPid: HOPshell })
      this.hopSummary.push({ HOPid: HOPshell, summary: dataSummary })
    },
    processHOPdata (dataHOP) {
      // match input id to bbid
      // is the data for past or future or no data
      if (dataHOP.data.data === 'none') {
        // need to match to summary data for context
        let contKey = dataHOP.context.input.key
        let matchSummary = this.liveChatUtil.matchSummaryPeerContract(contKey, this.storeLibrary.peerExperimentList)
        this.dataBoxStatus = false
        // stil produce a bentobox
        let boxID = this.liveChatUtil.matchHOPbbid(dataHOP.context.dataprint.shell, this.bbidHOPid)
        // update the latest compute module contract back from HOP
        this.computeModuleLast[boxID] = dataHOP.context.tempComputeMod.info
        // set open data toolbar
        let opendataToolbar = this.liveChatUtil.setOpendataToolbar()
        this.storeBentoBox.boxToolStatus[boxID] = {}
        this.storeBentoBox.boxToolStatus[boxID] = opendataToolbar
        let pairBB = this.liveChatUtil.prepareChatQandA(boxID, matchSummary)        
        let hopDataChart = {}
        hopDataChart.datasets = [ { label: 'datatype11', data: [] } ]
        hopDataChart.labels = []
        this.visData[boxID] = hopDataChart
        this.storeBentoBox.setChartstyle(boxID, dataHOP.context.moduleorder.visualise.value.info.settings.visualise)
        // this.expandBentobox[boxID] = true
        this.beebeeChatLog[boxID] = true
        // feed the chat
        this.historyPair[this.chatAttention].push(pairBB)
        this.chatBottom++
      } else if (dataHOP.context.input.update !== 'predict-future') {
        this.dataBoxStatus = false
        let matchBBID = this.liveChatUtil.matchHOPbbid(dataHOP.data.context.shell, this.bbidHOPid)
        // update the latest compute module contract back from HOP
        if (dataHOP.context.tempComputeMod !== undefined) {
          this.computeModuleLast[matchBBID] = dataHOP.context.tempComputeMod.info
        }
        this.bentoboxList['space1'] = []
        // this.expandBentobox[matchBBID] = true
        this.beebeeChatLog[matchBBID] = true
        let hopDataChart = {}
        hopDataChart.datasets = dataHOP.data.data.chartPackage.datasets // [ { label: dataHOP.data.data.chartPackage.datasets[0].label, data: dataHOP.data.data.chartPackage.datasets[0].data } ]
        hopDataChart.labels = dataHOP.data.data.chartPackage.labels
        this.visData[matchBBID] = hopDataChart
        this.storeBentoBox.setChartstyle(matchBBID, dataHOP.context.moduleorder.visualise.value.info.settings.visualise)
      } else {
        // data for future prediction
        this.processFuture(dataHOP)
      }
    },
    processFuture (dataHOP) {
      // prepare chart for bentobox with ID
      let HOPid = dataHOP.context.input.entityUUID
      let futureMatch = ''
      for (let fpi of this.futurePids) {
    
        if (fpi.hopid === HOPid) {
          futureMatch = fpi.bboxid
        }
      }
      this.activeFuture[futureMatch] = true
      this.futureNumberData[futureMatch] = dataHOP.data.data.chartPackage.datasets[0].data // [ 1, 2, 3 ] 
      this.futureLabelData[futureMatch] = dataHOP.data.data.chartPackage.labels // [ 'January', 'February', 'March' ]
      // need to set chart style or assume past style?
    },
    prepareFuture (boxid) {
      // any additional text added or just button click context
      let matchBBID = ''
      for (let bhid of this.bbidHOPid) {
        if (bhid.bbid === boxid) {
          matchBBID = bhid.HOPid
        }
      }
      // keep track of future pid's
      this.futurePids.push({ bboxid: boxid, hopid: matchBBID })
      // take info from NXP past and flag update to existing NXP
      let queryNXP = {}
      for (let nxp of this.hopSummary) {
        if (nxp.HOPid === matchBBID) {
          queryNXP = nxp.summary.data
        }
      }
      // message beebee  --  TODO make a model to form messages out (standard format keep consistant)
      let aiMessageout = {}
      aiMessageout.type = 'bbai'
      aiMessageout.reftype = 'ignore'
      aiMessageout.action = 'predict-future'
      aiMessageout.data = { question: 'future chart line', model: 'linear-regression', nxp: queryNXP }
      aiMessageout.bbid = boxid
      const sendocket = useSocketStore()
      this.sendSocket.send_message(aiMessageout)
    },
    prepareLibrarySummary (boxid) {
      for (let hi of this.hopSummary) {
        if (hi.summary.bbid == boxid) {
          // new or saved format
          if ('data' in hi.summary) {
            this.boxLibSummary[boxid] = hi.summary
          } else {
            this.boxLibSummary[boxid] = hi.summary.summary
          }
        } else {
          if (hi.summary.summary === undefined) {
            this.boxLibSummary[boxid] = hi.summary

          } else {
            this.boxLibSummary[boxid] = hi.summary.summary.summary.summary.summary.summary
          }
        }
      }
      // let NXPcontract = this.boxLibSummary[boxid].data
      let key = Object.keys(this.boxLibSummary[boxid].data)
      // now update compute contract to latest one back from HOP
      let computeLatestModules = []
      for (let mod of this.boxLibSummary[boxid].data[key[0]].modules) {
        if (mod.value.style === 'compute') {
          let lastMod = this.computeModuleLast[boxid]
          computeLatestModules.push(lastMod)
        } else {
          computeLatestModules.push(mod)
        }
      }
      this.boxLibSummary[boxid].data.modules = computeLatestModules
      // let modulesContracts = NXPcontract[key[0]].modules
      let extractedOD = this.storeLibrary.utilLibrary.moduleExtractSettings(computeLatestModules)
      this.storeBentoBox.openDataSettings[boxid] = extractedOD
      return true
    },
    prepareChatBentoBoxSave (message) {
      let settingsData = this.historyPair[message.data.chatid]
      let bbidPerChat = []
      // loop over data to match to visualisation alread prepared.  (note. or HOPQuery to re-create via HOP)
      let visDataperChat = [] // this.visData[]
      if (settingsData !== undefined) {
        for (let bbi of settingsData) {
          bbidPerChat.push(bbi.reply.bbid)
          let visD = this.visData[bbi.reply.bbid]
          visDataperChat.push(visD)
        }
      } else {
        settingsData = []
      }
      // save HOP summary info ie. HOPquery
      let hopQuery = []
      for (let bb of bbidPerChat) {
        for (let hp of this.hopSummary) {
          if (bb === hp.summary.bbid) {
            hopQuery.push(hp)
          }
        }
      }
      let saveData = {}
      saveData.pair = settingsData
      saveData.chat = message.data
      saveData.visData = visDataperChat
      saveData.hop = hopQuery
      message.data = saveData
      this.sendSocket.send_message(message)
    },
    prepareSpaceSave (message) {
      // match bentoboxes, cues, content (media, research, markers, products)
      // bentoboxes
      let boxidPerspace = this.bentoboxList[message.data.cueid]
      if (boxidPerspace !== undefined) {
        let visDataperSpace = []
        let locationPerSpace = []
        for (let bbi of boxidPerspace) {
          let visD = this.visData[bbi.bboxid]
          visDataperSpace.push(visD)
          // current location to save
          locationPerSpace.push({ bboxid: bbi.bboxid, location: this.storeBentoBox.locationBbox[message.data.cueid][bbi.bboxid] })
        }
        // build media info per space
        let saveData = {}
        saveData.pair = {}
        saveData.space = message.data
        saveData.location = locationPerSpace
        saveData.visData = visDataperSpace
        saveData.bboxlist = boxidPerspace
        // save media boxes
        // saveData.mboxlist = bmMediaPerspace
        message.data = saveData
        this.sendSocket.send_message(message)
      } else {
        console.log('no boxid')
      }
      // cues
      // media
      // let mediaidPerspace = this.storeBentoBox.videoMedia[message.data.cueid]
      // research
      // let researchidPerspace = this.storeBentoBox.researchMedia[message.data.cueid]
      // markers
      // let markeridPerspace = this.storeBentoBox.markerMedia[message.data.cueid]
      // products
      // let productidPerspace = this.storeBentoBox.ProductMedia[message.data.cueid]
    },
    prepareAI (message) {
      // need to build DML structure, proof of work hash
      // ask library for NXP contract
      this.prepareLibrarySummary(message.bbid)
      let nxpContract = this.boxLibSummary[message.bbid]
      if (message.action == 'agent-task') {
        this.sendMessageHOP(message)
      } else if (message.action === 'agent-network-task') {
        message.data = nxpContract.data
        this.sendMessageHOP(message)
      }
    },
    prepareModelContract (modelInfo) {
      // structure inputs for cue contract
      modelInfo.active = true
      const modelContract = {}
      modelContract.type = 'library'
      modelContract.action = 'model'
      modelContract.reftype = 'new-model'
      modelContract.task = 'PUT'
      modelContract.privacy = 'public'
      let modelHolder = {}
      let concept = {}
      concept.agent = modelInfo.agent
      concept.name = modelInfo.name
      concept.model = modelInfo.model
      concept.description = modelInfo.description
      modelHolder.concept = concept
      modelHolder.computational = modelInfo
      modelContract.data = modelHolder
      this.sendMessageHOP(modelContract)
      // if previous model, update to onstart false, active false
      if (this.previousLLM?.first === true) {
      } else {
        this.prepareUpdateModelContract(this.previousLLM, false, false)
      }
    },
    prepareUpdateModelContract (modelInfo, active, onstart) {

      // structure inputs for cue contract
      modelInfo.value.computational.active = active
      modelInfo.value.computational.onstart = onstart
      const modelContract = {}
      modelContract.type = 'library'
      modelContract.action = 'model'
      modelContract.reftype = 'new-model'
      modelContract.task = 'UPDATE'
      modelContract.privacy = 'public'
      modelContract.data = modelInfo
      this.sendMessageHOP(modelContract)
    },
    sendModelControl (modelInfo, action) {
      let learnMessage = {}
      learnMessage.type = 'bbai'
      learnMessage.reftype = 'ignore'
      learnMessage.action = action
      learnMessage.data = { agent: modelInfo.agent, model: modelInfo.model}
      learnMessage.bbid = ''
      this.sendMessageHOP(learnMessage)
    }
  }
})
