/*!
 * SmartMenus jQuery Plugin Bootstrap Addon - v0.3.0 - January 27, 2016
 * http://www.smartmenus.org/
 *
 * Copyright Vasil Dinkov, Vadikom Web Ltd.
 * http://vadikom.com
 *
 * Licensed MIT
 */

(function(factory) {
	if (typeof define === 'function' && define.amd) {
		// AMD
		define(['jquery', 'jquery.smartmenus'], factory);
	} else if (typeof module === 'object' && typeof module.exports === 'object') {
		// CommonJS
		module.exports = factory(require('jquery'));
	} else {
		// Global jQuery
		factory(jQuery);
	}
} (function(jQuery) {

	jQuery.extend(jQuery.SmartMenus.Bootstrap = {}, {
		keydownFix: false,
		init: function() {
			// init all navbars that don't have the "data-sm-skip" attribute set
			var jQuerynavbars = jQuery('ul.navbar-nav:not([data-sm-skip])');
			jQuerynavbars.each(function() {
				var jQuerythis = jQuery(this),
					obj = jQuerythis.data('smartmenus');
				// if this navbar is not initialized
				if (!obj) {
					jQuerythis.smartmenus({

							// these are some good default options that should work for all
							// you can, of course, tweak these as you like
							subMenusSubOffsetX: 2,
							subMenusSubOffsetY: -6,
							subIndicators: false,
							collapsibleShowFunction: null,
							collapsibleHideFunction: null,
							rightToLeftSubMenus: jQuerythis.hasClass('navbar-right'),
							bottomToTopSubMenus: jQuerythis.closest('.navbar').hasClass('navbar-fixed-bottom')
						})
						.bind({
							// set/unset proper Bootstrap classes for some menu elements
							'show.smapi': function(e, menu) {
								var jQuerymenu = jQuery(menu),
									jQueryscrollArrows = jQuerymenu.dataSM('scroll-arrows');
								if (jQueryscrollArrows) {
									// they inherit border-color from body, so we can use its background-color too
									jQueryscrollArrows.css('background-color', jQuery(document.body).css('background-color'));
								}
								jQuerymenu.parent().addClass('open');
							},
							'hide.smapi': function(e, menu) {
								jQuery(menu).parent().removeClass('open');
							}
						});

					function onInit() {
						// set Bootstrap's "active" class to SmartMenus "current" items (should someone decide to enable markCurrentItem: true)
						jQuerythis.find('a.current').parent().addClass('active');
						// remove any Bootstrap required attributes that might cause conflicting issues with the SmartMenus script
						jQuerythis.find('a.has-submenu').each(function() {
							var jQuerythis = jQuery(this);
							if (jQuerythis.is('[data-toggle="dropdown"]')) {
								jQuerythis.dataSM('bs-data-toggle-dropdown', true).removeAttr('data-toggle');
							}
							if (jQuerythis.is('[role="button"]')) {
								jQuerythis.dataSM('bs-role-button', true).removeAttr('role');
							}
						});
					}

					onInit();

					function onBeforeDestroy() {
						jQuerythis.find('a.current').parent().removeClass('active');
						jQuerythis.find('a.has-submenu').each(function() {
							var jQuerythis = jQuery(this);
							if (jQuerythis.dataSM('bs-data-toggle-dropdown')) {
								jQuerythis.attr('data-toggle', 'dropdown').removeDataSM('bs-data-toggle-dropdown');
							}
							if (jQuerythis.dataSM('bs-role-button')) {
								jQuerythis.attr('role', 'button').removeDataSM('bs-role-button');
							}
						});
					}

					obj = jQuerythis.data('smartmenus');

					// custom "isCollapsible" method for Bootstrap
					obj.isCollapsible = function() {
						return !/^(left|right)jQuery/.test(this.jQueryfirstLink.parent().css('float'));
					};

					// custom "refresh" method for Bootstrap
					obj.refresh = function() {
						jQuery.SmartMenus.prototype.refresh.call(this);
						onInit();
						// update collapsible detection
						detectCollapsible(true);
					}

					// custom "destroy" method for Bootstrap
					obj.destroy = function(refresh) {
						onBeforeDestroy();
						jQuery.SmartMenus.prototype.destroy.call(this, refresh);
					}

					// keep Bootstrap's default behavior for parent items when the "data-sm-skip-collapsible-behavior" attribute is set to the ul.navbar-nav
					// i.e. use the whole item area just as a sub menu toggle and don't customize the carets
					if (jQuerythis.is('[data-sm-skip-collapsible-behavior]')) {
						jQuerythis.bind({
							// click the parent item to toggle the sub menus (and reset deeper levels and other branches on click)
							'click.smapi': function(e, item) {
								if (obj.isCollapsible()) {
									var jQueryitem = jQuery(item),
										jQuerysub = jQueryitem.parent().dataSM('sub');
									if (jQuerysub && jQuerysub.dataSM('shown-before') && jQuerysub.is(':visible')) {
										obj.itemActivate(jQueryitem);
										obj.menuHide(jQuerysub);
										return false;
									}
								}
							}
						});
					}

					// onresize detect when the navbar becomes collapsible and add it the "sm-collapsible" class
					var winW;
					function detectCollapsible(force) {
						var newW = obj.getViewportWidth();
						if (newW != winW || force) {
							var jQuerycarets = jQuerythis.find('.caret');
							if (obj.isCollapsible()) {
								jQuerythis.addClass('sm-collapsible');
								// set "navbar-toggle" class to carets (so they look like a button) if the "data-sm-skip-collapsible-behavior" attribute is not set to the ul.navbar-nav
								if (!jQuerythis.is('[data-sm-skip-collapsible-behavior]')) {
									jQuerycarets.addClass('navbar-toggle sub-arrow');
								}
							} else {
								jQuerythis.removeClass('sm-collapsible');
								if (!jQuerythis.is('[data-sm-skip-collapsible-behavior]')) {
									jQuerycarets.removeClass('navbar-toggle sub-arrow');
								}
							}
							winW = newW;
						}
					};
					detectCollapsible();
					jQuery(window).bind('resize.smartmenus' + obj.rootId, detectCollapsible);
				}
			});
			// keydown fix for Bootstrap 3.3.5+ conflict
			if (jQuerynavbars.length && !jQuery.SmartMenus.Bootstrap.keydownFix) {
				// unhook BS keydown handler for all dropdowns
				jQuery(document).off('keydown.bs.dropdown.data-api', '.dropdown-menu');
				// restore BS keydown handler for dropdowns that are not inside SmartMenus navbars
				if (jQuery.fn.dropdown && jQuery.fn.dropdown.Constructor) {
					jQuery(document).on('keydown.bs.dropdown.data-api', '.dropdown-menu:not([id^="sm-"])', jQuery.fn.dropdown.Constructor.prototype.keydown);
				}
				jQuery.SmartMenus.Bootstrap.keydownFix = true;
			}
		}
	});

	// init ondomready
	jQuery(jQuery.SmartMenus.Bootstrap.init);

	return jQuery;
}));