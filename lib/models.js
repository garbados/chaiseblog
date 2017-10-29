/*
MODELS
 */

import PouchDB from 'pouchdb'

const db = new PouchDB('diary')

var ddoc = {
  _id: '_design/queries',
  views: {
    entries: {
      map: function (doc) {
        if (doc.type === 'entry') {
          emit(doc._id, null)
        }
      }.toString()
    }
  }
}

function initDb (reset) {
  return db.put(ddoc)
    .catch((err) => {
      if (err.name === 'conflict') {
        if (reset) {
          return db.get(ddoc._id).then((doc) => {
            ddoc._rev = doc._rev
            return db.put(ddoc).then(() => {
            })
          })
        } else {
          return Promise.resolve(true)
        }
      } else {
        return Promise.reject(err)
      }
    })
}

exports.db = db
exports.ddoc = ddoc
exports.initDb = initDb
