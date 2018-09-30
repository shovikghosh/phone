const {
    ForbiddenRequestError
} = require('../../models/errors/CustomApplicationErrors');

const genericErrorHandler = (err, req, res, next) => {
    const {
        code,
        message
    } = err;
    res.status(code || 500).json({
        message: '',
        error: message || 'unknown failure'
    });
}

const authErrorHandler = (err, req, res, next) => {
    if (err instanceof ForbiddenRequestError) {
        res.sendStatus(403);
    } else {
        next();
    }
}

const sendValidResponse = (res, message) => {
    return res.json({
        message,
        error: '',
    })
}

module.exports = {
    authErrorHandler,
    genericErrorHandler,
    sendValidResponse,
}