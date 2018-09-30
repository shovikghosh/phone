const express = require('express');
const app = express();
const logger = require('./lib/logger/logger');
const bodyParser = require('body-parser');
const port = process.env.PORT || 4000
app.use(bodyParser.json());

const bookshelf = require('./models/pg/bookshelf');
const redis = require('./models/redis/redis');

const smsRouter = require('./routes/sms');

app.use('/', smsRouter);

app.use('/', function (req, res) {
    res.sendStatus(405);
});

const cleanup = () => {
    const p1 =  bookshelf.closeConn();
    const p2 = redis.closeConn();
    return Promise.all([p1,p2]);
}
const server = app.listen(port);
server.cleanup = cleanup;
module.exports = server;
logger.info('Server Running on port:' + port);
