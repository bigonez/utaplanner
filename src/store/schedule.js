import { defineStore } from 'pinia'

export const scheduleStore = defineStore('schedule', {
  state: () => ({
    startGroup: '',
    expectHours: '',

    expecttimes: null,
    raceplan: null,
  })

})
