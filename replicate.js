var config = require('./config')
  , db = require('nano')(config.replication_db)

module.exports = function(){
  db.insert({
    source: config['public'].db
  , target: config.admin.db
  , filter: 'chaiseblog/published'
  , continuous: true
  }, function(err, body){
    console.log(arguments)
  })
}