require('mocha');
const chai = require('chai');
const chaiHttp = require('chai-http');
chai.use(chaiHttp);
chai.should();
const expect = chai.expect;

const {
    validateParamsExistence,
    validateParamsValue,
} = require('../lib/validators/requestValidators');

const {
    generateStopKey,
    generateSmsSentKey,
} = require('../lib/utils/utils');

const {} = require('../models/errors/CustomApplicationErrors');

describe('utils.js', function () {
    describe('#generateStopKey()', function () {
        it('should return concatenated vals for redis key', function () {
            const from = '9912112211';
            const to = '8812882243';
            const key = generateStopKey(from, to);
            expect(key).to.be.equal('test:stop:9912112211|8812882243');
        });
    });
    describe('#generateSmsSentKey()', function () {
        it('should return sent key redis key', function () {
            const from = '99121122111';
            const key = generateSmsSentKey(from);
            expect(key).to.be.equal('test:sent:99121122111');
        });
    });
});


describe('requestValidators.js', function () {

    describe('#validateParamsExistence()', function () {
        it('should return true if from,to, text are present', function () {
            const requestBody = {
                from: '111111',
                to: '122222222222222',
                text: 'todays date and text',
            };
            expect(validateParamsExistence(requestBody)).to.be.true;
        });

        it('should return true if from,to, text are present, even when content is invalid', function () {
            const requestBody = {
                from: '111111',
                to: '12', //invalid but not missing
                text: 'todays date and text',
            };
            const ret = validateParamsExistence(requestBody);
            ret.should.be.true;
        });

        it('should throw error when from is missing', function () {
            const requestBody = {
                to: '12111111', //invalid but not missing
                text: 'todays date and text',
            };
            expect(() => validateParamsExistence(requestBody)).to.throw('from is missing');
        });

        it('should throw error when to is missing', function () {
            const requestBody = {
                from: '121111116711', //invalid but not missing
                text: 'todays date and text',
            };
            expect(() => validateParamsExistence(requestBody)).to.throw('to is missing');
        });

        it('should throw error when to is missing', function () {
            const requestBody = {
                from: '121111116711', //invalid but not missing
                to: '12341111116711',
            };
            expect(() => validateParamsExistence(requestBody)).to.throw('text is missing');
        });
    });

    describe('#validateParamsValue()', function () {
        it('should throw error as to is invalid, as it has less than 6 chars', function () {
            const requestBody = {
                from: '111111',
                to: '12', //invalid but not missing
                text: 'todays date and text',
            };
            expect(() => validateParamsValue(requestBody)).to.throw('to is invalid');
        });

        it('should throw error as from is invalid, as it has less than 6 chars', function () {
            const requestBody = {
                from: '12345678901234567890',
                to: '12111111111',
                text: 'todays date and text',
            };
            expect(() => validateParamsValue(requestBody)).to.throw('from is invalid');
        });

        it('should throw error as text is invalid, as it has less than 1 char', function () {
            const requestBody = {
                from: '111111',
                to: '1211111111', //invalid but not missing
                text: '',
            };
            expect(() => validateParamsValue(requestBody)).to.throw('text is invalid');
        });

        it('should return true when request body is valid', function () {
            const requestBody = {
                from: '111111',
                to: '1211111111', //invalid but not missing
                text: 'netwrok calls',
            };
            expect(validateParamsValue(requestBody)).to.be.true;
        });
    });
});

