/**
 * Side Cart - JavaScript (WooCommerce Native)
 * 
 * @package La_Mejor_Alubia
 */

jQuery(function($) {
    'use strict';

    // Abrir carrito al añadir producto
    $(document.body).on('added_to_cart', function(event, fragments, cart_hash, $button) {
        // Refresca fragments
        $(document.body).trigger('wc_fragment_refresh');
        
        // Abre carrito
        $('body').addClass('cart-open');
    });

    // Cerrar carrito al hacer click en X
    $('.close-cart').on('click', function() {
        $('body').removeClass('cart-open');
    });

    // Cerrar carrito al hacer click en overlay
    $('.cart-overlay').on('click', function() {
        $('body').removeClass('cart-open');
    });

    // Cerrar con ESC
    $(document).keyup(function(e) {
        if (e.keyCode === 27) {
            $('body').removeClass('cart-open');
        }
    });

    // Abrir carrito al hacer click en icono flotante (si existe)
    $(document).on('click', '.floating-cart-icon, .ast-icon-shopping-cart', function(e) {
        e.preventDefault();
        $('body').addClass('cart-open');
    });
});
