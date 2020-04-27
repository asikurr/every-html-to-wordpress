<?php

function every_custom_logo_widget() {
    register_sidebar( array(
        'name' => __( 'Upload Footer logo', 'every-theme' ),
        'id' => 'footer_logo',
        'description' => __( 'Widgets in this area will be shown on upload logo and Details.', 'every-theme' ),
        'before_widget' => '<div class="col-md-3 col-sm-6 widget">',
		'after_widget'  => '</div>',
		'before_title'  => '<h5 class="title">',
		'after_title'   => '</h5>',
    ) );
}

add_action( 'widgets_init', 'every_custom_logo_widget' );

/*
* Plugin Name: Media Upload Widget
* Plugin URI: http://www.paulund.co.uk
* Description: A widget that allows you to upload media from a widget
* Version: 1.0
* Author: Paul Underwood
* Author URI: http://www.paulund.co.uk
* License: GPL2
Copyright 2012  Paul Underwood
This program is free software; you can redistribute it and/or
modify it under the terms of the GNU General Public License,
version 2, as published by the Free Software Foundation.
This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.
*/
/**
 * Register the Widget
 */

class every_media_upload_widget extends WP_Widget
{
    /**
     * Constructor
     **/
    public function __construct()
    {
        $widget_ops = array(
            'classname' => 'every_media_upload',
            'description' => 'Widget that uses the built in Media library.'
        );
        parent::__construct( 'every_media_upload', 'Media Upload Footer Widget', $widget_ops );
        add_action('admin_enqueue_scripts', array($this, 'upload_scripts'));
    }
    /**
     * Upload the Javascripts for the media uploader
     */
    public function upload_scripts()
    {
        wp_enqueue_script('media-upload');
        wp_enqueue_script('thickbox');
        wp_enqueue_script('upload_media_widget', get_template_directory_uri(). '/assets/js/upload-media.js', array('jquery'));
        wp_enqueue_style('thickbox');
    }
    
    public function widget( $args, $instance )
    {
	    echo $args['before_widget'];
			if ( ! empty( $instance['image'] ) && ( $instance['description'] )) { ?>

	                   <div class="f-content">
							<a href="<?php echo site_url();?>"><img src="<?php echo apply_filters( 'image', $instance['image'] );?>" alt="image" /></a>
							<p><?php echo apply_filters( 'description', $instance['description'] );?></p>
					 </div>
                  <?php
				
			}
			
		echo $args['after_widget'];
    }
    
    public function update( $new_instance, $old_instance ) {
        // update logic goes here
        $updated_instance = $new_instance;
        $updated_instance['image'] = ( ! empty( $new_instance['image'] ) ) ? strip_tags( $new_instance['image'] ) : '';
        $updated_instance['description'] = ( ! empty( $new_instance['description'] ) ) ? strip_tags( $new_instance['description'] ) : '';

        return $updated_instance;
    }
    /**
     * Displays the form for this widget on the Widgets page of the WP Admin area.
     *
     * @param array  An array of the current settings for this widget
     * @return void
     **/
    public function form( $instance )
    {
        
        $image = '';
        if(isset($instance['image']))
        {
            $image = $instance['image'];
        }

        $description = __('Description','every-theme');
        if(isset($instance['description']))
        {
            $description = $instance['description'];
        }

        ?>
      

        <p>
            <label for="<?php echo $this->get_field_name( 'image' ); ?>"><?php _e( 'Image:','every-theme' ); ?></label>
            <input name="<?php echo $this->get_field_name( 'image' ); ?>" id="<?php echo $this->get_field_id( 'image' ); ?>" class="widefat" type="text" size="36"  value="<?php echo esc_url( $image ); ?>" />
            <input class="upload_image_button" type="button" value="Upload Image" />
        </p>

         <p>
            <label for="<?php echo $this->get_field_name( 'description' ); ?>"><?php _e( 'Description:','every-theme' ); ?></label>
            <textarea class="widefat" rows="4"  cols="10" id="<?php echo $this->get_field_id( 'description' ); ?>" name="<?php echo $this->get_field_name( 'description' ); ?>"> <?php echo esc_html( $description ); ?> </textarea>

        </p>
    <?php
    }
}

add_action( 'widgets_init', create_function( '', 'register_widget("every_media_upload_widget");' ) );


