REPORTER = spec

all: eslint babel webpack

babel:
	./node_modules/.bin/babel ./src --out-dir src-es5 --stage 0

webpack:
	./node_modules/.bin/webpack

test:
	@NODE_ENV=test ./node_modules/.bin/mocha --compilers js:babelhook --recursive --reporter $(REPORTER) --timeout 3000

eslint:
	eslint test src/index.js

tests: test

tap:
	@NODE_ENV=test ./node_modules/.bin/mocha -R tap > results.tap

unit:
	@NODE_ENV=test ./node_modules/.bin/mocha --compilers js:babelhook --recursive -R xunit > results.xml --timeout 3000

skel:
	mkdir test
	touch index.js
	npm install mocha chai --save-dev

.PHONY: test tap unit eslint skel webpack