import { defineStore } from 'pinia'
import { useSocketStore } from '@/stores/socket.js'
import { bentoboxStore } from '@/stores/bentoboxStore.js'
import { aiInterfaceStore } from '@/stores/aiInterface.js'
import TeachingUtility from '@/stores/hopUtility/teachingUtility.js'

export const teachingStore = defineStore('teaching', {
  state: () => ({
    storeBentoBox: bentoboxStore(),
    sendSocket: useSocketStore(),
    teachingUtil: new TeachingUtility(),
    isTeachingMode: false,
    currentQuery: '',
    currentSession: {
      id: null,
      query: '',
      actions: [],
      startTime: null,
      peerId: null
    },
    completedSessions: [],
    pendingSessions: [],
    teachingStats: {
      totalSessions: 0,
      totalActions: 0,
      lastSessionDate: null
    },
    teachingFeedback: '',
    saveStatus: false,
    syncStatus: false,
    teachHistoryStatus: false,
    teachHistory: []
  }),
  getters: {
    hasActiveSession: (state) => state.isTeachingMode && state.currentSession.id !== null,
    sessionActionCount: (state) => state.currentSession.actions.length,
    recentSessions: (state) => state.completedSessions.slice(-10)
  },
  actions: {
    startTeachingSession(query) {
      this.isTeachingMode = true
      this.currentQuery = query
      this.currentSession = {
        id: Date.now().toString(),
        query: query,
        actions: [],
        startTime: new Date().toISOString(),
        peerId: this.getPeerId()
      }
      console.log('Teaching session started:', this.currentSession)
    },
    logAction(component, method, args, result = null) {
      if (!this.isTeachingMode) return

      const action = {
        component,
        method,
        args,
        result,
        timestamp: Date.now(),
        order: this.currentSession.actions.length
      }

      this.currentSession.actions.push(action)
      console.log('Action logged:', action)
    },
    async completeSession() {
      if (!this.isTeachingMode || !this.currentSession.id) return

      const session = {
        ...this.currentSession,
        endTime: new Date().toISOString(),
        completed: true
      }

      // Add to completed sessions
      this.completedSessions.push(session)
      this.pendingSessions.push(session)

      // Update stats
      this.teachingStats.totalSessions++
      this.teachingStats.totalActions += session.actions.length
      this.teachingStats.lastSessionDate = session.endTime

      // Save to HOP
      try {
        this.saveToHOP(session)
        this.teachingFeedback = 'Teaching example saved successfully!'
        this.saveStatus = true
      } catch (error) {
        console.error('Error saving teaching session:', error)
        this.teachingFeedback = 'Error saving teaching example. Will retry later.'
        this.saveStatus = false
      }

      // Reset session
      this.resetSession()
    },
    saveToHOP(session) {
      // Prepare message for HOP
      const beebeeTeach = {}
      beebeeTeach.type = 'library'
      beebeeTeach.action = 'beebee-teach'
      beebeeTeach.reftype = 'teach-hopquery'
      beebeeTeach.task = 'PUT'
      beebeeTeach.privacy = 'public'
      beebeeTeach.data = session
      // Send via socket to HOP
      this.sendSocket.send_message(beebeeTeach)
    },
    cancelSession() {
      if (this.isTeachingMode) {
        this.teachingFeedback = 'Teaching session cancelled'
      }
      this.resetSession()
    },
    resetSession() {
      this.isTeachingMode = false
      this.currentQuery = ''
      this.currentSession = {
        id: null,
        query: '',
        actions: [],
        startTime: null,
        peerId: null
      }
    },
    getPeerId() {
      // Get peer ID from bentobox store or generate one
      const peerId = this.storeBentoBox.peerId || 'peer-' + Date.now()
      return peerId
    },
    async syncPendingSessions() {
      if (this.pendingSessions.length === 0) return

      this.syncStatus = true
      const sessionsToSync = [...this.pendingSessions]
      this.pendingSessions = []

      for (const session of sessionsToSync) {
        try {
          await this.saveToHOP(session)
        } catch (error) {
          console.error('Error syncing session:', error)
          this.pendingSessions.push(session)
        }
      }

      this.syncStatus = false
    },
    clearCompletedSessions() {
      this.completedSessions = []
      this.teachingStats = {
        totalSessions: 0,
        totalActions: 0,
        lastSessionDate: null
      }
    },
    loadTeachHistory() {
      const message = {
        type: 'library',
        action: 'contracts',
        reftype: 'teach-history',
        task: 'GET',
        privacy: 'private',
        data: {}
      }
      this.sendSocket.send_message(message)
    },
    deleteTeachSession(sessionId) {
      // remove from live list of teach sessions
      for (let i = 0; i < this.teachHistory.length; i++) {
        if (this.teachHistory[i].key === sessionId) {
          this.teachHistory.splice(i, 1)
          break
        }
      }

      let message = {
        type: 'library',
        action: 'beebee-teach',
        reftype: 'delete-session',
        task: 'DEL',
        privacy: 'public',
        data: { key: sessionId }
      }
      this.sendSocket.send_message(message)
    },
    processReply (message) {
      if (message.action === 'beebeelearn-contract') {
        this.teachHistory.push(message.data.data)        
      } else if (message.reftype === 'teach-history') {
        // set the save @teach ready for display if asked for
        this.teachHistory = message.data
      }
    }
  }
})