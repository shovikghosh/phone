const sms = require('express').Router();
const controller = require('../lib/controllers/smsController');
const {
    authenticate
} = require('../lib/auth/authenticator');
const {requestValidator} = require('../lib/validators/requestValidators');
const {
    authErrorHandler,
    genericErrorHandler,
    sendValidResponse,
} = require('../lib/middleware/responseHandler');


// * ROUTES

sms.post('/inbound/sms', requestValidator, authenticate, function (req, res, next) {
    return controller.processInboundSms(req).
    then(message => sendValidResponse(res, message)).
    catch(next);
});

sms.post('/outbound/sms', requestValidator, authenticate, function (req, res, next) {
    return controller.processOutboundSms(req).
    then(message => sendValidResponse(res, message)).
    catch(next);
});
// ------ end ROUTES

//error handler for all generated errors
sms.use(genericErrorHandler);
sms.use(authErrorHandler);

module.exports = sms;