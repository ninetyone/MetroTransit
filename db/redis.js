const {promisify} = require('util');
const redis = require('redis');

const client = redis.createClient(process.env.REDIS_PORT, process.env.REDIS_HOST);

client.on('connect', (err) => {
    if (err) {
        console.error(err);
    }
});

module.exports = {
    client: client,
    asyncHSet: promisify(client.hset).bind(client),
    asyncHGet: promisify(client.hget).bind(client)
};