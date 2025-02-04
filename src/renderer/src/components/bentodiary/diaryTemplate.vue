<template>
  <Teleport to="body">
    <modal-Diary :show="bentoDiaryStatus" @close="closeBentoDiary">
      <div id="simpleblock" ref="simpleblock">ddfdf</div>
      Smart diary please
      <div id="ecdiary" ref="ecdiary" class="col">diaryplease</div>
      <template #header>
        <div id="Diary-modal-header">
          <button
            type="button"
            class="btn-green"
            @click="closeBentoDiary"
            aria-label="Close modal"
          >
            Close
          </button>
          <h3>BentoDiary</h3>
          <div id="return-modal-close" @click="closeBentoDiary">return</div>
        </div>
      </template>
      <template #body>
        <!--<div id="ecdiary">Diary Please parentnenen</div>-->
      </template>
      <template #footer>
      </template>
    </modal-Diary>
  </Teleport>
</template>

<script setup>
import { ref, computed } from 'vue'
import ModalDiary from '@/components/bentodiary/diaryModal.vue'
import { aiInterfaceStore } from '@/stores/aiInterface.js'
import { bentoboxStore } from '@/stores/bentoboxStore.js'

  const storeAI = aiInterfaceStore()
  const storeBentobox = bentoboxStore()


  let beebeeDiary = ref(false)
  //const simpleblock = ref(null)


  const bentoDiaryStatus = computed(() => {
    return storeAI.bentodiaryState
  })


  /* methods */
  const setShowBeeBee = () => {
    beebeeDiary.value = !beebeeDiary.value
  }

  const closeBentoDiary = () => {
    storeAI.bentodiaryState = !storeAI.bentodiaryState
    // save the current layout on close
    // storeBentobox.saveLayoutDiary(storeAI.liveBDiary.Diaryid)
  }

  const setzoomScale = (change) => {
    storeBentobox.scaleZoom = storeBentobox.scaleZoom + change
  }

</script>

<style scoped>

#diary-toolbar {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  background-color: antiquewhite;
}

#bentodiary-holder {
  border: 0px solid red;;
}

#bento-diary {
  display: grid;
  grid-template-columns: 1fr;
  border: 2px solid green;
  height: 80vh;
  width: 100%;
  margin-top: 0.1em;
  transform-origin: left top;
  border: 1px solid orange;
  background-color: #fff4f4;
  background: linear-gradient(-90deg, rgba(0, 0, 0, .1) 1px, transparent 1px), linear-gradient(rgba(0, 0, 0, .1) 1px, transparent 1px);
  background-size: 60px 60px, 60px 60px;
}

#return-modal-close {
  text-align: right;
}

  @media (min-width: 1024px) {

    #diary-modal-header {
      display: grid;
      grid-template-columns: 1fr 8fr 1fr;
    }

    #bentodiary-holder {
      height: 80vh;
      width: 100%;
      overflow: scroll;
    }

    #bento-diary {
      height: 998vh;
      width: 998vw;
      z-index: 2;
    }

    #pace-modal-header {
      display: grid;
      grid-template-columns: 1fr 1fr 1fr;
    }

    #return-modal-close {
      justify-content: right;
    }

    #open-beebee {
    position: fixed;
    bottom: 10px;
    right: 120px;
    z-index: 31;
    display: grid;
    justify-content: center;
    place-self: start;
    align-self: start;
    height: 2em;
    width: 5em;
    background-color: white;
  }

  .scale-item {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr 1fr;
    justify-self: end;
  }

  .diary-background {
    height: 600px;
    border: 2px solid blue;
  }

}

</style>
