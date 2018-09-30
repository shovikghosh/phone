const validator = require('validator');
const config = require('config');
const {
    InvalidParameterError,
    MissingParameterError,
} = require('../../models/errors/CustomApplicationErrors');

const requestValidator = (req, res, next)  => {
    validateParamsExistence(req.body);
    validateParamsValue(req.body);
    next();
}

const validateParamsExistence = obj => {
    const mandatoryFields = config.get('VALIDATORS.MANDATORY_FIELDS');
    for (let field of mandatoryFields) {
        if (!obj[field]) {
            throw new MissingParameterError(field);
        }
    }
    return true;
}

const validateParamsValue = obj => {
    const mandatoryFields = config.get('VALIDATORS.MANDATORY_FIELDS'); // seperate key if mandatory keys are different from keys requiring validation
    for (let [key, val] of Object.entries(obj)) {
        if (!mandatoryFields.includes(key)) {
            continue;
        }
         // use fields if mandatory and fields are not same
        const keyType = key === 'text' ? 'TEXT' : 'PHONE';
        const options = {
            min: config.get(`VALIDATORS.${keyType}.MIN`),
            max: config.get(`VALIDATORS.${keyType}.MAX`),
        };
        if (typeof(val) !== config.get(`VALIDATORS.${keyType}.TYPE`) || (!validator.isLength(val, options))) {
            throw new InvalidParameterError(key);
        }
    }
    return true;
}

module.exports = {
    requestValidator,
    validateParamsExistence,
    validateParamsValue,
}