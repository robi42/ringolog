include('ringo/markdown');

export('markdown_filter');

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
