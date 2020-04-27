<?php get_header(); 
      /*
          Template Name:Blog Page
           @since Every Theme 1.0
      */
    ?>
			
			
			
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
		 <div id="post-<?php the_ID(); ?>" <?php post_class(); ?>>
			<div class="blogg unitcss">
				<div class="container">
					<div class="row">
						<div class="col-md-8 col-sm-8">
                        
                           <?php 
						        
                                if(have_posts()) : while(have_posts()) : the_post();

					     	?>

							<div class="blog">
								<a href="<?php the_permalink();?>"><?php if(has_post_thumbnail()) the_post_thumbnail('every_blog_post');?></a>
								<div class="b-content">
									<div class="calender"><?php echo esc_html(get_the_time('d'));?> <span><?php echo esc_html(get_the_time('M'));?></span></div>
									<div class="b-txt">
										<h3><a href="<?php the_permalink();?>"><?php the_title();?></a></h3>
										<p class="content">by  <a href="<?php the_author_link();?>" class="admin"><?php the_author();?></a> <span>|</span> <?php
											  comments_popup_link( 'No comments yet', '1 comment', '% comments', 'comments-link', 'Comments are off for this post');
											?> <span>|</span> <?php the_category(' , ');?></p>
										<p> 
										<?php if(! has_excerpt()){
											echo esc_html(wp_trim_words(get_the_content(),20,'...'));
											}
											else
											{
												echo the_excerpt();
										    }?>
													
										</p>
										<a href="<?php the_permalink();?>" class="admin"><span> - </span>Continue Reading</a>
									</div>
								</div>
							</div>
					
					  <?php endwhile; endif;  ?>
							
							<div class="pageedit">
							 <?php
								the_posts_pagination( array(
									'mid_size'           => 3,
									'prev_text'          => __( 'Prev', 'every-theme' ),
									'next_text'          => __( 'Next', 'every-theme' ),

								) );

								?>
							</div>
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