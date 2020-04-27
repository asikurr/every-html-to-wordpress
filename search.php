<?php get_header(); ?>
			
			
			
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
		</div>
	
	
		<!-- Start blog -->
		<section id="blog">
			<div class="blogg">
				<div class="container">
					<div class="row">
						<div class="col-md-8 col-sm-8">
						
						<?php if ( have_posts() ) : ?>

								<header class="page-header">
									<h1 class="page-title"><?php printf( __( 'Search Results for: %s', 'every-theme' ), '<span>' . esc_html( get_search_query() ) . '</span>' ); ?></h1>
								</header><!-- .page-header -->

								<?php
								// Start the loop.
								while ( have_posts() ) : the_post();

									/**
									 * Run the loop for the search to output the results.
									 * If you want to overload this in a child theme then include a file
									 * called content-search.php and that will be used instead.
									 */
									get_template_part( 'template-parts/content', 'search' );

								// End the loop.
								endwhile;

								// Previous/next page navigation. ?>
							<div class="pageedit">
					
							  <?php 
									the_posts_pagination( array(
										'mid_size' 			 => 2,
										'prev_text'          => __( '', 'every-theme' ),
										'next_text'          => __( '&raquo;', 'every-theme' ),
									) );
								?>
							
							</div>
							<?php
							// If no content, include the "No posts found" template.
							else :
								get_template_part( 'template-parts/content', 'none' );

							endif;
							?>

							
		
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