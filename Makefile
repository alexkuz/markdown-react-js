all: copy webpack

copy:
		mkdir -p js/babel-core/ && cp -f node_modules/babel-core/browser.js js/babel-core/

webpack:
		webpack

dev:
		node_modules/webpack-dev-server/bin/webpack-dev-server.js

.PHONY: copy webpack dev