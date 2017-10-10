/*
MODELS
 */

import PouchDB from 'pouchdb'
import { name } from '../package.json'

const db = new PouchDB(name)

var ddoc = {
  _id: ['_design', name].join('/'),
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
              log('Design document loaded. Indexes building...')
            })
          })
        } else {
          log('The design document already exists. Its indexes are already built.')
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
