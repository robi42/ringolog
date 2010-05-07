export('Post');
module.shared = true;
addToClasspath('./config');

var Post = require('./config').store.defineEntity('Post', {
    properties: {
        body: {type: 'text'},
        created: {type: 'timestamp'}
    }
});
