<?php
/**
 * Header template
 * @package DRADigital
 */
?><!DOCTYPE html>
<html <?php language_attributes(); ?>>
<head>
  <meta charset="<?php bloginfo( 'charset' ); ?>">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <?php wp_head(); ?>
</head>
<body <?php body_class(); ?>>
<?php wp_body_open(); ?>
<header class="site-header">
  <div class="container">
    <div class="site-branding">
      <?php if ( has_custom_logo() ) : ?>
        <div class="site-logo"><?php the_custom_logo(); ?></div>
      <?php endif; ?>
      <div>
        <?php if ( is_front_page() && is_home() ) : ?>
          <h1 class="site-title"><a href="<?php echo esc_url( home_url( '/' ) ); ?>"><?php bloginfo( 'name' ); ?></a></h1>
        <?php else : ?>
          <p class="site-title"><a href="<?php echo esc_url( home_url( '/' ) ); ?>"><?php bloginfo( 'name' ); ?></a></p>
        <?php endif; ?>
        <?php $desc = get_bloginfo( 'description', 'display' ); if ( $desc ) : ?>
          <p class="site-description"><?php echo esc_html( $desc ); ?></p>
        <?php endif; ?>
      </div>
    </div>

    <nav class="primary-nav" aria-label="<?php esc_attr_e('Primary Menu','dradigital'); ?>">
      <?php wp_nav_menu( [
        'theme_location' => 'primary',
        'container'      => false,
        'menu_class'     => '',
        'fallback_cb'    => function(){ echo '<ul><li><a href="' . esc_url( admin_url( 'nav-menus.php' ) ) . '">' . esc_html__( 'Add a menu', 'dradigital' ) . '</a></li></ul>'; },
      ] ); ?>
    </nav>
  </div>
</header>
