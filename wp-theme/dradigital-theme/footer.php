<?php
/**
 * Footer template
 * @package DRADigital
 */
?>
<footer class="site-footer">
  <div class="container">
    <nav class="footer-nav" aria-label="<?php esc_attr_e('Footer Menu','dradigital'); ?>">
      <?php wp_nav_menu( [
        'theme_location' => 'footer',
        'container'      => false,
        'menu_class'     => '',
        'fallback_cb'    => '__return_empty_string',
      ] ); ?>
    </nav>
    <p class="small">&copy; <?php echo esc_html( date( 'Y' ) ); ?> <?php bloginfo( 'name' ); ?>. <?php esc_html_e('All rights reserved.','dradigital'); ?></p>
  </div>
</footer>
<?php wp_footer(); ?>
</body>
</html>
