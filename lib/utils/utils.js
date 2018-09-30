const generateStopKey = (from, to) => `${process.env.NODE_ENV}:stop:${from}|${to}`;

const generateSmsSentKey = from => `${process.env.NODE_ENV}:sent:${from}`;

module.exports = {
    generateStopKey,
    generateSmsSentKey,
};