$(function() {
    var nav = $('.navigation');
    var loader = $('.loader');
    var list = $('.list');

    nav.on('touchstart click', 'li', function(e) {
        e.preventDefault();
        var changed = !$(this).hasClass('selected');

        if(nav.hasClass('open') && changed) {
            var isSearch = $(this).hasClass('search');

            $(this).addClass('selected').siblings().removeClass('selected');

            if(isSearch) {
                list.hide();
            } else {
                list.hide();
                loader.show();

                setTimeout(function() {
                    list.show();
                    loader.hide();
                }, 600);
            }
        }
    });

    nav.on('touchstart click', function() {
        nav.toggleClass('open');
    });

    $(document).on('touchstart click', function(e) {
        if(!$(e.target).closest(nav).length) {
            nav.removeClass('open');
        }
    });
});
