<?php
/**
 * La Mejor Alubia - Child Theme
 * 
 * Tema hijo de Astra para La Mejor Alubia
 * 
 * @package La_Mejor_Alubia
 * @author Emma
 * @version 1.0.0
 */

if ( ! defined( 'ABSPATH' ) ) exit;

// Cargar archivos modulares
$inc_files = array(
    'woocommerce',
);

foreach ( $inc_files as $file ) {
    $filepath = get_stylesheet_directory() . '/inc/' . $file . '.php';
    if ( file_exists( $filepath ) ) {
        require_once $filepath;
    }
}

// ENQUEUE PARENT ACTION
function la_mejor_alubia_enqueue_styles() {
    $parent_style = 'parent-style';
    
    wp_enqueue_style( 
        $parent_style, 
        get_template_directory_uri() . '/style.css' 
    );
    
    wp_enqueue_style( 
        'child-style',
        get_stylesheet_directory_uri() . '/style.css',
        array( $parent_style ),
        wp_get_theme()->get( 'Version' )
    );

    // Custom CSS
    wp_enqueue_style(
        'custom-style',
        get_stylesheet_directory_uri() . '/assets/css/custom.css',
        array( 'child-style' ),
        '1.0.0'
    );

    // Side Cart CSS
    wp_enqueue_style(
        'side-cart-style',
        get_stylesheet_directory_uri() . '/assets/css/side-cart.css',
        array( 'custom-style' ),
        '1.0.0'
    );

    // Side Cart JS
    wp_enqueue_script(
        'side-cart-script',
        get_stylesheet_directory_uri() . '/assets/js/side-cart.js',
        array( 'jquery' ),
        '1.0.0',
        true
    );
}
add_action( 'wp_enqueue_scripts', 'la_mejor_alubia_enqueue_styles' );
