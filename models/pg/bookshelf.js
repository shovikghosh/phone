const config = require('config');
const knex = require('knex')(config.get('DB'));
const bookshelf = require('bookshelf')(knex);

//  setTimeout(() => knex.destroy(), 3000);

bookshelf.closeConn = () => {
    return knex.destroy();
}

module.exports = bookshelf;