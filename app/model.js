export('Post', 'queryPosts', 'cache', 'months');
addToClasspath('./config');
include('ringo/markdown');
var {memcached} = require('./config');

var cache = cache || new net.spy.memcached.MemcachedClient(
        new java.net.InetSocketAddress(memcached.host, memcached.port));

var months = [
    'january', 'february', 'march', 'april', 'may', 'june', 'july',
    'august', 'september', 'october', 'november', 'december'
];

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
    get: function () (new Markdown).process(this.body),
    configurable: true
});

function queryPosts(criteria) {
    var query = Post.query().
            orderBy('-created').
            range(criteria.postsRangeFrom, criteria.postsRangeTo);
    if (criteria.archiveMonth) {
        var month = criteria.archiveMonth.toLowerCase();
        return query.
                greaterEquals('created', new Date(criteria.archiveYear,
                        months.indexOf(month), 1)).
                less('created', new Date(criteria.archiveYear,
                        months.indexOf(month) + 1, 1));
    }
    if (criteria.archiveYear) {
        return query.
                greaterEquals('created', new Date(criteria.archiveYear, 0, 1)).
                less('created', new Date(criteria.archiveYear + 1, 0, 1));
    }
    return query;
}
