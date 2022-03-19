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
            <el-option v-for="hrs in finishHrs" :value="hrs" :label="hrs + ' hours'" :key="hrs.id">
              {{ hrs }} hours
            </el-option>
          </el-select>
        </div>

        <div class="upform">
          <el-icon :size="24" color="#191970" style="vertical-align: middle">
            <clock />
          </el-icon>
          <el-select v-model="startGroup" class="m-2" placeholder="Start Group">
            <el-option v-for="sItem in startGrps" :value="sItem.sTime" :label="sItem.sLabel" :key="sItem.id">
              {{ sItem.sLabel }}
            </el-option>
          </el-select>
        </div>

        <div v-if="estimated">
          <p class="uptitle">Race Schedule</p>

          <el-table :data="cpData" stripe table-layout="auto" ref="uptable" @row-click="toggleDetails">
            <el-table-column type="expand">
              <template #default="props">
                <el-row>
                  <el-col :span="1"><div class="grid-content" /></el-col>

                  <el-col :span="11">
                    <div class="grid-content bg-purple-light cpinfo">
                      <div><strong>Details</strong></div>
                      <div>Odometer: {{ props.row.odometer }}</div>
                      <div>Race Time: {{ props.row.racetime }}</div>
                      <div>Local Time: {{ props.row.localtime }}</div>
                      <div v-if="props.row.cutoff!=''">Cutoff Time: <span class="cutoff">{{ props.row.cutoff }}</span></div>
                    </div>
                  </el-col>

                  <el-col :span="11">
                    <div class="grid-content bg-purple-light cp2next" v-if="props.row.pace">
                      <div><strong>To Next</strong></div>
                      <div>Distance: {{ props.row.distance }} km</div>
                      <div>Elapsed Time: {{ props.row.elapse }}</div>
                      <div>Pace: {{ props.row.pace }}</div>
                    </div>
                  </el-col>

                  <el-col :span="1"><div class="grid-content" /></el-col>
                </el-row>
              </template>
            </el-table-column>

            <el-table-column prop="name" label="Check Point" align="center" />
            <el-table-column prop="odometer" label="Odometer" align="center" />
            <el-table-column prop="racetime" label="Race Time" align="center" />
          </el-table>

          <p class="upcomments">
            * the generated schedule is based on the 2021 UTA100's result.
          </p>
        </div>

      </el-main>

      <el-footer>&copy; Copyright 2022, bigonez</el-footer>
    </el-container>
  </div>
</template>

<script>
import { Clock, Flag } from '@element-plus/icons-vue'

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
var minsToStr2 = function (mins) {
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
    Flag
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

      var segmentDistance, segmentTime, segmentPace, distance, elapse;

      for (var j = 0; j < this.totalCP; j++) {
        if (j == this.totalCP-1) {
          segmentDistance = null;
          segmentTime = null;
          segmentPace = null;
          elapse = null;
          distance = null;
        }
        else {
          segmentDistance = Math.round((this.cpOdos[j + 1] - this.cpOdos[j]) * 10) / 10;
          segmentTime = this.expectTimes[j + 1] - this.expectTimes[j];
          segmentPace = formPace( segmentDistance, segmentTime );
          elapse = minsToStr2( segmentTime );
          distance = segmentDistance.toFixed(1);
        }

        cpData[j] = {
          name: this.cpNos[j],
          odometer: this.cpOdos[j].toFixed(1) + ' km',
          racetime: minsToStr2( this.expectTimes[j] ),
          localtime: minsToStr( (startTime + this.expectTimes[j]) % 1440 ),
          cutoff: this.cutOffStrs[j],

          elapse: elapse,
          distance: distance,
          pace: segmentPace
        };
      }

      return cpData;
    },

    estimated() {
      return !(this.startGroup == 0 || this.expectHours == 0);
    }
  },
  methods: {
    toggleDetails(row) {
      this.$refs.uptable.toggleRowExpansion(row);
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
.uptitle {
  font-size: 1.2em;
  font-weight: bold;
}
.el-header {
  --el-header-height: 25px;
  font-size: 2.24em;
  font-weight: bold;
  color: #483d8b;
  text-shadow: 2px 2px 5px grey;
}
.el-main {
  padding: 20px 3px;
}
.el-main p {
  margin-bottom: 0px;
}
div.cpinfo div, div.cp2next div {
  margin-top: 6px;
  margin-bottom: 6px;
}
.upcomments {
  text-align: left;
  font-size: 0.75em;
  margin: 10px 15px;
  padding-left: 0.65em;
  text-indent: -0.65em;
}
span.cutoff {
  color: #dc143c;
  font-weight: bold;
}
</style>
