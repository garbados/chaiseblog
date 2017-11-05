/* eslint-disable no-unused-vars */
/* global emit */

import createHashHistory from 'history/createHashHistory'
import PouchDB from 'pouchdb'
import Router from 'preact-router'
import { h, render, Component } from 'preact'

import { name } from '../package.json'

import db from './db'
import ddoc from './ddoc'
import log from './log'

import Entries from './entries'
import Nav from './nav'

/*
COMPONENTS
*/

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
          <h1 class='title'>Hello, World!</h1>
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
  // INITIALIZE DATABASE
  // or, anyway, ensure it's initialized
  db.put(ddoc)
    .catch((err) => {
      if (err.name === 'conflict') {
        return Promise.resolve(true)
      } else {
        return Promise.reject(err)
      }
    })
    .then(() => {
      render(<App />, document.body)
    })
}
