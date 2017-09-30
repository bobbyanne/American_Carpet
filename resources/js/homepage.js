
(function ($) {
    $.fn.transformAnim = function (end, duration, property, delay, easing, callback) {
        return this.each(function () {
            var $this = $(this);
            var x, y, start;
            property = property === 'y' ? 'y' : 'x';
            var translate = $this.css('transform').split(',');
            x = translate[4];
            y = translate[5].replace(')', '');
            start = property === 'y' ? y : x;
            $({ pos: start }).stop().animate({ pos: end }, {
                duration: duration,
                step: function (now) {
                    if (property === 'y') {
                        $this.css({
                            transform: 'matrix(1, 0, 0, 1,' + x + ', ' + now + ')'
                        });
                    } else {
                        $this.css({
                            transform: 'matrix(1, 0, 0, 1, ' + now + ', ' + y ? y : '0' + ')'
                        });
                    }
                },
                easing: easing
            }, callback ? callback() : $.noop);
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

    var $nextStepsSection = $('#next-steps');
    var $stepOptionBtns = $('.primary-button-no-link', $nextStepsSection);
    $stepOptionBtns.each(function () {
        var $this = $(this);
        var thisID = $this.attr('id');
        var $boundList = $('[id^=' + thisID + ']');
        $(this).data('boundList', $boundList);
    });

    $stepOptionBtns.click(function () {
        var $this = $(this);
        if (!$this.hasClass('disabled')) {
            if ($stepOptionBtns.hasClass('disabled')) {
                var $lastChoosen = $stepOptionBtns.filter('.disabled');
                $lastChoosen.removeClass('disabled');
                $this.toggleClass('disabled');
                stepsAnimation($lastChoosen.data('boundList').not($lastChoosen));
                setTimeout(function () {
                    $this.data('boundList').not($this).css('display', 'block');
                    stepsAnimation($this.data('boundList').not($this));
                    $lastChoosen.data('boundList').not($lastChoosen).css('display', 'none');
                }, 600);
            } else {
                $this.toggleClass('disabled');
                $this.data('boundList').not($this).slideDown(280, function () {
                    stepsAnimation($this.data('boundList').not($this));
                });
            }

        } else {
            return;
        }

    });

    adaptToScreenSize();

    /*``````````````````````````````````````````````````````````````````````````````````*/
    /* HELPER FUNCTIONS */

    function adaptToScreenSize() {
        /* This function is a container for any changes that need to be made to the DOM
           When the DOM is ready or when the window resizes. */
        if (window.innerWidth <= 800) {
            $('.scroll-follow-breakpoint').append($('.more-then-flooring-right'));
        } else if (window.innerWidth > 800) {
            $($build.append($('.more-then-flooring-right')));
        }
    }

    function stepsAnimation($boundList, hide) {
        var $steps = $boundList.find('li, .ul-next');
        $steps.add($boundList.find('.ul-next'));
        hide = hide === true ? true : false;

        if (hide) {
            $steps.toggleClass('showing');
        } else {
            $steps.each(function (i) {
                var $this = $(this);
                setTimeout(function () {
                    $this.toggleClass('showing');
                }, i * 100);
            });
        }
    }

    /*``````````````````````````````````````````````````````````````````````````````````*/

    $(window).resize(function () {
        adaptToScreenSize();
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
            if (window.innerWidth <= 500) {
                damper = 2.5;
                opacityDamper = 3500;
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

        if (window.innerWidth > 500 && scrollY > $designSection.offset().top - window.innerHeight &&
            $nextStepsSection.offset().top > 650) {
            var max = window.innerWidth <= 720 ? 150 : 100;
            $designDesc.transformAnim(
                Math.max(
                    -140, Math.min(
                        max, scrollY - $designSection.offset().top - window.innerHeight / 6)), 800, 'y');
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
        } else if (scrollY < start && $build.hasClass('fixed')) {
            $build.removeClass('fixed');
        }
    });
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