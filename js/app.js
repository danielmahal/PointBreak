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

  var timeline_labels = $('#timeline .label');
  var timeline_actuator_days = ["TODAY", "TOMORROW", "FRIDAY"];
  var timeline_actuator_times = ["03:00", "06:00", "09:00", "12:00", "15:00", "18:00", "21:00", "24:00"]
  var timeline_actuator = $("#timeline-actuator");
  var timeline_line = $("#timeline-line");
  var timeline_actuator_label_day = $("#timeline-actuator .day");
  var timeline_actuator_label_time = $("#timeline-actuator .time");
  var timelone_actuator_arrow =$("#timeline-actuator .arrow");

  timeline_actuator.hW = Math.round(parseInt(timeline_actuator.css("width")) / 2);
  timeline_actuator.W = parseInt(timeline_actuator.css("width"));

  var name_locations = ['Achadas da Cruz','Jardim do Mar','Madalena do Mar','Lugar de Baixo'];

  var loadList = function() {
    list.hide();
    loader.show();

    setTimeout(function() {
      list.show();
      loader.hide();
      list.scrollTop(0);
    }, 600);

  }

  nav.hammer().on('touchstart',function(e){
        e.preventDefault();

        if(!nav.hasClass('open')){
          nav.addClass('pressed');
        }
    });

  nav.hammer().on('touchstart', function(e){
    e.preventDefault();

    if(!nav.hasClass('open'))
      nav.addClass('pressed');
  });

  nav.hammer().on('touchend', function(e){
    e.preventDefault();

    nav.removeClass('pressed');
  });

  nav.hammer().on('touchmove', function(e){
    e.preventDefault();

    var posY = e.originalEvent.touches[0].pageY;

    nav.toggleClass('pressed', posY <= 88);
  });

  nav.hammer().on('tap', function() {
    nav.toggleClass('open');
  });

  nav.hammer().on('tap', 'li', function(e) {
    e.preventDefault();

    var changed = !$(this).hasClass('selected');

    console.log('Tap tap', changed, nav.hasClass('open'));

    if (nav.hasClass('open') && changed) {
      var isSearch = $(this).hasClass('search');

      nav.find('.selected').removeClass('selected');

      $(this).addClass('selected');

      $(e.target).addClass('selected');

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

  $(document).on('touchstart click', function(e) {
    if (!$(e.target).closest(nav).length) {
      nav.removeClass('open');
    }
  });

  search.on('keyup', 'input', function() {
    loadList();
  });

  var initLayout = function() {
    $('.list li a').each(function(i){
      console.log(this);
      var span=$('<span class="name"></span>').html(name_locations[i])
      var datas=$('<span class="datas"><span class="icon_wave"><span class="bold">1.5</span>m</span><span class="icon_wave_freq"><span class="bold">12</span>s</span><span class="icon_wind"><span class="bold">12</span>m/s</span><span></span><span class="list-arrow">&rsaquo;</span></span>');

      span.appendTo($(this));
      datas.appendTo($(this));
      i=i+1;

      $(this).parent().css('background-image','url(lib/images/maps/0'+i+'_map.png)').append('<span class="indicator wind"></span><span class="indicator swell"></span>');

    });

  }
  initLayout();

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

    var link = $(e.target).closest('a[href^=#]').get(0);

    changeSection(link.hash.replace('#', ''), $(e.target).hasClass('back'));
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
  var currentTime = null;

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

    if(time !== currentTime) {
      graphItems.removeClass('active');
      graphs.each(function() {
        $(this).find('.day div').eq(time + (day * 8)).addClass('active');
      });
      currentTime = time;
    }

    timelineLine.css('left', pos * timelineWidth);
  })
});
