$(function() {
	var overview = $('#overview');
	var detail = $('#detail');

	var nav = overview.find('.navigation');
	var loader = overview.find('.loader');
	var list = overview.find('.list');
	var search = overview.find('.search-bar');
	var detailBack = detail.find('.back');

	var timeline_labels = $("#timeline .label");
	var timeline_actuator_days = ["TODAY", "TOMORROW", "FRIDAY"];
	var timeline_actuator_times = ["03:00", "06:00", "09:00", "12:00", "15:00", "18:00", "21:00", "24:00"]
	var timeline_actuator = $("#timeline-actuator");
	var timeline_line = $("#timeline-line");
	var timeline_actuator_label_day=$("#timeline-actuator .day");
	var timeline_actuator_label_time=$("#timeline-actuator .time");
	timeline_actuator.hW = Math.round(parseInt(timeline_actuator.css("width")) / 2);
	timeline_actuator.W = parseInt(timeline_actuator.css("width"));
	window.static = {};
	window.previousX = 0;
	window.current = {};

	var svg = $("svg");
	var rects = [];
	$("svg").each(function(i) {
		rects[i] = $(this).find("rect");
	});
	

	var numberOfSlices = window.static.numOfSlices = 24;

	var loadList = function() {
		list.hide();
		loader.show();

		setTimeout(function() {
			list.show();
			loader.hide();
			list.scrollTop(0);
		}, 600);

	}

	nav.hammer().on('tap', 'li', function(e) {
		e.preventDefault();
		var changed = !$(this).hasClass('selected');

		if (nav.hasClass('open') && changed) {
			var isSearch = $(this).hasClass('search');

			$(this).addClass('selected').siblings().removeClass('selected');

			detailBack.text($(this).text());

			if (isSearch) {
				list.hide();
				search.show();
			} else {
				search.hide();
				loadList();
			}
		}
	});

	nav.hammer().on('tap', function() {
		nav.toggleClass('open');
	});

	$(document).on('touchstart click', function(e) {
		if (!$(e.target).closest(nav).length) {
			nav.removeClass('open');
		}
	});

	search.on('keyup', 'input', function() {
		loadList();
	});

	var changeSection = function(id, back) {
		var direction = back ? 'backward' : 'forward';
		var previous = $('.section.active');
		var next = $('.section').filter('#' + id);

		previous.addClass(direction + ' out');
		next.addClass(direction + ' in active');

		setTimeout(function() {
			previous.removeClass(direction + ' out active');
			next.removeClass(direction + ' out in');
		}, 350);
	}

	$(document).hammer().on('tap', 'a[href^=#]', function(e) {
		e.preventDefault();

		changeSection(e.target.hash.replace('#', ''), $(e.target).hasClass('back'));
	});

	var initLayout = function() {
		timeline_labels.each(function(i) {
			$(this).css({
				"left" : i * ($(window).width() / 3) - (parseInt($(this).css("width")) / 2)
			});
		});

	}
	initLayout();

	var setTimeSelected = function(index, day, time) {
		if (day < timeline_actuator_days.length) {
			//base 24 --> total num of bars
			var tmpIndex = index;
			$("svg").find("rect").attr("class", "");
			$("svg").each(function() {
				$(this).find("rect").each(function(i) {

					if (i == tmpIndex) {
						$(this).attr("class", "selected");
					}
				});
			});
			//base 3 --> num of days
			timeline_actuator_label_day.html(timeline_actuator_days[day]);
			//base 8 --> num of time slices/day
			timeline_actuator_label_time.html(timeline_actuator_times[time]);
		}
	}
	var moveSliderTo = function(posX) {
		var compensate = window.current.day * 5 + 3;
		posX += compensate;
		
		if (posX > 0 && posX < $(window).width() - timeline_actuator.W) {
			timeline_actuator.css({
				"-webkit-transform" : "translateX(" + posX + "px)"
			});

			posX += timeline_actuator.hW - 10;
			timeline_line.css({
				"-webkit-transform" : "translateX(" + posX + "px)"
			});
			$("#timeline-actuator .arrow").css("-webkit-transform", "translateX(" + 0 + "px)");

		} else if (posX <= 0) {

			posX += timeline_actuator.hW - 10;
			timeline_line.css({
				"-webkit-transform" : "translateX(" + posX + "px)"
			});

			posX -= -12 + timeline_actuator.hW;
			$("#timeline-actuator .arrow").css("-webkit-transform", "translateX(" + posX + "px)");

			posX = 0;
			timeline_actuator.css({
				"-webkit-transform" : "translateX(" + posX + "px)"
			});

		} else if (posX >= $(window).width() - timeline_actuator.W) {
			posX += timeline_actuator.hW - 10;

			if (posX > $(window).width() - 14) {
				posX = $(window).width() - 14;
			}
			timeline_line.css({
				"-webkit-transform" : "translateX(" + posX + "px)"
			});

			posX = (timeline_actuator.hW + 12) - ($(window).width() - posX);

			$("#timeline-actuator .arrow").css("-webkit-transform", "translateX(" + posX + "px)");

			posX = $(window).width() - timeline_actuator.W;
			timeline_actuator.css({
				"-webkit-transform" : "translateX(" + posX + "px)"
			});

		}
	}
	setTimeSelected(2, 0, 2);
	moveSliderTo(0);

	timeline_actuator.bind("touchmove", function(evt) {
		evt.preventDefault();
		var posX = evt.originalEvent.touches[0].pageX;
		if (evt.originalEvent.touches[0].pageX < $(window).width() && evt.originalEvent.touches[0].pageX > 0) {
			if (window.previousX != 0) {

				//var actTmpPos = (posX < timeline_actuator.hW) ? 0 : (posX > $(window).width() - timeline_actuator.hW) ? $(window).width() - timeline_actuator.W : posX - timeline_actuator.hW;
				var actTmpPos = window.current.posX - (window.previousX - posX);

				var currentSliceNum = Math.round(posX / (Math.round($(window).width() / numberOfSlices)));
				var currentDayIndex = Math.floor(currentSliceNum / (timeline_actuator_times.length));
				var currentTimeIndex = currentSliceNum % timeline_actuator_times.length;

				/*if (currentSliceNum >= numberOfSlices) {
				 currentSliceNum = numberOfSlices - 1;

				 }*/
				setTimeSelected(currentSliceNum, currentDayIndex, currentTimeIndex);
				window.current.posX = actTmpPos;
				window.current.slice = currentSliceNum;
				window.current.day = currentDayIndex;
				window.current.time = currentTimeIndex;
				moveSliderTo(actTmpPos);
			}

			window.previousX = posX;

		}

	}).bind("touchstart", function() {
		$(this).addClass("pressed");
		var tmp = timeline_actuator.css('-webkit-transform');
		tmp = tmp.match(/[0-9\.]+/g);
		if (tmp != null) {
			window.current.posX = parseInt(tmp[4]);
		}
	}).bind("touchend", function() {

		window.previousX = 0;
		/*var posXtmp = window.current.slice * Math.round($(window).width() / window.static.numOfSlices) - timeline_actuator.hW + compensate;
		moveSliderTo(posXtmp);
		$(this).removeClass("pressed");*/
	});
});
