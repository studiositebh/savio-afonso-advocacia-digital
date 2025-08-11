<?php
/**
 * Single Post template
 * @package DRADigital
 */

global $wp_query;
get_header();
?>

<main id="primary" class="site-main">
  <div class="container content">
    <?php while ( have_posts() ) : the_post(); ?>
      <article id="post-<?php the_ID(); ?>" <?php post_class('entry'); ?>>
        <h1 class="entry-title"><?php the_title(); ?></h1>
        <div class="entry-meta"><?php echo get_the_date(); ?> · <?php the_author_posts_link(); ?></div>
        <div class="entry-content"><?php the_content(); ?></div>
        <div class="entry-tags"><?php the_tags(); ?></div>
        <nav class="post-nav">
          <div class="prev"><?php previous_post_link('%link', '&larr; %title'); ?></div>
          <div class="next"><?php next_post_link('%link', '%title &rarr;'); ?></div>
        </nav>
      </article>
      <?php comments_template(); ?>
    <?php endwhile; ?>
  </div>
</main>

<?php get_sidebar(); ?>
<?php get_footer(); ?>
