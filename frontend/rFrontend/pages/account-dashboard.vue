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
    { rel: 'canonical', href: 'https://fasionable.dexignzone.com/xhtml/account-dashboard.html' },
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
    { src: '/vendor/apexchart/apexchart.js' },
    { src: '/js/dashbord-account.js' },
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
        <!-- Banner Start -->
        <div class="dz-bnr-inr" style="background-image: url('/images/background/bg1.jpg');">
          <div class="container">
            <div class="dz-bnr-inr-entry">
              <nav aria-label="breadcrumb" class="breadcrumb-row">
                <ul class="breadcrumb">
                  <li class="breadcrumb-item"><a href="/">Home</a></li>
                  <li class="breadcrumb-item">Account Dashboard</li>
                </ul>
              </nav>
            </div>
          </div>
        </div>
        <!-- Banner End -->

        <div class="content-inner-1">
          <div class="container">
            <div class="row">
              <aside class="col-xl-3">
                <div class="toggle-info">
                  <h5 class="title mb-0">Account Navbar</h5>
                  <a class="toggle-btn" href="#accountSidebar">Account Menu</a>
                </div>
                <div class="account-sidebar-wrapper">
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
                  <div class="m-b30">
                    <p>
                      Hello <strong class="text-black">John Doe</strong> (not
                      <strong class="text-black">John Doe</strong>?
                      <a href="/login" class="text-underline">Log out</a>)
                    </p>
                    <p>
                      From your account dashboard you can view your
                      <a href="/account-orders" class="text-underline">recent orders</a>, manage your
                      <a href="/account-address" class="text-underline">shipping and billing addresses</a>, and
                      <a href="/account-profile" class="text-underline">edit your password and account details</a>.
                    </p>
                  </div>

                  <div class="row g-4">
                    <div class="col-md-4">
                      <div class="total-contain">
                        <div class="total-icon">
                          <svg width="36" height="37" viewBox="0 0 36 37" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M32.4473 8.03086C32.482 8.37876 32.5 8.73144 32.5 9.08829C32.5 14.919 27.7564 19.6625 21.9258 19.6625C16.0951 19.6625 11.3516 14.919 11.3516 9.08829C11.3516 8.73144 11.3695 8.37876 11.4042 8.03086H8.98055L8.05537 0.628906H0.777344V2.74375H6.18839L8.56759 21.7774H34.1868L35.8039 8.03086H32.4473Z" fill="#FFBB38"></path>
                            <path d="M9.09669 26.0074H6.06485C4.31566 26.0074 2.89258 27.4305 2.89258 29.1797C2.89258 30.9289 4.31566 32.352 6.06485 32.352H6.24672C6.12935 32.6829 6.06485 33.0386 6.06485 33.4094C6.06485 35.1586 7.48793 36.5816 9.23711 36.5816C11.4247 36.5816 12.9571 34.4091 12.2274 32.352H22.1081C21.377 34.413 22.9157 36.5816 25.0985 36.5816C26.8476 36.5816 28.2707 35.1586 28.2707 33.4094C28.2707 33.0386 28.2061 32.6829 28.0888 32.352H30.3856V30.2371H6.06485C5.48178 30.2371 5.00742 29.7628 5.00742 29.1797C5.00742 28.5966 5.48178 28.1223 6.06485 28.1223H33.4407L33.9384 23.8926H8.83233L9.09669 26.0074Z" fill="#FFBB38"></path>
                            <path d="M21.9262 17.5477C26.5907 17.5477 30.3856 13.7528 30.3856 9.08829C30.3856 4.42378 26.5907 0.628906 21.9262 0.628906C17.2616 0.628906 13.4668 4.42378 13.4668 9.08829C13.4668 13.7528 17.2617 17.5477 21.9262 17.5477ZM20.8688 5.91602H22.9836V8.6503L24.7886 10.4554L23.2932 11.9508L20.8687 9.5262V5.91602H20.8688Z" fill="#FFBB38"></path>
                          </svg>
                        </div>
                        <div class="total-detail">
                          <span class="text">Total Order</span>
                          <h2 class="title">3658</h2>
                        </div>
                      </div>
                    </div>

                    <div class="col-md-4">
                      <div class="total-contain">
                        <div class="total-icon">
                          <svg width="33" height="27" viewBox="0 0 33 27" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M30.2253 12.8816H29.4827L28.6701 9.36514C28.376 8.10431 27.2552 7.22168 25.9662 7.22168H21.8474V3.84528C21.8474 2.03804 20.3764 0.581055 18.5831 0.581055H3.17237C1.46313 0.581055 0.0761719 1.96801 0.0761719 3.67717V20.0967C0.0761719 21.8058 1.46313 23.1928 3.17237 23.1928H4.29313C4.89555 25.1962 6.74485 26.6533 8.93037 26.6533C11.1159 26.6533 12.9792 25.1962 13.5816 23.1928C13.8455 23.1928 20.3459 23.1928 20.1942 23.1928C20.7966 25.1962 22.6459 26.6533 24.8315 26.6533C27.031 26.6533 28.8803 25.1962 29.4827 23.1928H30.2253C31.7663 23.1928 32.9992 21.9599 32.9992 20.4189V15.6555C32.9992 14.1145 31.7663 12.8816 30.2253 12.8816ZM8.93037 23.8513C7.78968 23.8513 6.88491 22.8969 6.88491 21.7918C6.88491 20.657 7.79558 19.7324 8.93037 19.7324C10.0652 19.7324 10.9898 20.657 10.9898 21.7918C10.9898 22.9151 10.0692 23.8513 8.93037 23.8513ZM13.9739 8.06224L9.79897 11.3125C9.20227 11.7767 8.30347 11.6903 7.82363 11.0604L6.21247 8.94486C5.7361 8.32843 5.86222 7.4458 6.47866 6.98346C7.08107 6.50717 7.96369 6.63321 8.44006 7.24965L9.19656 8.23035L12.2507 5.84867C12.8531 5.3864 13.7357 5.48448 14.2121 6.10092C14.6884 6.71727 14.5763 7.58595 13.9739 8.06224ZM24.8315 23.8513C23.6906 23.8513 22.7861 22.8969 22.7861 21.7918C22.7861 20.657 23.7107 19.7324 24.8315 19.7324C25.9662 19.7324 26.8909 20.657 26.8909 21.7918C26.8909 22.9166 25.9683 23.8513 24.8315 23.8513ZM22.618 10.0236H25.2798C25.6021 10.0236 25.8962 10.2337 26.0083 10.542L26.8629 13.0497C27.031 13.5541 26.6667 14.0724 26.1344 14.0724H22.618C22.1976 14.0724 21.8474 13.7222 21.8474 13.3019V10.7942C21.8474 10.3739 22.1976 10.0236 22.618 10.0236Z" fill="#FFBB38"></path>
                          </svg>
                        </div>
                        <div class="total-detail">
                          <span class="text">Total Pending Order</span>
                          <h2 class="title">215</h2>
                        </div>
                      </div>
                    </div>

                    <div class="col-md-4">
                      <div class="total-contain">
                        <div class="total-icon">
                          <svg width="27" height="31" viewBox="0 0 27 31" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M9.79749 18.4331C6.71621 20.0289 5.95627 20.8019 4.64859 23.6816C3.76653 22.8387 2.90107 22.0123 2.00953 21.1599C2.5288 20.3146 3.03267 19.4942 3.53535 18.6726C3.88035 18.1071 3.46066 17.0579 2.82282 16.899C1.88623 16.6666 0.94845 16.4426 0 16.2114C0 14.4034 0 12.6274 0 10.7827C0.921182 10.561 1.85422 10.3405 2.78489 10.1117C3.46777 9.94331 3.8922 8.90476 3.52705 8.30605C3.03385 7.49868 2.5371 6.6925 2.06051 5.91596C3.35514 4.62014 4.62251 3.35396 5.92426 2.05339C6.70673 2.53355 7.52832 3.03978 8.35347 3.54246C8.88698 3.8673 9.94331 3.44524 10.0927 2.84416C10.3262 1.90638 10.5491 0.965048 10.7839 0C12.5883 0 14.3785 0 16.2197 0C16.4366 0.906955 16.6548 1.8234 16.8777 2.73865C17.0555 3.46777 18.0763 3.89694 18.7082 3.50926C19.5144 3.01489 20.3182 2.52051 21.0829 2.05102C22.3763 3.34447 23.6318 4.59998 24.943 5.9124C24.4783 6.67235 23.9756 7.49038 23.4753 8.31079C23.1114 8.90713 23.5405 9.93976 24.2258 10.1081C25.1434 10.3334 26.0646 10.5503 27 10.7756C27 12.5954 27 14.3892 27 16.2197C26.1298 16.426 25.2667 16.6287 24.4048 16.8338C23.4658 17.0579 23.0651 18.0122 23.5654 18.8267C24.029 19.5819 24.4914 20.3383 24.9727 21.122C24.1487 22.004 23.3473 22.8612 22.4901 23.7776C21.5393 21.1741 19.8297 19.4243 17.3163 18.4592C20.5565 15.5332 19.8558 11.4668 17.659 9.41099C15.2973 7.19992 11.5995 7.26157 9.31378 9.56393C7.15368 11.7406 6.71858 15.6885 9.79749 18.4331Z" fill="#FFBB38"></path>
                            <path d="M21.0695 30.3147C16.0415 30.3147 11.0847 30.3147 6.03891 30.3147C6.03891 29.9768 6.03416 29.6496 6.04009 29.3224C6.06262 28.0396 5.97963 26.7426 6.13612 25.4752C6.53566 22.2576 9.12611 19.9244 12.3722 19.8213C13.5886 19.7821 14.8417 19.7762 16.0249 20.0169C18.8643 20.5954 20.8916 23.0258 21.0552 25.9364C21.1359 27.3709 21.0695 28.8138 21.0695 30.3147Z" fill="#FFBB38"></path>
                            <path d="M13.5375 17.9235C11.2244 17.9093 9.35005 16.0112 9.38325 13.7195C9.41763 11.4124 11.3169 9.55701 13.6157 9.58428C15.8849 9.61036 17.7486 11.5013 17.7403 13.7693C17.7332 16.0752 15.8481 17.9378 13.5375 17.9235Z" fill="#FFBB38"></path>
                          </svg>
                        </div>
                        <div class="total-detail">
                          <span class="text">Total Wishlist</span>
                          <h2 class="title">31576</h2>
                        </div>
                      </div>
                    </div>

                    <div class="col-xl-8">
                      <div class="sales-chart-wraper">
                        <div id="handleSalesChart"></div>
                      </div>
                    </div>

                    <div class="col-xl-4">
                      <div class="card countries-card px-3 pt-3 pb-2 mb-2">
                        <h6>Your Top Countries</h6>
                        <ul>
                          <li>
                            <div class="thumb-detail">
                              <img src="/images/country/pic1.png" alt="" />
                              <span>United States</span>
                            </div>
                            <div class="thumb-content"><h6 class="amount">$130.00</h6></div>
                          </li>
                          <li>
                            <div class="thumb-detail">
                              <img src="/images/country/pic2.png" alt="" />
                              <span>India</span>
                            </div>
                            <div class="thumb-content"><h6 class="amount">$110.00</h6></div>
                          </li>
                          <li>
                            <div class="thumb-detail">
                              <img src="/images/country/pic3.png" alt="" />
                              <span>Africa</span>
                            </div>
                            <div class="thumb-content"><h6 class="amount">$90.00</h6></div>
                          </li>
                          <li>
                            <div class="thumb-detail">
                              <img src="/images/country/pic4.png" alt="" />
                              <span>Canada</span>
                            </div>
                            <div class="thumb-content"><h6 class="amount">$75.00</h6></div>
                          </li>
                          <li>
                            <div class="thumb-detail">
                              <img src="/images/country/pic5.png" alt="" />
                              <span>Brazil</span>
                            </div>
                            <div class="thumb-content"><h6 class="amount">$60.00</h6></div>
                          </li>
                          <li class="border-bottom-0">
                            <div class="thumb-detail">
                              <img src="/images/country/pic6.png" alt="" />
                              <span>Jordan</span>
                            </div>
                            <div class="thumb-content"><h6 class="amount">$50.00</h6></div>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
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






