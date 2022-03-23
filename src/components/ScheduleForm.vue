<template>
        <p>
          Please choose the expected finish time and the start group to generate the race schedule.
        </p>

        <div class="upform">
          <el-icon :size="24" color="#dc143c" style="vertical-align: middle">
            <flag />
          </el-icon>
          <el-select v-model="schedule.expectHours" class="m-2" placeholder="Expected Finish Time">
            <el-option v-for="hrs in finishHrs" :value="hrs.v" :label="hrs.l" :key="hrs.id" />
          </el-select>
        </div>

        <div class="upform">
          <el-icon :size="24" color="#191970" style="vertical-align: middle">
            <clock />
          </el-icon>
          <el-select v-model="schedule.startTime" class="m-2" placeholder="Start Group">
            <el-option v-for="sg in startGrps" :value="sg.t" :label="sg.l" :key="sg.id" />
          </el-select>
        </div>
</template>

<script>
import { Clock, Flag } from '@element-plus/icons-vue'
import { scheduleStore } from '../store/schedule.js'

export default {
  name: 'ScheduleForm',
  components:{
    Clock,
    Flag
  },
  props: {
  },
  setup() {
    const schedule = scheduleStore()

    return {
      schedule,
    }
  },
  data() {
    return {
      startTimes: [380, 387, 416, 426, 441, 457, 474]
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
    }
  },
  methods: {

  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
p {
  text-align: left;
  margin-bottom: 0px;
  font-size: var(--el-font-size-medium);
}
.el-icon {
  margin-right: 15px;
}
.upform {
  margin: 1em auto;
}
</style>
