include('ringo/webapp/response');
include('./model');

exports.index = function (req) {
    if (req.isXhr && req.isPost && req.params.save) {
        var newPost = new Post({body: req.params.body, created: Date.now()});
        newPost.save();
        return skinResponse('skins/post.html', {post: newPost});
    }
    return skinResponse('skins/index.html', {
        authorized: req.session.data.authorized,
        allPosts: Post.all().sort(function (a, b) a.created < b.created)
    });
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
