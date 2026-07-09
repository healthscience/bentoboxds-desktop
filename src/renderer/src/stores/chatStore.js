import { shallowRef, markRaw } from "vue";
import { defineStore } from 'pinia'
import { useSocketStore } from '@/stores/socket.js'
import { aiInterfaceStore } from "@/stores/aiInterface.js"

export const useChatStore = defineStore('chat', {
  state: () => ({
    sendSocket: useSocketStore(),
    storeAI: aiInterfaceStore(),
    subscribers: [],
    bottom: null,
    chatHistory: {}, // { [conversationId]: Message[] }
    bbidToConv: {},
    currentStreamingMessage: null,
    beginChat: false,
    chatWidth: 0,
    isChatOpen: false,
    isUnrolled: false,
    isInterplayActive: false,
    chatList: [],
    historyPair: {},
    chatAttention: "",
    askQuestion: { text: "", compute: "observation" },
    historyList: false,
    historyBar: false,
    subscribers: [],
    helpchatHistory: shallowRef([]),
    helpchatAsk: markRaw({
      text: "",
      time: "",
      active: true,
    })
  }),

  getters: {
    isHeaderVisible: (state) => {
      // Show header if:
      // 1. We are in standard side-panel mode (isInterplayActive is false)
      // 2. OR we are in interplay/ribbon mode AND it is unrolled
      return !state.isInterplayActive || state.isUnrolled
    },
    chatPairs: (state) => {
      return state.historyPair[state.chatAttention]
    },
    chatAsk: (state) => {
      return state.storeAI.helpchatAsk
    },
    aiResponse: (state) => {
      return state.storeAI.beebeeReply
    },
    updateBottom: (state) => {
      return state.storeAI.chatBottom
    }
  },
  actions: {
    setupChatHistory(chat) {
      if (this.historyPair.hasOwnProperty(chat.chatid) === false) {
        this.historyPair[chat.chatid] = [];
      }
    },
    subscribe(callback) {
      this.subscribers.push(callback)
    },
    unsubscribe(callback) {
      this.subscribers = this.subscribers.filter(sub => sub !== callback)
    },
    notifySubscribers(mutation, state) {
      this.subscribers.forEach(callback => callback(mutation, state))
    },
    switchContext(context) {
      this.storeAI.switchContext(context)
    },
    dataOptionVis(did, colName, bbid, options, size) {
      this.storeAI.dataOptionVis(did, colName, bbid, options, size)
    },
    viewSummaryCSV(bbid) {
      this.storeAI.viewSummaryCSV(bbid)
    },
    dataOptionFilter(did, colName, bbid) {
      this.storeAI.dataOptionFilter(did, colName, bbid)
    },
    dateOptionSelect(did, colName, bbid) {
      this.storeAI.dateOptionSelect(did, colName, bbid)
    },
    filterdeviceEvent() {
      this.storeAI.filterdeviceEvent()
    },
    choicedeviceEvent() {
      this.storeAI.choicedeviceEvent()
    },
    addMessage(message) {
      if (!message) return
      // console.log('addMessage', message)
      // 1. Identify Sovereign Anchors
      // We prioritize the contract_key (The Hash) over the internal lifeStrapID
      const activeContractKey = this.storeAI.activeContractKey
      const activeStrapID = this.storeAI.activeLifeStrapID

      // 2. Determine Conversation ID (The Route)
      let convId = message.conversationId
      
      if (!convId) {
        // Check if the message is coming from a specific Cue Space (Capacity/Context/Coherence)
        const ctx = message.context || message.metadata?.context
        if (ctx && typeof ctx === 'object' && (ctx.type === 'chatspace' || ctx.type === 'cue')) {
          convId = ctx.id || ctx.cueid || ctx.contract_key
        }
      }

      // 3. Fallback Hierarchy: Contract Key > Life-Strap ID > Current Attention > 'chat'
      if (!convId) {
        convId = message.contract_key || message.lifeStrapID || activeContractKey || activeStrapID || this.storeAI.chatAttention || 'chat'
      }

      // 3b. Normalize convId to hex string if it's a binary Buffer
      if (convId && typeof convId === 'object' && (convId.type === 'Buffer' || Array.isArray(convId.data))) {
        const binData = convId.data || [];
        convId = binData.map(b => b.toString(16).padStart(2, "0")).join("") || convId;
      } else if (typeof convId !== 'string') {
        convId = String(convId);
      }

      // 4. Inject Metadata for Hyperbee Indexing & Peer Education
      // We tag the message with both the route and the master contract hash
      message.conversationId = convId
      
      if (activeContractKey) {
        message.contract_key = activeContractKey
      }
      
      if (activeStrapID) {
        message.lifeStrapID = activeStrapID
      }

      // 5. Track bbid/bboxid mapping for streaming updates from BeeBee
      if (message.bbid || message.bboxid) {
        const bb = message.bbid || message.bboxid
        this.bbidToConv[bb] = convId
      }

      // 6. Ensure the Ledger Bucket exists and Push the Message
      if (!this.chatHistory[convId]) {
        this.chatHistory[convId] = [];
        // Force reactivity for new keys
        this.chatHistory = { ...this.chatHistory };
      }
      
      // Natural Language First: Ensure we aren't pushing duplicates
      // (Helpful if the UI and the Store both try to log the initial Peer input)
      const isDuplicate = this.chatHistory[convId].some(m => m.id === message.id && m.id !== undefined)
      if (!isDuplicate) {
        this.chatHistory[convId].push(message)
      }

      // 7. Notify Subscribers 
      // Hyperbee listens here to commit the "Strap" to the local database
      this.notifySubscribers({ 
        type: 'newMessage', 
        payload: message,
        contract: activeContractKey // Pass contract context to subscribers
      }, this.$state)
    },
    addLifestrapStory(chatID, peerInput) {
      // beebee provides commentary on new story. lifestrap id become chat id.  cues will be id for other beebee dialogues
      if (!this.historyPair[chatID]) this.historyPair[chatID] = [];
      if (!this.chatHistory[chatID]) this.chatHistory[chatID] = [];

      this.addMessage({
        role: "peer",
        type: "peer",
        content: peerInput || "Story lensing initiated...",
        context: "lensing",
        conversationId: chatID,
        contract_key: chatID,
        lifeStrapID: chatID,
      });

      this.addMessage({
        role: "beebee",
        type: "agent",
        content: "beebee is digesting the story.",
        context: "lensing",
        conversationId: chatID,
        contract_key: chatID,
        lifeStrapID: chatID,
        status: "complete",
      });
      // save to HOP
      this.saveChatDialogue(chatID)
    },
    addUploadMessage(uploadInfo) {
      const peerMessage = {
        type: 'peer',
        content: uploadInfo?.content || '',
        timestamp: new Date(),
        bboxid: uploadInfo?.bboxid || null, // Will be set by HOP
        tools: uploadInfo?.tools || [],
        context: this.storeAI.beebeeContext || 'chat'
      }
      this.addMessage(peerMessage)
    },
    saveChatDialogue(chatID) {
      let messageHOP = {}
      messageHOP.type = 'library'
      messageHOP.action = 'dialogue-chat'
      messageHOP.reftype = 'new'
      messageHOP.privacy = 'private'
      messageHOP.task = 'PUT'
      messageHOP.data = { chatid: chatID, dialogue: this.chatHistory[chatID] }
      this.sendSocket.send_message(messageHOP)
    },
    startStreamingMessage() {
      this.currentStreamingMessage = {
        type: 'agent',
        content: '',
        streaming: true,
        timestamp: new Date()
      }
      this.addMessage(this.currentStreamingMessage)
    },
    updateStreamingMessage(content) {
      if (this.currentStreamingMessage) {
        this.currentStreamingMessage.content += content
        this.notifySubscribers({ type: 'streamingUpdate', payload: this.currentStreamingMessage }, this.$state)
      }
    },
    endStreamingMessage() {
      if (this.currentStreamingMessage) {
        this.currentStreamingMessage.streaming = false
        this.currentStreamingMessage = null
        this.notifySubscribers({ type: 'streamingComplete' }, this.$state)
      }
    },
    handleIncomingMessage(message) {
      // console.log('incoming message======chatStore')
      // console.log(message)
      
      // Handle incoming messages and update the chat state
      // Check if this is a peer question
      if (message.type === 'peer-question') {
        // Construct peer message structure
        const peerMessage = {
          type: 'peer',
          role: 'peer',
          content: message.content || message.data || message.text,
          timestamp: new Date(),
          bboxid: message.bbid,
          tools: message.tools || [],
          context: message.context,
          conversationId: message.conversationId || this.storeAI.chatAttention,
          contract_key: message.contract_key,
          lifeStrapID: message.lifeStrapID
        }

        // Add peer message to chat history
        this.addMessage(peerMessage)

        // Add placeholder for AI response
        const aiPlaceholder = {
          type: 'agent',
          role: 'beebee',
          content: '',
          timestamp: new Date(),
          bboxid: message.bbid,
          status: 'pending',
          messageType: 'response',
          metadata: {},
          context: message.context,
          conversationId: peerMessage.conversationId,
          contract_key: message.contract_key,
          lifeStrapID: message.lifeStrapID
        }
        this.addMessage(aiPlaceholder)
        
        // Mark that chat has begun
        this.beginChat = true
      }
      // Handle agent replies
      else if (message.type === 'agent-reply') {
        // Check if this is actually a token message wrapped in agent-reply
        if (message.data?.type === 'token') {
          // Redirect to token handler with proper structure
          this.handleIncomingMessage({
            type: 'token',
            data: message.data.data,
            bbid: message.data.bboxid || message.bbid
          })
          return
        } else if (message.data.type === 'bentobox') {
          // bentobox reply message (non-text) -> add as its own entry so UI can render bentobox block
          this.addMessage({
            ...message,
            status: message.status || 'complete'
          })
          return
        }
        // Extract the text content
        let textContent = ''
        if (typeof message.data === 'string') {
          textContent = message.data
        } else if (message.data?.text) {
          textContent = message.data.text
        } else if (message.data?.content) {
          textContent = message.data.content
        } else if (message.text) {
          textContent = message.text
        } else if (message.content) {
          textContent = message.content
        }
        // Find ANY agent message that isn't complete
        // First try to match by bboxid if available
        // Resolve conversation bucket via explicit conversationId, mapping, or current attention
        const convId = message.conversationId || this.bbidToConv[message.bbid] || (() => {
          const ctx = message.context || message.metadata?.context
          if (ctx && typeof ctx === 'object' && ctx.type === 'chatspace') return ctx.id || ctx.cueid
          return this.storeAI.chatAttention || 'chat'
        })()
        if (!this.chatHistory[convId]) this.chatHistory[convId] = []
        // Find ANY agent message in this conversation that isn't complete
        let existingIndex = -1
        if (message.bbid) {
          existingIndex = this.chatHistory[convId].findIndex(
            msg => msg.type === 'agent' && msg.bboxid === message.bbid && msg.status !== 'complete'
          )
        }
        if (existingIndex === -1) {
          for (let i = this.chatHistory[convId].length - 1; i >= 0; i--) {
            const msg = this.chatHistory[convId][i]
            if (msg.type === 'agent' && (msg.status === 'pending' || msg.status === 'streaming')) {
              existingIndex = i
              break
            }
          }
        }
        if (existingIndex !== -1) {
          // Update bboxid if it was null
          if (!this.chatHistory[convId][existingIndex].bboxid && message.bbid) {
            this.chatHistory[convId][existingIndex].bboxid = message.bbid
          }
          // Check if this looks like a streaming update
          // Always treat as streaming if the message is already streaming or if it's short content
          const isPartialContent = textContent && textContent.length < 50 && !textContent.includes('.') && !textContent.includes('!')
          const isAlreadyStreaming = this.chatHistory[convId][existingIndex].status === 'streaming'

          if (isPartialContent || isAlreadyStreaming) {
            // Append to existing content for streaming
            // Add a space between words when appending
            const currentContent = this.chatHistory[convId][existingIndex].content || ''
            const needsSpace = currentContent.length > 0 && !currentContent.endsWith(' ') && textContent.length > 0
            this.chatHistory[convId][existingIndex] = {
              ...this.chatHistory[convId][existingIndex],
              content: currentContent + (needsSpace ? ' ' : '') + textContent,
              status: 'streaming',
              timestamp: new Date(),
              metadata: message.metadata || {}
            }
          } else {
            // Replace content for complete messages
            this.chatHistory[convId][existingIndex] = {
              ...this.chatHistory[convId][existingIndex],
              content: textContent,
              status: 'complete',
              timestamp: new Date(),
              metadata: message.metadata || {},
              conversationId: this.storeAI.chatAttention || this.chatHistory[convId][existingIndex].conversationId
            }
          }
          // Notify subscribers about the update
          this.notifySubscribers({ type: 'messageUpdate', payload: this.chatHistory[convId][existingIndex] }, this.$state)
        } else {
          // This really shouldn't happen - it means we got an agent reply without a pending message
          // Don't create a new message - this is likely a duplicate
          // Just log the error and skip
          console.error('Skipping message creation to avoid duplicates')
        }
      }
      // Handle streaming tokens
      else if (message.type === 'token') {
        // console.log('Full token message:', message)
        // console.log('Token data:', message.data)
        // console.log('Token bbid:', message.bbid)
        // Find the most recent pending/streaming agent message
        // Resolve conversation bucket via bbid mapping or fallback
        const convId = this.bbidToConv[message.bbid] || this.storeAI.chatAttention || 'chat'
        if (!this.chatHistory[convId]) this.chatHistory[convId] = []
        // Find the most recent pending/streaming agent message in this conversation
        let targetIndex = -1
        if (message.bbid) {
          for (let i = this.chatHistory[convId].length - 1; i >= 0; i--) {
            const msg = this.chatHistory[convId][i]
            if (msg.type === 'agent' && msg.bboxid === message.bbid && (msg.status === 'pending' || msg.status === 'streaming')) {
              targetIndex = i
              break
            }
          }
        }
        if (targetIndex === -1) {
          for (let i = this.chatHistory[convId].length - 1; i >= 0; i--) {
            const msg = this.chatHistory[convId][i]
            if (msg.type === 'agent' && (msg.status === 'pending' || msg.status === 'streaming')) {
              targetIndex = i
              break
            }
          }
        }
        if (targetIndex !== -1) {
          // Update bbid if it was null
          if (!this.chatHistory[convId][targetIndex].bboxid && message.bbid) {
            this.chatHistory[convId][targetIndex].bboxid = message.bbid
          }
          // Extract text from token data - it should be a simple string
          let tokenText = ''
          if (typeof message.data === 'string') {
            tokenText = message.data
          } else if (message.data?.text) {
            tokenText = message.data.text
          } else if (message.data?.content) {
            tokenText = message.data.content
          }
          // Append token to existing message
          const currentContent = this.chatHistory[convId][targetIndex].content || ''
          // Don't add space before punctuation
          const needsSpace = currentContent.length > 0 && 
                           !currentContent.endsWith(' ') && 
                           tokenText.length > 0 &&
                           !tokenText.match(/^[.,!?;:]/)
          
          this.chatHistory[convId][targetIndex] = {
            ...this.chatHistory[convId][targetIndex],
            content: currentContent + (needsSpace ? ' ' : '') + tokenText,
            status: 'streaming',
            timestamp: new Date()
          }
          // Notify subscribers
          this.notifySubscribers({ type: 'messageUpdate', payload: this.chatHistory[convId][targetIndex] }, this.$state)
        } else {
          console.error('No pending/streaming message found for token')
          console.error('Current chat history:', this.chatHistory)
        }
      }
      // Handle end of streaming
      else if (message.type === 'stream-end' || message.type === 'streaming-complete') {     
        // Find the most recent streaming agent message
        // End streaming within active conversation bucket
        {
          const convId = this.storeAI.chatAttention || 'chat'
          const bucket = this.chatHistory[convId] || []
          for (let i = bucket.length - 1; i >= 0; i--) {
            const msg = bucket[i]
            if (msg.type === 'agent' && msg.status === 'streaming') {
              this.chatHistory[convId][i] = {
                ...this.chatHistory[convId][i],
                status: 'complete',
                timestamp: new Date()
              }
              this.notifySubscribers({ type: 'messageUpdate', payload: this.chatHistory[convId][i] }, this.$state)
              break
            }
          }
        }
        this.endStreamingMessage()
      }
      // Handle system messages
      else if (message.type === 'system') {
        // Construct system message structure
        const systemMessage = {
          type: 'system',
          content: message.content,
          timestamp: new Date()
        }
        // Add system message to chat history
        this.addMessage(systemMessage)
      }
      // Notify subscribers of the incoming message
      this.notifySubscribers({ type: 'incomingMessage', payload: message }, this.$state)
    },
    // Add a method to handle user questions
    addPeerQuestion(text, tools = []) {
      const convId = this.storeAI.chatAttention
      const peerMessage = {
        type: 'peer',
        content: text,
        timestamp: new Date(),
        bboxid: null, // Will be set by HOP
        tools: tools,
        context: this.storeAI.beebeeContext || 'chat',
        conversationId: convId
      }
      this.addMessage(peerMessage)
      // Add placeholder for AI response
      const aiPlaceholder = {
        type: 'agent',
        content: '',
        timestamp: new Date(),
        bboxid: null,
        status: 'pending',
        messageType: 'response',
        metadata: {},
        context: this.storeAI.beebeeContext || 'chat',
        conversationId: convId
      }
      this.addMessage(aiPlaceholder)
      this.beginChat = true
      return peerMessage
    },
    hydrateFromSaved(records) {
      if (!Array.isArray(records)) return
      for (const rec of records) {
        const saved = rec?.value || {}
        const chatMeta = saved.chat || {}
        let convId = chatMeta.chatid
        if (!convId) continue

        // Normalize ID
        if (convId && typeof convId === 'object' && (convId.type === 'Buffer' || Array.isArray(convId.data))) {
          const binData = convId.data || [];
          convId = binData.map(b => b.toString(16).padStart(2, "0")).join("") || convId;
        }

        const isSpace = chatMeta.context === 'chatspace'
        const isLifestrap = String(convId) === 'prime-life-strap' || String(convId).startsWith('ls_') || String(convId).startsWith('6c696665737472617021'); 
        const ctx = isSpace ? { type: 'chatspace', id: convId } : (isLifestrap ? 'lifestrap' : 'chat')
        
        const pairs = Array.isArray(saved.pair) ? saved.pair : []
        for (const pair of pairs) {
          const p = pair || {}
          const q = p.question || p.input || p.currentQuestion || (Array.isArray(p.questions) ? p.questions[0] : {}) || {}
          const r = p.reply || p.output || q.reply || {}
          const qBbid = p?.bbid || p?.bboxid || q?.bbid || q?.bboxid
          const peerText = (q?.data && (q.data.text || q.data.content || q.data?.data?.text)) || q?.text || q?.content || ''
          this.addMessage({
            type: 'peer',
            content: peerText,
            timestamp: new Date(),
            bboxid: qBbid || null,
            tools: q?.tools || [],
            context: q?.context || ctx,
            conversationId: convId,
            contract_key: q?.contract_key || chatMeta.contract_key,
            lifeStrapID: q?.lifeStrapID || chatMeta.lifeStrapID
          })
          const rData = r?.data || r
          const isBBox = rData && (rData.type === 'bentobox')
          const replyText = (rData && (rData.text || rData.content)) || r?.text || r?.content || ''
          this.addMessage({
            type: 'agent',
            content: isBBox ? rData : replyText,
            timestamp: new Date(),
            bboxid: r?.bbid || r?.bboxid || qBbid || null,
            status: 'complete',
            messageType: isBBox ? 'bentobox' : 'response',
            metadata: r?.metadata || {},
            context: r?.context || q?.context || ctx,
            conversationId: convId,
            contract_key: r?.contract_key || chatMeta.contract_key,
            lifeStrapID: r?.lifeStrapID || chatMeta.lifeStrapID
          })
        }

        // Hydrate Loom if texture data exists
        if (saved.lifestrapTexture && this.storeAI.storeLoom) {
          this.storeAI.storeLoom.lifestrapTexture = saved.lifestrapTexture;
          this.storeAI.storeLoom.digestInput = saved.lifestrapTexture;
          this.storeAI.storeLoom.updateActiveLensFromTexture(saved.lifestrapTexture);
          this.storeAI.storeLoom.loomCache[convId] = { lens: saved.lifestrapTexture };
        }

        if (pairs.length > 0) this.beginChat = true
      }
    },
    processReply (message) {
      if (message.reftype.trim() === 'chat-history') {
        if (message.action.trim() === 'start') {
          // prepare chat dialogues
          let chatMenu = []
          if (message.data.length !== 0) {
            chatMenu = this.storeAI.liveChatUtil.prepareChatMenu(message.data)
            this.storeAI.chatAttention = chatMenu[0].chatid
            let setOneActive = []
            let chatAct = 0
            for (let chat of chatMenu) {
              if (chat.active === true && chatAct === 0) {
                chatAct++
                setOneActive.push(chat)
                // set attention of chat
                this.storeAI.chatAttention = chat.chatid
              } else {
                chat.active = false
                setOneActive.push(chat)
              }
              this.storeAI.setupChatHistory(chat)
            } 
            // reflect menu in bentobox store list
            if (this.storeAI && this.storeAI.storeBentobox) {
              this.storeAI.storeBentobox.chatList = setOneActive
            }
            this.chatList = setOneActive
            // hydrate chatStore.chatHistory from saved pairs per conversation
            this.hydrateFromSaved(message.data)
            // what items was last uses ie time or could be favourite ie most frequent use
            this.storeAI.chatAttention = this.chatList[0].chatid

            // Returning Session Orchestration:
            // If the first chat item is a lifestrap story, restore the active experience.
            // Panels stay closed — data is hydrated silently so panels open correctly on first click.
            if (this.storeAI.chatAttention && (this.storeAI.chatAttention === "prime-life-strap" || this.storeAI.chatAttention.startsWith("ls_") || this.storeAI.chatAttention.startsWith("6c696665737472617021"))) {
              this.storeAI.initOrchestrator();
              const lsKey = this.storeAI.chatAttention;
              // Find the saved lifestrap record. Prefer lifestrapTexture (full pillars),
              // fall back to the chat meta object which may have story/inquiry fields.
              const matchingRec = Array.isArray(message.data) ? message.data.find(r => r.value?.chat?.chatid === lsKey) : null;
              const strapData = matchingRec?.value?.lifestrapTexture || matchingRec?.value?.chat || { key: lsKey };

              // 1. Activate all lifestrap state keys via orchestrator
              this.storeAI.experienceOrchestrator.activateLifestrapState(lsKey);

              // 2. Ensure isInitialState is cleared so the world stage shows correctly
              this.storeAI.isInitialState = false;

              // 3. Apply loom texture from saved data.
              //    applyStrapTexture passes strapData into hydrateReturningPeer so story/inquiry
              //    is available even before lifestrapStore.straps is populated.
              if (this.storeAI.storeLoom && typeof this.storeAI.storeLoom.applyStrapTexture === "function") {
                this.storeAI.storeLoom.applyStrapTexture(lsKey, strapData);
              } else {
                // Fallback: loom not ready — call hydrateReturningPeer directly with the data we have
                this.storeAI.experienceOrchestrator.hydrateReturningPeer(lsKey, strapData);
              }
            }
            this.storeAI.setupChatHistory(this.chatList[0])
          }
          // set the chat list live
          this.storeAI.historyList = true
        }
      } else if (message.reftype.trim() === "chat-history-item") {
        console.log("chat-history-item", message)
      }
    },
    prepareChatBentoBoxSave (message) {
      // Normalize and serialize history for the effective chat id
      const effectiveId = message?.data?.chatid || this.storeAI.chatAttention || "chat"
      const uiChatId = message?.data?.uiChatId || null

      // Get messages from chatHistory instead of historyPair
      const chatMessages = this.chatHistory[effectiveId] || []
      const uiMessages = uiChatId && this.chatHistory[uiChatId] ? this.chatHistory[uiChatId] : []
      const allMessages = [...chatMessages, ...uiMessages]

      const pairMap = new Map()
      const bbidPerChat = []

      // Group messages into question-reply pairs
      let currentQuestion = null
      for (const msg of allMessages) {
        if (msg.type === "peer") {
          // This is a question
          currentQuestion = {
            id: msg.bboxid || msg.id || "q_" + Date.now(),
            text: msg.content || "",
            tools: msg.tools || [],
            timestamp: msg.timestamp || null,
            bbid: msg.bboxid || null,
            context: msg.context || null
          }
        } else if (msg.type === "agent" && currentQuestion) {
          // This is a reply to the current question
          let normR = null
          const isBBox = msg.messageType === "bentobox" || (msg.content && typeof msg.content === "object" && msg.content.type === "bentobox")

          if (isBBox) {
            normR = {
              type: "bentobox",
              data: msg.content,
              bbid: msg.bboxid,
              timestamp: msg.timestamp || null,
              status: "complete",
              context: msg.context || null
            }

          } else {
            normR = {
              type: 'text',
              text: msg.content || '',
              bbid: msg.bboxid,
              timestamp: msg.timestamp || null,
              status: 'complete',
              context: msg.context || null
            }
          }

          const key = currentQuestion.bbid || currentQuestion.id || "" + currentQuestion.timestamp
          pairMap.set(key, { question: currentQuestion, reply: normR })

          if (normR && normR.bbid && !bbidPerChat.includes(normR.bbid)) {
            bbidPerChat.push(normR.bbid)
          }

          currentQuestion = null // Reset for next pair
        }
      }

      const normalizedPairs = Array.from(pairMap.values())

      // Match any visualization data for replies we have bbids for
      const visDataperChat = []
      for (const bbid of bbidPerChat) {
        const visD = this.storeAI.storeBentobox?.bentoboxData?.[bbid]
        visDataperChat.push(visD ?? null)
      }

      // Summary info (optional)
      const hopQuery = []
      const hopSummary = this.storeAI.hopSummary || []
      for (const bb of bbidPerChat) {
        for (const hp of hopSummary) {
          if (bb === hp.summary.bbid) hopQuery.push(hp.summary.bbid)
        }
      }

      const saveData = {
        version: 1,
        pair: normalizedPairs,
        chat: message.data,
        visData: visDataperChat,
        hop: hopQuery,
        lifestrapTexture: this.storeAI.storeLoom?.lifestrapTexture || null
      }
      message.data = saveData
      this.storeAI.sendMessageHOP(message)
    }
  }
})
