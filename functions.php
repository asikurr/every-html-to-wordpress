<?php

//Enqueue Linking
 if ( file_exists( get_template_directory(). '/inc/enqueue.php' ) ){
        require_once(get_template_directory(). '/inc/enqueue.php');
 }
 //Option linking
 if ( file_exists( get_template_directory(). '/options/cs-framework.php' ) ){
        require_once(get_template_directory(). '/options/cs-framework.php');
 }
  //Add Theme Support
 if ( file_exists( get_template_directory(). '/inc/theme-support.php' ) ){
        require_once(get_template_directory(). '/inc/theme-support.php');
 }
  //Custom Post Portfolio
 if ( file_exists( get_template_directory(). '/inc/custom-post-portfolio.php' ) ){
        require_once(get_template_directory(). '/inc/custom-post-portfolio.php');
 }
  //Custom widget logo and Details
 if ( file_exists( get_template_directory(). '/inc/custom-widget.php' ) ){
        require_once(get_template_directory(). '/inc/custom-widget.php');
 }
 //breadcoumb
 if ( file_exists( get_template_directory(). '/inc/breadcoumb.php' ) ){
        require_once(get_template_directory(). '/inc/breadcoumb.php');
 }
 //TGm plugin
 if ( file_exists( get_template_directory(). '/inc/plugin/plugin-activation.php' ) ){
        require_once(get_template_directory(). '/inc/plugin/plugin-activation.php');
 }




















?>