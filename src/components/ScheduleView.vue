<template>
          <p class="uptitle">Race Schedule</p>

          <el-table :data="raceplan" stripe table-layout="auto" ref="uptable" @row-click="toggleDetails" @expand-change="oneExpanded">
            <el-table-column type="expand">
              <template #default="props">
                <el-row>
                  <el-col :span="2"><div class="grid-content" /></el-col>

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

                  <el-col :span="0"><div class="grid-content" /></el-col>
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
</template>

<script>

export default {
  name: 'ScheduleView',
  props: {
    raceplan: Object,
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
  font-size: 1.2em;
  font-weight: bold;
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
