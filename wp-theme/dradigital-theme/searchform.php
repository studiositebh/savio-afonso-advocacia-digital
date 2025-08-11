<?php
/**
 * Search form template
 * @package DRADigital
 */
?>
<form role="search" method="get" class="search-form" action="<?php echo esc_url( home_url( '/' ) ); ?>">
  <label>
    <span class="screen-reader-text"><?php echo _x( 'Search for:', 'label', 'dradigital' ); ?></span>
    <input type="search" class="search-field" placeholder="<?php echo esc_attr_x( 'Search …', 'placeholder', 'dradigital' ); ?>" value="<?php echo get_search_query(); ?>" name="s" />
  </label>
  <button type="submit" class="search-submit"><?php echo esc_html_x( 'Search', 'submit button', 'dradigital' ); ?></button>
</form>
