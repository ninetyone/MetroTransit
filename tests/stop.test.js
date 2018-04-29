const expect = require('expect');
const rewire = require('rewire');

const stops = rewire('./../stop/stop');

describe('Stops', () => {
    const stopsData = {
        stops: [
            {
                "Text": "Mall of America Transit Station",
                "Value": "MAAM"
            },
            {
                "Text": "Portland Ave and 77th St",
                "Value": "77PO"
            },
            {
                "Text": "Portland Ave and 66th St",
                "Value": "66PO"
            },
            {
                "Text": "Chicago Ave and 56th St",
                "Value": "56CH"
            }
        ],
        updateTimestamp: 1524987213511,
        dateUpdated: '29042008'
    };

    stops.__set__('asyncHGet', () => new Promise((resolve, reject) => resolve(JSON.stringify(stopsData))));
    stops.__set__('asyncHSet', () => new Promise((resolve, reject) => resolve(true)));
    stops.__set__('getAllStopsOnRoute', () => new Promise((resolve, reject) => resolve(stopsData)));
    const getStopCode = stops.__get__('getStopCode');

    it('Should test getStopCode, when data present', () => {
        const inputStop = 'Mall of America Transit Station'.toLowerCase();
        const stopCode = getStopCode(stopsData.stops, inputStop);
        expect(stopCode).toEqual('MAAM');
    });

    it('Should test getStopCode, when data absent', () => {
        const inputStop = '170th St  and '.toLowerCase();
        const stopCode = getStopCode(stopsData.stops, inputStop);
        expect(stopCode).toEqual(null);
    });

    it('Should test getStopCodeAfterFetchingRouteStops, when data and item present', (done) => {
        const inputStop = 'Mall of America Transit Station'.toLowerCase();
        stops.getStopCodeAfterFetchingRouteStops('5', {direction: 4, stop: inputStop})
        .then((stopCode) => {
            expect(stopCode).toEqual('MAAM');
            done();
        });
    });

    it('Should test getStopCodeAfterFetchingRouteStops, when item absent', (done) => {
        const inputStop = '170th St  and '.toLowerCase();
        stops.getStopCodeAfterFetchingRouteStops('5', {direction: 4, stop: inputStop}).catch((err)=> {
            expect(typeof err).toBe('object');
            expect(err.message).toEqual('Stop not found!');
            done();
        });
    });

    it('Should test getRouteCodeAfterFetchingRoutes, when data absent', (done) => {
        stops.__set__('getAllStopsOnRoute', () => new Promise((resolve, reject) => resolve({})));
        const inputStop = '170th St  and '.toLowerCase();
        stops.getStopCodeAfterFetchingRouteStops('5', {direction: 4, stop: inputStop}).catch((err)=> {
            expect(typeof err).toBe('object');
            expect(err.message).toEqual('Stop not found!');
            done();
        });
    });
});