		
		
		<!-- Start Footer -->
		<div class="contain">
			<section id="footer">
				<div class="footer">
					<div class="container">
						<div class="row">
						
								<?php dynamic_sidebar('footer_logo');?>
						
						</div>
					</div><!-- /.container -->
				</div>
			</section><!-- /#footer -->
			<!-- End Footer -->
			
			
			
			<!-- Start Footer Menu -->
			<section id="f-menu">
				<div class="container">
					<nav class="navbar navbar-default">
						<div class="container-fluid">
							<!-- Brand and toggle get grouped for better mobile display -->
							<div class="navbar-header">

							      <?php dynamic_sidebar('copyright_sidebar');?>

							</div>
							<!-- Collect the nav links, forms, and other content for toggling -->
							<div class="collapse navbar-collapse">

							<?php
									wp_nav_menu( array(
										'menu'              => 'footer_menu',
										'theme_location'    => 'footer_menu',
										//'depth'             => 3,
										'container'         => '',
										'container_class'   => '',
										//'container_id'      => 'bs-example-navbar-collapse-1',
										'menu_class'        => 'nav navbar-nav navbar-right',
										//'fallback_cb'       => 'WP_Bootstrap_Navwalker::fallback',
										//'walker'            => new WP_Bootstrap_Navwalker()
									));
								?>

							
							</div><!-- /.navbar-collapse -->
						</div><!-- /.container-fluid -->
					</nav><!-- .navbar navbar-default -->
					<!-- scroll-to-top -->
					<div class="scroll-to-top">
						<a href="#" id="scrollup"><i class="fa fa-angle-up"></i></a>
					</div>
					<!-- scroll-to-top -->
				</div><!-- /.container -->
			</section><!-- /#f-menu -->
		</div>
		<!-- End Footer Menu -->
		
	
		
		<?php wp_footer();?>
	</body>
</html>