<template>
          <p class="uptitle">Race Schedule</p>

          <el-table :data="schedule.racePlan" stripe table-layout="auto" ref="uptable" @row-click="toggleDetails" @expand-change="oneExpanded" :header-row-style="{color: 'var(--el-text-color-regular)'}">
            <el-table-column prop="cpInfo.name" label="Check Point" align="center" />
            <el-table-column prop="cpInfo.odometer" label="Odometer" align="center" />
            <el-table-column prop="cpInfo.racetime" label="Race Time" align="center" />

            <el-table-column type="expand">
              <template #default="props">
                <el-row>
                  <el-col :span="2"><div class="grid-content" /></el-col>

                  <el-col :span="props.row.toNext ? 11 : 22">
                    <div class="grid-content bg-purple-light cpinfo">
                      <div><strong>{{ props.row.cpInfo.fullname }}</strong></div>
                      <div>Odometer: {{ props.row.cpInfo.odometer }}</div>
                      <div>Race Time: {{ props.row.cpInfo.racetime }}</div>
                      <div>Local Time: {{ props.row.cpInfo.localtime }}</div>
                      <div v-if="props.row.cpInfo.cutoff != ''">Cutoff Time: <span class="cutoff">{{ props.row.cpInfo.cutoff }}</span></div>
                    </div>
                  </el-col>

                  <el-col :span="11" v-if="props.row.toNext">
                    <div class="grid-content bg-purple-light cp2next">
                      <div><strong>To Next</strong></div>
                      <div>Distance: {{ props.row.toNext.distance }} km</div>
                      <div>Elapsed Time: {{ props.row.toNext.elapse }}</div>
                      <div>Pace: {{ props.row.toNext.pace }}</div>
                    </div>
                  </el-col>
                </el-row>
              </template>
            </el-table-column>
          </el-table>

          <p class="upcomments">
            * the above schedule was generated based on the UTA100 {{ schedule.raceYear }}'s race result.
          </p>
</template>

<script>
import { scheduleStore } from '../store/schedule.js'

export default {
  name: 'ScheduleView',
  setup() {
    const schedule = scheduleStore()

    return {
      schedule,
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
.uptitle {
  font-size: var(--el-font-size-large);
  font-weight: bold;
  margin: 20px auto 0px;
  text-align: left;
}
div.cpinfo div, div.cp2next div {
  margin-top: 6px;
  margin-bottom: 6px;
}
.upcomments {
  text-align: left;
  font-size: var(--el-font-size-small);
  margin: 10px 15px;
  padding-left: 0.65em;
  text-indent: -0.65em;
}
span.cutoff {
  color: #dc143c;
  font-weight: bold;
}
</style>
