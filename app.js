var couchapp = require('couchapp')
  , path = require('path')
  , fs = require('fs');

ddoc = {
    _id: '_design/chaiseblog'
  , rewrites: require('./rewrites.json')
  , views: {
    drafts: {
      map: fs.readFileSync('./views/drafts/map.js').toString()
    },
    published: {
      map: fs.readFileSync('./views/published/map.js').toString()
    }
  }
  , lists: {}
  , shows: {} 
}

couchapp.loadAttachments(ddoc, path.join(__dirname, '_attachments'));

module.exports = ddoc;