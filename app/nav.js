import { name } from '../package.json'
import { h, Component } from 'preact'

export default class Nav extends Component {
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
