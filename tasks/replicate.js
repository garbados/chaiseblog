var nano = require('nano');

function Replicator (config) {
  var db = nano(config.db);

  return function (done) {
    db.insert({
      _id: "publish_chaiseblog",
      source: config.admin,
      target: config.public,
      filter: 'chaise-admin/published',
      continuous: true,
      create_target: true
    }, function(err, body){
      if(err){
        if (err.status_code === 409) {
          console.log('Replication already in progress.');
        } else {
          throw new Error([err.status_code, err]);
        }
      }
      done();
    });
  };
}

module.exports = function (grunt) {
  grunt.registerMultiTask('replication', 'Arrange replication of published posts to public site.', function(){
    var done = this.async();
    Replicator(this.data)(done);
  });
};
