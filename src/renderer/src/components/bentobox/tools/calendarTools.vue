<template>
  <div id="time-control">
    <div id="calendar-live">
      <div v-if="selectedTimeBundle === 'single'">
        <a class="date-live-select" ref="#" @click.prevent="viewCalendarSeettings()">{{ boxDate }} v</a>
      </div>
      <div v-if="selectedTimeBundle === 'range'">
        <a class="date-live-select" ref="#" @click.prevent="viewCalendarSeettings()">{{ boxDaterange }} v</a>
      </div>
      <div v-if="selectedTimeBundle === 'multi'">
        <a ref="#" class="date-live-select" @click.prevent="viewCalendarSeettings()">{{ boxDaterange }} v</a>
      </div>
    </div>
    <div id="date-set" v-if="setDateStatus">
      <div id="time-control-update">
        <div id="time-options" class="series-style">
          <div id="calendar-range-select">
            <div id="time-calendar-tools">
              <div class="time-tools" id="select-range-type">
                <select class="time-tools-select" v-model="selectedTimeBundle" @change="setTimeBundle()">
                  <option v-for="tb in optionTimeBundle" :value="tb.value" :selected="tb.value === selectedTimeBundle">
                    {{ tb.text }}
                  </option>
                </select> 
              </div>
              <div class="time-tools">
                <button id="multi-day-clear" @click.prevent="clearMultidays()">Clear</button>
              </div>
            </div>
          </div>
          <div id="calendar-selector">
            <div id="date-selector-status"  v-bind:class="{ active: calActive }">
              <div id="range-datepicker" v-if="selectedTimeBundle === 'range'" >
                <VueDatePicker class="calendar-view" v-model="boxDaterange" :range="{}">
                </VueDatePicker>
              </div>
              <div id="single-datepicker" v-else-if="selectedTimeBundle === 'single'">
                <VueDatePicker class="calendar-view" v-model="boxDate"  @update:model-value="handleDate">
                </VueDatePicker>
              </div>
              <div id="multi-datepicker" v-else-if="selectedTimeBundle === 'multi'">
                <VueDatePicker class="calendar-view" v-model="boxDaterange" multi-dates>
                </VueDatePicker>
              </div>
            </div>
          </div>
          <div id="selected-dates-list" v-if="boxDaterange !== 'date' && boxDaterange?.length > 1">
            <div class="dates-selected" v-for="sdate of boxDaterange">
              {{ sdate }}
            </div>
          </div>
          <div id="calendar-list-view" >
            <div class="time-m-list" v-for="datesl in calendarList" :key='datesl.id' >
              {{ datesl }}
            </div>
          </div>
          <div id="update-manual">
            <button id="update-chart" @click.prevent="updateHOPquery($event)">Update</button>
          </div>
        </div>
      </div>
      <div id="date-quick-set">
        <header>Quick set</header>
        <div v-for="tv in navTime" :key='tv.id' class="context-time">
          <button class="button-time-quick" @click.prevent="setShiftTimeData(tv)">{{ tv.text.word }}</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { DateTime, Interval } from 'luxon'
import { ref, onMounted, onBeforeMount, shallowRef } from 'vue'
import { aiInterfaceStore } from '@/stores/aiInterface.js'
import { libraryStore } from '@/stores/libraryStore.js'

  const storeAI = aiInterfaceStore()
  const storeLibrary = libraryStore()

  const props = defineProps({
    bboxid: String
  })

  let setDateStatus = ref(false)
  let boxDate = ref()
  let mutDate = ref()
  let boxDaterange = ref([])
  const calendarList = ref([])
  let calActive = ref(false)
  const selectedTimeBundle = ref('single')
  const optionTimeBundle = ref([
    { text: 'Single day', value: 'single', id: 0 },
    { text: 'Pick days', value: 'multi', id: 1 },
    { text: 'Range days', value: 'range', id: 2 }
  ])
  const navTime = ref([{ 'text': { 'word': '-day', 'number': -86400000 } }, { 'text': { 'word': '+day', 'number': 86400000 }}, { 'text': { 'word': '+week', 'number': 86400000 }}, { 'text': { 'word': '-week', 'number': 86400000 }}, { 'text': { 'word': '+year', 'number': 86400000 }}, { 'text': { 'word': '-year', 'number': 86400000 }}])
  const selectedTimeFormat = ref('timeseries')

  /* mounted */
  onBeforeMount(() => {
    const now = DateTime.now()
    boxDate.value = now
  })

  /* methods */
  const clearMultidays = (md) => {
  boxDaterange.value = []
    // calendarListMS.value = []
    // makeTimeBundles.value = []
  }

  const alertFn = () => {
    calActive.value = !calActive.value
  }

  const setTimeBundle = () => {
    // set calendar type
    if (selectedTimeBundle.value === 'single') {
      selectedTimeBundle.value = 'single'
    } else if (selectedTimeBundle.value === 'range') {
      selectedTimeBundle.value = 'range'
    } else if (selectedTimeBundle.value === 'multi') {
      selectedTimeBundle.value = 'multi'
    }
  }

