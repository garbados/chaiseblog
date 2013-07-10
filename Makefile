DB_URI=http://localhost:5984/blog

all: build install

js: build installjs

build:
	jade src/ -o _attachments/

install:
	couchapp push . ${DB_URI}

installjs:
	couchapp push app.js ${DB_URI}