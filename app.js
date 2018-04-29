const config = require('./config/config');
const direction = require('./direction/direction');
const routes = require('./route/route');
const stops = require('./stop/stop');
const schedule = require('./schedule/schedule');
const {client} = require('./db/redis');

const input = {
    route: (process.argv[2] || '').toLowerCase(),
    stop: (process.argv[3] || '').toLowerCase(),
    direction: direction.getDirectionCode(process.argv[4])
}

if (!input.route || !input.stop || !input.direction) {
    return console.log('Invalid arguments. Run with app.js "<route>" "<stop>" "<direction>"');
}

const findNextBusFromUserInput = async(input) => {
    try {
        const routeCode = await routes.getRouteCodeAfterFetchingRoutes(input.route);
        if (routeCode instanceof Error) throw routeCode;
        const stopCode = await stops.getStopCodeAfterFetchingRouteStops(routeCode, input);
        if (stopCode instanceof Error) throw stopCode;
        return await schedule.getNextBusTimeOffset(routeCode, stopCode, input.direction);
    } catch(err) {
        throw(err);
    }
}

findNextBusFromUserInput(input)
.then(timeOffset => {
    console.log(timeOffset);
    client.quit();
}).catch(err => {
    console.error(err);
    client.quit();
});