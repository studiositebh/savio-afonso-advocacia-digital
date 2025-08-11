<?php
/**
 * Main index template
 *
 * @package DRADigital
 */

global $wp_query;
get_header();
?>

<main id="primary" class="site-main">
  <div class="container content">
    <?php if ( have_posts() ) : ?>
      <?php if ( is_home() && ! is_front_page() ) : ?>
        <header class="page-header"><h1 class="page-title"><?php single_post_title(); ?></h1></header>
      <?php endif; ?>

      <?php while ( have_posts() ) : the_post(); ?>
        <article id="post-<?php the_ID(); ?>" <?php post_class('entry'); ?>>
          <?php if ( ! is_singular() ) : ?>
            <h2 class="entry-title"><a href="<?php the_permalink(); ?>"><?php the_title(); ?></a></h2>
          <?php else : ?>
            <h1 class="entry-title"><?php the_title(); ?></h1>
          <?php endif; ?>

          <div class="entry-meta">
            <?php echo get_the_date(); ?> · <?php the_author_posts_link(); ?>
          </div>

          <div class="entry-content">
            <?php is_singular() ? the_content() : the_excerpt(); ?>
          </div>
        </article>
      <?php endwhile; ?>

      <nav class="pagination">
        <div class="nav-previous"><?php next_posts_link( '&larr; Older posts', $wp_query->max_num_pages ); ?></div>
        <div class="nav-next"><?php previous_posts_link( 'Newer posts &rarr;' ); ?></div>
      </nav>

    <?php else : ?>
      <article class="entry"><h2><?php esc_html_e('Nothing Found', 'dradigital'); ?></h2><p><?php esc_html_e('Apologies, but no results were found.', 'dradigital'); ?></p><?php get_search_form(); ?></article>
    <?php endif; ?>
  </div>
</main>

<?php get_sidebar(); ?>
<?php get_footer(); ?>
