# Chaise Blog

A simple CouchApp for blogging privately, built on [Angular.js](http://angularjs.org/) and [CouchDB](http://couchdb.apache.org/).

![Chaise Blog](http://upload.wikimedia.org/wikipedia/commons/4/43/Chaise_longue_Faventia.jpg)

For those thoughts you want to reflect on alone, lay back on the chaise and relax.

## Install

To get your own Chaiseblog, just do this:

		# get the code!
		git clone https://github.com/garbados/chaiseblog.git
		cd chaiseblog
		# install dependencies
		npm install
		# set the url for your database; defaults to "http://localhost:5984"
		vi COUCH_URL
		# set the name of your diary's database; defaults to "chaiseblog"
		vi DIARY_NAME
		# customize your diary; defaults to {"title": "Your Diary"}
		vi config.json
		# build and deploy your diary
		npm start

Once chaiseblog deploys your diary, you can visit it at `{COUCH_URL}/{DIARY_NAME}/_design/diary/_rewrite` or <http://localhost:5984/chaiseblog/_design/diary/_rewrite> by default. You can use [virtual hosts](http://couchdb.readthedocs.org/en/latest/configuring.html?highlight=virtual#virtual-hosts) to make that a prettier URL.

## Configuration

Chaiseblog uses `config.json` to store template settings, specifically the `title` of your diary. The text files `COUCH_URL` and `DIARY_NAME` tell Chaiseblog where to deploy your diary.

If your CouchDB instance requires authentication (for example, if you use [Cloudant](https://cloudant.com/)), modify `COUCH_URL` with your username and password, like this:

		https://user:pass@user.cloudant.com

## License

[ISC](http://opensource.org/licenses/ISC)
