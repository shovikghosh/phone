require('mocha');
const chai = require('chai');
chai.should();

const {
    generateStopKey,
    generateSmsSentKey,
} = require('../../lib/utils/utils');

describe('utils.js', function () {
    describe('#generateStopKey()', function () {
        it('should return concatenated vals for redis key', function () {
            const from = '9912112211';
            const to = '8812882243';
            const key = generateStopKey(from, to);
            key.should.equal('stop:9912112211|8812882243');
        });
    });
    describe('#generateSmsSentKey()', function () {
        it('should return sent key redis key', function () {
            const from = '99121122111';
            const key = generateSmsSentKey(from);
            key.should.equal('sent:99121122111');
        });
    });
});