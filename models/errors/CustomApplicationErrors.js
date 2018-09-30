class InvalidParameterError extends Error {
    constructor(param) {
        const message = `${param} is invalid`;
        super(message);
        this.name = "InvalidParameterError";
        this.code = 400;
    }
}

class LimitExceedError extends Error {
    constructor(from) {
        const message = `limit reached for from ${from}`;
        super(message);
        this.name = "LimitExceedError";
        this.code = 429;
    }
}

class MissingParameterError extends Error {
    constructor(param) {
        const message = `${param} is missing`;
        super(message);
        this.name = "MissingParameterError";
        this.code = 400;
    }
}

class OperationNotAllowedError extends Error {
    constructor(from, to) {
        const message = `sms from ${from} to ${to} blocked by STOP request`;
        super(message);
        this.name = "OperationNotAllowedError";
        this.code = 400;
    }
}

class ParamterNotFoundError extends Error {
    constructor(param) {
    const message = `${param} parameter not found`;
        super(message);
        this.name = "ParamterNotFoundError";
        this.code = 400;
    }
}

class ForbiddenRequestError extends Error {
    constructor() {
        const message = `Forbidden`;
        super(message);
        this.name = "ForbiddenRequestError";
        this.code = 403;
    }
}

module.exports = {
    InvalidParameterError,
    LimitExceedError,
    MissingParameterError,
    OperationNotAllowedError,
    ParamterNotFoundError,
    ForbiddenRequestError,
};