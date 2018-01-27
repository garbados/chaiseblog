# Chaiseblog

[![Stability](https://img.shields.io/badge/stability-experimental-orange.svg)](https://nodejs.org/api/documentation.html#documentation_stability_index)
[![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)
[![Build Status](https://travis-ci.org/garbados/chaiseblog.svg?branch=master)](https://travis-ci.org/garbados/chaiseblog)
[![Greenkeeper badge](https://badges.greenkeeper.io/garbados/chaiseblog.svg)](https://greenkeeper.io/)

A diary app, built on [Preact](https://preactjs.com/) and [PouchDB](http://pouchdb.com/). For those thoughts you want to reflect on alone, lay back on the chaise and relax.

Chaiseblog is an offline-first application that stores user data in the user's browser, and never attempts to communicate it over the network.

To give it a try, check out the [demo](https://garbados.github.io/chaiseblog).

## Why?

Browsers have become mature application environments, but many of the web applications we use for basic tasks are littered with ads, owned by entities and institutions that do not have our interests at heart, or bound to servers that take money and labor to maintain. Who has time for that?

Chaiseblog is a demonstration that things don't have to be this way. Browser applications can stand alone with no expectation of network connectivity and still remain complete and useful. **Not every application needs the network to work.** They can be distributed just like any other piece of software, via browsers or otherwise, with no relationship to a point of origin or a controlling entity.

If we are to treat browsers as mature application environments, then let's get serious about it!

Plus, I like keeping diaries in weird ways. See also: [git-journal](https://github.com/garbados/git-journal)

## Install

To build a diary of your very own, just do this:

```bash
# get the code!
git clone https://github.com/garbados/chaiseblog.git
cd chaiseblog
npm install
npm run build
```

The contents of the folder can then be distributed as a static website. For example, to share chaiseblog over [Dat](http://datproject.org/) just do this:

```bash
dat share .
```

That will produce a `dat://` URL you can share with your friends so they can access the application.

Chaiseblog includes a `.datignore` file that specifies files the application doesn't need in order to run once built. As of this writing, the entire application is 1.9 MB.

## Development

To serve the app from a local webserver (such as for development), use one of two scripts:

- `npm start`: Builds the app once and serves it at `http://localhost:5000`
- `npm run watch`: Builds the app whenever JavaScript files change. Serves the app at `http://localhost:5000`

## License

[GPL-3.0](https://opensource.org/licenses/gpl-3.0.html)
