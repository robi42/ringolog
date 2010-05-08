// Run w/, e.g.: ringo test/all

include('ringo/unittest');
var http = require('ringo/httpclient');
var {baseUrl} = require('../app/config');

exports.testAuth = function () {
    http.get(baseUrl + 'login', function (data, status) {
        assertMatch(/Unauthorized/, data);
        assertEqual(401, status);
    });
};

if (require.main == module.id) {
    require('ringo/webapp').main(module.directory + '../app');
    require('ringo/unittest').run(exports);
    require('ringo/shell').quit();
}
