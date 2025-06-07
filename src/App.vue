<template>
  <!-- <img alt="Vue logo" src="./assets/logo.png"> -->
  <RacePlanner msg="UTA Planner"/>
</template>

<script>
import RacePlanner from './components/RacePlanner.vue'

export default {
  name: 'App',
  components: {
    RacePlanner
  },
  created () {
    document.title = 'UTA Planner';
  }
}
</script>

<style>
body {
  font-family: Calibri, Arial, Helvetica, sans-serif;
  margin: 0px;
}
#app {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: var(--el-text-color-primary);
}
</style>
