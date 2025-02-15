<template>
  <div id="space-shaper">
    <div class="bentospace">
      <div class="beebee-home">
        <!--<beebee-chat></beebee-chat>-->
        <div id="mission-statement">Sovereign data that shapes health</div>
        <img class="hop-flow" src="../.././assets/hoplogosmall.png" alt="cues">
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
  top: 10%;
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
      display: grid;
      grid-template-columns: 1fr;
      justify-items: center;
      top: 10%;
      left: 50%;
      transform: translate(-50%, 50%);
      z-index: 2;
      background: linear-gradient(
        145deg,
        rgba(82, 84, 171, 0.95) 0%,
        rgba(82, 84, 171, 0.85) 100%
      );
      box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
      backdrop-filter: blur(4px);
      -webkit-backdrop-filter: blur(4px);
      border-radius: 20px;
      border: 1px solid rgba(255, 255, 255, 0.18);
      padding: 1.5em;
      /* background-color: #5254ab;  #222392 5254ab from bentobox logo*/
    }

    #mission-statement {
      font-family: 'Arial', sans-serif;
      font-size: 2em;
      font-weight: 600;
      color: #fff;
      text-align: center;
      text-transform: uppercase;
      letter-spacing: 3px;
      text-shadow: 0 0 10px rgba(0, 255, 255, 0.5),
        0 0 20px rgba(0, 255, 255, 0.3),
        0 0 30px rgba(0, 255, 255, 0.1);
      animation: glow 2s ease-in-out infinite alternate;
    }

    @keyframes glow {
    from {
      text-shadow: 0 0 10px rgba(0, 255, 255, 0.5),
                  0 0 20px rgba(0, 255, 255, 0.3),
                  0 0 30px rgba(0, 255, 255, 0.1);
    }
    to {
      text-shadow: 0 0 20px rgba(0, 255, 255, 0.6),
                  0 0 30px rgba(0, 255, 255, 0.4),
                  0 0 40px rgba(0, 255, 255, 0.2);
    }
  }
}
</style>