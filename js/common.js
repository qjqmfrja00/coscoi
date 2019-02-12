'use strict';
$(function() {
    //a 링크 동작 막기
    $(document).on('click', 'a[href="#"]', function(e){
        e.preventDefault();
    });
    
    //로딩 화면
    setLoadingSection();
    function setLoadingSection() {
        $('body').css({'height': '100%', 'overflow': 'hidden'});
        $('.scroll-page').children().css({'display': 'none'});
        setTimeout(function() {
            $('body').css({'height': 'auto', 'overflow': 'auto'});
            $('#loading').css({'top': '-100%'});
            $('.scroll-page').children().css({'display': 'block'});
        }, 2500);
        setTimeout(function() {
            $('#loading').css({'display': 'none'});
            $('#main-visual').addClass('show');
            $('#main-visual div.main-slide-box').css({'right': 0});
        }, 2800);
    }

    //snb, snb
    setNav();
    function setNav() {
        $('#header div.menu a').on('click', function() {
            var $this = $(this);
            $this.parent().toggleClass('open');
            if ($this.parent().hasClass('gnb')){
                $('#header h1').toggleClass('open');
            }
            if ($this.parent().hasClass('open')) {
                $('body').css({'height': '100%', 'overflow': 'hidden'});
                $this.parent().before('<div id="layer-mask" tabindex="0"></div>').css({'display': 'block'});
                $this.parent().next('nav').append('<a href="#" class="return"></a>');
            } else {
                $('body').css({'height': 'auto', 'overflow': 'auto'});
                $('#layer-mask').remove();
                $('#header').find('a.return').remove();
            }
            $('#layer-mask').on('click', function() {
                $this.trigger('click');
            }).on('focus', function() {
                if ($this.parent().hasClass('gnb')) {
                    $('ul.header-util li a').trigger('focus');
                } else if ($this.parent().hasClass('snb')) {
                    $('#snb > ul > li:last-child > ul > li:last-child > a').trigger('focus');
                }
            });
            $('#header').find('a.return').on('focus', function() {
                $this.trigger('focus');
            });
        });
    }
    
    //컨트롤 박스 포커스
    setControlBox();
    function setControlBox() {
        $('#main-visual div.main-slide-box div.control').on('focus', function() {
            $('#main-visual div.main-slide-box div.control').css({'opacity': 1});
        });
        $('#main-visual div.main-slide-box div.control a.next').on('blur', function() {
            $('#main-visual div.main-slide-box div.control').removeAttr('style');
        });
    }
    
    //패럴랙스
    setParallax();
    function setParallax() {
        var numPage = $('.scroll-page').length;
        var pageNow = 0;
        var pagePrev = 0;
        var pageNext = 0;
        var isWheelBlocked = false;
        var timerId = '';
        
        //초기화
        $('.scroll-page').each(function(i) {
            $(this).prepend('<a href="#" class="hidden start">' + ( i + 1) + '번 페이지 시작</a>').append('<a href="#" class="hidden end">' + (i + 1) + '번 페이지 끝<a>');
        });

        checkScroll();
        scrollEffect('#main-business');
        $(window).on('scroll resize', function() {
            checkScroll();
            scrollEffect('#main-business');
        });
        $(window).on('mousewheel DOMMouseScroll', function(e) {
            if (($('#header div.menu').hasClass('open'))) {
            } else {
                if ($(window).width() > 1024) {
                    e.preventDefault();
                    clearTimeout(timerId);
                    timerId = setTimeout(function() {isWheelBlocked = false}, 300);
                    if (isWheelBlocked === true) return false;
                    isWheelBlocked = true;
                    var direction = 0;
                    if (e.originalEvent.wheelDelta === undefined) { //FF
                        direction = e.originalEvent.detail / 3;
                    } else { //표준
                        direction = e.originalEvent.wheelDelta / -120;
                    }
                    if (direction < 0) {
                        showPage(pagePrev);
                    } else {
                        showPage(pageNext);
                    }
                }
            }
        });

        $('#page-indicator li a').on('click', function() {
            var index = $('#page-indicator li').index($(this).parent());
            showPage(index + 1);
        });
        $('.scroll-page').on('focusin', function() {
            var index = $('.scroll-page').index($(this));
            showPage(index + 1);
        });
        $('#main-visual div.button a.scroll-btn').on('click', function() {
            showPage(2);
        });
        
        function checkScroll() {
            var scrollTop = $(document).scrollTop();
            var minScroll = 0;
            var maxScroll = 0;
            // page event
            $('.scroll-page').each(function(i) {
                minScroll = $(this).offset().top - ($(window).height() / 2);
                maxScroll = $(this).offset().top + ($(window).height() / 2);
                if (scrollTop > minScroll && scrollTop <= maxScroll) {
                    $('#page-indicator li').removeClass('on');
                    $('#page-indicator li:eq(' + i + ')').addClass('on');
                    pageNow = i + 1;
                    pagePrev = (pageNow - 1) < 1 ? 1 : pageNow - 1;
                    pageNext = (pageNow + 1) > numPage ? numPage : pageNow + 1;
                }
            });
            if ($(window).width() < 1025) return false;
            if (pageNow === 1) {
                $('#main-visual').addClass('show');
            } else {
                $('#main-visual').removeClass('show');
            }
        }
        function showPage(n) {
            var scrollTo = $('.scroll-page:eq(' + (n - 1) + ')').offset().top;
            $('html').animate({'scrollTop': scrollTo}, 500);
        }
        function scrollEffect(selector) {
            var scrollTop = $(document).scrollTop();
            var minShow = $(selector).offset().top - ($(window).height() - 10);
            var maxShow = $(selector).offset().top + ($(selector).outerHeight());
            $(selector).find('div.background div').css({'display': 'none'});
            if (scrollTop < minShow) {
                $('#page-indicator li, #header div.menu.snb a').removeClass('black');
            } else if (scrollTop > maxShow) {
                $('#page-indicator li, #header div.menu.snb a').removeClass('black');
            } else {
                $('#page-indicator li, #header div.menu.snb a').addClass('black');
            }
        }
    }
    
    //메인 슬라이드
    setSlideAnimation('#main-visual div.main-slide-box', 11800, true);
    setSlideAnimation('#main-visual div.banner', 7000, true);
    function setSlideAnimation(select, time, status) {
        var numSlide = $(select).find('ul.slide li').length;
        var slideNow = 0;
        var slidePrev = 0;
        var slideNext = 0;
        var timerId = '';
        var timerSpeed = time;
        var isTimerOn = status;
        
        showSlide(1);

        $(select).find('div.control a.prev').on('click', function() {
            showSlide(slidePrev);
        });
        $(select).find('div.control a.next').on('click', function() {
            showSlide(slideNext);
        });


        function showSlide(n) {
            clearTimeout(timerId);
            $(select).find('ul.slide li:eq(' + (n - 2) + ')').fadeOut(500);
            $(select).find('ul.slide li:eq(' + (n - 1) + ')').fadeIn(500);
            slideNow = n;
            slidePrev = (n - 1) < 1 ? numSlide : n - 1;
            slideNext = (n + 1) > numSlide ? 1 : n + 1;
            if (isTimerOn === true) {
                timerId = setTimeout(function() {showSlide(slideNext);}, timerSpeed);
            }
        }
    }
    
    //마우스 움직임에 따라 움직이는 이미지
    setMoveBg();
    function setMoveBg() {
        $('#main-contents').on('mousemove',function(e){
            if ($(window).width() < 1025) return false;
            var width=$(window).width();
            var height=$(window).height();
            var pointX = e.clientX;
            var pointY = e.clientY;
            var offsetX = 0
            var offsetY = 0

            moveImg('#main-contents div.background div.moving1', 60);
            moveImg('#main-contents ul.slide div.moving1', 20);
            moveImg('#main-contents div.background div.moving2', 10);
            function moveImg(select, degree) {
                $(select).each(function(i) {
                    offsetX = Math.floor(degree * (0.5 - (pointX / width))); 
                    offsetY = Math.floor(degree * (0.5 - (pointY / width)));
                    var translate = 'translate(' + Math.round(offsetX) + 'px,' + Math.round(offsetY) + 'px)';
                     $(this).css({'transform': translate});
                });
            }
            function moveBg() {
                offsetX = 50 - (Math.floor(10 * (0.5 - (pointX / width)))); 
                offsetY = 50 - (Math.floor(10 * (0.5 - (pointY / width))));
                $('#main-contents').css({'backgroundPosition': 'left ' + offsetX + '% top ' + offsetY + '%'});
            }
      });
    }
    
    //배너 슬라이드
    setBannerSlide();
    function setBannerSlide() {
        var numSlide = $('#main-contents div.wrap ul li').length;
        var slideNow = 0;
        var slidePrev = 0;
        var slideNext = 0;
        var slideNameNow = '';
        var slideNamePrev = '';
        var slideNameNext = '';

        $('#main-contents div.wrap ul li').each(function(i) {
            $(this).css({'display': 'block', 'left': (i * 100) + '%'});
        });
        showBanner(1);
        setBannerBg('#main-contents');
        
        $(window).on('scroll resize', function() {
            setBannerBg('#main-contents');
        });   
        $('#main-contents a.prev').on('click', function() {
            showBanner(slidePrev);
            setBannerBg('#main-contents');
        });
        $('#main-contents a.next').on('click', function() {
            showBanner(slideNext);
            setBannerBg('#main-contents');
        });

        function showBanner(n) {
            $('#main-contents div.wrap ul li div.images div.box p').css({'opacity': '0'});
            if (slideNow === 0) {
                $('#main-contents div.wrap ul').css({'transition': 'none', 'left': -((n - 1) * 100) + '%'});
            } else {
                $('#main-contents div.wrap ul').css({'transition': 'left 0.8s', 'left': -((n - 1) * 100) + '%'});
            }
            slideNow = n;
            slidePrev = n - 1 < 1 ? numSlide : n - 1;
            slideNext = n + 1 > numSlide ? 1 : n + 1;
        }
        function setBannerBg(selector) {
            slideNameNow = $(selector).find('div.wrap ul li:nth-child(' + slideNow + ') div.images div.box p.name').text();
            slideNamePrev = $(selector).find('div.wrap ul li:nth-child(' + slidePrev + ') div.images div.box p.name').text();
            slideNameNext = $(selector).find('div.wrap ul li:nth-child(' + slideNext + ') div.images div.box p.name').text();
            //box name change
            $(selector).find('div.wrap ul li div.images div.box p').stop().delay(500).animate({'opacity': '1'}, 2000);
            //next & prev name change
            $(selector).find('a.prev span.num').text('0' + slidePrev);
            $(selector).find('a.prev span.name').text(slideNamePrev);
            $(selector).find('a.next span.num').text('0' + slideNext);
            $(selector).find('a.next span.name').text(slideNameNext);
            $(selector).find('a.go span').text('0' + slideNow);
            $(selector).find('a.go p').text(slideNameNow);
            //background character showup
            var scrollTop = $(document).scrollTop();
            var minShow = $(selector).offset().top - ($(window).height() / 3);
            var maxShow = $(selector).offset().top + ($(window).outerHeight() - 10);
            $(selector).find('div.background > div').css({'display': 'none'});
            if (scrollTop < minShow) {
                $(selector).find('div.background > div').css({'display': 'none'}); 
            } else if (scrollTop > maxShow) {
                $(selector).find('div.background > div').css({'display': 'none'}); 
            } else {
                $(selector).find('div.background div:nth-child(' + slideNow + ')').css({'display': 'block'});
            }
            //background change
            $(selector).css({'backgroundImage': 'url(img/main-cont-s' + slideNow + '_bg.png)'});
        }
    }
});