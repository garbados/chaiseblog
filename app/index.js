/* eslint-disable no-unused-vars */
/* global emit */

import createHashHistory from 'history/createHashHistory'
import Markdown from 'preact-markdown'
import PouchDB from 'pouchdb'
import Router from 'preact-router'
import { h, render, Component } from 'preact'

import { name } from '../package.json'

/*
LOG
 */

const log = function (msg) {
  console.info('[', name, ']', msg)
}

/*
DATABASE (POUCHDB)
*/

const db = new PouchDB('diary')

var ddoc = {
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

function initDb (reset) {
  return db.put(ddoc)
    .catch((err) => {
      if (err.name === 'conflict') {
        if (reset) {
          return db.get(ddoc._id).then((doc) => {
            ddoc._rev = doc._rev
            return db.put(ddoc)
              .catch((err) => {
                log(err)
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

/*
COMPONENTS
*/

class Entry extends Component {
  constructor (props) {
    super(props)
    if (props.editing) this.toggleEdit()
  }

  destroy (doc, cb) {
    return () => {
      var promise
      if (doc.deleted) {
        // burn it
        promise = db.remove(doc)
      } else {
        // trash it
        doc.deleted = true
        promise = db.put(doc)
      }
      return promise
        .then((result) => { cb() })
        .catch((err) => { log(err) })
    }
  }

  restore (doc, cb) {
    return () => {
      if (doc.deleted) doc.deleted = false
      return db.put(doc)
        .then((result) => { cb() })
        .catch((err) => { log(err) })
    }
  }

  toggleEdit () {
    this.setState({ editing: !this.state.editing })
  }

  submit (doc, cb) {
    return (e) => {
      e.preventDefault()
      // update timestamps
      doc.text = e.target.elements[0].value
      doc.updated_at = (doc.created_at ? Date.now() : undefined)
      doc.created_at = doc.created_at || Date.now()
      if (doc.deleted) doc.deleted = false // restore entries on change
      if (!doc.type) doc.type = 'entry'
      // update and trigger reload of parent component
      var promise = doc._id ? db.put(doc) : db.post(doc)
      promise
        .then((result) => {
          this.setState({ editing: false })
          if (window.location.hash.indexOf('new-entry') > -1) {
            // go home in a really janky way
            window.location.hash = window.location.hash.slice(0, 2)
          }
          cb()
        })
        .catch((err) => { log(err) })
    }
  }

  getHumanDate (ms) {
    var date = new Date(ms)
    return date.toISOString()
  }

  render ({ onDelete, onSave, doc }, { editing }) {
    var toggleEdit = this.toggleEdit.bind(this)
    return (
      <div>
        <article class='entry'>
          { editing ? (
            <form id='edit-form' onSubmit={this.submit(doc, onSave)}>
              <div class='columns'>
                <div class='column'>
                  <div class='field'>
                    <div class='control'>
                      <textarea
                        autofocus
                        class='textarea entry-text'
                        rows='10'
                        placeholder='What is on your mind?'
                        value={doc.text}
                      />
                    </div>
                  </div>
                </div>
                <div class='column is-narrow'>
                  <div class='field'>
                    <p class='control'>
                      <input type='submit' class='button is-fullwidth is-success' value='Save' />
                    </p>
                  </div>
                  <div class='field'>
                    <p class='control'>
                      <button onClick={toggleEdit} class='button is-fullwidth is-danger'>Cancel</button>
                    </p>
                  </div>
                </div>
              </div>
            </form>
          ) : (
            <div class='columns'>
              <div class='column'>
                <div class='box'>
                  <div class='content'>
                    { Markdown(doc.text) }
                  </div>
                  <p><small><em>{ this.getHumanDate(doc.created_at) }</em></small></p>
                </div>
              </div>
              <div class='column is-narrow'>
                { doc.deleted ? (
                  <form>
                    <div class='field'>
                      <p class='control'>
                        <button class='button is-fullwidth is-info' onClick={toggleEdit}>Edit</button>
                      </p>
                    </div>
                    <div class='field'>
                      <p class='control'>
                        <button class='button is-fullwidth is-danger' onClick={this.destroy(doc, onDelete)}>Delete</button>
                      </p>
                    </div>
                    <div class='field'>
                      <p class='control'>
                        <button class='button is-fullwidth is-success' onClick={this.restore(doc, onSave)}>Restore</button>
                      </p>
                    </div>
                  </form>
                ) : (
                  <form>
                    <div class='field'>
                      <p class='control'>
                        <button class='button is-fullwidth is-info' onClick={toggleEdit}>Edit</button>
                      </p>
                    </div>
                    <div class='field'>
                      <p class='control'>
                        <button class='button is-fullwidth is-warning' onClick={this.destroy(doc, onDelete)}>Discard</button>
                      </p>
                    </div>
                  </form>
                )}
              </div>
            </div>
          )}
        </article>
      </div>
    )
  }
}

class Entries extends Component {
  constructor (props) {
    super(props)
    this.reload()
  }

  reload () {
    var opts = { include_docs: true, limit: 20 }
    if (this.state.startkey) opts.startkey = this.state.startkey
    return db.query(`queries/${this.props.view}`, opts).then((result) => {
      this.setState({
        docs: result.rows.map((row) => { return row.doc })
      })
    })
  }

  renderEntry (doc, editing) {
    var reload = this.reload.bind(this)
    if (editing) {
      return (
        <Entry editing doc={doc} onDelete={reload} onSave={reload} />
      )
    } else {
      return (
        <Entry doc={doc} onDelete={reload} onSave={reload} />
      )
    }
  }

  render ({ editing }, { docs }) {
    if (editing) {
      return this.renderEntry({}, editing)
    } else if (docs && docs.length > 0) {
      var entries = docs.map((doc) => {
        return this.renderEntry(doc)
      })
      return (
        <div>{ entries }</div>
      )
    } else {
      return (
        <div>
          <h1 class='title'>No entries.</h1>
          <h2 class='subtitle'>Why not <a href='#/new-entry'>compose one?</a></h2>
        </div>
      )
    }
  }
}

class Home extends Component {
  constructor (props) {
    super(props)
    this.setState({
      hasEntries: undefined
    })
    db.query('queries/entries', { limit: 0 })
      .then((result) => {
        this.setState({
          hasEntries: (result.total_rows > 0)
        })
      })
      .catch((err) => { log(err) })
  }

  render (props, { hasEntries }) {
    if (hasEntries === undefined) {
      return (
        <div />
      )
    } else if (hasEntries === false) {
      return (
        <div>
          <h1 class='title'>Hello, world!</h1>
          <p class='subtitle'>This is a diary.</p>
          <div class='content'>
            <p>
              It uses <a href='https://pouchdb.com/'>PouchDB</a> to store your data on your browser,
              so it never touches the network.
            </p>
            <p>
              Would you like to <a href='#/new-entry'>make a new entry?</a> No one will be able to see it but you.
            </p>
          </div>
        </div>
      )
    } else {
      return (
        <Entries view='entries' />
      )
    }
  }
}

class Nav extends Component {
  render () {
    return (
      <aside class='menu'>
        <p class='menu-label'>
          { name }
        </p>
        <ul class='menu-list'>
          <li><a href='#/'>Home</a></li>
          <li><a href='#/new-entry'>New Entry</a></li>
          <li><a href='#/deleted'>Discarded Entries</a></li>
        </ul>
      </aside>
    )
  }
}

class App extends Component {
  render () {
    return (
      <section class='section'>
        <div class='container'>
          <div class='columns'>
            <div class='column is-narrow'>
              <Nav />
            </div>
            <div class='column'>
              <Router history={createHashHistory()}>
                <Home default path='' />
                <Entries view='deleted' path='deleted' />
                <Entries view='entries' path='show/:_id' />
                <Entries view='entries' editing path='new-entry' />
              </Router>
            </div>
          </div>
        </div>
      </section>
    )
  }
}

/*
MAIN
*/

window.onload = function () {
  log('App starting...')
  initDb(true).then(() => {
    render(<App />, document.body)
  })
}
