REPORTER = spec

all: eslint test

test:
	@NODE_ENV=test ./node_modules/.bin/mocha --compilers js:babelhook --recursive --reporter $(REPORTER) --timeout 3000

eslint:
	eslint lib examples test index.js

tests: test

tap:
	@NODE_ENV=test ./node_modules/.bin/mocha -R tap > results.tap

unit:
	@NODE_ENV=test ./node_modules/.bin/mocha --compilers js:babel/register --recursive -R xunit > results.xml --timeout 3000

skel:
	mkdir examples lib test
	touch index.js
	npm install mocha chai --save-dev

.PHONY: test tap unit eslint skel