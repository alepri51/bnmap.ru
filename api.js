'use strict'

const { Unknown } = require('./api/base_api');
const { SignIn, SignOut, SignUp } = require('./api/auth_api');
const { NewsLayout,News, Payment, Wallet, Donate, Order, Structure } = require('./api/project/project_api');

let classes = {
    SignIn,
    SignUp,
    SignOut,
    Unknown,
    NewsLayout,
    News, //AS WIDGET & DIALOG
    Payment,
    Wallet,
    Donate,
    Order,
    Structure
}

module.exports = Object.entries(classes).reduce((memo, item) => {
    memo[item[0].toLowerCase()] = item[1];
    return memo;
}, {});
