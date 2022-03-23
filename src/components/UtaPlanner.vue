<template>
  <div class="common-layout">
    <el-container>
      <el-header>{{ msg }}</el-header>

      <el-main>

        <ScheduleForm />

        <div v-if="estimated">
          <ScheduleView />
        </div>

      </el-main>

      <el-footer>
        &copy; Copyright {{ year }}, bigonez
        <a href="mailto:bigonez@gmail.com">
          <el-icon :size="20" color="var(--el-text-color-primary)" style="vertical-align: bottom">
            <message />
          </el-icon>
        </a>
      </el-footer>
    </el-container>
  </div>
</template>

<script>
import { Message } from '@element-plus/icons-vue'
import ScheduleForm from './ScheduleForm.vue'
import ScheduleView from './ScheduleView.vue'

import { scheduleStore } from '../store/schedule.js'

import * as utility from '../lib/Utilities'

export default {
  name: 'UtaPlanner',
  components:{
    Message,

    ScheduleForm,
    ScheduleView
  },
  props: {
    msg: String,
  },
  setup() {
    const schedule = scheduleStore();

    return {
      schedule,
    }
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
      ]
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
      return utility.groupToSeconds(this.ReferTimeStrs);
    },

    startTime() {
      return this.schedule.startTime;
    },

    expectHours() {
      return this.schedule.expectHours;
    },

    estimated() {
      return !(this.startTime == '' || this.expectHours == '');
    },

    year() {
      const d = new Date();
      return d.getFullYear();
    }
  },
  watch: {
    expectHours: {
      deep: true,
      handler: function () {
        this.calcExpectTimes();
        this.calcRacePlan();
      }
    },
    startTime: {
      deep: true,
      handler: function () {
        this.calcRacePlan();
      }
    },
  },
  methods: {
    async calcExpectTimes() {
      if (this.expectHours == '') {
        return;
      }

      var raceTimes = [];
      raceTimes.length = this.totalCP;
      var refers = [];
      refers.length = this.totalRefer;

      for (var k = 0; k < this.totalCP; k++) {
        raceTimes[k] = 0;
      }
      for (var i = 0; i < this.totalRefer; i++) {
        var referTime = this.referTimes[i][this.totalCP - 1];
        var referFactor = this.expectHours * 3600 / referTime / this.totalRefer;
        for (var j = 0; j < this.totalCP; j++) {
          raceTimes[j] += this.referTimes[i][j] * referFactor;
        }
      }
      for (k = 0; k < this.totalCP; k++) {
        raceTimes[k] = Math.round( raceTimes[k] / 60. );
      }

      this.schedule.raceTimes = raceTimes;
    },

    async calcRacePlan() {
      if (! this.estimated) {
        return;
      }

      var cpData = [];
      cpData.length = this.totalCP;

      for (var j = 0; j < this.totalCP; j++) {
        var toNext = null;

        if (j < this.totalCP - 1) {
          var segmentDistance = Math.round((this.cpOdos[j + 1] - this.cpOdos[j]) * 10) / 10;
          var segmentTime = this.schedule.raceTimes[j + 1] - this.schedule.raceTimes[j];
          var segmentPace = utility.formPace( segmentDistance, segmentTime );

          toNext = {
            elapse: utility.minsToHM( segmentTime ),
            distance: segmentDistance.toFixed(1),
            pace: segmentPace
          }
        }

        cpData[j] = {
          cpInfo: {
            name: this.cpNos[j],
            odometer: this.cpOdos[j].toFixed(1) + ' km',
            racetime: utility.minsToHM( this.schedule.raceTimes[j] ),
            localtime: utility.minsToStr( (this.startTime + this.schedule.raceTimes[j]) % 1440 ),
            cutoff: this.cutOffStrs[j]
          },
          toNext: toNext
        };
      }

      this.schedule.racePlan = cpData;
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
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
.el-footer {
  margin-top: 10px;
  margin-bottom: 5px;
  height: 30px;
  font-size: var(--el-font-size-medium);
}
.el-footer .el-icon:hover {
  color: var(--el-color-primary);
  text-decoration: underline;
}
</style>
