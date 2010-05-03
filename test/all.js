// Run w/, e.g.: ringo test/all

include('ringo/unittest');
var http = require('ringo/httpclient');

exports.testAuth = function () {
    http.get('http://localhost:8080/login', function (data, status) {
        assertMatch(/Unauthorized/, data);
        assertEqual(401, status);
    });
};

if (require.main == module.id) {
    require('ringo/webapp').main(module.directory);
    require('ringo/unittest').run(exports);
    require('ringo/shell').quit();
}
