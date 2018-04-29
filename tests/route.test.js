const expect = require('expect');
const rewire = require('rewire');

const routes = rewire('./../route/route');

describe('Routes', () => {
    const routesData = {
        routes: [
            {
                "Description": "METRO Blue Line",
                "ProviderID": "8",
                "Route": "901"
            },
            {
                "Description": "METRO Green Line",
                "ProviderID": "8",
                "Route": "902"
            }
        ],
        updateTimestamp: 1524987213511,
        dateUpdated: '29042008'    
    };

    routes.__set__('asyncHGet', () => new Promise((resolve, reject) => resolve(JSON.stringify(routesData))));
    routes.__set__('asyncHSet', () => new Promise((resolve, reject) => resolve(true)));
    routes.__set__('getAllRoutes', () => new Promise((resolve, reject) => resolve(routesData)));
    const getRouteCode = routes.__get__('getRouteCode');

    it('Should test getRouteCode, when data present', () => {
        const inputRoute = 'METRO Blue Line'.toLowerCase();
        const routeCode = getRouteCode(routesData.routes, inputRoute);
        expect(routeCode).toEqual('901');
    });

    it('Should test getRouteCode, when data absent', () => {
        const inputRoute = 'METRO Purple Line'.toLowerCase();
        const routeCode = getRouteCode(routesData.routes, inputRoute);
        expect(routeCode).toEqual(null);
    });

    it('Should test getRouteCodeAfterFetchingRoutes, when data and item present', (done) => {
        const inputRoute = 'METRO Green Line'.toLowerCase();
        routes.getRouteCodeAfterFetchingRoutes(inputRoute).then((routeCode) => {
            expect(routeCode).toEqual('902');
            done();
        });
    });

    it('Should test getRouteCodeAfterFetchingRoutes, when item absent', (done) => {
        const inputRoute = 'METRO Purple Line'.toLowerCase();
        routes.getRouteCodeAfterFetchingRoutes(inputRoute).catch((err)=> {
            expect(typeof err).toBe('object');
            expect(err.message).toEqual('Route not found!');
            done();
        });
    });

    it('Should test getRouteCodeAfterFetchingRoutes, when data absent', (done) => {
        routes.__set__('getAllRoutes', () => new Promise((resolve, reject) => resolve({})));
        const inputRoute = 'METRO Green Line'.toLowerCase();
        routes.getRouteCodeAfterFetchingRoutes(inputRoute)
        .catch((err) => {
            expect(typeof err).toBe('object');
            expect(err.message).toEqual('Route not found!');
            done();
        });
    });
});