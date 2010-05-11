exports.httpConfig = {
    staticDir: 'static'
};

exports.urls = [
    ['/', './actions'],
    ['/(.*)', './actions', 'main']
];

exports.middleware = [
    'auth',
    'ringo/middleware/etag',
    'ringo/middleware/responselog',
    'ringo/middleware/error',
    'ringo/middleware/notfound',
    // 'ringo/middleware/profiler'
];

exports.app = require('ringo/webapp').handleRequest;

exports.macros = [
    './helpers',
    'ringo/skin/macros',
    'ringo/skin/filters'
];

exports.auth = {
    login: {admin: 'e5e9fa1ba31ecd1ae84f75caaa474f3a663f05f4'} // 'secret' ;)
};

exports.baseUrl = 'http://localhost:8080/'; // Used by feeds and tests.

exports.jars = [
    'jars/mysql-connector-java-5.1.12-bin.jar',
    'jars/jdom-1.1.1.jar',
    'jars/rome-1.0.jar'
];

exports.store = require('ringo/storage/hibernate');

exports.charset = 'UTF-8';
exports.contentType = 'text/html';
