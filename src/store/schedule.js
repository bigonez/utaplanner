import { defineStore } from 'pinia'

export const scheduleStore = defineStore('schedule', {
    state: () => ({
        startTime: null,
        expectHours: null,

        raceTimes: null,
        racePlan: null,

        racePercents: null,
        referDataset: null,

        raceYear: null,
    })
})
