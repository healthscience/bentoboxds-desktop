<template>
  <div id="about-shaper">
    <div class="aboutspace">
      <header>About</header>
      <div class="bentobox-story">
        <p>BentoboxDS - is a nocode graphical toolkit for AI supported data science and charting.  Connected to the health oracle protocol (HOP) allows for buiding networks of data, analysis and machine learning.
The BentoBox-DS toolkit opens up the world of data and computation to more people.</p>
        <p>
          BeeBee is the Help AI agent ready at all times to support your analysis and charting.
        </p>
        <p>
          BentoBox-DS is part of the Health Oracle Protocol Open Source Project
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
</script>

<style scoped>
#about-shaper {
  width: 90vw;
  border: 0px dashed green;
}

.aboutspace {
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

.bentobox-story {
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
