const auth = require('basic-auth');
const {
    Account
} = require('../../models/pg/Tables');
const logger = require('../logger/logger');

const authenticate = (req, res, next) => {
    const authInfo = auth(req);
    if (!authInfo) {
        logger.info('Auth Failure!');
        logger.debug('No auth info found');
        return res.sendStatus(403);
    }
    const {
        name,
        pass
    } = authInfo;
    Account.
    where({
        username: name,
        auth_id: pass
    }).
    fetch().
    then(r => {
        if (r) {
            logger.info('Request Auth Success! for user:' + r.id);
            req.user = {
                username: name,
                auth_id: pass,
            };
            next();
        } else {
            logger.info('Auth Failure!');
            logger.debug('Auth Failure for username:' + name + ' auth with :' + pass);
            return res.sendStatus(403);
        }
    }).
    catch(err => {
        logger.error(err);
        throw err;
        // return res.status(500).json({
        //     error: 'Server Error',
        //     message: 'Please try again in sometime',
        // })
    })
}

module.exports = {
    authenticate
};