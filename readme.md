# chaiseblog

[![Build Status](https://travis-ci.org/garbados/chaiseblog.svg?branch=master)](https://travis-ci.org/garbados/chaiseblog)
[![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

A diary app, built on [Preact](https://preactjs.com/) and [PouchDB](http://pouchdb.com/).

For those thoughts you want to reflect on alone, lay back on the chaise and relax.

To give it a try, check out the [demo](https://garbados.github.io/chaiseblog)

## Install

To install and deploy your diary, just do this:

```bash
# get the code!
git clone https://github.com/garbados/chaiseblog.git
cd chaiseblog
npm install
npm run build
```

You can deploy the contents of the project directory as a static app.

To serve the app from a local webserver (such as for development), use one of two scripts:

- `npm start`: Builds the app once and serves it at `http://localhost:5000`
- `npm run watch`: Builds the app whenever files change. Serves the app at `http://localhost:5000`

You can also serve chaiseblog over [Dat](https://datproject.org/):

```
npm run build
dat share .
```

## License

[GPL-3.0](https://opensource.org/licenses/gpl-3.0.html)
