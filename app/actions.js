var {Response} = require('ringo/webapp/response');
var {Post, queryPosts, months} = require('./model');
var {createFeed} = require('./feed');

exports.index = function (req) {
    req.session.data.archiveYear = null;
    req.session.data.archiveMonth = null;
    return indexView(req);
};

exports.archive = function (req, year, month) {
    if (!/^2\d{3}$/.test(year) || /^2\d{3}$/.test(year) &&
            month && months.indexOf(month.toLowerCase()) === -1) {
        return Response.notFound(req.path);
    }
    req.session.data.archiveYear = year;
    req.session.data.archiveMonth = month || null;
    return indexView(req);
};

var indexView = function (req) {
    req.session.data.postsRangeFrom = 0;
    req.session.data.postsRangeTo = 4;
    return Response.skin(module.resolve('skins/index.html'), {
        authorized: req.session.data.authorized,
        posts: queryPosts(req.session.data).select()
    });
};

exports.main = function (req, id) {
    var requestedPost = Post.get(id);
    return !requestedPost ? Response.notFound(req.path) :
            Response.skin(module.resolve('skins/main.html'), {
                authorized: req.session.data.authorized,
                post: requestedPost
    });
};

exports.create = {
    POST: function (req) {
        if (req.session.data.authorized && req.isXhr) {
            var newPost = Post.create({body: req.params.body});
            req.session.data.postsRangeFrom++;
            req.session.data.postsRangeTo++;
            return Response.skin(module.resolve('skins/post.html'), {
                authorized: req.session.data.authorized,
                post: newPost
            });
        }
        return Response.redirect('/');
    }
};

exports.update = {
    POST: function (req) {
        if (req.session.data.authorized && req.isXhr) {
            var updatedPost = Post.update({
                id: req.params.id,
                body: req.params.body
            });
            return Response.skin(module.resolve('skins/post.html'), {
                post: updatedPost
            });
        }
        return Response.redirect('/');
    }
};

exports.more = function (req) {
    if (req.isXhr) {
        req.session.data.postsRangeFrom += 5;
        req.session.data.postsRangeTo += 5;
        return Response.skin(module.resolve('skins/more.html'), {
            authorized: req.session.data.authorized,
            posts: queryPosts(req.session.data).select()
        });
    }
    return Response.redirect('/');
};

exports.login = function (req) {
    req.session.data.authorized = true;
    return Response.redirect('/');
};

exports.logout = function (req) {
    if (req.session.data.authorized) {
        req.session.data.authorized = false;
    }
    return Response.redirect('/');
};

exports.feed = function (req, type) {
    var isRss = /^rss$/.test(type),
        res = new Response(createFeed(isRss ? 'rss_2.0' : 'atom_1.0'));
    res.contentType = isRss ? 'application/rss+xml' : 'application/atom+xml';
    return res;
};
