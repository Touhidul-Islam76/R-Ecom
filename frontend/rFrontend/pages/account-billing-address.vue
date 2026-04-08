<script setup lang="ts">
import { ref, onBeforeUnmount, onMounted, nextTick } from 'vue'

definePageMeta({
  layout: false,
})

useHead({
  title: 'FasionAble',
  meta: [
    { charset: 'utf-8' },
    { 'http-equiv': 'X-UA-Compatible', content: 'IE=edge' },
    { name: 'author', content: 'DexignZone' },
    { name: 'robots', content: 'index, follow' },
    { name: 'format-detection', content: 'telephone=no' },
    {
      name: 'keywords',
      content:
        'fashion store, dresses, streetwear, ecommerce, clothing, apparel, style, online shopping, modern fashion, boutique, trendy outfits, UI, UX, stylish, responsive design',
    },
    {
      name: 'description',
      content:
        'Elevate your online retail presence with FasionAble HTML Template. Meticulously crafted, this responsive and feature-rich template offers a seamless and visually stunning shopping experience for fashion enthusiasts.',
    },
    { property: 'og:title', content: 'FasionAble' },
    {
      property: 'og:description',
      content:
        'Elevate your online retail presence with FasionAble HTML Template. Meticulously crafted, this responsive and feature-rich template offers a seamless and visually stunning shopping experience for fashion enthusiasts.',
    },
    { property: 'og:image', content: 'https://fasionable.dexignzone.com/xhtml/social-image.png' },
    { name: 'twitter:title', content: 'FasionAble: Fashion & eCommerce Template | DexignZone' },
    {
      name: 'twitter:description',
      content:
        'Elevate your online retail presence with FasionAble HTML Template. Meticulously crafted, this responsive and feature-rich template offers a seamless and visually stunning shopping experience for fashion enthusiasts.',
    },
    { name: 'twitter:image', content: 'https://fasionable.dexignzone.com/xhtml/social-image.png' },
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'viewport', content: 'width=device-width, initial-scale=1' },
  ],
  link: [
    { rel: 'canonical', href: 'https://fasionable.dexignzone.com/xhtml/account-billing-address.html' },
    { rel: 'icon', type: 'image/x-icon', href: '/images/20.jpg.jpeg' },
    { rel: 'stylesheet', href: '/vendor/bootstrap-select/dist/css/bootstrap-select.min.css' },
    { rel: 'stylesheet', href: '/vendor/swiper/swiper-bundle.min.css' },
    { rel: 'stylesheet', href: '/vendor/nouislider/nouislider.min.css' },
    { rel: 'stylesheet', href: '/vendor/animate/animate.css' },
    { rel: 'stylesheet', type: 'text/css', href: '/css/style.css', class: 'main-css' },
    { rel: 'stylesheet', type: 'text/css', href: '/css/skin/skin-1.css', class: 'skin' },
    { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
    { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
    { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Marcellus&display=swap' },
  ],
  script: [
    { src: '/js/jquery.min.js' },
    { src: '/vendor/wow/wow.min.js' },
    { src: '/vendor/bootstrap/dist/js/bootstrap.bundle.min.js' },
    { src: '/vendor/bootstrap-select/dist/js/bootstrap-select.min.js' },
    { src: '/vendor/bootstrap-touchspin/bootstrap-touchspin.js' },
    { src: '/vendor/counter/waypoints-min.js' },
    { src: '/vendor/swiper/swiper-bundle.min.js' },
    { src: '/vendor/countdown/jquery.countdown.js' },
    { src: '/vendor/wnumb/wNumb.js' },
    { src: '/vendor/nouislider/nouislider.min.js' },
    { src: '/js/dz.carousel.js' },
    { src: '/js/dz.ajax.js' },
    { src: '/js/custom.js' },
  ],
})

const showLoader = ref(true)
let showTimer: ReturnType<typeof setTimeout> | null = null
let activeTimer: ReturnType<typeof setTimeout> | null = null
let hideTimer: ReturnType<typeof setTimeout> | null = null


onMounted(() => {
  const loader = document.getElementById('loading-area')
  if (loader) {
    showTimer = setTimeout(() => {
      loader.classList.add('show')
    }, 500)

    activeTimer = setTimeout(() => {
      loader.classList.add('active')
    }, 1500)

    hideTimer = setTimeout(() => {
      showLoader.value = false
    }, 3500)
  }

  const plantZone = (window as Window & { PlantZone?: { init: () => void; load: () => void } }).PlantZone
  if (plantZone) {
    plantZone.init()
    plantZone.load()
  }

  nextTick(() => {
    const plantZoneCarousel = (window as Window & { PlantZoneCarousel?: { load: () => void } }).PlantZoneCarousel
    if (plantZoneCarousel) {
      plantZoneCarousel.load()
    }
  })
})

onBeforeUnmount(() => {
  if (showTimer) clearTimeout(showTimer)
  if (activeTimer) clearTimeout(activeTimer)
  if (hideTimer) clearTimeout(hideTimer)
})

const popularProducts = [
  { image: '/images/shop/product/1.png', title: 'Premium Maxi Dress (m)', price: '$79', oldPrice: '$99' },
  { image: '/images/shop/product/2.png', title: 'Elegant Evening Dress (m)', price: '$79', oldPrice: '$199' },
  { image: '/images/shop/product/3.png', title: 'Slim Fit Trouser (m)', price: '$109', oldPrice: '$149' },
  { image: '/images/shop/product/4.png', title: 'Pleated Skirt (m)', price: '$299', oldPrice: '$499' },
  { image: '/images/shop/product/5.png', title: 'Chic Mini Dress (m)', price: '$199', oldPrice: '$299' },
  { image: '/images/shop/product/6.png', title: 'Premium Maxi Dress (m)', price: '$79', oldPrice: '$99' },
  { image: '/images/shop/product/7.png', title: 'Oversized Street Jacket (M)', price: '$99', oldPrice: '$110' },
  { image: '/images/shop/product/8.png', title: 'Premium Maxi Dress (m)', price: '$79', oldPrice: '$99' },
]

const sidebarCartItems = [
  { image: '/images/shop/shop-cart/pic1.jpg', title: 'Premium Maxi Dress (m)', qty: 1, price: '$59', oldPrice: '$99' },
  { image: '/images/shop/shop-cart/pic2.jpg', title: 'Elegant Evening Dress (m)', qty: 1, price: '$79', oldPrice: '$99' },
  { image: '/images/shop/shop-cart/pic3.jpg', title: 'Pleated Skirt (m)', qty: 1, price: '$49', oldPrice: '$99' },
  { image: '/images/shop/shop-cart/pic3.jpg', title: 'Slim Fit Trouser (m)', qty: 1, price: '$99', oldPrice: '$199' },
]

const wishlistItems = [
  { image: '/images/shop/shop-cart/pic1.jpg', title: 'Premium Maxi Dress (m)', price: '$59' },
  { image: '/images/shop/shop-cart/pic2.jpg', title: 'Elegant Evening Dress (m)', price: '$79' },
  { image: '/images/shop/shop-cart/pic3.jpg', title: 'Pleated Skirt (m)', price: '$49' },
]

const footerSocialPosts = [1, 2, 3, 4, 5, 6]
</script>

<template>
  <div class="page-wraper">
      <div v-if="showLoader" id="loading-area" class="loading-page-1">
        <div class="text"><span class="text-primary">Fashion</span>Able</div>
      </div>

      <!-- Header Start -->
      <header class="site-header mo-left header">
        <div class="sticky-header main-bar-wraper navbar-expand-lg">
          <div class="main-bar clearfix">
            <div class="container-fluid clearfix d-lg-flex d-block">

              <!-- Logo -->
              <div class="logo-header logo-dark me-md-4 me-2">
                <a href="/"><img src="/images/20.jpg.jpeg" alt="logo" /></a>
              </div>

              <!-- Nav Toggle -->
              <button class="navbar-toggler collapsed navicon justify-content-end" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavDropdown" aria-controls="navbarNavDropdown" aria-expanded="false" aria-label="Toggle navigation">
                <span></span>
                <span></span>
                <span></span>
              </button>

              <!-- Main Nav -->
              <div class="header-nav w3menu navbar-collapse collapse justify-content-start" id="navbarNavDropdown">
                <div class="logo-header logo-dark">
                  <a href="/"><img src="/images/20.jpg.jpeg" alt="" /></a>
                </div>

                <ul class="nav navbar-nav">
                  <li class="has-mega-menu sub-menu-down auto-width menu-left">
                    <a href="/"><span>Home</span><i class="fas fa-chevron-down tabindex"></i></a>
                  </li>

                  <li class="has-mega-menu sub-menu-down">
                    <a href="javascript:void(0);"><span>Shop</span><i class="fas fa-chevron-down tabindex"></i></a>
                    <div class="mega-menu shop-menu">
                      <ul>
                        <li class="side-left">
                          <ul>
                            <li>
                              <span class="menu-title">Shop Structure</span>
                              <ul>
                                <li><a href="/shop-standard">Shop Standard</a></li>
                                <li><a href="/shop-list">Shop List</a></li>
                                <li><a href="/shop-with-category">Shop With Category</a></li>
                                <li><a href="/shop-filters-top-bar">Shop Filters Top Bar</a></li>
                                <li><a href="/shop-sidebar">Shop Sidebar</a></li>
                                <li><a href="/shop-style-1">Shop Style 1</a></li>
                                <li><a href="/shop-style-2">Shop Style 2</a></li>
                              </ul>
                            </li>
                            <li>
                              <span class="menu-title">Product Structure</span>
                              <ul>
                                <li><a href="/product-default">Default</a></li>
                                <li><a href="/product-thumbnail">Thumbnail</a></li>
                                <li><a href="/product-grid-media">Grid Media</a></li>
                                <li><a href="/product-carousel">Carousel</a></li>
                                <li><a href="/product-full-width">Full Width</a></li>
                              </ul>
                            </li>
                            <li>
                              <span class="menu-title">Shop Pages</span>
                              <ul>
                                <li><a href="/shop-wishlist">Wishlist</a></li>
                                <li><a href="/shop-cart">Cart</a></li>
                                <li><a href="/shop-checkout">Checkout</a></li>
                                <li><a href="/shop-compare">Compare</a></li>
                                <li><a href="/shop-order-tracking">Order Tracking</a></li>
                                <li><a href="/login">Login</a></li>
                                <li><a href="/registration">Registration</a></li>
                                <li>
                                  <a href="/forget-password">
                                    Forget Password
                                    <div class="badge badge-sm rounded badge-animated">New</div>
                                  </a>
                                </li>
                              </ul>
                            </li>
                            <li class="month-deal">
                              <div class="clearfix me-3">
                                <h3>Deal of the month</h3>
                                <p class="mb-0">
                                  Yes! Send me exclusive offers, personalised, and unique gift ideas, tips for shopping on FasionAble
                                  <a href="/shop-standard" class="dz-link-2">View All Products</a>
                                </p>
                              </div>
                              <div class="sale-countdown">
                                <div class="countdown text-center">
                                  <div class="date">
                                    <span class="time days text-primary"></span>
                                    <span class="work-time">Days</span>
                                  </div>
                                  <div class="date">
                                    <span class="time hours text-primary"></span>
                                    <span class="work-time">Hours</span>
                                  </div>
                                  <div class="date">
                                    <span class="time mins text-primary"></span>
                                    <span class="work-time">Minutess</span>
                                  </div>
                                  <div class="date">
                                    <span class="time secs text-primary"></span>
                                    <span class="work-time">Second</span>
                                  </div>
                                </div>
                              </div>
                            </li>
                          </ul>
                        </li>
                        <li class="side-right">
                          <div class="adv-media">
                            <img src="/images/adv-1.png" alt="/" />
                          </div>
                        </li>
                      </ul>
                    </div>
                  </li>

                  <li class="has-mega-menu sub-menu-down auto-width">
                    <a href="javascript:void(0);"><span>Blog</span><i class="fas fa-chevron-down tabindex"></i></a>
                    <div class="mega-menu">
                      <ul>
                        <li>
                          <span class="menu-title">Blog Dark Style</span>
                          <ul>
                            <li><a href="/blog-dark-2-column">Blog 2 Column</a></li>
                            <li><a href="/blog-dark-2-column-sidebar">Blog 2 Column Sidebar</a></li>
                            <li><a href="/blog-3-column">Blog 3 Column</a></li>
                            <li><a href="/blog-dark-half-image">Blog Half Image</a></li>
                          </ul>
                          <span class="menu-title">Blog Light Style</span>
                          <ul>
                            <li><a href="/blog-light-2-column">Blog 2 Column</a></li>
                            <li><a href="/blog-light-2-column-sidebar">Blog 2 Column Sidebar</a></li>
                            <li><a href="/blog-light-half-image">Blog Half Image</a></li>
                            <li><a href="/blog-exclusive">Blog Exclusive</a></li>
                          </ul>
                        </li>
                        <li>
                          <span class="menu-title">Blog List Sidebar</span>
                          <ul>
                            <li><a href="/blog-list-no-sidebar">No Sidebar <div class="badge badge-sm rounded">New</div></a></li>
                            <li><a href="/blog-list-left-sidebar">left Sidebar <div class="badge badge-sm rounded">New</div></a></li>
                            <li><a href="/blog-list-right-sidebar">Right Sidebar <div class="badge badge-sm rounded">New</div></a></li>
                            <li><a href="/blog-list-both-sidebar">Both Sidebar <div class="badge badge-sm rounded">New</div></a></li>
                          </ul>
                          <span class="menu-title">Blog Grid Sidebar</span>
                          <ul>
                            <li><a href="/blog-grid-no-sidebar">No Sidebar <div class="badge badge-sm rounded">New</div></a></li>
                            <li><a href="/blog-grid-left-sidebar">left Sidebar <div class="badge badge-sm rounded">New</div></a></li>
                            <li><a href="/blog-grid-right-sidebar">Right Sidebar <div class="badge badge-sm rounded">New</div></a></li>
                            <li><a href="/blog-grid-both-sidebar">Both Sidebar <div class="badge badge-sm rounded">New</div></a></li>
                            <li><a href="/blog-grid-wide-sidebar">Wide Sidebar <div class="badge badge-sm rounded">New</div></a></li>
                          </ul>
                        </li>
                        <li>
                          <span class="menu-title">Blog Sidebar</span>
                          <ul>
                            <li><a href="/blog-left-sidebar">Blog left Sidebar</a></li>
                            <li><a href="/blog-right-sidebar">Blog Right Sidebar</a></li>
                            <li><a href="/blog-both-sidebar">Blog Both Sidebar</a></li>
                            <li><a href="/blog-wide-sidebar">Blog Wide Sidebar</a></li>
                          </ul>
                          <span class="menu-title">Blog Page</span>
                          <ul>
                            <li><a href="/blog-archive">Blog Archive</a></li>
                            <li><a href="/blog-author">Author</a></li>
                            <li><a href="/blog-category">Blog Category</a></li>
                            <li><a href="/blog-tag">Blog Tag</a></li>
                          </ul>
                        </li>
                        <li class="post-menu">
                          <span class="menu-title">Recent Posts</span>
                          <div class="widget widget_post pt-2">
                            <ul>
                              <li>
                                <div class="dz-media"><img src="/images/shop/product/small/1.png" alt="" /></div>
                                <div class="dz-content">
                                  <h6 class="name"><a href="/post-standard">A Journey Through Fashion</a></h6>
                                  <span class="time">Jun 23, 2024</span>
                                </div>
                              </li>
                              <li>
                                <div class="dz-media"><img src="/images/shop/product/small/2.png" alt="" /></div>
                                <div class="dz-content">
                                  <h6 class="name"><a href="/post-standard">Into Fashion Styling Trends</a></h6>
                                  <span class="time">Feb 16, 2024</span>
                                </div>
                              </li>
                              <li>
                                <div class="dz-media"><img src="/images/shop/product/small/3.png" alt="" /></div>
                                <div class="dz-content">
                                  <h6 class="name"><a href="/post-standard">The Wonders of Style</a></h6>
                                  <span class="time">Mar 15, 2024</span>
                                </div>
                              </li>
                            </ul>
                          </div>
                        </li>
                      </ul>
                    </div>
                  </li>

                  <li class="has-mega-menu sub-menu-down">
                    <a href="javascript:void(0);"><span>Post Layout</span><i class="fas fa-chevron-down tabindex"></i></a>
                    <div class="mega-menu">
                      <div class="row justify-content-md-between">
                        <div class="col-md-4 col-sm-4 col-6">
                          <a href="javascript:void(0);" class="menu-title">Post Types</a>
                          <ul>
                            <li><a href="/post-text">Text Post <div class="badge badge-sm rounded">New</div></a></li>
                            <li><a href="/post-image">Image Post <div class="badge badge-sm rounded">New</div></a></li>
                            <li><a href="/post-video">Video Post</a></li>
                            <li><a href="/post-link">Link Post</a></li>
                            <li><a href="/post-audio">Audio Post</a></li>
                            <li><a href="/post-quote">Post Quote</a></li>
                            <li><a href="/post-tutorial">Tutorial Post <div class="badge badge-sm rounded">New</div></a></li>
                            <li><a href="/post-cateloge">Cateloge Post <div class="badge badge-sm rounded">New</div></a></li>
                          </ul>
                        </div>
                        <div class="col-md-4 col-sm-4 col-6">
                          <a href="javascript:void(0);" class="menu-title">Multiple Media</a>
                          <ul>
                            <li><a href="/post-banner">Banner</a></li>
                            <li><a href="/post-slide-show">Slider</a></li>
                            <li><a href="/post-gallery">Gallery</a></li>
                            <li><a href="/post-status">Status Slider <div class="badge badge-sm rounded">New</div></a></li>
                          </ul>
                          <a href="javascript:void(0);" class="menu-title">Post Layout Type</a>
                          <ul>
                            <li><a href="/post-standard">Standard Post</a></li>
                            <li><a href="/post-corner">Corner Post</a></li>
                            <li><a href="/post-side">Side Post <div class="badge badge-sm rounded">New</div></a></li>
                          </ul>
                        </div>
                        <div class="col-md-4 col-sm-4 col-6">
                          <a href="javascript:void(0);" class="menu-title">Side Bar</a>
                          <ul>
                            <li><a href="/post-left-sidebar">Left Sidebar</a></li>
                            <li><a href="/post-right-sidebar">Right Sidebar</a></li>
                            <li><a href="/post-both-sidebar">Both Sidebar</a></li>
                            <li><a href="/post-no-sidebar">No Sidebar</a></li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </li>

                  <li class="has-mega-menu sub-menu-down">
                    <a href="javascript:void(0);"><span>Portfolio</span><i class="fas fa-chevron-down tabindex"></i></a>
                    <div class="mega-menu portfolio-menu">
                      <ul>
                        <li class="side-left">
                          <ul class="portfolio-nav-link">
                            <li><a href="/portfolio-tiles"><img src="/images/portfolio/icons/portfolio-tiles.svg" alt="/" /><span>Portfolio Tiles</span></a></li>
                            <li><a href="/collage-style-1"><img src="/images/portfolio/icons/collage-style-1.svg" alt="/" /><span>Collage Style 1</span></a></li>
                            <li><a href="/collage-style-2"><img src="/images/portfolio/icons/collage-style-2.svg" alt="/" /><span>Collage Style 2</span></a></li>
                            <li><a href="/masonry-grid"><img src="/images/portfolio/icons/masonry-grid.svg" alt="/" /><span>Masonry Grid</span></a></li>
                            <li><a href="/cobble-style-1"><img src="/images/portfolio/icons/cobble-style-1.svg" alt="/" /><span>Cobble Style 1</span></a></li>
                            <li><a href="/cobble-style-2"><img src="/images/portfolio/icons/cobble-style-2.svg" alt="/" /><span>Cobble Style 2</span></a></li>
                            <li><a href="/portfolio-thumbs-slider"><img src="/images/portfolio/icons/portfolio-thumbs-slider.svg" alt="/" /><span>Portfolio Thumbs Slider</span></a></li>
                            <li><a href="/portfolio-film-strip"><img src="/images/portfolio/icons/portfolio-film-strip.svg" alt="/" /><span>Portfolio Film Strip</span></a></li>
                            <li><a href="/carousel-showcase"><img src="/images/portfolio/icons/carousel-showcase.svg" alt="/" /><span>Carousel Showcase</span></a></li>
                            <li><a href="/portfolio-split-slider"><img src="/images/portfolio/icons/portfolio-split-slider.svg" alt="/" /><span>Portfolio Split Slider</span></a></li>
                          </ul>
                        </li>
                        <li class="side-right line-left">
                          <span class="menu-title">Portfolio Details</span>
                          <ul>
                            <li><a href="/portfolio-details-1">Portfolio Details 1</a></li>
                            <li><a href="/portfolio-details-2">Portfolio Details 2</a></li>
                            <li><a href="/portfolio-details-3">Portfolio Details 3</a></li>
                            <li><a href="/portfolio-details-4">Portfolio Details 4</a></li>
                            <li><a href="/portfolio-details-5">Portfolio Details 5</a></li>
                          </ul>
                        </li>
                      </ul>
                    </div>
                  </li>

                  <li class="has-mega-menu sub-menu-down wide-width">
                    <a href="javascript:void(0);"><span>Pages</span><i class="fas fa-chevron-down tabindex"></i></a>
                    <div class="mega-menu">
                      <ul>
                        <li>
                          <span class="menu-title">Pages</span>
                          <ul>
                            <li><a href="/about-us">About Us</a></li>
                            <li><a href="/about-me">About Me</a></li>
                            <li><a href="/pricing-table">Pricing Table</a></li>
                            <li><a href="/our-gift-vouchers">Our Gift Vouchers</a></li>
                            <li><a href="/what-we-do">What We Do</a></li>
                            <li><a href="/faqs-1">Faqs 1</a></li>
                            <li><a href="/faqs-2">Faqs 2</a></li>
                            <li><a href="/our-team">Our Team</a></li>
                          </ul>
                        </li>
                        <li>
                          <span class="menu-title">Contact Us</span>
                          <ul>
                            <li><a href="/contact-us-1">Contact Us 1</a></li>
                          </ul>
                          <span class="menu-title">Web Pages</span>
                          <ul>
                            <li><a href="/error-1">Error 404 1</a></li>
                            <li><a href="/error-2">Error 404 2</a></li>
                            <li><a href="/coming-soon">Coming Soon</a></li>
                            <li><a href="/under-construction">Under Construction</a></li>
                          </ul>
                        </li>
                        <li>
                          <span class="menu-title">Banner Style</span>
                          <ul>
                            <li><a href="/banner-with-bg-color">Banner with BG Color</a></li>
                            <li><a href="/banner-with-image">Banner with Image</a></li>
                            <li><a href="/banner-with-video">Banner with Video</a></li>
                            <li><a href="/banner-with-kanbern">Banner with Kanbern</a></li>
                            <li><a href="/banner-small">Banner Small</a></li>
                            <li><a href="/banner-medium">Banner Medium</a></li>
                            <li><a href="/banner-large">Banner Large</a></li>
                          </ul>
                        </li>
                        <li>
                          <span class="menu-title">Header Style</span>
                          <ul>
                            <li><a href="/header-style-1">Header Style 1</a></li>
                            <li><a href="/header-style-2">Header Style 2</a></li>
                            <li><a href="/header-style-3">Header Style 3</a></li>
                            <li><a href="/header-style-4">Header Style 4</a></li>
                            <li><a href="/header-style-5">Header Style 5</a></li>
                            <li><a href="/header-style-6">Header Style 6</a></li>
                            <li><a href="/header-style-7">Header Style 7</a></li>
                            <li class="w3menulink"><a href="/w3menu">Menu Styles</a></li>
                          </ul>
                        </li>
                        <li>
                          <span class="menu-title">Footer Style</span>
                          <ul>
                            <li><a href="/footer-style-1">Footer Style 1</a></li>
                            <li><a href="/footer-style-2">Footer Style 2</a></li>
                            <li><a href="/footer-style-3">Footer Style 3</a></li>
                            <li><a href="/footer-style-4">Footer Style 4</a></li>
                            <li><a href="/footer-style-5">Footer Style 5</a></li>
                            <li><a href="/footer-style-6">Footer Style 6</a></li>
                            <li><a href="/footer-style-7">Footer Style 7</a></li>
                          </ul>
                        </li>
                        <li>
                          <span class="menu-title">Dashboard</span>
                          <ul>
                            <li><a href="/account-dashboard">Dashboard</a></li>
                            <li><a href="/account-orders">Orders</a></li>
                            <li><a href="/account-order-details">Orders Details</a></li>
                            <li><a href="/account-order-confirmation">Orders Confirmation</a></li>
                            <li><a href="/account-downloads">Downloads</a></li>
                            <li><a href="/account-return-request">Return Request</a></li>
                            <li><a href="/account-return-request-detail">Return Request Detail</a></li>
                            <li><a href="/account-refund-requests-confirmed">Return Request Confirmed</a></li>
                          </ul>
                        </li>
                      </ul>
                    </div>
                  </li>

                  <li class="sub-menu-down">
                    <a href="javascript:void(0);"><span>My Account</span><i class="fas fa-chevron-down tabindex"></i></a>
                    <ul class="sub-menu">
                      <li><a href="/account-dashboard">Dashboard</a></li>
                      <li><a href="/account-orders">Orders</a></li>
                      <li><a href="/account-order-details">Orders Details</a></li>
                      <li><a href="/account-order-confirmation">Orders Confirmation</a></li>
                      <li><a href="/account-downloads">Downloads</a></li>
                      <li><a href="/account-return-request">Return Request</a></li>
                      <li><a href="/account-return-request-detail">Return Request Detail</a></li>
                      <li><a href="/account-refund-requests-confirmed">Return Request Confirmed</a></li>
                      <li><a href="/account-profile">Profile</a></li>
                      <li><a href="/account-address">Address</a></li>
                      <li><a href="/account-shipping-methods">Shipping methods</a></li>
                      <li><a href="/account-payment-methods">Payment Methods</a></li>
                      <li><a href="/account-review">Review</a></li>
                      <li><a href="/account-billing-address">Billing address</a></li>
                      <li><a href="/account-shipping-address">Shipping address</a></li>
                      <li><a href="/account-cancellation-requests">Cancellation Requests</a></li>
                    </ul>
                  </li>
                </ul>

                <div class="dz-social-icon">
                  <ul>
                    <li><a class="fab fa-facebook-f" target="_blank" href="https://www.facebook.com/dexignzone"></a></li>
                    <li><a class="fab fa-twitter" target="_blank" href="https://twitter.com/dexignzones"></a></li>
                    <li><a class="fab fa-linkedin-in" target="_blank" href="https://www.linkedin.com/showcase/3686700/admin/"></a></li>
                    <li><a class="fab fa-instagram" target="_blank" href="https://www.instagram.com/dexignzone/"></a></li>
                  </ul>
                </div>
              </div>

              <!-- Extra Nav -->
              <div class="extra-nav">
                <div class="extra-cell">
                  <ul class="header-right">
                    <li class="nav-item login-link">
                    <a class="nav-link" href="/login">Login / Register</a>
                    </li>
                    <li class="nav-item search-link">
                      <a class="nav-link" href="javascript:void(0);" data-bs-toggle="offcanvas" data-bs-target="#offcanvasTop" aria-controls="offcanvasTop">
                        <i class="iconly-Light-Search"></i>
                      </a>
                    </li>
                    <li class="nav-item wishlist-link">
                      <a class="nav-link" href="javascript:void(0);" data-bs-toggle="offcanvas" data-bs-target="#offcanvasRight" aria-controls="offcanvasRight">
                        <i class="iconly-Light-Heart2"></i>
                      </a>
                    </li>
                    <li class="nav-item cart-link">
                      <a href="javascript:void(0);" class="nav-link cart-btn" data-bs-toggle="offcanvas" data-bs-target="#offcanvasRight" aria-controls="offcanvasRight">
                        <i class="iconly-Broken-Buy"></i>
                        <span class="badge badge-circle">5</span>
                      </a>
                    </li>
                    <li class="nav-item filte-link">
                      <a href="javascript:void(0);" class="nav-link filte-btn" data-bs-toggle="offcanvas" data-bs-target="#offcanvasLeft" aria-controls="offcanvasLeft">
                        <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 30 13" fill="none">
                          <rect y="11" width="30" height="2" fill="black" />
                          <rect width="30" height="2" fill="black" />
                        </svg>
                      </a>
                    </li>
                  </ul>
                </div>
              </div>

            </div>
          </div>
        </div>

        <!-- Search Offcanvas -->
        <div class="dz-search-area dz-offcanvas offcanvas offcanvas-top" tabindex="-1" id="offcanvasTop">
          <button type="button" class="btn-close" data-bs-dismiss="offcanvas" aria-label="Close">&times;</button>
          <div class="container">
            <form class="header-item-search">
              <h2 class="dz-title">Search Our Site</h2>
              <div class="input-group search-input">
                <input type="search" class="form-control" placeholder="Search Here" />
                <button class="btn" type="button">
                  <i class="iconly-Light-Search"></i>
                </button>
              </div>
              <ul class="recent-tag">
                <li class="pe-0"><span>Quick Search :</span></li>
                <li><a href="/shop-list">Casual Wear</a></li>
                <li><a href="/shop-list">Daily Wear</a></li>
                <li><a href="/shop-list">Aqua Greens</a></li>
                <li><a href="/shop-list">Fashion Paradise</a></li>
              </ul>
            </form>
            <div class="row">
              <div class="col-xl-12">
                <h2 class="mb-3 dz-title">Popular Product</h2>
                <div class="swiper category-swiper2 swiper-visible">
                  <div class="swiper-wrapper">
                    <div
                      v-for="(item, index) in popularProducts"
                      :key="`pop-${index}`"
                      class="swiper-slide"
                    >
                      <div class="shop-card">
                        <div class="dz-media">
                          <img :src="item.image" alt="image" />
                        </div>
                        <div class="dz-content">
                          <h3 class="title"><a href="/shop-list">{{ item.title }}</a></h3>
                          <span class="price">{{ item.price }}<del>{{ item.oldPrice }}</del></span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Cart / Wishlist Offcanvas -->
        <div class="offcanvas dz-offcanvas offcanvas offcanvas-end" tabindex="-1" id="offcanvasRight">
          <button type="button" class="btn-close" data-bs-dismiss="offcanvas" aria-label="Close">&times;</button>
          <div class="offcanvas-body">
            <div class="product-description">
              <div class="dz-tabs">
                <ul class="nav nav-tabs center" id="myTab" role="tablist">
                  <li class="nav-item" role="presentation">
                    <button
                      class="nav-link active"
                      id="shopping-cart"
                      data-bs-toggle="tab"
                      data-bs-target="#shopping-cart-pane"
                      type="button"
                      role="tab"
                      aria-controls="shopping-cart-pane"
                      aria-selected="true"
                    >
                      Shopping Cart <span class="badge badge-light">5</span>
                    </button>
                  </li>
                  <li class="nav-item" role="presentation">
                    <button
                      class="nav-link"
                      id="wishlist"
                      data-bs-toggle="tab"
                      data-bs-target="#wishlist-pane"
                      type="button"
                      role="tab"
                      aria-controls="wishlist-pane"
                      aria-selected="false"
                    >
                      Wishlist <span class="badge badge-light">2</span>
                    </button>
                  </li>
                </ul>

                <div class="tab-content pt-4" id="dz-shopcart-sidebar">
                  <!-- Shopping Cart Tab -->
                  <div class="tab-pane fade show active" id="shopping-cart-pane" role="tabpanel" aria-labelledby="shopping-cart" tabindex="0">
                    <div class="shop-sidebar-cart">
                      <ul class="sidebar-cart-list">
                        <li v-for="(item, index) in sidebarCartItems" :key="`cart-${index}`">
                          <div class="cart-widget">
                            <div class="dz-media me-3">
                              <img :src="item.image" alt="" />
                            </div>
                            <div class="cart-content">
                              <h6 class="title"><a href="/product-thumbnail">{{ item.title }}</a></h6>
                              <div class="d-flex align-items-center">
                                <div class="btn-quantity light quantity-sm me-3 ms-0 style-1">
                                  <input type="text" :value="item.qty" name="demo_vertical2" />
                                </div>
                                <h6 class="dz-price mb-0">{{ item.price }} <del>{{ item.oldPrice }}</del></h6>
                              </div>
                            </div>
                            <a href="javascript:void(0);" class="dz-close">
                              <i class="ti-close"></i>
                            </a>
                          </div>
                        </li>
                      </ul>
                      <div class="cart-total">
                        <h5 class="mb-0">Subtotal:</h5>
                        <h5 class="mb-0">300.00$</h5>
                      </div>
                      <div class="mt-auto">
                        <div class="shipping-time">
                          <div class="dz-icon">
                            <i class="flaticon flaticon-ship"></i>
                          </div>
                          <div class="shipping-content">
                            <h6 class="title pe-4">Congratulations , you've got free shipping!</h6>
                            <div class="progress">
                              <div class="progress-bar progress-animated border-0" style="width: 75%;" role="progressbar">
                                <span class="sr-only">75% Complete</span>
                              </div>
                            </div>
                          </div>
                        </div>
                        <a href="/shop-checkout" class="btn btn-outline-secondary btn-block m-b20">Checkout</a>
                    <a href="/shop-cart" class="btn btn-secondary btn-block">View Cart</a>
                      </div>
                    </div>
                  </div>

                  <!-- Wishlist Tab -->
                  <div class="tab-pane fade" id="wishlist-pane" role="tabpanel" aria-labelledby="wishlist" tabindex="0">
                    <div class="shop-sidebar-cart">
                      <ul class="sidebar-cart-list">
                        <li v-for="(item, index) in wishlistItems" :key="`wish-${index}`">
                          <div class="cart-widget">
                            <div class="dz-media me-3">
                              <img :src="item.image" alt="" />
                            </div>
                            <div class="cart-content">
                              <h6 class="title"><a href="/product-thumbnail">{{ item.title }}</a></h6>
                              <div class="d-flex align-items-center">
                                <h6 class="dz-price mb-0">{{ item.price }}</h6>
                              </div>
                            </div>
                            <a href="javascript:void(0);" class="dz-close">
                              <i class="ti-close"></i>
                            </a>
                          </div>
                        </li>
                      </ul>
                      <div class="mt-auto">
                        <a href="/shop-wishlist" class="btn btn-secondary btn-block">Check Your Favourite</a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Filter Offcanvas -->
        <div class="offcanvas dz-offcanvas offcanvas offcanvas-end" tabindex="-1" id="offcanvasLeft">
          <button type="button" class="btn-close" data-bs-dismiss="offcanvas" aria-label="Close">&times;</button>
          <div class="offcanvas-body">
            <div class="contact-sidebar">
              <div class="contact-box1 deznav-scroll">
                <div class="logo-contact logo-header m-0">
                  <a href="/" class="logo-white"><img src="/images/logo.svg" alt="/" /></a>
                </div>
                <p class="text">
                  Transform your website into a dynamic online storefront with FasionAble, where style seamlessly meets
                  functionality, ensuring a captivating and user-friendly eCommerce journey through the lush world of fashion.
                </p>
                <h4 class="dz-title">Contact Us</h4>
                <ul class="contact-address">
                  <li>785 15h Street, Office 478 Berlin, De 81566</li>
                  <li>Demo@gmail.com</li>
                  <li>+1012 3456 789</li>
                </ul>
                <h4 class="dz-title">Newsletter</h4>
                <form class="dzSubscribe dz-subscribe-wrapper1" action="script/mailchamp.php" method="post">
                  <div class="dzSubscribeMsg"></div>
                  <div class="form-group">
                    <div class="input-group mb-0">
                      <input name="dzEmail" required type="email" class="form-control" placeholder="Your Email Address" />
                      <div class="input-group-addon">
                        <button name="submit" value="Submit" type="submit" class="btn">
                          <i class="icon feather icon-arrow-right"></i>
                        </button>
                      </div>
                    </div>
                    <div class="custom-control custom-checkbox d-flex m-b40">
                      <input type="checkbox" class="form-check-input" id="basic_checkbox_1" />
                      <label class="form-check-label" for="basic_checkbox_1">
                        I Agree To The <span><a href="/privacy-policy">Privacy Policy</a></span>
                      </label>
                    </div>
                  </div>
                </form>
                <h4 class="dz-title">Follow Us</h4>
                <div class="dz-social-icon dz-hover-move style-2 mb-5">
                  <ul>
                    <li><a href="https://www.facebook.com/dexignzone" target="_blank"><i class="fa-brands fa-facebook-f"></i></a></li>
                    <li><a href="https://twitter.com/dexignzones" target="_blank"><i class="fa-brands fa-twitter"></i></a></li>
                    <li><a href="https://www.linkedin.com/showcase/3686700/admin/" target="_blank"><i class="fa-brands fa-linkedin"></i></a></li>
                    <li><a href="https://www.instagram.com/dexignzone/" target="_blank"><i class="fa-brands fa-instagram"></i></a></li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>
      <!-- Header End -->
      <div class="page-content">

        <!--Banner Start-->
        <div class="dz-bnr-inr" style="background-image:url('/images/background/bg1.jpg');">
          <div class="container">
            <div class="dz-bnr-inr-entry">
              <nav aria-label="breadcrumb" class="breadcrumb-row">
                <ul class="breadcrumb">
                  <li class="breadcrumb-item"><a href="/"> Home</a></li>
                  <li class="breadcrumb-item">Account Billing Address</li>
                </ul>
              </nav>
            </div>
          </div>
        </div>
        <!--Banner End-->

        <div class="content-inner-1">
          <div class="container">
            <div class="row">
              <aside class="col-xl-3">
                <div class="toggle-info">
                  <h5 class="title mb-0">Account Navbar</h5>
                  <a class="toggle-btn" href="#accountSidebar">Account Menu</a>
                </div>
                <div class="sticky-top account-sidebar-wrapper">
                  <div class="account-sidebar" id="accountSidebar">
                    <div class="profile-head">
                      <div class="user-thumb">
                        <img class="rounded-circle" src="/images/profile4.jpg" alt="Susan Gardner" />
                      </div>
                      <h5 class="title mb-0">Ronald M. Spino</h5>
                      <span class="text text-primary">info@example.com</span>
                    </div>
                    <div class="account-nav">
                      <div class="nav-title bg-light">DASHBOARD</div>
                      <ul>
                        <li><a href="/account-dashboard">Dashboard</a></li>
                        <li><a href="/account-orders">Orders</a></li>
                        <li><a href="/account-downloads">Downloads</a></li>
                        <li><a href="/account-return-request">Return request</a></li>
                      </ul>
                      <div class="nav-title bg-light">ACCOUNT SETTINGS</div>
                      <ul class="account-info-list">
                        <li><a href="/account-profile">Profile</a></li>
                        <li><a href="/account-address">Address</a></li>
                        <li><a href="/account-shipping-methods">Shipping methods</a></li>
                        <li><a href="/account-payment-methods">Payment Methods</a></li>
                        <li><a href="/account-review">Review</a></li>
                      </ul>
                    </div>
                  </div>
                </div>
              </aside>

              <section class="col-xl-9 account-wrapper">
                <div class="account-card">
                  <form class="row" action="#">
                    <h3 class="m-b30">Billing address</h3>
                    <div class="col-md-6">
                      <div class="form-group m-b25">
                        <label class="label-title">First Name</label>
                        <input name="dzName" required class="form-control" />
                      </div>
                    </div>
                    <div class="col-md-6">
                      <div class="form-group m-b25">
                        <label class="label-title">Last Name</label>
                        <input name="dzName" required class="form-control" />
                      </div>
                    </div>
                    <div class="col-md-12">
                      <div class="form-group m-b25">
                        <label class="label-title">Company name (optional)</label>
                        <input name="dzName" required class="form-control" />
                      </div>
                    </div>
                    <div class="col-md-12">
                      <div class="m-b25">
                        <label class="label-title">Country / Region *</label>
                        <select class="default-select form-select w-100">
                          <option selected>India</option>
                          <option value="1">Another option</option>
                          <option value="2">UK</option>
                          <option value="3">Iraq</option>
                        </select>
                      </div>
                    </div>
                    <div class="col-md-12">
                      <div class="form-group m-b25">
                        <label class="label-title">Street address *</label>
                        <input name="dzName" required class="form-control m-b15" placeholder="House number and street name" />
                        <input name="dzName" required class="form-control" placeholder="Apartment, suite, unit, etc. (optional)" />
                      </div>
                    </div>
                    <div class="col-md-12">
                      <div class="m-b25">
                        <label class="label-title">Town / City *</label>
                        <div class="form-select">
                          <select class="default-select w-100">
                            <option selected>Kota</option>
                            <option value="1">Another option</option>
                            <option value="2">Jaipur</option>
                            <option value="3">Udaipur</option>
                          </select>
                        </div>
                      </div>
                    </div>
                    <div class="col-md-12">
                      <div class="m-b25">
                        <label class="label-title">State*</label>
                        <select class="default-select form-select w-100">
                          <option selected>Rajasthan</option>
                          <option value="1">Another option</option>
                          <option value="2">Rajasthan</option>
                          <option value="3">Rajasthan</option>
                        </select>
                      </div>
                    </div>
                    <div class="col-md-12">
                      <div class="form-group m-b25">
                        <label class="label-title">postcode*</label>
                        <input name="dzName" required class="form-control" />
                      </div>
                    </div>
                    <div class="col-md-12">
                      <div class="form-group m-b25">
                        <label class="label-title">Phone*</label>
                        <input name="dzName" required class="form-control" />
                      </div>
                    </div>
                    <div class="col-md-12">
                      <div class="form-group m-b25">
                        <label class="label-title">Email address *</label>
                        <input name="dzName" required class="form-control" />
                      </div>
                    </div>
                  </form>
                  <button class="btn btn-secondary">Save changes</button>
                </div>
              </section>
            </div>
          </div>
        </div>
      </div>


      <!-- Footer -->
      <footer class="site-footer style-2">
        <div class="footer-top">
          <div class="container">
            <div class="row">
              <div class="col-xl-3 col-md-4 col-sm-6 wow fadeInUp" data-wow-delay="0.1s">
                <div class="widget widget_about me-2">
                  <div class="footer-logo logo-white">
                    <a href="/"><img src="/images/20.jpg.jpeg" alt="" /></a>
                  </div>
                  <ul class="widget-address">
                    <li><p><span>Address</span> : 451 Wall Street, UK, London</p></li>
                    <li><p><span>E-mail</span> : <a href="mailto:example@info.com">example@info.com</a></p></li>
                    <li><p><span>Phone</span> : <a href="tel:+9912121211">+919912121211</a></p></li>
                  </ul>
                  <h2 class="footer-title">Social Profile</h2>
                  <div class="dz-social-icon">
                    <ul>
                      <li><a href="https://www.facebook.com/dexignzone" target="_blank"><i class="fa-brands fa-facebook-f"></i></a></li>
                      <li><a href="https://twitter.com/dexignzones" target="_blank"><i class="fa-brands fa-twitter"></i></a></li>
                      <li><a href="https://www.linkedin.com/showcase/3686700/admin/" target="_blank"><i class="fa-brands fa-linkedin"></i></a></li>
                      <li><a href="https://www.instagram.com/dexignzone/" target="_blank"><i class="fa-brands fa-instagram"></i></a></li>
                    </ul>
                  </div>
                </div>
              </div>

              <div class="col-xl-3 col-md-4 col-sm-6 wow fadeInUp" data-wow-delay="0.2s">
                <div class="widget widget_post">
                  <h2 class="footer-title">Recent Social Media Post</h2>
                  <ul>
                    <li v-for="n in footerSocialPosts" :key="`foot-${n}`">
                      <div class="dz-media">
                        <a href="/post-standard"><img :src="`/images/shop/product/small/${n}.png`" alt="" /></a>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>

              <div class="col-xl-2 col-md-4 col-sm-4 col-6 wow fadeInUp" data-wow-delay="0.3s">
                <div class="widget widget_services">
                  <h2 class="footer-title">Features</h2>
                  <ul>
                    <li><a href="javascript:void(0);">E-Money</a></li>
                    <li><a href="javascript:void(0);">Local Business</a></li>
                    <li><a href="javascript:void(0);">Corporate</a></li>
                    <li><a href="javascript:void(0);">Internet Money</a></li>
                    <li><a href="javascript:void(0);">Latest News</a></li>
                    <li><a href="javascript:void(0);">Staking Ecosystem</a></li>
                  </ul>
                </div>
              </div>

              <div class="col-xl-2 col-md-4 col-sm-4 col-6 wow fadeInUp" data-wow-delay="0.4s">
                <div class="widget widget_services">
                  <h2 class="footer-title">Useful Links</h2>
                  <ul>
                    <li><a href="javascript:void(0);">Privacy Policy</a></li>
                    <li><a href="javascript:void(0);">Returns</a></li>
                    <li><a href="javascript:void(0);">Terms & Conditions</a></li>
                    <li><a href="javascript:void(0);">Contact Us</a></li>
                    <li><a href="javascript:void(0);">Latest News</a></li>
                    <li><a href="javascript:void(0);">Our Sitemap</a></li>
                  </ul>
                </div>
              </div>

              <div class="col-xl-2 col-md-4 col-sm-4 wow fadeInUp" data-wow-delay="0.5s">
                <div class="widget widget_services">
                  <h2 class="footer-title">Footer Menu</h2>
                  <ul>
                    <li><a href="javascript:void(0);">Instagram profile</a></li>
                    <li><a href="javascript:void(0);">New Collection</a></li>
                    <li><a href="javascript:void(0);">Popular Outfit</a></li>
                    <li><a href="javascript:void(0);">Contact Us</a></li>
                    <li><a href="javascript:void(0);">Latest News</a></li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
          <img class="Plant-img wow fadeInLeft" data-wow-delay="0.8s" src="/images/Plant-1.png" alt="" />
          <img class="Plant-img2 wow fadeInRight" data-wow-delay="0.8s" src="/images/Plant-2.png" alt="" />
        </div>

        <div class="footer-bottom">
          <div class="container">
            <div class="row fb-inner wow fadeInUp" data-wow-delay="0.1s">
              <div class="col-lg-6 col-md-12 text-start">
                <p class="copyright-text">
                  &copy; <span class="current-year">2024</span>
                  <a href="https://www.dexignzone.com/">DexignZone</a> Theme. All Rights Reserved.
                </p>
              </div>
              <div class="col-lg-6 col-md-12 text-end">
                <div class="d-flex align-items-center justify-content-center justify-content-md-center justify-content-xl-end">
                  <img src="/images/footer-img2.png" alt="" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>

      <button class="scroltop" type="button"><i class="fas fa-arrow-up"></i></button>
    </div>
</template>








