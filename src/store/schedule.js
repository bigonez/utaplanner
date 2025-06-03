import { defineStore } from 'pinia'

export const scheduleStore = defineStore('schedule', {
    state: () => ({
        raceEvent: null,

        startTime: null,
        expectHours: null,

        raceTimes: null,
        racePlan: null,

        racePercents: null,
        referDataset: null,

        raceYear: null,
    })
})
