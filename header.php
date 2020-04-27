<!Doctype html>
<html <?php language_attributes(); ?> lang="en" class="no-js">
	<head>
		<!-- TITLE OF SITE -->
		

		<!-- META DATA -->
		<meta charset="utf-8">
		<meta name="viewport" content="width=device-width, initial-scale=1.0">
		<meta http-equiv="X-UA-Compatible" content="IE=edge">

     <?php wp_head();?>
	</head>
	
	
	<body <?php body_class(); ?>>
		<!-- Preloader start here -->
		<div class="preloader">
			<div class="loader">
				<span></span>
				<span></span>
				<span></span>
				<span></span>
			</div>
		</div>
		<!-- Preloader end here -->

		<!-- Start header -->
		<div class="contain">
			<section id="header">
				<div class="container">
					<ul class="top-left"> 
						<li><i class="<?php echo esc_attr(cs_get_option('h_nub_ic'));?>"></i> <?php echo esc_html(cs_get_option('h_nub'));?></li>
						<li><i class="<?php echo esc_attr(cs_get_option('h_email_ic'));?>"></i> <a href="#"></a> <?php echo esc_html(cs_get_option('h_email'));?></li>
					</ul>
					<div class="bc">
						<ul class="top-right">
							<li class="bb">
								
									<?php echo do_shortcode('[gtranslate]'); ?>
							
							</li>
							<li class="bb"> 
							<a href="#" data-toggle="modal" data-target=".bs-example-modal-sm"><i class="fa fa-sign-in"></i> sign in</a>
							    <div class="modal fade bs-example-modal-sm" tabindex="-1" role="dialog">
								  <div class="modal-dialog modal-sm">
									<div class="modal-content">
									  <!-- Start .panel -->
										<div class="panel-body">
											<form class="form-horizontal" action="index.html" role="form">
												<?php echo do_shortcode('[wppb-login]'); ?>
											</form>
										</div>
										<!-- End .panel -->
									</div>
								  </div>
								</div>
							/ <a href="#" data-toggle="modal" data-target=".bs-example-modal-lg"> register</a>
							<div class="modal fade bs-example-modal-lg" tabindex="-1" role="dialog">
							  <div class="modal-dialog modal-lg">
								<div class="modal-content">
									<div class="panel-body pb">
										<h2 class="title">Register</h2>
										<form class="form-horizontal" action="index.html" role="form">
											<?php echo do_shortcode('[wppb-register]'); ?>
										</form>
									</div>
								  </div>
								</div>
								</div>
							</li>
						</ul>
						<div class="h-icon">
							<div class="icon">
                               <?php
                                 $h_social = cs_get_option('header_social_section');
                                 if(is_array($h_social)){  
                                    foreach ($h_social as $key => $value) {  ?>
                                    	
								      <div class="t-bg"><a href="<?php echo esc_url($value['h_icon_link']);?>"><i class="<?php echo esc_attr($value['h_social_icon']);?>" aria-hidden="true"></i></a></div>
								      <?php
                                    }
								  }
                                ?>
							</div>
						</div>
					</div>
				</div><!-- /.container -->
			</section><!-- /.header -->
			<!-- End header -->

			<!-- Start Main-Menu -->
			<section id="main-menu">
				<div class="container">
					<div class="menu">
						<div class="wrapper">
							<div class="brand">

                                <?php 
                                    $header_logo = cs_get_option('header_logo');
                                    if ($header_logo) { ?>
                                    	<a class="navbar-brand" href="<?php echo esc_url(site_url('/'));?>"><img src="<?php echo esc_url(wp_get_attachment_image_src($header_logo, 'full')[0] ); ?>" alt="image" /></a>
                                    	<?php
                                    }
                                   ?>
							</div>

							<!-- START Responsive Menu HTML -->
							<div class="rm-container">
								<a class="rm-toggle rm-button rm-nojs" href="#">Menu</a>
										<?php
								            wp_nav_menu( array(
								                'menu'              => 'header_menu',
								                'theme_location'    => 'header_menu',
								                'depth'             => 4,
								                'container'         => 'nav',
								                'container_class'   => 'rm-nav rm-nojs rm-lighten',
								               // 'container_id'      => 'bs-example-navbar-collapse-1',
								               // 'menu_class'        => 'nav',
								                //'fallback_cb'       => 'WP_Bootstrap_Navwalker::fallback',
								              // 'walker'            => new WP_Bootstrap_Navwalker()
								               ));
								        ?>

							</div><!-- .rm-container -->
							<!-- End Responsive Menu HTML -->
						</div><!-- .wrapper -->
					</div><!-- .menu -->
				</div><!-- /.container -->
			</section><!-- /#main-menu  -->
			<!-- End Main-Menu -->
	
	
			
			