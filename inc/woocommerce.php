<?php
/**
 * WooCommerce Tweaks
 * 
 * Customizaciones de WooCommerce para La Mejor Alubia
 * 
 * @package La_Mejor_Alubia
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

// WooCommerce fragments - NATIVO
add_filter( 'woocommerce_add_to_cart_fragments', function( $fragments ) {
    ob_start();
    woocommerce_mini_cart();
    $mini_cart = ob_get_clean();
    
    $fragments['.widget_shopping_cart_content'] = $mini_cart;
    $fragments['.floating-cart-icon .cart-count'] = '<span class="cart-count">' . WC()->cart->get_cart_contents_count() . '</span>';
    
    return $fragments;
});

// Incluir WooCommerce en el theme
function la_mejor_alubia_woocommerce_support() {
    add_theme_support( 'woocommerce' );
}
add_action( 'after_setup_theme', 'la_mejor_alubia_woocommerce_support' );

// Side Cart HTML en el footer
add_action( 'wp_footer', function() {
    if ( is_cart() || is_checkout() ) {
        return;
    }
    ?>
    <div class="cart-overlay" id="cart-overlay"></div>
    <div class="side-cart" id="side-cart">
        <div class="side-cart-inner">
            <div class="side-cart-header">
                <h3>Tu carrito</h3>
                <button class="close-cart" aria-label="Cerrar carrito">&times;</button>
            </div>
            <div class="side-cart-content widget_shopping_cart_content">
                <?php woocommerce_mini_cart(); ?>
            </div>
        </div>
    </div>
    <?php
});
