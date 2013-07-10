# Chaise Blog

A simple CouchApp for blogging privately, built on [Angular.js](http://angularjs.org/) and [CouchDB](http://couchdb.apache.org/).

![Chaise Blog](http://eggchair.maxthayer.org/img/1373405131_couch-therapy.jpg)

For those thoughts you want to reflect on alone, lay back on the chaise and relax.

## Install

First, you'll need [jade](http://jade-lang.com/) installed as a command-line utility. See how [here](http://jade-lang.com/command-line/).

Then, clone the repo:

	git clone git@github.com:garbados/chaiseblog.git
	cd chaiseblog

Then, edit `Makefile` to set `DB_URI` to wherever your CouchDB instance lives. By default, Chaise installs to a local instance. 

Lastly, run `make`.

Your chaise blog should now live at `${DB_URI}/_design/chaiseblog/_rewrite`. You can use [virtual hosts](http://couchdb.readthedocs.org/en/latest/configuring.html?highlight=virtual#virtual-hosts) to make that a prettier URL.

## Troubleshooting

**When running `make` you get "Error: Cannot find module '/path/to//chaiseblog'"**

Instead of running `make` try `make js`.