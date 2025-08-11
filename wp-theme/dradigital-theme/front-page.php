<?php
/**
 * Front Page template
 *
 * @package DRADigital
 */

global $wp_query;
get_header();
?>

<section <?php echo dradigital_get_hero_style(); ?>>
  <div class="container">
    <h1><?php echo wp_kses_post( get_theme_mod( 'dradigital_hero_text', __( 'Bem-vindo(a) à DRADigital', 'dradigital' ) ) ); ?></h1>
    <p class="lead">&nbsp;<?php echo wp_kses_post( get_theme_mod( 'dradigital_hero_subtitle', __( 'Uma base WordPress leve e responsiva.', 'dradigital' ) ) ); ?></p>
  </div>
</section>

<main id="primary" class="site-main">
  <div class="container content">
    <?php
      // Show latest posts on front page below hero
      $front_query = new WP_Query( [ 'posts_per_page' => 3 ] );
      if ( $front_query->have_posts() ) :
        echo '<h2>' . esc_html__( 'Últimas notícias', 'dradigital' ) . '</h2>';
        while ( $front_query->have_posts() ) : $front_query->the_post(); ?>
          <article id="post-<?php the_ID(); ?>" <?php post_class('entry'); ?>>
            <h3 class="entry-title"><a href="<?php the_permalink(); ?>"><?php the_title(); ?></a></h3>
            <div class="entry-meta"><?php echo get_the_date(); ?></div>
            <div class="entry-content"><?php the_excerpt(); ?></div>
          </article>
        <?php endwhile;
        wp_reset_postdata();
      endif;
    ?>
  </div>
</main>

<?php get_footer(); ?>
