test: 
	./node_modules/.bin/mocha --reporter spec --recursive ./spec/unit --timeout 15000 

.PHONY: test
