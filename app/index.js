var couchapp = require('couchapp');
var path = require('path');

ddoc = {
    _id: '_design/diary',
    rewrites: [{
        "from": "",
        "to": "index.html",
        "method": "GET",
        "query": {}
    },{
        "from": "/data",
        "to": "/../..",
        "query": {}
    },{
        "from": "/data/*",
        "to": "/../../*",
        "query": {}
    },{
        "from": "/*",
        "to": "/*",
        "method": "GET",
        "query": {}
    }],
    views: {
        all: {
            map: function (doc) { emit(doc.date, doc.status); }
        },
        drafts: {
            map: function (doc) { if (!doc.status) emit(doc.date, null); }
        },
        published: {
            map: function (doc) { if (doc.status) emit(doc.date, null); }
        }
    },
    filters: {
      published: function(doc, req){ return (doc.status || doc._deleted); }
    },
    lists: {},
    shows: {}
};

couchapp.loadAttachments(ddoc, path.join(__dirname, '_attachments'));

module.exports = ddoc;
