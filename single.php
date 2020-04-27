
<?php
get_header();
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
			<div class="blogg unitcss">
				<div class="container">
					<div class="row">
                    <?php wp_link_pages( ); ?>
                   <?php 
				  
                        if(have_posts()) : while(have_posts()) : the_post();

			     	?>
                
						<div class="col-md-8 col-sm-8">
							<div class="blog">
								<?php if(has_post_thumbnail()) the_post_thumbnail('every_blog_post');?>
							</div>
							<div class="blog-c">
								<div class="calender"><?php echo esc_html(get_the_time('d'));?> <span><?php echo esc_html(get_the_time('M'));?></span></div>
								<div class="b-txt">
									<h3><?php the_title();?></h3>
									<p class="content">by  <a href="<?php the_author_link();?>" class="admin"><?php the_author();?></a> <span>|</span> <?php
											  comments_popup_link( 'No comments yet', '1 comment', '% comments', 'comments-link', 'Comments are off for this post');
											?> <span>|</span> <?php the_category(' , ');?></p>
									<p><?php the_content();?></p>
								
									<div class="b-menu">
										<i class="fa fa-tag" aria-hidden="true"></i>
										<ul>
											
											<li><?php the_tags( ' ', ' ', ' ');?></li>
										</ul>
									</div>
									<div class="share-post">
										<label> Share This Post</label>
										<ul>
											<li><a href="http://www.facebook.com/sharer.php?url=<?php the_permalink();?>&amp;t=<?php the_title(); ?>"><i class="fa fa-facebook" aria-hidden="true"></i></a></li>
											<li><a href="http://twitter.com/home/?status=<?php the_title(); ?> - <?php the_permalink(); ?>"><i class="fa fa-twitter" aria-hidden="true"></i></a></li>
											<li><a href="http://pinterest.com/pin/create/button/?url=<?php the_permalink(); ?>&media=<?php $url = wp_get_attachment_url( get_post_thumbnail_id($post->ID) ); echo $url; ?>"><i class="fa fa-pinterest-p" aria-hidden="true"></i></a></li>
											<li><a href="https://plus.google.com/share?url=<?php the_permalink(); ?>" onclick="javascript:window.open(this.href,
											'', 'menubar=no,toolbar=no,resizable=yes,scrollbars=yes,height=600,width=600');return false;"><i class="fa fa-google-plus" aria-hidden="true"></i></a></li>
											<li><a href="http://www.linkedin.com/shareArticle?mini=true&amp;title=<?php the_title(); ?>&amp;url=<?php the_permalink(); ?>"><i class="fa fa-linkedin" aria-hidden="true"></i></a></li>
										</ul>
									</div>
									<div class="a-post">
										<?php echo get_avatar( get_the_author_meta( 'ID' ), 80 ); ?>
										<div class="a-txt">
											<h5>About This Post :  <a href="<?php echo get_author_posts_url( get_the_author_meta( 'ID' ), get_the_author_meta( 'user_nicename' ) ); ?>" class="admin"><?php the_author();?></a></h5>
											<p><?php echo the_author_meta( 'description' )?></p>
										</div>
									</div>


								<div class="rel-post">
										 
										<?php $ntt_current_post = $post;

										global $post;

										 

										// Get category for the current post

										$ntt_post_categories = get_the_category($post->ID);

										 

										// If the post has a category start storing them in an array

										if ($ntt_post_categories) {

										$ntt_category_ids = array();

										foreach($ntt_post_categories as $ntt_indiv_category) $ntt_category_ids[] = $ntt_indiv_category->term_id; // Gets the categories id number

										 

										$args=array(

										'category__in' => $ntt_category_ids,

										// Don't show the current post Must pass array

										'post__not_in' => array($post->ID),

										// Don't show pages

										'post_type' => 'post',

										// Only show published posts

										'post_status' => 'publish',

										'posts_per_page'=> 3// Number of related posts that will be shown.

										);

										 

										$my_query = new wp_query( $args );

										if( $my_query->have_posts() ) {

										echo '<div class="rel-post"><h3>Related Posts</h3>';

										while( $my_query->have_posts() ) {

										$my_query->the_post();?>

													<div class="rel-img">
														<?php the_post_thumbnail(); ?>
														<h4><a href="<?php the_permalink();?>"><?php $ntt_the_title = $post->post_title; echo substr($ntt_the_title, 0, 20); ?></a></h4>
														<p><?php echo esc_html(get_the_time('j M Y'));?></p>
													</div>

										<?php

										} ?>

										</div>

										<?php

										}

										}

										$post = $ntt_current_post;

										wp_reset_query(); ?>

								</div> <!– End of morePosts –>
									

									<div id="comments" class="comments-area">
                                      <?php
                                         if ( comments_open() || get_comments_number() ) {
												comments_template();
											}

                                         ?>

										
									</div>
								</div>
							</div>
						</div>

                 <?php endwhile; endif;  ?>

						
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