/**
 * Side Cart - JavaScript del carrito lateral
 * 
 * Carrito lateral estilo Amazon/Zara
 * 
 * @package La_Mejor_Alubia
 */

jQuery(function($) {
    'use strict';

    var SideCart = {
        init: function() {
            this.createCartElements();
            this.bindEvents();
            this.refreshOnAjax();
        },

        createCartElements: function() {
            var cartHtml = `
                <div class="cart-panel-overlay" id="cart-overlay"></div>
                <div class="cart-panel" id="side-cart">
                    <div class="cart-panel-header">
                        <h3>Tu Carrito</h3>
                        <button class="cart-panel-close" aria-label="Cerrar carrito">&times;</button>
                    </div>
                    <div class="cart-panel-content" id="cart-panel-content">
                        ${this.getCartContent()}
                    </div>
                    <div class="cart-panel-footer" id="cart-panel-footer">
                        ${this.getCartFooter()}
                    </div>
                </div>
                <div class="floating-cart-icon" id="floating-cart">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                        <path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12.9-1.63h7.45c.75 0 1.41-.41 1.75-1.03l3.58-6.49c.08-.14.12-.31.12-.48 0-.55-.45-1-1-1H5.21l-.94-2H1zm16 16c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z"/>
                    </svg>
                    <span class="cart-count">0</span>
                </div>
            `;
            $('body').append(cartHtml);
        },

        getCartContent: function() {
            if (typeof wc_cart_fragments_params !== 'undefined') {
                return '<div class="loading">Cargando...</div>';
            }
            return '<div class="empty-cart"><p>Tu carrito está vacío</p><a href="' + wc_cart_fragments_params.ajax_url.replace('wc-ajax=get_refreshed_fragments', '') + '" class="button">Ver productos</a></div>';
        },

        getCartFooter: function() {
            return `
                <div class="cart-subtotal">
                    <span>Subtotal:</span>
                    <span class="amount">0,00 €</span>
                </div>
                <a href="cart/" class="wc-forward">Ver Carrito</a>
                <a href="checkout/" class="wc-forward" style="margin-top: 10px; background: #228B22;">Finalizar Compra</a>
            `;
        },

        bindEvents: function() {
            var self = this;

            // Open cart
            $('#floating-cart').on('click', function(e) {
                e.preventDefault();
                self.openCart();
            });

            // Close cart
            $('.cart-panel-close, #cart-overlay').on('click', function(e) {
                e.preventDefault();
                self.closeCart();
            });

            // Close on escape
            $(document).keyup(function(e) {
                if (e.keyCode === 27) {
                    self.closeCart();
                }
            });

            // Add to cart triggers
            $('body').on('click', '.add_to_cart_button', function() {
                setTimeout(function() {
                    self.openCart();
                }, 500);
            });
        },

        openCart: function() {
            $('#side-cart, #cart-overlay').addClass('open');
            $('body').addClass('cart-panel-open');
        },

        closeCart: function() {
            $('#side-cart, #cart-overlay').removeClass('open');
            $('body').removeClass('cart-panel-open');
        },

        refreshOnAjax: function() {
            var self = this;

            $(document.body).on('added_to_cart', function(event, fragments, cart_hash, $button) {
                self.openCart();
                self.updateCartCount();
            });

            $(document).on('wc_fragment_refreshed', function() {
                self.updateCartContent();
            });
        },

        updateCartContent: function() {
            var $panelContent = $('#cart-panel-content');
            var $mainContent = $('.widget_shopping_cart_content');

            if ($mainContent.length) {
                $panelContent.html($mainContent.html());
            }
        },

        updateCartCount: function() {
            var $count = $('.floating-cart-icon .cart-count');
            var $miniCart = $('.widget_shopping_cart_content .count');

            if ($miniCart.length) {
                var countText = $miniCart.text();
                $count.text(countText);
            }
        }
    };

    // Initialize
    $(document).ready(function() {
        SideCart.init();
    });
});
