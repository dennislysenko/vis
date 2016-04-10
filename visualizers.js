window.visualizers = [];
function defineVisualizer(name, description, visualizerFunction) {
	visualizers.push({ name: name, description: description, visualizerFunction: visualizerFunction }); // wish i had ES6 :/
}

defineVisualizer('simpleBars', 'Simplest visualizer: just draws bars representing the exact frequency values.', function (plot, frequencies, width, height) {
	var barWidth = width / frequencies.length;
	for (var b = 0; b < frequencies.length; b++) {
		for (var x = b * barWidth; x < (b + 1) * barWidth - 1; x++) {
			for (var y = 0; y < frequencies[b] * height; y++) {
				plot(x, y, '#25aae1');
			}
		}
	}
});

defineVisualizer('pixelBars', 'Draws bars split up into pixel squares, making it a more discrete spectrum rather than continuous.', function (plot, frequencies, width, height) {
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
});

defineVisualizer('barsWithCaps', 'Draws bars with little caps on the top to add some differentiation.', function (plot, frequencies, width, height) {
	var barWidth = width / frequencies.length;
	for (var barIndex = 0; barIndex < frequencies.length; barIndex++) {
		for (var x = barIndex * barWidth; x < (barIndex + 1) * barWidth - 1; x++) {
			var blockHeight = barWidth;
			var barHeight = frequencies[barIndex] * height;
			var verticalBuckets = barHeight / blockHeight;

			for (var y = 0; y < barHeight; y++) {
				// If we are at the 
				var beforeLastBlock = barHeight - 4;

				if (y > beforeLastBlock) {
					plot(x, y, '#25aae1');
				}
				else if (/*(y % blockHeight == 0 && y < barHeight - blockHeight) || */(Math.abs(y - beforeLastBlock) < 1)) {
				} else {
					plot(x, y, '#25aae1');
				}
			}
		}
	}
});

defineVisualizer('pixelBarsQuadWithLeading', 'Attempts to show velocity by splitting each pixel bar into two columns and having the rightmost column lead in the direction of the velocity (up when rising, down when falling).', function (plot, frequencies, width, height, velocity) {
	var barWidth = width / frequencies.length;
	for (var barIndex = 0; barIndex < frequencies.length; barIndex++) {
		for (var x = barIndex * barWidth; x < (barIndex + 0.5) * barWidth - 1; x++) {
			var blockHeight = barWidth / 2;
			var barHeight = frequencies[barIndex] * height;
			var verticalBuckets = barHeight / blockHeight;

			if (velocity[barIndex] > 0) {
				verticalBuckets -= 1;
			}

			for (var blockIndex = 0; blockIndex < verticalBuckets; blockIndex++) {
				for (var y = blockIndex * blockHeight; y < (blockIndex + 1) * blockHeight - 1; y++) {
					plot(x, y, '#25aae1');
				}
			}
		}

		for (var x = (barIndex + 0.5) * barWidth; x < (barIndex + 1) * barWidth - 1; x++) {
			var blockHeight = barWidth / 2;
			var barHeight = frequencies[barIndex] * height;
			var verticalBuckets = barHeight / blockHeight;

			if (velocity[barIndex] < 0) {
				verticalBuckets -= 1;
			}

			for (var blockIndex = 0; blockIndex < verticalBuckets; blockIndex++) {
				for (var y = blockIndex * blockHeight; y < (blockIndex + 1) * blockHeight - 1; y++) {
					plot(x, y, '#25aae1');
				}
			}
		}
	}
});

Array.prototype.flatMap = function(transform) {
	return this.map(transform).reduce(function(a, b) { return a.concat(b) }, []);
};

defineVisualizer('slidingBars', 'Centered bars sliding in and out.', function(plot, frequencies, width, height) {
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

	var rescaledFrequencies = frequencies;//rescaleFrequencies(frequencies, 200);

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
});

// Draws concentric circles representing approximate bass, mid and treble frequency ranges.
function rangeCircles(plot, frequencies, width, height, rgbaNorm) {
	var bassAverage = frequencies.slice(0, 5).reduce(function(a, b) { return a + b }, 0) / 5;
	var midAverage = frequencies.slice(5, 15).reduce(function(a, b) { return a + b }, 0) / 10;
	var trebleAverage = frequencies.slice(15, 20).reduce(function(a, b) { return a + b }, 0) / 5;
	// console.log(trebleAverage);

	function drawCircle(value, color, cx, cy) {
		var rx = value / 2 * width;
		var ry = value / 2 * height;

		// var cx = width / 2;
		// var cy = height / 2;

		for (var r = 0; r < rx; r += 1) {
			for (var theta = 0; theta < 2 * Math.PI; theta += 0.01) {
				plot(cx + r * Math.cos(theta), cy + (ry / rx) * r * Math.sin(theta), color);
			}
		}
	}

	drawCircle(bassAverage, '#25aae1', width / 2, height / 2);
	drawCircle(midAverage, '#678374', width / 2, height / 2);
	drawCircle(trebleAverage, '#484303', width / 2, height / 2);

	// for (var x = width / 2 - wvariation; x < width / 2 + wvariation; x++) {
	// 	for (var y = height / 2 - hvariation; y < height / 2 + hvariation; y++) {
	// 		plot(x, y, rgbaNorm(1 - bassAverage, midAverage, 1 - trebleAverage, 1));
	// 	}
	// }
}

defineVisualizer('shakingPixelBars', 'Shows pixel bars but shakes them.', function(plot, frequencies, width, height, velocity, frameIndex) {
	var bassAverage = frequencies.slice(0, 5).reduce(function(a, b) { return a + b }, 0) / 5;
	var maxVariationX = 0.15 * width;
	var maxVariationY = 0.08 * height;
	var barWidth = width / frequencies.length;

	for (var barIndex = 0; barIndex < frequencies.length; barIndex++) {
		for (var x = barIndex * barWidth; x < (barIndex + 1) * barWidth - 1; x++) {
			var blockHeight = barWidth;
			var barHeight = frequencies[barIndex] * height;
			var verticalBuckets = barHeight / blockHeight;
			for (var blockIndex = 0; blockIndex < verticalBuckets; blockIndex++) {
				for (var y = blockIndex * blockHeight; y < (blockIndex + 1) * blockHeight - 1; y++) {
					var variationX = Math.pow(bassAverage, 2) * maxVariationX * Math.sin(frameIndex);
					var variationY = Math.pow(bassAverage, 2) * maxVariationY * Math.sin(frameIndex);
					plot(x + variationX, y + variationY, '#25aae1');
				}
			}
		}
	}
});

defineVisualizer('shakingBars', 'Shows regular bars but shakes them in time with bass.', function (plot, frequencies, width, height, velocity, frameIndex) {	
	var bassAverage = frequencies.slice(0, 5).reduce(function(a, b) { return a + b }, 0) / 5;
	var maxVariationX = 0.15 * width;
	var maxVariationY = 0.08 * height;
	var barWidth = width / frequencies.length;

	for (var b = 0; b < frequencies.length; b++) {
		for (var x = b * barWidth; x < (b + 1) * barWidth - 1; x++) {
			for (var y = 0; y < frequencies[b] * height; y++) {
				var variationX = Math.pow(bassAverage, 2) * maxVariationX * Math.sin(frameIndex);
				var variationY = Math.pow(bassAverage, 2) * maxVariationY * Math.sin(frameIndex);
				plot(x + variationX, y + variationY, '#25aae1');
			}
		}
	}
});