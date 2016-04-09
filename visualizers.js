function simpleBars(plot, frequencies, width, height) {
	var barWidth = width / frequencies.length;
	for (var b = 0; b < frequencies.length; b++) {
		for (var x = b * barWidth; x < (b + 1) * barWidth; x++) {
			for (var y = 0; y < frequencies[b] * height; y++) {
				plot(x, y, '#25aae1');
			}
		}
	}
}

function pixelBars(plot, frequencies, width, height) {
	var barWidth = width / frequencies.length;
	for (var barIndex = 0; barIndex < frequencies.length; barIndex++) {
		for (var x = barIndex * barWidth; x < (barIndex + 1) * barWidth - 1; x++) {
			var blockHeight = barWidth;
			var barHeight = frequencies[barIndex] * height;
			var verticalBuckets = barHeight / blockHeight;
			for (var blockIndex = 0; blockIndex < verticalBuckets; blockIndex++) {
				for (var y = blockIndex * blockHeight; y < (blockIndex + 1) * blockHeight - 1; y++) {
					plot(x, y, '#25aae1');
				}
			}
		}
	}
}

Array.prototype.flatMap = function(transform) {
	return this.map(transform).reduce(function(a, b) { return a.concat(b) }, []);
};

function slidingBars(plot, frequencies, width, height) {

	function rand(seed) {
		return parseFloat('0.' + Math.sin(seed).toString().substr(6), 10);
	}

	function rescaleFrequencies(frequencies, length) {
		var seed = 0;
		var resampleFactor = Math.floor(length / frequencies.length) - 1;
		return frequencies.flatMap(function(x) {
			var fudgedSamples = [x];
			for (var i = 0; i < resampleFactor; i++) {
				// fudgedSamples.push(x + Math.random() * 0.1);
				fudgedSamples.push(x + Math.abs(Math.sin(seed * Math.PI / resampleFactor)) * 0.1);
				seed += 1;
			}
			return fudgedSamples;
		});
	}

	var rescaledFrequencies = rescaleFrequencies(frequencies, 200);

	var barWidth = width / rescaledFrequencies.length;
	for (var b = 0; b < rescaledFrequencies.length; b++) {
		for (var x = b * barWidth; x < (b + 1) * barWidth; x++) {
			var midY = height / 2;
			var otherHeight = rescaledFrequencies[b] * height / 2;
			var startY = midY - otherHeight / 2;
			var endY = midY + otherHeight / 2;

			for (var y = startY; y < endY; y++) {
				plot(x, y, '#25aae1');
			}
		}
	}
}

// function dopeShit(plot, frequencies, width, height, rgbaNorm) {
// 	var bassAverage = frequencies.slice(0, 5).reduce(function(a, b) { return a + b }, 0) / 5;
// 	var midAverage = frequencies.slice(5, 15).reduce(function(a, b) { return a + b }, 0) / 10;
// 	var trebleAverage = frequencies.slice(15, 20).reduce(function(a, b) { return a + b }, 0) / 5;
// 	// console.log(trebleAverage);

// 	function drawCircle(value, color, cx, cy) {
// 		var rx = value / 2 * width;
// 		var ry = value / 2 * height;

// 		// var cx = width / 2;
// 		// var cy = height / 2;

// 		for (var r = 0; r < rx; r += 1) {
// 			for (var theta = 0; theta < 2 * Math.PI; theta += 0.01) {
// 				plot(cx + r * Math.cos(theta), cy + (ry / rx) * r * Math.sin(theta), color);
// 			}
// 		}
// 	}

// 	drawCircle(bassAverage, '#25aae1', width / 2, height / 2);
// 	drawCircle(midAverage, '#678374', width / 2, height / 2);
// 	drawCircle(trebleAverage, '#484303', width / 2, height / 2);

// 	// for (var x = width / 2 - wvariation; x < width / 2 + wvariation; x++) {
// 	// 	for (var y = height / 2 - hvariation; y < height / 2 + hvariation; y++) {
// 	// 		plot(x, y, rgbaNorm(1 - bassAverage, midAverage, 1 - trebleAverage, 1));
// 	// 	}
// 	// }
// }



var visualizer = pixelBars;