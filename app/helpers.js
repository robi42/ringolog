export('markdown_filter', 'archive_macro');
include('ringo/markdown');
require('core/array');
var {render} = require('ringo/skin');
var {Post, months} = require('./model');

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
    var years = Post.query().
            orderBy('created desc').
            select().
            map(function (post) post.created.getFullYear()).
            unique();
    if (years.length) {
        return render('skins/archive.html', {
            years: [{
                value: year,
                months: Post.query().
                        orderBy('created desc').
                        greaterEquals('created', new Date(year, 0, 1)).
                        less('created', new Date(year + 1, 0, 1)).
                        select().
                        map(function (post) months[post.created.getMonth()]).
                        unique()
            } for each (year in years)]
        });
    }
}

Object.defineProperty(Array.prototype, 'unique', {
    value: function () {
        var set = new java.util.HashSet();
        for each (let item in this) {
            set.add(item);
        }
        return [item for each (item in set.toArray())];
    }, writable: true
});
