'use strict';

/**
 * @namespace SEWHA
 * @namespacedesc 세화미술관 UI Dev
 * @version v1.0
 * @author Joe Seung Woon
 * @logs 16.08.01
 */

var SEWHA = window.SEWHA || {};


SEWHA = (function($) {

	/**
	 * @method deviceChk
	 * @description 디바이스 아이폰, 안드로이드 분기 확장 클래스
	 * @private
	 */
	function deviceChk() {
		//아이폰 || 안드로이드 디바이스 판별
		var device = {
			isIphone: function() {
				return !!window.navigator.userAgent.match(/iPhone/i);
			}(),
			isAndroid: function() {
				return !!window.navigator.userAgent.match(/Android/i);
			}()
		};
		var $body = $('body');

    	if ( device.isIphone ) {
    		$body.attr('data-device', 'i');
    	} else if ( device.isAndroid ) {
    		$body.attr('data-device', 'a');
    	}
	}

	/**
	 * @method matchMediaFn
	 * @description 미디어쿼리
	 * @private
	 */
	function matchMediaFn() {
		var $body = $('body');

		//브라우저 리사이즈 해상도 체크 후  width 값 변경
		function responseControlWid(deviceWid) {
			$.each($('[data-' + deviceWid + ']'), function(idx, elem) {
				var $this = $(elem);
				var dataMinWid = '',
					dataMaxWid = '',
					dataWid = '';

				if ( deviceWid.indexOf('min') > -1 ) {
					dataMinWid = $this.data(deviceWid);
				} else if ( deviceWid.indexOf('max') > -1 ) {
					dataMaxWid = $this.data(deviceWid);
				} else {
					dataWid = $this.data(deviceWid);
				}

				if ( dataMinWid ) { $this.css('min-width', dataMinWid); }
				if ( dataMaxWid ) { $this.css('max-width', dataMaxWid); }
				if ( dataWid ) { $this.css('width', dataWid); }
			});
		}

		//브라우저 해상도 분기 처리
		function mediaqueryresponse() {
			if ( window.matchMedia(mobile).matches ) {
				responseControlWid('min-mwid');
				responseControlWid('max-mwid');
				responseControlWid('mwid');
				$body.attr('data-match', 'mobile');
			} else if ( window.matchMedia(tablet).matches ) {
				responseControlWid('min-twid');
				responseControlWid('max-twid');
				responseControlWid('twid');
				$body.attr('data-match', 'tablet');
			} else if ( window.matchMedia(web).matches ) {
				responseControlWid('min-wwid');
				responseControlWid('max-wwid');
				responseControlWid('wwid');
				$body.attr('data-match', 'web');
			}
		}

		//브라우저 브레이크 포인트 매칭
		if ( window.matchMedia ) {
			var mobile = '(max-width: 768px)',
				tablet = '(max-width: 1107px) and (min-width: 769px)',
				web = '(min-width: 1108px)';

			var mqls = [
				window.matchMedia(mobile),
				window.matchMedia(tablet),
				window.matchMedia(web)
	        ];

			for ( var i = 0, len = mqls.length; i < len; i++ ) {
				mediaqueryresponse(mqls[i]);
			    mqls[i].addListener(mediaqueryresponse);
			}
		}
	}

	/**
	 * @method dropdownToggle
	 * @description 드롭다운 토글 (커스텀 셀렉트박스)
	 * @private
	 */
	function dropdownToggle() {
		var $dropdown = $('.dropdown>a');
		var $mDepthMenuDropdown = $('#mDepthMenu .dropdown>a');
		var $familySiteDropdown = $('#familySite .dropdown>span>a');
		var $familySiteMenu = $('#familySiteMenu');

		//드롭다운 메뉴 공통
		$dropdown.on('click', function(e) {
			e.preventDefault();

			var $this = $(this),
				target = $this.attr('href');

			if ( $(target).is(':hidden') ) {
				$(target).show();
				$this.addClass('on');	// 20161004 추가
			} else {
				$(target).hide();
				$this.removeClass('on');	// 20161004 추가
			}
		});

		// 히스토리 목록 selectBox dropdown
		$(".dropdown.sel1 > a.select").click(function() {
			var X=$(this).attr('id');
			if(X=='show1'){
				$(".dropdown.sel1 ul").hide();
				$(this).attr('id', 'hidden');
			} else {
				$(".dropdown.sel1 ul").show();
				$(this).attr('id', 'show1');
			}
		});
		$(".dropdown.sel2 > a.select").click(function() {
			var Y=$(this).attr('id');
			if(Y=='show2'){
				$(".dropdown.sel2 ul").hide();
				$(this).attr('id', 'hidden');
			} else {
				$(".dropdown.sel2 ul").show();
				$(this).attr('id', 'show2');
			}
		});
		$(".dropdown ul").mouseup(function() {
			return false
		});
		$(".dropdown a.select").mouseup(function() {
			return false
		});
		$(document).mouseup(function() {
			$(".dropdown > ul").hide();	// 20161005 수정
			$(".dropdown a.select").attr('id', '');
		});


		//모바일 로케이션 뎁스드롭다운 메뉴
		$mDepthMenuDropdown.on('click', function(e) {
			e.preventDefault();

			var $this = $(this);

			( !$this.hasClass('on') )? $this.addClass('on') : $this.removeClass('on');
		});


		//푸터 패밀리사이트 드롭다운 메뉴 (모바일 로케이션과 중첩되서 삭제키로)
		/*
		$familySiteDropdown.on('click', function(e) {
			e.preventDefault();
		*/
			/* var $this = $(this),
				target = $this.attr('href');

			( !$this.hasClass('on') )? $this.addClass('on') : $this.removeClass('on'); */
		/*
			$familySiteMenu.find('>ul>li.on').removeClass('on').find('.dir').hide();
			$mDepthMenuDropdown.triggerHandler('click');
		});
		*/

		//푸터 패밀리사이트 하위 메뉴
		$familySiteMenu.on('click', '>ul>li>a', function(e) {
			e.preventDefault();

			var $this = $(this),
				$parent = $this.parent('li'),
				$parents = $parent.siblings('li'),
				$dirs = $parents.children('.dir'),
				$dir = $this.next('.dir');
			var SPEED = 200;

			if ( !$parent.hasClass('on') ) {
				$parents.removeClass('on');
				$parent.addClass('on');
			} else {
				$parent.removeClass('on');
			}

			if ( $dir.is(':hidden') ) {
				$dirs.slideUp(SPEED);
				$dir.slideDown(SPEED);
			} else {
				$dir.slideUp(SPEED);
			}

			return false;

		});

		$familySiteDropdown.on('click', function(e){

			e.preventDefault();

			var $this = $(this),
				target = $this.attr('href');

			if ( $(target).is(':hidden') ) {
				$(target).show();
				$this.addClass('on');
			} else {
				$(target).hide();
				$this.removeClass('on');
			}

			return false;
		});

		$('html,body').on('click', function(e){
			$('.dropdown_menu').not('#mDepthMenu .dropdown_menu').css('display','none');
			$familySiteDropdown.removeClass('on');
		});

	}

	/**
	 * @method quickFixedScroll
	 * @description 퀵메뉴 고정 스크롤링
	 * @private
	 */

	$(function(){
	  if (!!$('.quickmenu').offset()) {
		var stickyTop = $('.quickmenu').offset().top;
		$(window).scroll(function(){
		  var windowTop = $(window).scrollTop();
		  if (530 < windowTop){
			$('.quickmenu').css({ position: 'fixed', top: 110 });
		  } else {
			  if ($('.quickmenu').hasClass('main')){ // 메인일때와 서브일때 위치값 따로처리
				$('.quickmenu').css({ position: 'absolute', top: 640 });
			  } else {
				$('.quickmenu').css({ position: 'absolute', top: 450 });
			  }
		  }
		});
	  }
	  /* 퀵메뉴 */
		 var click_tag = "1";
		 $('.quickmenu .aaa').click(function() {
			 if(click_tag == '1') { // 열렸을때
				 $(this).addClass('open');
				 $(this).removeClass('close');
				 //$(".quick_menu").show("fast");
				 $(".quick_menu").addClass('open');
				 $('.quick_menu .m1').hover(function() {$(".quick_menu").addClass('m1_open');},function() {$(".quick_menu").removeClass('m1_open');})
				 $('.quick_menu .m2').hover(function() {$(".quick_menu").addClass('m2_open');},function() {$(".quick_menu").removeClass('m2_open');})
				 $('.quick_menu .m3').hover(function() {$(".quick_menu").addClass('m3_open');},function() {$(".quick_menu").removeClass('m3_open');})
				 $('.quick_menu .m4').hover(function() {$(".quick_menu").addClass('m4_open');},function() {$(".quick_menu").removeClass('m4_open');})
				 $('.quick_menu .m5').hover(function() {$(".quick_menu").addClass('m5_open');},function() {$(".quick_menu").removeClass('m5_open');})
				click_tag  = '2';
			 } else { // 닫혔을때
				 $(this).addClass('close');
				 $(this).removeClass('open');
				 //$(".quick_menu").slideToggle("fast");
				 $(".quick_menu").removeClass('open');
				 click_tag = '1';
			 }
		 });
	});

	function quickFixedScroll() {
		var $quick = null,
			$quickMenu = null;
		var quickFlag = false;

		//로그인영역 존재 유무 확인
		/*
		if ( $('#quick').length > 0 && $('#quick').is(':visible') ) {
			var $quick = $('#quick'),
				quickOffsetTop = $quick.offset().top - $('header.fixed').height();

			$quick = $('#quick');
			$quickMenu = $('#quickMenu').find('a');
			quickFlag = true;
		}
		*/

		//스크롤링 이벤트 처리
		function scrolling($that) {
			//퀵메뉴영역
	    	if ( quickFlag ) {
	    		if ( $that.scrollTop() >= quickOffsetTop ) {
	    			//$quick.css('top', $that.scrollTop() + 80);
	    			$quick.addClass('fixed');
		    	} else {
		    		//$quick.css('top', '');
		    		$quick.removeClass('fixed');
		    	}
	    	}
		}

		if ( quickFlag ) {
			//퀵메뉴 클릭 이벤트 핸들러
			$quick.on('click', '>a', function(e) {
				e.preventDefault();

				( !$quick.hasClass('on') )? $quick.addClass('on') : $quick.removeClass('on');
			});

			//퀵메뉴 서브메뉴 이벤트 핸들러
			$quickMenu.on({
				mouseenter : function() {
					var $this = $(this),
						$parent = $this.parent('li');

					$parent.addClass('on');
				},
				mouseleave : function() {
					var $this = $(this),
						$parent = $this.parent('li');

					$parent.removeClass('on');
				}
			});
		}

		//윈도우 스크롤 이벤트 핸들러
		$(window).on('scroll', function() {
			var $this = $(this);

			scrolling($this);
		}).triggerHandler('scroll');
	}

	/**
	 * @method gnbMenu
	 * @description GNB 메뉴 마우스오버||아웃시 서브메뉴 노출||숨김
	 * @private
	 */
	function gnbMenu() {
		var $gnb = $('#gnb'),
			$gnbMenu = $gnb.find('>ul>li>a');
		var $dir = $gnb.find('.dir'),
			$dirMenu = $dir.find('>ul>li>a');
		var $dirArea = $gnb.children('.dir_area');
		var $bar = $gnb.children('.bar'),
			$li = $gnb.find('>ul>li'),
			$liCur = $gnb.find('>ul>li.current>a>span');
		var speed = 200;
		var state = 0;

		$gnb.on({
			mouseenter : function() {
				$dir.stop().slideDown(speed);
				$dirArea.stop().slideDown(speed);
			},
			mouseleave : function() {
				$dir.stop().slideUp(speed);
				$dirArea.stop().slideUp(speed);
				$gnbMenu.parent('li').siblings('li').removeClass('on');
				($('#gnb>ul>li').hasClass('current')) ? barControl($liCur) : barHide() ;
			}
		});

		//GNB메뉴 마우스 오버 이벤시  활성화 .on 클래스 추가||제거
		$gnbMenu.on({
			focusin : function() {
				$dir.show();
				$dirArea.show();
			},
			mouseenter : function() {
				$(this).parent('li').addClass('on').siblings('li').removeClass('on');
			}
		});

		//DIR메뉴 마우스 오버시 GNB메뉴 활성화 .on 클래스 추가||제거
		$dirMenu.on('mouseenter' , function() {
			var $gnbMenuItem = $(this).closest('.dir').parent('li');

			if ( !$gnbMenuItem.hasClass('on') ) {
				$gnbMenuItem.addClass('on').siblings('li').removeClass('on');
			}
		});

		//DIR영역 포커스아웃시 서브메뉴 닫기
		$dirArea.on('focusout', function() {
			$dir.hide();
			$dirArea.hide();
		});

		//bar영역 따라 다니기
		function barControl(cur){
			if(state == 0){
				state = 1;
				$bar.css({left : cur.offset().left - $gnb.offset().left, width : cur.width()}).stop().animate({
					opacity : 1
				}, speed);
			}else {
				$bar.stop().animate({
					left : cur.offset().left - $gnb.offset().left,
					width : cur.width(),
					opacity : 1
				}, speed);
			}
		}

		function barHide(){
			$bar.stop().animate({opacity : 0}, speed);
		}

		if($('#gnb>ul>li').hasClass('current')) {barControl($liCur);}

		$li.on('mouseenter', function(){
			var $thisTxt = $(this).find('span');
			barControl($thisTxt);
		});

	}

	/**
	 * @method utilMenu
	 * @description util 메뉴
	 * @private
	 */
	function utilMenu() {
		var $body = $('body');
		var $html = $('html');
		var $btnUtil = $('#btnUtil');
		var $allMenu = $('#allMenu');
		var $ugnb = $('#ugnb'),
			$ugnbMenu = $ugnb.find('>ul>li>a'),
			$ugnbDirs = $ugnbMenu.next('.dir');

		//전체메뉴 버튼 이벤트 핸들러
		$btnUtil.on('click', function(e) {
			e.preventDefault();

			var $this = $(this);
			var target = $this.attr('href');

			$body.addClass('pause');
			$html.addClass('pause');

			$ugnbMenu.parent('li').removeClass('on');
			$ugnbDirs.hide();

			if ( $('header').hasClass('fixed') ) {
				$('#headerDimmed').show();
			}

			$('#dimmed').show();
			//$(target).show();
			$(target).addClass('on');
		});

		//전체메뉴 > ugnb메뉴 클릭시 슬라이드
		$ugnbMenu.on('click', function(e) {
			e.preventDefault();

			var $this = $(this);
			var $dir = $this.next('.dir'),
				$parentItem = $this.parent('li'),
				$dirs = $parentItem.siblings('li').children('.dir');
			var SPEED = 200;

			if ( $dir.is(':hidden') ) {
				$parentItem.addClass('on').siblings('li').removeClass('on');
				$dirs.slideUp(SPEED);
				$dir.slideDown(SPEED);
			} else {
				$parentItem.removeClass('on');
				$dir.slideUp(SPEED);
			}
		});

		//전체메뉴 닫기 이벤트 핸들러
		$allMenu.on('click', '>a.clse', function(e) {
			e.preventDefault();

			var $this = $(this);
			var target = $this.attr('href');

			$body.removeClass('pause');
			$html.removeClass('pause');

			if ( $('header').hasClass('fixed') ) {
				$('#headerDimmed').hide();
			}

			$('#dimmed').hide();
			//$(target).hide();
			$(target).removeClass('on');
		});
	}

	/**
	 * @method fixedHeaderScroll
	 * @description 헤더 고정 스크롤링
	 * @private
	 */
	function fixedHeaderScroll() {
		var $body = $('body');
		var $html = $('html');
		var $header = $('header'),
			headerHgt = $header.height();
		var $container = $('#container');

		/*//모바일 초기화
		if ( $body.attr('data-match') === 'mobile' ) {
			$header.removeClass('fixed');
    		$container.removeClass('container_e1');
		}*/

		//스크롤링 이벤트 처리
		function scrolling($that) {
			//if ( $body.attr('data-match') === 'mobile' ) {
			//	$header.removeClass('fixed');
	    	//	$container.removeClass('container_e1');
			//} else {
				//헤더영역
				if ( $that.scrollTop() >= headerHgt ) {
		    		$header.addClass('fixed');
		    		$container.addClass('container_e1');
		    	} else {
		    		$header.removeClass('fixed');
		    		$container.removeClass('container_e1');
		    	}
			//}
		}

		//윈도우 스크롤 이벤트 핸들러
		$(window).on('scroll', function() {
			var $this = $(this);

			scrolling($this);
		}).triggerHandler('scroll');
	}

	/**
	 * @method fBtnTopFn
	 * @description 푸터 탑버튼 클릭 이벤트 핸들러
	 * @private
	 */
	function fBtnTopFn() {
		var $btnTop = $('#btnTop');
		var $btnMTop = $('#btnMTop');

		$btnTop.on('click', function(e) {
			e.preventDefault();

			$('html, body').animate({
				scrollTop : 0
			});
		});

		$btnMTop.on('click', function(e) {
			e.preventDefault();

			$btnTop.triggerHandler('click');
		});
	}

	/**
	 * @method fNoticeFn
	 * @description 푸터 공지사항
	 * @private
	 */
	function fNoticeFn(){
		var newsSlider = $('#notice ul').bxSlider({
			mode: 'vertical',
			speed : 500, //400
			pause : 6000, //4000
			auto: true,
			pager: false,
			controls: false,
			slideMargin: 0,
			touchEnabled: false
		});
	}

	/**
	 * @method initEvtListener
	 * @description 초기 이벤트 핸들러
	 * @private
	 */
	function initEvtListener() {
		//팝업레이어 노출/숨김
		$('[data-lypop]').on('click', function(e) {

			//$('.ly_pop').css("top", ($(document).scrollTop() + 50) + "px");
			$('.ly_pop').css("top", ($(document).scrollTop() + 0) + "px");

			e.preventDefault();

			var $body = $('body');
			var $html = $('html');
			var $this = $(this);
			var target = $this.attr('href');
			var dataType = $this.data('lypop');

			switch ( dataType ) {
				case 'open' :
					$body.addClass('pause');

					$(function(){
						var height = $(document).scrollTop();
						if (height <= "193"){
							$('#headerDimmed').hide();
						} else {
							$('#headerDimmed').show();
						}

						$(window).scroll(function(){
							var height = $(document).scrollTop();
							if ( $('header').hasClass('fixed') && height >= "193" ) {
								$('#headerDimmed').show();
							} else {
								$('#headerDimmed').hide();
							}
						})
					})

					$('#dimmed').show();
					$(target).show();
				break;
				case 'close' :
					$body.removeClass('pause');
					$html.removeClass('pause');

					$(window).scroll(function(){
						var height = $(document).scrollTop();
						if ( $('header').hasClass('fixed') && height >= "193" ) {
							$('#headerDimmed').hide();
						}
					})

					$('#headerDimmed').hide();
					$('#dimmed').hide();
					$(target).hide();
				break;
			}
		});

		//새창팝업 열기
		$('[data-popup]').on('click', function(e) {
			e.preventDefault();

			var $body = $('body');
			var $html = $('html');
			var $this = $(this);
			var href = $this.attr('href');

			function win(href, options) {
				var wid = options.winWid,
					hgt = options.winHgt;

				window.open(href, 'popup', 'width=' + wid + ', height=' + hgt + ', resizable=no');
			}

			switch ( $body.attr('data-match') ) {
				case 'web' :
					win(href, {winWid:1100, winHgt: 684});
				break;
				case 'tablet' :
				case 'mobile' :
					win(href, {winWid:1000, winHgt: 684});
				break;
			}
		});
	}

	/**
	 * @method 페럴렉스 스크롤
	 * @description skrollrFn
	 */
	function skrollrFn() {
		var skrl = skrollr;

		//브라우저 해상도 분기 처리
		function mediaqueryresponse() {
			if ( window.matchMedia(mobile).matches ) {
				skrl.init().destroy();
			} else if ( window.matchMedia(tablet).matches ) {
				skrl.init();
			} else if ( window.matchMedia(web).matches ) {
				skrl.init();
			}
		}

		//브라우저 브레이크 포인트 매칭
		if ( window.matchMedia ) {
			var mobile = '(max-width: 768px)',
				tablet = '(max-width: 1107px) and (min-width: 769px)',
				web = '(min-width: 1108px)';

			var mqls = [
				window.matchMedia(mobile),
				window.matchMedia(tablet),
				window.matchMedia(web)
	        ];

			/*
			for ( var i = 0, len = mqls.length; i < len; i++ ) {
				mediaqueryresponse(mqls[i]);
			    mqls[i].addListener(mediaqueryresponse);
			}
			*/
		}
	}

	/**
	 * @method visualFn
	 * @description 비주얼 이미지롤링
	 */
	function visualFn() {
		var $bxslider = $('#bxslider');
		var imgMaxLen = $bxslider.find('img').length;
		var $progressBar = $('#progressBar');
		var progressBarWid = $progressBar.width();
		var pitMove = 0;
		var count = 1;
		var slider = $bxslider.bxSlider();

		function sliderLoad() {
			// 이동할 거리
			pitMove = progressBarWid / (imgMaxLen - 1);

			// 전체 페이징 갯수 보이기
			$('#total').text(imgMaxLen);
		}

		// slide가 1개일때 control비활성화
		/*
		var numberOfImages = $('.visual #bxslider li').length;
		if( numberOfImages > 2 ) {
			$('.btn_prev, .btn_next').css('z-index','-1');
		} else {
			$('.btn_prev, .btn_next').css('z-index','99999');
		}
		*/

		function slidePrev() {
			var posX = 0;

			if ( count <= 1 ) { //처음이면
				count = imgMaxLen;
			} else { //처음이 아니면
				count--;
			}

			posX = pitMove * (count - 1);

			$('#progressBar>.pit').animate({
				left : posX + 'px'
			});

			$('#count').text(count);
		}

		function slideNext() {
			var posX = pitMove * count;

			if ( posX > progressBarWid ) { //마지막이면
				posX = 0;
			}

			$('#progressBar>.pit').animate({
				left : posX + 'px'
			});

			if ( count >= imgMaxLen ) { //마지막이면
				count = 1;
			} else { //마지막이 아니면
				count++;
			}

			$('#count').text(count);
		}

		//브라우저 해상도 분기 처리
		function mediaqueryresponse() {
			if ( window.matchMedia(mobile).matches ) {
				//mobile
				slider.reloadSlider({
					auto: true,
					autoControls: false,
				    minSlides: 1,
				    maxSlides: 1,
				    moveSlides: 1,
				    onSliderLoad : function() {
				    	sliderLoad();
					},
					onSlidePrev : function($slideElement, oldIndex, newIndex) {
						slidePrev();
					},
					onSlideNext : function($slideElement, oldIndex, newIndex) {
						slideNext();
					}
				});
			} else {
				//desktop
				slider.reloadSlider({
					auto: true,
					autoControls: false,
					slideWidth: 690,
				    minSlides: 3,
				    maxSlides: 3,
				    moveSlides: 1,
				    slideMargin: 100,
					speed: 700,
				    responsive: false,
					onSliderLoad : function() {
						sliderLoad();

						// 가운데 정렬
						$('.visual .bx-wrapper').css({
							position: 'absolute',
							left: '50%',
							marginLeft : -parseInt($('.bx-wrapper').css('maxWidth'))/2 + 'px'
						});

					},
					onSlidePrev : function($slideElement, oldIndex, newIndex) {
						slidePrev();
					},
					onSlideNext : function($slideElement, oldIndex, newIndex) {
						slideNext();
					}
				});
			}
		}

		//브라우저 브레이크 포인트 매칭
		if ( window.matchMedia ) {
			var mobile = '(max-width: 768px)';
			var mqls = window.matchMedia(mobile);

			mediaqueryresponse(mqls);
			mqls.addListener(mediaqueryresponse);
		}

		//이전 버튼 클릭 이벤트
		$('#visualBtnPrev').on('click', function(e) {
			e.preventDefault();

			slider.goToPrevSlide();
		});

		//다음 버튼 클릭 이벤트
		$('#visualBtnNext').on('click', function(e) {
			e.preventDefault();

			slider.goToNextSlide();
		});
	}

	/**
	 * @method bannerFn
	 * @description 배너롤링
	 */
	function bannerFn() {
		if ( $('#bxslider2 li').length <= 1 ) {
			return false;
		}

		var $bxslider = $('#bxslider2').bxSlider({
			//mode : 'vertical',
			auto : true,
			controls : false
		});
	}

	/**
	 * @method structureLstMap
	 * @description 프로그램 > 투어 맵
	 */
	function structureLstMap() {
		var $structureLst = $('#structureLst');
		var $structureMap = $('#structureMap');

		$structureLst.on('click', 'a', function(e) {
			e.preventDefault();

			var $this = $(this),
				target = $this.attr('href');
			var parent = $this.parent('li');

			$structureLst.find('li').removeClass('on');
			parent.addClass('on');

			$structureMap.children('img').hide();
			$(target).show();
		});
	}
	function structureLstMap_m() {
		var $structureLst_m = $('#structureLst_m');
		var $structureMap_m = $('#structureMap_m');

		$structureLst_m.on('click', 'a', function(e) {
			e.preventDefault();

			var $this = $(this),
				target = $this.attr('href');
			var parent = $this.parent('li');

			$structureLst_m.find('li').removeClass('on');
			parent.addClass('on');

			$structureMap_m.children('img').hide();
			$(target).show();
		});
	}



	/**
	 * @method thumbLstModuleType
	 * @description 썸네일 모듈 타입
	 */
	function thumbLstModuleType() {
		$(window).on('load', function() {
			var $thumbLst2 = $('#thumbLst2'),
				len = $thumbLst2.find('li').length;

			if ( len === 1 ) {
				$thumbLst2.addClass('thumb_lst2_v1');
			} else if ( len === 2 ) {
				$thumbLst2.addClass('thumb_lst2_v2');
			} else if ( len === 3 ) {
				$thumbLst2.addClass('thumb_lst2_v3');
			}
		});
	}

	/**
	 * @method tabsFn
	 * @description 탬메뉴
	 */
	function tabsFn() {
		//var hSectionHgt = $('#hsection').height() + 30;
		var $tabs = $('#tabs');

		$tabs.on('click', 'a', function(e) {
			e.preventDefault();

			var $this = $(this);
			var $parent = $this.parent('li');
			var target = $this.attr('href');
			var $tabCont = $('.tab_cont');

			$parent.addClass('on').siblings('li').removeClass('on');
			$tabCont.hide();
			$(target).show();
		});
	}

	/**
	 * @method fixedThumbViewCont
	 * @description 전시 상세페이지 고정 컨텐츠
	 */
	function fixedThumbViewCont() {
		var $body = $('body');
		var $html = $('html');
		var $header = $('header'),
			headerHgt = $header.height();
		var $thumbViewCont = $('#thumbViewCont'),
			thumbViewContOffsetTop = 0;
		var $tabs = $('#tabs'),
			tabsHgt = $tabs.outerHeight(true);
		var $tabCont = $('#tab1'),
			$tabContPic = $tabCont.children('.pic'),
			$tabContDesc = $tabCont.children('.desc'),
			tabContPicLsatPosTop = 0;
		var timer = 0;

		//모바일 초기화
		if ( $body.attr('data-match') === 'tablet' || $body.attr('data-match') === 'mobile' ) {
			$tabCont.css('height', '');
			$tabs.removeClass('fixed');
			$tabContDesc.removeClass('fixed');
		}

		//스크롤링 이벤트 처리
		function scrolling($that) {
			var scrollHeight = parseFloat($tabContPic.height() - $tabContDesc.height());
			var scrollTop = $that.scrollTop();

			if ( $body.attr('data-match') === 'tablet' || $body.attr('data-match') === 'mobile' ) {
				$tabCont.css('height', '');
				$tabs.removeClass('fixed');
				$tabContDesc.removeClass('fixed').removeClass('static');
			} else {
				if( scrollHeight > 0 ){
					if ( scrollTop < thumbViewContOffsetTop ) {
						$tabs.removeClass('fixed');
						$tabContDesc.removeClass('fixed');
					} else if ( (scrollTop >= thumbViewContOffsetTop) && (scrollTop <= tabContPicLsatPosTop) ) { //scrollHeight, tabContPicLsatPosTop
						$tabs.addClass('fixed');
						$tabContDesc.removeClass('static').addClass('fixed').css({top:''});
			    	} else {
						$tabContDesc.removeClass('fixed');
						$tabContDesc.addClass('static');
						//$tabContDesc.css({top:$tabContPic.find('li:last-child').position().top});
						$tabCont.css({height:''});
						$tabContDesc.css({top:scrollHeight});
					}
				}
			}
		}

		//초기화
		function init(that) {
			if ( $body.attr('data-match') !== 'mobile' ) {
				thumbViewContOffsetTop = $thumbViewCont.offset().top - ( headerHgt + tabsHgt );
				//tabContPicLsatPosTop = $tabContPic.find('li:last-child').offset().top - 200; //400
				tabContPicLsatPosTop = ( $thumbViewCont.position().top + $thumbViewCont.height() ) - $tabContDesc.height();

				var tabContPicHgt = $tabContPic.find('li').eq(0).children('img').height();

				if ( tabContPicHgt <= $tabContDesc.height()  ) {
					//$tabCont.height($tabContDesc.height() + ($tabContPic.height() - tabContPicHgt));
					$tabCont.css('height', Math.max($tabContDesc.height(), $tabContPic.height()));
				}
			}

			//윈도우 스크롤 이벤트 핸들러
			$(that).on('scroll', function() {
				var $this = $(this);

				scrolling($this);
			}).triggerHandler('scroll');
		}

		$(window)
			.on('load', function() {
				init(this);
			})
			.on('resize', function() {
				var $that = $(this);

				clearTimeout(timer);
			    timer = setTimeout(function() {
			    	$that.triggerHandler('load');
			    }, 150);
			});
	}

	/**
	 * @method pagingPreviewFn
	 * @description 전시 소장품 미리보기 페이징
	 */
	function pagingPreviewFn() {
		var $pagingPreview = $('#pagingPreview'),
			$pagingPreviewBtn = $pagingPreview.find('.btn>a');

		$pagingPreviewBtn.on({
			mouseenter : function() {
				var $this = $(this),
					$parent = $this.parent('.btn');

				$parent.addClass('on');
			},
			mouseleave : function() {
				var $this = $(this),
					$parent = $this.parent('.btn');

				$parent.removeClass('on');
			}
		});
	}

	/**
	 * @method lyProgramApplyFn
	 * @description 프로그램 신청 팝업 그룹신청
	 */
	function lyProgramApplyFn() {
		var $bbsTbl = $('#bbsTbl');
		var $inptGroupApplChk = $('#inptGroupApplChk');
		var $rowApplyCon = $('#rowApplyCon'); // 그룹신청시 사라지는 신청내용
		var $groupApplyArea = $('#groupApplyArea'); // 그룹신청시 밑에 생기는 내용
		var $personCombobox = $('#personCombobox');
		var $tblApplyArea = $('#tblApplyArea');
		var _tmplTblApply = $.trim($('#tmplTblApply').html());

		//그룹신청
		$inptGroupApplChk.on('click', ':checkbox', function(e) {
			var $this = $(this);

			if ( $this.prop('checked') ) {
				$rowApplyCon.hide();
				$groupApplyArea.show();
				$bbsTbl.animate({
					scrollTop : $bbsTbl[0].scrollHeight
				}, 200);
			} else {
				$rowApplyCon.show();
				$groupApplyArea.hide();
				$tblApplyArea.empty();
				$personCombobox.find('option:selected').prop('selected', false);
			}
		});

		//인원선택
		$personCombobox.on('change', 'select', function() {
			var $this = $(this),
				optionVal = $this.children('option:selected').val();

			if ( $tblApplyArea.children('.tbl_apply').length < 1 ) {
				$bbsTbl.animate({
					scrollTop : 370
				}, 200);
			}

			$tblApplyArea.empty();

			for ( var i = 0, len = optionVal; i < len; i++ ) {
				var _tmpl = _tmplTblApply.replace(/{{genderIdx}}/ig, i);

				$tblApplyArea.append(_tmpl);
			}

			matchMediaFn();
			$tblApplyArea.show();
		});
	}

	/**
	 * @method policyScrollSpy
	 * @description 개인정보 취급방침 스크롤스파이
	 */
	function policyScrollSpy() {
		var $policySc = $('#policySc');


		//개인정보 항목 클릭 이벤트 핸들러
		$policySc.on('click', 'a', function(e) {
			e.preventDefault();

			var $this = $(this),
				target = $this.attr('href');
			var headerFixedHgt = 60;

			$('html, body').animate({
				scrollTop : $(target).offset().top - headerFixedHgt
			});
		});
	}

	/**
	 * @method _init
	 * @description 초기화
	 * @private
	 */
    function _init() {
    	deviceChk(); //디바이스 체크
    	matchMediaFn(); //해상도 체크
    	initEvtListener(); //초기 이벤트 핸들러
    }


    //윈도우 로드 이벤트 핸들러
	$(window).on('load', function() {
		_init(); //초기화
		dropdownToggle(); //드롭메뉴 토글
		gnbMenu(); //GNB메뉴
		utilMenu(); //유틸메뉴
		fixedHeaderScroll(); //헤더 고정 스크롤링
		fBtnTopFn(); //푸터 탑버튼
		fNoticeFn(); //푸터 공지사항
		quickFixedScroll(); //퀵메뉴 고정 스크롤링
	});

	/**
	 * @returns {Object} SEWHA Public Member Module
	 */
	return {
		skrollrFn : skrollrFn, //페럴렉스 스크롤
		visualFn : visualFn, //비주얼 이미지롤링
		bannerFn : bannerFn, //배너롤링
		structureLstMap : structureLstMap, //프로그램 > 투어 맵
		structureLstMap_m: structureLstMap_m, //프로그램 > 투어 맵
		thumbLstModuleType : thumbLstModuleType, //썸네일 모듈 타입
		tabsFn : tabsFn, //탭 메뉴
		fixedThumbViewCont : fixedThumbViewCont, //전시 상세 고정 스크롤
		pagingPreviewFn : pagingPreviewFn, //전시 소장품 미리보기 페이징
		lyProgramApplyFn : lyProgramApplyFn, //프로그램 신청 팝업 그룹신청
		policyScrollSpy :  policyScrollSpy //개인정보 취급방침 스크롤스파이
	};

})(jQuery);