const expect = require('expect');

const direction = require('./../direction/direction');

describe('Direction', () => {
    it('Should test getDirectionCode, for north', () => {
        const directionCode = direction.getDirectionCode('north');
        expect(directionCode).toEqual(4);
        const directionCodeCapital = direction.getDirectionCode('NORTH');
        expect(directionCodeCapital).toEqual(4);
    });

    it('Should test getDirectionCode, for east', () => {
        const directionCode = direction.getDirectionCode('east');
        expect(directionCode).toEqual(2);
        const directionCodeCapital = direction.getDirectionCode('EASt');
        expect(directionCodeCapital).toEqual(2);
    });

    it('Should test getDirectionCode, for west', () => {
        const directionCode = direction.getDirectionCode('west');
        expect(directionCode).toEqual(3);
        const directionCodeCapital = direction.getDirectionCode('WEst');
        expect(directionCodeCapital).toEqual(3);
    });

    it('Should test getDirectionCode, for south', () => {
        const directionCode = direction.getDirectionCode('south');
        expect(directionCode).toEqual(1);
        const directionCodeCapital = direction.getDirectionCode('SOuth');
        expect(directionCodeCapital).toEqual(1);
    });

    it('Should test getDirectionCode, for invalid string', () => {
        const directionCode = direction.getDirectionCode('abcd');
        expect(directionCode).toEqual(null);
    });

    it('Should test getDirectionCode, for blank string', () => {
        const directionCode = direction.getDirectionCode('');
        expect(directionCode).toEqual(null);
    });
});