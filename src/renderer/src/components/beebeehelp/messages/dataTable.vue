<template>
  <div v-if="message?.data?.filedata" class="bee-file-data">
    <div class="file-feedback-csv">
        {{ message.data.filedata.type }} - {{ message.data.filedata.file?.name }} -- {{ message.data.filedata.columns }}
    </div>
    <button id="csv-file-summary" @click="viewSummaryCSV(message.bbid)">view summary</button>
    <csv-preview v-if="storeLibrary.imagepreviewLive !== true && storeLibrary.csvpreviewLive === summaryCSVState" :summarydata="message.data.filedata.grid"></csv-preview>
    <image-preview v-if="storeLibrary.imagepreviewLive === true && summaryCSVState === false" :summaryimagedata="message.data.filedata.grid"></image-preview>
    </div>
    <div v-if="message?.data?.prompt?.length > 0" class="bee-prompt-question">
    {{ message.data.prompt }}
    <!-- if csv file, show column to chart else sql need to select table then columns to chart-->
    <div id="type-data-options" v-if="message?.data?.filedata.type !== 'sqlite'">
      <div class="data-options"  v-for="(dopt, index) in message?.data?.options">
      <!-- csv or json format -->
      <div v-if="typeof dopt === 'string'">
        <button class="data-option-select" @click.prevent="dataOptionVis(index, dopt, message.bbid, message?.data?.options, message?.data?.filedata.size)">
        {{ dopt }}
        </button>
      </div>
      <div v-else>
        <button class="data-option-select" @click.prevent="dataOptionVis(index, dopt, message.bbid, message?.data?.options )">
            {{ dopt.name }}
        </button>
      </div>
      <button class="data-option-select" :class="{ active: index === isDateColumn }" @click.prevent="dateOptionSelect(index, dopt, message.bbid)">date</button>
      </div>
      </div>
      <div v-else> <!-- sqlite data structure -->
      <describe-datastructure :bboxid="message.bbid" :fileTypeIn="message?.data?.filedata.type"></describe-datastructure>
      <div class="data-options"  v-for="(dopt, index) in storeLibrary.newDatafile.columns">
      <div v-if="typeof dopt === 'string'">
        <button class="data-option-select" @click.prevent="dataOptionVis(index, dopt, message.bbid, message?.data?.options )">
        {{ dopt }}
        </button>
      </div>
      <div v-else>
        <button class="data-option-select" @click.prevent="dataOptionVis(index, dopt, message.bbid)">
            {{ dopt.name }}
        </button>
      </div>
      <button class="data-option-select" :class="{ active: index === isDateColumn }" @click.prevent="dateOptionSelect(index, dopt, message.bbid)">date</button>
      </div>
      <div id="further-filter">Want to further filter the data query?  Select a column</div>
      <div class="data-options"  v-for="(dopt, index) in storeLibrary.newDatafile.columns">
      <div v-if="typeof dopt === 'string'">
        <button class="data-option-select" @click.prevent="dataOptionFilter(index, dopt, message.bbid)">
        {{ dopt }}
        </button>
      </div>
      <div v-else>
        <button class="data-option-select" @click.prevent="dataOptionFilter(index, dopt, message.bbid)">
            {{ dopt.name }}
        </button>
      </div>
      </div>
      <div id="filter-options" v-if="filterActive === true">filter
      <describe-devicestructure :bboxid="message.bbid" :fileTypeIn="message?.data?.filedata.type" @device-filter="filterdeviceEvent()" @device-id="choicedeviceEvent()"></describe-devicestructure>
    </div>
  </div>
</div>

</template>

<script setup>
import CsvPreview from '@/components/dataspace/upload/csvPreview.vue'
import DescribeDatastructure from '@/components/library/contracts/contribute/forms/packaging/describeSourceStructure.vue'
import DescribeDevicestructure from '@/components/library/contracts/contribute/forms/packaging/describeDeviceStructure.vue'

</script>

<style scoped>

.file-feedback-csv {
  display: grid;
  grid-template-columns: 1fr;
}

.data-option-select {
  display: inline-block;
  padding: 0.25em;
  margin-bottom: 0.6em;
  width: 100%;
}

</style>