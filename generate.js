const readline = require('readline');
const fs = require('fs');
const q = require('q');
//const bloomxx = require('bloomxx');
const filter = require('./bloom.js');

module.exports = {
	generate: () => {
		
		console.log('Started building Bloom filter.');
		//filter = bloomxx.BloomFilter.createOptimal(661686, 0.25);
		var deferred = q.defer();

		const rl = readline.createInterface({
		  input: fs.createReadStream('./challenge_word_classifier/words.txt')
		});

		var i = 0;
		rl.on('line', (line) => {
			i++;
			console.log('Reading line:' + i);
			filter.add(line.toLowerCase());
		});

		rl.on('close', () => {
			console.log('Finished building Bloom filter.');
			fs.writeFile('./data.bin', filter.getBuffer(), function(err) {
				deferred.resolve();
			}); 
		});

		return deferred.promise;

	}
}

