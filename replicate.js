var config = require('./config')
  , db = require('nano')(config.replication_db)

module.exports = function(){
  var done = this.async()
  db.insert({
    _id: "publish_chaiseblog"
  , source: config.admin.db
  , target: config['public'].db
  , filter: 'chaiseblog/published'
  , continuous: true
  }, function(err, body){
    if(err && !(err.status_code === 409)) {
      console.log(err)
      throw new Error(err)
    }
    done()
  })
}