<template>
  <div id="cnrl-view"> Experiment & Module VIEWER
    <div v-for="cd in publicmoduleData" :key="cd.value.title">
      <experiment-view v-if="viewType === 'experiment-view'">
        <template v-slot:header>
          <div v-if="cd.value.info?.moduleinfo">
          Experiment info:
          <div class="key-hash"> {{ cd.key }} </div>
          <div class="value-info"> {{ cd.value.info.moduleinfo.name }} </div>
          <div class="value-info">{{ cd.value.info }}</div>
        </div>
        <div v-else>
          Experiment info:
          <div class="key-hash"> {{ cd.key }} </div>
          <div class="key-hash">type: {{ cd.value.type }} link-- {{ cd.value.link }}</div>
          <div class="value-info"> {{ cd.value.info }} </div>
        </div>
        </template>
        <template v-slot:body>
          <div id="experiment-slot">experiment
            <div v-for="(pi, index) in cd.value.modules" :key="pi.refcontract">
                {{ index }} --- {{ pi }}
            </div>
          </div>
        </template>
      </experiment-view>
      <module-view v-if="viewType === 'module-view'">
        <template v-slot:header>
          <div v-if="cd.value.info?.moduleinfo">
          Module info:
          <div class="key-hash"> {{ cd.key }} </div>
          <div class="value-info"> {{ cd.value.info.moduleinfo.name }} </div>
          <div class="value-info">{{ cd.value.info }}</div>
        </div>
        <div v-else>
          Module info:
          <div class="key-hash"> {{ cd.key }} </div>
          <div class="key-hash">type: {{ cd.value.type }} link-- {{ cd.value.link }}</div>
          <div class="value-info"> {{ cd.value.info }} </div>
        </div>
        </template>
        <template v-slot:body>
          <div id="module-slot">
            <div v-for="(pi, index) in cd.value.info.option" :key="pi.id">
              {{ index }} --- {{ pi }}
            </div>
          </div>
        </template>
      </module-view>
    </div>
    <div v-for="cd in peermoduleData" :key="cd.value.title">
      <experiment-view v-if="viewType === 'experiment-view'">
        <template v-slot:header>
          <div v-if="cd.value.info?.moduleinfo">
          Experiment info:
          <div class="key-hash"> {{ cd.key }} </div>
          <div class="value-info"> {{ cd.value.info.moduleinfo.name }} </div>
          <div class="value-info">{{ cd.value.info }}</div>
        </div>
        <div v-else>
          Experiment info:
          <div class="key-hash"> {{ cd.key }} </div>
          <div class="key-hash">type: {{ cd.value.type }} link-- {{ cd.value.link }}</div>
          <div class="value-info"> {{ cd.value.info }} </div>
        </div>
        </template>
        <template v-slot:body>
          <div id="experiment-slot">experiment
            <div v-for="(pi, index) in cd.value.modules" :key="pi.refcontract">
                {{ index }} --- {{ pi }}
            </div>
          </div>
        </template>
      </experiment-view>
      <module-view v-if="viewType === 'module-view'">
        <template v-slot:header>
          <div v-if="cd.value.info?.moduleinfo">
          Module info:
          <div class="key-hash"> {{ cd.key }} </div>
          <div class="value-info"> {{ cd.value.info.moduleinfo.name }} </div>
          <div class="value-info">{{ cd.value.info }}</div>
        </div>
        <div v-else>
          Module info:
          <div class="key-hash"> {{ cd.key }} </div>
          <div class="key-hash">type: {{ cd.value.type }} link-- {{ cd.value.link }}</div>
          <div class="value-info"> {{ cd.value.info }} </div>
        </div>
        </template>
        <template v-slot:body>
          <div id="module-slot">
            <div v-for="(pi, index) in cd.value.info.option" :key="pi.id">
              {{ index }} --- {{ pi }}
            </div>
          </div>
        </template>
      </module-view>
    </div>
  </div>
</template>

<script setup>
import ExperimentView from '@/components/library/contracts/experimentViewer.vue'
import ModuleView from '@/components/library/contracts/moduleViewer.vue'

import { libraryStore } from '@/stores/libraryStore.js'
import { ref, computed } from 'vue'

  const storeLibrary = libraryStore()

  const props = defineProps({
    refTypeLive:
      {
       type: String
     }
  })

  let viewType = ref('experiment-view')

  /*  computed  */
  const publicmoduleData = computed(() => {
    if (props.refTypeLive === 'experiment') {
      viewType.value = 'experiment-view'
    } else if (props.refTypeLive === 'module') {
      viewType.value = 'module-view'
    }
    return storeLibrary.publicLibrary[props.refTypeLive]
  })

  const peermoduleData = computed(() => {
    let moduleLive = ''
    if (props.refTypeLive === 'private-experiment') {
      viewType.value = 'experiment-view'
      moduleLive = 'experiment'
    } else if (props.refTypeLive === 'private-modules') {
      viewType.value = 'module-view'
      moduleLive = 'module'
    }
    return storeLibrary.peerLibrary[moduleLive]
  })

</script>


<style scoped>
#refcontract-summary {
  display: grid;
  grid-template-columns: 1fr;
}

.ref-wrapper {
  border: 1px solid grey;
  margin: 1em;
  list-style-type: none;
}

.refname {
  display: grid;
  grid-template-columns: 1fr 1fr;
  justify-content: center;
  margin-bottom: .5em;
}

.refinfo-col1 {
  justify-self: end;
  color: grey;
}

.refinfo-col2 {
  justify-self: start;
  margin-left: 1em;
}

.ref-description {
  display: grid;
  grid-template-columns: 1fr 1fr;
  margin-bottom: .2em;
}

.cnrl-element {
  display: inline-block;
  margin-bottom: 1em;
}

#date-format {
  font-size: 0.6em;
}

#datatype-slot {
  margin: 1em;
}

#compute-slot header {
  margin-left: 4em;
  text-align: left;
}

#compute-slot ul li {
  margin-left: 4em;
  text-align: left;
  list-style-type: none;
}

.packaging-basics {
  text-align: left;
  margin-top: 0.5em;
}

#packaging-slot ul {
  list-style-type: none;
}

#table-structure {
  margin-top: 1em;
  text-align: left;
}

.packaging-lists {
  list-style-type: none;
}

.dt-map-key {
  display: inline;
  font-weight: normal;
  width: 300px;
  margin-right: 1em;
}

.dt-map-column {
  display: inline;
  font-weight: bold;
  min-width: 6em;
}

#packaging-network {
  margin-top: 2em;
  margin-left: 2em;
  text-align: left;
}

#visualise-slot header {
  text-align: left;
  margin-left: 2em;
}

#visualise-slot ul li {
  text-align: left;
  margin-left: 2em;
  list-style-type: none;
}

.vis-type {
  display: inline;
  width: 200px;
  font-weight: bold;
}

.vis-info {
  display: inline;
}
#goverannce-slot {
  display: grid;
  grid-template-columns: 1fr 1fr;
  margin-top: 1em;
}

.key-hash {
  margin-bottom: 1em;
}
</style>
