var couchapp = require('couchapp')
  , path = require('path')

ddoc = {
    _id: '_design/chaise-public',
    rewrites: [{
        "from": "",
        "to": "index.html",
        "method": "GET",
        "query": {}
    },{
        "from": "/chaise-public",
        "to": "/../../",
        "query": {} 
    },{
        "from": "/chaise-public/*",
        "to": "/../../*",
        "query": {} 
    },{
        "from": "/*",
        "to": "/*",
        "method": "GET",
        "query": {}
    }],
    views: {
      published: couchapp.loadFiles(path.join(__dirname, '..', 'views', 'published'))
    },
    lists: {},
    shows: {}
}

couchapp.loadAttachments(ddoc, path.join(__dirname, '_attachments'))

module.exports = ddoc