/**
 * Adds Foo_Widget widget.
 */
class footer_recent extends WP_Widget {

	/**
	 * Register widget with WordPress.
	 */
	function __construct() {
		parent::__construct(
			'every_footer_recent_post', // Base ID
			esc_html__( 'Footer Recent Post', 'every-theme' ), // Name
			array( 'description' => esc_html__( 'Widget that uses the built footer recent post', 'every-theme' ), ) // Args
		);
	}


	public function widget( $args, $instance ) {
		echo $args['before_widget'];

		if ( ! empty( $instance['title'] ) && ( $instance['postno'] )) {  ?>

               <h5 class="title"><?php echo  apply_filters( 'title', $instance['title'] ); ?></h5>

               <?php 
                    $recent_post = new WP_Query(array(

                    	'post_type'=>'post',
                    	'posts_per_page'=>$instance['postno'],

                    	));

                           if($recent_post->have_posts()) : while($recent_post->have_posts()) : $recent_post->the_post();

               ?>
				<div class="f-txt">
					<div class="f-img"><a href="<?php the_permalink();?>"><?php the_post_thumbnail('recent-blog');?></a></div>
					<p><a href="<?php the_permalink();?>"><?php echo wp_trim_words(get_the_content(),7); ?></a> <br /><span><?php echo esc_html(get_the_time('M'));?> <?php echo esc_html(get_the_time('j'));?>, <?php echo esc_html(get_the_time('Y'));?></span></p>
				</div>

           <?php

           endwhile; endif;

			
		}

		echo $args['after_widget'];
	}


	public function form( $instance ) {
		$title = ! empty( $instance['title'] ) ? $instance['title'] : esc_html__( 'New title', 'every-theme' );
		$postno = ! empty( $instance['postno'] ) ? $instance['postno'] : esc_html__( 'Post No', 'every-theme' );
		?>
		<p>
		<label for="<?php echo esc_attr( $this->get_field_id( 'title' ) ); ?>"><?php esc_attr_e( 'Title:', 'every-theme' ); ?></label> 
		<input class="widefat" id="<?php echo esc_attr( $this->get_field_id( 'title' ) ); ?>" name="<?php echo esc_attr( $this->get_field_name( 'title' ) ); ?>" type="text" value="<?php echo esc_attr( $title ); ?>">
		</p>

		<p>
		<label for="<?php echo esc_attr( $this->get_field_id( 'postno' ) ); ?>"><?php esc_attr_e( 'Post No:', 'every-theme' ); ?></label> 
		<input class="widefat" id="<?php echo esc_attr( $this->get_field_id( 'postno' ) ); ?>" name="<?php echo esc_attr( $this->get_field_name( 'postno' ) ); ?>" type="text" value="<?php echo esc_attr( $postno ); ?>">
		</p>
		<?php 
	}
	

	public function update( $new_instance, $old_instance ) {
		$instance = array();
		$instance['title'] = ( ! empty( $new_instance['title'] ) ) ? strip_tags( $new_instance['title'] ) : '';
		$instance['postno'] = ( ! empty( $new_instance['postno'] ) ) ? strip_tags( $new_instance['postno'] ) : '';

		return $instance;
	}

}
function footer_recent_post() {
    register_widget( 'footer_recent' );
}

add_action( 'widgets_init', 'footer_recent_post' );


/**
 * Contact us Footer Widget.
 */
class every_contact_Widget extends WP_Widget {

	function __construct() {
		parent::__construct(
			'contact_widget', // Base ID
			esc_html__( 'Contact Widget', 'every-theme' ), // Name
			array( 'description' => esc_html__( 'This is footer Contact widget', 'every-theme' ), ) // Args
		);
	}


