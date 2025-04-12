<template>
  <div id="cnrl-view"> REFERENCE VIEWER
    <div v-for="cd in referenceData" :key="cd.value.refcontract">
      <question-view v-if="viewType === 'question-view'">
        <template v-slot:header>
          <div id="refcontract-summary">
            <div class="refname">
              <div class="refinfo-col1">Ref. contract name: {{ cd.value.refcontract }}</div>
              <div class="refinfo-col1">key: {{ cd.key }}</div>
            </div>
          </div>
        </template>
        <template v-slot:body>
          <div v-if="cd.value.concept.name" class="refinfo-col2">
            {{ cd.value.concept.name }}
          </div>
        </template>
      </question-view> 
      <datatype-view v-if="viewType === 'datatype-view'"> 
        <template v-slot:header>
          <div id="refcontract-summary">
            <div class="refname">
              <div class="refinfo-col1">Ref. contract name: </div>
              <div v-if="cd.value.concept.name" class="refinfo-col2">
                {{ cd.value.concept.name }}
              </div>
              <div v-else class="refinfo-col2">
                {{ cd.value.computational.name }}
              </div>
            </div>
            <div class="refname">
              <div class="refinfo-col1">Version & Date:</div>
              <div class="refinfo-col2">1.0 **/**/****</div>
            </div>
          </div>
          <div class="refcontract-summary">
            <div> {{ cd.key }} </div>
          </div>
        </template>
        <template v-slot:body>
          <div id="datatype-slot">
            <header>Details</header>
            <div class="ref-description">
              <div class="refinfo-col1">
                summary description:
              </div>
              <div class="refinfo-col2">
                {{ cd.value.concept.description }}
              </div>
            </div>
            <div class="ref-description">
              <div class="refinfo-col1">
                Wikipedia:
              </div>
              <div class="refinfo-col2" @click="openWikipedia(cd.value.concept.wiki)">
                <a  href="#"> {{ cd.value.concept.name }}</a>
              </div>
            </div>
            <div class="ref-description">
              <div class="refinfo-col1">
                RDF:
              </div>
              <div class="refinfo-col2" @click="openRDF(cd.value.concept.rdf)">
                <a href="#">rdf file</a>
              </div>
            </div>
            <div class="ref-description">
              <div class="refinfo-col1">
                Type:
              </div>
              <div class="refinfo-col2">
                {{ cd.value.concept.measurement }}
              </div>
            </div>
          </div>
        </template>
      </datatype-view>
      <packaging-view v-if="viewType === 'packaging-view'">
        <template v-slot:header>
          <div id="refcontract-summary">
            <div class="refname">
              <div class="refinfo-col1">Ref. contract name:</div>
              <div v-if="cd.value.concept.name" class="refinfo-col2">
                {{ cd.value.concept.name }}
              </div>
              <div v-else class="refinfo-col2">
                {{ cd.value.computational.name }}
              </div>
            </div>
            <div class="refname">
              <div class="refinfo-col1">Version & Date:</div>
              <div class="refinfo-col2">1.0 **/**/****</div>
            </div>
          </div>
          <div class="refcontract-summary">
            <div> {{ cd.key }} </div>
          </div>
        </template>
        <template v-slot:body>
          <div id="packaging-slot">
            <header>Details</header>
            <ul v-for="(pi, index) in cd.value.concept" :key="pi.refcontract">
              <li>
                <div class="packaging-basics" v-if="index === 'description'" >
                  {{ index }} -- {{ pi }}
                </div>
                <div class="packaging-basics" v-if="index === 'primary'" >
                  {{ index }} -- {{ pi }}
                </div>
                <div class="packaging-basics" v-if="index === 'api'" >
                  {{ index }} -- {{ pi }}
                </div>
                <div class="packaging-basics" v-if="index === 'filename'" >
                  {{ index }} -- {{ pi }}
                </div>
                <div class="packaging-basics" v-if="index === 'path'" >
                  {{ index }} -- {{ pi }}
                </div>
                <div class="packaging-basics" v-if="index === 'tableQuery'" >
                  {{ index }} -- {{ pi }}
                </div>
                <div class="packaging-basics" v-if="index === 'sourcedevicecol'" >
                  {{ index }} -- {{ pi }}
                </div>
                <div class="packaging-basics" v-if="index === 'apibase'" >
                  {{ index }} -- {{ pi }}
                </div>
                <div class="packaging-basics" v-if="index === 'apipath'" >
                  {{ index }} -- {{ pi }}
                </div>
                <div id="table-structure">
                  <ul>
                    <li class="packaging-lists">
                      <ul v-if="index === 'tablestructure'" >
                        <header>Datatype Mapping</header>
                        <li>
                          <div class="dt-map-key">
                            Datatype key
                          </div>
                          <div class="dt-map-column">
                            column name
                          </div>
                        </li>
                        <li v-for="ipv in pi" :key="ipv.key" >
                          <div class="dt-map-key">
                            {{ ipv.refcontract }}
                          </div>
                          <div class="dt-map-column">
                            {{ ipv.column }}
                          </div>
                        </li>
                      </ul>
                    </li>
                    <li>
                      <ul v-if="index === 'category'" >
                        <header>Category mapping</header>
                        <li v-for="ipv in pi" :key="ipv.key" >
                            {{ ipv.category }} -- {{ ipv.column }} -- {{ ipv.rule }}
                        </li>
                      </ul>
                    </li>
                    <li>
                      <ul v-if="index === 'tidy'" >
                        <header>Tidy rules:</header>
                        <li v-for="ipv in pi" :key="ipv.key" >
                            {{ ipv.tidy }} -- {{ ipv.datatype }} -- {{ ipv.tidycode }}
                        </li>
                      </ul>
                    </li>
                  </ul>
                </div>
              </li>
            </ul>
            <div id="device-info">
              <div class="device-query">Device query: {{ cd.value.concept.devicequery }}</div>
              <div class="device-query">Device col. ID: {{ cd.value.concept.deviceColumnID }}</div>
              <div class="device-query">Firmware history: {{ cd.value.concept.firmwarequery }}</div>
            <div>Device {{ cd.value.concept.device }}</div>
            </div>
            <div id="packaging-network">
              <header>Active use on network</header>
              <p>Networks: 3 Experiments 2 Archives</p>
            </div>
          </div>
        </template>
      </packaging-view>
      <compute-view v-if="viewType === 'compute-view'">
        <template v-slot:header>
          <div id="refcontract-summary">
            <div class="refname">
              <div class="refinfo-col1">Ref. contract name:</div>
              <div v-if="cd.value.concept.name" class="refinfo-col2">
                {{ cd.value.concept.name }}
              </div>
              <div v-else class="refinfo-col2">
                {{ cd.value.computational.name }}
              </div>
            </div>
            <div class="refname">
              <div class="refinfo-col1">Version & Date:</div>
              <div class="refinfo-col2">1.0 **/**/****</div>
            </div>
          </div>
          <div class="refcontract-summary">
            <div> {{ cd.key }} </div>
          </div>
        </template>
        <template v-slot:body>
          <div id="compute-slot">
              <header>Details</header>
              <div v-for="(pi, index) in cd.value.computational" :key="pi.refcontract">
                  {{ index }} --- {{ pi }}
            </div>
          </div>
        </template>
      </compute-view>
      <visualise-view v-if="viewType === 'visualise-view'">
        <template v-slot:header>
          <div id="refcontract-summary">
            <div class="refname">
              <div class="refinfo-col1">Ref. contract name:</div>
              <div v-if="cd.value.concept.name" class="refinfo-col2">
                {{ cd.value.concept.name }}
              </div>
              <div v-else class="refinfo-col2">
                {{ cd.value.computational.name }}
              </div>
            </div>
            <div class="refname">
              <div class="refinfo-col1">Version & Date:</div>
              <div class="refinfo-col2">1.0 **/**/****</div>
            </div>
          </div>
          <div class="refcontract-summary">
            <div> {{ cd.key }} </div>
          </div>
        </template>
        <template v-slot:body>
          <div id="visualise-slot">
            <header>Details</header>
            <ul v-for="(pi, index) in cd.value.computational" :key="pi.refcontract">
              <li>
                <div class="vis-type">
                  {{ index }}
                </div>
                <div class="vis-info">
                  {{ pi }}
                </div>
              </li>
            </ul>
          </div>
        </template>
      </visualise-view>
    </div>
  </div>
