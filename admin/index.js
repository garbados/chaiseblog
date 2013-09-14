var couchapp = require('couchapp')
  , path = require('path')

ddoc = {
    _id: '_design/chaise-admin',
    rewrites: [{
        "from": "",
        "to": "index.html",
        "method": "GET",
        "query": {}
    },{
        "from": "/chaise-admin",
        "to": "/../../",
        "query": {} 
    },{
        "from": "/chaise-admin/*",
        "to": "/../../*",
        "query": {} 
    },{
        "from": "/*",
        "to": "/*",
        "method": "GET",
        "query": {}
    }],
    views: couchapp.loadFiles(path.join(__dirname, '..', 'views')),
    filters: {
      published: function(doc, req){ return doc.status }
    },
    lists: {},
    shows: {}
}

couchapp.loadAttachments(ddoc, path.join(__dirname, '_attachments'))

module.exports = ddoc