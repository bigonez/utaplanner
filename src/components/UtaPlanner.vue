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

import { scheduleStore } from '../store/schedule'

import * as utility from '../lib/Utilities'

import { cpNos, cpOdos, cutOffStrs } from '../data/cpinfo'
import { ReferTimeStrs } from '../data/raceresult'

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
  computed: {
    totalCP() {
      return cpNos.length;
    },

    totalRefer() {
      return ReferTimeStrs.length;
    },

    referTimes() {
      return utility.groupToSeconds(ReferTimeStrs);
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
          var segmentDistance = Math.round((cpOdos[j + 1] - cpOdos[j]) * 10) / 10;
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
            name: cpNos[j],
            odometer: cpOdos[j].toFixed(1) + ' km',
            racetime: utility.minsToHM( this.schedule.raceTimes[j] ),
            localtime: utility.minsToStr( (this.startTime + this.schedule.raceTimes[j]) % 1440 ),
            cutoff: cutOffStrs[j]
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
  text-shadow: 3px 3px 6px black;
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
