<template>
        <p>
          Please choose the reference athletes, the expected finish time and the start group the to generate the race schedule.
        </p>

        <div class="upform">
          <el-icon :size="24" color="#4b0082" style="vertical-align: middle">
            <coin />
          </el-icon>
          <el-select v-model="schedule.referDataset" class="m-2" placeholder="Reference Athletes">
            <el-option v-for="rs in referSet" :value="rs.v" :label="rs.l" :key="rs.id" />
          </el-select>
        </div>

        <div class="upform">
          <el-icon :size="24" color="#dc143c" style="vertical-align: middle">
            <flag />
          </el-icon>
          <el-select v-model="schedule.expectHours" class="m-2" placeholder="Expected Finish Time">
            <el-option v-for="hrs in finishHrs" :value="hrs.v" :label="hrs.l" :key="hrs.id" />
          </el-select>
        </div>

        <div class="upform">
          <el-icon :size="24" color="#0066cc" style="vertical-align: middle">
            <clock />
          </el-icon>
          <el-select v-model="schedule.startTime" class="m-2" placeholder="Start Group">
            <el-option v-for="sg in startGrps" :value="sg.t" :label="sg.l" :key="sg.id" />
          </el-select>
        </div>
</template>

<script>
import { Clock, Flag, Coin } from '@element-plus/icons-vue'
import { scheduleStore } from '../store/schedule.js'

import { startTimes, minHours, maxHours } from '../data/raceconfig'


export default {
  name: 'ScheduleForm',
  components:{
    Clock,
    Flag,
    Coin
  },
  setup() {
    const schedule = scheduleStore()

    return {
      schedule,
    }
  },
  computed: {
    finishHrs() {
      var finishHrs = []

      for (var i = minHours; i < maxHours; i++) {
        finishHrs.push( { v: i, l: i + 'h 00m' } )
        finishHrs.push( { v: i+0.5, l: i + 'h 30m' } )
      }
      finishHrs.push( { v: maxHours, l: maxHours + 'h 00m' } )

      return finishHrs
    },
    startGrps() {
      var startGrps = []

      for (var i = 0; i < startTimes.length; i++) {
        var startTime = startTimes[i]

        var startHr = ~~(startTime / 60) % 12
        if (startHr == 0) {
          startHr = 12
        }

        var startMin = startTime % 60
        if (startMin < 10) {
          startMin = '0' + startMin
        }

        var startAMPM = ' am'
        if (startTime >= 12 * 60) {
          startAMPM = ' pm'
        }

        startGrps.push( { t: startTime, l: 'Group ' + (i+1) + ', ' + startHr + ':' + startMin + startAMPM } )
      }

      return startGrps
    },
    referSet() {
      var referSet = []

      referSet.push( { v: 50,   l: 'Closest 50'    } )
      referSet.push( { v: 100,  l: 'Closest 100'   } )
      referSet.push( { v: 150,  l: 'Closest 150'   } )
      referSet.push( { v: 200,  l: 'Closest 200'   } )
      referSet.push( { v: -25,  l: 'Top 25'        } )
      referSet.push( { v: -50,  l: 'Top 50'        } )
      referSet.push( { v: -100, l: 'Top 100'       } )
      referSet.push( { v: 0,    l: 'All Finishers' } )

      return referSet
    }
  },
  methods: {

  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
p {
  text-align: justify;
  margin: 1em 0.5em;
  font-size: var(--el-font-size-medium);
}
.el-icon {
  margin-right: 15px;
}
.upform {
  margin: 1em auto;
}
</style>
