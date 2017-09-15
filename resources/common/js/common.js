
$(function() {
    var $menus = $('.menu');
    var $subMenus = $('.sub-menu');
    var $mobileMenu = $('#mobile-menu');
    var $mobileMenuToggle = $('#mobile-menu-toggle');

    /*``````````````````````````````````````````````````````````````````*/
                            /* HELPER FUNCTIONS */
    function closeMobileMenu(animate) {
        animate = animate === true ? true : false;
        $mobileMenuToggle.children().removeClass('clicked');
        if (animate) {
            $mobileMenu.slideUp();
        } else {
            $mobileMenu.css('display', 'none');
        }
    }

    /*``````````````````````````````````````````````````````````````````*/

    $menus.click(function() {
        var $this = $(this);
        $this.toggleClass('selected');
        $menus.not($this).removeClass('selected');

        var $subMenu = $this.children('.sub-menu');

        $('li', $this).mouseenter(function() {
            $('img', $(this)).stop(true, true).animate({
                opacity: 1
            }, 100);
        }).mouseleave(function(){
            $('img', $(this)).stop(true, true).animate({
                opacity: 0
            }, 100);
        });

        $subMenus.not($subMenu).removeClass('show');
        $subMenu.toggleClass('show');
        $subMenus.each(function() {
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

    $mobileMenuToggle.click(function() {
        var $this = $(this);
        $this.children().toggleClass('clicked');
        if ($this.children().hasClass('clicked')) {
            $mobileMenu.slideDown();            
        } else {
            $mobileMenu.slideUp();            
        }
        
    });

    $('.mobile-dropdown', $mobileMenu).click(function() {
        $(this).find('.mobile-submenu').toggleClass('show');
    });

    $(window).scroll(function() {
        if ($mobileMenu.css('display') !== 'none') {
            closeMobileMenu(true);
        }
    });

    $('#main').click(function() {
        if ($mobileMenu.css('display') !== 'none') {
            closeMobileMenu(true);
        }
    });

    $(window).resize(function() {
        if (innerWidth > 750 && $mobileMenu.css('display') !== 'none') {
            closeMobileMenu();
        }
    });
});