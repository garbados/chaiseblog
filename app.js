var couchapp = require('couchapp')
  , path = require('path')
  ;

ddoc = {
    _id: '_design/chaiseblog'
  , rewrites: require('./rewrites.json')
  , views: couchapp.loadFiles('./views')
  , lists: {}
  , shows: {}
}

couchapp.loadAttachments(ddoc, path.join(__dirname, '_attachments'));

module.exports = ddoc;