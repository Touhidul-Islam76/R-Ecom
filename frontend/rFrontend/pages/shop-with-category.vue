<script setup lang="ts">
import { ref, onBeforeUnmount, onMounted, watch, nextTick } from 'vue'
import { useRoute } from 'vue-router'

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
    { rel: 'canonical', href: 'https://fasionable.dexignzone.com/xhtml/shop-with-category.html' },
    { rel: 'icon', type: 'image/x-icon', href: '/images/20.jpg.jpeg' },
    { rel: 'stylesheet', href: '/vendor/bootstrap-select/dist/css/bootstrap-select.min.css' },
    { rel: 'stylesheet', href: '/vendor/swiper/swiper-bundle.min.css' },
    { rel: 'stylesheet', href: '/vendor/nouislider/nouislider.min.css' },
    { rel: 'stylesheet', href: '/vendor/animate/animate.css' },
    { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
    { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
    { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Marcellus&display=swap' },
  ],
})

const route = useRoute()
const showLoader = ref(true)
const mobileMenuOpen = ref(false)
let showTimer: ReturnType<typeof setTimeout> | null = null
let activeTimer: ReturnType<typeof setTimeout> | null = null
let hideTimer: ReturnType<typeof setTimeout> | null = null

watch(
  () => route.fullPath,
  () => {
    mobileMenuOpen.value = false
  }
)

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

const filterCategories = [
  { id: 'basic_checkbox_01', name: 'Bonsai', count: '10' },
  { id: 'basic_checkbox_02', name: 'Daily Wear', count: '5' },
  { id: 'basic_checkbox_03', name: 'indoor Living', count: '17' },
  { id: 'basic_checkbox_04', name: 'Perennials', count: '13' },
  { id: 'basic_checkbox_05', name: 'Fashion For Gift', count: '06' },
  { id: 'basic_checkbox_06', name: 'garden Tools', count: '17' },
  { id: 'basic_checkbox_07', name: 'Best Sellers', count: '13' },
  { id: 'basic_checkbox_08', name: 'Blossom Haven', count: '06' },
  { id: 'basic_checkbox_09', name: 'Casual Wear', count: '22' },
]

const sizeFilters = [
  { id: 'basic_checkbox_Small1', name: 'Small', count: '10' },
  { id: 'basic_checkbox_medium1', name: 'Medium', count: '5' },
  { id: 'basic_checkbox_large1', name: 'large', count: '17' },
]

const featuredProducts = [
  { img: '/images/blog/recent-blog/pic1.jpg', title: 'Classic Denim Set (m)', price: '$659', oldPrice: '$1299' },
  { img: '/images/blog/recent-blog/pic2.jpg', title: 'Runway Reach Dress (m)', price: '$700', oldPrice: '$1449' },
  { img: '/images/blog/recent-blog/pic3.jpg', title: 'Longline Fashion Dress (m)', price: '$449', oldPrice: '$999' },
]

const filterTags = ['fashion', 'Green Dreams', 'Seeds', 'Photo', 'capes', 'Urban Oasis', 'Fern Fantasy', 'Fashion Paradise']

const categorySlider = [
  { img: '/images/shop/product/1.png', title: 'Bonsai' },
  { img: '/images/shop/product/3.png', title: 'Daily Wear' },
  { img: '/images/shop/product/4.png', title: 'Perennials' },
  { img: '/images/shop/product/2.png', title: 'Fashion For Gift' },
  { img: '/images/shop/product/3.png', title: 'Best Sellers' },
  { img: '/images/shop/product/4.png', title: 'Blossom Haven' },
  { img: '/images/shop/product/2.png', title: 'Casual Wear' },
  { img: '/images/shop/product/4.png', title: 'Bonsai' },
]

const listViewProducts = [
  { img: '/images/shop/product/1.png', title: 'Indoor Oasis Lush looking its layout', review: '250', price: '$40.00', sale: false },
  { img: '/images/shop/product/2.png', title: 'Streetwear Edit', review: '650', price: '$94.00', sale: false },
  { img: '/images/shop/product/3.png', title: 'Long Vine Flora fashion and convey', review: '458', price: '$35.00', sale: false },
  { img: '/images/shop/product/4.png', title: 'Lengthy Leaf Landscapes layout', review: '630', price: '$25.00', sale: false },
  { img: '/images/shop/product/5.png', title: 'Stretching Vine Nursery layout', review: '520', price: '$45.00', sale: true },
  { img: '/images/shop/product/6.png', title: 'Stretching Vine Nursery layout', review: '256', price: '$70.00', sale: false },
  { img: '/images/shop/product/7.png', title: 'Indoor Oasis Lush looking its layout', review: '776', price: '$75.00', sale: true },
  { img: '/images/shop/product/8.png', title: 'Streetwear Edit', review: '255', price: '$36.00', sale: false },
]

