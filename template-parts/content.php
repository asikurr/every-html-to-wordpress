	<div class="blog">
		<a href="<?php the_permalink(); ?>"><?php if (has_post_thumbnail()) the_post_thumbnail('every-main-blog-thumb'); ?></a>
		<div class="b-content">
			<div class="calender"><?php echo esc_html(get_the_time('j')) ?> <span><?php echo esc_html(get_the_time('M')) ?></span></div>
			<div class="b-txt">
				<h3><a href="<?php the_permalink(); ?>"><?php the_title(); ?></a></h3>
				<p class="content">by  <a href="<?php the_author_link(); ?>" class="admin"><?php the_author(); ?></a> <span>|</span> <?php comments_popup_link( 'No comments yet', '1 comment', '% comments', 'comments-link', 'Comments are off for this post'); ?> <span>|</span> <?php the_category(', '); ?></p>
				<p><?php if ( ! has_excerpt()) {
					echo esc_html(wp_trim_words(get_the_content(), 20, '...'));	
				}
				else {echo the_excerpt();}
				?></p>
				<a href="<?php the_permalink(); ?>" class="admin"><span> - </span>Continue Reading</a>
			</div>
		</div>
	</div>