const handleDate = () => {
  let dateChange = boxDate.value
  // now change date
  mutDate.value = DateTime.fromJSDate(dateChange).toMillis()
}

  const updateHOPquery = () => {
    // prepare update for HOP
    // what time period is active, single, pick or range? Or update via open data settings?
    let hopTime = []
    if (selectedTimeBundle.value === 'single') {
      // make luxton time object
      let luxTime = DateTime.now(mutDate.value)
      // boxDate.value = luxTime
      hopTime.push(luxTime.toMillis())
    } else if (selectedTimeBundle.value === 'range') {
      // need to expand our range
      let i = Interval.fromDateTimes(boxDaterange.value[0], boxDaterange.value[1]).splitBy({ day: 1 })
      // let arryDates = i.map(d => d.start)
      for (let date of i) {
        let luxTime = DateTime.local(date)
        hopTime.push(luxTime.toMillis())
      }
    } else if (selectedTimeBundle.value === 'multi') {
      for (let date of boxDaterange.value) {
        let luxTime = DateTime.local(date)
        hopTime.push(luxTime.toMillis())
      }
    }
    
    // get the library contracts
    storeAI.prepareLibrarySummary(props.bboxid)
    // no summary if already save  NEED other way to set contect
    // what updates are there moduels?  Device/source, compute, vis controls or settings?
    let moduleUpdate = {}
    let computeChanges = {}
    // controls
    if (selectedTimeBundle.value === 'single') {
      computeChanges.controls = { date: mutDate.value, rangedate: [mutDate.value]}
    } else if (selectedTimeBundle.value === 'range') {
      let timeMills = []
      for (let tm of boxDaterange.value) {
        let tmm = DateTime.fromJSDate(tm).toMillis()
        timeMills.push(tmm)
      }
      computeChanges.controls = { date: mutDate.value, rangedate: timeMills }
    } else if (selectedTimeBundle.value === 'multi') {
      let timeMills = []
      for (let tm of boxDaterange.value) {
        let tmm = DateTime.fromJSDate(tm).toMillis()
        timeMills.push(tmm)
      }
      computeChanges.controls = { date: mutDate.value, rangedate: timeMills }
    }
    // any settings changes?
    moduleUpdate.compute = computeChanges
    let entityID = Object.keys(storeAI.boxLibSummary[props.bboxid].data)
    let HOPcontext = {}
    HOPcontext.entityUUID = storeAI.boxLibSummary[props.bboxid].data[entityID[0]].shellID
    HOPcontext.bbid = props.bboxid
    // HOPcontext.modules = storeAI.boxLibSummary[props.bboxid].data[entityID[0]].modules
    HOPcontext.exp = { key: entityID[0], update: storeAI.boxLibSummary[props.bboxid].data }
    HOPcontext.update = {}
    let updateECS = {}
    updateECS.entityUUID = storeAI.boxLibSummary[props.bboxid].data[entityID[0]].shellID
    updateECS.input = 'refUpdate'
    updateECS.modules = storeAI.boxLibSummary[props.bboxid].data[entityID[0]].modules
    updateECS.changes = moduleUpdate
    HOPcontext.update = updateECS
    // close the calendar options and dispay date summary selected
    // console.log('update time')
    // console.log(moduleUpdate.compute)
    // console.log(HOPcontext)
    storeLibrary.updateHOPqueryContracts(HOPcontext)
    setDateStatus.value = false
  }

  const setShiftTimeData = (seg) => {
    if (seg.text.word === '+day') {
      let dateNew = DateTime.fromJSDate(boxDate.value)
      let updateDate = dateNew.plus({ days: 1 })
      boxDate.value = updateDate.toJSDate()
    } else if (seg.text.word === '-day') {
      let updateDate = DateTime.fromJSDate(boxDate.value).minus({ days: 1 })
      boxDate.value = updateDate.toJSDate()
    } else if (seg.text.word === '+week') {
        let updateDate = DateTime.fromJSDate(boxDate.value).minus({ weeks: 1 })
        boxDate.value = updateDate.toJSDate()
    } else if (seg.text.word === '-week') {
        let updateDate = DateTime.fromJSDate(boxDate.value).minus({ weeks: 1 })
        boxDate.value = updateDate.toJSDate()
    } else if (seg.text.word === '+year') {
        let updateDate = DateTime.fromJSDate(boxDate.value).minus({ year: 1 })
        boxDate.value = updateDate.toJSDate()
    } else if (seg.text.word === '-year') {
        let updateDate = DateTime.fromJSDate(boxDate.value).minus({ year: 1 })
        boxDate.value = updateDate.toJSDate()
    }
    mutDate.value = DateTime.fromJSDate(boxDate.value).toMillis()
    // auto update on click
    updateHOPquery()
  }

  const viewCalendarSeettings = () => {
    setDateStatus.value = !setDateStatus.value
  }

