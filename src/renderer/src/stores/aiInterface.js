import { shallowRef, markRaw } from 'vue'
import { defineStore } from 'pinia'
import hashObject from 'object-hash'
import { useSocketStore } from '@/stores/socket.js'
import { bentoboxStore } from "@/stores/bentoboxStore.js"
import { libraryStore } from '@/stores/libraryStore.js'
import DataPraser from '@/stores/hopUtility/dataParse.js'
import { accountStore } from "@/stores/accountStore.js"

export const aiInterfaceStore = defineStore('beebeeAIstore', {
  state: () => ({
    accStore: accountStore(),
    sendSocket: useSocketStore(),
    storeBentoBox: bentoboxStore(),
    storeLibrary: libraryStore(),
    liveDataParse: new DataPraser(),
    startChat: true,
    chatAttention: '',
    historyList: '',
    historyBar: false,
    beginChat: false,
    beebeeStatus: false,
    qcount: 0,
    dataBoxStatus: false,
    chatBottom: 0,
    askQuestion: {
      text: ''
    },
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
    liveFutureCollection: { active: false },
    visData: {},
    tempNumberData: {},
    tempLabelData: {},
    expandBentobox: {},
    activeFuture: {},
    futureLabelData: {},
    futureNumberData: {},
    beebeeChatLog: {},
    bentospaceState: false,
    longPress: false,
    liveBspace: '',
    bentoboxList: { '91919191': [] },
    countNotifications: 0,
    notifList: [],
    boxLibSummary: {}
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
        // thisstate.helpchatAsk, 'active', true
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
    actionHelpAskUpdate (HOPq) {
      // let hashQuestion = hashObject(this.inputAskHistory[this.qcount])
      let aiMessageout = {}
      aiMessageout.type = 'safeflow'
      aiMessageout.reftype = 'ignore'
      aiMessageout.action = 'updatenetworkexperiment'
      aiMessageout.data = HOPq
      aiMessageout.bbid = HOPq.bbid
      this.sendSocket.send_message(aiMessageout)
      this.helpchatHistory.push(aiMessageout)
      this.qcount++
    },
    processReply (received) {
      // match to question via bbid
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
          console.log('file data one')
          console.log(received)
          // set box detail setings
          console.log('file toolbar settins')
          this.storeBentoBox.boxToolStatus[received.bbid] = {}
          let boxSettings = 
          {
            opendatatools: { active: false },
            boxtoolshow: { active: false },
            vistoolsstatus: { active: false },
            scalezoom: 1,
            location: {},
            chartstyle: 'line'
          }
          this.storeBentoBox.boxToolStatus[received.bbid] = boxSettings
          this.storeBentoBox.devicesettings[received.bbid] = {}
          this.storeBentoBox.chartStyle[received.bbid] = 'line'
        } else {
          console.log('file data two')
          let pairBB = {}
          pairBB.question = questionStart
          pairBB.reply = received
          this.historyPair[this.chatAttention].push(pairBB)
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
    },
    processNotification (received) {
      this.countNotifications++
      this.notifList.push(received)
      // add to chart part list (do now or on requrest?)
      if (received.action === 'chart') {
        let pairBB = {}
        let question = {}
        question.bbid = received.bbid
        question.data = { active: true, text: received.action }
        pairBB.question = question
        let reply = {}
        reply.time = new Date()
        reply.type = received.action
        reply.data = { text: received.text }
        reply.network = true
        pairBB.reply = reply
        this.historyPair[this.chatAttention].push(pairBB)
        this.beginChat = true
        this.chatBottom++
      } else if (received.action === 'warm-peer-new') {
        this.accStore.warmPeers.push(received.data)
      }
    },
    processPeerData (dataNetwork) {
      let matchBBID = dataNetwork.hop.bbid
      let hopDataChart = {}
      hopDataChart.datasets = [ { data: dataNetwork.data.datasets[0].data } ]
      hopDataChart.labels = dataNetwork.data.labels
      this.visData[matchBBID] = hopDataChart
      this.storeBentoBox.setChartstyle(matchBBID, 'line')
      this.expandBentobox[matchBBID] = false
      this.beebeeChatLog[matchBBID] = true
      this.bentoboxList['space1'] = []
    },
    processHOPsummary (dataSummary) {
      // match bbid to HOP ID
      let inputID = Object.keys(dataSummary.data)
      this.bbidHOPid.push({ bbid: dataSummary.bbid, HOPid: inputID[0] })
      this.hopSummary.push({ HOPid: inputID[0], summary: dataSummary })
    },
    processHOPdata (dataHOP) {
      // close databox
      // match input id to bbid
      // is the data for past or future or no data
      if (dataHOP.data.data === 'none') {
        this.dataBoxStatus = !this.dataBoxStatus
        let pairBB = {}
        let question = {}
        question.data = { active: false }
        pairBB.question = question
        let reply = {}
        reply.time = new Date()
        reply.type = 'feedback'
        reply.data = { text: 'no data for this network experiment'}
        pairBB.reply = reply
        this.historyPair[this.chatAttention].push(pairBB)
      } else if (dataHOP.context.input.update !== 'predict-future') {
        let matchBBID = ''
        for (let bhid of this.bbidHOPid) {
          if (bhid.HOPid === dataHOP.context.input.key) {
            matchBBID = bhid.bbid
          }
        }
        this.bentoboxList['space1'] = []
        this.expandBentobox[matchBBID] = false
        this.beebeeChatLog[matchBBID] = true
        // this.tempNumberData[matchBBID] = dataHOP.data.data.chartPackage.datasets[0].data
        // this.tempLabelData[matchBBID] = dataHOP.data.data.chartPackage.labels
        let hopDataChart = {}
        hopDataChart.datasets = [ { data: dataHOP.data.data.chartPackage.datasets[0].data } ]
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
      let futureMatch = ''
      for (let fpi of this.futurePids) {
        if (fpi.hopid === dataHOP.context.input.exp.key) {
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
        console.log(hi)
        if (hi.summary.bbid == boxid) {
          // new or saved format
          if ('data' in hi.summary) {
            this.boxLibSummary[boxid] = hi.summary
          } else {
            this.boxLibSummary[boxid] = hi.summary.summary
          }
        }
      }
    },
    prepareBentoBoxSave (message) {
      let settingsData = this.historyPair[message.data.chatid]
      let bbidPerChat = []
      // loop over data to match to visualisation alread prepared.  (note. or HOPQuery to re-create via HOP)
      let visDataperChat = [] // this.visData[]
      for (let bbi of settingsData) {
        bbidPerChat.push(bbi.reply.bbid)
        let visD = this.visData[bbi.reply.bbid]
        visDataperChat.push(visD)
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
      let boxidPerspace = this.bentoboxList[message.data.spaceid]
      let visDataperSpace = []
      for (let bbi of boxidPerspace) {
        let visD = this.visData[bbi]
        visDataperSpace.push(visD)
      }
      let saveData = {}
      saveData.pair = {}
      saveData.space = message.data
      saveData.visData = visDataperSpace
      saveData.bboxlist = boxidPerspace
      message.data = saveData
      this.sendSocket.send_message(message)
    }
  }
})
