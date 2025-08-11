<?php
/**
 * 404 template
 * @package DRADigital
 */

global $wp_query;
get_header();
?>

<main id="primary" class="site-main">
  <div class="container content">
    <article class="entry">
      <h1><?php esc_html_e('Página não encontrada', 'dradigital'); ?></h1>
      <p><?php esc_html_e('Desculpe, não conseguimos encontrar o que você procura.', 'dradigital'); ?></p>
      <?php get_search_form(); ?>
      <p><a class="button" href="<?php echo esc_url( home_url('/') ); ?>"><?php esc_html_e('Voltar para a página inicial', 'dradigital'); ?></a></p>
    </article>
  </div>
</main>

<?php get_footer(); ?>
