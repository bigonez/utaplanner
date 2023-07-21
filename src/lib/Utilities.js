// Utility functions for Race Planning

const strToSeconds = function (timeStr) {
    var timeComponent = timeStr.split(':');
    return timeComponent[0] * 3600 + timeComponent[1] * 60 + timeComponent[2] * 1;
};

const listToSeconds = function (timeStrs) {
    var timeList = [];
    for (var i = 0; i < timeStrs.length; i++) {
        timeList.push( strToSeconds(timeStrs[i]) );
    }
    return timeList;
};

const groupToSeconds = function (timeGrpStrs) {
    var timeGroup = [];
    for (var i = 0; i < timeGrpStrs.length; i++) {
        timeGroup.push( listToSeconds(timeGrpStrs[i]) );
    }
    return timeGroup;
};

const minsToStr = function (mins) {
    var hr = ~~( mins / 60);
    if (hr < 10) {
        hr = '' + hr;
    }
    var min = mins % 60;
    if (min < 10) {
        min = '0' + min;
    }
    return hr + ':' + min;
};

const minsToHM = function (mins) {
    var hr = ~~( mins / 60);
    if (hr < 10) {
        hr = '' + hr;
    }
    var min = mins % 60;
    if (min < 10) {
        min = '0' + min;
    }
    return hr + 'h ' + min + 'm';
};

const formPace = function (km, mins) {
    var pace = mins / km;
    var m = ~~(pace);
    var s = Math.round(pace * 60 % 60);
    if (s < 10) {
        s = '0' + s;
    }
    return m + '\' ' + s + '"';
};

const eppToPercents = function (eppData) {
    var eppLen = eppData.length

    var TpPercents = {
        1: 0.0,
        2: 1.0
    }

    var Tp = 1.0
    var Trace = Tp
    for(var cp=0; cp < eppLen; cp++) {
        var Pcp = Math.PI - Math.log(eppData[cp])

        Tp *= (1 - Pcp) / Pcp
        Trace += Tp

        TpPercents[cp+3] = Trace
    }
    var PercentLen = Object.keys(TpPercents).length

    var ArraiveIds = [6, 9, 11, 13, 15]
    var CpPercents = []
    for(cp=0; cp < PercentLen; cp++) {
        if( ArraiveIds.indexOf(cp+1) < 0 ) {
            CpPercents.push( TpPercents[cp+1] / Trace )
        }
    }

    return CpPercents;
};

export {
    strToSeconds,
    listToSeconds,
    groupToSeconds,
    minsToStr,
    minsToHM,
    formPace,
    eppToPercents,
}