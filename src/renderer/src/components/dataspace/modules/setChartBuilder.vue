<template>
  <div id="k-toolkit">vis viwer
    <div id="diy-tools">
      <div id="chart-type">
        <!-- <ul>
          <li>
            <div class="chart-style-tools">
              <li>
                <button @click.prevent="chartSelect()">Bar</button>
              </li>
              <li>
                <button @click.prevent="chartSelect()">Line</button>
              </li>
              <li>
                <button @click.prevent="chartSelect()">Mixed</button>
              </li>
            </div>
          <li>
            <calendar-tool :shellID="shellID" :moduleCNRL="moduleCNRL" :moduleType="moduleType" :mData="mData"></calendar-tool>
          </li>
          <li v-if="openDataLive[mData] !== undefined">
            <a href="#" id="opendata" @click.prevent="openData()">{{ openDataLive[mData].text }}</a>
          </li>
        </ul> -->
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

import { libraryStore } from '@/stores/libraryStore.js'


  const storeLibrary = libraryStore()
  
  let visLive= ref('')

</script>

<style scoped>

  @media (min-width: 1024px) {
    #k-toolkit {
      border: 0px solid red;
    }

    #diy-tools {
      border: 0px solid #E9EDF0;
      background-color: #f0ece9; /*#E9EDF0;*/
    }

    .chart-style-tools {
      border-right: 3px solid white;
    }

    ul {
      list-style-type: none;
      padding: 0;
    }

    li {
      display: inline-block;
      margin: 0 10px;
    }
  }

</style>
