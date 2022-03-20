<template>
  <!-- <img alt="Vue logo" src="./assets/logo.png"> -->
  <UtaPlanner msg="UTA 100 Planner"/>
</template>

<script>
import UtaPlanner from './components/UtaPlanner.vue'

export default {
  name: 'App',
  components: {
    UtaPlanner
  },
  created () {
    document.title = 'UTA 100 Planner';
  }
}
</script>

<style>
body {
  font-family: Calibri, Arial, Helvetica, sans-serif;
}
#app {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 25px;
}
</style>
