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
            <el-option v-for="hrs in finishHrs" :value="hrs.v" :label="hrs.l" :key="hrs.id">
              {{ hrs.l }}
            </el-option>
          </el-select>
        </div>

        <div class="upform">
          <el-icon :size="24" color="#191970" style="vertical-align: middle">
            <clock />
          </el-icon>
          <el-select v-model="startGroup" class="m-2" placeholder="Start Group">
            <el-option v-for="sItem in startGrps" :value="sItem.t" :label="sItem.l" :key="sItem.id">
              {{ sItem.l }}
            </el-option>
          </el-select>
        </div>

        <div v-if="estimated">
          <p class="uptitle">Race Schedule</p>

          <el-table :data="cpData" stripe table-layout="auto" ref="uptable" @row-click="toggleDetails" @expand-change="oneExpanded">
            <el-table-column type="expand">
              <template #default="props">
                <el-row>
                  <el-col :span="1"><div class="grid-content" /></el-col>

                  <el-col :span="11">
                    <div class="grid-content bg-purple-light cpinfo">
                      <div><strong>Details</strong></div>
                      <div>Odometer: {{ props.row.cpInfo.odometer }}</div>
                      <div>Race Time: {{ props.row.cpInfo.racetime }}</div>
                      <div>Local Time: {{ props.row.cpInfo.localtime }}</div>
                      <div v-if="props.row.cpInfo.cutoff!=''">Cutoff Time: <span class="cutoff">{{ props.row.cpInfo.cutoff }}</span></div>
                    </div>
                  </el-col>

                  <el-col :span="11">
                    <div class="grid-content bg-purple-light cp2next" v-if="props.row.toNext">
                      <div><strong>To Next</strong></div>
                      <div>Distance: {{ props.row.toNext.distance }} km</div>
                      <div>Elapsed Time: {{ props.row.toNext.elapse }}</div>
                      <div>Pace: {{ props.row.toNext.pace }}</div>
                    </div>
                  </el-col>

                  <el-col :span="1"><div class="grid-content" /></el-col>
                </el-row>
              </template>
            </el-table-column>

            <el-table-column prop="cpInfo.name" label="Check Point" align="center" />
            <el-table-column prop="cpInfo.odometer" label="Odometer" align="center" />
            <el-table-column prop="cpInfo.racetime" label="Race Time" align="center" />
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

      startGrps: [
        {t:380, l:'Group 1, 6:20am'},
        {t:387, l:'Group 2, 6:27am'},
        {t:416, l:'Group 3, 6:56am'},
        {t:426, l:'Group 4, 7:06am'},
        {t:441, l:'Group 5, 7:21am'},
        {t:457, l:'Group 6, 7:37am'},
        {t:474, l:'Group 7, 7:54am'}
      ],
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
.uptitle {
  font-size: 1.2em;
  font-weight: bold;
}
.el-header {
  --el-header-height: 25px;
  font-size: 2.24em;
  font-weight: bold;
  color: #191970;
  text-shadow: 2px 2px 5px grey;
}
.el-main {
  padding: 20px 3px;
  max-width: 1200px;
  margin: 0px auto;
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