const columnViewProducts = [
  { img: '/images/shop/product/1.png', title: 'Runway Reach Dress (m)', price: '$1099', oldPrice: '$659' },
  { img: '/images/shop/product/2.png', title: 'Tall Fit Collection (m)', price: '$1099', oldPrice: '$659' },
  { img: '/images/shop/product/3.png', title: 'Elegant Evening Dress (m)', price: '$1099', oldPrice: '$659' },
  { img: '/images/shop/product/4.png', title: 'Longline Fashion Dress (m)', price: '$1099', oldPrice: '$659' },
  { img: '/images/shop/product/5.png', title: 'Longline Fashion Dress (m)', price: '$1099', oldPrice: '$659' },
  { img: '/images/shop/product/6.png', title: 'Classic Denim Set', price: '$1099', oldPrice: '$659' },
  { img: '/images/shop/product/7.png', title: 'Streetwear Edit', price: '$1099', oldPrice: '$659' },
  { img: '/images/shop/product/8.png', title: 'Runway Reach Dress (m)', price: '$1099', oldPrice: '$659' },
  { img: '/images/shop/product/9.png', title: 'Longline Fashion Dress (m)', price: '$1099', oldPrice: '$659' },
]

const gridViewProducts = [
  { img: '/images/shop/product/1.png', title: 'Runway Reach Dress (m)', price: '$1099', oldPrice: '$659' },
  { img: '/images/shop/product/2.png', title: 'Tall Fit Collection (m)', price: '$1099', oldPrice: '$659' },
  { img: '/images/shop/product/3.png', title: 'Elegant Evening Dress (m)', price: '$1099', oldPrice: '$659' },
  { img: '/images/shop/product/4.png', title: 'Longline Fashion Dress (m)', price: '$1099', oldPrice: '$659' },
  { img: '/images/shop/product/5.png', title: 'Longline Fashion Dress (m)', price: '$1099', oldPrice: '$659' },
  { img: '/images/shop/product/6.png', title: 'Classic Denim Set (m)', price: '$1099', oldPrice: '$659' },
  { img: '/images/shop/product/7.png', title: 'Streetwear Edit (m)', price: '$1099', oldPrice: '$659' },
  { img: '/images/shop/product/8.png', title: 'Runway Reach Dress (m)', price: '$1099', oldPrice: '$659' },
  { img: '/images/shop/product/9.png', title: 'Longline Fashion Dress (m)', price: '$1099', oldPrice: '$659' },
  { img: '/images/shop/product/10.png', title: 'Creeping Thyme Elfin (s)', price: '$1099', oldPrice: '$659' },
  { img: '/images/shop/product/11.png', title: 'Tall Fescue Grass (m)', price: '$1099', oldPrice: '$659' },
  { img: '/images/shop/product/12.png', title: 'Compact Hinoki Cypress (M)', price: '$1099', oldPrice: '$659' },
]
</script>

