<template>
  <div id="device-nxp">
    <header>Device Data Source:</header>
    <!--<div id="network-library">
       All device, sensors, data stores need to be described in the <a href="" id="network-library-damahub" @click.prevent="networLibrary()">Network Library</a>
    </div>--->
    <!--<networklibrary-modal v-show="isModalNLib" @closenl="closeModalNLib">
      <template v-slot:header>
        Network Library
      </template>
      <template v-slot:body>
      </template>
    </networklibrary-modal>-->
    <!--<div id="prime-device">
      <form id="device_form" name="device_form" method="post" action="#">
        <ul v-for="ds of datasource" :key="ds.id">
          <device-source :modData="modData" :datID="ds"></device-source>
        </ul>
        <button id="add-source-button" type="button" class="btn" @click="addDatasource()">add data source</button>
      </form>
    </div>-->
  </div>
</template>

<script>
// import DeviceSource from '@/components/dataspace/modules/nxpDeviceAdd.vue'

/*
  methods: {
    addDatasource () {
      // update vuex of data source latest
      this.$store.dispatch('actionDatasourceCount', this.countD)
      this.countD++
      this.datasource.push(this.countD)
    },
    networLibrary () {
      // open modal
      this.isModalNLib = true
    },
    closeModalNLib () {
      this.isModalNLib = false
      // refresh the networklibrary contract to access new contracts
      this.$store.dispatch('actionRrefreshRefContracts')
    }
  }
}
*/
</script>

<style scoped>

@media (min-width: 1024px) {

  #network-library {
    margin: 2em;
  }

  .ref-pair {
    display: block;
  }

  #add-source-button {
    margin-top: 2em;
  }
}
</style>
