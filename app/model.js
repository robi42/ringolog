export('Post');
module.shared = true;
addToClasspath('./config');
include('ringo/markdown');

var Post = require('./config').store.defineEntity('Post', {
    properties: {
        body: {type: 'text', nullable: false},
        created: {type: 'timestamp', nullable: false},
        modified: {type: 'timestamp'}
    }
});

Post.create = function (data) {
    var post = new Post({
        body: data.body,
        created: new Date()
    });
    post.save();
    return post;
};

Post.update = function (data) {
    var post = Post.get(data.id);
    post.body = data.body;
    post.modified = new Date();
    post.save();
    return post;
};

Object.defineProperty(Post.prototype, 'markdown', {
    get: function () (new Markdown).process(this.body)
});
