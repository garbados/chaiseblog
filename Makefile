DB_URI=blog

all: build install

build:
	jade src/ -o _attachments/

install:
	couchapp push . ${DB_URI}