/*!
 * SmartMenus jQuery Plugin - v1.0.0 - January 27, 2016
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
		define(['jquery'], factory);
	} else if (typeof module === 'object' && typeof module.exports === 'object') {
		// CommonJS
		module.exports = factory(require('jquery'));
	} else {
		// Global jQuery
		factory(jQuery);
	}
} (function(jQuery) {

	var menuTrees = [],
		IE = !!window.createPopup, // detect it for the iframe shim
		mouse = false, // optimize for touch by default - we will detect for mouse input
		touchEvents = 'ontouchstart' in window, // we use this just to choose between toucn and pointer events, not for touch screen detection
		mouseDetectionEnabled = false,
		requestAnimationFrame = window.requestAnimationFrame || function(callback) { return setTimeout(callback, 1000 / 60); },
		cancelAnimationFrame = window.cancelAnimationFrame || function(id) { clearTimeout(id); };

	// Handle detection for mouse input (i.e. desktop browsers, tablets with a mouse, etc.)
	function initMouseDetection(disable) {
		var eNS = '.smartmenus_mouse';
		if (!mouseDetectionEnabled && !disable) {
			// if we get two consecutive mousemoves within 2 pixels from each other and within 300ms, we assume a real mouse/cursor is present
			// in practice, this seems like impossible to trick unintentianally with a real mouse and a pretty safe detection on touch devices (even with older browsers that do not support touch events)
			var firstTime = true,
				lastMove = null;
			jQuery(document).bind(getEventsNS([
				['mousemove', function(e) {
					var thisMove = { x: e.pageX, y: e.pageY, timeStamp: new Date().getTime() };
					if (lastMove) {
						var deltaX = Math.abs(lastMove.x - thisMove.x),
							deltaY = Math.abs(lastMove.y - thisMove.y);
	 					if ((deltaX > 0 || deltaY > 0) && deltaX <= 2 && deltaY <= 2 && thisMove.timeStamp - lastMove.timeStamp <= 300) {
							mouse = true;
							// if this is the first check after page load, check if we are not over some item by chance and call the mouseenter handler if yes
							if (firstTime) {
								var jQuerya = jQuery(e.target).closest('a');
								if (jQuerya.is('a')) {
									jQuery.each(menuTrees, function() {
										if (jQuery.contains(this.jQueryroot[0], jQuerya[0])) {
											this.itemEnter({ currentTarget: jQuerya[0] });
											return false;
										}
									});
								}
								firstTime = false;
							}
						}
					}
					lastMove = thisMove;
				}],
				[touchEvents ? 'touchstart' : 'pointerover pointermove pointerout MSPointerOver MSPointerMove MSPointerOut', function(e) {
					if (isTouchEvent(e.originalEvent)) {
						mouse = false;
					}
				}]
			], eNS));
			mouseDetectionEnabled = true;
		} else if (mouseDetectionEnabled && disable) {
			jQuery(document).unbind(eNS);
			mouseDetectionEnabled = false;
		}
	}

	function isTouchEvent(e) {
		return !/^(4|mouse)jQuery/.test(e.pointerType);
	}

	// returns a jQuery bind() ready object
	function getEventsNS(defArr, eNS) {
		if (!eNS) {
			eNS = '';
		}
		var obj = {};
		jQuery.each(defArr, function(index, value) {
			obj[value[0].split(' ').join(eNS + ' ') + eNS] = value[1];
		});
		return obj;
	}

	jQuery.SmartMenus = function(elm, options) {
		this.jQueryroot = jQuery(elm);
		this.opts = options;
		this.rootId = ''; // internal
		this.accessIdPrefix = '';
		this.jQuerysubArrow = null;
		this.activatedItems = []; // stores last activated A's for each level
		this.visibleSubMenus = []; // stores visible sub menus UL's (might be in no particular order)
		this.showTimeout = 0;
		this.hideTimeout = 0;
		this.scrollTimeout = 0;
		this.clickActivated = false;
		this.focusActivated = false;
		this.zIndexInc = 0;
		this.idInc = 0;
		this.jQueryfirstLink = null; // we'll use these for some tests
		this.jQueryfirstSub = null; // at runtime so we'll cache them
		this.disabled = false;
		this.jQuerydisableOverlay = null;
		this.jQuerytouchScrollingSub = null;
		this.cssTransforms3d = 'perspective' in elm.style || 'webkitPerspective' in elm.style;
		this.wasCollapsible = false;
		this.init();
	};

	jQuery.extend(jQuery.SmartMenus, {
		hideAll: function() {
			jQuery.each(menuTrees, function() {
				this.menuHideAll();
			});
		},
		destroy: function() {
			while (menuTrees.length) {
				menuTrees[0].destroy();
			}
			initMouseDetection(true);
		},
		prototype: {
			init: function(refresh) {
				var self = this;

				if (!refresh) {
					menuTrees.push(this);

					this.rootId = (new Date().getTime() + Math.random() + '').replace(/\D/g, '');
					this.accessIdPrefix = 'sm-' + this.rootId + '-';

					if (this.jQueryroot.hasClass('sm-rtl')) {
						this.opts.rightToLeftSubMenus = true;
					}

					// init root (main menu)
					var eNS = '.smartmenus';
					this.jQueryroot
						.data('smartmenus', this)
						.attr('data-smartmenus-id', this.rootId)
						.dataSM('level', 1)
						.bind(getEventsNS([
							['mouseover focusin', jQuery.proxy(this.rootOver, this)],
							['mouseout focusout', jQuery.proxy(this.rootOut, this)],
							['keydown', jQuery.proxy(this.rootKeyDown, this)]
						], eNS))
						.delegate('a', getEventsNS([
							['mouseenter', jQuery.proxy(this.itemEnter, this)],
							['mouseleave', jQuery.proxy(this.itemLeave, this)],
							['mousedown', jQuery.proxy(this.itemDown, this)],
							['focus', jQuery.proxy(this.itemFocus, this)],
							['Fade', jQuery.proxy(this.itemFade, this)],
							['click', jQuery.proxy(this.itemClick, this)]
						], eNS));

					// hide menus on tap or click outside the root UL
					eNS += this.rootId;
					if (this.opts.hideOnClick) {
						jQuery(document).bind(getEventsNS([
							['touchstart', jQuery.proxy(this.docTouchStart, this)],
							['touchmove', jQuery.proxy(this.docTouchMove, this)],
							['touchend', jQuery.proxy(this.docTouchEnd, this)],
							// for Opera Mobile < 11.5, webOS browser, etc. we'll check click too
							['click', jQuery.proxy(this.docClick, this)]
						], eNS));
					}
					// hide sub menus on resize
					jQuery(window).bind(getEventsNS([['resize orientationchange', jQuery.proxy(this.winResize, this)]], eNS));

					if (this.opts.subIndicators) {
						this.jQuerysubArrow = jQuery('<span/>').addClass('sub-arrow');
						if (this.opts.subIndicatorsText) {
							this.jQuerysubArrow.html(this.opts.subIndicatorsText);
						}
					}

					// make sure mouse detection is enabled
					initMouseDetection();
				}

				// init sub menus
				this.jQueryfirstSub = this.jQueryroot.find('ul').each(function() { self.menuInit(jQuery(this)); }).eq(0);

				this.jQueryfirstLink = this.jQueryroot.find('a').eq(0);

				// find current item
				if (this.opts.markCurrentItem) {
					var reDefaultDoc = /(index|default)\.[^#\?\/]*/i,
						reHash = /#.*/,
						locHref = window.location.href.replace(reDefaultDoc, ''),
						locHrefNoHash = locHref.replace(reHash, '');
					this.jQueryroot.find('a').each(function() {
						var href = this.href.replace(reDefaultDoc, ''),
							jQuerythis = jQuery(this);
						if (href == locHref || href == locHrefNoHash) {
							jQuerythis.addClass('current');
							if (self.opts.markCurrentTree) {
								jQuerythis.parentsUntil('[data-smartmenus-id]', 'ul').each(function() {
									jQuery(this).dataSM('parent-a').addClass('current');
								});
							}
						}
					});
				}

				// save initial state
				this.wasCollapsible = this.isCollapsible();
			},
			destroy: function(refresh) {
				if (!refresh) {
					var eNS = '.smartmenus';
					this.jQueryroot
						.removeData('smartmenus')
						.removeAttr('data-smartmenus-id')
						.removeDataSM('level')
						.unbind(eNS)
						.undelegate(eNS);
					eNS += this.rootId;
					jQuery(document).unbind(eNS);
					jQuery(window).unbind(eNS);
					if (this.opts.subIndicators) {
						this.jQuerysubArrow = null;
					}
				}
				this.menuHideAll();
				var self = this;
				this.jQueryroot.find('ul').each(function() {
						var jQuerythis = jQuery(this);
						if (jQuerythis.dataSM('scroll-arrows')) {
							jQuerythis.dataSM('scroll-arrows').remove();
						}
						if (jQuerythis.dataSM('shown-before')) {
							if (self.opts.subMenusMinWidth || self.opts.subMenusMaxWidth) {
								jQuerythis.css({ width: '', minWidth: '', maxWidth: '' }).removeClass('sm-nowrap');
							}
							if (jQuerythis.dataSM('scroll-arrows')) {
								jQuerythis.dataSM('scroll-arrows').remove();
							}
							jQuerythis.css({ zIndex: '', top: '', left: '', marginLeft: '', marginTop: '', display: '' });
						}
						if ((jQuerythis.attr('id') || '').indexOf(self.accessIdPrefix) == 0) {
							jQuerythis.removeAttr('id');
						}
					})
					.removeDataSM('in-mega')
					.removeDataSM('shown-before')
					.removeDataSM('ie-shim')
					.removeDataSM('scroll-arrows')
					.removeDataSM('parent-a')
					.removeDataSM('level')
					.removeDataSM('beforefirstshowfired')
					.removeAttr('role')
					.removeAttr('aria-hidden')
					.removeAttr('aria-labelledby')
					.removeAttr('aria-expanded');
				this.jQueryroot.find('a.has-submenu').each(function() {
						var jQuerythis = jQuery(this);
						if (jQuerythis.attr('id').indexOf(self.accessIdPrefix) == 0) {
							jQuerythis.removeAttr('id');
						}
					})
					.removeClass('has-submenu')
					.removeDataSM('sub')
					.removeAttr('aria-haspopup')
					.removeAttr('aria-controls')
					.removeAttr('aria-expanded')
					.closest('li').removeDataSM('sub');
				if (this.opts.subIndicators) {
					this.jQueryroot.find('span.sub-arrow').remove();
				}
				if (this.opts.markCurrentItem) {
					this.jQueryroot.find('a.current').removeClass('current');
				}
				if (!refresh) {
					this.jQueryroot = null;
					this.jQueryfirstLink = null;
					this.jQueryfirstSub = null;
					if (this.jQuerydisableOverlay) {
						this.jQuerydisableOverlay.remove();
						this.jQuerydisableOverlay = null;
					}
					menuTrees.splice(jQuery.inArray(this, menuTrees), 1);
				}
			},
			disable: function(noOverlay) {
				if (!this.disabled) {
					this.menuHideAll();
					// display overlay over the menu to prevent interaction
					if (!noOverlay && !this.opts.isPopup && this.jQueryroot.is(':visible')) {
						var pos = this.jQueryroot.offset();
						this.jQuerydisableOverlay = jQuery('<div class="sm-jquery-disable-overlay"/>').css({
							position: 'absolute',
							top: pos.top,
							left: pos.left,
							width: this.jQueryroot.outerWidth(),
							height: this.jQueryroot.outerHeight(),
							zIndex: this.getStartZIndex(true),
							opacity: 0
						}).appendTo(document.body);
					}
					this.disabled = true;
				}
			},
			docClick: function(e) {
				if (this.jQuerytouchScrollingSub) {
					this.jQuerytouchScrollingSub = null;
					return;
				}
				// hide on any click outside the menu or on a menu link
				if (this.visibleSubMenus.length && !jQuery.contains(this.jQueryroot[0], e.target) || jQuery(e.target).is('a')) {
					this.menuHideAll();
				}
			},
			docTouchEnd: function(e) {
				if (!this.lastTouch) {
					return;
				}
				if (this.visibleSubMenus.length && (this.lastTouch.x2 === undefined || this.lastTouch.x1 == this.lastTouch.x2) && (this.lastTouch.y2 === undefined || this.lastTouch.y1 == this.lastTouch.y2) && (!this.lastTouch.target || !jQuery.contains(this.jQueryroot[0], this.lastTouch.target))) {
					if (this.hideTimeout) {
						clearTimeout(this.hideTimeout);
						this.hideTimeout = 0;
					}
					// hide with a delay to prevent triggering accidental unwanted click on some page element
					var self = this;
					this.hideTimeout = setTimeout(function() { self.menuHideAll(); }, 350);
				}
				this.lastTouch = null;
			},
			docTouchMove: function(e) {
				if (!this.lastTouch) {
					return;
				}
				var touchPoint = e.originalEvent.touches[0];
				this.lastTouch.x2 = touchPoint.pageX;
				this.lastTouch.y2 = touchPoint.pageY;
			},
			docTouchStart: function(e) {
				var touchPoint = e.originalEvent.touches[0];
				this.lastTouch = { x1: touchPoint.pageX, y1: touchPoint.pageY, target: touchPoint.target };
			},
			enable: function() {
				if (this.disabled) {
					if (this.jQuerydisableOverlay) {
						this.jQuerydisableOverlay.remove();
						this.jQuerydisableOverlay = null;
					}
					this.disabled = false;
				}
			},
			getClosestMenu: function(elm) {
				var jQueryclosestMenu = jQuery(elm).closest('ul');
				while (jQueryclosestMenu.dataSM('in-mega')) {
					jQueryclosestMenu = jQueryclosestMenu.parent().closest('ul');
				}
				return jQueryclosestMenu[0] || null;
			},
			getHeight: function(jQueryelm) {
				return this.getOffset(jQueryelm, true);
			},
			// returns precise width/height float values
			getOffset: function(jQueryelm, height) {
				var old;
				if (jQueryelm.css('display') == 'none') {
					old = { position: jQueryelm[0].style.position, visibility: jQueryelm[0].style.visibility };
					jQueryelm.css({ position: 'absolute', visibility: 'hidden' }).show();
				}
				var box = jQueryelm[0].getBoundingClientRect && jQueryelm[0].getBoundingClientRect(),
					val = box && (height ? box.height || box.bottom - box.top : box.width || box.right - box.left);
				if (!val && val !== 0) {
					val = height ? jQueryelm[0].offsetHeight : jQueryelm[0].offsetWidth;
				}
				if (old) {
					jQueryelm.hide().css(old);
				}
				return val;
			},
			getStartZIndex: function(root) {
				var zIndex = parseInt(this[root ? 'jQueryroot' : 'jQueryfirstSub'].css('z-index'));
				if (!root && isNaN(zIndex)) {
					zIndex = parseInt(this.jQueryroot.css('z-index'));
				}
				return !isNaN(zIndex) ? zIndex : 1;
			},
			getTouchPoint: function(e) {
				return e.touches && e.touches[0] || e.changedTouches && e.changedTouches[0] || e;
			},
			getViewport: function(height) {
				var name = height ? 'Height' : 'Width',
					val = document.documentElement['client' + name],
					val2 = window['inner' + name];
				if (val2) {
					val = Math.min(val, val2);
				}
				return val;
			},
			getViewportHeight: function() {
				return this.getViewport(true);
			},
			getViewportWidth: function() {
				return this.getViewport();
			},
			getWidth: function(jQueryelm) {
				return this.getOffset(jQueryelm);
			},
			handleEvents: function() {
				return !this.disabled && this.isCSSOn();
			},
			handleItemEvents: function(jQuerya) {
				return this.handleEvents() && !this.isLinkInMegaMenu(jQuerya);
			},
			isCollapsible: function() {
				return this.jQueryfirstSub.css('position') == 'static';
			},
			isCSSOn: function() {
				return this.jQueryfirstLink.css('display') == 'block';
			},
			isFixed: function() {
				var isFixed = this.jQueryroot.css('position') == 'fixed';
				if (!isFixed) {
					this.jQueryroot.parentsUntil('body').each(function() {
						if (jQuery(this).css('position') == 'fixed') {
							isFixed = true;
							return false;
						}
					});
				}
				return isFixed;
			},
			isLinkInMegaMenu: function(jQuerya) {
				return jQuery(this.getClosestMenu(jQuerya[0])).hasClass('mega-menu');
			},
			isTouchMode: function() {
				return !mouse || this.opts.noMouseOver || this.isCollapsible();
			},
			itemActivate: function(jQuerya, focus) {
				var jQueryul = jQuerya.closest('ul'),
					level = jQueryul.dataSM('level');
				// if for some reason the parent item is not activated (e.g. this is an API call to activate the item), activate all parent items first
				if (level > 1 && (!this.activatedItems[level - 2] || this.activatedItems[level - 2][0] != jQueryul.dataSM('parent-a')[0])) {
					var self = this;
					jQuery(jQueryul.parentsUntil('[data-smartmenus-id]', 'ul').get().reverse()).add(jQueryul).each(function() {
						self.itemActivate(jQuery(this).dataSM('parent-a'));
					});
				}
				// hide any visible deeper level sub menus
				if (!this.isCollapsible() || focus) {
					this.menuHideSubMenus(!this.activatedItems[level - 1] || this.activatedItems[level - 1][0] != jQuerya[0] ? level - 1 : level);
				}
				// save new active item for this level
				this.activatedItems[level - 1] = jQuerya;
				if (this.jQueryroot.triggerHandler('activate.smapi', jQuerya[0]) === false) {
					return;
				}
				// show the sub menu if this item has one
				var jQuerysub = jQuerya.dataSM('sub');
				if (jQuerysub && (this.isTouchMode() || (!this.opts.showOnClick || this.clickActivated))) {
					this.menuShow(jQuerysub);
				}
			},
			itemBlur: function(e) {
				var jQuerya = jQuery(e.currentTarget);
				if (!this.handleItemEvents(jQuerya)) {
					return;
				}
				this.jQueryroot.triggerHandler('blur.smapi', jQuerya[0]);
			},
			itemClick: function(e) {
				var jQuerya = jQuery(e.currentTarget);
				if (!this.handleItemEvents(jQuerya)) {
					return;
				}
				if (this.jQuerytouchScrollingSub && this.jQuerytouchScrollingSub[0] == jQuerya.closest('ul')[0]) {
					this.jQuerytouchScrollingSub = null;
					e.stopPropagation();
					return false;
				}
				if (this.jQueryroot.triggerHandler('click.smapi', jQuerya[0]) === false) {
					return false;
				}
				var subArrowClicked = jQuery(e.target).is('span.sub-arrow'),
					jQuerysub = jQuerya.dataSM('sub'),
					firstLevelSub = jQuerysub ? jQuerysub.dataSM('level') == 2 : false;
				// if the sub is not visible
				if (jQuerysub && !jQuerysub.is(':visible')) {
					if (this.opts.showOnClick && firstLevelSub) {
						this.clickActivated = true;
					}
					// try to activate the item and show the sub
					this.itemActivate(jQuerya);
					// if "itemActivate" showed the sub, prevent the click so that the link is not loaded
					// if it couldn't show it, then the sub menus are disabled with an !important declaration (e.g. via mobile styles) so let the link get loaded
					if (jQuerysub.is(':visible')) {
						this.focusActivated = true;
						return false;
					}
				} else if (this.isCollapsible() && subArrowClicked) {
					this.itemActivate(jQuerya);
					this.menuHide(jQuerysub);
					return false;
				}
				if (this.opts.showOnClick && firstLevelSub || jQuerya.hasClass('disabled') || this.jQueryroot.triggerHandler('select.smapi', jQuerya[0]) === false) {
					return false;
				}
			},
			itemDown: function(e) {
				var jQuerya = jQuery(e.currentTarget);
				if (!this.handleItemEvents(jQuerya)) {
					return;
				}
				jQuerya.dataSM('mousedown', true);
			},
			itemEnter: function(e) {
				var jQuerya = jQuery(e.currentTarget);
				if (!this.handleItemEvents(jQuerya)) {
					return;
				}
				if (!this.isTouchMode()) {
					if (this.showTimeout) {
						clearTimeout(this.showTimeout);
						this.showTimeout = 0;
					}
					var self = this;
					this.showTimeout = setTimeout(function() { self.itemActivate(jQuerya); }, this.opts.showOnClick && jQuerya.closest('ul').dataSM('level') == 1 ? 1 : this.opts.showTimeout);
				}
				this.jQueryroot.triggerHandler('mouseenter.smapi', jQuerya[0]);
			},
			itemFocus: function(e) {
				var jQuerya = jQuery(e.currentTarget);
				if (!this.handleItemEvents(jQuerya)) {
					return;
				}
				// fix (the mousedown check): in some browsers a tap/click produces consecutive focus + click events so we don't need to activate the item on focus
				if (this.focusActivated && (!this.isTouchMode() || !jQuerya.dataSM('mousedown')) && (!this.activatedItems.length || this.activatedItems[this.activatedItems.length - 1][0] != jQuerya[0])) {
					this.itemActivate(jQuerya, true);
				}
				this.jQueryroot.triggerHandler('focus.smapi', jQuerya[0]);
			},
			itemLeave: function(e) {
				var jQuerya = jQuery(e.currentTarget);
				if (!this.handleItemEvents(jQuerya)) {
					return;
				}
				if (!this.isTouchMode()) {
					jQuerya[0].blur();
					if (this.showTimeout) {
						clearTimeout(this.showTimeout);
						this.showTimeout = 0;
					}
				}
				jQuerya.removeDataSM('mousedown');
				this.jQueryroot.triggerHandler('mouseleave.smapi', jQuerya[0]);
			},
			menuHide: function(jQuerysub) {
				if (this.jQueryroot.triggerHandler('beforehide.smapi', jQuerysub[0]) === false) {
					return;
				}
				jQuerysub.stop(true, true);
				if (jQuerysub.css('display') != 'none') {
					var complete = function() {
						// unset z-index
						jQuerysub.css('z-index', '');
					};
					// if sub is collapsible (mobile view)
					if (this.isCollapsible()) {
						if (this.opts.collapsibleHideFunction) {
							this.opts.collapsibleHideFunction.call(this, jQuerysub, complete);
						} else {
							jQuerysub.hide(this.opts.collapsibleHideDuration, complete);
						}
					} else {
						if (this.opts.hideFunction) {
							this.opts.hideFunction.call(this, jQuerysub, complete);
						} else {
							jQuerysub.hide(this.opts.hideDuration, complete);
						}
					}
					// remove IE iframe shim
					if (jQuerysub.dataSM('ie-shim')) {
						jQuerysub.dataSM('ie-shim').remove().css({ '-webkit-transform': '', transform: '' });
					}
					// deactivate scrolling if it is activated for this sub
					if (jQuerysub.dataSM('scroll')) {
						this.menuScrollStop(jQuerysub);
						jQuerysub.css({ 'touch-action': '', '-ms-touch-action': '', '-webkit-transform': '', transform: '' })
							.unbind('.smartmenus_scroll').removeDataSM('scroll').dataSM('scroll-arrows').hide();
					}
					// unhighlight parent item + accessibility
					jQuerysub.dataSM('parent-a').removeClass('highlighted').attr('aria-expanded', 'false');
					jQuerysub.attr({
						'aria-expanded': 'false',
						'aria-hidden': 'true'
					});
					var level = jQuerysub.dataSM('level');
					this.activatedItems.splice(level - 1, 1);
					this.visibleSubMenus.splice(jQuery.inArray(jQuerysub, this.visibleSubMenus), 1);
					this.jQueryroot.triggerHandler('hide.smapi', jQuerysub[0]);
				}
			},
			menuHideAll: function() {
				if (this.showTimeout) {
					clearTimeout(this.showTimeout);
					this.showTimeout = 0;
				}
				// hide all subs
				// if it's a popup, this.visibleSubMenus[0] is the root UL
				var level = this.opts.isPopup ? 1 : 0;
				for (var i = this.visibleSubMenus.length - 1; i >= level; i--) {
					this.menuHide(this.visibleSubMenus[i]);
				}
				// hide root if it's popup
				if (this.opts.isPopup) {
					this.jQueryroot.stop(true, true);
					if (this.jQueryroot.is(':visible')) {
						if (this.opts.hideFunction) {
							this.opts.hideFunction.call(this, this.jQueryroot);
						} else {
							this.jQueryroot.hide(this.opts.hideDuration);
						}
						// remove IE iframe shim
						if (this.jQueryroot.dataSM('ie-shim')) {
							this.jQueryroot.dataSM('ie-shim').remove();
						}
					}
				}
				this.activatedItems = [];
				this.visibleSubMenus = [];
				this.clickActivated = false;
				this.focusActivated = false;
				// reset z-index increment
				this.zIndexInc = 0;
				this.jQueryroot.triggerHandler('hideAll.smapi');
			},
			menuHideSubMenus: function(level) {
				for (var i = this.activatedItems.length - 1; i >= level; i--) {
					var jQuerysub = this.activatedItems[i].dataSM('sub');
					if (jQuerysub) {
						this.menuHide(jQuerysub);
					}
				}
			},
			menuIframeShim: function(jQueryul) {
				// create iframe shim for the menu
				if (IE && this.opts.overlapControlsInIE && !jQueryul.dataSM('ie-shim')) {
					jQueryul.dataSM('ie-shim', jQuery('<iframe/>').attr({ src: 'javascript:0', tabindex: -9 })
						.css({ position: 'absolute', top: 'auto', left: '0', opacity: 0, border: '0' })
					);
				}
			},
			menuInit: function(jQueryul) {
				if (!jQueryul.dataSM('in-mega')) {
					// mark UL's in mega drop downs (if any) so we can neglect them
					if (jQueryul.hasClass('mega-menu')) {
						jQueryul.find('ul').dataSM('in-mega', true);
					}
					// get level (much faster than, for example, using parentsUntil)
					var level = 2,
						par = jQueryul[0];
					while ((par = par.parentNode.parentNode) != this.jQueryroot[0]) {
						level++;
					}
					// cache stuff for quick access
					var jQuerya = jQueryul.prevAll('a').eq(-1);
					// if the link is nested (e.g. in a heading)
					if (!jQuerya.length) {
						jQuerya = jQueryul.prevAll().find('a').eq(-1);
					}
					jQuerya.addClass('has-submenu').dataSM('sub', jQueryul);
					jQueryul.dataSM('parent-a', jQuerya)
						.dataSM('level', level)
						.parent().dataSM('sub', jQueryul);
					// accessibility
					var aId = jQuerya.attr('id') || this.accessIdPrefix + (++this.idInc),
						ulId = jQueryul.attr('id') || this.accessIdPrefix + (++this.idInc);
					jQuerya.attr({
						id: aId,
						'aria-haspopup': 'true',
						'aria-controls': ulId,
						'aria-expanded': 'false'
					});
					jQueryul.attr({
						id: ulId,
						'role': 'group',
						'aria-hidden': 'true',
						'aria-labelledby': aId,
						'aria-expanded': 'false'
					});
					// add sub indicator to parent item
					if (this.opts.subIndicators) {
						jQuerya[this.opts.subIndicatorsPos](this.jQuerysubArrow.clone());
					}
				}
			},
			menuPosition: function(jQuerysub) {
				var jQuerya = jQuerysub.dataSM('parent-a'),
					jQueryli = jQuerya.closest('li'),
					jQueryul = jQueryli.parent(),
					level = jQuerysub.dataSM('level'),
					subW = this.getWidth(jQuerysub),
					subH = this.getHeight(jQuerysub),
					itemOffset = jQuerya.offset(),
					itemX = itemOffset.left,
					itemY = itemOffset.top,
					itemW = this.getWidth(jQuerya),
					itemH = this.getHeight(jQuerya),
					jQuerywin = jQuery(window),
					winX = jQuerywin.scrollLeft(),
					winY = jQuerywin.scrollTop(),
					winW = this.getViewportWidth(),
					winH = this.getViewportHeight(),
					horizontalParent = jQueryul.parent().is('[data-sm-horizontal-sub]') || level == 2 && !jQueryul.hasClass('sm-vertical'),
					rightToLeft = this.opts.rightToLeftSubMenus && !jQueryli.is('[data-sm-reverse]') || !this.opts.rightToLeftSubMenus && jQueryli.is('[data-sm-reverse]'),
					subOffsetX = level == 2 ? this.opts.mainMenuSubOffsetX : this.opts.subMenusSubOffsetX,
					subOffsetY = level == 2 ? this.opts.mainMenuSubOffsetY : this.opts.subMenusSubOffsetY,
					x, y;
				if (horizontalParent) {
					x = rightToLeft ? itemW - subW - subOffsetX : subOffsetX;
					y = this.opts.bottomToTopSubMenus ? -subH - subOffsetY : itemH + subOffsetY;
				} else {
					x = rightToLeft ? subOffsetX - subW : itemW - subOffsetX;
					y = this.opts.bottomToTopSubMenus ? itemH - subOffsetY - subH : subOffsetY;
				}
				if (this.opts.keepInViewport) {
					var absX = itemX + x,
						absY = itemY + y;
					if (rightToLeft && absX < winX) {
						x = horizontalParent ? winX - absX + x : itemW - subOffsetX;
					} else if (!rightToLeft && absX + subW > winX + winW) {
						x = horizontalParent ? winX + winW - subW - absX + x : subOffsetX - subW;
					}
					if (!horizontalParent) {
						if (subH < winH && absY + subH > winY + winH) {
							y += winY + winH - subH - absY;
						} else if (subH >= winH || absY < winY) {
							y += winY - absY;
						}
					}
					// do we need scrolling?
					// 0.49 used for better precision when dealing with float values
					if (horizontalParent && (absY + subH > winY + winH + 0.49 || absY < winY) || !horizontalParent && subH > winH + 0.49) {
						var self = this;
						if (!jQuerysub.dataSM('scroll-arrows')) {
							jQuerysub.dataSM('scroll-arrows', jQuery([jQuery('<span class="scroll-up"><span class="scroll-up-arrow"></span></span>')[0], jQuery('<span class="scroll-down"><span class="scroll-down-arrow"></span></span>')[0]])
								.bind({
									mouseenter: function() {
										jQuerysub.dataSM('scroll').up = jQuery(this).hasClass('scroll-up');
										self.menuScroll(jQuerysub);
									},
									mouseleave: function(e) {
										self.menuScrollStop(jQuerysub);
										self.menuScrollOut(jQuerysub, e);
									},
									'mousewheel DOMMouseScroll': function(e) { e.preventDefault(); }
								})
								.insertAfter(jQuerysub)
							);
						}
						// bind scroll events and save scroll data for this sub
						var eNS = '.smartmenus_scroll';
						jQuerysub.dataSM('scroll', {
								y: this.cssTransforms3d ? 0 : y - itemH,
								step: 1,
								// cache stuff for faster recalcs later
								itemH: itemH,
								subH: subH,
								arrowDownH: this.getHeight(jQuerysub.dataSM('scroll-arrows').eq(1))
							})
							.bind(getEventsNS([
								['mouseover', function(e) { self.menuScrollOver(jQuerysub, e); }],
								['mouseout', function(e) { self.menuScrollOut(jQuerysub, e); }],
								['mousewheel DOMMouseScroll', function(e) { self.menuScrollMousewheel(jQuerysub, e); }]
							], eNS))
							.dataSM('scroll-arrows').css({ top: 'auto', left: '0', marginLeft: x + (parseInt(jQuerysub.css('border-left-width')) || 0), width: subW - (parseInt(jQuerysub.css('border-left-width')) || 0) - (parseInt(jQuerysub.css('border-right-width')) || 0), zIndex: jQuerysub.css('z-index') })
								.eq(horizontalParent && this.opts.bottomToTopSubMenus ? 0 : 1).show();
						// when a menu tree is fixed positioned we allow scrolling via touch too
						// since there is no other way to access such long sub menus if no mouse is present
						if (this.isFixed()) {
							jQuerysub.css({ 'touch-action': 'none', '-ms-touch-action': 'none' })
								.bind(getEventsNS([
									[touchEvents ? 'touchstart touchmove touchend' : 'pointerdown pointermove pointerup MSPointerDown MSPointerMove MSPointerUp', function(e) {
										self.menuScrollTouch(jQuerysub, e);
									}]
								], eNS));
						}
					}
				}
				jQuerysub.css({ top: 'auto', left: '0', marginLeft: x, marginTop: y - itemH });
				// IE iframe shim
				this.menuIframeShim(jQuerysub);
				if (jQuerysub.dataSM('ie-shim')) {
					jQuerysub.dataSM('ie-shim').css({ zIndex: jQuerysub.css('z-index'), width: subW, height: subH, marginLeft: x, marginTop: y - itemH });
				}
			},
			menuScroll: function(jQuerysub, once, step) {
				var data = jQuerysub.dataSM('scroll'),
					jQueryarrows = jQuerysub.dataSM('scroll-arrows'),
					end = data.up ? data.upEnd : data.downEnd,
					diff;
				if (!once && data.momentum) {
					data.momentum *= 0.92;
					diff = data.momentum;
					if (diff < 0.5) {
						this.menuScrollStop(jQuerysub);
						return;
					}
				} else {
					diff = step || (once || !this.opts.scrollAccelerate ? this.opts.scrollStep : Math.floor(data.step));
				}
				// hide any visible deeper level sub menus
				var level = jQuerysub.dataSM('level');
				if (this.activatedItems[level - 1] && this.activatedItems[level - 1].dataSM('sub') && this.activatedItems[level - 1].dataSM('sub').is(':visible')) {
					this.menuHideSubMenus(level - 1);
				}
				data.y = data.up && end <= data.y || !data.up && end >= data.y ? data.y : (Math.abs(end - data.y) > diff ? data.y + (data.up ? diff : -diff) : end);
				jQuerysub.add(jQuerysub.dataSM('ie-shim')).css(this.cssTransforms3d ? { '-webkit-transform': 'translate3d(0, ' + data.y + 'px, 0)', transform: 'translate3d(0, ' + data.y + 'px, 0)' } : { marginTop: data.y });
				// show opposite arrow if appropriate
				if (mouse && (data.up && data.y > data.downEnd || !data.up && data.y < data.upEnd)) {
					jQueryarrows.eq(data.up ? 1 : 0).show();
				}
				// if we've reached the end
				if (data.y == end) {
					if (mouse) {
						jQueryarrows.eq(data.up ? 0 : 1).hide();
					}
					this.menuScrollStop(jQuerysub);
				} else if (!once) {
					if (this.opts.scrollAccelerate && data.step < this.opts.scrollStep) {
						data.step += 0.2;
					}
					var self = this;
					this.scrollTimeout = requestAnimationFrame(function() { self.menuScroll(jQuerysub); });
				}
			},
			menuScrollMousewheel: function(jQuerysub, e) {
				if (this.getClosestMenu(e.target) == jQuerysub[0]) {
					e = e.originalEvent;
					var up = (e.wheelDelta || -e.detail) > 0;
					if (jQuerysub.dataSM('scroll-arrows').eq(up ? 0 : 1).is(':visible')) {
						jQuerysub.dataSM('scroll').up = up;
						this.menuScroll(jQuerysub, true);
					}
				}
				e.preventDefault();
			},
			menuScrollOut: function(jQuerysub, e) {
				if (mouse) {
					if (!/^scroll-(up|down)/.test((e.relatedTarget || '').className) && (jQuerysub[0] != e.relatedTarget && !jQuery.contains(jQuerysub[0], e.relatedTarget) || this.getClosestMenu(e.relatedTarget) != jQuerysub[0])) {
						jQuerysub.dataSM('scroll-arrows').css('visibility', 'hidden');
					}
				}
			},
			menuScrollOver: function(jQuerysub, e) {
				if (mouse) {
					if (!/^scroll-(up|down)/.test(e.target.className) && this.getClosestMenu(e.target) == jQuerysub[0]) {
						this.menuScrollRefreshData(jQuerysub);
						var data = jQuerysub.dataSM('scroll'),
							upEnd = jQuery(window).scrollTop() - jQuerysub.dataSM('parent-a').offset().top - data.itemH;
						jQuerysub.dataSM('scroll-arrows').eq(0).css('margin-top', upEnd).end()
							.eq(1).css('margin-top', upEnd + this.getViewportHeight() - data.arrowDownH).end()
							.css('visibility', 'visible');
					}
				}
			},
			menuScrollRefreshData: function(jQuerysub) {
				var data = jQuerysub.dataSM('scroll'),
					upEnd = jQuery(window).scrollTop() - jQuerysub.dataSM('parent-a').offset().top - data.itemH;
				if (this.cssTransforms3d) {
					upEnd = -(parseFloat(jQuerysub.css('margin-top')) - upEnd);
				}
				jQuery.extend(data, {
					upEnd: upEnd,
					downEnd: upEnd + this.getViewportHeight() - data.subH
				});
			},
			menuScrollStop: function(jQuerysub) {
				if (this.scrollTimeout) {
					cancelAnimationFrame(this.scrollTimeout);
					this.scrollTimeout = 0;
					jQuerysub.dataSM('scroll').step = 1;
					return true;
				}
			},
			menuScrollTouch: function(jQuerysub, e) {
				e = e.originalEvent;
				if (isTouchEvent(e)) {
					var touchPoint = this.getTouchPoint(e);
					// neglect event if we touched a visible deeper level sub menu
					if (this.getClosestMenu(touchPoint.target) == jQuerysub[0]) {
						var data = jQuerysub.dataSM('scroll');
						if (/(start|down)jQuery/i.test(e.type)) {
							if (this.menuScrollStop(jQuerysub)) {
								// if we were scrolling, just stop and don't activate any link on the first touch
								e.preventDefault();
								this.jQuerytouchScrollingSub = jQuerysub;
							} else {
								this.jQuerytouchScrollingSub = null;
							}
							// update scroll data since the user might have zoomed, etc.
							this.menuScrollRefreshData(jQuerysub);
							// extend it with the touch properties
							jQuery.extend(data, {
								touchStartY: touchPoint.pageY,
								touchStartTime: e.timeStamp
							});
						} else if (/movejQuery/i.test(e.type)) {
							var prevY = data.touchY !== undefined ? data.touchY : data.touchStartY;
							if (prevY !== undefined && prevY != touchPoint.pageY) {
								this.jQuerytouchScrollingSub = jQuerysub;
								var up = prevY < touchPoint.pageY;
								// changed direction? reset...
								if (data.up !== undefined && data.up != up) {
									jQuery.extend(data, {
										touchStartY: touchPoint.pageY,
										touchStartTime: e.timeStamp
									});
								}
								jQuery.extend(data, {
									up: up,
									touchY: touchPoint.pageY
								});
								this.menuScroll(jQuerysub, true, Math.abs(touchPoint.pageY - prevY));
							}
							e.preventDefault();
						} else { // touchend/pointerup
							if (data.touchY !== undefined) {
								if (data.momentum = Math.pow(Math.abs(touchPoint.pageY - data.touchStartY) / (e.timeStamp - data.touchStartTime), 2) * 15) {
									this.menuScrollStop(jQuerysub);
									this.menuScroll(jQuerysub);
									e.preventDefault();
								}
								delete data.touchY;
							}
						}
					}
				}
			},
			menuShow: function(jQuerysub) {
				if (!jQuerysub.dataSM('beforefirstshowfired')) {
					jQuerysub.dataSM('beforefirstshowfired', true);
					if (this.jQueryroot.triggerHandler('beforefirstshow.smapi', jQuerysub[0]) === false) {
						return;
					}
				}
				if (this.jQueryroot.triggerHandler('beforeshow.smapi', jQuerysub[0]) === false) {
					return;
				}
				jQuerysub.dataSM('shown-before', true)
					.stop(true, true);
				if (!jQuerysub.is(':visible')) {
					// highlight parent item
					var jQuerya = jQuerysub.dataSM('parent-a');
					if (this.opts.keepHighlighted || this.isCollapsible()) {
						jQuerya.addClass('highlighted');
					}
					if (this.isCollapsible()) {
						jQuerysub.removeClass('sm-nowrap').css({ zIndex: '', width: 'auto', minWidth: '', maxWidth: '', top: '', left: '', marginLeft: '', marginTop: '' });
					} else {
						// set z-index
						jQuerysub.css('z-index', this.zIndexInc = (this.zIndexInc || this.getStartZIndex()) + 1);
						// min/max-width fix - no way to rely purely on CSS as all UL's are nested
						if (this.opts.subMenusMinWidth || this.opts.subMenusMaxWidth) {
							jQuerysub.css({ width: 'auto', minWidth: '', maxWidth: '' }).addClass('sm-nowrap');
							if (this.opts.subMenusMinWidth) {
							 	jQuerysub.css('min-width', this.opts.subMenusMinWidth);
							}
							if (this.opts.subMenusMaxWidth) {
							 	var noMaxWidth = this.getWidth(jQuerysub);
							 	jQuerysub.css('max-width', this.opts.subMenusMaxWidth);
								if (noMaxWidth > this.getWidth(jQuerysub)) {
									jQuerysub.removeClass('sm-nowrap').css('width', this.opts.subMenusMaxWidth);
								}
							}
						}
						this.menuPosition(jQuerysub);
						// insert IE iframe shim
						if (jQuerysub.dataSM('ie-shim')) {
							jQuerysub.dataSM('ie-shim').insertBefore(jQuerysub);
						}
					}
					var complete = function() {
						// fix: "overflow: hidden;" is not reset on animation complete in jQuery < 1.9.0 in Chrome when global "box-sizing: border-box;" is used
						jQuerysub.css('overflow', '');
					};
					// if sub is collapsible (mobile view)
					if (this.isCollapsible()) {
						if (this.opts.collapsibleShowFunction) {
							this.opts.collapsibleShowFunction.call(this, jQuerysub, complete);
						} else {
							jQuerysub.show(this.opts.collapsibleShowDuration, complete);
						}
					} else {
						if (this.opts.showFunction) {
							this.opts.showFunction.call(this, jQuerysub, complete);
						} else {
							jQuerysub.show(this.opts.showDuration, complete);
						}
					}
					// accessibility
					jQuerya.attr('aria-expanded', 'true');
					jQuerysub.attr({
						'aria-expanded': 'true',
						'aria-hidden': 'false'
					});
					// store sub menu in visible array
					this.visibleSubMenus.push(jQuerysub);
					this.jQueryroot.triggerHandler('show.smapi', jQuerysub[0]);
				}
			},
			popupHide: function(noHideTimeout) {
				if (this.hideTimeout) {
					clearTimeout(this.hideTimeout);
					this.hideTimeout = 0;
				}
				var self = this;
				this.hideTimeout = setTimeout(function() {
					self.menuHideAll();
				}, noHideTimeout ? 1 : this.opts.hideTimeout);
			},
			popupShow: function(left, top) {
				if (!this.opts.isPopup) {
					alert('SmartMenus jQuery Error:\n\nIf you want to show this menu via the "popupShow" method, set the isPopup:true option.');
					return;
				}
				if (this.hideTimeout) {
					clearTimeout(this.hideTimeout);
					this.hideTimeout = 0;
				}
				this.jQueryroot.dataSM('shown-before', true)
					.stop(true, true);
				if (!this.jQueryroot.is(':visible')) {
					this.jQueryroot.css({ left: left, top: top });
					// IE iframe shim
					this.menuIframeShim(this.jQueryroot);
					if (this.jQueryroot.dataSM('ie-shim')) {
						this.jQueryroot.dataSM('ie-shim').css({ zIndex: this.jQueryroot.css('z-index'), width: this.getWidth(this.jQueryroot), height: this.getHeight(this.jQueryroot), left: left, top: top }).insertBefore(this.jQueryroot);
					}
					// show menu
					var self = this,
						complete = function() {
							self.jQueryroot.css('overflow', '');
						};
					if (this.opts.showFunction) {
						this.opts.showFunction.call(this, this.jQueryroot, complete);
					} else {
						this.jQueryroot.show(this.opts.showDuration, complete);
					}
					this.visibleSubMenus[0] = this.jQueryroot;
				}
			},
			refresh: function() {
				this.destroy(true);
				this.init(true);
			},
			rootKeyDown: function(e) {
				if (!this.handleEvents()) {
					return;
				}
				switch (e.keyCode) {
					case 27: // reset on Esc
						var jQueryactiveTopItem = this.activatedItems[0];
						if (jQueryactiveTopItem) {
							this.menuHideAll();
							jQueryactiveTopItem[0].focus();
							var jQuerysub = jQueryactiveTopItem.dataSM('sub');
							if (jQuerysub) {
								this.menuHide(jQuerysub);
							}
						}
						break;
					case 32: // activate item's sub on Space
						var jQuerytarget = jQuery(e.target);
						if (jQuerytarget.is('a') && this.handleItemEvents(jQuerytarget)) {
							var jQuerysub = jQuerytarget.dataSM('sub');
							if (jQuerysub && !jQuerysub.is(':visible')) {
								this.itemClick({ currentTarget: e.target });
								e.preventDefault();
							}
						}
						break;
				}
			},
			rootOut: function(e) {
				if (!this.handleEvents() || this.isTouchMode() || e.target == this.jQueryroot[0]) {
					return;
				}
				if (this.hideTimeout) {
					clearTimeout(this.hideTimeout);
					this.hideTimeout = 0;
				}
				if (!this.opts.showOnClick || !this.opts.hideOnClick) {
					var self = this;
					this.hideTimeout = setTimeout(function() { self.menuHideAll(); }, this.opts.hideTimeout);
				}
			},
			rootOver: function(e) {
				if (!this.handleEvents() || this.isTouchMode() || e.target == this.jQueryroot[0]) {
					return;
				}
				if (this.hideTimeout) {
					clearTimeout(this.hideTimeout);
					this.hideTimeout = 0;
				}
			},
			winResize: function(e) {
				if (!this.handleEvents()) {
					// we still need to resize the disable overlay if it's visible
					if (this.jQuerydisableOverlay) {
						var pos = this.jQueryroot.offset();
	 					this.jQuerydisableOverlay.css({
							top: pos.top,
							left: pos.left,
							width: this.jQueryroot.outerWidth(),
							height: this.jQueryroot.outerHeight()
						});
					}
					return;
				}
				// hide sub menus on resize - on mobile do it only on orientation change
				if (!('onorientationchange' in window) || e.type == 'orientationchange') {
					var isCollapsible = this.isCollapsible();
					// if it was collapsible before resize and still is, don't do it
					if (!(this.wasCollapsible && isCollapsible)) { 
						if (this.activatedItems.length) {
							this.activatedItems[this.activatedItems.length - 1][0].blur();
						}
						this.menuHideAll();
					}
					this.wasCollapsible = isCollapsible;
				}
			}
		}
	});

	jQuery.fn.dataSM = function(key, val) {
		if (val) {
			return this.data(key + '_smartmenus', val);
		}
		return this.data(key + '_smartmenus');
	}

	jQuery.fn.removeDataSM = function(key) {
		return this.removeData(key + '_smartmenus');
	}

	jQuery.fn.smartmenus = function(options) {
		if (typeof options == 'string') {
			var args = arguments,
				method = options;
			Array.prototype.shift.call(args);
			return this.each(function() {
				var smartmenus = jQuery(this).data('smartmenus');
				if (smartmenus && smartmenus[method]) {
					smartmenus[method].apply(smartmenus, args);
				}
			});
		}
		var opts = jQuery.extend({}, jQuery.fn.smartmenus.defaults, options);
		return this.each(function() {
			new jQuery.SmartMenus(this, opts);
		});
	}

	// default settings
	jQuery.fn.smartmenus.defaults = {
		isPopup:		false,		// is this a popup menu (can be shown via the popupShow/popupHide methods) or a permanent menu bar
		mainMenuSubOffsetX:	0,		// pixels offset from default position
		mainMenuSubOffsetY:	0,		// pixels offset from default position
		subMenusSubOffsetX:	0,		// pixels offset from default position
		subMenusSubOffsetY:	0,		// pixels offset from default position
		subMenusMinWidth:	'10em',		// min-width for the sub menus (any CSS unit) - if set, the fixed width set in CSS will be ignored
		subMenusMaxWidth:	'20em',		// max-width for the sub menus (any CSS unit) - if set, the fixed width set in CSS will be ignored
		subIndicators: 		true,		// create sub menu indicators - creates a SPAN and inserts it in the A
		subIndicatorsPos: 	'prepend',	// position of the SPAN relative to the menu item content ('prepend', 'append')
		subIndicatorsText:	'+',		// [optionally] add text in the SPAN (e.g. '+') (you may want to check the CSS for the sub indicators too)
		scrollStep: 		30,		// pixels step when scrolling long sub menus that do not fit in the viewport height
		scrollAccelerate:	true,		// accelerate scrolling or use a fixed step
		showTimeout:		250,		// timeout before showing the sub menus
		hideTimeout:		500,		// timeout before hiding the sub menus
		showDuration:		0,		// duration for show animation - set to 0 for no animation - matters only if showFunction:null
		showFunction:		null,		// custom function to use when showing a sub menu (the default is the jQuery 'show')
							// don't forget to call complete() at the end of whatever you do
							// e.g.: function(jQueryul, complete) { jQueryul.fadeIn(250, complete); }
		hideDuration:		0,		// duration for hide animation - set to 0 for no animation - matters only if hideFunction:null
		hideFunction:		function(jQueryul, complete) { jQueryul.fadeOut(200, complete); },	// custom function to use when hiding a sub menu (the default is the jQuery 'hide')
							// don't forget to call complete() at the end of whatever you do
							// e.g.: function(jQueryul, complete) { jQueryul.fadeOut(250, complete); }
		collapsibleShowDuration:0,		// duration for show animation for collapsible sub menus - matters only if collapsibleShowFunction:null
		collapsibleShowFunction:function(jQueryul, complete) { jQueryul.slideDown(200, complete); },	// custom function to use when showing a collapsible sub menu
							// (i.e. when mobile styles are used to make the sub menus collapsible)
		collapsibleHideDuration:0,		// duration for hide animation for collapsible sub menus - matters only if collapsibleHideFunction:null
		collapsibleHideFunction:function(jQueryul, complete) { jQueryul.slideUp(200, complete); },	// custom function to use when hiding a collapsible sub menu
							// (i.e. when mobile styles are used to make the sub menus collapsible)
		showOnClick:		false,		// show the first-level sub menus onclick instead of onmouseover (i.e. mimic desktop app menus) (matters only for mouse input)
		hideOnClick:		true,		// hide the sub menus on click/tap anywhere on the page
		noMouseOver:		false,		// disable sub menus activation onmouseover (i.e. behave like in touch mode - use just mouse clicks) (matters only for mouse input)
		keepInViewport:		true,		// reposition the sub menus if needed to make sure they always appear inside the viewport
		keepHighlighted:	true,		// keep all ancestor items of the current sub menu highlighted (adds the 'highlighted' class to the A's)
		markCurrentItem:	false,		// automatically add the 'current' class to the A element of the item linking to the current URL
		markCurrentTree:	true,		// add the 'current' class also to the A elements of all ancestor items of the current item
		rightToLeftSubMenus:	false,		// right to left display of the sub menus (check the CSS for the sub indicators' position)
		bottomToTopSubMenus:	false,		// bottom to top display of the sub menus
		overlapControlsInIE:	true		// make sure sub menus appear on top of special OS controls in IE (i.e. SELECT, OBJECT, EMBED, etc.)
	};

	return jQuery;
}));