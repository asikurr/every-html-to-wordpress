<?php
/**
 * Register a Portfolio post type.
 *
  *@package     WordPress\Plugins\TGM Example Plugin
 * @author      Thomas Griffin <thomas@thomasgriffinmedia.com>
 * @link        https://get_template_directory_uri() . '/../inc/custom-tgm-plugin/custom-post-portfolio.zip
 * @version     1.0.2
 * @copyright   2011-2016 Thomas Griffin
 * @license     http://creativecommons.org/licenses/GPL/3.0/ GNU General Public License, version 3 or higher

 * 
 */
function custom_portfolio() {
	$labels = array(
		'name'               => _x( 'Portfolios', 'post type general name', 'every-theme' ),
		'singular_name'      => _x( 'Portfolio', 'post type singular name', 'every-theme' ),
		'menu_name'          => _x( 'Portfolios', 'admin menu', 'every-theme' ),
		'name_admin_bar'     => _x( 'Portfolio', 'add new on admin bar', 'every-theme' ),
		'add_new'            => _x( 'Add New', 'Portfolio', 'every-theme' ),
		'add_new_item'       => __( 'Add New Portfolio', 'every-theme' ),
		'new_item'           => __( 'New Portfolio', 'every-theme' ),
		'edit_item'          => __( 'Edit Portfolio', 'every-theme' ),
		'view_item'          => __( 'View Portfolio', 'every-theme' ),
		'all_items'          => __( 'All Portfolios', 'every-theme' ),
		'search_items'       => __( 'Search Portfolios', 'every-theme' ),
		'parent_item_colon'  => __( 'Parent Portfolios:', 'every-theme' ),
		'not_found'          => __( 'No Portfolios found.', 'every-theme' ),
		'not_found_in_trash' => __( 'No Portfolios found in Trash.', 'every-theme' )
	);

	$args = array(
		'labels'             => $labels,
        'description'        => __( 'Description.', 'every-theme' ),
		'public'             => true,
		'publicly_queryable' => true,
		'show_ui'            => true,
		'show_in_menu'       => true,
		'query_var'          => true,
		'rewrite'            => array( 'slug' => 'portfolio' ),
		'capability_type'    => 'post',
		'has_archive'        => true,
		'hierarchical'       => false,
		'menu_position'      => 5,
		'supports'           => array( 'title', 'editor', 'author', 'thumbnail', 'excerpt', 'comments' )
	);

	register_post_type( 'portfolio', $args );
}
add_action( 'init', 'custom_portfolio' );

//Taxonomy Register

function every_taxonomi_register() {
	// Add new taxonomy, make it hierarchical (like categories)
	$labels = array(
		'name'              => _x( 'Taxonomys', 'taxonomy general name', 'every-theme' ),
		'singular_name'     => _x( 'Taxonomy', 'taxonomy singular name', 'every-theme' ),
		'search_items'      => __( 'Search Taxonomys', 'every-theme' ),
		'all_items'         => __( 'All Taxonomys', 'every-theme' ),
		'parent_item'       => __( 'Parent Taxonomy', 'every-theme' ),
		'parent_item_colon' => __( 'Parent Taxonomy:', 'every-theme' ),
		'edit_item'         => __( 'Edit Taxonomy', 'every-theme' ),
		'update_item'       => __( 'Update Taxonomy', 'every-theme' ),
		'add_new_item'      => __( 'Add New Taxonomy', 'every-theme' ),
		'new_item_name'     => __( 'New Taxonomy Name', 'every-theme' ),
		'menu_name'         => __( 'Taxonomy', 'every-theme' ),
	);

	$args = array(
		'hierarchical'      => true,
		'labels'            => $labels,
		'show_ui'           => true,
		'show_admin_column' => true,
		'query_var'         => true,
		'rewrite'           => array( 'slug' => 'portfolio_taxonomy' ),
	);

	register_taxonomy( 'portfolio_taxonomy', array( 'portfolio' ), $args );
}

add_action( 'init', 'every_taxonomi_register', 0 );