// Run w/, e.g.: ringo test/all

addToClasspath('./config');
var assert = require('assert'),
    http = require('ringo/httpclient');
var {Markdown} = require('ringo/markdown');
var {Post} = require(module.resolve('../app/model'));
var {baseUrl} = require(module.resolve('../app/config'));
const LOGIN_URL = baseUrl + 'login',
    FOO = '**foo**',
    FOO_HTML = (new Markdown).process(FOO),
    BAR = '*bar*',
    BAR_HTML = (new Markdown).process(BAR);

exports.testAuth = function () {
    var res = http.get(LOGIN_URL);
    assert.matches(res.content, /Unauthorized/);
    assert.strictEqual(401, res.status);
    res = http.request({
        url: LOGIN_URL,
        username: 'admin',
        password: 'secret'
    });
    assert.matches(res.content, /See other/);
    assert.strictEqual(303, res.status);
};

exports.testModel = function () {
    var post = Post.create({body: FOO}); // Test creation helper.
    post = Post.get(1);
    assert.isTrue(post instanceof Post);
    assert.strictEqual(FOO, post.body);
    assert.strictEqual(FOO_HTML, post.markdown); // Test markdown helper.
    assert.isTrue(post.created instanceof Date);
    assert.isFalse(post.modified instanceof Date);
    post = Post.update({id: 1, body: BAR}); // Test updating helper.
    assert.isTrue(post instanceof Storable);
    post = Post.all()[0];
    assert.isNotNull(post);
    assert.strictEqual(BAR, post.body);
    assert.strictEqual(BAR_HTML, post.markdown);
    assert.isTrue(post.modified instanceof Date);
};

if (require.main == module) {
    require('ringo/webapp').main(module.resolve('../app'));
    require('test').run(exports);
    system.exit(0);
}
