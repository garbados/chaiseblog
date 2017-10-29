import createHashHistory from 'history/createHashHistory'
import Marked from 'marked'
import Router from 'preact-router'
import { route } from 'preact-router'
import { h, render, Component } from 'preact'
import { Link } from 'preact-router/match'

import { db, ddoc, initDb } from './models'
import { name } from '../package.json'

/*
CONSTANTS
 */

const MAIN_EL = '#app'

/*
LOG
 */

const log = function (msg) {
  console.info('[', name, ']', msg)
}

/*
COMPONENTS
 */

class Nav extends Component {
  render ({ name }) {
    return (
      <div>
        <aside class="menu">
          <p class="menu-label">
            <a href="#">{ name }</a>
          </p>
          <ul class="menu-list">
            <li><a href="#/new-entry">New Entry</a></li>
            <li><a href="#/settings">Settings</a></li>
          </ul>
        </aside>
      </div>
    )
  }
}

class Entry extends Component {
  constructor (props) {
    super(props)
    if (props.editing) { this.setState({ editing: true }) }
    if (props._id) {
      db.get(props._id).then((doc) => {
        this.setState(doc)
      })
    } else if (props.doc) {
      this.setState(props.doc)
    }
  }

  onEdit () {
    return () => {
      this.setState({ editing: true })
    }
  }

  onCancel () {
    return () => {
      this.setState({ editing: false })
    }
  }

  onSubmit () {
    return (e) => {
      // prevent default form behavior (POSTing nowhere good)
      e.preventDefault()
      // set state from textarea
      this.setState({
        text: e.target.children[0].children[0].value
      })
      // save current state
      this.save()
    }
  }

  save () {
    // update timestamps
    this.setState({
      created_at: this.state.created_at || Date.now(),
      updated_at: (this.state.created_at ? Date.now() : undefined),
      text: this.state.text
    })
    // filter to specific attributes
    var doc = {
      created_at: this.state.created_at,
      updated_at: this.state.updated_at,
      text: this.state.text,
      type: 'entry'
    }
    // include attributes of non-new docs
    if (this.state._id) doc._id = this.state._id
    if (this.state._rev) doc._rev = this.state._rev
    // add to db
    var promise = (doc._id ? db.put(doc) : db.post(doc))
    return promise.then((result) => {
      // update rev to reflect db version
      this.setState({
        _rev: result.rev,
        editing: false
      })
      // change url to post permalink
      route(['/show', result.id].join('/'))
    })
    .catch((err) => {
      console.log('error', err)
    })
  }

  humanDate (ms) {
    var date = new Date(ms)
    return `${date.toDateString()} at ${date.toTimeString()}`
  }

