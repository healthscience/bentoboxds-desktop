import { shallowRef, markRaw, nextTick } from "vue";
import { defineStore } from "pinia";
import hashObject from "object-hash";
import { useSocketStore } from "@/stores/socket.js";
import { bentoboxStore } from "@/stores/bentoboxStore.js";
import { libraryStore } from "@/stores/libraryStore.js";
import { useChatStore } from "@/stores/chatStore.js";
import DataPraser from "@/stores/hopUtility/dataParse.js";
import ChatUtilty from "@/stores/hopUtility/chatUtility.js";
import ChatspaceUtilty from "@/stores/hopUtility/chatspaceUtility.js";
import { accountStore } from "@/stores/accountStore.js";
import { cuesStore } from "@/stores/cuesStore.js";
import { teachingStore } from "@/stores/teachingStore.js";

export const aiInterfaceStore = defineStore("beebeeAIstore", {
  state: () => ({
    storeAcc: accountStore(),
    sendSocket: useSocketStore(),
    storeCues: cuesStore(),
    storeBentobox: bentoboxStore(),
    storeLibrary: libraryStore(),
    storeChat: useChatStore(),
    storeTeaching: teachingStore(),
    liveDataParse: new DataPraser(),
    liveChatUtil: new ChatUtilty(),
    liveChatspaceUtil: new ChatspaceUtilty(),
    currentMode: "zen",
    activeWorld: "orbit",
    invitePlaceHolder: {
      opening: "Ready to weave a new story into the World?",
      invite: "Expand the knowledge-fold?",
      wait: "Awaiting a story to anchor.",
      device: "A new pulse is present. Witness it?",
    },
    newLifestrap: false,
    cuesFeedback: "",
    cuesRelationshipFeedback: {},
    startChat: true,
    chatAttention: "",
    historyList: false,
    historyCuesList: false,
    historyBar: false,
    beebeeStatus: false,
    qcount: 0,
    dataBoxStatus: false,
    inputTools: [],
    isUploadMode: false,
    isLibraryMode: false,
    chatBottom: 0,
    beebeeContext: "chat",
    askQuestion: {
      text: "",
      compute: false,
    },
    decisionDoughnutCue: false,
    agentList: [
      { name: "cale-evolution", active: false, loading: false, onstart: false },
    ],
    llmModelsList: [],
    oracleData: {
      type: "oracle",
      action: "decision",
      elements: [
        {
          label: "muscle mass",
          datasets: { backgroundColor: "#01923c", data: 30 },
        },
        { label: "brain", datasets: { backgroundColor: "#71923c", data: 30 } },
      ],
      concerns: [
        {
          label: "kidneys",
          datasets: { backgroundColor: "#b90e28", data: 30 },
        },
        {
          label: "pee more",
          datasets: { backgroundColor: "#e62643", data: 30 },
        },
      ],
    },
    askQuestion: {
      text: "",
      compute: "observation",
    },
    bodyDiagramShow: false,
    agentProgress: {},
    inputAskHistory: [],
    statusCALE: {
      text: "off",
      active: false,
    },
    helpchatAsk: markRaw({
      text: "",
      time: "",
      active: true,
    }),
    showLifestapLens: false,
    helpchatReply: "",
    helpchatHistory: shallowRef([]),
    currentQuestion: {},
    historyPair: {},
    chatSpacePair: {},
    subscribers: [],
    bbidHOPid: [],
    hopSummary: [],
    futurePids: [],
    beebeeReply: {
      text: "... .. ...",
      time: "",
      data: {},
      active: false,
    },
    boxSettings: {
      opendatatools: { active: false },
      boxtoolshow: { active: false },
      vistoolsstatus: { active: false },
      scalezoom: 1,
      location: {},
      chartstyle: "line",
      legends: true,
    },
    bboxFeedback: {},
    liveFutureCollection: { active: false },
    visData: {},
    tempNumberData: {},
    tempLabelData: {},
    interactionMode: "lens", // 'lens' or 'tools'
    activeFuture: {},
    futureLabelData: {},
    futureNumberData: {},
    historySpacePair: {},
    bentochatState: false,
    bentospaceState: false,
    bentocuesState: false,
    bentodiaryState: false,
    bentoflakeState: false,
    bentographState: false,
    longPress: false,
    liveBspace: "",
    bentoboxList: { 91919191: [] },
    countNotifications: 0,
    notifList: [],
    sharePeer: {},
    boxLibSummary: {},
    boxModelUpdate: {},
    computeModuleLast: {},
    bentobesearchState: false,
    nexusAutoOpen: false,
    cueAction: "cues",
    showBbNexus: false,
    agentStatus: false,
    modelLoading: false,
    agentModelDefault: {},
    activeLifeStrapID: "",
    activeContractKey: "",
    ensureSpaceChatInMenu(cueId, name) {
      if (!cueId) return;
      const now = Date.now();
      const label = name || cueId;
      const idx = this.storeBentobox.chatList.findIndex(
        (c) => c.chatid === cueId,
      );
      if (idx === -1) {
        const newItem = {
          name: label,
          chatid: cueId,
          context: "chatspace",
          active: true,
          createTimestamp: now,
          lastTimestamp: now,
          useCount: 0,
          favoriteCount: 0,
        };
        this.storeBentobox.chatList = this.storeBentobox.chatList.map((c) => ({
          ...c,
          active: false,
        }));
        this.storeBentobox.chatList.push(newItem);
        this.setupChatHistory(newItem);
      } else {
        const existing = this.storeBentobox.chatList[idx];
        const updated = {
          ...existing,
          name: label,
          active: true,
          lastTimestamp: now,
          useCount: (existing.useCount || 0) + 1,
        };
        this.storeBentobox.chatList = this.storeBentobox.chatList.map((c, i) =>
          i === idx ? updated : { ...c, active: false },
        );
        this.setupChatHistory(updated);
      }
      this.chatAttention = cueId;
      this.historyList = true;
    },
    previousLLM: {},
    isInitialState: true,
    digestInput: null,
    lifestrapTexture: {
      pillars: {
        capacity: [],
        context: [],
        attunement: [],
        heli: [],
        coherence: { isStable: false, resonance: 0 },
      },
      residue: [],
      key: "",
    },
    emulationHorizon: 0,
    performanceVelocity: 0,
  }),
  actions: {
    setEmulationHorizon(delta) {
      this.emulationHorizon = delta;
    },
    setPerformanceVelocity(value) {
      this.performanceVelocity = value;
    },
    updateResonWeight(word, zone, label = null) {
      console.log(
        `[Attunement] Mapping ${word} to ${zone} ${label ? "(" + label + ")" : ""}`,
      );

      if (!this.lifestrapTexture) {
        this.lifestrapTexture = {
          pillars: {
            capacity: [],
            context: [],
            heli: [],
            coherence: { isStable: false, resonance: 0 },
          },
          residue: [],
          key: "",
        };
      }

      // 1. Remove from all existing locations (residue and all pillars)
      this.lifestrapTexture.residue = this.lifestrapTexture.residue.filter(
        (w) => w !== word,
      );
      this.lifestrapTexture.pillars.capacity =
        this.lifestrapTexture.pillars.capacity.filter((i) => i.value !== word);
      this.lifestrapTexture.pillars.context =
        this.lifestrapTexture.pillars.context.filter((i) => i.value !== word);
      this.lifestrapTexture.pillars.attunement =
        this.lifestrapTexture.pillars.attunement.filter(
          (i) => i.value !== word,
        );
      this.lifestrapTexture.pillars.heli =
        this.lifestrapTexture.pillars.heli.filter((i) => i.value !== word);

      // If zone is residue, we just put it back there and exit
      if (zone === "residue") {
        if (!this.lifestrapTexture.residue.includes(word)) {
          this.lifestrapTexture.residue.push(word);
        }
        this.syncAttunement(word, zone, label);
        return;
      }

      const entry = { label: label || zone, value: word };

      if (zone === "capacity") {
        this.lifestrapTexture.pillars.capacity.push(entry);
      } else if (
        zone === "context" ||
        ["peer", "environment", "earth"].includes(zone)
      ) {
        // Map sub-zones to the 'context' pillar with appropriate labels if needed,
        // but the expected structure has a 'context' array.
        const contextLabel =
          label ||
          (zone === "peer"
            ? "Activity"
            : zone === "environment"
              ? "Space"
              : "Temporal");
        this.lifestrapTexture.pillars.context.push({
          label: contextLabel,
          value: word,
        });
      } else if (["orbits", "days", "arcs", "heli"].includes(zone)) {
        const heliLabel =
          label ||
          (zone === "orbits"
            ? "Orbit Target"
            : zone === "days"
              ? "Rhythm"
              : "Performance");
        const heliEntry = { label: heliLabel, value: word };
        if (zone === "orbits") {
          heliEntry.math = `${word} - currentHeliAge`;
        }
        this.lifestrapTexture.pillars.heli.push(heliEntry);
      } else if (zone === "coherence" || zone === "attunement") {
        this.lifestrapTexture.pillars.attunement.push(entry);
      }

      this.syncAttunement(word, zone, label);
    },
    syncAttunement(word, zone, label) {
      // 2. Persist to backend/socket
      const message = {
        type: "bbai",
        action: "attunement-mapping",
        data: {
          word,
          zone,
          label,
          lifeStrapID: this.activeLifeStrapID,
          contract_key: this.activeContractKey,
        },
      };
      this.sendMessageHOP(message);

      // 3. Trigger BeeBee feedback
      this.storeChat.handleIncomingMessage({
        type: "agent-reply",
        role: "agent",
        content: `Mapping ${word} to ${zone}. Emulation updating...`,
        data: { text: `Mapping ${word} to ${zone}. Emulation updating...` },
        context: "extraction",
        conversationId: this.chatAttention,
        status: "complete",
      });
    },
    sendMessageHOP(message) {
      this.sendSocket.send_message(message);
    },
    // Add a subscribe method to the actions
    subscribe(callback) {
      this.subscribers.push(callback);
    },
    // Add an unsubscribe method to the actions
    unsubscribe(callback) {
      this.subscribers = this.subscribers.filter(
        (subscriber) => subscriber !== callback,
      );
    },
    // Notify all subscribers of a change
    notifySubscribers(mutation, state) {
      this.subscribers.forEach((subscriber) => subscriber(mutation, state));
    },
    clearData() {
      // clear all chat, space, account data
      let chatKeys = Object.keys(this.historyPair);
      for (let ck of chatKeys) {
        delete this.historyPair[ck];
      }
      // for web refresh
      location.reload();
    },
    actionBBAI() {
      // filter a list of Kentity bundles given the Experiment CNRL
      // check current state and reverse
      if (this.statusCALE.active === false) {
        this.statusCALE.active = true;
        thisstate.statusCALE.text = on;
      } else {
        this.state.statusCALE.active = false;
        this.state.statusCALE.text = "off";
      }
    },
    actionBBstate(context) {
      this.beebeeStatus = !this.beebeeStatus;
    },
    actionNatlangIn(event, update) {
      // set context
      if (event.key === "Enter") {
        // process the input
        this.submitAsk();
      } else {
        console.log(this.askQuestion);
      }
    },
    setupChatHistory(chat) {
      // does the chat history exist if not setup
      if (this.historyPair.hasOwnProperty(chat.chatid) === false) {
        this.historyPair[chat.chatid] = [];
      } else {
        // set live chat ID
      }
      // this.storeChat.beginChat = true
    },
    async submitAsk(dataInfo, primeLifeStrap) {
      console.log("submit ask");
      console.log(this.beebeeContext);
      // peer inquiry continues
      try {
        // 1. Determine the context
        const baseContext = this.beebeeContext || "chat";
        const cueId = this.liveBspace?.cueid || this.liveBspace?.spaceid;
        const keyContext =
          baseContext === "chatspace" && cueId
            ? cueId
            : this.chatAttention || "chat";
        const displayContext =
          baseContext === "chatspace" && cueId
            ? { type: "chatspace", id: cueId }
            : baseContext;
        // 2. Check for tools in the question text
        let toolsUsed = [];
        toolsUsed = this.inputTools;
        // 3. Validate the question
        const validationResult = this.liveChatUtil.validateQuestion(
          this.askQuestion.text,
          toolsUsed,
        );
        if (!validationResult.isValid) {
          console.log("validation failed");
          // Provide feedback to the peer
          const feedbackMessage = this.liveChatUtil.createFeedbackMessage(
            validationResult.message,
          );
          this.storeChat.addMessage(feedbackMessage);
          return;
        }
        // 3. upload files?
        let uploadAttached = false;
        if (this.storeLibrary.uploadFileStatus === true) {
          // file(s) are the conetxt for input
          uploadAttached = true;
        }
        // 4. Prepare the question object
        let question = {};
        // if extraction, message will be set
        if (displayContext !== "extraction") {
          question = {
            role: "peer",
            type: "peer",
            content: this.askQuestion.text,
            conversationId: keyContext,
            contract_key: this.activeContractKey || "",
            lifeStrapID: this.activeLifeStrapID || "",
            context:
              baseContext === "chatspace"
                ? "space"
                : baseContext === "extraction"
                  ? "extraction"
                  : "emulation",
            tools: toolsUsed,
            timestamp: new Date(),
          };
        } else {
          // extraction message
          question = {
            role: "peer",
            type: "peer",
            content: this.askQuestion.text,
            conversationId: this.chatAttention,
            contract_key:
              this.activeContractKey ||
              (this.storeLibrary.straps &&
                this.storeLibrary.straps[0]?.contract_key) ||
              "",
            lifeStrapID: this.chatAttention,
            context: baseContext,
            tools: toolsUsed,
            timestamp: new Date(),
          };
        }
        // 5. Check if this is a new chat or adding to existing
        let chat;
        if (this.isNewChat(keyContext)) {
          // Create a new chat
          chat = this.liveChatUtil.createChatTemplate(
            keyContext,
            question.bboxid,
          );
          this.startChat = false;
          this.historyBar = true;
        } else {
          // Get the current chat for this context
          chat = this.getCurrentChat(keyContext);
        }
        // 6. Add the question to the chat
        if (!chat.questions) chat.questions = [];
        chat.questions.push(question);
        chat.currentQuestion = question;
        // 7. Update the chat history
        this.updateChatHistory(chat, keyContext);
        // if file upload then show charting options
        if (uploadAttached === true) {
          // add reply data select mode
          question.upload = this.storeLibrary.uploadHolder[0];
          this.actionAgentQuestion(question, question, primeLifeStrap);
        } else {
          // 9. Prepare the question for HOP
          const hopQuestion = question;
          // this the first time chat context or first time after start need to add chat history
          let chatHistoryLength = this.storeChat.chatHistory[keyContext];
          if (chatHistoryLength === undefined) {
            chatHistoryLength = [];
          }
          if (chatHistoryLength.length === 0) {
            // inform beebee new session with unique ID needs setting up
            hopQuestion.session = true;
          } else if (chatHistoryLength.length > 0) {
            // feed in history into session before next prompt
            hopQuestion.session = false;
            hopQuestion.historyChat = chatHistoryLength;
          } else {
            hopQuestion.session = false;
          }
          // 10. Send the question to HOP for processing
          this.actionAgentQuestion(hopQuestion, question, primeLifeStrap);
        }
        // 11. Clear the input for the next question
        this.askQuestion.text = "";
        this.askQuestion.compute = false;
        // 12. Notify subscribers about the new question
        this.notifySubscribers({
          type: "newQuestion",
          payload: {
            chatId: chat.id,
            questionId: question.id,
            bboxid: question.bboxid || keyContext,
            context: displayContext,
          },
        });
      } catch (error) {
        console.error("Error submitting question:", error);
        // Provide error feedback
        const errorMessage = this.liveChatUtil.createFeedbackMessage(
          "An error occurred while processing your question. Please try again.",
        );
        this.storeChat.addMessage(errorMessage);
      }
    },
    // Helper functions
    isNewChat(context) {
      const bucket = this.historyPair[context];
      if (!Array.isArray(bucket) || bucket.length === 0) return true;
      for (let i = bucket.length - 1; i >= 0; i--) {
        const item = bucket[i];
        if (item && Array.isArray(item.questions)) return false;
      }
      return true;
    },
    getCurrentChat(context) {
      const bucket = this.historyPair[context];
      if (!Array.isArray(bucket) || bucket.length === 0) return null;
      for (let i = bucket.length - 1; i >= 0; i--) {
        const item = bucket[i];
        if (item && Array.isArray(item.questions)) return item;
      }
      return null;
    },
    updateChatHistory(chat, context) {
      if (!this.historyPair[context]) {
        this.historyPair[context] = [];
      }
      // Update or add the chat
      const existingIndex = this.historyPair[context].findIndex(
        (c) => c.id === chat.id,
      );
      if (existingIndex >= 0) {
        this.historyPair[context][existingIndex] = chat;
      } else {
        this.historyPair[context].push(chat);
      }
    },
    trackAgentProgress(bboxID) {
      // setup chat feedback object if need
      if (this.agentProgress[this.chatAttention] === undefined) {
        this.agentProgress[this.chatAttention] = {};
      }
      // need some sort of loop
      let agentLoopActive = true;
      if (agentLoopActive === true) {
        this.agentProgress[this.chatAttention] = {}; // TODO  setup object better to allow deeper reactivity
        this.agentProgress[this.chatAttention][bboxID] = {};
        this.agentProgress[this.chatAttention][bboxID] = {
          feedback: "",
          timeCounter: 1,
          show: true,
        };
      } else if (agentLoopActive === false) {
        this.agentProgress[this.chatAttention][bboxID] = {
          feedback: "agent flow complete",
          timeCounter: 0,
          show: false,
        };
      }
    },
    trackAgentProgressUpdate(inputID) {
      // loop over and set feedback to false
      let progressKeys = Object.keys(this.agentProgress[this.chatAttention]);
      let updateProgreefb = [];
      for (let progressK of progressKeys) {
        if (progressK === inputID) {
          let updateProg = this.agentProgress[this.chatAttention][progressK];
          updateProg.show = false;
          updateProgreefb.push(updateProg);
        } else {
          updateProgreefb.push(
            this.agentProgress[this.chatAttention][progressK],
          );
        }
      }
      this.agentProgress[this.chatAttention] = updateProgreefb;
    },
    processAgentFeedback(data) {
      this.agentProgress[this.chatAttention] = {};
      this.agentProgress[this.chatAttention][data.bbid] = {
        feedback: "= TOKEN MESSAGE RECEIVED =",
        timeCounter: 1,
        show: false,
      };
    },
    largeFilesubmitAsk(dataInfo) {
      // console.log('large file prep')
      // console.log(dataInfo)
    },
    actionFileAskInput(fileData) {
      // fileData.data.input = { data: {compute: 'observation'} }
      let aiMessageout = {};
      aiMessageout.type = "bbai";
      aiMessageout.reftype = "ignore";
      aiMessageout.action = "question";
      aiMessageout.data = fileData.data;
      aiMessageout.bbid = fileData.bbid;
      // keep track of time and any feedback from beebee agents
      this.trackAgentProgress(fileData.bbid);
      this.sendSocket.send_message(aiMessageout);
      this.helpchatHistory.push(aiMessageout);
      this.askQuestion.text = "";
      this.qcount++;
    },
    actionAgentQuestion(hopQuestion, originalQuestion, lifeStrap) {
      hopQuestion.lifestrap = lifeStrap;
      let hashQuestion = hopQuestion.bboxid || hashObject(hopQuestion);
      let aiMessageout = {};
      aiMessageout.type = "bbai";
      aiMessageout.reftype = "ignore";
      aiMessageout.action = "question";
      aiMessageout.data = hopQuestion;
      aiMessageout.bbid = hashQuestion;
      this.trackAgentProgress(hashQuestion);
      this.storeChat.beginChat = true;
      // Call handleIncomingMessage to update chat history with the peer question
      // Use original question if provided, otherwise extract from hopQuestion
      const questionText = originalQuestion
        ? originalQuestion.content || originalQuestion.text
        : hopQuestion.content;
      const questionContext = originalQuestion
        ? originalQuestion.context
        : hopQuestion.context;
      const questionTools = originalQuestion
        ? originalQuestion.tools || []
        : [];

      this.storeChat.handleIncomingMessage({
        type: "peer-question",
        role: "peer",
        content: questionText,
        context: questionContext,
        conversationId: hopQuestion.conversationId,
        contract_key: hopQuestion.contract_key,
        lifeStrapID: hopQuestion.lifeStrapID,
        bbid: hashQuestion,
        timestamp: new Date(),
        tools: questionTools,
      });
      this.sendSocket.send_message(aiMessageout);
      this.helpchatHistory.push(aiMessageout);
      this.qcount++;
    },
    actionHelpAskInput() {
      // Get the question text
      const questionText = this.askQuestion.text.trim();
      if (questionText.length > 0) {
        // Extract tools from the question
        const tools = this.extractToolsFromQuestion(questionText);

        // Add user question to chat history
        const userMessage = this.storeChat.addPeerQuestion(questionText, tools);

        // Create message for HOP
        let saveQ = {};
        saveQ.count = this.qcount;
        saveQ.text = questionText;
        saveQ.compute = this.askQuestion.compute;
        saveQ.active = true;
        let date = new Date();
        saveQ.time = date.toLocaleTimeString();

        this.inputAskHistory.push(saveQ);

        let hashQuestion = hashObject(saveQ);
        let aiMessageout = {};
        aiMessageout.type = "bbai";
        aiMessageout.reftype = "ignore";
        aiMessageout.action = "question";
        aiMessageout.data = saveQ;
        aiMessageout.bbid = hashQuestion;

        // keep track of time and any feedback from beebee agents
        this.trackAgentProgress(hashQuestion);

        // Send to HOP
        this.sendSocket.send_message(aiMessageout);
        this.helpchatHistory.push(aiMessageout);

        // Clear the input
        this.askQuestion.text = "";
        this.qcount++;
      } else {
        // No question entered
        console.log("No question text entered");
      }
    },
    extractToolsFromQuestion(text) {
      const toolRegex = /@(\w+)/g;
      const matches = text.match(toolRegex) || [];
      return matches.map((match) => match.substring(1));
    },
    processStreamReply(received) {
      if (received.type === "bbai-stream-reply") {
        // Normalize data shape
        const messageData =
          typeof received.data === "string"
            ? { text: received.data }
            : received.data;

        // Normalize bbid/bboxid
        const incomingBbid =
          received.bbid || messageData?.bboxid || messageData?.bbid;

        // Derive context if missing on stream packets
        let derivedContext = received.context;
        if (!derivedContext) {
          // Look back through chat history for a matching peer/agent with same bbid/bboxid
          const hist = this.storeChat.chatHistory || [];
          for (let i = hist.length - 1; i >= 0; i--) {
            const msg = hist[i];
            if (
              (msg.bboxid === incomingBbid || msg.bbid === incomingBbid) &&
              (msg.type === "peer" || msg.type === "agent")
            ) {
              derivedContext = msg.context || msg.metadata?.context;
              if (derivedContext) break;
            }
          }
          if (!derivedContext) {
            // Fallback to current UI context with id when in space chat
            const cueId = this.liveBspace?.cueid || this.liveBspace?.spaceid;
            derivedContext =
              this.beebeeContext === "chatspace" && cueId
                ? { type: "chatspace", id: cueId }
                : "chat";
          }
        }

        this.storeChat.handleIncomingMessage({
          type: "agent-reply",
          bbid: incomingBbid,
          data: messageData,
          status: received.status || "streaming",
          messageType: received.messageType || "response",
          metadata: received.metadata || {},
          context: derivedContext,
          conversationId: this.chatAttention,
        });
      }
    },
    processReply(received) {
      if (received.action === "npl-reply") {
        if (received.task === "lens-extraction") {
          if (received.data.lens.context.length > 0) {
            this.lifestrapTexture.pillars.capacity.push({
              label: "Initial",
              value: received.data.lens?.capacity,
            });
            // this.lifestrapTexture.pillars.coherence ...
            let splitContext = received.data.lens.context.split(",");
            this.lifestrapTexture.pillars.context = splitContext.map((v) => ({
              label: "Extracted",
              value: v,
            }));
          }
        }
      } else if (received.action === "ls-pattern") {
        console.log("lens arrived", received.data);

        const slots = received.data.context?.slots || [];
        const unmappedFragments =
          received.data.context?.unmappedFragments || [];

        const newTexture = {
          pillars: {
            capacity: [
              ...(received.data.capacity?.map((v) => ({
                label: "Capacity",
                value: v,
              })) || []),
              ...slots
                .filter((s) => s.type === "capacity")
                .map((s) => ({ label: "Capacity", value: s.value })),
            ],
            context: [
              ...slots
                .filter((s) => s.type === "heart" || s.label === "Activity")
                .map((s) => ({ label: "Activity", value: s.value })),
              ...slots
                .filter((s) => s.label === "Space" || s.type === "environment")
                .map((s) => ({ label: "Space", value: s.value })),
              ...slots
                .filter((s) => s.label === "Temporal" || s.type === "earth")
                .map((s) => ({ label: "Temporal", value: s.value })),
            ],
            heli: [
              ...(received.data.heli
                ? Object.entries(received.data.heli).flatMap(([k, v]) =>
                    v.map((val) => ({ label: k, value: val })),
                  )
                : []),
              ...slots
                .filter((s) => s.type === "heli")
                .map((s) => ({ label: "Orbit Target", value: s.value })),
              ...slots
                .filter((s) => s.label === "Rhythm")
                .map((s) => ({ label: "Rhythm", value: s.value })),
              ...slots
                .filter((s) => s.label === "Performance")
                .map((s) => ({ label: "Performance", value: s.value })),
            ],
            attunement: [
              ...slots
                .filter(
                  (s) => s.type === "attunement" || s.label === "Attunement",
                )
                .map((s) => ({ label: "Attunement", value: s.value })),
            ],
            coherence: {
              isStable: received.data.context?.isStable || false,
              resonance: 0,
            },
          },
          residue: unmappedFragments,
          key: received.data.lifeStrapID || "",
        };

        this.lifestrapTexture = newTexture;
        console.log(
          "[aiInterface] Updated lifestrapTexture:",
          JSON.stringify(this.lifestrapTexture, null, 2),
        );

        // Legacy compatibility for components using digestInput
        this.digestInput = this.lifestrapTexture;
        console.log(
          "[aiInterface] Updated digestInput:",
          JSON.stringify(this.digestInput, null, 2),
        );

        // Open the lens when data arrives
        this.activeLifeStrapID = received.data.lifeStrapID || "active-strap";
        this.showLifestapLens = true;
      } else if (received.action === "agent-task") {
        if (received.task === "cale-evolution") {
          this.boxModelUpdate[received.context.bbid] = {};
          this.boxModelUpdate[received.context.bbid] = received.model.model;
        }
      } else if (received.type === "hop-learn") {
        if (received.action === "cale-evolution") {
          if (received.task === "begin") {
            this.processAgentStatus(received.data);
          } else if (received.task === "closed") {
            this.processAgentStatus(received.data);
          }
        } else if (received.action === "cale-gpt4all") {
          if (received.task === "begin") {
            this.processAgentStatus(received.data);
          } else if (received.task === "closed") {
            this.processAgentStatus(received.data);
          } else if (received.task === "models") {
            this.llmModelsList = received.data;
          }
        }
      } else if (received.action === "hop-learn-feedback") {
        if (received.data.agent === "not-active") {
          let pairBB = {};
          pairBB.question = received.data.input;
          pairBB.reply = received;
          this.historyPair[this.chatAttention].push(pairBB);
          // switch off feedback orchestration message
          this.processAgentFeedback(received.data);
        }
      } else if (received.action === "no-data") {
      } else {
        // if (received.action !== undefined) {
        // match to question via bbid
        if (received.data) {
          let questionStart = {};
          let questionCount = [];
          for (let histMatch of this.helpchatHistory) {
            if (histMatch.bbid === received.bbid) {
              questionCount.push(histMatch);
              questionStart = histMatch;
            }
          }
          if (questionCount.length === 1) {
            // does the question exist from file upload?
            if (questionCount[0].data?.filedata) {
              // set box detail setings
              let opendataToolbar = this.liveChatUtil.setOpendataToolbar();
              this.storeBentobox.boxToolStatus[received.bbid] = {};
              this.storeBentobox.boxToolStatus[received.bbid] = opendataToolbar;
              this.storeBentobox.devicesettings[received.bbid] = {};
              this.storeBentobox.devicesettings[received.bbid] =
                this.storeBentobox.settings;
              this.storeBentobox.chartStyle[received.bbid] = "line"; // this.boxSettings.chartstyle  // 'line'
            } else {
              let pairBB = {};
              pairBB.question = questionStart;
              pairBB.reply = received;
              // is the peer signed in?
              if (this.storeAcc.peerauth === false) {
              } else {
                this.historyPair[this.chatAttention].push(pairBB);
                this.storeBentobox.boxToolStatus[received.bbid] =
                  this.boxSettings;
                this.storeBentobox.devicesettings[received.bbid] = {};
                this.storeBentobox.devicesettings[received.bbid] =
                  this.storeBentobox.settings;
              }
            }
            // stop any agent feedback message
            this.trackAgentProgressUpdate(received.bbid);
          }
          if (received.action === "library-peerlibrary" || "publiclibrary") {
            this.storeLibrary.processReply(received, questionStart);
          }
          // check if reply is upload?  If yes, present upload interface
          if (received.action === "upload") {
            // this.uploadStatus = true
          }
          this.beginChat = true;
          this.chatBottom++;
        }
      }
    },
    processAgentStatus(data) {
      // upload agent model status
      let updateModelActive = [];
      for (let agentM of this.agentModelDefault) {
        if (agentM.value.computational.model === data.model) {
          agentM.value.computational.active = true;
          updateModelActive.push(agentM);
        } else {
          updateModelActive.push(agentM);
        }
      }
      this.agentModelDefault = updateModelActive;
      this.agentStatus = true;
      this.modelLoading = false;
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
    processNotification(received) {
      // stop any agent feedback message
      this.trackAgentProgressUpdate(received.data.data.bbid);
      this.countNotifications++;
      this.notifList.push(received);
      // add to chart part list (do now or on requrest?)
      if (received.action === "chart") {
        // match peer to name or public key
        let peerMatch = this.storeAcc.warmPeers.find(
          (peer) => peer.key === received.data.publickey,
        );
        let pairBB = {};
        let question = {};
        question.bbid = received.data.data.bbid;
        question.data = { active: true, text: received.action };
        pairBB.question = question;
        let reply = {};
        reply.time = new Date();
        reply.type = received.action;
        reply.bbid = received.data.data.bbid;
        reply.data = { text: peerMatch.value.name + " " + received.text };
        reply.network = true;
        pairBB.reply = reply;
        this.historyPair[this.chatAttention].push(pairBB);
        this.storeChat.beginChat = true;
        this.chatBottom++;
      } else if (received.action === "warm-peer-connect") {
        // set via account store - just add to notify list here.
      } else if (received.action === "warm-peer-topic") {
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
      } else if (received.action === "warm-peer-topic") {
      } else if (received.action === "network-library-n1") {
        // create a notification accept public board and save?
      } else if (received.action === "cue-space") {
        // populate space  check if cue needing setup then fill and notify
      } else if (received.action === "network-replicate-publiclibrary") {
        this.storeLibrary.replicateFeedback = received.data.data;
      }
    },
    preparePublicConfirm(item, peer) {
      // match to peerid  name
      let matchPeername = "";
      if (peer === "") {
        matchPeername = this.storeAcc.warmPeers.find(
          (peer) => peer.key === item.data.publickey,
        );
      } else {
        matchPeername = peer;
      }
      // produce a pair for the current chat
      let newBBID = "23232";
      let pairBB = {};
      let question = {};
      question.bbid = newBBID;
      question.data = {
        active: true,
        text:
          "Please confirm adding board to public library sent by " +
          matchPeername.value.name,
      };
      pairBB.question = question;
      let reply = {};
      reply.time = new Date();
      reply.type = item.action;
      reply.data = { text: item.data.data };
      reply.network = true;
      pairBB.reply = reply;
      this.historyPair[this.chatAttention].push(pairBB);
      this.storeChat.beginChat = true;
      this.chatBottom++;
    },
    prepareCuespace(notItem) {
      // notify peer that this cue content came from a shared peer
      // match name to publickey
      let matchPeername = this.storeAcc.warmPeers.find(
        (peer) => peer.key === notItem.data.publickey,
      );
      this.sharePeer[notItem.data.data.content.cuecontract.spaceid] =
        matchPeername.value.name;
      // have any bentoboxn1 been sent?
      // check if n1 with cue space
      if (notItem.data.data.content.bbn1.publicN1contracts !== undefined) {
        if (notItem.data.data.content.bbn1.publicN1contracts.length > 0) {
          for (let bbn1 of notItem.data.data.content.bbn1.publicN1contracts) {
            this.preparePublicConfirm(
              { action: "network-library-n1", data: bbn1 },
              matchPeername,
            );
          }
        }
      }
      let cueContract = notItem.data.data.content.cuecontract;
      let notCuespace = "";
      this.beebeeContext = "chatspace";
      this.bentospaceState = !this.bentospaceState;
      this.liveBspace = cueContract; // get from notificationspaceID
      // make button green
      let spaceLiveList = [];
      for (let spi of this.storeBentobox.spaceList) {
        if (spi.spaceid === cueContract.spaceid) {
          spi.active = true;
          spaceLiveList.push(spi);
        } else {
          spi.active = false;
          spaceLiveList.push(spi);
        }
      }
      this.storeBentobox.spaceList = spaceLiveList;
      // now setup N=1 media, research, markers, products
      let contentTypes = Object.keys(notItem.data.data.content);
      for (let spcont of contentTypes) {
        // media, research etc.
        if (spcont === "media") {
          this.storeBentobox.prepareMediaSpace(
            notItem.data.data.content[spcont],
          );
        } else if (spcont === "research") {
          this.storeBentobox.prepareResearchSpace(
            notItem.data.data.content[spcont],
          );
        } else if (spcont === "markers") {
          this.storeBentobox.prepareMarkerSpace(
            notItem.data.data.content[spcont],
          );
        } else if (spcont === "products") {
          this.storeBentobox.prepareProductSpace(
            notItem.data.data.content[spcont],
          );
        }
      }
    },
    processPeerData(dataNetwork) {
      let matchBBID = dataNetwork.bbid;
      let hopDataChart = dataNetwork.data;
      // create a pair for chat display
      this.storeBentobox.bentoboxData[matchBBID] = hopDataChart;
      this.storeBentobox.setChartstyle(matchBBID, "line");
      this.storeBentobox.expandBentobox[matchBBID] = false;
      this.storeBentobox.beebeeChatLog[matchBBID] = true;
      this.bentoboxList["space1"] = [];
    },
    processHOPsummary(dataSummary) {
      // match bbid to HOP ID
      if (dataSummary?.data !== undefined) {
        let inputID = Object.keys(dataSummary.data);
        let HOPshell = dataSummary.data[inputID[0]].shellID;
        this.bbidHOPid.push({ bbid: dataSummary.bbid, HOPid: HOPshell });
        this.hopSummary.push({ HOPid: HOPshell, summary: dataSummary });
      }
    },
    processHOPdata(dataHOP) {
      // HOP return bentobox data
      console.log("hop data back from SafeFlow via HOP");
      console.log(dataHOP);
      // match input id to bbid
      // is the data for past or future or no data
      if (dataHOP?.data?.data === "none") {
        // need to match to summary data for context
        let contKey = dataHOP.context.input.key;
        let matchSummary = this.liveChatUtil.matchSummaryPeerContract(
          contKey,
          this.storeLibrary.peerExperimentList,
        );
        this.dataBoxStatus = false;
        // stil produce a bentobox
        let boxID = this.liveChatUtil.matchHOPbbid(
          dataHOP.context.dataprint.shell,
          this.bbidHOPid,
        );
        // update the latest compute module contract back from HOP
        this.computeModuleLast[boxID] = dataHOP.context.tempComputeMod.info;
        // set open data toolbar
        let opendataToolbar = this.liveChatUtil.setOpendataToolbar();
        this.storeBentobox.boxToolStatus[boxID] = {};
        this.storeBentobox.boxToolStatus[boxID] = opendataToolbar;
        // only need to prepare chat is current mode chat, if space ignore
        if (this.beebeeContext === "chat") {
          // prepare message for agent to say no data for this HOPquery
          //let pairBB = this.liveChatUtil.prepareChatQandA(boxID, matchSummary)
          //this.historyPair[this.chatAttention].push(pairBB)
        }
        let hopDataChart = {};
        hopDataChart.datasets = [{ label: "datatype11", data: [] }];
        hopDataChart.labels = [];
        this.storeBentobox.bentoboxData[boxID] = hopDataChart;
        this.storeBentobox.setChartstyle(
          boxID,
          dataHOP.context.moduleorder.visualise.value.info.settings.visualise,
        );
        // this.storeBentobox.expandBentobox[boxID] = true
        this.storeBentobox.beebeeChatLog[boxID] = true;
        this.chatBottom++;
      } else if (dataHOP.type === "sf-newEntityRange") {
        // new bentobox data
        this.dataBoxStatus = false;
        let matchBBID = this.liveChatUtil.matchHOPbbid(
          dataHOP.data.context.shell,
          this.bbidHOPid,
        );
        this.bboxFeedback[matchBBID] = {};
        // update the latest compute module contract back from HOP (if provided)
        if (dataHOP.context.tempComputeMod !== undefined) {
          this.computeModuleLast[matchBBID] =
            dataHOP.context.tempComputeMod.info;
        }
        // set default space  NEEDS BETTER LOGIC
        this.bentoboxList["space1"] = [];
        // this.storeBentobox.expandBentobox[matchBBID] = true
        this.storeBentobox.beebeeChatLog[matchBBID] = true;

        // Determine the correct chat context for this bbid
        let contextForReply = null;
        const hist = this.storeChat.chatHistory;
        for (let i = hist.length - 1; i >= 0; i--) {
          const msg = hist[i];
          if (
            (msg.bboxid === matchBBID || msg.bbid === matchBBID) &&
            (msg.type === "peer" || msg.type === "agent")
          ) {
            contextForReply = msg.context || msg.metadata?.context || null;
            if (contextForReply) break;
          }
        }
        if (!contextForReply) {
          // Fall back to current UI context with id for space chat
          contextForReply =
            this.beebeeContext === "chatspace"
              ? {
                  type: "chatspace",
                  id: this.liveBspace?.cueid || this.liveBspace?.spaceid,
                }
              : "chat";
        }

        // prepare the chat message for agent reply
        this.storeChat.handleIncomingMessage({
          type: "agent-reply",
          bbid: matchBBID,
          data: { type: "bentobox" },
          status: "bentobox",
          messageType: "bentobox",
          metadata: {},
          context: contextForReply,
        });
        // set the data for visualizations
        let hopDataChart = {};
        hopDataChart.datasets = dataHOP.data.data.chartPackage.datasets;
        hopDataChart.labels = dataHOP.data.data.chartPackage.labels;
        // double check data to display if not produce beebee feedback message
        if (hopDataChart.labels.length > 0) {
          this.storeBentobox.bentoboxData[matchBBID] = hopDataChart;
          this.storeBentobox.setChartstyle(
            matchBBID,
            dataHOP.context.moduleorder.visualise.value.info.settings.visualise,
          );
        } else {
          this.bboxFeedback[matchBBID] = { text: "No data for this HOPquery" };
          // clear view experiment on bentobox
          this.storeBentobox.bentoboxData[matchBBID] = { text: "live" };
        }
      } else {
        // data for future prediction
        this.processFuture(dataHOP);
      }
    },
    processFuture(dataHOP) {
      // prepare chart for bentobox with ID
      let HOPid = dataHOP.context.input.entityUUID;
      let futureMatch = "";
      for (let fpi of this.futurePids) {
        if (fpi.hopid === HOPid) {
          futureMatch = fpi.bboxid;
        }
      }
      this.activeFuture[futureMatch] = true;
      this.futureNumberData[futureMatch] =
        dataHOP.data.data.chartPackage.datasets[0].data; // [ 1, 2, 3 ]
      this.futureLabelData[futureMatch] = dataHOP.data.data.chartPackage.labels; // [ 'January', 'February', 'March' ]
      // need to set chart style or assume past style?
    },
    prepareFuture(boxid) {
      // any additional text added or just button click context
      let matchBBID = "";
      for (let bhid of this.bbidHOPid) {
        if (bhid.bbid === boxid) {
          matchBBID = bhid.HOPid;
        }
      }
      // keep track of future pid's
      this.futurePids.push({ bboxid: boxid, hopid: matchBBID });
      // take info from NXP past and flag update to existing NXP
      let queryNXP = {};
      for (let nxp of this.hopSummary) {
        if (nxp.HOPid === matchBBID) {
          queryNXP = nxp.summary.data;
        }
      }
      // message beebee  --  TODO make a model to form messages out (standard format keep consistant)
      let aiMessageout = {};
      aiMessageout.type = "bbai";
      aiMessageout.reftype = "ignore";
      aiMessageout.action = "predict-future";
      aiMessageout.data = {
        question: "future chart line",
        model: "linear-regression",
        nxp: queryNXP,
      };
      aiMessageout.bbid = boxid;
      const sendocket = useSocketStore();
      this.sendSocket.send_message(aiMessageout);
    },
    prepareLibrarySummary(boxid, action, cue) {
      for (let hi of this.hopSummary) {
        if (hi.summary.bbid == boxid) {
          // new or saved format
          if ("data" in hi.summary) {
            this.boxLibSummary[boxid] = hi.summary;
          } else {
            this.boxLibSummary[boxid] = hi.summary.summary;
          }
        } else {
          if (hi.summary.summary === undefined) {
            this.boxLibSummary[boxid] = hi.summary;
          } else {
            this.boxLibSummary[boxid] = hi.summary.summary.summary;
          }
        }
      }
      // let NXPcontract = this.boxLibSummary[boxid].data
      if (this.boxLibSummary[boxid] === undefined) {
        this.storeLibrary.prepareLibraryViewFromContract(boxid, boxid);
        if (action === "space-add") {
          this.openCueSpaceSettings(cue);
        }
      } else {
        if (action === "space-add") {
          this.openCueSpaceSettings(cue);
        }
        let key = Object.keys(this.boxLibSummary[boxid].data);
        // now update compute contract to latest one back from HOP
        let computeLatestModules = [];
        for (let mod of this.boxLibSummary[boxid].data[key[0]].modules) {
          if (mod.value.style === "compute") {
            let lastMod = this.computeModuleLast[boxid];
            computeLatestModules.push(lastMod);
          } else {
            computeLatestModules.push(mod);
          }
        }
        this.boxLibSummary[boxid].data.modules = computeLatestModules;
        // let modulesContracts = NXPcontract[key[0]].modules
        let extractedOD =
          this.storeLibrary.utilLibrary.moduleExtractSettings(
            computeLatestModules,
          );
        this.storeBentobox.openDataSettings[boxid] = extractedOD;
        return true;
      }
    },
    openCueSpaceSettings(cue) {
      const cueId = cue.key;
      const name = cue.value.concept.name;
      this.liveBspace = { cueid: cueId, name };
      // prepare chat for space and ensure it appears in chat menu
      const now = Date.now();
      const newChatItem = {
        name,
        chatid: cueId,
        active: true,
        createTimestamp: now,
        lastTimestamp: now,
        useCount: 0,
        favoriteCount: 0,
      };
      // add/update in chat menu
      const existingIdx = this.storeBentobox.chatList.findIndex(
        (c) => c.chatid === cueId,
      );
      let finalChatItem = newChatItem;
      if (existingIdx === -1) {
        this.storeBentobox.chatList = this.storeBentobox.chatList.map((c) => ({
          ...c,
          active: false,
        }));
        this.storeBentobox.chatList.push(newChatItem);
      } else {
        const existing = this.storeBentobox.chatList[existingIdx];
        const updated = {
          ...existing,
          active: true,
          lastTimestamp: now,
          useCount: (existing.useCount || 0) + 1,
        };
        const list = this.storeBentobox.chatList.map((c, i) =>
          i === existingIdx ? updated : { ...c, active: false },
        );
        this.storeBentobox.chatList = list;
        finalChatItem = updated;
      }
      // setup chat history holder and focus
      this.setupChatHistory(finalChatItem);
      this.chatAttention = cueId;
      this.storeCues.cueContext = "space";
      this.beebeeContext = "chatspace";
      this.bentospaceState = true;
      this.historyList = true;
    },
    prepareSpaceSave(message) {
      // match bentoboxes, cues, content (media, research, markers, products)
      // bentoboxes
      let boxidPerspace = this.bentoboxList[message.data.cueid];
      if (boxidPerspace !== undefined) {
        let visDataperSpace = [];
        let locationPerSpace = [];
        for (let bbi of boxidPerspace) {
          let visD = this.storeBentobox.bentoboxData[bbi.bboxid];
          visDataperSpace.push(visD);
          // current location to save
          locationPerSpace.push({
            bboxid: bbi.bboxid,
            location:
              this.storeBentobox.locationBbox[message.data.cueid][bbi.bboxid],
          });
        }
        // build media info per space
        let saveData = {};
        saveData.pair = {};
        saveData.space = message.data;
        saveData.location = locationPerSpace;
        saveData.visData = visDataperSpace;
        saveData.bboxlist = boxidPerspace;
        // save media boxes
        // saveData.mboxlist = bmMediaPerspace
        message.data = saveData;
        this.sendSocket.send_message(message);
      } else {
        console.log("no boxid");
      }
      // cues
      // media
      // let mediaidPerspace = this.storeBentobox.videoMedia[message.data.cueid]
      // research
      // let researchidPerspace = this.storeBentobox.researchMedia[message.data.cueid]
      // markers
      // let markeridPerspace = this.storeBentobox.markerMedia[message.data.cueid]
      // products
      // let productidPerspace = this.storeBentobox.ProductMedia[message.data.cueid]
    },
    prepareAI(message) {
      // need to build DML structure, proof of work hash
      // ask library for NXP contract
      this.prepareLibrarySummary(message.bbid);
      let nxpContract = this.boxLibSummary[message.bbid];
      if (message.action == "agent-task") {
        this.sendMessageHOP(message);
      } else if (message.action === "agent-network-task") {
        message.data = nxpContract.data;
        this.sendMessageHOP(message);
      }
    },
    prepareModelContract(modelInfo) {
      // structure inputs for cue contract
      modelInfo.active = true;
      const modelContract = {};
      modelContract.type = "library";
      modelContract.action = "model";
      modelContract.reftype = "new-model";
      modelContract.task = "PUT";
      modelContract.privacy = "public";
      let modelHolder = {};
      let concept = {};
      concept.agent = modelInfo.agent;
      concept.name = modelInfo.name;
      concept.model = modelInfo.model;
      concept.description = modelInfo.description;
      modelHolder.concept = concept;
      modelHolder.computational = modelInfo;
      modelContract.data = modelHolder;
      this.sendMessageHOP(modelContract);
      // if previous model, update to onstart false, active false
      if (this.previousLLM?.first === true) {
      } else {
        this.prepareUpdateModelContract(this.previousLLM, false, false);
      }
    },
    prepareUpdateModelContract(modelInfo, active, onstart) {
      // structure inputs for cue contract
      modelInfo.value.computational.active = active;
      modelInfo.value.computational.onstart = onstart;
      const modelContract = {};
      modelContract.type = "library";
      modelContract.action = "model";
      modelContract.reftype = "new-model";
      modelContract.task = "UPDATE";
      modelContract.privacy = "public";
      modelContract.data = modelInfo;
      this.sendMessageHOP(modelContract);
    },
    sendModelControl(modelInfo, action) {
      let learnMessage = {};
      learnMessage.type = "bbai";
      learnMessage.reftype = "ignore";
      learnMessage.action = action;
      learnMessage.data = { agent: modelInfo.agent, model: modelInfo.model };
      learnMessage.bbid = "";
      this.sendMessageHOP(learnMessage);
    },
    async beebeeDigest(call, demo) {
      console.log("beebeeDigest", demo);
      let primeLifeStrap = false;
      // is this the very first message in? If so, create a new life-strap story
      if (this.storeLibrary.straps.length === 0) {
        console.log(" first life-strap  create and save id");
        let lifeStrapData = {};
        lifeStrapData.name = "prime-life-strap";
        lifeStrapData.inquiry = this.askQuestion.text;
        this.storeLibrary.createLifeStrap(lifeStrapData);
        this.askQuestion.text = "";
        primeLifeStrap = true;
      } else if (this.newLifestrap === true) {
        console.log("not first ever but new lifestrap story");
        let lifeStrapData = {};
        lifeStrapData.name = "new-life-strap";
        lifeStrapData.inquiry = this.askQuestion.text;
        this.storeLibrary.createLifeStrap(lifeStrapData);
        // next
        this.askQuestion.text = "";
        // reset new ls flag
        this.newLifestrap = false;
      } else {
        // look out for demo or normal chat dialogue on going conversation
        if (demo !== undefined && demo === true) {
          console.log("dem0--path digetst");
          this.askQuestion.text = "";
          // 5. Log the Peer Input (Before extraction starts)
          this.storeChat.addMessage({
            role: "peer",
            type: "peer",
            content: peerInput,
            context: "extraction",
            conversationId: sovereignID,
            contract_key:
              this.activeContractKey ||
              (this.storeLibrary.straps &&
                this.storeLibrary.straps[0]?.contract_key) ||
              "",
            lifeStrapID: sovereignID,
          });

          // --- DEMO PATH (400m Swim) ---
          this.digestInput = {
            capacity: ["400IM Performance"],
            context: ["swimming", "Aquatic Environment", "10 Orbits"],
            coherence: ["Biological Barrier Model"],
          };

          // Generate/Set Demo Contract Key
          this.activeContractKey = "ck_demo_swim_400";
          this.activeLifeStrapID = "ls_demo_pool";
          this.chatAttention = "ls_demo_pool";

          // BeeBee Confirmation Message
          this.storeChat.addMessage({
            role: "beebee",
            type: "agent",
            content:
              "The Health Oracle Protocol has analyzed your swimming intent. Have we extracted the intent correctly? Please click on any word to create a space, chat more, or upload data.",
            context: "extraction",
            conversationId: "ls_demo_pool",
            contract_key: this.activeContractKey,
            lifeStrapID: this.activeLifeStrapID,
            status: "complete",
          });
        } else {
          // ongoing dialogue with beebee on life-strap or space chat?
          if (this.beebeeContext === "lifestrap") {
            // this.liveBspace?.cueid = ''
          }
          console.log("call on beebee digetst");
          // pass to submit to prepare chat
          this.submitAsk({}, primeLifeStrap);
        }
      }
    },
    setBeeBeeDialogue(lifeStrap) {
      // 1. Pivot out of Zen Mode
      this.currentMode = "extracting";
      this.beebeeContext = "extraction";
      const peerInput = lifeStrap.value.concept.story;

      // 3. Open BeeBee Chat Panel
      this.storeChat.chatWidth = 380;
      this.storeChat.isChatOpen = true;

      // 4. Determine the Sovereign ID for this session
      // If we have a hardcoded strap or active strap, use it. Otherwise fallback to 'chat'
      const sovereignID = lifeStrap.key;
      this.chatAttention = sovereignID;

      // Ensure the chat bucket exists in historyPair for UI reactivity
      if (!this.historyPair[sovereignID]) {
        this.historyPair[sovereignID] = [];
      }

      // Ensure the chat bucket exists in chatStore for UI reactivity
      if (!this.storeChat.chatHistory[sovereignID]) {
        this.storeChat.chatHistory[sovereignID] = [];
      }
      // form the conversation
      this.storeChat.addMessage({
        role: "peer",
        type: "peer",
        content: peerInput,
        context: "extraction",
        conversationId: sovereignID,
        contract_key: this.chatAttention,
        lifeStrapID: sovereignID,
      });

      // beebee replay
      this.storeChat.addMessage({
        role: "beebee",
        type: "agent",
        content: "The Health Oracle Protocol is digesting the story.",
        context: "extraction",
        conversationId: sovereignID,
        contract_key: sovereignID,
        lifeStrapID: sovereignID,
        status: "complete",
      });
    },
    setActiveLifeStrap(lsContract) {
      this.lifeStrapID = lsContract.key;
      this.activeLifeStrapID = lsContract.key;
      this.activeContractKey = lsContract.key;
      this.chatAttention = lsContract.key;
      this.beebeeContext = "lifestrap";

      // Open the bottom panel to show detail
      // this.storeBesearch.showBottomPanel = false;
      // this.storeBesearch.bottomHeight = 400;
    },
    initializeSovereignSession(lsKey) {
      let latestStrap = {};
      // first time life-strap or another story?
      if (this.storeLibrary.straps.length > 0) {
        latestStrap = this.storeLibrary.straps.find((s) => s.key === lsKey);
      } else {
        latestStrap = this.storeLibrary.straps[0]; // Logic for 'latest'
      }

      if (latestStrap) {
        // 2. Set the Master ID
        this.lifeStrapID = latestStrap.key;
        this.chatAttention = latestStrap.key;

        // 3. Set the Mode so the UI knows we aren't in 'Zen'
        // We move straight to 'active' or 'extracting'
        this.currentMode = "extracting";
        this.activeWorld = "orbit";
        this.setBeeBeeDialogue(latestStrap);
      } else {
        // No straps found? Stay in Zen mode for First Peer Experience
        this.currentMode = "zen";
      }
    },
  },
});
