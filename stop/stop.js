const axios = require('axios');
const moment = require('moment');

const {asyncHGet, asyncHSet} = require('./../db/redis');
const key = 'stops';
const expireThreshold = 1 * 60 * 60 * 1000; //update every one hour
const dateToday = moment().format("DDMMYYYY");

async function getStopCodeAfterFetchingRouteStops(routeCode, input) {
    try {
        const field = `${routeCode}-${input.direction}`;
        let stopsData = await asyncHGet(key, field);
        if (stopsData) {
            stopsData = JSON.parse(stopsData);
            if (new Date().getTime() - stopsData.updateTimestamp > expireThreshold || 
            dateToday != stopsData.dateUpdated) { //Expire every 3 hours and when date changes
                stopsData = null;
            }
        }
        if (!stopsData) {
            stopsData = await getAllStopsOnRoute(routeCode, input.direction);
            await asyncHSet(key, field, JSON.stringify(stopsData));
        }

        const stopCode = getStopCode(stopsData.stops, input.stop);
        if (!stopCode) {
            throw new Error('Stop not found!');
        }
        return stopCode;
    } catch(err) {
        throw(err);
    }
}

function getStopCode(stopsData, inputStop) {
    if (!stopsData) return null;
    for (let i = 0; i < stopsData.length; i++) {
        const stop = stopsData[i];
        const thisStopName = (stop.Text || '').toLowerCase();
        if (thisStopName.includes(inputStop)) {
            return stop.Value;
        }
    }
    return null;
}

async function getAllStopsOnRoute(routeCode, directionCode) {
    try {
        const url = `${process.env.BASE_URL}NexTrip/Stops/${routeCode}/${directionCode}?format=json`;
        const response = await axios.get(url);
        if (!response.data) throw new Error('Failed to fetch stops');
        const stops = {
            stops: response.data,
            updateTimestamp: new Date().getTime(),
            dateUpdated: dateToday    
        }
        return stops;
    } catch (err) {
        throw(err);
    }
};

module.exports = {getStopCodeAfterFetchingRouteStops};