// external js: isotope.pkgd.js

jQuery( window ).on('load', function() {
  // init Isotope
  var jQuerycontainer = jQuery('.isotope').isotope({
    itemSelector: '.element-item',
    layoutMode: 'fitRows',
    getSortData: {
      name: '.name',
      symbol: '.symbol',
      number: '.number parseInt',
      category: '[data-category]',
      weight: function( itemElem ) {
        var weight = jQuery( itemElem ).find('.weight').text();
        return parseFloat( weight.replace( /[\(\)]/g, '') );
      }
    }
  });

  // filter functions
  var filterFns = {
    // show if number is greater than 50
    numberGreaterThan50: function() {
      var number = jQuery(this).find('.number').text();
      return parseInt( number, 10 ) > 50;
    },
    // show if name ends with -ium
    ium: function() {
      var name = jQuery(this).find('.name').text();
      return name.match( /iumjQuery/ );
    }
  };

  // bind filter button click
  jQuery('#filters').on( 'click', 'button', function() {
    var filterValue = jQuery( this ).attr('data-filter');
    // use filterFn if matches value
    filterValue = filterFns[ filterValue ] || filterValue;
    jQuerycontainer.isotope({ filter: filterValue });
  });

  // bind sort button click
  jQuery('#sorts').on( 'click', 'button', function() {
    var sortByValue = jQuery(this).attr('data-sort-by');
    jQuerycontainer.isotope({ sortBy: sortByValue });
  });
  
  // change is-checked class on buttons
  jQuery('.button-group').each( function( i, buttonGroup ) {
    var jQuerybuttonGroup = jQuery( buttonGroup );
    jQuerybuttonGroup.on( 'click', 'button', function() {
      jQuerybuttonGroup.find('.is-checked').removeClass('is-checked');
      jQuery( this ).addClass('is-checked');
    });
  });
  
});
