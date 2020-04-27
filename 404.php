<?php
/**
 * The template for displaying 404 pages (not found)
 *
 * @package WordPress
 * @subpackage Twenty_Sixteen
 * @since Twenty Sixteen 1.0
 */

get_header(); ?>

	
			<!-- Start Slide -->
			<section id="slide">
				<div class="s-bg slide">
					<div class="container">
						<h1>blog full with</h1>
						<h3>right<br>sidebar</h3>
					</div>
				</div><!-- /.sbg -->
				<div class="breadcrumbs">
					<div class="container">
						<ol class="breadcrumb">
						  <?php if (function_exists('every_breadcrumbs')) every_breadcrumbs(); ?>
						</ol>
					</div>
				</div>
			</section><!-- /#slide -->
			<!-- End Slide -->

	
	
		<!-- Start blog -->
		<section id="blog">
			<div class="blogg">
				<div class="container">
					<div class="row">
						<div class="col-md-8 col-sm-8">
						
					        
						<div id="primary" class="content-area">
							<main id="main" class="site-main" role="main">

								<section class="error-404 not-found">
									<header class="page-header">
										<h1 class="page-title"><?php _e( 'Oops! That page can&rsquo;t be found.', 'every-theme' ); ?></h1>
									</header><!-- .page-header -->

									<div class="page-content">
										<p><?php _e( 'It looks like nothing was found at this location. Maybe try a search?', 'every-theme' ); ?></p>

										<?php get_search_form(); ?>
									</div><!-- .page-content -->
								</section><!-- .error-404 -->

							</main><!-- .site-main -->

						</div><!-- .content-area -->
		
						</div>
						<div class="col-md-4 col-sm-4 blog-widget">

							<?php dynamic_sidebar('blog_sidebar');?>
							<?php dynamic_sidebar('blog_recent_sidebar');?>

							<?php dynamic_sidebar('blog_tag_sidebar');?>
                            
                            <?php dynamic_sidebar('blog_recent_tweet');?>
							
							
					
						</div>
					</div>
				</div><!-- /.container -->
			</div><!-- /.blogg -->
		</section><!-- /#blog -->
		<!-- Start blog -->
		






<?php get_footer(); ?>
