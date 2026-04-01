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
    
    // Desactivar carrito de Astra header
    remove_action( 'astra_header_cart', 'astra_header_cart_markup' );
    remove_action( 'astra_header_cart', 'astra_mini_cart_markup', 20 );
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
    <div class="floating-cart">
        <button class="cart-trigger" aria-label="Ver carrito">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12.9-1.63h7.45c.75 0 1.41-.41 1.75-1.03l3.58-6.49c.08-.14.12-.31.12-.48 0-.55-.45-1-1-1H5.21l-.94-2H1zm16 16c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z"/>
            </svg>
            <span class="cart-count"><?php echo WC()->cart->get_cart_contents_count(); ?></span>
        </button>
    </div>
    <?php
});
