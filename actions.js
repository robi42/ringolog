include('ringo/webapp/response');
include('./model');

exports.index = function (req) {
    if (req.isPost && req.params.save) {
        var newPost = new Post({body: req.params.body, created: Date.now()});
        newPost.save();
        return skinResponse('skins/post.html', {post: newPost});
    }
    return skinResponse('skins/index.html', {
        allPosts: Post.all().sort(function (a, b) a.created < b.created)
    });
};
