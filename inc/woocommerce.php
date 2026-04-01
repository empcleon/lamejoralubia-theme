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
