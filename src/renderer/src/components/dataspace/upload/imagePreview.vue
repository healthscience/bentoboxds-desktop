<template>
  <div id="image-viwer">
    <div id="image-viewer-header">
      IMAGE VIEWER
    </div>
    <!--<img class="size-image" v-if="uploadImage" :src="uploadImage" :alt="'saved image'" />-->
    <img class="size-image" v-if="summaryimagedata" :src="summaryimagedata" :alt="'saved image'" />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { libraryStore } from '@/stores/libraryStore.js'

  const storeLibrary = libraryStore() 

  const props = defineProps({
    summaryimagedata: String
  })

  onMounted(() => {
    /* const reader = new FileReader()

    reader.addEventListener("load", () => {
        dataUrl = reader.result
    }, false)

    reader.readAsDataURL(file)
  */
  })

  /* computed */
  const uploadImage = computed(() => {
    // read the content
    return storeLibrary.fileBund.content
  })



</script>

<style scoped>

#image-viwer {
  display: grid;
  grid-template-columns: 1fr;
  border: 1px solid lightblue;
}

@media (min-width: 1024px) {

  #image-viwer {
    display: grid;
    grid-template-columns: 1fr;
    border: 1px solid lightblue;
    height: inherit
  }

  .size-image {
    height: 40vh;
    width: 40vw;
  }

}


</style>
