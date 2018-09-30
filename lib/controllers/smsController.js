const {
    Account
} = require('../../models/pg/Tables');
const redisHelper = require('../../models/redis/redis');
const utils = require('../utils/utils');
const logger = require('../logger/logger');
const config = require('config');
const K = require('../../config/constants');
const {
    ParamterNotFoundError,
    OperationNotAllowedError,
} = require('../../models/errors/CustomApplicationErrors');

const processInboundSms = async req => {
    const {
        from,
        to,
        text,
    } = req.body;

    const validPhoneNos = await Account.where(req.user).
    fetch({
        withRelated: ['phones']
    }).
    then(r => r.relations.phones.toArray().map(e => e.toJSON().number)).
    catch(err => {
        logger.error('Error in DB query:');
        logger.error(err);
        return null;
    });
    if (validPhoneNos && Array.isArray(validPhoneNos) && validPhoneNos.includes(to)) {
        if (text.trim() === 'STOP') { // TODO: fix trim to remove only 1 whitespace -> move match to util function
            const key = utils.generateStopKey(from, to);
            const obj = {
                from,
                to,
            };
            redisHelper.setMap(key, obj, config.get('MESSAGES.STOP_TTL'));
        }
        return K.RESPONSE.IN_OK;
    } else {
        throw new ParamterNotFoundError('to'); //TODO: move to error class
    }
}

const processOutboundSms = async req => {
    const {
        from,
        to,
        text,
    } = req.body;
    const validPhoneNos = await Account.where(req.user).
    fetch({
        withRelated: ['phones']
    }).
    then(r => r.relations.phones.toArray().map(e => e.toJSON().number)).
    catch(err => {
        logger.error('Error in DB query:');
        logger.error(err);
        return null;
    });
    if (validPhoneNos && Array.isArray(validPhoneNos) && validPhoneNos.includes(from)) {
        const key = utils.generateStopKey(from, to);
        const val = await redisHelper.getMap(key);
        if (val) {
            throw new OperationNotAllowedError(from, to);
        } else {
            // * get cache index
            const k = utils.generateSmsSentKey(from);
            const sentData = await redisHelper.get(k);
            if (sentData) {
                const sentNum = Number(sentData);
                if (sentNum > config.get('MESSAGES.SEND_LIMIT')) {
                    throw new Error(`Limit reached for from ${from}`);
                } else {
                    redisHelper.set(k, sentNum + 1);
                }
            } else {
                redisHelper.set(k, 1, config.get('MESSAGES.SEND_TIME_LIMIT'));
            }
            return K.RESPONSE.OUT_OK;
        }
    } else {
        throw new ParamterNotFoundError('from'); //TODO: move to error class
    }

}

module.exports = {
    processInboundSms,
    processOutboundSms,
};