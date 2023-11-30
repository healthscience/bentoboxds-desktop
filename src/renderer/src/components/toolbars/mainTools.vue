<template>
  <div class="bentobox-main-nav">
    <div id="mobile-menu-live" v-if="mobileSize === false">
      <mobile-menu></mobile-menu>
    </div>
    <div class="bentobox-browser" v-else>
      <header>
        <div class="bentobox-top" id="logo-bb">
          <RouterLink to="/"><img alt="BentoBox-DS" class="logo" src="@/assets/logo.png" width="60" height="60" /></RouterLink>
          <div class="logo-words">BentoBox-DS</div>
        </div>
        <div class="bentobox-top">
          <div class="bb-align"></div>
        </div>
        <div class="bentobox-top">  
          <nav>
            <RouterLink to="/">{{ $t("message.home") }}</RouterLink>
            <RouterLink to="/about">{{ $t("message.about") }}</RouterLink>
          </nav>
        </div>
        <div class="bentobox-top">
          <div class="bb-align">
            <drop-down :title="'Language'" :items="languages"></drop-down>
          </div>
        </div>
        <div class="bentobox-top">
          <div class="bb-align alpha-round">Alpha</div>
        </div>
        <div class="bentobox-top">
          <nav>
            <RouterLink to="/help">{{ $t("message.help") }}</RouterLink>
          </nav>
        </div>
        <div class="bentobox-top">
          <div class="bb-align">Sign-in</div>
        </div>
      </header>
    </div>
  </div>
</template>

<script setup>
import mobileMenu from './mobileNav.vue'
import DropDown from './dropDown.vue'
import { ref, onMounted } from 'vue'

  let mobileSize = ref(true)
  onMounted(() => {
    let mql = window.matchMedia("(min-width: 1024px)")
    mobileSize.value = mql.matches
  })

  const languages = ref([
    { flag: 'en', language: 'en', title: 'English' },
    { flag: 'es', language: 'es', title: 'española' },
    { flag: 'zh', language: 'zh', title: '普通话' },
    { flag: 'jp', language: 'jp', title: '日本語' }
  ])

</script>

<style scoped>
.bentobox-main-nav {
  display: grid;
  grid-template-columns: 1fr;
  width: 90vw;
  border: 0px solid rgb(183, 30, 210);
  background-color: white;
}

#mobile-menu-live {
  border: 0px solid red;
  height: 40px;
  display: grid;
  justify-content: center;
  z-index: 4;
}

header {
  display: grid;
  grid-template-columns: 1fr;
  line-height: 1.5;
  /* max-height: 10vh; */
}

.bentoxbox-top {
  border: 0px dash blue;
}

#logo-bb {
  display: grid;
  grid-template-columns: 1fr 4fr;
}

.logo {
  border: 0px solid blue;
}

.logo-words {
  justify-content: start;
}


nav {
  display: grid;
  grid-template-columns: 1fr;
  width: 100%;
  font-size: 12px;
  text-align: center;
  margin-top: 2rem;
  border: 0px solid black;
}

nav a.router-link-exact-active {
  color: var(--color-text);
}

nav a.router-link-exact-active:hover {
  background-color: transparent;
}

nav a {
  display: inline-block;
  padding: 0 1rem;
  border-left: 1px solid var(--color-border);
}

nav a:first-of-type {
  border: 0;
}

.bb-align {
  font-size: 12px;
  text-align: center;
}

@media (min-width: 1024px) {
  .bentobox-browser {
    position: fixed;
    top: 0;
    display: grid;
    grid-template-columns: 1fr;
    border: 0px solid rgb(189, 30, 210);
    background-color: rgb(250, 246, 246);
    z-index: 4  }

  header {
    display: grid;
    grid-template-columns: 4fr 1fr 2fr 1fr 1fr 1fr 1fr;
    border: 0px solid blue;
    width: 98vw;
    /*max-height: 10vh;*/
  }

  .bentobox-top {
    border: 0px solid blue;
  }

  #logo-bb {
  display: grid;
  grid-template-columns: 1fr 8fr;
}

.logo {
  border: 0px solid red;
}

.logo-words {
  justify-content: start;
  align-self: center;
}

  nav {
    grid-template-columns: 1fr 1fr;
    text-align: left;
    margin-left: 0rem;
    font-size: 1rem;
    padding: 1rem 0;
    margin-top: 1rem;
    border: 0px solid red;
  }

  .bb-align {
    margin-left: 0rem;
    font-size: 1rem;
    padding: 1rem 0;
    margin-top: 1rem;
  }

  .alpha-round {
    background-color: rgb(235, 135, 63);
    border-radius: 15px;
    justify-self: end;
    margin-top: 1.5em;
    padding: 0.2rem 0;
    color: white;
  }
}
</style>