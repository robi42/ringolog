export('createFeed');
include('./model');
var {Markdown} = require('ringo/markdown');
var {SyndFeedImpl, SyndEntryImpl, SyndContentImpl} =
        com.sun.syndication.feed.synd;
var {SyndFeedOutput} = com.sun.syndication.io;

function createFeed(req, feedType) {
    var baseUrl = // Base URL to be used for links.
            'http://' + req.env.SERVER_NAME + ':' + req.env.SERVER_PORT + '/';
    var posts = Post.query().limit(5).orderBy('created desc').select();
    var output, entryDescription, entry,
        entries = new java.util.ArrayList(),
        feed = new SyndFeedImpl();
    feed.feedType = feedType;
    feed.title = 'Ringolog Posts';
    feed.link = baseUrl;
    feed.description = 'Powered by RingoJS, Hibernate and ROME.';
    for each (let post in posts) {
       entry = new SyndEntryImpl();
       entry.title = 'Post #' + post._id;
       entry.link = baseUrl + post._id;
       entry.publishedDate = new java.util.Date(post.created.getTime());
       entryDescription = new SyndContentImpl();
       entryDescription.type = 'text/html';
       entryDescription.value = new Markdown().process(post.body);
       entry.description = entryDescription;
       entries.add(entry);
    }
    feed.setEntries(entries);
    output = new SyndFeedOutput();
    return output.outputString(feed);
}
