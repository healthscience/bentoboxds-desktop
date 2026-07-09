<template>
  <div id="demo-lifestraps">
    <header>Demos</header>
    <div class="demo-experience">
      <button class="sov-demo-btn" @click="$emit('launch', 'orbit')">
        🏊 Experience 400IM
      </button>
      <button class="sov-demo-btn" @click="$emit('launch', 'body')">
        Heart
      </button>
      <button class="sov-demo-btn" @click="$emit('launch', 'earth')">
        Water
      </button>
      <button class="sov-demo-btn" @click="$emit('launch', 'daisy')">
        Daisy world
      </button>
    </div>
  </div>
</template>

<script setup>

</script>

<style scoped>
/* demo menu */
#demo-lifestraps {
  margin-top: 2em;
}

@media (min-width: 1024px) {


}
</style>