</script>

<style scoped>
.dp__main :deep(.dp__theme_light) {
  --dp-highlight-color: rgba(34, 233, 8, 0.993);
  --dp-primary-color: #c4cde3;
  --dp-primary-text-color: #000078;

  .dp__overlay_container {
    background-color: red;
    font-size: 2em;
  }
}

@media (min-width: 1024px) {

  #date-set {
    display: grid;
    grid-template-columns: 3fr 1fr;
    border-top: 2px solid blue;
    margin-top: 1em;
  }

  #time-control-update {
    display: grid;
    grid-template-columns: 4fr 1fr;
    border: 0px solid black;
    margin-top: 1em;
  }

  .date-live-select {
    display: grid;
    grid-template-columns: 1fr;
    color: darkblue;
    font-size: 1.2em;
    padding-left: 1em;
    padding-top: .3em;
    padding-bottom: .3em;
    margin-top: 0.3em;
  }

  #date-quick-set {
    display: grid;
    grid-template-columns: 1fr;
    border: 0px solid black;
    margin-top: 1em;
  }

  #calendar-selector {
    display: grid;
    grid-template-columns: 1fr;
  }

  .select-caldate {
    min-width: 340px;
  }

  #select-range-type {
    margin-top: .2em;
    margin-left: .5em;
    margin-right: .5em;
    margin-bottom: 0.5em;
  }

  .context-time {
    display: inline-block;
    margin: 0em;
  }

  #view-time {
    margin-top: 10px;
    font-size: 1.4em;
  }

  .time-tools {
    border: 0px solid green;
  }

  .time-tools-select {
    font-size: 1.2em;
    width: 100%;
  }

  #date-selector-status {
    display: grid;
    grid-template-columns: 1fr;
  }

  .active {
    border: 1px solid lightblue;
    /* top: -150px; */
  }

  #selected-dates-list {
    position: relative;
    margin-top: 1em;
    margin-left: 1em;
    max-width: 280px;
    display: grid;
    min-height: 100px;
    background-color: whitesmoke;
    overflow-y: scroll;
    z-index: 14;
  }

  #range-datepicker {
    border: 0px solid red;
  }

  .dates-selected {
    background-color: antiquewhite;
  }


  #time-calendar-tools {
    display: grid;
    grid-template-columns: 1fr 1fr;
  }

  #update-chart {
    font-size: 1em;
    background-color: #4CAF50; /* Green */
    border: none;
    color: white;
    padding: 8px 18px;
    text-align: center;
    margin: 2em;
    width: 70%;
  }

  #calendar-list-view {
    display: inline;
  }

  .button-time-quick {
    margin: .4em;
    width: 80%;
  }
}
</style>
