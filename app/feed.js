var {Post} = require('./model');
var {baseUrl, authorName} = require('./config');
var {SyndFeedImpl, SyndEntryImpl, SyndContentImpl} =
        com.sun.syndication.feed.synd;
var {SyndFeedOutput} = com.sun.syndication.io;

exports.createFeed = function (type) {
    var posts = Post.query().orderBy('created desc').limit(7).select();
    var entry, entryContent,
        entries = new java.util.ArrayList(),
        feed = new SyndFeedImpl();
    feed.feedType = type;
    feed.title = 'Ringolog Posts';
    feed.link = baseUrl;
    feed.description = 'Powered by RingoJS';
    feed.author = authorName;
    for each (let post in posts) {
       entry = new SyndEntryImpl();
       entry.title = 'Post #' + post._id;
       entry.link = baseUrl + post._id;
       entry.author = authorName;
       entry.publishedDate = new java.util.Date(post.created.getTime());
       entryContent = new SyndContentImpl();
       entryContent.type = 'text/html';
       entryContent.value = post.markdown;
       entry.description = entryContent;
       entries.add(entry);
    }
    feed.entries = entries;
    return (new SyndFeedOutput).outputString(feed);
};
