require('core/string');
var base64 = require('ringo/base64');
var {auth} = require('./config');

module.shared = true;

exports.middleware = function (app) {
    return function (env) {
        if (auth[env.PATH_INFO.replace(/\//g, '')]) {
            var msg = '401 Unauthorized';
            if (env.HTTP_AUTHORIZATION) {
                var credentials = base64.decode(env.HTTP_AUTHORIZATION.
                        replace(/Basic /, '')).split(':');
                if (credentials[1].digest('sha1') === auth[env.PATH_INFO.
                        replace(/\//g, '')][credentials[0]]) {
                    return app(env);
                }
            }
            return {
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
