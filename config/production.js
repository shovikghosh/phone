module.exports = {
    MESSAGES: {
        STOP_TTL: 14400, // 4 hours * 60 * 60
        SEND_LIMIT: 50,
        SEND_TIME_LIMIT: 86400, // 1 DAY LIMIT
    },
    VALIDATORS: {
        PHONE: {
            MIN: 6,
            MAX: 16,
            TYPE: 'string',
        },
        TEXT: {
            MIN: 1,
            MAX: 120,
            TYPE: 'string',
        },
        MANDATORY_FIELDS: ['from', 'to', 'text'],
    },
    DB: {
        client: 'pg',
        connection: {
            host: 'plivo.c2mgcentketw.ap-southeast-1.rds.amazonaws.com',
            user: 'postgres',
            password: 'postgres',
            database: 'plivo',
            charset: 'utf8'
        },
    },
};
