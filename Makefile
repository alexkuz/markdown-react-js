all: copy webpack

copy:
		mkdir -p js/babel-core/ && cp -f node_modules/babel-core/browser.js js/babel-core/

webpack:
		webpack

.PHONY: copy webpack