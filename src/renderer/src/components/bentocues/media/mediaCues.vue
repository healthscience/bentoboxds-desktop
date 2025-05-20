<template>
  <h3>media tools</h3>
  <div id="bento-media-cues">
    <form id="add-media-form" @submit.prevent="mediaAdd()">
      <label for="media"></label>
      <label for="video"></label>
      <input type="input" id="video-add" name="video" placeholder="add video url" v-model="videoURLadd" autofocus>
    </form>
    <button id="bento-media-task" type="submit" @click.prevent="mediaAdd()">
      + add media
    </button>
  </div>
  <div id="media-paper-list" v-if="mediaMatch?.length > 0">
    <div id="media-paper-select" v-for="med in mediaMatch" :value="med.id">
      <button class="media-paper-item" @click="viewmedia(med.key)">
        {{ med.value.concept.media }}
      </button>
      <button class="media-paper-source" @click="viewSourcemedia(med.value.concept.media)">
        View source
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed} from 'vue'
import { DateTime, Interval } from 'luxon'
import { bentoboxStore } from '@/stores/bentoboxStore.js'
import { cuesStore } from '@/stores/cuesStore.js'
import { libraryStore } from '@/stores/libraryStore.js'
import { aiInterfaceStore } from '@/stores/aiInterface.js'

  const storeAI = aiInterfaceStore()
  const storeLibrary = libraryStore()
  const storeCues = cuesStore()
  const storeBentobox = bentoboxStore()

  let videoURLadd = ref('')
  let mediaTest = ref('')

  /* computed */
  const mediaMatch = computed(() => {
    return storeCues.mediaMatch[storeAI.liveBspace.cueid]
  })

  /* methods */
  const mediaAdd = () => {
    // assume youtube and extract id
    let timeAdded = DateTime.now()
    if (videoURLadd.value.length > 0) {
      let newmedia = { cueid: storeAI.liveBspace.cueid, media: videoURLadd.value, timestamp: timeAdded }
      // if first time setup object
      if (storeCues.mediaMatch[storeAI.liveBspace.cueid] === undefined) {
        storeCues.mediaMatch[storeAI.liveBspace.cueid] = []
      }
      // storeCues.mediaMatch[storeAI.liveBspace.cueid].push({ key: 'tempmark', value: { concept: { spaceid: storeAI.liveBspace.cueid, media: videoURLadd.value, timestamp: timeAdded }}})
      // save and add to space ledger
      const cueMContract = {}
      cueMContract.type = 'library'
      cueMContract.action = 'media'
      cueMContract.reftype = 'media-cues'
      cueMContract.task = 'PUT'
      cueMContract.privacy = 'public'
      cueMContract.data = newmedia
      storeLibrary.sendMessage(cueMContract)
      videoURLadd.value = ''
    }
  }

  const viewmedia = (media) => {
    let idmedia = media
    if (idmedia.length > 0) {
      // check if holder setup
      if (storeBentobox.locationMbox[storeAI.liveBspace.cueid] === undefined) {
        storeBentobox.locationMbox[storeAI.liveBspace.cueid] = {}
      }
      storeBentobox.setLocationMbox(storeAI.liveBspace.cueid, idmedia.key)
      if (storeBentobox.videoMedia[storeAI.liveBspace.cueid]) {
        storeBentobox.videoMedia[storeAI.liveBspace.cueid].push({ key: idmedia, tag: 'media', id: idmedia })
      } else {
        storeBentobox.videoMedia[storeAI.liveBspace.cueid] = []
        storeBentobox.videoMedia[storeAI.liveBspace.cueid].push({ key: idmedia, tag: 'media', id: idmedia })
      }
    } else {
      console.log('empty media')
    }
    //  need to emit to close one component up
    // spacemedia.value = false
  }

  const viewSourcemedia = (paper) => {
    // visit source in new tab
    window.open(paper, '_blank')
  }

</script>

<style scoped>

#bento-media-task {
  margin-top: 1em;
}


#media-paper-list {
  height: 200px;
  border: 1px solid red;
}
@media (min-width: 1024px) {


}

</style>