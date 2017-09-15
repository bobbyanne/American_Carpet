
(function ($) {
    $.fn.svgGroupTransformAnim = function (end, duration, property, delay, easing, callback) {
        // please note that this function is most likely buggy.  And it's rather limited
        return this.each(function () {
            var $this = $(this);
            var x, y, start;
            property = property === 'y' ? 'y' : 'x';
            var translate = $this.attr('transform').match(/-?\d+/g);
            if (translate.length > 1) {
                x = translate[0];
                y = translate[1];
            } else {
                x = translate[0];
            }
            start = property === 'y' ? y : x;

            setTimeout(function () {
                $({ pos: start }).animate({ pos: end }, {
                    duration: duration,
                    step: function (now) {
                        if (property === 'y') {
                            $this.attr({
                                transform: 'translate(' + x + ' ' + now + ')'
                            });
                        } else {
                            $this.attr({
                                transform: 'translate(' + now + ' ' + y ? y : '' + ')'
                            });
                        }
                    },
                    easing: easing
                }, callback ? callback() : $.noop);
            }, delay += 400);
        });
    };

    $.fn.svgTextSpellAnim = function (delay, timeBetween, callback) {
        return this.each(function () {
            var $this = $(this);
            var $tspan;

            if ($this[0].tagName == 'text') {
                $tspan = $this.find('tspan');
            } else if ($this[0].tagName == 'tspan') {
                $tspan = $this;
            } else {
                return;
            }

            if ($tspan[0].tagName !== 'tspan') return;

            var innerText = $tspan.text();
            var curIndex = innerText ? 0 : null;
            var intervalTimeout;

            if (curIndex === null) return;

            $tspan.text('');

            setTimeout(function () {
                intervalTimeout = setInterval(spellOut, timeBetween ? timeBetween : 400);
            }, delay ? delay : 0);

            function spellOut() {
                if (curIndex === innerText.length) {
                    clearInterval(intervalTimeout);
                    if (typeof callback === 'function') {
                        callback();
                    }
                    return;
                }

                $tspan.text($tspan.text() + innerText[curIndex++]);
            }
        });
    };

})(jQuery);


$(function () {

    var $cabinetSVG = $('#cabinet-svg');
    var $servingTorr = $('.serving-torrence');
    var $servingDesc = $('.serving-torrence-description', $servingTorr);
    var $birds = $('#birds-bg', $servingTorr);

    var $build = $('.more-than-flooring');
    var $buildContainer = $build.parent();

    var $designSection = $('.design-help');
    var $designDesc = $('#design-description');

    /*``````````````````````````````````````````````````````````````````````````````````*/
                                    /* HELPER FUNCTIONS */

    function checkScreenSize () {
        /* This function is a container for any changes that need to be made to the DOM
           When the DOM is ready and on window resize. */
    }
    /*``````````````````````````````````````````````````````````````````````````````````*/

    $(window).resize(function () {
        if (window.innerWidth <= 800) {
            $('.scroll-follow-breakpoint').append($('.more-then-flooring-right'));
        } else if (window.innerWidth > 800) {
            $($build.append($('.more-then-flooring-right')));
        }
    });

    $(window).scroll(function () {
        var scrollY = $(this).scrollTop();

        if (scrollY > $servingTorr.offset().top - window.innerHeight && scrollY < $servingTorr.offset().top + 800) {
            var offsetWindow = $servingTorr.offset().top - window.innerHeight / 2;
            var damper = window.innerWidth < 800 ? 2.2 : 2;
            var opacityDamper = window.innerWidth < 800 ? 1950 : 1870;
            if (window.innerWidth <= 720) {
                damper = 2.5;
                opacityDamper = 2700;
            }
            $servingDesc.css(
                {
                    'transform': 'translate(0, ' + ((scrollY - offsetWindow) / damper) + 'px)',
                    'opacity': Math.max(0, 2.5 - (scrollY / opacityDamper))
                });
            $birds.stop().animate({
                right: scrollY - $servingTorr.offset().top - (scrollY / 500)
            }, 2500);
        }

        if (scrollY > $designSection.offset().top - window.innerHeight) {
            $designDesc.stop().animate({
                top: Math.max(60, Math.min(300, scrollY - $designSection.offset().top + (window.innerHeight / 3) / (scrollY / 1000)))
            }, 800);
        }

        var cabinetStart = window.innerHeight > 600 ? 5 : 8;
        var cabinetEnd = window.innerHeight > 600 ? 1.25 : 1.13;

        if (window.innerHeight < 500 && window.innerWidth < 400) {
            cabinetStart = 2;
            cabinetEnd = 1.28;
        }
        else if (window.innerHeight < 700 && window.innerWidth < 500) {
            cabinetStart = 2;
            cabinetEnd = 1.38;
        }
        else if (window.innerHeight > 600 && window.innerHeight <= 800) {
            cabinetStart = 5;
            cabinetEnd = 1.25;                        
        } else if (window.innerHeight > 800 && window.innerHeight <= 1000) {
            cabinetStart = 4.5;
            cabinetEnd = 1.32;
        } else if (window.innerHeight > 1000) {
            cabinetStart = 2;
            cabinetEnd = 1.41;
        }

        var start = $buildContainer.offset().top - window.innerHeight / cabinetStart;
        var end = $buildContainer.next().offset().top - window.innerHeight / cabinetEnd;
        if (scrollY > start && scrollY < end) {
            var height = $buildContainer.height();
            var thing = $buildContainer.offset().top - window.innerHeight / 6.1;
            $build.removeClass('done');
            $build.addClass('fixed');
            $('#stove', $cabinetSVG).attr('transform', 'translate(0, ' + (Math.max(0, thing - scrollY + 350) + ')'));
            $('#cabinet-bottom', $cabinetSVG).attr('transform', 'translate(0, ' + (Math.max(0, thing - scrollY + 500)) + ')');
            $('#pan', $cabinetSVG).attr('transform', 'translate(0, ' + (Math.min(0, scrollY - thing - (height / 3.2))) + ')');
            $('#tea', $cabinetSVG).attr('transform', 'translate(0, ' + (Math.min(0, scrollY - thing - (height / 2.8))) + ')');
            $('#toaster', $cabinetSVG).attr('transform', 'translate(0, ' + (Math.min(0, scrollY - thing - (height / 2.4))) + ')');
            $('#blender', $cabinetSVG).attr('transform', 'translate(0, ' + (Math.min(0, scrollY - thing - (height / 2))) + ')');
            $('#cabinet-top', $cabinetSVG).attr('transform', 'translate(0,' + (Math.min(0, scrollY - thing - (height / 1.6))) + ')');
            $('#toast', $cabinetSVG).attr('transform', 'translate(0, ' + (Math.max(0, Math.min(10, thing - scrollY + (height / 1.5))) + ')'));
        } else if (scrollY > end && $build.hasClass('fixed')) {
            $build.removeClass('fixed');
            $build.addClass('done');
            console.log('yep');
        } else if (scrollY < start && $build.hasClass('fixed')) {
            $build.removeClass('fixed');
        }
    });

    $('.testimates-wrapper').slick();
    $('.hide-unhide').click(function () {
        var $this = $(this);
        var oldText = $this.text();
        var newText = oldText === 'Hide' ? 'Unhide' : 'Hide';
        $this.text(newText);
        var p = $this.parent().parent().find('p');
        if (newText === 'Hide') {
            p.slideDown(200);
        } else {
            p.slideUp(200);
        }
    });

});