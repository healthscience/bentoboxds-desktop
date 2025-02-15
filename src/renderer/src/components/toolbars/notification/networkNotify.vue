<template>
  <div class="bb-align not-align not-round" v-bind:class="{ active: checkAcitve }" @click="viewNotifications">N. {{ storeAI.countNotifications }}</div>
  <div class="box" v-if="storeAI.notifList.length > 0 && notifActive === true">
    <div v-for='noti in storeAI.notifList' :key='noti.id'>
      <div class="notification-item" @click="viewItemNotify(noti)">
        {{ noti.action }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { aiInterfaceStore } from '@/stores/aiInterface.js'

  let notifActive = ref(false)

  const storeAI = aiInterfaceStore()

  const checkAcitve = computed(() => {
    let notAct = false
    if (storeAI.countNotifications > 0) {
      notAct = true
    }
    return notAct
  })

  /* methods */
  const viewNotifications = () => {
    notifActive.value = !notifActive.value
  }

  const viewItemNotify = (item) => {
    if (item.action === 'network-library-n1') {
      // create a message for beebee to display
      storeAI.preparePublicConfirm(item)
    } else if (item.action === 'cue-space') {
      storeAI.prepareCuespace(item)
    }
    storeAI.startChat = false
    // reset count of notifications
    storeAI.countNotifications = 0
    viewNotifications()
    removeNotList(item.bbid)
  }

  const removeNotList = (boxid) => {
    let updateList = []
    for (let ni of storeAI.notifList) {
      if (ni.bbid = boxid) {

      } else {
        updateList.push(ni)
      }
    }
    storeAI.notifList = updateList
  }
   

  
</script>

<style scoped>

.not-round {
  background-color: rgb(123, 102, 102);
  border-radius: 15px;
  justify-self: center;
  margin-top: 1.5em;
  padding: 0.2rem 0;
  color: white;
}

.not-align {
  width: 60px;
  margin-left: 20px;
  text-align: center;
  cursor: pointer;
}

.box {
  position: relative;
  top: 10;
  left: 0;
  opacity: 0.7;
  background: #e5baca;
}

.notification-item {
  color: rgb(61, 44, 44);
  cursor: pointer;
}

.active {
  background-color: red;
}

@media (min-width: 1024px) {

    .not-round {
    background-color:rgb(123, 102, 102);
    border-radius: 15px;
    justify-self: center;
    margin-top: 1.5em;
    padding: 0.2rem 0;
    color: white;
  }

  .not-align {
    width: 60px;
    margin-left: 20px;
    text-align: center;
  }

  .box {
    top: 10px;
    left: 0;
    opacity: 0.9;
    width: 130%;
    background: #e5baca;
    padding: .4em;
  }

  .active {
    background-color: red;
  }
}

</style>