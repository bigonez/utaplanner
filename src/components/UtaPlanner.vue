<template>
  <div class="common-layout">
    <el-container>
      <el-header>{{ msg }}</el-header>

      <el-main>

        <p>
          Please choose the expected finish time and the start group to generate the race schedule.
        </p>

        <div>
          <p><label>Expected Finish Time</label></p>
          <div>
            <el-select v-model="expectHours" class="m-2" placeholder="Finish Time" size="small">
              <el-option v-for="hrs in finishHrs" :value="hrs" :label="hrs + ' hours'" :key="hrs.id">
                {{ hrs }} hours
              </el-option>
            </el-select>
          </div>
        </div>
        <div>
          <p><label>Start Group</label></p>
          <div>
            <el-select v-model="startGroup" class="m-2" placeholder="Start Group" size="small">
              <el-option v-for="sItem in startGrps" :value="sItem.sTime" :label="sItem.sLabel" :key="sItem.id">
                {{ sItem.sLabel }}
              </el-option>
            </el-select>
          </div>
        </div>

        <div v-if="estimated">
          <p>Race Check Points</p>
          <el-table :data="cpData" stripe style="width: auto" size="small">
            <el-table-column prop="name" label="Check Point" />
            <el-table-column prop="odometer" label="Odometer" />
            <el-table-column prop="racetime" label="Race Time" />
            <el-table-column prop="localtime" label="Local Time" />
            <el-table-column prop="cutoff" label="Cut Off" />
          </el-table>

          <p>Race Segments</p>
          <el-table :data="segmentData" stripe style="width: auto" size="small">
            <el-table-column prop="from" label="From" />
            <el-table-column prop="to" label="To" />
            <el-table-column prop="time" label="Time" />
            <el-table-column prop="distance" label="Distance" />
            <el-table-column prop="pace" label="Pace" />
          </el-table>
        </div>

        <sub v-if="estimated">
          * the generated schedule is based on the 2021 UTA100's result.
        </sub>

      </el-main>

      <el-footer>&copy; Copyright 2022, bigonez</el-footer>
    </el-container>
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
var minsToStr = function (mins) {
  var hr = ~~( mins / 60);
  if (hr < 10) {
    hr = '' + hr;
  }
  var min = mins % 60;
  if (min < 10) {
    min = '0' + min;
  }
  return hr + ':' + min;
};
var formPace = function (km, mins) {
  var pace = mins / km;
  var m = ~~(pace);
  var s = Math.round(pace * 60 % 60);
  if (s < 10) {
    s = '0' + s;
  }
  return m + '\'' + s + '"';
}

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
      startGroup:  '',
      expectHours: '',
      first: '',
      last: ''
    }
  },
  computed: {
    totalCP() {
      return this.cpNos.length;
    },
    totalRefer() {
      return this.ReferTimeStrs.length;
    },

    referTimes() {
      return groupToSeconds(this.ReferTimeStrs);
    },

    expectTimes() {
      if (this.expectHours == 0) {
        return null;
      }

      var expectTimes = [];
      expectTimes.length = this.totalCP;
      var refers = [];
      refers.length = this.totalRefer;

      for (var k = 0; k < this.totalCP; k++) {
        expectTimes[k] = 0;
      }
      for (var i = 0; i < this.totalRefer; i++) {
        var referTime = this.referTimes[i][this.totalCP - 1];
        var referFactor = this.expectHours * 3600 / referTime / this.totalRefer;
        for (var j = 0; j < this.totalCP; j++) {
          expectTimes[j] += this.referTimes[i][j] * referFactor;
        }
      }
      for (k = 0; k < this.totalCP; k++) {
        expectTimes[k] = Math.round( expectTimes[k] / 60. );
      }
      return expectTimes;
    },

    cpData() {
      var cpData = [];
      cpData.length = this.totalCP;
      var startTime = this.startGroup;
      for (var j = 0; j < this.totalCP; j++) {
        cpData[j] = {
          name: this.cpNos[j],
          odometer: this.cpOdos[j].toFixed(1),
          racetime: minsToStr( this.expectTimes[j] ),
          localtime: minsToStr( (startTime + this.expectTimes[j]) % 1440 ),
          cutoff: this.cutOffStrs[j]
        };
      }

      return cpData;
    },
    segmentData() {
      var segmentData = [];
      segmentData.length = this.totalCP;
      for (var j = 0; j < this.totalCP - 1; j++) {
        var segmentDistance = Math.round((this.cpOdos[j + 1] - this.cpOdos[j]) * 10) / 10;
        var segmentTime = this.expectTimes[j + 1] - this.expectTimes[j];

        segmentData[j] = {
          from: this.cpNos[j],
          to: this.cpNos[j+1],
          time: minsToStr( segmentTime ),
          distance: segmentDistance.toFixed(1),
          pace: formPace( segmentDistance, segmentTime )
        };
      }

      return segmentData;
    },

    estimated() {
      return !(this.startGroup == 0 || this.expectHours == 0);
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
table {
  margin: 0px auto 10px;
}
td.title {
  text-align: right;
}
td.item {
  text-align: left;
}
.utaplan {
  border-spacing:  0px;
}
.utaplan tr:nth-child(even), .utaplan thead tr {
  background-color: #E7E9EB;
}
.utaplan tr td, .utaplan tr th {
  padding: 3px 5px;
}

.utasegment {
  border-spacing:  0px;
}
.utasegment tr:nth-child(even), .utasegment thead tr {
  background-color: #E7E9EB;
}
.utasegment tr td, .utasegment tr th {
  padding: 3px 5px;
}

.raceplanner div {
/*  margin-top: 1em; */
}
.raceplanner div p {
  font-weight: bold;
  margin: 0.5em auto;
}

footer {
  margin-top: 10px;
}
</style>
