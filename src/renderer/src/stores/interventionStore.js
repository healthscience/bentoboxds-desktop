import { defineStore } from 'pinia'
import { useSocketStore } from '@/stores/socket.js'
import { cuesStore } from '@/stores/cuesStore.js'

export const interventionStore = defineStore('intervention', {
  state: () => ({
    sendSocket: useSocketStore(),
    storeCues: cuesStore(),
    interventions: {
      prevention: [
        {
          id: 'prev-1',
          name: 'Fasting Mimicking Diet',
          description: '5-day low calorie, plant-based diet that mimics fasting',
          frequency: 'Monthly',
          duration: '5 days',
          cueIds: [],
          notes: 'ProLon or DIY version',
          active: true
        },
        {
          id: 'prev-2',
          name: 'Intermittent Fasting',
          description: '16:8 or 18:6 daily fasting window',
          frequency: 'Daily',
          duration: 'Ongoing',
          cueIds: [],
          notes: 'Skip breakfast, eat within 8-hour window',
          active: true
        }
      ],
      repair: [
        {
          id: 'repair-1',
          name: 'High Frequency Joint Treatment',
          description: 'Pulsed electromagnetic field therapy for joint repair',
          frequency: '3x per week',
          duration: '20 minutes',
          cueIds: [],
          notes: 'PEMF device settings: 10-50Hz',
          active: true
        },
        {
          id: 'repair-2',
          name: 'Red Light Therapy',
          description: 'Near-infrared light for tissue repair',
          frequency: 'Daily',
          duration: '10-15 minutes',
          cueIds: [],
          notes: '660nm and 850nm wavelengths',
          active: false
        }
      ],
      rejuvenation: [
        {
          id: 'rejuv-1',
          name: 'Exosome Therapy',
          description: 'Stem cell-derived exosomes for cellular rejuvenation',
          frequency: 'Quarterly',
          duration: 'Single treatment',
          cueIds: [],
          notes: 'IV or targeted injection',
          active: false
        },
        {
          id: 'rejuv-2',
          name: 'NAD+ Therapy',
          description: 'NAD+ IV infusion or precursor supplementation',
          frequency: 'Monthly',
          duration: '2-4 hours (IV)',
          cueIds: [],
          notes: 'Alternative: NMN/NR supplements daily',
          active: true
        }
      ]
    },
    selectedIntervention: null,
    showInterventionPanel: false,
    selectedCategory: 'prevention',
    editMode: false,
    showCueLinkModal: false
  }),
  
  getters: {
    getInterventionsByCategory: (state) => (category) => {
      return state.interventions[category] || []
    },
    
    getActiveInterventions: (state) => {
      const active = []
      Object.values(state.interventions).forEach(category => {
        active.push(...category.filter(i => i.active))
      })
      return active
    },
    
    getLinkedCues: (state) => (interventionId) => {
      // Get cue details for linked cue IDs
      const intervention = state.findInterventionById(interventionId)
      if (!intervention || !intervention.cueIds.length) return []
      
      return intervention.cueIds.map(cueId => {
        return state.storeCues.cuesList.find(cue => cue.id === cueId)
      }).filter(Boolean)
    }
  },
  
  actions: {
    findInterventionById(id) {
      for (const category of Object.values(this.interventions)) {
        const found = category.find(i => i.id === id)
        if (found) return found
      }
      return null
    },
    
    createIntervention(category, intervention) {
      const newIntervention = {
        id: `${category}-${Date.now()}`,
        name: intervention.name,
        description: intervention.description || '',
        frequency: intervention.frequency || '',
        duration: intervention.duration || '',
        cueIds: intervention.cueIds || [],
        notes: intervention.notes || '',
        active: intervention.active !== undefined ? intervention.active : true
      }
      
      this.interventions[category].push(newIntervention)
      this.saveToHOP('create', newIntervention)
      return newIntervention
    },
    
    updateIntervention(id, updates) {
      const intervention = this.findInterventionById(id)
      if (intervention) {
        Object.assign(intervention, updates)
        this.saveToHOP('update', intervention)
      }
    },
    
    deleteIntervention(id) {
      for (const [category, items] of Object.entries(this.interventions)) {
        const index = items.findIndex(i => i.id === id)
        if (index !== -1) {
          const deleted = items.splice(index, 1)[0]
          this.saveToHOP('delete', deleted)
          return true
        }
      }
      return false
    },
    
    toggleInterventionActive(id) {
      const intervention = this.findInterventionById(id)
      if (intervention) {
        intervention.active = !intervention.active
        this.saveToHOP('update', intervention)
      }
    },
    
    linkCueToIntervention(interventionId, cueId) {
      const intervention = this.findInterventionById(interventionId)
      if (intervention && !intervention.cueIds.includes(cueId)) {
        intervention.cueIds.push(cueId)
        this.saveToHOP('update', intervention)
      }
    },
    
    unlinkCueFromIntervention(interventionId, cueId) {
      const intervention = this.findInterventionById(interventionId)
      if (intervention) {
        intervention.cueIds = intervention.cueIds.filter(id => id !== cueId)
        this.saveToHOP('update', intervention)
      }
    },
    
    saveToHOP(action, intervention) {
      // Prepare message for HOP
      const hopContract = {
        type: 'library',
        action: 'intervention',
        reftype: 'intervention-' + action,
        task: action === 'delete' ? 'DELETE' : 'PUT',
        privacy: 'private',
        data: intervention
      }
      
      console.log('Saving intervention to HOP:', hopContract)
      // this.sendSocket.send_message(hopContract)
    },
    
    showPanel(category = null) {
      this.showInterventionPanel = true
      if (category) {
        this.selectedCategory = category
      }
    },
    
    closePanel() {
      this.showInterventionPanel = false
      this.editMode = false
      this.selectedIntervention = null
    }
  }
})