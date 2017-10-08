import PouchDB from 'pouchdb'
import Router from 'preact-router'
import { createHashHistory } from 'history'
import { Link } from 'preact-router/match'
import { h, render, Component } from 'preact'
import { name } from './package.json'

/**
 * NOTES SO FAR
 * - preact-router is bad??? i need a /#/ solution to make it work generically but i can't figure it out.
 */

const history = createHashHistory()
const db = new PouchDB(name)
const ddoc = {
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

/** COMPONENTS */

// TODO a Post component which EditPost and AddPost use

class AddPost extends Component {
  // TODO swap { these } for { these }
  render () {
    return (
      <div>
        <h1 class="title">Add a new entry</h1>
        <p class="subtitle">You can write your entry in <a href="https://daringfireball.net/projects/markdown/syntax">Markdown</a>.</p>
        <form id="edit-form">
          <input type="hidden" class="entry-id" value="{ _id }"></input>
          <input type="hidden" class="entry-rev" value="{ _rev }"></input>
          <input type="hidden" class="entry-created-at" value="{ created_at }"></input>
          <input type="hidden" class="entry-edited-at" value="{ edited_at }"></input>
          <div class="control">
            <textarea autofocus class="textarea entry-text" rows="20" placeholder="What's on your mind...?" value="{ text }"></textarea>
          </div>
          <ul>
            <li><input type="submit" class="button is-success is-fullwidth entry-ok" value="Save"></input></li>
            <li><input type="reset" class="button is-danger is-fullwidth entry-cancel" value="Cancel"></input></li>
          </ul>
        </form>
      </div>
    )
  }
}

class Archive extends Component {}
class EditPost extends Component {}

class Home extends Component {
  render () {
    db.query(name + '/entries', {
        include_docs: true
      })
      .then((response) => {
        // examine non-hack options
        if (response.rows.length > 1) {
          this.constructor.render = this.render = () => { return (
            <div>
              { responses.rows.map((row) => (
                <Post doc={doc} />
                )
              )}
            </div>
          )}
          this.forceUpdate()
        } else {
          Router.route('/welcome')
        }
      })
    return h('noscript')
  }
}

class Nav extends Component {
  render () {
    return (
      <aside class="menu">
        <p class="menu-label">
          <a href="#">{ name }</a>
        </p>
        <ul class="menu-list">
          <li><Link activeClassName="active" href="/add-post">New Post</Link></li>
          <li><Link activeClassName="active" href="/archive">Archive</Link></li>
          <li><Link activeClassName="active" href="/settings">Settings</Link></li>
        </ul>
      </aside>
    )
  }
}

class Search extends Component {}

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

class ShowPost extends Component {}


class Welcome extends Component {
  render () {
    return (
      <div>
        <h1 class="title">Hello, World!</h1>
        <p class="subtitle">This is a diary.</p>
        <div class="content">
          <p>
            ChaiseBlog uses <a href="https://pouchdb.com/">PouchDB</a> to store your data on your browser,
            so it never touches the network.
          </p>
          <p>
            Would you like to <Link href="/new">make a new entry?</Link>
            No one will be able to see it but you.
          </p>
          <p>
            You can export your data or set a backup strategy from the <Link href="/settings">settings</Link> page.
          </p>
        </div>
      </div>
    )
  }
}

/** MAIN */

class App {
  constructor () {
    this.el = document.getElementById('app')
    this.root = null
    this.html = (
      <div class="section">
        <div class="container">
          <div class="columns">
            <Nav class="column is-narrow" />
            <div class="column">
              <Router history={history}>
                <AddPost path="/add-post" />
                <Archive path="/archive/:query?" />
                <EditPost path="/post/:id/edit" />
                <Home path="/" />
                <Search path="/search/:query?" />
                <Settings path="/settings" />
                <ShowPost path="/post/:id" />
                <Welcome path="/welcome" />
                <Home default />
              </Router>
            </div>
          </div>
        </div>
      </div>
    )
  }

  start () {
    this.root = render(this.html, this.el, this.root)
  }
}

window.onload = function () {
  // insert ddoc
  db.put(ddoc)
    .catch((err) => {
      if (err.name === 'conflict') {
        console.info('[', name, '] The design document already exists. Its indexes are already built.')
      } else {
        throw err
      }
    })
    .then(() => {
      // start app
      console.info('[', name, '] Application starting...')
      var app = new App()
      app.start()
    })
}
