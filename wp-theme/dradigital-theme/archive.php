<?php
/**
 * Archive template
 * @package DRADigital
 */

global $wp_query;
get_header();
?>

<main id="primary" class="site-main">
  <div class="container content">
    <header class="page-header">
      <h1 class="page-title"><?php the_archive_title(); ?></h1>
      <?php the_archive_description( '<div class="archive-description">', '</div>' ); ?>
    </header>

    <?php if ( have_posts() ) : while ( have_posts() ) : the_post(); ?>
      <article id="post-<?php the_ID(); ?>" <?php post_class('entry'); ?>>
        <h2 class="entry-title"><a href="<?php the_permalink(); ?>"><?php the_title(); ?></a></h2>
        <div class="entry-meta"><?php echo get_the_date(); ?></div>
        <div class="entry-content"><?php the_excerpt(); ?></div>
      </article>
    <?php endwhile; endif; ?>

    <nav class="pagination">
      <div class="nav-previous"><?php next_posts_link( '&larr; Older', $wp_query->max_num_pages ); ?></div>
      <div class="nav-next"><?php previous_posts_link( 'Newer &rarr;' ); ?></div>
    </nav>
  </div>
</main>

<?php get_sidebar(); ?>
<?php get_footer(); ?>
