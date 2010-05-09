include('ringo/webapp/response');
var {Post} = require('./model');
var {createFeed} = require('./feed');

exports.index = function (req, id) {
    if (id && /^[1-9][0-9]*$/.test(id)) {
        return skinResponse('skins/main.html', {
            authorized: req.session.data.authorized,
            post: Post.get(id)
        });
    }
    req.session.data.postsRangeFrom = 0;
    req.session.data.postsRangeTo = 2;
    return skinResponse('skins/index.html', {
        authorized: req.session.data.authorized,
        posts: Post.query().
                orderBy('created desc').
                range(req.session.data.postsRangeFrom,
                        req.session.data.postsRangeTo).
                select()
    });
};

exports.create = function (req) {
    if (req.session.data.authorized && req.isXhr && req.isPost) {
        var newPost = Post.create({body: req.params.body});
        req.session.data.postsRangeFrom++;
        req.session.data.postsRangeTo++;
        return skinResponse('skins/post.html', {
            authorized: req.session.data.authorized,
            post: newPost
        });
    }
    return redirectResponse('/');
};

exports.update = function (req) {
    if (req.session.data.authorized && req.isXhr && req.isPost) {
        var updatedPost = Post.update({
            id: req.params.id,
            body: req.params.body
        });
        return skinResponse('skins/post.html', {post: updatedPost});
    }
    return redirectResponse('/');
};

exports.more = function (req) {
    if (req.isXhr) {
        req.session.data.postsRangeFrom += 3;
        req.session.data.postsRangeTo += 3;
        return skinResponse('skins/more.html', {
            authorized: req.session.data.authorized,
            posts: Post.query().
                    orderBy('created desc').
                    range(req.session.data.postsRangeFrom,
                            req.session.data.postsRangeTo).
                    select()
        });
    }
    return redirectResponse('/');
};

exports.login = function (req) {
    req.session.data.authorized = true;
    return redirectResponse('/');
};

exports.logout = function (req) {
    if (req.session.data.authorized) {
        req.session.data.authorized = false;
    }
    return redirectResponse('/');
};

exports.feed = function (req, type) {
    type = /^rss$/.test(type) ? 'rss_2.0' : 'atom_1.0';
    var res = new Response(createFeed(type));
    res.contentType = /^rss$/.test(type) ?
            'application/rss+xml' : 'application/atom+xml';
    return res;
};
