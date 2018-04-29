const axios = require('axios');
const moment = require('moment');

const {asyncHGet, asyncHSet} = require('./../db/redis');
const key = 'routes';
const field = 'all';
const expireThreshold = 3 * 60 * 60 * 1000; //update every three hours
const dateToday = moment().format("DDMMYYYY");

async function getRouteCodeAfterFetchingRoutes(inputRoute) {
    try {
        let routesData = await asyncHGet(key, field);
        if (routesData) {
            routesData = JSON.parse(routesData);
            if (new Date().getTime() - routesData.updateTimestamp > expireThreshold || 
            dateToday != routesData.dateUpdated) { //Expire every 3 hours and when date changes
                routesData = null;
            }
        }

        if (!routesData) {
            routesData = await getAllRoutes();            
            await asyncHSet(key, field, JSON.stringify(routesData));
        }

        const routeCode = getRouteCode(routesData.routes, inputRoute);
        if (!routeCode) {
            throw new Error('Route not found!');
        }
        return routeCode;
    } catch(err) {
        throw(err);
    }
}

function getRouteCode(routesData, inputRoute) {
    if (!routesData) return null;
    for (let i = 0; i < routesData.length; i++) {
        const route = routesData[i];
        const thisRouteDesc = (route.Description || '').toLowerCase();
        if (thisRouteDesc.includes(inputRoute)) {
            return route.Route;
        }
    }
    return null;
}

async function getAllRoutes() {
    try {
        const url = `${process.env.BASE_URL}NexTrip/Routes?format=json`;
        const response = await axios.get(url);
        if (!response.data) throw new Error('Failed to fetch routes');
        const routes = {
            routes: response.data,
            updateTimestamp: new Date().getTime(),
            dateUpdated: dateToday    
        }
        return routes;
    } catch (err) {
        throw(err);
    }
};

module.exports = {getRouteCodeAfterFetchingRoutes};