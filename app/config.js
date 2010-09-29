exports.httpConfig = {
    staticDir: './static'
};

exports.urls = [
    ['^/([1-9]\\d*)', './actions', 'main'],
    ['^/', './actions']
];

exports.middleware = [
    require('ringo/middleware/basicauth').middleware({ // 'secret' ;)
        '/login': {admin: 'e5e9fa1ba31ecd1ae84f75caaa474f3a663f05f4'}
    }),
    require('ringo/middleware/gzip').middleware,
    require('ringo/middleware/etag').middleware,
    require('ringo/middleware/responselog').middleware,
    require('ringo/middleware/error').middleware,
    require('ringo/middleware/notfound').middleware
];

// the JSGI app
exports.app = require('ringo/webapp').handleRequest;

exports.extensions = ['websocket-extension'];

exports.macros = [
    './helpers',
    require('ringo/skin/macros'),
    require('ringo/skin/filters')
];

exports.baseUrl = 'http://localhost:8080/'; // Used by feeds and tests.

exports.authorName = 'Ringo User'; // Used by feeds.

exports.jars = [
    'jars/mysql-connector-java-5.1.12-bin.jar',
    'jars/memcached-2.5.jar',
    'jars/jdom-1.1.1.jar',
    'jars/rome-1.0.jar'
];

exports.store = require('ringo/storage/hibernate');
// Playing around with `ringo-sqlstore`.
// var {Store} = require('ringo/storage/sql/store');
// exports.store = new Store({
    // url: 'jdbc:h2:mem:test', // For testing.
    // driver: 'com.h2.Driver'
    // url: 'jdbc:mysql://localhost/ringolog_sqlstore', // For dev/production.
    // driver: 'com.mysql.jdbc.Driver',
    // username: 'ringo',
    // password: 'secret'
// });

exports.memcached = {host: 'localhost', port: 11211};

exports.charset = 'UTF-8';
exports.contentType = 'text/html';
