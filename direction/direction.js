let getDirectionCode = (directionStr) => {
    if (!directionStr) return null;
    switch(directionStr.toLowerCase()) {
        case 'south':
            return 1;
        case 'east':
            return 2;
        case 'west':
            return 3;
        case 'north':
            return 4;
        default:
            return null;
    }
}

module.exports = {getDirectionCode};