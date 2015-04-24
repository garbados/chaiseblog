# Chaise Blog

[couchdb]: http://couchdb.apache.org/
[cloudant]: https://cloudant.com/

A simple CouchApp for blogging privately, built on [Angular.js](http://angularjs.org/) and [CouchDB][couchdb].

![Chaise Blog](http://upload.wikimedia.org/wikipedia/commons/4/43/Chaise_longue_Faventia.jpg)

For those thoughts you want to reflect on alone, lay back on the chaise and relax.

## Install

Before you can get your own Chaiseblog, you'll need a [CouchDB][couchdb] instance running somewhere, or an account at [Cloudant][cloudant].

To install and deploy your diary, just do this:

		# get the code!
		git clone https://github.com/garbados/chaiseblog.git
		cd chaiseblog
		# install dependencies
		npm install
		# customize your diary's template and deployment settings
		vi config.json
		# build and deploy your diary
		npm start

Once chaiseblog deploys your diary, you can visit it at `{COUCH_URL}/{DIARY_NAME}/_design/diary/_rewrite` or <http://localhost:5984/chaiseblog/_design/diary/_rewrite> by default. You can use [virtual hosts](http://couchdb.readthedocs.org/en/latest/configuring.html?highlight=virtual#virtual-hosts) to make that a prettier URL.

## Configuration

Chaiseblog uses `config.json` to store settings, including template data like the `title` of your diary, and database settings like its name and location.

To deploy to a CouchDB instance that requires authentication, or if you're using [Cloudant][cloudant], you can modify the `db.url` and `db.name` values in `config.json` to read credentials from environment variables. For example:

		{
			"db": {
				"url": "http://$CLOUDANT_API_KEY:@$CLOUDANT_USERNAME.cloudant.com",
				"name": "chaiseblog"
			}
		}

The above JSON snippet will cause chaiseblog to read credentials from the `$CLOUDANT_API_KEY` and `$CLOUDANT_USERNAME` environment variables when deploying the app. This way, you never have to hardcode credentials, or risk committing them to source control.

## License

[ISC](http://opensource.org/licenses/ISC)
