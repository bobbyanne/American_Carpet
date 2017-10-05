
$(function () {
    var $menus = $('.menu');
    var $subMenus = $('.sub-menu');
    var $mobileMenu = $('#mobile-menu');
    var $mobileMenuToggle = $('#mobile-menu-toggle');
    var $scrollTop = $('#scroll-to-top');

    /*``````````````````````````````````````````````````````````````````*/
    /* HELPER FUNCTIONS */
    function closeMobileMenu(animate) {
        animate = animate === true ? true : false;
        $mobileMenuToggle.children().removeClass('clicked');
        if (animate) {
            $mobileMenu.slideUp(300);
        } else {
            $mobileMenu.css('display', 'none');
        }
    }

    /*``````````````````````````````````````````````````````````````````*/

    $(window).click(function (e) {
        // Checking to see if a menu is open and if it is, then close it
        var $target = $(e.target);
        if ($target.hasClass('sub-menu') === false && $target.hasClass('menu') === false) {
            var $subMenu = $subMenus.filter('.show');
            $subMenu.removeClass('show');
            $subMenu.parent().removeClass('selected');
        }
    });

    $menus.click(function () {
        var $this = $(this);
        $this.toggleClass('selected');
        $menus.not($this).removeClass('selected');

        var $subMenu = $this.children('.sub-menu');

        $('li', $this).mouseenter(function () {
            $('img', $(this)).stop(true, true).animate({
                opacity: 1
            }, 100);
        }).mouseleave(function () {
            $('img', $(this)).stop(true, true).animate({
                opacity: 0
            }, 100);
        });

        $subMenus.not($subMenu).removeClass('show');
        $subMenu.toggleClass('show');
        $subMenus.each(function () {
            var $this = $(this);
            if (!$(this).hasClass('show')) {
                $('li', $this).removeClass('show');
            }
        });
        if ($subMenu.hasClass('show')) {
            $('li', $subMenu).addClass('show');
        } else {
            $('li', $subMenu).removeClass('show');
        }
    });

    $mobileMenuToggle.click(function () {
        var $this = $(this);
        $this.children().toggleClass('clicked');
        if ($this.children().hasClass('clicked')) {
            $mobileMenu.slideDown(250, 'easeOutBack');
        } else {
            $mobileMenu.slideUp(300);
        }

    });

    $scrollTop.on('click', function () {
        $('body, html').animate({
            scrollTop: $('#top').offset().top
        }, 1000);
    });

    $('.mobile-dropdown', $mobileMenu).click(function () {
        $(this).find('.mobile-submenu').toggleClass('show');
    });

    $(window).scroll(function () {
        if ($mobileMenu.css('display') !== 'none') {
            closeMobileMenu(true);
        }

        if ($(document).scrollTop() > window.innerHeight) {
            $scrollTop.addClass('on');
        } else {
            $scrollTop.removeClass('on');
        }
    });

    $('#main').click(function () {
        if ($mobileMenu.css('display') !== 'none') {
            closeMobileMenu(true);
        }
    });

    $(window).resize(function () {
        if (innerWidth > 750 && $mobileMenu.css('display') !== 'none') {
            closeMobileMenu();
        }
    });
});