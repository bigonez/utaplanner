import { defineStore } from 'pinia'

export const scheduleStore = defineStore('schedule', {
  state: () => ({
    startTime: '',
    expectHours: '',

    raceTimes: null,
    racePlan: null,

    racePercents: null,
    referDataset: '',
  })

})
