var aniManager = function() {
	var aniManager = this;
	this.processing
	this.spot = function(name, urlImage) {
		this.name = name
		this.map = urlImage;
	}
	this.populateList = function() {
		$.getJSON("wind.json", function(data) {
			window.dataset = data;
			aniManager.initAnim();
		});
	}
	this.initDetailedView = function() {
		var canvas = window.document.getElementById("viz");
		aniManager = new Processing(canvas, function(processing) {
			var unitX = $(window).width() / 4;
			var unitY = $(window).height() / 6;
			var accD = new Array();
			var accS = new Array();
			processing.setup = function() {
				processing.size($(window).width() - 1, $(window).height() - 1);
				for(var i in window.dataset ) {
					window.dataset[0][i].direction = processing.radians(parseFloat(window.dataset[i].direction));
					accD[i] = processing.random(-1 * processing.PI / 58, processing.PI / 58);
					accS[i] = processing.random(-1, 1);
					window.dataset[0][i].speed = parseInt(window.dataset[i].speed);
				}

				//alert(window.dataset[0].speed);
				window.setInterval(function() {

					for(var i in window.dataset ) {

						accD[i] = processing.random(-1 * processing.PI / 38, processing.PI / 38);

						accS[i] = processing.random(-1, 1);

					}

					console.log(accS, window.dataset);

				}, 1500);

				window.setInterval(function() {
					for(var i in window.dataset[0] ) {

						window.dataset[0][i].direction = window.dataset[0][i].direction + accD[i];
						window.dataset[0][i].speed = window.dataset[0][i].speed + accS[i];
					}

				}, 50);
			};
			processing.draw = function() {
				processing.background(128);

				for(var i in window.dataset ) {
					//console.log(Math.floor(i/4),Math.floor(i%4+(i/processing.width)));

					processing.pushMatrix();
					processing.translate(Math.floor(i / 4) * unitX, (Math.floor(i % 4 + (i / processing.width))) * unitY + unitY);
					processing.line(-1, 0, 1, 0);
					processing.line(0, -1, 0, 1);
					processing.rotate(window.dataset[0][i].direction);
					processing.line(map_range(window.dataset[0][i].speed, 0, 40, 0, unitX / 4));
					processing.popMatrix();

				}

			};
		});
	}
}