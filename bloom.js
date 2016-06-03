const murmurhash = require('murmurhash');

//const itemcount = 661686;
//const LN2_SQUARED = Math.LN2 * Math.LN2;
//const errorRate =  0.005;
const bits = 489966;//491520; //7296910;//Math.round(-1 * itemcount * Math.log(errorRate) / LN2_SQUARED);
const hashes = 1;//8;//Math.round((bits / itemcount) * Math.LN2);
var buffer = new Buffer(Math.ceil(bits / 8));
const seeds = [24911];//[50025,60250,71000,31265,16018,97590,24911,83141];
buffer.fill(0);

//console.log(hashes);
//console.log(bits);

// https://github.com/ceejbot/xx-bloom/blob/master/lib/bloom.js

var setbit = function(bit)
{
	var pos = 0;
	var shift = bit;
	while (shift > 7)
	{
		pos++;
		shift -= 8;
	}

	var bitfield = buffer[pos];
	bitfield |= (0x1 << shift);
	buffer[pos] = bitfield;
};

var getbit = function(bit)
{
	var pos = 0;
	var shift = bit;
	while (shift > 7)
	{
		pos++;
		shift -= 8;
	}

	var bitfield = buffer[pos];
	return (bitfield & (0x1 << shift)) !== 0;
};


module.exports = {
	add: (word) => {
		for (var i = 0; i < hashes; i++) {
			var hash = murmurhash.v3(word, seeds[i]);
			var bit = hash % bits;
			setbit(bit);
		}
	},
	has: (word) => {
		for (var i = 0; i < hashes; i++) {
			var hash = murmurhash.v3(word, seeds[i]);
			var bit = hash % bits;

			var isSet = getbit(bit);
			if (!isSet)
				return false;
		}
		return true;
	},
	getBuffer: () => {
		return buffer;
	},
	setBuffer: (_buffer) => {
		buffer = _buffer;
	}
}