'use strict'

const express = require('express');

let router = express.Router();

router.use(express.json());
router.use(express.urlencoded({extended: false}));

let types = require('./api');

let patterns = ['/:type\::id\.:action', '/:type\.:action', '/:type\::id', '/:type'];

router.all(patterns, async (req, res, next) => {
    let {type, id, action} = req.params;

    console.log('REQUEST:', { type, id, action });

    type = type.toLowerCase();
    !types[type] && (type = 'auth');

    let object = new types[type](req.headers.authorization, id);

    !object[action] && (action = 'default');

    let executor = action ? object[action].bind(object) : object.default.bind(object);

    let params = Object.keys(req.body).length === 0 ? req.query : req.body;
    let result = await executor(params, req);

    let { token, auth, error } = object;

    res.json({ token, auth, error, ...result } || {}).end();
});

module.exports = router;