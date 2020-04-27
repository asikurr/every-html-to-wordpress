<?php get_header(); 
      /*
          Template Name:Contact Page
      */
    ?>

			<!-- Start Slide -->
			<section id="slide">
				<div class="sbg">
					<div class="container">
						<h1>contact</h1>
						<h3>SHARE<br>WITH<br>WORLD</h3>
					</div>
				</div><!-- /.sbg -->
			</section><!-- /#slide -->
			<!-- End Slide -->
			
			<!-- Start Map -->
				<div id="map" class="ev-map-display"></div>
			<!-- End Map -->
		</div>
	
	
	
		<!-- Start contact-us -->
		<section id="contact-us">
			<div class="container">
				<div class="contact">
					<div class="over-txt">
						<h2><?php echo esc_html(cs_get_option('contact_title1'));?> <span><?php echo esc_html(cs_get_option('contact_title2'));?></span></h2>
						<div class="c-icon">
							<ul>

                                <?php 
                                    $contact_media = cs_get_option('contact_media_group');
                                    if (is_array($contact_media)) {
                                        foreach ($contact_media as $key => $value) { ?>

                                        	<li><a href="<?php echo esc_url($value['contact_link']);?>"><i class="<?php echo esc_attr($value['contact_icon']);?>" aria-hidden="true"></i></a></li>
                                        <?php
                                        }
                                    }
   
                                ?>


							</ul>
						</div>
					</div>
				</div>
				<div class="contact-us">
					<div class="row">
						<div class="col-md-4 col-sm-4">
							<div class="c-txt">
								<h3><?php echo esc_html(cs_get_option('contact_us_title'));?></h3>
								<p> <?php echo esc_html(cs_get_option('c_description'));?></p>
								<ul>
									<li> <i class="<?php echo esc_attr(cs_get_option('c_address_icon'));?>"></i><?php echo esc_html(cs_get_option('c_address'));?></li>
									<li><i class="<?php echo esc_attr(cs_get_option('c_phone_icon'));?>"></i><?php echo esc_html(cs_get_option('c_phone_num1'));?><br><?php echo esc_html(cs_get_option('c_phone_num2'));?></li>
									<li class="b-c"><i class="<?php echo esc_attr(cs_get_option('c_email_icon'));?>"></i><a href="#"><?php echo esc_html(cs_get_option('c_email_id'));?></a></li>
								</ul>
							</div>
						</div>
						<div class="col-md-8 col-sm-8">
						
								<div class="c-txt">
									<h4>SEND US A MESSAGE</h4>
									<div class="row">
									  <?php echo do_shortcode('[contact-form-7 id="86" title="Contact form 1"]'); ?>
										
									</div>
		   					  </div>
						</div>
					</div>
				</div>
			</div><!-- container -->
		</section><!-- contact-us -->
		<!-- End contact-us -->
		
<?php get_footer();?>