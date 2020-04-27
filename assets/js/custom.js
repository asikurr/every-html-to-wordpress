jQuery(window).load(function() {
    "use strict";
	
	
    /*----------------------------- Scroll To Top -----------------------*/
	jQuery(window).scroll(function () {
		if (jQuery(this).scrollTop() > 100) {
			jQuery('#scrollup').fadeIn();
		} else {
			jQuery('#scrollup').fadeOut();
		}
	});

	jQuery('#scrollup').on('click',function(){
		jQuery('html, body').animate({
		scrollTop: 0
	}, 2000);
	return false;
	});
	
	/*----------------------------- Revolution Slider -----------------------*/
	jQuery('#fullwidthbanner').revolution ({
		delay: 5000,
		startwidth: 940,
		startheight: 600,
		onHoverStop: 'on',            // Stop Banner Timet at Hover on Slide on/off
		thumbWidth: 100,            // Thumb With and Height and Amount (only if navigation Tyope set to thumb !)
		thumbHeight: 50,
		thumbAmount: 4,
		hideThumbs: 200,
		navigationType: 'none',         // Bullet, thumb, none, both   (No Shadow in Fullwidth Version !)
		navigationArrows: 'verticalcentered', // Nexttobullets, verticalcentered, none
		navigationStyle: 'round',       // Round,square,navbar
		touchenabled: 'on',           // Enable Swipe Function : on/off
		navOffsetHorizontal: 0,
		navOffsetVertical: 20,
		fullWidth: 'on',
		shadow: 0               //0 = no Shadow, 1,2,3 = 3 Different Art of Shadows -  (No Shadow in Fullwidth Version !)
	});
	

	// Detecting IE
	var oldIE;
	if (jQuery('html').is('.lt-ie7, .lt-ie8, .lt-ie9')) {
		oldIE = true;
	}

	if (oldIE) {
		// Here's your JS for IE..
	} else {
		// ..And here's the full-fat code for everyone else
	}



	/*----------------------------- Progress-bar -----------------------*/
	jQuery('.progress .progress-bar').progressbar({display_text: 'top'});
	
	
	/*----------------------------- Gmaps -----------------------*/	
	  var map;
	  jQuery('.ev-map-display').each(function() {
	  	var element = jQuery(this).attr('id');
	  	map = new GMaps({
	  		el: '#' + element,
	  		lat: 23.7403442,
	  		lng: 90.3919137,
	  		scrollwheel:false
	  	});
	  	map.renderRoute({
	  		origin: [23.7403442, 90.3919137],
	  		destination: [23.7572782,90.3878071],
	  		travelMode: 'driving',
	  		strokeColor: '#131540',
	  		strokeOpacity: 0.6,
	  		strokeWeight: 6
	  	}, {
	  		panel: '#directions',
	  		draggable: true
	  	});
	  });
	
	/*------------------------------ Pre Loader ----------------------*/

	jQuery('.loader').fadeOut();
	jQuery('.preloader').delay(250).fadeOut('slow');
	jQuery('body').delay(250).css({'overflow':'visible'});
   
   
    /*-------------------- For Isotope Image-loader ------------------*/
	jQuery('#isotope').imagesLoaded( function() {
	   var jQuerycontainer = jQuery('.isotope').isotope({
		itemSelector: '.element-item'
	  });
	});
	
	
    /*-------------------- Setup Responsive Menu ------------------*/
		jQuery(function (jQuery) {
			var menu = jQuery('.rm-nav').rMenu({
			});
		});
		
}(jQuery));