	public function widget( $args, $instance ) {
		echo $args['before_widget'];

		if ( ! empty( $instance['title'] ) && ( $instance['icon1'] ) && ( $instance['address'] ) && ( $instance['address_des'] ) && ( $instance['icon2'] ) && ( $instance['email_tit'] ) && ( $instance['email_1'] ) && ( $instance['email_2'] )) { ?>

			
			


								<h5 class="title"><?php echo apply_filters( 'title', $instance['title'] );?></h5>
								<div class="f-txt">
									<i class="fa fa-<?php echo apply_filters( 'icon1', $instance['icon1'] );?>"></i> <?php echo apply_filters( 'address', $instance['address'] );?> :<br><?php echo apply_filters( 'address_des', $instance['address_des'] );?>
									<hr />
									<i class="fa fa-<?php echo apply_filters( 'icon2', $instance['icon2'] );?>"></i> <?php echo apply_filters( 'email_tit', $instance['email_tit'] );?> :<br><?php echo apply_filters( 'email_1', $instance['email_1'] );?><br><?php echo apply_filters( 'email_2', $instance['email_2'] );?>
								</div>



              <?php
		}

		echo $args['after_widget'];
	}


	public function form( $instance ) {
		$title = ! empty( $instance['title'] ) ? $instance['title'] : esc_html__( '', 'every-theme' );
		
		$icon1 = ! empty( $instance['icon1'] ) ? $instance['icon1'] : esc_html__( '', 'every-theme' );

		$address = ! empty( $instance['address'] ) ? $instance['address'] : esc_html__( '', 'every-theme' );

		$address_des = ! empty( $instance['address_des'] ) ? $instance['address_des'] : esc_html__( '', 'every-theme' );

		$icon2 = ! empty( $instance['icon2'] ) ? $instance['icon2'] : esc_html__( '', 'every-theme' );

		$email_tit = ! empty( $instance['email_tit'] ) ? $instance['email_tit'] : esc_html__( '', 'every-theme' );
		$email_1 = ! empty( $instance['email_1'] ) ? $instance['email_1'] : esc_html__( '', 'every-theme' );
		$email_2 = ! empty( $instance['email_2'] ) ? $instance['email_2'] : esc_html__( '', 'every-theme' );

		?>

		<p>
		<label for="<?php echo esc_attr( $this->get_field_id( 'title' ) ); ?>"><?php esc_attr_e( 'Title:', 'every-theme' ); ?></label> 
		<input class="widefat" id="<?php echo esc_attr( $this->get_field_id( 'title' ) ); ?>" name="<?php echo esc_attr( $this->get_field_name( 'title' ) ); ?>" type="text" value="<?php echo esc_attr( $title ); ?>">
		</p>

		<p>
		<label for="<?php echo esc_attr( $this->get_field_id( 'icon1' ) ); ?>"><?php esc_attr_e( 'Address Icon:', 'every-theme' ); ?></label> 
		<input class="widefat" id="<?php echo esc_attr( $this->get_field_id( 'icon1' ) ); ?>" name="<?php echo esc_attr( $this->get_field_name( 'icon1' ) ); ?>" type="text" value="<?php echo esc_attr( $icon1 ); ?>">
		</p>

		<p>
		<label for="<?php echo esc_attr( $this->get_field_id( 'address' ) ); ?>"><?php esc_attr_e( 'Address Title:', 'every-theme' ); ?></label> 
		<input class="widefat" id="<?php echo esc_attr( $this->get_field_id( 'address' ) ); ?>" name="<?php echo esc_attr( $this->get_field_name( 'address' ) ); ?>" type="text" value="<?php echo esc_attr( $address ); ?>">
		</p>

		<p>
		<label for="<?php echo esc_attr( $this->get_field_id( 'address_des' ) ); ?>"><?php esc_attr_e( 'Address Description:', 'every-theme' ); ?></label> 
		<textarea class="widefat" id="<?php echo esc_attr( $this->get_field_id( 'address_des' ) ); ?>" name="<?php echo esc_attr( $this->get_field_name( 'address_des' ) ); ?>" type="textarea" rows="4" cols="10" value=""><?php echo esc_html( $address_des ); ?></textarea>
		</p>

		<p>
		<label for="<?php echo esc_attr( $this->get_field_id( 'icon2' ) ); ?>"><?php esc_attr_e( 'Email Icon:', 'every-theme' ); ?></label> 
		<input class="widefat" id="<?php echo esc_attr( $this->get_field_id( 'icon2' ) ); ?>" name="<?php echo esc_attr( $this->get_field_name( 'icon2' ) ); ?>" type="text" value="<?php echo esc_attr( $icon2 ); ?>">
		</p>

		<p>
		<label for="<?php echo esc_attr( $this->get_field_id( 'email_tit' ) ); ?>"><?php esc_attr_e( 'Email Title:', 'every-theme' ); ?></label> 
		<input class="widefat" id="<?php echo esc_attr( $this->get_field_id( 'email_tit' ) ); ?>" name="<?php echo esc_attr( $this->get_field_name( 'email_tit' ) ); ?>" type="text" value="<?php echo esc_attr( $email_tit ); ?>">
		</p>

		<p>
		<label for="<?php echo esc_attr( $this->get_field_id( 'email_1' ) ); ?>"><?php esc_attr_e( 'Email 1:', 'every-theme' ); ?></label> 
		<input class="widefat" id="<?php echo esc_attr( $this->get_field_id( 'email_1' ) ); ?>" name="<?php echo esc_attr( $this->get_field_name( 'email_1' ) ); ?>" type="text" value="<?php echo esc_attr( $email_1 ); ?>">
		</p>

		<p>
		<label for="<?php echo esc_attr( $this->get_field_id( 'email_2' ) ); ?>"><?php esc_attr_e( 'Email 2:', 'every-theme' ); ?></label> 
		<input class="widefat" id="<?php echo esc_attr( $this->get_field_id( 'email_2' ) ); ?>" name="<?php echo esc_attr( $this->get_field_name( 'email_2' ) ); ?>" type="text" value="<?php echo esc_attr( $email_2 ); ?>">
		</p>

		<?php 
	}


