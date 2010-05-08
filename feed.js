var {Post} = require('./model');
var {baseUrl} = require('./config');
var {Markdown} = require('ringo/markdown');
var {SyndFeedImpl, SyndEntryImpl, SyndContentImpl} =
        com.sun.syndication.feed.synd;
var {SyndFeedOutput} = com.sun.syndication.io;

exports.createFeed = function (type) {
    var posts = Post.query().limit(5).orderBy('created desc').select();
    var output, entryContent, entry,
        entries = new java.util.ArrayList(),
        feed = new SyndFeedImpl();
    feed.feedType = type;
    feed.title = 'Ringolog Posts';
    feed.link = baseUrl;
    feed.description = 'Powered by RingoJS, Hibernate and ROME.';
    for each (let post in posts) {
       entry = new SyndEntryImpl();
       entry.title = 'Post #' + post._id;
       entry.link = baseUrl + post._id;
       entry.publishedDate = new java.util.Date(post.created.getTime());
       entryContent = new SyndContentImpl();
       entryContent.type = 'text/html';
       entryContent.value = new Markdown().process(post.body);
       entry.description = entryContent;
       entries.add(entry);
    }
    feed.entries = entries;
    output = new SyndFeedOutput();
    return output.outputString(feed);
};
