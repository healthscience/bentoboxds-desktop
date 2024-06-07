<template>
  <div class="data-options"  v-for="(dopt, index) in storeLibrary.newDatafile.columns">
    <div v-if="typeof dopt === 'string'">
    <button class="data-option-select" @click.prevent="dataOptionVis(index, dopt, chati.reply.bbid)">
        {{ dopt }}
    </button>
    </div>
    <div v-else>
        <button class="data-option-select" @click.prevent="dataOptionVis(index, dopt, chati.reply.bbid)">
        {{ dopt.name }}
        </button>
    </div>
    <button class="data-option-select" :class="{ active: index === isDateColumn }" @click.prevent="dateOptionSelect(index, dopt, chati.reply.bbid)">date</button>
  </div>
</template>

<script setup>

</script>

<style scoped>

</style>