	public function update( $new_instance, $old_instance ) {
		$instance = array();
		$instance['title'] = ( ! empty( $new_instance['title'] ) ) ? strip_tags( $new_instance['title'] ) : '';
		$instance['icon1'] = ( ! empty( $new_instance['icon1'] ) ) ? strip_tags( $new_instance['icon1'] ) : '';
		$instance['address'] = ( ! empty( $new_instance['address'] ) ) ? strip_tags( $new_instance['address'] ) : '';
		$instance['address_des'] = ( ! empty( $new_instance['address_des'] ) ) ? strip_tags( $new_instance['address_des'] ) : '';
		$instance['icon2'] = ( ! empty( $new_instance['icon2'] ) ) ? strip_tags( $new_instance['icon2'] ) : '';
		$instance['email_tit'] = ( ! empty( $new_instance['email_tit'] ) ) ? strip_tags( $new_instance['email_tit'] ) : '';

		$instance['email_1'] = ( ! empty( $new_instance['email_1'] ) ) ? strip_tags( $new_instance['email_1'] ) : '';

		$instance['email_2'] = ( ! empty( $new_instance['email_2'] ) ) ? strip_tags( $new_instance['email_2'] ) : '';

		return $instance;
	}

} // class Foo_Widget

function every_footer_contact_wedgets_details() {
    register_widget( 'every_contact_Widget' );
}

add_action( 'widgets_init', 'every_footer_contact_wedgets_details' );

/*
  CopyRight SideBar Register
*/

function every_copyright_widget() {
    register_sidebar( array(
        'name' => __( 'CopyRight Sidebar', 'every-theme' ),
        'id' => 'copyright_sidebar',
        'description' => __( 'This is our every theme copyright sidebar', 'every-theme' ),
        'before_widget' => '<div class="navbar-header">',
		'after_widget'  => '</div>',
		'before_title'  => '',
		'after_title'   => '',
    ) );
}
add_action( 'widgets_init', 'every_copyright_widget' );

/**
 * Adds Footer widget CopyRight.
 */
class copyright_wid extends WP_Widget {


	function __construct() {
		parent::__construct(
			'copyright_widget', // Base ID
			esc_html__( 'CopyRight Widget', 'every-theme' ), // Name
			array( 'description' => esc_html__( 'This is CopyRight Widget', 'every-theme' ), ) // Args
		);
	}


	public function widget( $args, $instance ) {
		echo $args['before_widget'];
		if ( ! empty( $instance['copyright'] ) && ( $instance['theme_name'] ) && ( $instance['theme_right'] )) { ?>


								<div class="menu-txt">
									<p><?php echo apply_filters( 'copyright', $instance['copyright'] );?>   <span>|</span>   <?php echo apply_filters( 'theme_name', $instance['theme_name'] );?>   <span>|</span>   <?php echo apply_filters( 'theme_right', $instance['theme_right'] );?></p>
								</div>

              <?php
		}
		echo $args['after_widget'];
	}


