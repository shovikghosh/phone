const bookshelf = require('./bookshelf');

const Account = bookshelf.Model.extend({
    tableName: 'account',
    phones: function () {
        return this.hasMany(Phone, 'account_id', 'id')
    }
});

const Phone = bookshelf.Model.extend({
    tableName: 'phone_number',
    account: function () {
        return this.belongsTo(Account, 'account_id', 'id')
    },
});

// Account.where({
//     'username': 'plivo1',
//     'auth_id': '20S0KPNOIM'
// }).fetch({
//     withRelated: ['phones']
// }).then(r => {
//     console.log(r.toJSON());
// });

// Phone.where('number', '4924195509198').fetch({
// withRelated: ['account']
// }).
// then(r => {
//     console.log(r);
// })

module.exports = {
    Phone,
    Account,
}