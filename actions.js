include('ringo/webapp/response');
include('./model');

exports.index = function (req) {
    if (req.isPost && req.params.save) {
        new Post({body: req.params.body, created: Date.now()}).save();
        return skinResponse('skins/posts.html', {
            allPosts: Post.all().sort(function (a, b) a.created < b.created)
        });
    }
    return skinResponse('skins/index.html', {
        allPosts: Post.all().sort(function (a, b) a.created < b.created)
    });
};
