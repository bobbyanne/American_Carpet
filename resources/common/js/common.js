
$(function() {
    var $menus = $('.menu');
    var $subMenus = $('.sub-menu');

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
});