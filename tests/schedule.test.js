const expect = require('expect');
const rewire = require('rewire');

const schedule = rewire('./../schedule/schedule');

describe('Schedule', () => {
    const scheduleData = {
        schedule: [
            {
                "Actual": false,
                "BlockNumber": 1044,
                "DepartureText": "4:14",
                "DepartureTime": "/Date(1524987223511-0500)/",
                "Description": "Fremont-44Av / To Penn",
                "Gate": "",
                "Route": "5",
                "RouteDirection": "NORTHBOUND",
                "Terminal": "K",
                "VehicleHeading": 0,
                "VehicleLatitude": 44.97778,
                "VehicleLongitude": -93.27317
            },
            {
                "Actual": false,
                "BlockNumber": 1401,
                "DepartureText": "5:06",
                "DepartureTime": `/Date(${new Date().getTime()+1000*19}-0500)/`,
                "Description": "Fremont-44Av / To Penn",
                "Gate": "",
                "Route": "5",
                "RouteDirection": "NORTHBOUND",
                "Terminal": "K",
                "VehicleHeading": 0,
                "VehicleLatitude": 45.07239,
                "VehicleLongitude": -93.3064
            }
        ],
        updateTimestamp: 1524987213511,
        dateUpdated: '29042008'
    };

    schedule.__set__('asyncHGet', () => new Promise((resolve, reject) => resolve(JSON.stringify(scheduleData))));
    schedule.__set__('asyncHSet', () => new Promise((resolve, reject) => resolve(true)));
    schedule.__set__('getDepartureSchedule', () => new Promise((resolve, reject) => resolve(scheduleData)));
    const formatSecondsIntoTimeStr = schedule.__get__('formatSecondsIntoTimeStr');
    const getNextBusTimeDiff = schedule.__get__('getNextBusTimeDiff');

    it('Should test formatSecondsIntoTimeStr', () => {
        let timeStr = formatSecondsIntoTimeStr(1000);
        expect(timeStr).toEqual('16 minutes');
        timeStr = formatSecondsIntoTimeStr(10200);
        expect(timeStr).toEqual('2 hours 50 minutes');
        timeStr = formatSecondsIntoTimeStr(7200);
        expect(timeStr).toEqual('2 hours ');
        timeStr = formatSecondsIntoTimeStr(20);
        expect(timeStr).toEqual('20 seconds');
        timeStr = formatSecondsIntoTimeStr(0);
        expect(timeStr).toEqual('0 seconds');
    });

    it('Should test getNextBusTimeDiff, when scheduleData is valid', () => {
        const timeStr = getNextBusTimeDiff(scheduleData.schedule);
        expect(typeof timeStr).toBe('string');
        expect(timeStr).toContain(' seconds');
        
    });

    it('Should test getNextBusTimeDiff, when scheduleData is invalid', () => {
        const timeStr = getNextBusTimeDiff([]);
        expect(timeStr).toEqual(null);
    });

    it('Should test getNextBusTimeOffset, when data present', (done) => {
        schedule.getNextBusTimeOffset('5', 4, '7SOL')
        .then((timeStr) => {
            expect(typeof timeStr).toBe('string');
            expect(timeStr).toContain(' seconds');
            done();
        });
    });

    it('Should test getNextBusTimeOffset, when data absent', (done) => {
        schedule.__set__('getDepartureSchedule', () => new Promise((resolve, reject) => resolve({})));
        schedule.getNextBusTimeOffset('5', 4, '7SOL')
        .then((timeStr) => {
            expect(typeof timeStr).toBe('string');
            expect(timeStr).toContain(' seconds');
            done();
        }).catch((err) => {
            expect(typeof err).toBe('object');
            expect(err.message).toEqual('Schedule not found!');
            done();
        });
    });
});