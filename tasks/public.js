var nano = require('nano');

function MakePublic (config) {
  var db = nano(config.db);

  return function (done) {
    db.get('_security', function (err, body) {
      body.nobody = body.nobody || {};
      body.nobody.roles = ['_reader'];
      body.cloudant = body.cloudant || {};
      if (body.cloudant.nobody) {
        body.cloudant.nobody.push('_reader');
      } else {
        body.cloudant.nobody = ['_reader'];
      }
      db.insert(body, '_security', function (err, body) {
        if (!err) {
          console.log(body);
          done(); 
        } else {
          console.log(arguments);
          throw new Error(err);
        }
      });
    });
  };
}

module.exports = function (grunt) {
  grunt.registerMultiTask('make_public', 'Ensure that the public site is world-readable.', function(){
    var done = this.async();
    MakePublic(this.data)(done);
  });
};