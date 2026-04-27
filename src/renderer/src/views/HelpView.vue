<template>
  <div id="help-shaper">
    <div class="helpspace">
      <header>Help</header>
      <div class="beebee-help">
        <div id="ask-beebee">
          Ask beebee for help via the chat box.  Look for beebee button bottom right.
        </div>
        <div id="video-menu">
          <p>A selection of videos have been made including the topic of getting started, cues, making relationships, connecting to other peers, sharing peer to peer.</p>
          <p>Watch all videos on <a href="https://rumble.com/user/BeeBeeHop/videos" target="_blank" rel="noopener noreferrer">Rumble</a></p>
        </div>
        <div id="guides">
          Guides to BentoTemplate building coming soon.
        </div>
        <div id="community">
          Join the community for self help and learning on <a href="https://discord.gg/JhdkXX54Xk" target="_blank" rel="noopener noreferrer">Discord</a>
        </div>
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
