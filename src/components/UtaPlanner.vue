<template>
  <div class="raceplanner">
    <h1>{{ msg }}</h1>
    <p>
      Schedule of UTA 100 race based on the previous year's result.<br>
      Please choose the start group and the expected finish time.
    </p>
    <label>Start Group</label>
    <select v-model="startGroup">
      <option v-for="sItem in startGrps" :value="sItem.sTime" :key="sItem.id">
        {{ sItem.sLabel }}
      </option>
    </select>
    <label>Expected Finish Time</label>
    <select v-model="finishTime">
      <option v-for="hrs in finishHrs" :value="hrs" :key="hrs.id">
        {{ hrs }} hours
      </option>
    </select>

  </div>
</template>

<script>
export default {
  name: 'UtaPlanner',
  props: {
    msg: String
  },
  data() {
    return {
      finishHrs: [15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28],
      startGrps: [
        {sTime:380, sLabel:'Group 1, 6:20am'},
        {sTime:387, sLabel:'Group 2, 6:27am'},
        {sTime:416, sLabel:'Group 3, 6:56am'},
        {sTime:426, sLabel:'Group 4, 7:06am'},
        {sTime:441, sLabel:'Group 5, 7:21am'},
        {sTime:457, sLabel:'Group 6, 7:37am'},
        {sTime:474, sLabel:'Group 7, 7:54am'}
      ],
      selected: '',
      prefix: '',
      first: '',
      last: ''
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
select {
  margin-left: 10px;
  margin-right: 50px;
}
</style>
