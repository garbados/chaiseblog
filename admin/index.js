var couchapp = require('couchapp')
  , path = require('path')

ddoc = {
    _id: '_design/chaiseblog'
  , rewrites: require('../rewrites.json')
  , views: couchapp.loadFiles(path.join(__dirname, '..', 'views'))
  , filters: {
      published: function(doc, req){ return doc.status }
    }
  , lists: {}
  , shows: {}
}

couchapp.loadAttachments(ddoc, path.join(__dirname, '_attachments'))

module.exports = ddoc