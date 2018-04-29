const axios = require('axios');
const moment = require('moment');

const {asyncHGet, asyncHSet} = require('./../db/redis');
const key = 'schedule';
const expireThreshold = 10 * 1000; //update every 10 seconds
const dateToday = moment().format("DDMMYYYY");

async function getNextBusTimeOffset(routeCode, stopCode, directionCode) {
    try {
        const field = `${routeCode}-${stopCode}-${directionCode}`;
        let scheduleData = await asyncHGet(key, field);
        if (scheduleData) {
            scheduleData = JSON.parse(scheduleData);
            if (new Date().getTime() - scheduleData.updateTimestamp > expireThreshold || 
            dateToday != scheduleData.dateUpdated) {
                scheduleData = null;
            }
        }
        if (!scheduleData) {
            scheduleData = await getDepartureSchedule(routeCode, stopCode, directionCode);
            await asyncHSet(key, field, JSON.stringify(scheduleData));
        }
        
        const timeDiff = getNextBusTimeDiff(scheduleData.schedule);
        if (!timeDiff) {
            throw new Error('Schedule not found!');
        }
        return timeDiff;
    } catch(err) {
        throw(err);
    }
}

function getNextBusTimeDiff(scheduleData) {
    if (!scheduleData) return null;
    for (let i = 0; i < scheduleData.length; i++) {
        const schedule = scheduleData[i];
        const departureMoment = moment.utc(schedule.DepartureTime)
        const departureTimestamp = departureMoment.format('X');
        const nowTimestamp = moment.utc().format('X');
        if (departureTimestamp - nowTimestamp > 0) {
            return formatSecondsIntoTimeStr(departureTimestamp - nowTimestamp);
        }
    }
    return null;
}

function formatSecondsIntoTimeStr(sec) {
    let timeStr = '';
    const hours = Math.floor(sec / 3600);
    if (hours >= 1) {
        sec = sec - (hours * 3600);
        timeStr += hours + ' hours ';
    }
    const min = Math.floor(sec / 60);
    if (min >= 1) {
        sec = sec - (min * 60);
        timeStr += min + ' minutes';
    }
    if (min == 0) {
        if (sec == 0) {
            timeStr += timeStr == '' ? sec + ' seconds' : '';
        } else {
            timeStr += sec + ' seconds';
        }
    }
    return timeStr;
}

async function getDepartureSchedule(routeCode, stopCode, directionCode) {
    try {
        const url = `${process.env.BASE_URL}NexTrip/${routeCode}/${directionCode}/${stopCode}?format=json`;
        const response = await axios.get(url);
        if (!response.data) throw new Error('Failed to fetch schedule');
        const schedule = {
            schedule: response.data,
            updateTimestamp: new Date().getTime(),
            dateUpdated: dateToday
        }
        return schedule;
    } catch (err) {
        throw(err);
    }
};

module.exports = {getNextBusTimeOffset};