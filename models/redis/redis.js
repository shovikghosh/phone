const redis = require('redis');
const bluebird = require('bluebird');
bluebird.promisifyAll(redis.RedisClient.prototype);
bluebird.promisifyAll(redis.Multi.prototype);
const client = redis.createClient();
const logger = require('../../lib/logger/logger');
client.on('error', err => {
    logger.error('Error in redis connection:' + err.message);
    process.exit(10); // exit since redis is primary DB
});

//  setTimeout(() => client.quit(), 3000)

const setMap = (key, obj, ttl) => {
    const hmap = Object.entries(obj).reduce((p1, p2) => p1.concat(p2), []);
    client.hmset(key, hmap, (err, res) => {
        if (err) {
            logger.error(err);
        } else {
            setExpiry(key, ttl);
        }
    });
}

const set = (key, data, ttl) => {
    if (ttl) {
        client.set(key, data, 'EX', ttl);
    } else {
        client.set(key, data);
    }
}

const setExpiry = (key, ttl) => {
    client.expire(key, ttl);
}

const closeConn = () => {
    return client.quitAsync();
}

const getMap = key => client.hgetallAsync(key);

const get = key => client.getAsync(key);

module.exports = {
    closeConn,
    set,
    setMap,
    get,
    getMap,
};