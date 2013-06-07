$(function() {
  var overview = $('#overview');
  var detail = $('#detail');

  var nav = overview.find('.navigation');
  var loader = overview.find('.loader');
  var list = overview.find('.list');
  var search = overview.find('.search-bar');
  var detailBack = detail.find('.back');
  var timeline = $('#timeline');

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

        if(!nav.hasClass('open'))
        {
          nav.addClass('pressed');
        }
    });
    nav.hammer().on('touchend',function(e){
      e.preventDefault();

      var posY = e.originalEvent.changedTouches[0].pageY;
      console.log(posY);
      if(posY<88)
      {
        nav.toggleClass('open');
        nav.removeClass('pressed');
      }

    });
    nav.hammer().on('touchmove',function(e){
      e.preventDefault();
      var posY = e.originalEvent.touches[0].pageY;
      if(posY>88)
      {
        nav.removeClass('pressed');
      }
      else{
        nav.addClass('pressed');
      }
    });
    nav.hammer().on('tap', function() {
      //nav.toggleClass('open');
    });

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

  // Timeline

  var timelineWidth = 320;

  timeline.find('.actuator').on('touchstart', function(e) {
    e.preventDefault();

    var $actuator = $(this).addClass('active');
    var $arrow = $(this).find('.arrow');
    var $line = $('#timeline-line');

    var width = $actuator.outerWidth();
    var offset = e.originalEvent.touches[0].clientX - $(this).position().left;

    var move = function(e) {
      var x = e.originalEvent.touches[0].clientX;
      var handleX = Math.min(Math.max(x - offset, 0), timelineWidth - width);
      handlePos = handleX / (timelineWidth - width);

      var pos = ((width / 2) + handleX) / timelineWidth;

      if(handlePos === 0 || handlePos === 1) {
        var multiplier = handlePos === 0 ? -1 : 1;
        var space = width / 2 - (offset - width / 2) * multiplier;
        var distance = Math.abs(x - ($actuator.position().left + (width * handlePos)));
        var arrowPos = (1 - (distance / space));
        var arrowX = (arrowPos * width / 2) * multiplier;
        pos += ((width / 2) / timelineWidth) * arrowPos * multiplier;

        $arrow.css('transform', 'translateX(' + arrowX + 'px)');
      } else {
        $arrow.css('transform', 'translateX(0)');
      }

      timeline.trigger('change', pos);

      $actuator.css('transform', 'translateX(' + handleX + 'px) translateZ(0)')
    }

    var end = function(e) {
      $actuator.removeClass('active');

      $(document).off('touchmove', move);
      $(document).off('touchend', end);
    }

    $(document).on('touchmove', move);
    $(document).on('touchend', end);
  });

  timeline.on('change', function(e, pos) {
    console.log(arguments);
  })
});
