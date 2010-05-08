require('core/string');
var base64 = require('ringo/base64');
var {auth} = require('./config');

module.shared = true;

exports.middleware = function (app) {
    return function (env) {
        if (auth[env.PATH_INFO.replace(/^\//, '').replace(/\/$/, '')]) {
            var toAuth = // Determine path to authorize with credentials.
                    auth[env.PATH_INFO.replace(/^\//, '').replace(/\/$/, '')];
            if (env.HTTP_AUTHORIZATION) { // Extract credentials from HTTP.
                var credentials = base64.decode(env.HTTP_AUTHORIZATION.
                        replace(/Basic /, '')).split(':');
                if (credentials[1].digest('sha1') === toAuth[credentials[0]]) {
                    return app(env); // Authorization.
                }
            }
            var msg = '401 Unauthorized';
            return { // Access denied.
                status: 401,
                headers: {
                    'Content-Type': 'text/html',
                    'WWW-Authenticate': 'Basic realm="Secure Area"'
                },
                body: [
                    '<html><head><title>', msg, '</title></head>',
                    '<body><h1>', msg, '</h1>',
                    '</body></html>'
                ]
            };
        }
        return app(env);
    }
};
