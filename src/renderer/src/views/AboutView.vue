<template>
  <div id="about-shaper">
    <div class="aboutspace">
      <header>About</header>
      <div class="bentobox-story">
        <div id="bentobox-story">BentoBoxDS - a toolkit for building sovereign intelligences. Connected to the health oracle protocol (HOP)  allows for buiding networks of grounded knowledge, data, analysis and machine learning. The mission is to put gaia intelligence in the hands and harddrives of all.
        </div>
        <div id="beebee-agent">
          BeeBee is the Help AI agent ready at all times to support your analysis and charting. See help for more details.
        </div>
        <div id="open-source">
          <div class="opensource-acknoledgement">BentoBox-DS is part of the Health Oracle Protocol Open Source Project</div>
          <div class="opensource-acknoledgement">Wikipedia.org, dbpedia.org & wikimedia any many open source projects make this possible.</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
</script>

<style scoped>
:root {
  --primary-color: #2c3e50;
  --secondary-color: #34495e;
  --accent-color: #3498db;
  --background-light: #f8f9fa;
  --background-medium: #f5f5f5;
  --text-light: #7f8c8d;
  --shadow-sm: 0 2px 4px rgba(0, 0, 0, 0.1);
  --shadow-md: 0 4px 6px rgba(0, 0, 0, 0.1);
  --shadow-lg: 0 10px 15px rgba(0, 0, 0, 0.1);
}

#about-shaper {
  width: 90vw;
  max-width: 1200px;
  margin: 0 auto;
  padding: 3rem 2rem;
  border: 0px dashed green;
}

.aboutspace {
  display: grid;
  grid-template-columns: 1fr;
  gap: 2.5rem;
  border: 0px solid green;
  width: 90vw;
  max-width: 1200px;
  margin-top: 2.5rem;
  padding: 1.5rem;
}

header {
  font-size: 2.8rem;
  font-weight: 700;
  color: var(--primary-color);
  margin-bottom: 2.5rem;
  text-align: center;
  line-height: 1.2;
}

.bentobox-story {
  background: white;
  border-radius: 16px;
  padding: 2.5rem;
  box-shadow: var(--shadow-lg);
  transition: transform 0.3s ease;
}

.bentobox-story:hover {
  transform: translateY(-2px);
}

#bentobox-story {
  font-size: 1.3rem;
  line-height: 1.8;
  color: var(--secondary-color);
  margin-bottom: 2rem;
  text-align: justify;
}

#beebee-agent {
  font-size: 1.15rem;
  color: var(--text-light);
  margin-bottom: 2.5rem;
  padding: 1.5rem;
  background: var(--background-light);
  border-radius: 12px;
  border-left: 4px solid var(--accent-color);
}

#open-source {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 2rem;
  margin-top: 2.5rem;
}

.opensource-acknoledgement {
  background: var(--background-medium);
  padding: 1.5rem;
  border-radius: 12px;
  font-size: 1.1rem;
  color: var(--secondary-color);
  text-align: center;
  transition: transform 0.3s ease;
}

.opensource-acknoledgement:hover {
  transform: translateY(-2px);
}

@media (max-width: 768px) {
  #about-shaper {
    width: 95vw;
    padding: 2rem 1rem;
  }

  .aboutspace {
    width: 95vw;
    padding: 1rem;
  }

  header {
    font-size: 2.2rem;
    margin-bottom: 2rem;
  }

  .bentobox-story {
    padding: 2rem;
  }

  #bentobox-story {
    font-size: 1.2rem;
  }

  #beebee-agent {
    font-size: 1.1rem;
    padding: 1.25rem;
  }

  #open-source {
    grid-template-columns: 1fr;
  }

  .opensource-acknoledgement {
    padding: 1.25rem;
  }
}
</style>
