exports.httpConfig = {
    staticDir: 'static'
};

exports.urls = [
    ['/', 'actions']
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

exports.store = require('ringo/storage/hibernate');

exports.charset = 'UTF-8';
exports.contentType = 'text/html';
