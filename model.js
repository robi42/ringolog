export('Post');
module.shared = true;
addToClasspath('./config');

var Post = require('./config').store.defineEntity('Post', {
    properties: {
        body: {type: 'text', nullable: false},
        created: {type: 'timestamp', nullable: false},
        modified: {type: 'timestamp'}
    }
});
