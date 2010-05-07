include('ringo/webapp/response');
include('./model');

exports.index = function (req) {
    if (req.session.data.authorized && req.isXhr && req.isPost &&
            req.params.save) {
        var newPost = new Post({body: req.params.body, created: new Date()});
        newPost.save();
        req.session.data.postsRangeFrom++;
        req.session.data.postsRangeTo++;
        return skinResponse('skins/post.html', {post: newPost});
    }
    req.session.data.postsRangeFrom = 0;
    req.session.data.postsRangeTo = 2;
    return skinResponse('skins/index.html', {
        authorized: req.session.data.authorized,
        posts: Post.query().range(req.session.data.postsRangeFrom,
                req.session.data.postsRangeTo).orderBy('created desc').select()
    });
};

exports.more = function (req) {
    if (req.isXhr) {
        req.session.data.postsRangeFrom += 3;
        req.session.data.postsRangeTo += 3;
        return skinResponse('skins/more.html', {
            posts: Post.query().range(req.session.data.postsRangeFrom,
                    req.session.data.postsRangeTo).orderBy('created desc').
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
