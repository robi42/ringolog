export('markdown_filter', 'archive_macro');
include('ringo/markdown');
require('core/array');
var {render} = require('ringo/skin');
var {Post, cache, months} = require('./model');

function markdown_filter(content) {
    var markdown = new Markdown({
        openTag: function (tag, buffer) {
            buffer.append('<').append(tag);
            if (tag == 'pre') {
                buffer.append(' class="sh_javascript"');
            }
            buffer.append('>');
        }
    });
    return markdown.process(content);
}

function archive_macro() {
    var cached = cache.get('rl_archive_widget');
    if (cached) {
        return cached;
    }
    var years = Post.query().
            orderBy('-created').
            select().
            map(function (post) post.created.getFullYear()).
            unique();
    if (years.length) {
        var widget = render('skins/archive.html', {
            years: [{
                value: year,
                months: Post.query().
                        orderBy('-created').
                        greaterEquals('created', new Date(year, 0, 1)).
                        less('created', new Date(year + 1, 0, 1)).
                        select().
                        map(function (post) months[post.created.getMonth()]).
                        unique()
            } for each (year in years)]
        });
        cache.set('rl_archive_widget', 14 * 24 * 60 * 60, widget); // 2 weeks.
        return widget;
    }
}

Object.defineProperty(Array.prototype, 'unique', {
    value: function () {
        var set = new java.util.HashSet();
        for each (let item in this) {
            set.add(item);
        }
        return [item for each (item in Iterator(set))];
    }, writable: true
});