// Integration tests
const app = require('../server');
describe('Integration Tests', function () {
    let requester;
    before(function () {
        requester = chai.request(app).keepOpen();
        return requester;
    });

    after(function () {
        return app.cleanup().then(r => {
            return requester.close();
        })
    });

    describe('/outbound/sms', function () {
        it('send success', function () {
            const reqBody = {
                from: '4924195509198',
                to: '441224459571',
                text: 'ss'
            };
            return requester.post('/outbound/sms').
            auth('plivo1', '20S0KPNOIM').
            type('application/json').
            send(reqBody).
            then(responses => {
                const textJson = responses.body;
                expect(responses.status).to.be.equal(200);
                expect(textJson.error).to.be.equal('');
                expect(textJson.message).to.be.equal('outbound sms ok');
            });
        });

        it('authorization', function () {
            const reqBody = {
                from: '61871112902',
                to: '4924195509198',
                text: 'ss'
            };
            return requester.post('/outbound/sms').
            auth('plivo1', 'wrongpass').
            type('application/json').
            send(reqBody).
            then(responses => {
                expect(responses.status).to.be.equal(403);
            });
        });

        it('from param does not exist in user phones', function () {
            const reqBody = {
                from: '61871112902',
                to: '4924195509198',
                text: 'ss'
            };
            return requester.post('/outbound/sms').
            auth('plivo1', '20S0KPNOIM').
            type('application/json').
            send(reqBody).
            then(responses => {
                const textJson = responses.body;
                expect(responses.status).to.be.equal(400);
                expect(textJson.error).to.be.equal('from parameter not found');
                expect(textJson.message).to.be.equal('');
            });
        });
    });

    describe('/inbound/sms', function () {
        it('receive success', function () {
            const reqBody = {
                "from": "68728399482974",
                "to": "4924195509198",
                "text": "non spe"
            }
            return requester.post('/inbound/sms').
            auth('plivo1', '20S0KPNOIM').
            type('application/json').
            send(reqBody).
            then(responses => {
                const textJson = responses.body;
                expect(responses.status).to.be.equal(200);
                expect(textJson.error).to.be.equal('');
                expect(textJson.message).to.be.equal('inbound sms ok');
            });
        });

        it('authorization', function () {
            const reqBody = {
                "from": "68728399482974",
                "to": "4924195509198",
                "text": "non spe"
            }
            return requester.post('/inbound/sms').
            auth('wrong user', '20S0KPNOIM').
            type('application/json').
            send(reqBody).
            then(responses => {
                expect(responses.status).to.be.equal(403);
            });
        });

        it('missing parameter', function () {
            const reqBody = {
                "from": "68728399482974",
                "text": "non spe"
            }
            return requester.post('/inbound/sms').
            auth('plivo1', '20S0KPNOIM').
            type('application/json').
            send(reqBody).
            then(responses => {
                const textJson = responses.body;
                expect(responses.status).to.be.equal(400);
                expect(textJson.error).to.be.equal('to is missing');
                expect(textJson.message).to.be.equal('');
            });
        });

        it('invalid parameter', function () {
            const reqBody = {
                "from": "68728399482974123123817313", //larger than 16 chars
                "to": "4924195509198",
                "text": "non spe",
            }
            return requester.post('/inbound/sms').
            auth('plivo1', '20S0KPNOIM').
            type('application/json').
            send(reqBody).
            then(responses => {
                const textJson = responses.body;
                expect(responses.status).to.be.equal(400);
                expect(textJson.error).to.be.equal('from is invalid');
                expect(textJson.message).to.be.equal('');
            });
        });
    });

    describe('STOP flow', function () {
        it('block messages', function () {
            const reqBody = {
                "from": "61871112947",
                "to": "441224980089",
                "text": "STOP"
            }
            return requester.post('/inbound/sms').
            auth('plivo2', '54P2EOKQ47').
            type('application/json').
            send(reqBody).
            then(() => {
                const reqBody = {
                    "from": "61871112947",
                    "to": "441224980089",
                    "text": "test block",
                };
                return requester.post('/outbound/sms').
                auth('plivo4', 'YHWE3HDLPQ').
                type('application/json').
                send(reqBody).
                then(response => {
                    expect(response.status).to.be.equal(400);
                    expect(response.body.error).to.be.equal('sms from 61871112947 to 441224980089 blocked by STOP request');
                    expect(response.body.message).to.be.equal('');
                });
            });
        });
    });

    describe('Rogue endpoints', function () {
        it('disallow access to unknown endpoints', function() {
            const reqBody = {
                "from": "68728399482974123123817313", //larger than 16 chars
                "to": "4924195509198",
                "text": "non spe",
            }
            return requester.post('/rogueendpoint/sms').
            auth('plivo1', '20S0KPNOIM').
            type('application/json').
            send(reqBody).
            then(responses => {
                expect(responses.status).to.be.equal(405);
            });
        });
    });
});


// describe('/outbound/sms', function () {
//     const app = require('../app');
//     let requester;
//     before(function () {
//         requester = chai.request(app).keepOpen();
//         return requester;
//     });

//     after(function () {
//         // return app.close().then(r => {
//         //     return requester.close();
//         // });
//         return requester.close();
//     });

//     describe('#success', function () {
//         it('test happy flow for inbound sms:', function () {
//             //expect('shovik').to.be.equal('sovik')
//         });
//     });
// });