$(function() {
	var overview = $('#overview');
	var detail = $('#detail');

	var nav = overview.find('.navigation');
	var loader = overview.find('.loader');
	var list = overview.find('.list');
	var search = overview.find('.search-bar');
	var detailBack = detail.find('.back');
	var timeline_labels = $("#timeline .label");
	var timeline_actuator_days = ["TODAY","TOMORROW","FRIDAY"];
	var timeline_actuator_times = ["03:00","06:00","09:00","12:00","15:00","18:00","21:00","24:00"]
	var timeline_actuator = $("#timeline-actuator");
	timeline_actuator.hW=Math.round(parseInt(timeline_actuator.css("width"))/2);
	timeline_actuator.W=parseInt(timeline_actuator.css("width"));
	
	var numberOfSlices=24;
	
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

	var setTimeSelected = function(index,day,time) {
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
		$("#timeline-actuator .day").html(timeline_actuator_days[day]);
		//base 8 --> num of time slices/day
		$("#timeline-actuator .time").html(timeline_actuator_times[time]);
		
	}
	setTimeSelected(3,0,3);

	timeline_actuator.bind("touchmove", function(evt) {

		if (evt.originalEvent.touches[0].pageX < $(window).width() && evt.originalEvent.touches[0].pageX > 0) {
			var posX= evt.originalEvent.touches[0].pageX;
			var actTmpPos=(posX<timeline_actuator.hW)? 0 : (posX>$(window).width()-timeline_actuator.hW)?$(window).width()-timeline_actuator.W:posX-timeline_actuator.hW;
			
			
			$("#timeline-actuator").css({"margin-left":actTmpPos}).addClass("moved");
			var currentSliceNum=Math.round(posX/(Math.round($(window).width()/numberOfSlices)));
			var currentDayIndex=Math.floor(currentSliceNum/(timeline_actuator_times.length));
			var currentTimeIndex=currentSliceNum%timeline_actuator_times.length;
			if(currentSliceNum>=numberOfSlices)
			{
				currentSliceNum=numberOfSlices-1;
			}
			
			console.log(currentDayIndex,currentTimeIndex);
			setTimeSelected(currentSliceNum,currentDayIndex,currentTimeIndex);
			
		}
	});
});