	public function form( $instance ) {
		$copyright = ! empty( $instance['copyright'] ) ? $instance['copyright'] : esc_html__( '', 'every-theme' );

		$theme_name = ! empty( $instance['theme_name'] ) ? $instance['theme_name'] : esc_html__( '', 'every-theme' );

		$theme_right = ! empty( $instance['theme_right'] ) ? $instance['theme_right'] : esc_html__( '', 'every-theme' );

		?>

		<p>
		<label for="<?php echo esc_attr( $this->get_field_id( 'copyright' ) ); ?>"><?php esc_attr_e( 'Copyright:', 'every-theme' ); ?></label> 
		<input class="widefat" id="<?php echo esc_attr( $this->get_field_id( 'copyright' ) ); ?>" name="<?php echo esc_attr( $this->get_field_name( 'copyright' ) ); ?>" type="text" value="<?php echo esc_attr( $copyright ); ?>">
		</p>

		<p>
		<label for="<?php echo esc_attr( $this->get_field_id( 'theme_name' ) ); ?>"><?php esc_attr_e( 'Theme Name:', 'every-theme' ); ?></label> 
		<input class="widefat" id="<?php echo esc_attr( $this->get_field_id( 'theme_name' ) ); ?>" name="<?php echo esc_attr( $this->get_field_name( 'theme_name' ) ); ?>" type="text" value="<?php echo esc_attr( $theme_name ); ?>">
		</p>

		<p>
		<label for="<?php echo esc_attr( $this->get_field_id( 'theme_right' ) ); ?>"><?php esc_attr_e( 'Theme Right:', 'every-theme' ); ?></label> 
		<input class="widefat" id="<?php echo esc_attr( $this->get_field_id( 'theme_right' ) ); ?>" name="<?php echo esc_attr( $this->get_field_name( 'theme_right' ) ); ?>" type="text" value="<?php echo esc_attr( $theme_right ); ?>">
		</p>


		<?php 
	}


	public function update( $new_instance, $old_instance ) {
		$instance = array();
		$instance['copyright'] = ( ! empty( $new_instance['copyright'] ) ) ? strip_tags( $new_instance['copyright'] ) : '';

		$instance['theme_name'] = ( ! empty( $new_instance['theme_name'] ) ) ? strip_tags( $new_instance['theme_name'] ) : '';

		$instance['theme_right'] = ( ! empty( $new_instance['theme_right'] ) ) ? strip_tags( $new_instance['theme_right'] ) : '';

		return $instance;
	}

} // class Foo_Widget
function every_footer_copyRight_widget() {
    register_widget( 'copyright_wid' );
}

add_action( 'widgets_init', 'every_footer_copyRight_widget' );



//Blog Sidebar

function every_blog_sidebar() {
    register_sidebar( array(
        'name' => __( 'Blog Sidebar', 'every-theme' ),
        'id' => 'blog_sidebar',
        'description' => __( 'This is blog sidebar', 'every-theme' ),
        'before_widget' => '<div class="right-side blog-sidebar">',
	    'after_widget'  => '</div>',
	    'before_title'  => '<h3 class="border">',
	    'after_title'   => '</h3>',
    ) );
}
add_action( 'widgets_init', 'every_blog_sidebar' );

//Blog Recent post Sidebar

function every_blog_recent_sidebar() {
    register_sidebar( array(
        'name' => __( 'Blog Recent Post Sidebar', 'every-theme' ),
        'id' => 'blog_recent_sidebar',
        'description' => __( 'This is blog sidebar', 'every-theme' ),
        'before_widget' => '<div class="right-side"><div class="rp-img"><div class="rp-txt">',
	    'after_widget'  => '</div></div></div>',
	    'before_title'  => '<h3 class="border">',
	    'after_title'   => '</h3>',
    ) );
}
add_action( 'widgets_init', 'every_blog_recent_sidebar' );


/**
 * Adds Blog Recent widget.
 */
class blog_recent extends WP_Widget {

