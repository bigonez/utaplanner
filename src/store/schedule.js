import { defineStore } from 'pinia'

export const scheduleStore = defineStore('schedule', {
    state: () => ({
        raceEvent: null,

        eventProfile: null,
        eventConfig: null,
        courseConfig: null,

        startTime: null,
        expectHours: null,

        raceTimes: null,
        racePlan: null,

        racePercents: null,
        referDataset: null,
    })
})
