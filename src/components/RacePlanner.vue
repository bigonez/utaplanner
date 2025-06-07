<template>
  <div class="common-layout">
    <el-container>
      <el-header>
        {{ msg }}
        <el-icon v-if="isloading" class="is-loading" :size="20" color="navy" style="float: right">
          <loading />
        </el-icon>
      </el-header>

      <el-main>

        <ScheduleForm />

        <div v-if="estimated">
          <ScheduleView />
        </div>

      </el-main>

      <el-footer>
        &copy; Copyright {{ year }}, Jun Zhang
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
import { Message, Loading } from '@element-plus/icons-vue'
import ScheduleForm from './ScheduleForm.vue'
import ScheduleView from './ScheduleView.vue'

import { scheduleStore } from '../store/schedule'

import * as utility from '../lib/Utilities'

import axios from 'axios'

export default {
  name: 'RacePlanner',
  components:{
    Message,
    Loading,

    ScheduleForm,
    ScheduleView
  },
  props: {
    msg: String,
  },
  data: function () {
    return {
      isloading: false,
    };
  },
  setup() {
    const schedule = scheduleStore();

    return {
      schedule,
    }
  },
  computed: {
    raceEvent() {
      return this.schedule.raceEvent;
    },

    totalCP() {
      return this.schedule.courseConfig.cpNos.length;
    },

    startTime() {
      return this.schedule.startTime;
    },

    expectHours() {
      return this.schedule.expectHours;
    },

    racePercents() {
      return this.schedule.racePercents;
    },

    referDataset() {
      return this.schedule.referDataset;
    },

    estimated() {
      return !(this.startTime == null || this.expectHours == null || this.referDataset == null || this.racePercents == null);
    },

    year() {
      const d = new Date();
      return d.getFullYear();
    }
  },
  watch: {
    raceEvent: {
      deep: true,
      handler: function () {
        this.loadRaceConfig();
      }
    },
    expectHours: {
      deep: true,
      handler: function () {
        this.loadRacePercents();
      }
    },
    startTime: {
      deep: true,
      handler: function () {
        this.calcRacePlan();
      }
    },
    racePercents: {
      deep: true,
      handler: function () {
        this.calcExpectTimes();
        this.calcRacePlan();
      }
    },
    referDataset: {
      deep: true,
      handler: function () {
        this.loadRacePercents();
      }
    },
  },
  methods: {
    async loadRaceConfig() {
      if (this.raceEvent == null) {
        return;
      }

      axios.get(import.meta.env.VITE_Nodes_API + 'event', {
        params: {
          event: this.raceEvent
        }
      })
      .then(response => {
        this.schedule.eventProfile = response.data.eventProfile;
        this.schedule.eventConfig = response.data.eventConfig;
        this.schedule.courseConfig = response.data.courseConfig;

        this.isloading = false;
      })
      .catch(error => {
        this.isloading = false;
        console.log(error)
      })

      // Default to null
      this.schedule.referDataset = null;
      this.schedule.expectHours = null;
      this.schedule.startTime = null;

      this.schedule.eventConfig = null;
      this.schedule.courseConfig = null;

      this.isloading = true;
    },

    async loadRacePercents() {
      if (this.expectHours == null || this.referDataset == null) {
        return;
      }

      axios.get(import.meta.env.VITE_Nodes_API + 'nodes', {
        params: {
          event: this.schedule.raceEvent,
          finishtime: this.expectHours,
          reference: this.referDataset
        }
      })
      .then(response => {
        var eppData = response.data['epp']

        this.schedule.racePercents = utility.eppToPercents(eppData, this.schedule.courseConfig.arrivalIdxs);
        this.isloading = false;
      })
      .catch(error => {
        this.isloading = false;
        console.log(error)
      })

      this.schedule.racePercents = null;

      this.isloading = true;
    },

    async calcExpectTimes() {
      if (this.expectHours == null || this.racePercents == null) {
        return;
      }

      var raceTimes = [];
      raceTimes.length = this.totalCP;

      for (var k = 0; k < this.totalCP; k++) {
        raceTimes[k] = Math.round( this.expectHours * 60. * this.racePercents[k] );
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
          var segmentDistance = Math.round((this.schedule.courseConfig.cpOdos[j + 1] - this.schedule.courseConfig.cpOdos[j]) * 10) / 10;
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
            name: this.schedule.courseConfig.cpNos[j],
            fullname: this.schedule.courseConfig.cpNames[j],
            odometer: this.schedule.courseConfig.cpOdos[j].toFixed(1) + ' km',
            racetime: utility.minsToHM( this.schedule.raceTimes[j] ),
            localtime: utility.minsToStr( (this.startTime + this.schedule.raceTimes[j]) % 1440 ),
            cutoff: this.schedule.courseConfig.cutOffStrs[j]
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
