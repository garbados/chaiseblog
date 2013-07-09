all: build install

build:
	jade src/ -o _attachments/

install:
	couchapp push . blog