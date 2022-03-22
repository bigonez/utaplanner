<template>
  <div class="common-layout">
    <el-container>
      <el-header>{{ msg }}</el-header>

      <el-main>

        <p>
          Please choose the expected finish time and the start group to generate the race schedule.
        </p>

        <div class="upform">
          <el-icon :size="24" color="#dc143c" style="vertical-align: middle">
            <flag />
          </el-icon>
          <el-select v-model="expectHours" class="m-2" placeholder="Expected Finish Time">
            <el-option v-for="hrs in finishHrs" :value="hrs.v" :label="hrs.l" :key="hrs.id" />
          </el-select>
        </div>

        <div class="upform">
          <el-icon :size="24" color="#191970" style="vertical-align: middle">
            <clock />
          </el-icon>
          <el-select v-model="startGroup" class="m-2" placeholder="Start Group">
            <el-option v-for="sg in startGrps" :value="sg.t" :label="sg.l" :key="sg.id" />
          </el-select>
        </div>

        <div v-if="estimated">
          <ScheduleView :raceplan="cpData" />
        </div>

      </el-main>

      <el-footer>
        &copy; Copyright {{ year }}, bigonez
        <a href="mailto:bigonez@gmail.com">
          <el-icon :size="20" color="#2c3e50" style="vertical-align: bottom">
            <message />
          </el-icon>
        </a>
      </el-footer>
    </el-container>
  </div>
</template>

<script>
import { Clock, Flag, Message } from '@element-plus/icons-vue'
import ScheduleView from './ScheduleView.vue'

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
var minsToHM = function (mins) {
  var hr = ~~( mins / 60);
  if (hr < 10) {
    hr = '' + hr;
  }
  var min = mins % 60;
  if (min < 10) {
    min = '0' + min;
  }
  return hr + 'h ' + min + 'm';
};
var formPace = function (km, mins) {
  var pace = mins / km;
  var m = ~~(pace);
  var s = Math.round(pace * 60 % 60);
  if (s < 10) {
    s = '0' + s;
  }
  return m + '\' ' + s + '"';
}

export default {
  name: 'UtaPlanner',
  components:{
    Clock,
    Flag,
    Message,

    ScheduleView
  },
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

      startTimes: [380, 387, 416, 426, 441, 457, 474],
      startGroup:  '',
      expectHours: ''
    }
  },
  computed: {
    finishHrs() {
      var finishHrs = [];
      for (var i = 13; i < 28; i++) {
        finishHrs.push( { v: i, l: i + 'h 00m' } );
        finishHrs.push( { v: i+0.5, l: i + 'h 30m' } );
      }
      finishHrs.push( { v: 28, l: 28 + 'h 00m' } );
      return finishHrs;
    },
    startGrps() {
      var startGrps = [];
      for (var i = 0; i < this.startTimes.length; i++) {
        var startTime = this.startTimes[i];

        var startHr = ~~(startTime / 60) % 12;
        if (startHr == 0) {
          startHr = 12;
        }

        var startMin = startTime % 60;
        if (startMin < 10) {
          startMin = '0' + startMin;
        }

        var startAMPM = ' am';
        if (startTime >= 12 * 60) {
          startAMPM = ' pm';
        }

        startGrps.push( { t: startTime, l: 'Group ' + (i+1) + ', ' + startHr + ':' + startMin + startAMPM } );
      }
      return startGrps;
    },
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
        var toNext = null;

        if (j < this.totalCP-1) {
          var segmentDistance = Math.round((this.cpOdos[j + 1] - this.cpOdos[j]) * 10) / 10;
          var segmentTime = this.expectTimes[j + 1] - this.expectTimes[j];
          var segmentPace = formPace( segmentDistance, segmentTime );

          toNext = {
            elapse: minsToHM( segmentTime ),
            distance: segmentDistance.toFixed(1),
            pace: segmentPace
          }
        }

        cpData[j] = {
          cpInfo: {
            name: this.cpNos[j],
            odometer: this.cpOdos[j].toFixed(1) + ' km',
            racetime: minsToHM( this.expectTimes[j] ),
            localtime: minsToStr( (startTime + this.expectTimes[j]) % 1440 ),
            cutoff: this.cutOffStrs[j]
          },
          toNext: toNext
        };
      }

      return cpData;
    },

    estimated() {
      return !(this.startGroup == 0 || this.expectHours == 0);
    },
    year() {
      const d = new Date();
      return d.getFullYear();
    }
  },
  methods: {
    toggleDetails(row) {
      this.$refs.uptable.toggleRowExpansion(row);
    },
    oneExpanded(row, expanded) {
      if (expanded.length > 1) {
        for (var i = 0; i < expanded.length; i++) {
          if (expanded[i] != row) {
            this.$refs.uptable.toggleRowExpansion(expanded[i], false);
          }
        }
      }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.el-icon {
  margin-right: 15px;
}
.upform {
  margin: 1em auto;
}
.el-header {
  --el-header-height: 25px;
  font-size: 1.6em;
  font-weight: bold;
  color: #fff;
  background-color: #1976d2;
  text-shadow: 2px 2px 5px navy;
  height: 60px;
  text-align: left;
  padding-top: 15px;
}
.el-main {
  padding: 0px 10px;
  max-width: 1200px;
  margin: 0px auto;
}
.el-main p {
  text-align: left;
  margin-bottom: 0px;
  font-size: var(--el-font-size-medium);
}
.el-footer {
  margin-top: 10px;
  margin-bottom: 5px;
  height: 30px;
  font-size: var(--el-font-size-medium);
}
.el-footer .el-icon:hover {
  color: #409eff;
  text-decoration: underline;
}
</style>
