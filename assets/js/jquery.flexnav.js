/*
	FlexNav.js 1.3.3

	Created by Jason Weaver http://jasonweaver.name
	Released under http://unlicense.org/

//
*/


(function() {
  var jQuery;

  jQuery = jQuery;

  jQuery.fn.flexNav = function(options) {
    var jQuerynav, jQuerytop_nav_items, breakpoint, count, nav_percent, nav_width, resetMenu, resizer, settings, showMenu, toggle_selector, touch_selector;
    settings = jQuery.extend({
      'animationSpeed': 250,
      'transitionOpacity': true,
      'buttonSelector': '.menu-button',
      'hoverIntent': false,
      'hoverIntentTimeout': 150,
      'calcItemWidths': false,
      'hover': true
    }, options);
    jQuerynav = jQuery(this);
    jQuerynav.addClass('with-js');
    if (settings.transitionOpacity === true) {
      jQuerynav.addClass('opacity');
    }
    jQuerynav.find("li").each(function() {
      if (jQuery(this).has("ul").length) {
        return jQuery(this).addClass("item-with-ul").find("ul").hide();
      }
    });
    if (settings.calcItemWidths === true) {
      jQuerytop_nav_items = jQuerynav.find('>li');
      count = jQuerytop_nav_items.length;
      nav_width = 100 / count;
      nav_percent = nav_width + "%";
    }
    if (jQuerynav.data('breakpoint')) {
      breakpoint = jQuerynav.data('breakpoint');
    }
    showMenu = function() {
      if (jQuerynav.hasClass('lg-screen') === true && settings.hover === true) {
        if (settings.transitionOpacity === true) {
          return jQuery(this).find('>ul').addClass('flexnav-show').stop(true, true).animate({
            height: ["toggle", "swing"],
            opacity: "toggle"
          }, settings.animationSpeed);
        } else {
          return jQuery(this).find('>ul').addClass('flexnav-show').stop(true, true).animate({
            height: ["toggle", "swing"]
          }, settings.animationSpeed);
        }
      }
    };
    resetMenu = function() {
      if (jQuerynav.hasClass('lg-screen') === true && jQuery(this).find('>ul').hasClass('flexnav-show') === true && settings.hover === true) {
        if (settings.transitionOpacity === true) {
          return jQuery(this).find('>ul').removeClass('flexnav-show').stop(true, true).animate({
            height: ["toggle", "swing"],
            opacity: "toggle"
          }, settings.animationSpeed);
        } else {
          return jQuery(this).find('>ul').removeClass('flexnav-show').stop(true, true).animate({
            height: ["toggle", "swing"]
          }, settings.animationSpeed);
        }
      }
    };
    resizer = function() {
      var selector;
      if (jQuery(window).width() <= breakpoint) {
        jQuerynav.removeClass("lg-screen").addClass("sm-screen");
        if (settings.calcItemWidths === true) {
          jQuerytop_nav_items.css('width', '100%');
        }
        selector = settings['buttonSelector'] + ', ' + settings['buttonSelector'] + ' .touch-button';
        jQuery(selector).removeClass('active');
        return jQuery('.one-page li a').on('click', function() {
          return jQuerynav.removeClass('flexnav-show');
        });
      } else if (jQuery(window).width() > breakpoint) {
        jQuerynav.removeClass("sm-screen").addClass("lg-screen");
        if (settings.calcItemWidths === true) {
          jQuerytop_nav_items.css('width', nav_percent);
        }
        jQuerynav.removeClass('flexnav-show').find('.item-with-ul').on();
        jQuery('.item-with-ul').find('ul').removeClass('flexnav-show');
        resetMenu();
        if (settings.hoverIntent === true) {
          return jQuery('.item-with-ul').hoverIntent({
            over: showMenu,
            out: resetMenu,
            timeout: settings.hoverIntentTimeout
          });
        } else if (settings.hoverIntent === false) {
          return jQuery('.item-with-ul').on('mouseenter', showMenu).on('mouseleave', resetMenu);
        }
      }
    };
    jQuery(settings['buttonSelector']).data('navEl', jQuerynav);
    touch_selector = '.item-with-ul, ' + settings['buttonSelector'];
    jQuery(touch_selector).append('<span class="touch-button"><i class="navicon">&#9660;</i></span>');
    toggle_selector = settings['buttonSelector'] + ', ' + settings['buttonSelector'] + ' .touch-button';
    jQuery(toggle_selector).on('click', function(e) {
      var jQuerybtnParent, jQuerythisNav, bs;
      jQuery(toggle_selector).toggleClass('active');
      e.preventDefault();
      e.stopPropagation();
      bs = settings['buttonSelector'];
      jQuerybtnParent = jQuery(this).is(bs) ? jQuery(this) : jQuery(this).parent(bs);
      jQuerythisNav = jQuerybtnParent.data('navEl');
      return jQuerythisNav.toggleClass('flexnav-show');
    });
    jQuery('.touch-button').on('click', function(e) {
      var jQuerysub, jQuerytouchButton;
      jQuerysub = jQuery(this).parent('.item-with-ul').find('>ul');
      jQuerytouchButton = jQuery(this).parent('.item-with-ul').find('>span.touch-button');
      if (jQuerynav.hasClass('lg-screen') === true) {
        jQuery(this).parent('.item-with-ul').siblings().find('ul.flexnav-show').removeClass('flexnav-show').hide();
      }
      if (jQuerysub.hasClass('flexnav-show') === true) {
        jQuerysub.removeClass('flexnav-show').slideUp(settings.animationSpeed);
        return jQuerytouchButton.removeClass('active');
      } else if (jQuerysub.hasClass('flexnav-show') === false) {
        jQuerysub.addClass('flexnav-show').slideDown(settings.animationSpeed);
        return jQuerytouchButton.addClass('active');
      }
    });
    jQuerynav.find('.item-with-ul *').focus(function() {
      jQuery(this).parent('.item-with-ul').parent().find(".open").not(this).removeClass("open").hide();
      return jQuery(this).parent('.item-with-ul').find('>ul').addClass("open").show();
    });
    resizer();
    return jQuery(window).on('resize', resizer);
  };

}).call(this);
