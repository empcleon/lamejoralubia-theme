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
            this.updateInitialCount();
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
            var self = this;
            var content = '';
            
            $.ajax({
                url: '/wp-admin/admin-ajax.php',
                type: 'POST',
                data: {
                    action: 'get_cart_content_html'
                },
                async: false,
                success: function(response) {
                    if (response && response.success && response.data) {
                        if (response.data.is_empty) {
                            content = '<div class="empty-cart"><p>Tu carrito está vacío</p><a href="' + window.location.origin + '/shop/" class="button">Ver productos</a></div>';
                        } else {
                            content = response.data.html;
                        }
                    }
                }
            });
            
            if (!content) {
                var $miniCart = $('.widget_shopping_cart_content');
                if ($miniCart.length && $miniCart.find('.woocommerce-mini-cart__empty-message').length === 0) {
                    content = $miniCart.html();
                } else {
                    content = '<div class="empty-cart"><p>Tu carrito está vacío</p><a href="' + window.location.origin + '/tienda/" class="button">Ver productos</a></div>';
                }
            }
            
            return content;
        },

        getCartFooter: function() {
            var self = this;
            var subtotal = '0,00 €';
            var cartUrl = window.location.origin + '/cart/';
            var checkoutUrl = window.location.origin + '/checkout/';
            
            $.ajax({
                url: '/wp-admin/admin-ajax.php',
                type: 'POST',
                data: {
                    action: 'get_cart_subtotal'
                },
                async: false,
                success: function(response) {
                    if (response && response.success && response.data && response.data.subtotal) {
                        subtotal = response.data.subtotal;
                    }
                }
            });

            return `
                <div class="cart-subtotal">
                    <span>Subtotal:</span>
                    <span class="amount">${subtotal}</span>
                </div>
                <a href="${cartUrl}" class="wc-forward">Ver Carrito</a>
                <a href="${checkoutUrl}" class="wc-forward" style="margin-top: 10px; background: #228B22;">Finalizar Compra</a>
            `;
        },

        bindEvents: function() {
            var self = this;

            $('#floating-cart').on('click', function(e) {
                e.preventDefault();
                self.openCart();
            });

            $('.cart-panel-close, #cart-overlay').on('click', function(e) {
                e.preventDefault();
                self.closeCart();
            });

            $(document).keyup(function(e) {
                if (e.keyCode === 27) {
                    self.closeCart();
                }
            });

            $('body').on('click', '.add_to_cart_button', function(e) {
                if (!$(this).hasClass('ajax_add_to_cart')) return;
                setTimeout(function() {
                    self.openCart();
                    self.refreshCartData();
                }, 800);
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
                setTimeout(function() {
                    self.refreshCartData();
                }, 500);
            });

            $(document).on('wc_fragment_refreshed wc_cart_updated', function() {
                self.refreshCartData();
            });
        },

        refreshCartData: function() {
            var self = this;
            
            $.ajax({
                url: woocommerce_params.ajax_url,
                type: 'POST',
                data: {
                    action: 'woocommerce_get_refreshed_fragments'
                },
                success: function(response) {
                    if (response && response.fragments) {
                        self.updateCartCount(response.fragments);
                        self.updateCartContent(response.fragments);
                    }
                },
                error: function() {
                    self.updateCartCountFromDOM();
                }
            });
        },

        updateCartCount: function(fragments) {
            var $count = $('.floating-cart-icon .cart-count');
            
            if (fragments && fragments['.ast-cart-menu-quantity']) {
                $count.text(fragments['.ast-cart-menu-quantity'].text());
            } else if (fragments && fragments['.cart-count']) {
                $count.text(fragments['.cart-count'].text());
            } else {
                this.updateCartCountFromDOM();
            }
        },

        updateCartCountFromDOM: function() {
            var $count = $('.floating-cart-icon .cart-count');
            var $miniCart = $('.widget_shopping_cart_content');
            
            if ($miniCart.length) {
                var $quantity = $miniCart.find('.quantity');
                if ($quantity.length) {
                    var text = $quantity.first().text();
                    var match = text.match(/(\d+)/);
                    if (match) {
                        $count.text(match[1]);
                        return;
                    }
                }
                var $countEl = $miniCart.find('.count');
                if ($countEl.length) {
                    $count.text($countEl.text());
                }
            }
        },

        updateCartContent: function(fragments) {
            var $panelContent = $('#cart-panel-content');
            var $panelFooter = $('#cart-panel-footer');
            
            if (fragments && fragments['.widget_shopping_cart_content']) {
                var $temp = $('<div>').html(fragments['.widget_shopping_cart_content']);
                if ($temp.find('.woocommerce-mini-cart__empty-message').length === 0) {
                    $panelContent.html($temp.html());
                }
            }
            
            this.updateCartCountFromDOM();
        },

        updateInitialCount: function() {
            var self = this;
            
            $.ajax({
                url: '/wp-admin/admin-ajax.php',
                type: 'POST',
                data: {
                    action: 'get_cart_count'
                },
                success: function(response) {
                    if (response && response.count !== undefined) {
                        $('.floating-cart-icon .cart-count').text(response.count);
                    } else {
                        self.updateCartCountFromDOM();
                    }
                },
                error: function() {
                    self.updateCartCountFromDOM();
                }
            });
        }
    };

    $(document).ready(function() {
        SideCart.init();
    });
});