<template>
  <div id="bg">
    <div class="page-wraper">
      <div v-if="showLoader" id="loading-area" class="loading-page-1">
        <div class="text"><span class="text-primary">Fashion</span>Able</div>
      </div>

      <!-- Header Start -->
      <header class="site-header mo-left header">
        <div class="sticky-header main-bar-wraper navbar-expand-lg">
          <div class="main-bar clearfix">
            <div class="container-fluid clearfix d-lg-flex d-block bg-light position-relative">

              <!-- Logo -->
              <div class="logo-header logo-dark me-md-4 me-2">
                <a href="/"><img src="/images/20.jpg.jpeg" alt="logo" /></a>
              </div>

              <!-- Nav Toggle -->
              <button
                class="navbar-toggler navicon justify-content-end position-relative"
                type="button"
                aria-controls="navbarNavDropdown"
                :aria-expanded="mobileMenuOpen ? 'true' : 'false'"
                aria-label="Toggle navigation"
                @click="mobileMenuOpen = !mobileMenuOpen"
              >
                <span></span>
                <span></span>
                <span></span>
              </button>

              <!-- Main Nav -->
              <div
                id="navbarNavDropdown"
                class="header-nav w3menu navbar-collapse justify-content-start mobile-nav-dropdown"
                :class="{ show: mobileMenuOpen }"
              >
                <div class="logo-header logo-dark d-lg-none">
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
                <form class="dzSubscribe dz-subscribe-wrapper1">
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
        <div class="dz-bnr-inr" style="background-image: url('/images/background/bg1.jpg')">
          <div class="container">
            <div class="dz-bnr-inr-entry">
              <nav aria-label="breadcrumb" class="breadcrumb-row">
                <ul class="breadcrumb">
                  <li class="breadcrumb-item"><a href="/">Home</a></li>
                  <li class="breadcrumb-item">Shop With Category</li>
                </ul>
              </nav>
            </div>
          </div>
        </div>
        <!--Banner End-->

        <section class="content-inner-3 pt-3 z-index-unset">
          <div class="container-fluid">
            <div class="row mt-xl-2 mt-0">
              <div class="col-20 col-xl-3">
                <div class="sticky-xl-top">
                  <a href="javascript:void(0);" class="panel-close-btn">
                    <svg width="35" height="35" viewBox="0 0 51 50" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M37.748 12.5L12.748 37.5" stroke="white" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round"/>
                      <path d="M12.748 12.5L37.748 37.5" stroke="white" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                  </a>
                  <div class="shop-filter mt-xl-2 mt-0">
                    <aside>
                      <div class="d-flex align-items-center justify-content-between m-b30">
                        <h6 class="title mb-0 d-flex"><i class="flaticon-filter me-2"></i>Filter</h6>
                      </div>

                      <div class="widget widget_search">
                        <div class="form-group">
                          <div class="input-group">
                            <input name="dzSearch" required type="search" class="form-control" placeholder="Search Here" />
                            <div class="input-group-addon">
                              <button name="submit" value="Submit" type="submit" class="btn"><i class="icon feather icon-search"></i></button>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div class="widget widget_categories">
                        <h3 class="widget-title">Product Category</h3>
                        <ul>
                          <li v-for="item in filterCategories" :key="item.id" class="cat-item cat-item-26">
                            <div class="custom-control custom-checkbox d-flex">
                              <input :id="item.id" type="checkbox" class="form-check-input square" />
                              <label class="form-check-label text-start flex-1" :for="item.id">{{ item.name }}</label>({{ item.count }})
                            </div>
                          </li>
                        </ul>
                      </div>

                      <div class="widget">
                        <h2 class="widget-title">Price</h2>
                        <div class="price-slide range-slider">
                          <div class="price">
                            <div class="range-slider style-1">
                              <div id="slider-tooltips" class="mb-3"></div>
                              <span class="example-val" id="slider-margin-value-min"></span>
                              <span class="example-val" id="slider-margin-value-max"></span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div class="widget product-size">
                        <h2 class="widget-title">Size</h2>
                        <ul>
                          <li v-for="item in sizeFilters" :key="item.id" class="cat-item cat-item-26">
                            <div class="custom-control custom-checkbox d-flex">
                              <input :id="item.id" type="checkbox" class="form-check-input square" />
                              <label class="form-check-label text-start flex-1" :for="item.id">{{ item.name }}</label>({{ item.count }})
                            </div>
                          </li>
                        </ul>
                      </div>

                      <div class="widget recent-posts-entry">
                        <h2 class="widget-title">Featured Products</h2>
                        <div class="widget-post-bx">
                          <div v-for="(item, idx) in featuredProducts" :key="idx" class="widget-post clearfix">
                            <div class="dz-media"><a href="javascript:void(0);"><img :src="item.img" alt="/" /></a></div>
                            <div class="dz-info">
                              <h6 class="title"><a href="javascript:void(0);">{{ item.title }}</a></h6>
                              <span class="price">{{ item.price }} <del>{{ item.oldPrice }}</del></span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div class="widget widget_tag_cloud">
                        <h2 class="widget-title">Tags</h2>
                        <div class="tagcloud">
                          <a v-for="(tag, idx) in filterTags" :key="idx" href="javascript:void(0);">{{ tag }}</a>
                        </div>
                      </div>

                      <a href="javascript:void(0);" class="btn btn-lg font-14 btn-secondary btn-sharp btn-block text-uppercase">Reset ALL FILTERS</a>
                    </aside>
                  </div>
                </div>
              </div>

              <div class="col-80 col-xl-9">
                <h2 class="mb-3">Category</h2>
                <div class="row">
                  <div class="col-xl-12">
                    <div class="swiper category-swiper">
                      <div class="swiper-wrapper">
                        <div v-for="(item, idx) in categorySlider" :key="`cat-${idx}`" class="swiper-slide">
                          <div class="shop-card">
                            <div class="dz-media rounded"><img :src="item.img" alt="image" /></div>
                            <div class="dz-content"><h2 class="title"><a href="javascript:void(0);">{{ item.title }}</a></h2></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div class="filter-wrapper border-top p-t20">
                  <div class="filter-left-area">
                    <span>Showing 1–5 Of 50 Results</span>
                  </div>
                  <div class="filter-right-area">
                    <a href="javascript:void(0);" class="panel-btn">
                      <svg class="me-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 25 25" width="20" height="20"><g id="Layer_28" data-name="Layer 28"><path d="M2.54,5H15v.5A1.5,1.5,0,0,0,16.5,7h2A1.5,1.5,0,0,0,20,5.5V5h2.33a.5.5,0,0,0,0-1H20V3.5A1.5,1.5,0,0,0,18.5,2h-2A1.5,1.5,0,0,0,15,3.5V4H2.54a.5.5,0,0,0,0,1ZM16,3.5a.5.5,0,0,1,.5-.5h2a.5.5,0,0,1,.5.5v2a.5.5,0,0,1-.5.5h-2a.5.5,0,0,1-.5-.5Z"></path><path d="M22.4,20H18v-.5A1.5,1.5,0,0,0,16.5,18h-2A1.5,1.5,0,0,0,13,19.5V20H2.55a.5.5,0,0,0,0,1H13v.5A1.5,1.5,0,0,0,14.5,23h2A1.5,1.5,0,0,0,18,21.5V21h4.4a.5.5,0,0,0,0-1ZM17,21.5a.5.5,0,0,1-.5.5h-2a.5.5,0,0,1-.5-.5v-2a.5.5,0,0,1,.5-.5h2a.5.5,0,0,1,.5.5Z"></path><path d="M8.5,15h2A1.5,1.5,0,0,0,12,13.5V13H22.45a.5.5,0,1,0,0-1H12v-.5A1.5,1.5,0,0,0,10.5,10h-2A1.5,1.5,0,0,0,7,11.5V12H2.6a.5.5,0,1,0,0,1H7v.5A1.5,1.5,0,0,0,8.5,15ZM8,11.5a.5.5,0,0,1,.5-.5h2a.5.5,0,0,1,.5.5v2a.5.5,0,0,1-.5.5h-2a.5.5,0,0,1-.5-.5Z"></path></g></svg>
                      Filter
                    </a>
                    <div class="form-group">
                      <select class="default-select">
                        <option>Default sorting</option>
                        <option>Popularity</option>
                        <option>Average rating</option>
                        <option>Latest</option>
                        <option>Low to high</option>
                        <option>high to Low</option>
                      </select>
                    </div>
                    <div class="form-group Category">
                      <select class="default-select">
                        <option>Categories</option>
                        <option>Popularity</option>
                        <option>Average rating</option>
                        <option>Latest</option>
                        <option>Low to high</option>
                        <option>high to Low</option>
                      </select>
                    </div>
                    <div class="shop-tab">
                      <ul class="nav" role="tablist" id="dz-shop-tab">
                        <li class="nav-item" role="presentation">
                          <a href="#tab-list-list" class="nav-link" id="tab-list-list-btn" data-bs-toggle="pill" data-bs-target="#tab-list-list" role="tab" aria-controls="tab-list-list" aria-selected="false">
                            <svg width="20" height="19" viewBox="0 0 20 19" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <rect y="0.4375" width="5" height="4" rx="0.5" fill="#949494"/>
                              <rect x="7" y="0.4375" width="13" height="4" rx="0.5" fill="#949494"/>
                              <rect y="7.4375" width="5" height="4" rx="0.5" fill="#949494"/>
                              <rect x="7" y="7.4375" width="13" height="4" rx="0.5" fill="#949494"/>
                              <rect y="14.4375" width="5" height="4" rx="0.5" fill="#949494"/>
                              <rect x="7" y="14.4375" width="13" height="4" rx="0.5" fill="#949494"/>
                            </svg>
                          </a>
                        </li>
                        <li class="nav-item" role="presentation">
                          <a href="#tab-list-column" class="nav-link" id="tab-list-column-btn" data-bs-toggle="pill" data-bs-target="#tab-list-column" role="tab" aria-controls="tab-list-column" aria-selected="false">
                            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <rect width="8" height="8" rx="1" fill="#949494"/>
                              <rect x="10" width="8" height="8" rx="1" fill="#949494"/>
                              <rect x="10" y="10" width="8" height="8" rx="1" fill="#949494"/>
                              <rect y="10" width="8" height="8" rx="1" fill="#949494"/>
                            </svg>
                          </a>
                        </li>
                        <li class="nav-item" role="presentation">
                          <a href="#tab-list-grid" class="nav-link active" id="tab-list-grid-btn" data-bs-toggle="pill" data-bs-target="#tab-list-grid" role="tab" aria-controls="tab-list-grid" aria-selected="true">
                            <svg width="20" height="21" viewBox="0 0 20 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <g clip-path="url(#clip0_279_2520)">
                                <path d="M4.16667 0.5H0.833333C0.373333 0.5 0 0.873333 0 1.33333V4.66667C0 5.12667 0.373333 5.5 0.833333 5.5H4.16667C4.62667 5.5 5 5.12667 5 4.66667V1.33333C5 0.873333 4.62667 0.5 4.16667 0.5Z" fill="#949494"/>
                                <path d="M4.16667 8H0.833333C0.373333 8 0 8.37333 0 8.83333V12.1667C0 12.6267 0.373333 13 0.833333 13H4.16667C4.62667 13 5 12.6267 5 12.1667V8.83333C5 8.37333 4.62667 8 4.16667 8Z" fill="#949494"/>
                                <path d="M4.16667 15.5H0.833333C0.373333 15.5 0 15.8733 0 16.3333V19.6667C0 20.1267 0.373333 20.5 0.833333 20.5H4.16667C4.62667 20.5 5 20.1267 5 19.6667V16.3333C5 15.8733 4.62667 15.5 4.16667 15.5Z" fill="#949494"/>
                                <path d="M11.6667 0.5H8.33333C7.87333 0.5 7.5 0.873333 7.5 1.33333V4.66667C7.5 5.12667 7.87333 5.5 8.33333 5.5H11.6667C12.1267 5.5 12.5 5.12667 12.5 4.66667V1.33333C12.5 0.873333 12.1267 0.5 11.6667 0.5Z" fill="#949494"/>
                                <path d="M11.6667 8H8.33333C7.87333 8 7.5 8.37333 7.5 8.83333V12.1667C7.5 12.6267 7.87333 13 8.33333 13H11.6667C12.1267 13 12.5 12.6267 12.5 12.1667V8.83333C12.5 8.37333 12.1267 8 11.6667 8Z" fill="#949494"/>
                                <path d="M11.6667 15.5H8.33333C7.87333 15.5 7.5 15.8733 7.5 16.3333V19.6667C7.5 20.1267 7.87333 20.5 8.33333 20.5H11.6667C12.1267 20.5 12.5 20.1267 12.5 19.6667V16.3333C12.5 15.8733 12.1267 15.5 11.6667 15.5Z" fill="#949494"/>
                                <path d="M19.1667 0.5H15.8333C15.3733 0.5 15 0.873333 15 1.33333V4.66667C15 5.12667 15.3733 5.5 15.8333 5.5H19.1667C19.6267 5.5 20 5.12667 20 4.66667V1.33333C20 0.873333 19.6267 0.5 19.1667 0.5Z" fill="#949494"/>
                                <path d="M19.1667 8H15.8333C15.3733 8 15 8.37333 15 8.83333V12.1667C15 12.6267 15.3733 13 15.8333 13H19.1667C19.6267 13 20 12.6267 20 12.1667V8.83333C20 8.37333 19.6267 8 19.1667 8Z" fill="#949494"/>
                                <path d="M19.1667 15.5H15.8333C15.3733 15.5 15 15.8733 15 16.3333V19.6667C15 20.1267 15.3733 20.5 15.8333 20.5H19.1667C19.6267 20.5 20 20.1267 20 19.6667V16.3333C20 15.8733 19.6267 15.5 19.1667 15.5Z" fill="#949494"/>
                              </g>
                              <defs>
                                <clipPath id="clip0_279_2520">
                                  <rect width="20" height="20" fill="white" transform="translate(0 0.5)"/>
                                </clipPath>
                              </defs>
                            </svg>
                          </a>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div class="row">
                  <div class="col-12 tab-content shop-" id="pills-tabContent">
                    <div class="tab-pane fade" id="tab-list-list" role="tabpanel" aria-labelledby="tab-list-list-btn">
                      <div class="row">
                        <div v-for="(item, idx) in listViewProducts" :key="`list-${idx}`" class="col-md-12 col-sm-12 col-xxxl-6">
                          <div class="dz-shop-card style-2">
                            <div class="dz-media">
                              <img :src="item.img" alt="image">
                              <div v-if="item.sale" class="product-tag">
                                <span class="badge badge-secondary">Sale</span>
                              </div>
                            </div>
                            <div class="dz-content">
                              <div class="dz-header">
                                <div>
                                  <h2 class="title mb-0"><a href="javascript:void(0);">{{ item.title }}</a></h2>
                                  <ul class="dz-tags">
                                    <li><a href="javascript:void(0);">Dresses,</a></li>
                                    <li><a href="javascript:void(0);">Accessorie</a></li>
                                  </ul>
                                </div>
                                <div class="review-num">
                                  <ul class="dz-rating">
                                    <li class="star-fill"><i class="flaticon-star-1"></i></li>
                                    <li class="star-fill"><i class="flaticon-star-1"></i></li>
                                    <li class="star-fill"><i class="flaticon-star-1"></i></li>
                                    <li><i class="flaticon-star-1"></i></li>
                                    <li><i class="flaticon-star-1"></i></li>
                                  </ul>
                                  <span><a href="javascript:void(0);">{{ item.review }} Review</a></span>
                                </div>
                              </div>
                              <div class="dz-body">
                                <div class="dz-rating-box">
                                  <div>
                                    <p class="dz-para">It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has.</p>
                                  </div>
                                </div>
                                <div class="rate">
                                  <div class="d-flex align-items-center mb-xl-3 mb-2">
                                    <div class="meta-content m-0">
                                      <span class="price-name">Price</span>
                                      <span class="price">{{ item.price }}</span>
                                    </div>
                                  </div>
                                  <div class="d-flex">
                                    <a href="/shop-cart" class="btn btn-secondary btn-md btn-icon">
                                      <i class="icon feather icon-shopping-cart d-md-none d-block"></i>
                                      <span class="d-md-block d-none">Add to cart</span>
                                    </a>
                                    <div class="bookmark-btn style-1">
                                      <input class="form-check-input" type="checkbox" :id="`favoriteCheckList${idx}`">
                                      <label class="form-check-label" :for="`favoriteCheckList${idx}`">
                                        <i class="fa-solid fa-heart"></i>
                                      </label>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div class="tab-pane fade" id="tab-list-column" role="tabpanel" aria-labelledby="tab-list-column-btn">
                      <div class="row gx-xl-4 g-3 mb-xl-0 mb-md-0 mb-3">
                        <div v-for="(item, idx) in columnViewProducts" :key="`col-${idx}`" class="col-6 col-xl-4 col-lg-6 col-md-6 col-sm-6 m-md-b15 m-sm-b0 m-b30">
                          <div class="shop-card">
                            <div class="dz-media">
                              <img :src="item.img" alt="image">
                              <div class="shop-meta">
                                <div class="btn btn-primary meta-icon dz-wishicon">
                                  <i class="icon feather icon-heart dz-heart"></i>
                                  <i class="icon feather icon-heart-on dz-heart-fill"></i>
                                </div>
                                <a href="javascript:void(0);" class="btn btn-primary meta-icon dz-wishicon" data-bs-toggle="modal" data-bs-target="#exampleModal">
                                  <i class="flaticon flaticon-eye d-md-none d-block"></i>
                                  <span class="d-md-block d-none"><i class="flaticon flaticon-eye"></i></span>
                                </a>
                                <div class="btn btn-primary meta-icon dz-carticon">
                                  <i class="flaticon flaticon-basket"></i>
                                  <i class="flaticon flaticon-basket-on dz-heart-fill"></i>
                                </div>
                              </div>
                            </div>
                            <div class="dz-content">
                              <h2 class="title"><a href="javascript:void(0);">{{ item.title }}</a></h2>
                              <span class="price">
                                {{ item.price }}
                                <del>{{ item.oldPrice }}</del>
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div class="tab-pane fade active show" id="tab-list-grid" role="tabpanel" aria-labelledby="tab-list-grid-btn">
                      <div class="row gx-xl-4 g-3">
                        <div v-for="(item, idx) in gridViewProducts" :key="`grid-${idx}`" class="col-6 col-xl-3 col-lg-4 col-md-4 col-sm-6 m-md-b30 m-b30">
                          <div class="shop-card style-1">
                            <div class="dz-media">
                              <img :src="item.img" alt="image">
                            </div>
                            <div class="shop-meta">
                              <a href="javascript:void(0);" class="btn btn-primary btn-md w-100" data-bs-toggle="modal" data-bs-target="#exampleModal">
                                <i class="fa-solid fa-eye"></i>
                                <span class="d-lg-block d-none">Quick View</span>
                              </a>
                              <div class="btn btn-primary meta-icon dz-refresh">
                                <i class="flaticon flaticon-refresh dz-refresh"></i>
                                <i class="flaticon flaticon-refresh-on dz-refresh-fill"></i>
                              </div>
                              <div class="btn btn-primary meta-icon dz-wishicon">
                                <i class="icon feather icon-heart dz-heart"></i>
                                <i class="icon feather icon-heart-on dz-heart-fill"></i>
                              </div>
                              <div class="btn btn-primary meta-icon dz-carticon">
                                <i class="flaticon flaticon-shopping-cart-1 dz-cart"></i>
                                <i class="flaticon flaticon-shopping-cart-1-on dz-cart-fill"></i>
                              </div>
                            </div>
                            <div class="dz-content">
                              <h2 class="title"><a href="javascript:void(0);">{{ item.title }}</a></h2>
                              <span class="price">
                                {{ item.price }}
                                <del>{{ item.oldPrice }}</del>
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div class="row page mt-0">
                  <div class="col-md-6"><p class="page-text">Showing 1–5 Of 50 Results</p></div>
                  <div class="col-md-6">
                    <nav aria-label="Blog Pagination">
                      <ul class="pagination style-1">
                        <li class="page-item"><a class="page-link prev" href="javascript:void(0);">Prev</a></li>
                        <li class="page-item"><a class="page-link active" href="javascript:void(0);">1</a></li>
                        <li class="page-item"><a class="page-link" href="javascript:void(0);">2</a></li>
                        <li class="page-item"><a class="page-link" href="javascript:void(0);">3</a></li>
                        <li class="page-item"><a class="page-link next" href="javascript:void(0);">Next</a></li>
                      </ul>
                    </nav>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section class="content-inner-3 overflow-hidden position-relative border-top">
          <div class="container">
            <div class="row align-items-center">
              <div class="col-lg-6 col-md-12"><div class="section-head style-2 d-block wow fadeInUp" data-wow-delay="0.2s"><h2 class="title mb-4">Subscribe Newsletter & Get Fashion News</h2></div></div>
              <div class="col-lg-6 col-md-12 m-b30 wow fadeInUp" data-wow-delay="0.4s">
                <form class="dzSubscribe style-2" action="script/mailchamp.php" method="post"><div class="dzSubscribeMsg"></div><div class="form-group"><div class="input-group mb-0"><input name="dzEmail" required type="email" class="form-control h-70" placeholder="Your Email Address" /><div class="sub-btn"><button name="submit" value="Submit" type="submit" class="btn btn-secondary">Subscribe Now</button></div></div></div></form>
              </div>
            </div>
          </div>
        </section>
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
  </div>
</template>

<style>
@media (max-width: 991.98px) {
  .main-bar .container-fluid {
    position: relative;
  }

  .extra-nav {
    margin-left: auto;
  }
}

@media (min-width: 992px) {
  .extra-nav {
    margin-left: auto;
  }
}

</style>






