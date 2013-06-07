$(function() {
  var overview = $('#overview');
  var detail = $('#detail');

  var nav = overview.find('.navigation');
  var loader = overview.find('.loader');
  var list = overview.find('.list');
  var search = overview.find('.search-bar');
  var detailBack = detail.find('.back');
  var timeline = $('#timeline');
  var timelineLine = $('#timeline-line');
  var timelineActuator = $('#timeline').find('.actuator');

  var timelineDayLabels = ['Today', 'Tomorrow', 'Friday'];
  var timelineTimeLabels = ['03:00', '06:00', '09:00', '12:00', '15:00', '18:00', '21:00', '24:00']

  // var timeline_labels = $('#timeline .label');
  // var timeline_actuator_days = ['TODAY', 'TOMORROW', 'FRIDAY'];
  // var timeline_actuator_times = ['03:00', '06:00', '09:00', '12:00', '15:00', '18:00', '21:00', '24:00']
  // var timeline_actuator = $('#timeline-actuator');
  // var timeline_line = $('#timeline-line');
  // var timeline_actuator_label_day = $('#timeline-actuator .day');
  // var timeline_actuator_label_time = $('#timeline-actuator .time');
  // var timelone_actuator_arrow =$('#timeline-actuator .arrow');

  // timeline_actuator.hW = Math.round(timeline_actuator.width() / 2);
  // timeline_actuator.W = timeline_actuator.width();

  // window.static = {};
  // window.static.wW = $(window).width();
  // window.previousX = 0;
  // window.current = {};

  // var svg = $('svg');
  // var rects = [];

  // $('svg').each(function(i) {
  //   rects[i] = $(this).find('rect');
  // });

  // var numberOfSlices = window.static.numOfSlices = 24;

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

  // Make graphs
  var graphs = $('.list a .graph');

  graphs.each(function() {
    var times = [];
    var list = $(this);
    var waveLength = Math.random() * 0.5;
    var waveOffset = Math.random() * Math.PI;

    _.times(3, function(i) {
      var day = $('<div/>', { 'class': 'day' });

      _.times(8, function(k) {
        waveLength += Math.random() * 0.05 - 0.02;
        var index = i + k + (i*5);
        var time = $('<div/>').css({
          height: (Math.sin(index * waveLength + waveOffset) + 1) * 40 + 15 + (Math.random() * 10) + '%',
          left: (k * 13) + 'px'
        });

        day.append(time);
        times.push(time);
      });

      list.append(day);
    });

    $(this).data('times', times);
  });

  // Timeline

  var timelineWidth = 320;

  timelineActuator.on('touchstart', function(e) {
    e.preventDefault();

    timelineActuator.addClass('active');
    var $arrow = $(this).find('.arrow');

    var width = timelineActuator.outerWidth();
    var offset = e.originalEvent.touches[0].clientX - $(this).position().left;

    var move = function(e) {
      var x = e.originalEvent.touches[0].clientX;
      var handleX = Math.min(Math.max(x - offset, 0), timelineWidth - width);
      handlePos = handleX / (timelineWidth - width);

      var pos = ((width / 2) + handleX) / timelineWidth;

      if(handlePos === 0 || handlePos === 1) {
        var multiplier = handlePos === 0 ? -1 : 1;
        var space = width / 2 - (offset - width / 2) * multiplier;
        var distance = Math.abs(x - (timelineActuator.position().left + (width * handlePos)));
        var arrowPos = (1 - (distance / space));
        var arrowX = (arrowPos * width / 2) * multiplier;
        pos += ((width / 2) / timelineWidth) * arrowPos * multiplier;

        $arrow.css('transform', 'translateX(' + arrowX + 'px)');
      } else {
        $arrow.css('transform', 'translateX(0)');
      }

      timeline.trigger('change', pos);

      timelineActuator.css('transform', 'translateX(' + handleX + 'px) translateZ(0)')
    }

    var end = function(e) {
      timelineActuator.removeClass('active');

      $(document).off('touchmove', move);
      $(document).off('touchend', end);
    }

    $(document).on('touchmove', move);
    $(document).on('touchend', end);
  });

  var graphItems = $('.graph .day div');
  var actuatorDay = timelineActuator.find('.day');
  var actuatorTime = timelineActuator.find('.time');
  var currentDayLabel = null;
  var currentTimeLabel = null;

  timeline.on('change', function(e, pos) {
    var x = pos * 320;
    var day = Math.floor(pos * 3);
    var time = Math.floor(Math.min(Math.max(x - (day * 103) - (6 * day), 0), 100) / (103 / 8));

    var dayLabel = timelineDayLabels[day];
    var timeLabel = timelineTimeLabels[time];

    if(dayLabel != currentDayLabel) {
      currentDayLabel = dayLabel;
      actuatorDay.text(dayLabel);
    }

    if(timeLabel != currentTimeLabel) {
      currentTimeLabel = timeLabel;
      actuatorTime.text(timeLabel);
    }

    timelineLine.css('left', pos * timelineWidth);
  })

  // var initLayout = function() {
  //   timeline_labels.each(function(i) {
  //     $(this).css({
  //       'left' : i * (window.static.wW / 3) - ($(this).width() / 2)
  //     });
  //   });

  // }
  // initLayout();

  // var setTimeSelected = function(index, day, time) {
  //   if (day < timeline_actuator_days.length) {
  //     //base 24 --> total num of bars
  //     var tmpIndex = index;

  //     for(var j=0; j < rects.length; j++) {
  //       for(var i=0; i < rects[j].length; i++) {
  //         $(rects[j][i]).attr('class','');
  //         if(i == index) {
  //           $(rects[j][i]).attr('class', 'selected');
  //         }
  //       }
  //     }
  //     //base 3 --> num of days
  //     timeline_actuator_label_day.html(timeline_actuator_days[day]);
  //     //base 8 --> num of time slices/day
  //     timeline_actuator_label_time.html(timeline_actuator_times[time]);
  //   }
  // }
  // window.setTime=setTimeSelected;
  // var moveSliderTo = function(posX) {
  //   var boxsliderPosX=posX;
  //   //var compensate = window.current.day * 5 + 3;
  //   //posX += compensate;
  //   var linePosX=0;

  //   if (posX > 0 && posX < window.static.wW - timeline_actuator.W) {
  //     timeline_actuator.css({
  //       '-webkit-transform' : 'translateX(' + posX + 'px)'
  //     });

  //     posX += timeline_actuator.hW - 10;
  //     timeline_line.css({
  //       '-webkit-transform' : 'translateX(' + posX + 'px)'
  //     });
  //     linePosX=posX;
  //     $('#timeline-actuator .arrow').css('-webkit-transform', 'translateX(' + 0 + 'px)');

  //   } else if (posX <= 0 ) {

  //     posX += timeline_actuator.hW - 10;
  //     if(posX<-5)
  //     {
  //       posX=-5;
  //     }
  //     timeline_line.css({
  //       '-webkit-transform' : 'translateX(' + posX + 'px)'
  //     });
  //     linePosX=posX;
  //     posX -= -12 + timeline_actuator.hW;
  //     timelone_actuator_arrow.css('-webkit-transform', 'translateX(' + posX + 'px)');

  //     posX = 0;
  //     timeline_actuator.css({
  //       '-webkit-transform' : 'translateX(' + posX + 'px)'
  //     });


  //   } else if (posX >= window.static.wW - timeline_actuator.W) {
  //     posX += timeline_actuator.hW - 10;

  //     if (posX > window.static.wW - 14) {
  //       posX = window.static.wW - 14;
  //     }
  //     timeline_line.css({
  //       '-webkit-transform' : 'translateX(' + posX + 'px)'
  //     });
  //     linePosX=posX;

  //     posX = (timeline_actuator.hW + 12) - (window.static.wW - posX);

  //     timelone_actuator_arrow.css('-webkit-transform', 'translateX(' + posX + 'px)');

  //     posX =  window.static.wW- timeline_actuator.W;

  //     timeline_actuator.css({
  //       '-webkit-transform' : 'translateX(' + posX + 'px)'
  //     });
  //   }

  //   posX=linePosX;
  //   posX-=Math.floor(posX/(window.static.wW/3))*2+1;

  //   var currentSliceNum = Math.round(posX / (Math.round(window.static.wW / numberOfSlices)));
  //   var currentDayIndex = Math.floor(currentSliceNum / (timeline_actuator_times.length));
  //   var currentTimeIndex = currentSliceNum % timeline_actuator_times.length;

  //   setTimeSelected(currentSliceNum, currentDayIndex, currentTimeIndex);
  //   window.current.posX = boxsliderPosX;
  //   window.current.slice = currentSliceNum;
  //   window.current.day = currentDayIndex;
  //   window.current.time = currentTimeIndex;
  // }
  // setTimeSelected(2, 0, 2);
  // moveSliderTo(0);

  // timeline_actuator.bind('touchmove', function(evt) {
  //   evt.preventDefault();
  //   var posX = evt.originalEvent.touches[0].pageX;
  //   if (evt.originalEvent.touches[0].pageX < window.static.wW && evt.originalEvent.touches[0].pageX > 0) {
  //     if (window.previousX !== 0) {
  //       var actTmpPos = window.current.posX - (window.previousX - posX);

  //       moveSliderTo(actTmpPos);
  //     }

  //     window.previousX = posX;

  //   }

  // }).bind('touchstart', function() {
  //   $(this).addClass('pressed');
  //   var tmp = timeline_actuator.css('-webkit-transform');
  //   tmp = tmp.match(/[0-9\.]+/g);
  //   if (tmp !== null) {
  //     window.current.posX = parseInt(tmp[4], 10);
  //   }
  // }).bind('touchend', function() {

  //   window.previousX = 0;
  //   $(this).removeClass('pressed');
  // });
});
