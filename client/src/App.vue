<template>
  <div class="app">
    <div id="container">
      <NavBar class="nav"/>
      <transition name="views">
        <router-view />
      </transition>
    </div>
  </div>
</template>

<script>
import NavBar from './components/NavBar';

export default {
  components: {
    NavBar
  }
}
</script>

<style>
  * {
    margin: 0;
    padding: 0;
    font-family: Montserrat;
    font-style: normal;
    font-weight: normal;
    font-size: 32px;
  }

  #container {
    display: flex;
    background: linear-gradient(128.09deg, #C0C8EE 10.35%, #FFF0E1 87.38%);
    background-attachment: fixed;
  }

  .views-enter-active, .views-leave-active {
    transition-duration: .35s;
    opacity: 1
  }

  .views-enter-from, .views-leave-to {
    opacity: 0;
  }
</style>