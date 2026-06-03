import { shallowRef, markRaw } from "vue";
import { defineStore } from "pinia";
import hashObject from "object-hash";
import { useSocketStore } from "@/stores/socket.js";
import { bentoboxStore } from "@/stores/bentoboxStore.js";
import { libraryStore } from "@/stores/libraryStore.js";
import { useChatStore } from "@/stores/chatStore.js";
import DataPraser from "@/stores/hopUtility/dataParse.js";
import LifestrapUtilty from "@/stores/hopUtility/lifestrapUtility.js";
import ChatUtilty from "@/stores/hopUtility/chatUtility.js";
import ChatspaceUtilty from "@/stores/hopUtility/chatspaceUtility.js";
import ExperienceOrchestrator from "@/stores/hopUtility/experienceOrchestrator.js";
import { accountStore } from "@/stores/accountStore.js";
import { cuesStore } from "@/stores/cuesStore.js";
import { teachingStore } from "@/stores/teachingStore.js";
import { besearchStore } from "@/stores/besearchStore.js";
import { orreryStore } from "@/stores/orreryStore.js";
import { lifestrapStore } from "@/stores/lifestrapStore.js";
import { loomStore } from "@/stores/loomStore.js";

export const aiInterfaceStore = defineStore("beebeeAIstore", {
  state: () => {
    return {
      storeAcc: accountStore(),
      sendSocket: useSocketStore(),
      storeCues: cuesStore(),
      storeBentobox: bentoboxStore(),
      storeLibrary: libraryStore(),
      storeOrrery: orreryStore(),
      storeLifestrap: lifestrapStore(),
      storeLoom: loomStore(),
      storeChat: useChatStore(),
      storeTeaching: teachingStore(),
      storeBesearch: besearchStore(),
      liveDataParse: new DataPraser(),
      liveLsUtil: new LifestrapUtilty(),
      liveChatUtil: new ChatUtilty(),
      liveChatspaceUtil: new ChatspaceUtilty(),
      experienceOrchestrator: null,
      currentMode: "zen",
      activeWorld: "orbit",
      newLifestrap: false,
      chatAttention: "",
      historyPair: {},
      isInitialState: true,
      activeLifeStrapID: "",
      activeContractKey: "",
      activeLifestrapKey: "",
      askQuestion: { text: "", compute: "observation" },
      historyList: false,
      historyBar: false,
      subscribers: [],
      helpchatHistory: shallowRef([]),
      beebeeContext: "chat",
      qcount: 0,
      inputTools: [],
      invitePlaceHolder: {
        opening: "Ready to weave a new story into the World?",
        invite: "Expand the knowledge-fold?",
        wait: "Awaiting a story to anchor.",
        device: "A new pulse is present. Witness it?",
      },
      notifList: [],
      countNotifications: 0,
      agentProgress: {},
      beebeeStatus: false,
      historyCuesList: false,
      dataBoxStatus: false,
      isUploadMode: false,
      isLibraryMode: false,
      chatBottom: 0,
      beebeeSidebarOpen: false,
      beebeeSidebarPrompt: "",
      showLifestapLens: false,
      agentStatus: false,
      modelLoading: false,
      helpchatAsk: markRaw({
        text: "",
        time: "",
        active: true,
      }),
      boxSettings: { opendatatools: { active: false }, boxtoolshow: { active: false }, vistoolsstatus: { active: false }, scalezoom: 1, location: {}, chartstyle: "line", legends: true },
      bboxFeedback: {},
      interactionMode: "lens",
      activeFuture: {},
      futureLabelData: {},
      futureNumberData: {},
      bentochatState: false,
      bentospaceState: false,
      bentocuesState: false,
      bentodiaryState: false,
      bentoflakeState: false,
      bentographState: false,
      boxLibSummary: {},
      computeModuleLast: {},
      nexusAutoOpen: false,
      cueAction: "cues",
      showBbNexus: false,
      statusCALE: {
        text: "off",
        active: false,
      },
      bentobesearchState: false,
      uploadStatus: false,
      attunementActiveIndex: null,
      liveBspace: null,
      startChat: true,
      sharePeer: {},
      previousLLM: {},
      emulationHorizon: 0,
      performanceVelocity: 0,
    };
  },
  actions: {
    setEmulationHorizon(delta) {
      this.emulationHorizon = delta;
    },
    setPerformanceVelocity(value) {
      this.performanceVelocity = value;
    },
    initOrchestrator() {
      if (!this.experienceOrchestrator) {
        this.experienceOrchestrator = new ExperienceOrchestrator({
          ai: this,
          besearch: besearchStore(),
          library: libraryStore(),
          chat: useChatStore(),
          loom: loomStore(),
          lifestrap: lifestrapStore()
        });
      }
    },

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

    initializeSovereignSession(lsKey) {
      this.initOrchestrator();
      this.experienceOrchestrator.onLifestrapArrived({ key: lsKey });
    },

    beebeeDigest() {
      const storeLifestrap = lifestrapStore();
      const storyText = this.askQuestion.text;
      this.initOrchestrator();
      this.newLifestrap = true;
      const lsData = {
        name: storeLifestrap.straps.length === 0 ? "prime-life-strap" : "new-life-strap",
        inquiry: storyText
      };
      const placeholderKey = lsData.name === "prime-life-strap" ? "prime-life-strap" : "new-ls";
      this.experienceOrchestrator.activateLifestrapState(placeholderKey);
      this.storeLibrary.createLifeStrap(lsData);
      this.askQuestion.text = "";
    },

    setActiveLifeStrap(strap, contractKey = null) {
      if (!strap) return;
      const lsKey = typeof strap === 'string' ? strap : (strap.key || strap.id);
      const cKey = contractKey || (typeof strap === 'object' ? (strap.contract_key || lsKey) : lsKey);
      
      this.activeLifestrapKey = lsKey;
      this.activeLifeStrapID = lsKey;
      this.activeContractKey = cKey;
      this.chatAttention = lsKey;
      this.isInitialState = false;
    },

    processReply(received) {
      if (received.action === "ls-pattern" || received.action === "ls-whole" || received.action === "ls-whole-loom" || received.action === "npl-reply" || received.action === "bringtobe-start") {
        this.storeLoom.processReply(received);
      } else if (received.action === "lifestrap-genesis") {
        this.storeLifestrap.processReply(received);
      } else if (received.action === "seed-library") {
        // pass on to library store
        this.storeOrrery.processReply(received)
      } else if (received.action === 'warm-peers-begin') {
        // convert key to hex
        for (let wpeer of received.data) {
          const hexContract = this.storeLibrary.utilLibrary.convertBinaryToHex(wpeer);
          this.storeAcc.warmPeers.push(hexContract)
        }
        // this.storeAcc.warmPeers = received.data
      }

      if (received.bbid) {
        this.chatBottom++;
      }
    },
    processNotification(received) {
      this.countNotifications++;
      this.notifList.push(received);
    },
    processStreamReply(received) {
      if (received.type === "bbai-stream-reply") {
        this.storeChat.handleIncomingMessage({
          type: "agent-reply",
          bbid: received.bbid || received.data?.bboxid,
          data: typeof received.data === "string" ? { text: received.data } : received.data,
          status: received.status || "streaming",
          context: received.context || "chat",
          conversationId: this.chatAttention
        });
      }
    },
    preparePublicConfirm(item, peer) {
      let matchPeername = peer === "" ? this.storeAcc.warmPeers.find((p) => p.key === item.data.publickey) : peer;
      let newBBID = "23232";
      let pairBB = {
        question: { bbid: newBBID, data: { active: true, text: "Please confirm adding board to public library sent by " + (matchPeername?.value?.name || "unknown") } },
        reply: { time: new Date(), type: item.action, data: { text: item.data.data }, network: true }
      };
      if (!this.historyPair[this.chatAttention]) this.historyPair[this.chatAttention] = [];
      this.historyPair[this.chatAttention].push(pairBB);
      this.chatBottom++;
    },
    prepareCuespace(notItem) {
      let matchPeername = this.storeAcc.warmPeers.find((p) => p.key === notItem.data.publickey);
      if (matchPeername) {
        this.sharePeer[notItem.data.data.content.cuecontract.spaceid] = matchPeername.value.name;
      }
      let cueContract = notItem.data.data.content.cuecontract;
      this.beebeeContext = "chatspace";
      this.bentospaceState = !this.bentospaceState;
      this.liveBspace = cueContract;
      
      let spaceLiveList = this.storeBentobox.spaceList.map(spi => {
        spi.active = (spi.spaceid === cueContract.spaceid);
        return spi;
      });
      this.storeBentobox.spaceList = spaceLiveList;

      let contentTypes = Object.keys(notItem.data.data.content);
      for (let spcont of contentTypes) {
        if (spcont === "media") this.storeBentobox.prepareMediaSpace(notItem.data.data.content[spcont]);
        else if (spcont === "research") this.storeBentobox.prepareResearchSpace(notItem.data.data.content[spcont]);
        else if (spcont === "markers") this.storeBentobox.prepareMarkerSpace(notItem.data.data.content[spcont]);
        else if (spcont === "products") this.storeBentobox.prepareProductSpace(notItem.data.data.content[spcont]);
      }
    },
    sendMessageHOP(message) {
      this.sendSocket.send_message(message);
    },
    subscribe(callback) {
      this.subscribers.push(callback);
    },
    unsubscribe(callback) {
      this.subscribers = this.subscribers.filter(
        (subscriber) => subscriber !== callback,
      );
    },
    notifySubscribers(mutation, state) {
      this.subscribers.forEach((subscriber) => subscriber(mutation, state));
    },
    clearData() {
      this.historyPair = {};
      location.reload();
    },
    actionBBAI() {
      if (this.statusCALE.active === false) {
        this.statusCALE.active = true;
        this.statusCALE.text = "on";
      } else {
        this.statusCALE.active = false;
        this.statusCALE.text = "off";
      }
    },
    actionBBstate(context) {
      this.beebeeStatus = !this.beebeeStatus;
    },
    actionNatlangIn(event, update) {
      if (event.key === "Enter") {
        this.submitAsk();
      }
    },
    setupChatHistory(chat) {
      if (this.historyPair.hasOwnProperty(chat.chatid) === false) {
        this.historyPair[chat.chatid] = [];
      }
    },
    async submitAsk(dataInfo, primeLifeStrap) {
      try {
        const baseContext = this.beebeeContext || "chat";
        const cueId = this.liveBspace?.cueid || this.liveBspace?.spaceid;
        const keyContext = baseContext === "chatspace" && cueId ? cueId : this.chatAttention || "chat";
        
        let toolsUsed = [];
        const validationResult = this.liveChatUtil.validateQuestion(this.askQuestion.text, toolsUsed);
        if (!validationResult.isValid) {
          const feedbackMessage = this.liveChatUtil.createFeedbackMessage(validationResult.message);
          this.storeChat.addMessage(feedbackMessage);
          return;
        }

        let question = {
          role: "peer",
          type: "peer",
          content: this.askQuestion.text,
          conversationId: keyContext,
          contract_key: this.activeContractKey || "",
          lifeStrapID: this.activeLifeStrapID || "",
          context: baseContext === "chatspace" ? "space" : baseContext === "extraction" ? "extraction" : "emulation",
          tools: toolsUsed,
          timestamp: new Date(),
        };

        this.storeChat.handleIncomingMessage({
          type: "peer-question",
          role: "peer",
          content: question.content,
          context: question.context,
          conversationId: question.conversationId,
          contract_key: question.contract_key,
          lifeStrapID: question.lifeStrapID,
          bbid: hashObject(question),
          timestamp: new Date(),
          tools: question.tools,
        });

        this.sendMessageHOP({
          type: "bbai",
          reftype: "ignore",
          action: "question",
          data: question,
          bbid: hashObject(question)
        });

        this.askQuestion.text = "";
        this.askQuestion.compute = false;
        this.qcount++;
      } catch (error) {
        console.error("Error submitting question:", error);
      }
    },
  }
});
