import createHashHistory from 'history/createHashHistory'
import Marked from 'marked'
import Router from 'preact-router'
import { db, ddoc, initDb } from './models'
import { h, render, component } from 'preact'
import { name } from './package.json'

/*
LOG
 */

const log = function (msg) {
  console.info('[', name, ']', msg)
}
