<template>
  <div id="share-protocol">
    <form id="ask-ai-form" @submit.prevent="storeAccount.shareProtocol(props.bboxid, shareType)">
      <label for="sharepeer"></label>
      <input type="input" id="sharekey" placeholder="publickey" v-model="storeAccount.sharePubkey" autofocus>
      <button id="share-send" type="submit">
        Send invite
      </button>
    </form>
  </div>
</template>

<script setup>
import { accountStore } from '@/stores/accountStore.js'

  const storeAccount = accountStore()
  

  const props = defineProps({
    shareType: String
  })

</script>

<style scoped>


@media (min-width: 1024px) {



}

</style>