</template>

<script setup>
import QuestionView from '@/components/library/contracts/viewer/questionViewer.vue'
import DatatypeView from '@/components/library/contracts/viewer/datatypeViewer.vue'
import ComputeView from '@/components/library/contracts/viewer/computeViewer.vue'
import PackagingView from '@/components/library/contracts/viewer/packagingViewer.vue'
import VisualiseView from '@/components/library/contracts/viewer/visualiseViewer.vue'
// import ModuleView from './moduleViewer.vue'
// import BoardView from './boardViewer.vue'
import { libraryStore } from '@/stores/libraryStore.js'
import { ref, computed } from 'vue'

  const storeLibrary = libraryStore()

  const props = defineProps({
    refTypeLive:
      {
       type: String
     }
  })

  let viewType = ref('datatype-view')

  /*  computed  */
  const referenceData = computed(() => {
    if (props.refTypeLive === 'question') {
      viewType.value = 'question-view'
    } else if (props.refTypeLive === 'datatype') {
      viewType.value = 'datatype-view'
    } else if (props.refTypeLive === 'packaging') {
      viewType.value = 'packaging-view'
    } else if (props.refTypeLive === 'compute') {
      viewType.value = 'compute-view'
    } else if (props.refTypeLive === 'visualise') {
      viewType.value = 'visualise-view'
    }
    return storeLibrary.publicLibrary.referenceContracts[props.refTypeLive]
  })

  /* methods */
  const openWikipedia = (url) => {
    if (window.process?.versions?.electron) {
      if (window.process.type === 'renderer') {
        const { shell } = require('@electron/remote')
        shell.openExternal(url)
      } else {
        const { shell } = require('electron')
        shell.openExternal(url)
      }
    } else {
      window.open(url, '_blank', 'noopener noreferrer')
    }
  }

  const openRDF = (url) => {
    if (window.process?.versions?.electron) {
      if (window.process.type === 'renderer') {
        const { shell } = require('@electron/remote')
        shell.openExternal(url)
      } else {
        const { shell } = require('electron')
        shell.openExternal(url)
      }
    } else {
      window.open(url, '_blank', 'noopener noreferrer')
    }
  }

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
