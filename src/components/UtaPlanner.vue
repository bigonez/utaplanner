<template>
  <div class="raceplanner">
    <h1>{{ msg }}</h1>
    <p>
      Schedule the UTA 100 race based on the previous year's result.<br>
      Please choose the start group and the expected finish time.
    </p>

    <label>Expected Finish Time</label>
    <select v-model="finishTime">
      <option v-for="hrs in finishHrs" :value="hrs" :key="hrs.id">
        {{ hrs }} hours
      </option>
    </select>

    <label>Start Group</label>
    <select v-model="startGroup">
      <option v-for="sItem in startGrps" :value="sItem.sTime" :key="sItem.id">
        {{ sItem.sLabel }}
      </option>
    </select>

    <p>
      {{ startGroup }} - {{ finishTime }}
    </p>
  </div>
</template>

<script>

var strToSeconds = function (timeStr) {
  var timeComponent = timeStr.split(':');
  return timeComponent[0] * 3600 + timeComponent[1] * 60 + timeComponent[2] * 1;
};
var listToSeconds = function (timeStrs) {
  var timeList = [];
  for (var i = 0; i < timeStrs.length; i++) {
    timeList.push( strToSeconds(timeStrs[i]) );
  }
  return timeList;
};
var groupToSeconds = function (timeGrpStrs) {
  var timeGroup = [];
  for (var i = 0; i < timeGrpStrs.length; i++) {
    timeGroup.push( listToSeconds(timeGrpStrs[i]) );
  }
  return timeGroup;
};

export default {
  name: 'UtaPlanner',
  props: {
    msg: String,
  },
  data() {
    return {
      cpNos: ["Start", "1km", "3km", "CP1", "Tarros Ladders", "CP2",
               "Ironpot", "CP3", "CP4", "Water Point",
               "CP5", "Aid Station", "Furber Steps", "Finish"],
      cpNames: ["KCC Oval", "1km", "3km", "Narrow Neck", "Tarros Ladders", "Foggy Knob",
                 "Ironpot Ridge Turnaround", "Six Foot Track", "Katoomba Aquatic Centre", "Fairmont Resort Water Point",
                 "Queen Victoria Hospital", "Sewage Treatment Works", "Base of Furber Steps", "Scenic World"],
      cpOdos: [0.0, 1.0, 3.0, 11.4, 21.8, 32.1, 34.7, 45.7, 57.0, 69.2, 78.4, 94.3, 99.0, 100.0],
      cutOffStrs: ["", "", "", "10:34", "", "14:56", "", "19:09", "22:28", "02:25", "05:39", "", "", "11:54"],
      ReferTimeStrs: [
        ["0:00:00", "0:04:34", "0:12:14", "1:01:04", "1:46:44", "2:41:32", "3:01:04", "4:02:34", "5:13:08", "6:41:37", "7:29:58", "9:04:32", "9:36:57", "9:51:32"],
        ["0:00:00", "0:04:29", "0:12:14", "1:00:44", "1:45:12", "2:38:01", "2:55:39", "3:54:43", "5:04:23", "6:38:10", "7:39:50", "9:12:12", "9:50:57", "10:04:28"],
        ["0:00:00", "0:04:29", "0:12:17", "1:00:55", "1:46:26", "2:38:57", "2:56:37", "3:55:30", "5:05:22", "6:36:26", "7:37:34", "9:17:59", "9:56:58", "10:09:37"]
      ],

      finishHrs: [13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28],
      startGrps: [
        {sTime:380, sLabel:'Group 1, 6:20am'},
        {sTime:387, sLabel:'Group 2, 6:27am'},
        {sTime:416, sLabel:'Group 3, 6:56am'},
        {sTime:426, sLabel:'Group 4, 7:06am'},
        {sTime:441, sLabel:'Group 5, 7:21am'},
        {sTime:457, sLabel:'Group 6, 7:37am'},
        {sTime:474, sLabel:'Group 7, 7:54am'}
      ],
      startGroup: 0,
      finishTime: 0,
      first: '',
      last: ''
    }
  },
  computed: {
    totalCP() {
      return this.cpNos.length;
    },
    referTimes() {
      return groupToSeconds(this.ReferTimeStrs);
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
