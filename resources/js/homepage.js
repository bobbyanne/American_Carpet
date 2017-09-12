
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

    $.fn.svgGroupShrinkAnim = function (duration) {
        return this.each(function () {
            var $this = $(this);
            $({ pos: 1 }).animate({ pos: 0 }, {
                duration: duration,
                step: function (now) {
                    $this.attr({
                        transform: 'scale(' + now + ')'
                    });
                }
            });
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

    // function cabinetAnim() {
    //     $('#stove', $cabinetSVG).svgGroupTransformAnim(0, 1000, 'y', 1000, 'swing', function () {
    //         $('#cabinet-bottom', $cabinetSVG).svgGroupTransformAnim(0, 1000, 'y', 1000, 'swing', function () {
    //             $('.appliance', $cabinetSVG).svgGroupTransformAnim(0, 1500, 'y', 1000, 'easeOutBounce');
    //             setTimeout(function() {
    //                 $('#cabinet-top', $cabinetSVG).svgGroupTransformAnim(0, 1000, 'y', 1000, 'linear', function() {
    //                     $('#toast', $cabinetSVG).svgGroupTransformAnim(0, 300, 'y', 2000, 'easeOutBounce');
    //                 });
    //             }, 2000);
    //         });
    //     });
    // }

    // cabinetAnim();
    var $servingTorr = $('.serving-torrence');
    var $servingDesc = $('.serving-torrence-description', $servingTorr);
    var $birds = $('#birds-bg', $servingTorr);

    var $build = $('.more-than-flooring');
    var $buildContainer = $build.parent();

    var $designSection = $('.design-help');
    var $designDesc = $('#design-description');

    $(window).resize(function () {
        if (window.innerWidth <= 800) {
            $('.scroll-follow-breakpoint').append($('.more-then-flooring-right'));
            console.log('appended');
        } else if (window.innerWidth > 800) {
            $($build.append($('.more-then-flooring-right')));
        }
    });

    $(window).scroll(function () {
        var scrollY = $(this).scrollTop();

        if (scrollY > $servingTorr.offset().top - window.innerHeight && scrollY < $servingTorr.offset().top + 800) {
            var offsetWindow = $servingTorr.offset().top - window.innerHeight / 2;
            var damper = window.innerWidth < 800 ? 600 : 1800;
            var opacityDamper = window.innerWidth < 800 ? 1500 : 1670;
            $servingDesc.css(
                {
                    'transform': 'translate(0, ' + ((scrollY - offsetWindow) / 2 ) + 'px)',
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

        var height = $buildContainer.height();
        var start = $buildContainer.offset().top - window.innerHeight / 5;
        var end = $buildContainer.next().offset().top - window.innerHeight / 1.25;
        if (scrollY > start && scrollY < end) {
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