  render ({ title, onDelete }, { _id, _rev, created_at, text, editing }) {
    // TODO use onDelete etc, format form+show to use similar templates
    return (
      <div>
        { title ? (
          <h1 class="title">{ title }</h1>
        ) : null}
        <article class="message entry">
          { editing ? (
            <form id="edit-form" onSubmit={ this.onSubmit() }>
              <div class="control">
                <textarea
                  autofocus
                  class="textarea entry-text"
                  rows="10"
                  placeholder="What's on your mind?"
                  value={ text }>
                </textarea>
              </div>
              <ul>
                <li><input type="submit" class="button is-success is-fullwidth" value="Save"></input></li>
              </ul>
            </form>
          ) : (
            <div>
              <div class="message-header">
                <p>{ this.humanDate(created_at) }</p>
                <span>
                  <button class="button is-small is-primary is-outlined" onClick={ this.onEdit() }>Edit</button>
                  <button class="button is-small is-danger is-outlined" onClick={ onDelete }>Delete</button>
                </span>
              </div>
              <div class="message-body">
                { text }
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
    var opts = props.query || {}
    opts.include_docs = true
    // TODO pagination
    db.query('queries/entries', opts)
      .then((result) => {
        var docs = result.rows.map((row) => {
          return row.doc
        })
        this.setState({
          docs: docs
        })
      })
  }

  onDelete (id, rev, index) {
    var confirm_text = 'Are you sure you want to delete this entry?'
    return () => {
      if (window.confirm(confirm_text)) {
        return db.remove(id, rev)
          .then(() => {
            // modifying the list forces a re-render
            // which resets every doc's "index" to
            // the most recent value
            this.state.docs.splice(index, 1)
            this.setState({
              docs: this.state.docs
            })
          })
      } else {
        
      }
    }
  }

  render ({ title }, state) {
    var entries = []
    if (this.state.docs && this.state.docs.length) {
      entries = this.state.docs.map((doc, index) => {
        return (
          <Entry doc={ doc } onDelete={ this.onDelete(doc._id, doc._rev, index) } />
        )
      })
      return (
        <div>
          { title ? ( <h1>{ title }</h1> ) : null }
          <div>{ entries }</div>
        </div>
      )
    } else {
      return (
        <Welcome />
      )
    }
  }
}

class Welcome extends Component {
  render (props, state) {
    return (
      <div>
        <h1 class="title">Hello, World!</h1>
        <p class="subtitle">This is a diary.</p>
        <div class="content">
          <p>
            It uses <a href="https://pouchdb.com/">PouchDB</a> to store your data on your browser,
            so it never touches the network.
          </p>
          <p>
            Would you like to <a href="#/new-entry">make a new entry?</a> No one will be able to see it but you.
          </p>
          <p>
            You can export your data or set a backup strategy from the <a href="#/settings">settings</a> page.
          </p>
        </div>
      </div>
    )
  }
}

class Home extends Component {
  constructor (props) {
    super(props)
    this.setState({
      hasEntries: undefined
    })
    db.query('queries/entries', { limit: 0 })
      .catch((err) => {
        log(err)
      })
      .then((result) => {
        this.setState({
          hasEntries: (result.total_rows > 0)
        })
      })
  }

  render (props, { hasEntries }) {
    if (hasEntries === undefined) { 
      return (
        <div></div>
      )
    } else if (hasEntries === false) {
      return (
        <Welcome />
      )
    } else {
      return (
        <Entries />
      )
    }
  }
}

class Settings extends Component {
  render () {
    return (
      <div>
        <h1 class="title">Settings</h1>
        <div class="section box">
          <h3 class="title">Backup</h3>
          <p class="subtitle">Backup your data by replicating to a <a href="https://couchdb.apache.org/">CouchDB</a> instance.</p>
          <p class="subtitle">Replicating with a database that already has a ChaiseBlog diary will import it automatically.</p>
          <form id="backup-form">
            <div class="field">
              <label class="label">CouchDB Instance</label>
              <div class="control">
                <input class="input" type="text" name="couchUrl" placeholder="{http,https}://$username:$password@host:port"></input>
              </div>
            </div>
            <input type="submit" class="button is-success backup-ok" value="Backup"></input>
          </form>
        </div>
        <div class="section box">
          <h3 class="title">Export</h3>
          <p class="subtitle">It's your data. Take it with you.</p>
          <form id="export-form">
            <div class="field">
              <div class="control">
                <label class="label">Format</label>
                <div class="select is-primary">
                  <select>
                    <option value="json">JSON</option>
                  </select>
                </div>
              </div>
            </div>
            <input type="submit" class="button is-success export-ok" value="Export"></input>
          </form>
        </div>
        <div class="section box">
          <h3 class="title">Import</h3>
          <p class="subtitle">Already used ChaiseBlog? Import your diary.</p>
          <form>
            <div class="field">
              <div class="file">
                <label class="file-label">
                  <input class="file-input" type="file" name="import"></input>
                  <span class="file-cta">
                    <span class="file-icon">
                      <i class="fa fa-upload"></i>
                    </span>
                    <span class="file-label">
                      Choose a file…
                    </span>
                  </span>
                </label>
              </div>
            </div>
            <input type="submit" class="button is-success import-ok" value="Import"></input>
          </form>
        </div>
      </div>
    )
  }
}

class App extends Component {
  render () {
    return (
      <section class="section">
        <div class="container">
          <div class="columns">
            <div class="column is-narrow">
              <Nav name={ name } />
            </div>
            <div class="column">
              <Router history={ createHashHistory() }>
                <Home default path=""/>
                <Entry path="show/:_id" title="View an entry" />
                <Entry editing title="Make a new entry" path="new-entry" />
                <Settings path="settings" />
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
  initDb().then(() => {
    render(<App />, document.body)
  })
}