const TEST_ROUNDS = 5;

const fs = require('fs');
const zlib = require('zlib');
const https = require('follow-redirects').https;
const async = require('async');
const _ = require('lodash');
const filter = require('./bloom.js')

const generate = require('./generate.js');

var test = function() {

	const wordClass = require('./wordClass.js');

	const compressedDataBuffer = fs.readFileSync('./data.bin');
	filter.setBuffer(compressedDataBuffer);
	//const dataBuffer = zlib.gunzipSync(compressedDataBuffer);

	console.log('Test started.');

	var test_iteration = 0;
	var alphaErrorsCount = 0;
	var betaErrorsCount = 0;
	var successCount = 0;
	var attemptsCount = 0;

	async.whilst(
	    () => { return test_iteration < TEST_ROUNDS; },
	    (callback) => {
	        test_iteration++;
	        console.log('Fetching ' + test_iteration + ' of ' + TEST_ROUNDS + ' portion of test data from the server.')
			https.get('https://hola.org/challenges/word_classifier/testcase', (res) => {
			  res.on('data', (body) => {
			    var testData = JSON.parse(body);
			    attemptsCount+= _.size(testData);
			    _.forEach(testData, function(value, key) {
				  var actualResult = filter.has(key);//wordClass.test(key);
				  if (actualResult) {
				  	if (key.search(/[b-df-hj-np-tv-z]{4,}/) > -1) {
				  		actualResult = false;
				  	}
				  }
				  if (actualResult === value) {
				  	successCount++;
				  } else {
				  	if (actualResult === true) {
						alphaErrorsCount++;
				  	} else {
						betaErrorsCount++;
				  	}
				  }
				});
				callback(null, test_iteration);
			  });
			});
	    },
	    (err, n) => {
	        console.log('Test ended.');
			console.log(attemptsCount + ' attempts were made,');
			console.log(successCount + ' of them were successfull,');
			console.log('whereas ' + (attemptsCount - successCount) + ' of them were not');
			console.log('with ' + alphaErrorsCount + ' false positive and ' + betaErrorsCount + ' false negative errors made.');
	    }
	);

}

//generate.generate().then(test);
test();
