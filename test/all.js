// Run w/, e.g.: ringo test/all

addToClasspath('./config');
include('ringo/unittest');
include('ringo/markdown');
var http = require('ringo/httpclient');
include(module.directory + '../app/model');
var {baseUrl} = require(module.directory + '../app/config');
const FOO = '**foo**';
const FOO_HTML = (new Markdown).process(FOO);
const BAR = '*bar*';

exports.testAuth = function () {
    http.get(baseUrl + 'login', function (data, status) {
        assertMatch(/Unauthorized/, data);
        assertEqual(401, status);
    });
};

exports.testModel = function () {
    var post = Post.create({body: FOO}); // Test creation helper.
    post = Post.get(1);
    assertTrue(post instanceof Post);
    assertEqual(FOO, post.body);
    assertEqual(FOO_HTML, post.markdown); // Test markdown helper.
    assertTrue(post.created instanceof Date);
    assertFalse(post.modified instanceof Date);
    post = Post.update({id: 1, body: BAR}); // Test updating helper.
    assertTrue(post instanceof Storable);
    post = Post.all()[0];
    assertNotNull(post);
    assertEqual(BAR, post.body);
    assertTrue(post.modified instanceof Date);
};

if (require.main == module.id) {
    require('ringo/webapp').main(module.directory + '../app');
    require('ringo/unittest').run(exports);
    require('ringo/shell').quit();
}
