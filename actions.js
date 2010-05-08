include('ringo/webapp/response');
include('./model');
include('./feed');

exports.index = function (req, id) {
    if (id && id.match(/[1-9][0-9]*/)) {
        return skinResponse('skins/main.html', {post: Post.get(id)});
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
        var newPost = new Post({body: req.params.body, created: new Date()});
        newPost.save();
        req.session.data.postsRangeFrom++;
        req.session.data.postsRangeTo++;
        return skinResponse('skins/post.html', {post: newPost, ajax: true});
    }
    return redirectResponse('/');
};

exports.more = function (req) {
    if (req.isXhr) {
        req.session.data.postsRangeFrom += 3;
        req.session.data.postsRangeTo += 3;
        return skinResponse('skins/more.html', {
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
    type = /rss\.xml/i.test(type) ? 'rss_2.0' : 'atom_1.0';
    var res = new Response(createFeed(req, type));
    res.contentType = /rss\.xml/i.test(type) ?
            'application/rss+xml' : 'application/atom+xml';
    return res;
};
