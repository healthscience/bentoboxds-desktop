import { defineStore } from 'pinia'
import { useSocketStore } from '@/stores/socket.js'
import { aiInterfaceStore } from '@/stores/aiInterface.js'
import { libraryStore } from '@/stores/libraryStore.js'

export const diaryStore = defineStore('diarystore', {
  state: () => ({
    sendSocket: useSocketStore(),
    storeAI: aiInterfaceStore(),
    storeLibrary: libraryStore(),
    heliClockSet: false,
    heliSignature: {},
    orbitSignature: {},
    diarySmart: true,
    currentVector: 315.5,
    currentZenith: 0,
    tempSignature: null,
    projectionData: { yearly: 0, daily: 0 },
    heliCalculations: {},
    eventList: 
    {
      view: 'timeGridWeek',
      headerToolbar: {
          start: 'prev,next today',
          center: 'title',
          end: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek resourceTimeGridWeek,resourceTimelineWeek'
      },
      resources: [
          {id: 1, title: 'Resource A'},
          {id: 2, title: 'Resource B'}
      ],
      scrollTime: '09:00:00',
      events: [],
      views: {
          timeGridWeek: {pointer: true},
          resourceTimeGridWeek: {pointer: true},
          resourceTimelineWeek: {
              pointer: true,
              slotMinTime: '09:00',
              slotMaxTime: '21:00',
              slotWidth: 80,
              resources: [
                  {id: 1, title: 'Resource A'},
                  {id: 2, title: 'Resource B'},
                  {id: 3, title: 'Resource C'},
                  {id: 4, title: 'Resource D'},
                  {id: 5, title: 'Resource E'},
                  {id: 6, title: 'Resource F'},
                  {id: 7, title: 'Resource G'},
                  {id: 8, title: 'Resource H'},
                  {id: 9, title: 'Resource I'},
                  {id: 10, title: 'Resource J'},
                  {id: 11, title: 'Resource K'},
                  {id: 12, title: 'Resource L'},
                  {id: 13, title: 'Resource M'},
                  {id: 14, title: 'Resource N'},
                  {id: 15, title: 'Resource O'}
              ]
          }
      },
      dayMaxEvents: true,
      nowIndicator: true,
      selectable: true,
    },
    currentLayer: 'osm',
    earthLayers: ['osm', 'satellite', 'terrain'],
    zoomDepth: 0,
    currentLocation: null,
    birthLocation: null,
    calibrationPreviewDate: null,
    calibrationZenith: 0,
    calibrationOrbit: 0,
    currentLocationError: false,
    birthLocationError: false,
    locationOptions: [],
    locationContext: null,
  }),
  actions: {
    selectLocation (location) {
      if (this.locationContext === 'current') {
        this.currentLocation = location
        this.currentLocationError = false
      } else {
        this.birthLocation = location
        this.birthLocationError = false
      }
      this.locationOptions = []
      this.locationContext = null
    },
    setTempSignature (sig) {
      this.tempSignature = sig
    },
    setProjectionData (data) {
      this.projectionData = data
    },
    updateClock (vector, zenith) {
      this.currentVector = vector
      this.currentZenith = zenith
    },
      createEvents () {
      let days = [];
      for (let i = 0; i < 7; ++i) {
          let day = new Date();
          let diff = i - day.getDay();
          day.setDate(day.getDate() + diff);
          days[i] = day.getFullYear() + "-" + this.pad(day.getMonth()+1) + "-" + this.pad(day.getDate());
      }
      let events = [
          {start: days[0] + " 00:00", end: days[0] + " 09:00", resourceId: 1, display: "background"}
        ]
        this.eventList.events = events
    },

    pad (num) {
      let norm = Math.floor(Math.abs(num));
      return (norm < 10 ? '0' : '') + norm;
    },
    processHeliReply (received) {
      if (received.action === 'heliclock-location-default' || received.action === 'heliclock-location-birth') {
        const isCurrent = received.data?.[0]?.context === 'current' || received.context === 'current'
        const context = isCurrent ? 'current' : 'birth'

        if (received.data && received.data.length > 1) {
          this.locationOptions = received.data
          this.locationContext = context
          return
        }

        if (received.data && received.data.length === 1) {
          if (isCurrent) {
            this.currentLocation = received.data[0]
            this.currentLocationError = false
          } else {
            this.birthLocation = received.data[0]
            this.birthLocationError = false
          }
          this.locationOptions = []
        } else {
          // Check context from the request/reply to know which error to set
          if (isCurrent) {
            this.currentLocation = null
            this.currentLocationError = true
          } else {
            this.birthLocation = null
            this.birthLocationError = true
          }
          this.locationOptions = []
        }
      } else if (received.action === 'heliclock-convert-oldworld') {
        let oldDataRaw = received.data.timestamp
        const dateOldW = new Date(Number(oldDataRaw));
        this.calibrationPreviewDate = dateOldW
        this.calibrationZenith = received.data.zenith
        this.calibrationOrbit = received.data.orbital
      } else if (received.action === 'next-tick') {
        // this.updateClock(received.vector, received.zenith)
      } else if (received.action === 'heli-birth-signature') {
        this.orbitSignature = received.data
        this.heliClockSet = true
      } else if (received.action === 'heli-orbit-signature') {
        this.heliSignature = received.data
      } else if (received.action === 'peer-heli-signature') {
        // start heli clock info
        this.heliProjections = received.data.productions
        // set heli as active
        this.heliClockSet = true
      } else if (received.action === 'peer-heli-wedge') {
        this.heliSignature = received.data
        this.heliClockSet = true
      }
    },
    processReply (received) {
      if (received.action === 'diary-agent') {
      }
    },
    sendMessageHOP (message) {
      console.log('sendMessageHOP hiliidid', message)
      this.sendSocket.send_message(message)
    }
  }
})