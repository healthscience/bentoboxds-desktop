<template>
  <div id="space-shaper">
    <div class="bentospace">
      <div class="beebee-home">
        <beebee-chat></beebee-chat>
      </div>
      <beebee-welcome></beebee-welcome>
    </div>
  </div>

</template>

<script setup>
import BeebeeWelcome from '@/components/welcome/welcomeMessage.vue'
import BeebeeChat from '@/components/beebeehelp/inputBox.vue'
import { aiInterfaceStore } from '@/stores/aiInterface.js'
// import { ref } from 'vue'
const storeAI = aiInterfaceStore()

</script>

<style scoped>
#space-shaper {
  width: 60vw;
  border: 0px dashed green;
}

.bentospace {
  display: grid;
  grid-template-columns: 1fr;
  height: 98vh;
  width: 92vw;
  padding-top: 2px;
  margin: auto;
  transform-origin: left top;
  border: 1px solid orange;
  background-color: #fff4f4;
  background: linear-gradient(-90deg, rgba(0, 0, 0, .1) 1px, transparent 1px), linear-gradient(rgba(0, 0, 0, .1) 1px, transparent 1px);
  background-size: 60px 60px, 60px 60px;
  border:1px green;
}

.beebee-home {
  position: relative;
  top: 20%;
  height: 200px;
  z-index: 0;
  border: 0px dashed red;
}

  @media (min-width: 1024px) {

    #space-shaper {
      display: grid;
      grid-template-columns: 1fr 7fr;
      border: 0px dashed green;
    }

    .bento-history {
      border: 3px solid red;
      display: grid;
      grid-template-columns: 1fr;
      width: 20vw;
      margin-top: 9em;
    }

    .bentospace {
      display: grid;
      grid-template-columns: 1fr;
      border: 2px solid green;
      height: 98vh;
      width: 98vw;
      padding-top: 60px;
      margin: auto;
      transform-origin: left top;
      border: 1px solid orange;
      background-color: #fff4f4;
      background: linear-gradient(-90deg, rgba(0, 0, 0, .1) 1px, transparent 1px), linear-gradient(rgba(0, 0, 0, .1) 1px, transparent 1px);
      background-size: 60px 60px, 60px 60px;
    }

    .beebee-home {
      position: fixed;
      top: 30%;
      left: 50%;
      transform: translate(-50%, 50%);
      z-index: 2;
      border: 0px dashed rgb(27, 23, 130);
    }
  }
</style>