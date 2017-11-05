/* global emit */

module.exports = {
  _id: '_design/queries',
  views: {
    entries: {
      map: function (doc) {
        if ((doc.type === 'entry') && (!doc.deleted)) {
          emit(doc.created_at, null)
        }
      }.toString()
    },
    deleted: {
      map: function (doc) {
        if ((doc.type === 'entry') && (doc.deleted === true)) {
          emit(doc.created_at, null)
        }
      }.toString()
    },
    settings: {
      map: function (doc) {
        if (doc.type === 'config') {
          emit(doc._id, null)
        }
      }.toString()
    }
  }
}
