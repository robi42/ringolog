include('ringo/webapp/response');
var {Post, queryPosts, months} = require('./model');
var {createFeed} = require('./feed');

exports.index = function (req) {
    req.session.data.archiveYear = null;
    req.session.data.archiveMonth = null;
    return indexView(req);
};

exports.archive = function (req, year, month) {
    if (!/^2\d{3}$/.test(year) || /^2\d{3}$/.test(year) &&
            month && months.indexOf(month.toLowerCase()) == -1) {
        return notFoundResponse(req.path);
    }
    req.session.data.archiveYear = year;
    req.session.data.archiveMonth = month || null;
    return indexView(req);
};

function indexView(req) {
    req.session.data.postsRangeFrom = 0;
    req.session.data.postsRangeTo = 4;
    return skinResponse('skins/index.html', {
        authorized: req.session.data.authorized,
        posts: queryPosts(req.session.data).select()
    });
}

exports.main = function (req, id) {
    var requestedPost = Post.get(id);
    return !requestedPost ? notFoundResponse(req.path) :
            skinResponse('skins/main.html', {
                authorized: req.session.data.authorized,
                post: requestedPost
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
        req.session.data.postsRangeFrom += 5;
        req.session.data.postsRangeTo += 5;
        return skinResponse('skins/more.html', {
            authorized: req.session.data.authorized,
            posts: queryPosts(req.session.data).select()
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
