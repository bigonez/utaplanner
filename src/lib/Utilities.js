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

export {
  strToSeconds,
  listToSeconds,
  groupToSeconds,
  minsToStr,
  minsToHM,
  formPace
}