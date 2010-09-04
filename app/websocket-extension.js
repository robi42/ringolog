var log = require('ringo/logging').getLogger(module.id),
    arrays = require('ringo/utils/arrays'),
    websocket = require('ringo/webapp/websocket'),
    members = [];

exports.serverStarted = function (server) {
    var context = server.getDefaultContext();
    websocket.addWebSocket(context, '/websocket', function (socket) {
        log.info('onopen: connecting member.');
        members.push(socket);

        socket.onmessage = function (msg) {
            log.info('onmessage: sending "{}".', msg);
            members.forEach(function (member) {
                try {
                    member.send(msg);
                } catch (error) {
                    log.error('error sending message.', error);
                }
            });
        };

        socket.onclose = function () {
            log.info('onclose: removing member.');
            arrays.remove(members, socket);
        };
    });
};
