<?php
/**
 * Sidebar template
 * @package DRADigital
 */
?>
<aside id="secondary" class="widget-area">
  <div class="container">
    <?php if ( is_active_sidebar( 'primary-sidebar' ) ) {
      dynamic_sidebar( 'primary-sidebar' );
    } ?>
  </div>
</aside>
