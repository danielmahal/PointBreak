$(function() {
    var overview = $('#overview');
    var detail = $('#detail');

    var nav = overview.find('.navigation');
    var loader = overview.find('.loader');
    var list = overview.find('.list');
    var search = overview.find('.search-bar');
    var detailBack = detail.find('.back');
    var timeline = detail.find('.timeline');

    nav.hammer().on('tap', 'li', function(e) {
        e.preventDefault();
        var changed = !$(this).hasClass('selected');

        if(nav.hasClass('open') && changed) {
            var isSearch = $(this).hasClass('search');

            $(this).addClass('selected').siblings().removeClass('selected');

            detailBack.text($(this).text());

            if(isSearch) {
                list.hide();
                search.show();

                // search.find('input').focus();
            } else {
                list.hide();
                search.hide();
                loader.show();

                setTimeout(function() {
                    list.show();
                    loader.hide();
                    list.scrollTop(0);
                }, 600);
            }
        }
    });

    nav.hammer().on('tap', function() {
        nav.toggleClass('open');
    });

    $(document).on('touchstart click', function(e) {
        if(!$(e.target).closest(nav).length) {
            nav.removeClass('open');
        }
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

    var timelineMove = function(e) {
        var index = Math.floor((e.originalEvent.touches[0].clientX / window.innerWidth) * 24);

        console.log('Move', index);

        timeline.find('.segment').removeClass('active').eq(index).addClass('active');
    }

    var timelineEnd = function() {
        console.log('End');
        timeline.off('touchmove mousemove', timelineMove);
        timeline.off('touchend mouseleave', timelineEnd);
    }

    timeline.on('touchstart mouseenter', function(e) {
        e.preventDefault();
        console.log('Start');
        timeline.on('touchmove mousemove', timelineMove);
        timeline.on('touchend mouseleave', timelineEnd);

        timelineMove(e);
    });
});
