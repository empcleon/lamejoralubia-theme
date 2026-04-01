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

// AJAX endpoint para obtener cantidad del carrito
add_action( 'wp_ajax_get_cart_count', 'get_cart_count_ajax' );
add_action( 'wp_ajax_nopriv_get_cart_count', 'get_cart_count_ajax' );

function get_cart_count_ajax() {
    $count = WC()->cart->get_cart_contents_count();
    wp_send_json( array( 'count' => $count ) );
}

// AJAX endpoint para obtener contenido del carrito
add_action( 'wp_ajax_get_cart_content_html', 'get_cart_content_html_ajax' );
add_action( 'wp_ajax_nopriv_get_cart_content_html', 'get_cart_content_html_ajax' );

function get_cart_content_html_ajax() {
    if ( WC()->cart->is_empty() ) {
        wp_send_json( array( 
            'success' => true, 
            'data' => array( 
                'is_empty' => true,
                'html' => ''
            ) 
        ) );
    }
    
    ob_start();
    woocommerce_mini_cart();
    $mini_cart = ob_get_clean();
    
    wp_send_json( array( 
        'success' => true, 
        'data' => array( 
            'is_empty' => false,
            'html' => $mini_cart
        ) 
    ) );
}

// AJAX endpoint para obtener subtotal del carrito
add_action( 'wp_ajax_get_cart_subtotal', 'get_cart_subtotal_ajax' );
add_action( 'wp_ajax_nopriv_get_cart_subtotal', 'get_cart_subtotal_ajax' );

function get_cart_subtotal_ajax() {
    $subtotal = WC()->cart->get_cart_subtotal();
    wp_send_json( array( 
        'success' => true, 
        'data' => array( 'subtotal' => $subtotal ) 
    ) );
}

// Incluir WooCommerce en el theme
function la_mejor_alubia_woocommerce_support() {
    add_theme_support( 'woocommerce' );
}
add_action( 'after_setup_theme', 'la_mejor_alubia_woocommerce_support' );
