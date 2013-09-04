var couchapp = require('couchapp'),
    path = require('path');

ddoc = {
    _id: '_design/chaiseblog',
    rewrites: require('./rewrites.json'),
    views: {
      drafts: {
        map: function(doc){
          if(!doc.status){
            emit(doc.date, null);
          }
        }
      },
      published: {
        map: function(doc){
          if(doc.status){
            emit(doc.date, null);
          }
        }
      }
    },
    lists: {},
    shows: {}
};

couchapp.loadAttachments(ddoc, path.join(__dirname, '_attachments'));

module.exports = ddoc;