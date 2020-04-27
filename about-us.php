<?php get_header(); 
      /*
          Template Name:About Page
      */
    ?>
			
			
			<!-- Start Slide -->
			<section id="slide">
				<div class="s-bg">
					<div class="container">
						<h1>about every</h1>
						<h3>SHARE<br>WITH<br>WORLD</h3>
					</div>
				</div><!-- /.sbg -->
				<div class="breadcrumbs">
					<div class="container">
						<ol class="breadcrumb">
						  <?php if(function_exists('every_breadcrumbs')) every_breadcrumbs();?>
						</ol>
					</div>
				</div>
			</section><!-- /#slide -->
			<!-- End Slide -->
	
	
			<!-- Start About -->
			<section id="about">
				<div class="about">
					<div class="container">
						<div class="about-us">
							<h1><?php echo esc_html(cs_get_option('about_title'));?></h1>
							<p><?php echo esc_html(cs_get_option('about_des1'));?></p>
							<div class="a-us">
								<div class="row">
									<div class="col-md-6">
										<div class="au-img"><img src="<?php echo esc_url(wp_get_attachment_image_src(cs_get_option('about_us_img'), 'full') [0]);?>" alt="image" /></div>
									</div>
									<div class="col-md-6">
										<h5><?php echo esc_html(cs_get_option('about_des2'));?></h5>
										<p><?php echo esc_html(cs_get_option('about_des3'));?></p>
										<ul>
										  <?php 
										       $about_us = cs_get_option('aboutus_group');
                                              if(is_array($about_us)){
                                              	foreach ($about_us as $key => $value) {  ?>

                                              		<li><i class="<?php echo esc_attr($value['about_us_icon']);?>" aria-hidden="true"></i><?php echo esc_html($value['about_us_text']);?></li>

                                              		<?php
                                              	}
                                              }
										  ?>
											
											
										</ul>
										<div class="au-icon"><button class="btn btn-default hvr-rectangle-in" onclick="window.location.href='<?php the_permalink(); ?>'">get in touch now</button></div>
									</div>
								</div>
							</div>
						</div>
			
					</div>
				</div>
			</section><!-- /#About -->
			<!-- End About -->
		</div>
		
		
		
		
		<!-- Start business -->
		<section id="business">
			<div class="container">
				<div class="aboutus">
						<div class="row">
                         
                         <?php 
                             $business_group = cs_get_option('business_group_section');
                             if (is_array($business_group)) {
                                 foreach ($business_group as $key => $value) { ?>
                                     

									<div class="col-md-4 col-sm-4">
										<div class="b-ic">
											<div class="b-icon">
												<div class="icon-bg"></div>
												<a href="#" class="hvr-wobble-skew"><i class="<?php echo esc_attr($value['business_icon']);?>" aria-hidden="true"></i></a>
											</div>
											<div class="b-content">
												<h3><a href="#"><?php echo esc_html($value['business_head']);?></a></h3>
												<p><?php echo esc_html($value['business_des']);?></p>
											</div>
										</div>
									</div>

                                   <?php
                                 }
                             }


                         ?>

						</div>
				</div>
			</div><!-- /.container -->
		</section><!-- /#business -->
		<!-- End business -->
	
	
	
		<!-- Start story -->
		<div class="contain">
			<section id="story">
				<div class="story">
					<div class="container">
						<div class="au-story">
							<div class="row">
								<div class="col-md-6 col-sm-6">
									<h2><?php echo esc_html(cs_get_option('about_story_title'));?></h2>
									<p><?php echo esc_html(cs_get_option('about_story_des'));?></p>
									<div class="a-icon"><a href="<?php the_permalink(); ?>" class="hvr-rectangle-in">learn more</a></div>
								</div>
								<div class="col-md-6 col-sm-6">
                                      <?php
                                          $about_progressbar = cs_get_option('aboutus_progress_group');
                                          if (is_array($about_progressbar)) {
                                          	foreach ($about_progressbar as $key => $value) { ?>

                                          		  <label><?php echo esc_html($value['progress_title']);?> :</label> 
													  <span class="sr-only"><?php echo esc_html($value['progress_percent_number']);?>%</span>
													<div class="progress">
														<div class="progress-bar" role="progressbar" data-transitiongoal="<?php echo esc_attr($value['progress_percent_number']);?>"></div>
													</div>
											  <?php
                                          	}
                                          }

                                      ?>

									
									
									
									
								</div>
							</div>
						</div>
					</div>
				</div><!-- /.container -->
			</section><!-- /#story -->
		</div>
		<!-- End story -->
	
	
		
		<!-- Start Team -->
		<div class="contain">
			<section id="team">
				<div class="team">
					<div class="container">
						<h1 class="title"><?php echo esc_html(cs_get_option('team_title'));?></h1>
						<p class="text"><?php echo esc_html(cs_get_option('team_des'));?></p>
						<div class="area">
							<div class="row">
                                <?php

                                      $team_section = cs_get_option('team_group');
                                      if (is_array($team_section)){
                                      	foreach ($team_section as $key => $value) { ?>
                                      		

                                            <div class="col-md-3 col-sm-6">
												<div class="t-box">
													<div class="t-img">
														<img src="<?php echo esc_url(wp_get_attachment_image_src( $value['team_img'], 'full' )[0]);?>" alt="image" />
													</div>
													<div class="t-content">
														<h5><?php echo esc_html($value['team_m_name']);?></h5>
														<p><?php echo esc_html($value['team_m_desi']);?></p>
														<div class="t-icon">
															<div class="ti-bg"><a href="<?php echo esc_url($value['team_fb_link']);?>"><i class="<?php echo esc_attr($value['team_fb_icon']);?>" aria-hidden="true"></i></a></div>
															<div class="ti-bg"><a href="<?php echo esc_url($value['team_tweet_link']);?>"><i class="<?php echo esc_attr($value['team_tweet_icon']);?>" aria-hidden="true"></i></a></div>
															<div class="ti-bg"><a href="<?php echo esc_url($value['team_gplus_link']);?>"><i class="<?php echo esc_attr($value['team_gplus_icon']);?>" aria-hidden="true"></i></a></div>
														</div>
													</div>
													<div class="t-overlay" style="background-color: <?php echo esc_attr(cs_get_option('overlay_color')); ?>">
														<div class="icon">
																<div class="t-bg"><a href="<?php echo esc_url($value['team_fb_link']);?>"><i class="<?php echo esc_attr($value['team_fb_icon']);?>" aria-hidden="true"></i></a></div>
																<div class="t-bg"><a href="<?php echo esc_url($value['team_tweet_link']);?>"><i class="<?php echo esc_attr($value['team_tweet_icon']);?>" aria-hidden="true"></i></a></div>
																<div class="t-bg"><a href="<?php echo esc_url($value['team_gplus_link']);?>"><i class="<?php echo esc_attr($value['team_gplus_icon']);?>" aria-hidden="true"></i></a></div>
															</div>
														<p><?php echo esc_html($value['team_member_des']);?></p>
														<hr />
														<div class="content">
															<h3><a href="#"><?php echo esc_html($value['team_m_name']);?></a></h3>
															<p><?php echo esc_html($value['team_m_desi']);?></p>
														</div>
													</div>
												</div>
											</div>
                                          <?php
                                      	}
                                      }

                                ?>

								
								
							
								
							</div><!-- /.row -->
						</div><!-- /.area -->
					</div><!-- /.container -->
				</div><!-- /.team -->
			</section><!-- /#team -->
			<!-- End Team -->
			
			
			
			<!-- Start client -->
			<section id="client">
				<div class="client">
					<div class="container">
						<h2><?php echo esc_html(cs_get_option('happy_client_title'));?></h2>
						<h4><?php echo esc_html(cs_get_option('happy_client_head_des'));?></h4>
						<!-- Start Slider -->
						<div id="carousel-example" class="carousel slide" data-ride="carousel">
						  <!-- Wrapper for slides -->
						  <div class="carousel-inner" role="listbox">

						  <?php 

                                 $happy_client_group = cs_get_option('happy_client_group');
                                 if (is_array($happy_client_group)) {
                                 	foreach ($happy_client_group as $key => $value) {  ?>
                                 		
                                        <div class="item active">
											<img src="<?php echo esc_url( wp_get_attachment_image_src($value['happy_client_img'], 'full' )[0]); ?>" alt="image" />
											<div class="c-txt">
												<p><?php echo esc_html($value['happy_client_des']);?> <br /><span><?php echo esc_html($value['happy_client_name']);?></span> </p>
											</div>
										</div>

										<?php
                                 	}
                                 }

						  ?>
							
							
						
						 </div>
						</div>
					  <!-- Controls -->
					  <a class="left carousel-control" href="#carousel-example" role="button" data-slide="prev">
						<i class="fa fa-angle-left" aria-hidden="true"></i>
					  </a>
					  <a class="right carousel-control" href="#carousel-example" role="button" data-slide="next">
						<i class="fa fa-angle-right" aria-hidden="true"></i>
					  </a>
					</div><!-- /.container -->
				</div><!-- /.Client -->
			  <div class="brand">
				  <div class="container">
					<ul>

					    <?php 
                             $sponsorlogo = cs_get_option('sponsor_logo_group');
                             if (is_array($sponsorlogo)) {
                             	foreach ($sponsorlogo as $key => $value) { ?>

                                	<li><a href=""><img src="<?php echo esc_url( wp_get_attachment_image_src( $value['sponsor_logo'], 'full' )[0]); ?>" alt="image" /></a></li>

                             	 <?php
                             	}
                             }


					    ?>
					
						
					</ul>
				  </div>
			  </div>
			</section><!-- /#Client -->
		</div>
		<!-- End Client -->
		
		
	<?php get_footer(); ?>