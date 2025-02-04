<template>
  <div id="help-shaper">
    <div class="helpspace">
      <header>Help</header>
      <div class="beebee-help">
        <p>
          Ask beebee or look at some of the guides or watch videos.
        </p>
        <p>
          Menu
        </p>
        <p>
          Guides
        </p>
      </div>
        <!-- youtube div element -->
        <vue-plyr>
          <div data-plyr-provider="youtube" data-plyr-embed-id="cXQcSB4hLfA"></div>
        </vue-plyr>
    </div>
  </div>
</template>

<script setup>
</script>

<style scoped>
#help-shaper {
  width: 90vw;
  border: 0px dashed green;
}

.helpspace {
  display: grid;
  grid-template-columns: 1fr;
  border: 0px solid green;
  width: 90vw;
  margin-top: 10px;
}

header {
  font-weight: bold;
  margin: 1em;
}

.beebee-help {
  margin: 1em;
}

p {
  padding: .5em;
}

@media (min-width: 1024px) {
  #about-shaper {
    border: 0px dashed green;
  }

  .aboutspace {
    display: grid;
    grid-template-columns: 1fr;
    border: 0px solid blue;
    width: 70vw;
    margin-top: 140px;
  }
}

</style>
