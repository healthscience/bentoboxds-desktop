import { ref, computed } from 'vue'
import { shallowRef, markRaw } from 'vue'
import { defineStore } from 'pinia'
import hashObject from 'object-hash'
import { useSocketStore } from '@/stores/socket.js'
import { bentoboxStore } from "@/stores/bentoboxStore.js"
import { libraryStore } from '@/stores/libraryStore.js'
import DataPraser from '@/stores/hopUtility/dataParse.js'

export const aiInterfaceStore = defineStore('beebeeAIstore', {
  state: () => ({
    sendSocket: useSocketStore(),
    liveBentoBox: bentoboxStore(),
    libStore: libraryStore(),
    liveDataParse: new DataPraser(),
    startChat: true,
    historyBar: false,
    beginChat: false,
    beebeeStatus: false,
    dataBoxState: false,
    qcount: 0,
    uploadStatus: false,
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
    historyPair: [],
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
    bentoboxList: {}, // ['123', '345', '564343']
    csvpreviewLive: false,
    linesLimit: []
  }),
  actions: {
    sendMessageHOP (message) {
      this.sendSocket.send_message(message)
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
    submitAsk () {
      // remove start boxes
      this.uploadStatus = false
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
      this.actionHelpAskInput()
    },
    actionHelpAskInput () {
      if (this.inputAskHistory[this.qcount].text.length > 0) {
        let hashQuestion = hashObject(this.inputAskHistory[this.qcount])
        // thisstate.helpchatAsk, 'active', true
        let aiMessageout = {}
        aiMessageout.type = 'bbai'
        aiMessageout.reftype = 'ignore'
        aiMessageout.action = 'question'
        aiMessageout.data = this.inputAskHistory[this.qcount]
        aiMessageout.bbid = hashQuestion
        // const sendocket = useSocketStore()
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
      // match to question via bbid
      let questionStart = {}
      for (let histMatch of this.helpchatHistory) {
        if (histMatch.bbid === received.bbid) {
          questionStart = histMatch
          let pairBB = {}
          pairBB.question = histMatch
          pairBB.reply = received
          // temporary parse check for number and chart if numbers
          // check for numbers, files, excel etc. or spam check for size
          /* let numberCheck = this.liveDataParse.numberParse(histMatch.data.text)
          if (numberCheck.status === true) {
            this.tempNumberData = numberCheck.data
            this.tempLabelData = numberCheck.label
            histMatch.data.text = numberCheck.data
          } */
          this.historyPair.push(pairBB)
        }
      }
      if (received.action === 'library-peerlibrary') {
        this.libStore.processReply(received, questionStart)
      }
      // check if reply is upload?  If yes, present upload interface
      if (received.action === 'upload') {
        // this.uploadStatus = true
      } 
      this.beginChat = true 
      this.chatBottom++
    },
    processHOPsummary (dataSummary) {
      // match bbid to HOP ID
      let inputID = Object.keys(dataSummary.data)
      this.bbidHOPid.push({ bbid: dataSummary.bbid, HOPid: inputID[0] })
      this.hopSummary.push({ HOPid: inputID[0], summary: dataSummary })
    },
    processHOPdata (dataHOP) {
      // match input id to bbid
      // is the data for past or future
      if (dataHOP.context.input.update !== 'predict-future') {
        let matchBBID = ''
        for (let bhid of this.bbidHOPid) {
          if (bhid.HOPid === dataHOP.context.input.key) {
            matchBBID = bhid.bbid
          }
        }
        this.bentoboxList['space1'] = []
        this.expandBentobox[matchBBID] = false
        this.beebeeChatLog[matchBBID] = true
        this.tempNumberData[matchBBID] = dataHOP.data.data.chartPackage.datasets[0].data
        this.tempLabelData[matchBBID] = dataHOP.data.data.chartPackage.labels
        this.liveBentoBox.setChartstyle(matchBBID, dataHOP.context.moduleorder.visualise.value.info.settings.visualise)
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
    }
  }
})
