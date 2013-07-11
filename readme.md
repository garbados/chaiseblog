# Chaise Blog

A simple CouchApp for blogging privately, built on [Angular.js](http://angularjs.org/) and [CouchDB](http://couchdb.apache.org/).

![Chaise Blog](http://eggchair.maxthayer.org/img/1373405131_couch-therapy.jpg)

For those thoughts you want to reflect on alone, lay back on the chaise and relax. Or check out the [demo](http://chaisedemo.maxthayer.org/)!

## Install

Chaise depends on...

* [node.js][nodejs]
* [grunt][grunt]

You'll need those two on your computer. Once you do, run this:
	
	# get the repo
	git clone git@github.com:garbados/chaiseblog.git
	cd chaiseblog
	# install dependencies
	npm install
	# compile JavaScript, CSS, and Jade to our couchapp
	grunt

Your chaise blog should now live at `http://localhost:5984/chaiseblog/_design/chaiseblog/_rewrite`. You can use [virtual hosts](http://couchdb.readthedocs.org/en/latest/configuring.html?highlight=virtual#virtual-hosts) to make that a prettier URL.

## Configuration

Chaise uses `config.json` to store settings, such as...

* `jade`: Template variables, like the blog's title.
* `couchapp`: URL for the remote CouchDB, and path to a node.couchapp settings file. To push somewhere remote, like [Cloudant][cloudant], set `db`.

[nodejs]: http://nodejs.org/
[grunt]: http://gruntjs.com/
[cloudant]: https://cloudant.com/