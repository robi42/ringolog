exports.httpConfig = {
    staticDir: 'static'
};

exports.urls = [
    ['/', 'actions'],
];

exports.middleware = [
    'ringo/middleware/basicauth',
    'ringo/middleware/etag',
    'ringo/middleware/responselog',
    'ringo/middleware/error',
    'ringo/middleware/notfound',
    // 'ringo/middleware/profiler'
];

exports.app = require('ringo/webapp').handleRequest;

exports.macros = [
    'ringo/skin/macros',
    'ringo/skin/filters'
];

exports.auth = {
    login: {admin: 'e5e9fa1ba31ecd1ae84f75caaa474f3a663f05f4'} // 'secret' ;)
};

var {Store} = require('ringo/storage/berkeleystore');
exports.store = new Store('db');

exports.charset = 'UTF-8';
exports.contentType = 'text/html';