	/**
	 * Register widget with WordPress.
	 */
	function __construct() {
		parent::__construct(
			'every_blog_recent_post', // Base ID
			esc_html__( 'Blog Recent Post', 'every-theme' ), // Name
			array( 'description' => esc_html__( 'Widget that uses the built Blog recent post', 'every-theme' ), ) // Args
		);
	}


	public function widget( $args, $instance ) {
		echo $args['before_widget'];

		if ( ! empty( $instance['title'] ) && ( $instance['postno'] )) {  ?>

               <h3 class="border"><?php echo  apply_filters( 'title', $instance['title'] ); ?></h3>

               <?php 
                    $recent_post = new WP_Query(array(

                    	'post_type'=>'post',
                    	'posts_per_page'=>$instance['postno'],

                    	));

                           if($recent_post->have_posts()) : while($recent_post->have_posts()) : $recent_post->the_post();

               ?>

            	<div class="RP">
					<div class="rp-img"><a href="<?php the_permalink();?>"><?php the_post_thumbnail('recent-blog');?></a></div>
					<div class="rp-txt">
						<h4><a href="<?php the_permalink();?>"><?php echo wp_trim_words(get_the_content(),7); ?></a></h4>
						<p><?php echo esc_html(get_the_time('M'));?> <?php echo esc_html(get_the_time('j'));?>, <?php echo esc_html(get_the_time('Y'));?></p>
					</div>
				</div>

           <?php

           endwhile; endif;

			
		}

		echo $args['after_widget'];
	}


	public function form( $instance ) {
		$title = ! empty( $instance['title'] ) ? $instance['title'] : esc_html__( 'New title', 'every-theme' );
		$postno = ! empty( $instance['postno'] ) ? $instance['postno'] : esc_html__( 'Post No', 'every-theme' );
		?>
		<p>
		<label for="<?php echo esc_attr( $this->get_field_id( 'title' ) ); ?>"><?php esc_attr_e( 'Title:', 'every-theme' ); ?></label> 
		<input class="widefat" id="<?php echo esc_attr( $this->get_field_id( 'title' ) ); ?>" name="<?php echo esc_attr( $this->get_field_name( 'title' ) ); ?>" type="text" value="<?php echo esc_attr( $title ); ?>">
		</p>

		<p>
		<label for="<?php echo esc_attr( $this->get_field_id( 'postno' ) ); ?>"><?php esc_attr_e( 'Post No:', 'every-theme' ); ?></label> 
		<input class="widefat" id="<?php echo esc_attr( $this->get_field_id( 'postno' ) ); ?>" name="<?php echo esc_attr( $this->get_field_name( 'postno' ) ); ?>" type="text" value="<?php echo esc_attr( $postno ); ?>">
		</p>
		<?php 
	}
	

	public function update( $new_instance, $old_instance ) {
		$instance = array();
		$instance['title'] = ( ! empty( $new_instance['title'] ) ) ? strip_tags( $new_instance['title'] ) : '';
		$instance['postno'] = ( ! empty( $new_instance['postno'] ) ) ? strip_tags( $new_instance['postno'] ) : '';

		return $instance;
	}

}
function blog_recent_post() {
    register_widget( 'blog_recent' );
}

add_action( 'widgets_init', 'blog_recent_post' );

//Blog Tag Sidebar

function every_blog_tag_sidebar() {
    register_sidebar( array(
        'name' => __( 'Blog Popur Tag', 'every-theme' ),
        'id' => 'blog_tag_sidebar',
        'description' => __( 'This is Blog Populer Tag', 'every-theme' ),
        'before_widget' => '<div class="blog-tag">',
	    'after_widget'  => '</div>',
	    'before_title'  => '<h3 class="border">',
	    'after_title'   => '</h3>',
    ) );
}
add_action( 'widgets_init', 'every_blog_tag_sidebar' );


//Blog Tag Sidebar

function every_blog_recent_tweet() {
    register_sidebar( array(
        'name' => __( 'Blog Recent Tweets', 'every-theme' ),
        'id' => 'blog_recent_tweet',
        'description' => __( 'This is Blog Populer Tag', 'every-theme' ),
        'before_widget' => '<div class="feeds blog-sidebar">',
	    'after_widget'  => '</div>',
	    'before_title'  => '<h3 class="border">',
	    'after_title'   => '</h3>',
    ) );
}
add_action( 'widgets_init', 'every_blog_recent_tweet' );




