<?php
/**
 * Theme setup and functionality
 *
 * @package DRADigital
 */

if ( ! defined( 'DRADIGITAL_VERSION' ) ) {
  define( 'DRADIGITAL_VERSION', '1.0.0' );
}

add_action( 'after_setup_theme', function() {
  // Translations
  load_theme_textdomain( 'dradigital', get_template_directory() . '/languages' );

  // Core supports
  add_theme_support( 'title-tag' );
  add_theme_support( 'post-thumbnails' );
  add_theme_support( 'html5', [ 'search-form', 'comment-form', 'comment-list', 'gallery', 'caption', 'style', 'script' ] );
  add_theme_support( 'custom-logo', [ 'height' => 120, 'width' => 120, 'flex-width' => true ] );
  add_theme_support( 'automatic-feed-links' );

  // Menus
  register_nav_menus( [
    'primary' => __( 'Primary Menu', 'dradigital' ),
    'footer'  => __( 'Footer Menu', 'dradigital' ),
  ] );
} );

// Sidebar
add_action( 'widgets_init', function() {
  register_sidebar( [
    'name'          => __( 'Primary Sidebar', 'dradigital' ),
    'id'            => 'primary-sidebar',
    'description'   => __( 'Widgets in this area will be shown on all posts and pages.', 'dradigital' ),
    'before_widget' => '<section id="%1$s" class="widget %2$s">',
    'after_widget'  => '</section>',
    'before_title'  => '<h3 class="widget-title">',
    'after_title'   => '</h3>',
  ] );
} );

// Enqueue assets
add_action( 'wp_enqueue_scripts', function() {
  wp_enqueue_style( 'dradigital-style', get_stylesheet_uri(), [], DRADIGITAL_VERSION );
  wp_enqueue_script( 'dradigital-theme', get_template_directory_uri() . '/assets/js/theme.js', [], DRADIGITAL_VERSION, true );
} );

// Output CSS variables from Customizer
add_action( 'wp_head', function() {
  $primary = get_theme_mod( 'dradigital_primary_color', '#0ea5e9' );
  $padding = absint( get_theme_mod( 'dradigital_header_padding', 48 ) );
  echo '<style id="dradigital-root-variables">:root{--primary:' . esc_html( $primary ) . ';--header-padding:' . esc_html( $padding ) . 'px;}</style>';
} );

// Customizer
add_action( 'customize_register', function( $wp_customize ) {
  // Section
  $wp_customize->add_section( 'dradigital_appearance', [
    'title'    => __( 'Theme Appearance', 'dradigital' ),
    'priority' => 30,
  ] );

  // Primary color
  $wp_customize->add_setting( 'dradigital_primary_color', [
    'default'           => '#0ea5e9',
    'transport'         => 'refresh',
    'sanitize_callback' => 'sanitize_hex_color',
  ] );
  $wp_customize->add_control( new WP_Customize_Color_Control( $wp_customize, 'dradigital_primary_color', [
    'label'   => __( 'Primary Color', 'dradigital' ),
    'section' => 'dradigital_appearance',
  ] ) );

  // Header padding
  $wp_customize->add_setting( 'dradigital_header_padding', [
    'default'           => 48,
    'transport'         => 'refresh',
    'sanitize_callback' => 'absint',
  ] );
  $wp_customize->add_control( 'dradigital_header_padding', [
    'label'       => __( 'Header Top Padding (px)', 'dradigital' ),
    'section'     => 'dradigital_appearance',
    'type'        => 'number',
    'input_attrs' => [ 'min' => 0, 'max' => 240, 'step' => 2 ],
  ] );

  // Hero text
  $wp_customize->add_setting( 'dradigital_hero_text', [
    'default'           => __( 'Bem-vindo(a) à DRADigital', 'dradigital' ),
    'transport'         => 'refresh',
    'sanitize_callback' => 'wp_kses_post',
  ] );
  $wp_customize->add_control( 'dradigital_hero_text', [
    'label'   => __( 'Hero Title', 'dradigital' ),
    'section' => 'dradigital_appearance',
    'type'    => 'text',
  ] );

  // Hero subtitle
  $wp_customize->add_setting( 'dradigital_hero_subtitle', [
    'default'           => __( 'Uma base WordPress leve e responsiva.', 'dradigital' ),
    'transport'         => 'refresh',
    'sanitize_callback' => 'wp_kses_post',
  ] );
  $wp_customize->add_control( 'dradigital_hero_subtitle', [
    'label'   => __( 'Hero Subtitle', 'dradigital' ),
    'section' => 'dradigital_appearance',
    'type'    => 'text',
  ] );

  // Hero image
  $wp_customize->add_setting( 'dradigital_hero_image', [
    'default'           => '',
    'transport'         => 'refresh',
    'sanitize_callback' => 'absint',
  ] );
  $wp_customize->add_control( new WP_Customize_Media_Control( $wp_customize, 'dradigital_hero_image', [
    'label'    => __( 'Hero Background Image', 'dradigital' ),
    'section'  => 'dradigital_appearance',
    'mime_type'=> 'image',
  ] ) );
} );

// Helper: get hero background style
function dradigital_get_hero_style() {
  $id = get_theme_mod( 'dradigital_hero_image' );
  if ( $id ) {
    $url = wp_get_attachment_image_url( $id, 'full' );
    if ( $url ) {
      return 'style="background-image:url(' . esc_url( $url ) . ')" class="hero hero--image"';
    }
  }
  return 'class="hero"';
}
