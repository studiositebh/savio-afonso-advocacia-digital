<?php
/**
 * Page template
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
        <div class="entry-content"><?php the_content(); ?></div>
      </article>
      <?php comments_template(); ?>
    <?php endwhile; ?>
  </div>
</main>

<?php get_sidebar(); ?>
<?php get_footer(); ?>
