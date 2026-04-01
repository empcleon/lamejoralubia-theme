<?php
/**
 * WooCommerce Tweaks
 * 
 * Customizaciones de WooCommerce para La Mejor Alubia
 */

// Limitar provincias disponibles (Canarias)
function ejr_limita_envios( $provincias ) {
    unset( $provincias['ES']['TF'] );
    unset( $provincias['ES']['GC'] );
    unset( $provincias['ES']['CE'] );
    unset( $provincias['ES']['ML'] );
    return $provincias;
}
add_filter( 'woocommerce_states', 'ejr_limita_envios' );

// Forzar actualizacion de fragmentos AJAX del carrito
add_filter( 'woocommerce_add_to_cart_fragments', function( $fragments ) {
    ob_start();
    ?>
    <span class="cart-count">
        <?php echo WC()->cart->get_cart_contents_count(); ?>
    </span>
    <?php
    $fragments['.floating-cart-icon .cart-count'] = ob_get_clean();
    
    ob_start();
    ?>
    <span class="ast-cart-menu-quantity">
        <?php echo WC()->cart->get_cart_contents_count(); ?>
    </span>
    <?php
    $fragments['.ast-cart-menu-quantity'] = ob_get_clean();
    
    return $fragments;
});
