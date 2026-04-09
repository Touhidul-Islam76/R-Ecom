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
    { rel: 'canonical', href: 'https://fasionable.dexignzone.com/xhtml/post-gallery-alternative.html' },
    { rel: 'icon', type: 'image/x-icon', href: '/images/20.jpg.jpeg' },
    { rel: 'stylesheet', href: '/vendor/bootstrap-select/dist/css/bootstrap-select.min.css' },
    { rel: 'stylesheet', href: '/vendor/swiper/swiper-bundle.min.css' },
    { rel: 'stylesheet', href: '/vendor/nouislider/nouislider.min.css' },
    { rel: 'stylesheet', href: '/vendor/animate/animate.css' },
    { rel: 'stylesheet', href: '/vendor/lightgallery/dist/css/lightgallery.css' },
    { rel: 'stylesheet', href: '/vendor/lightgallery/dist/css/lg-thumbnail.css' },
    { rel: 'stylesheet', href: '/vendor/lightgallery/dist/css/lg-zoom.css' },
    { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
    { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
    { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Marcellus&display=swap' },
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
const productThumbs = [1, 2, 3]
const productGallery = [1, 2, 3]
const completeGardenProducts = [
  { img: '/images/shop/product/1.png', title: 'Runway Reach Dress (m)', price: '$1099', old: '$659' },
  { img: '/images/shop/product/2.png', title: 'Tall Fit Collection (m)', price: '$1099', old: '$659' },
  { img: '/images/shop/product/3.png', title: 'Elegant Evening Dress (m)', price: '$1099', old: '$659' },
  { img: '/images/shop/product/4.png', title: 'Longline Fashion Dress (m)', price: '$1099', old: '$659' },
]
const relatedProducts = [
  { img: '/images/shop/product/1.png', title: 'Runway Reach Dress (m)', price: '$1099', old: '$659' },
  { img: '/images/shop/product/2.png', title: 'Tall Fit Collection (m)', price: '$1099', old: '$659' },
  { img: '/images/shop/product/3.png', title: 'Elegant Evening Dress (m)', price: '$1099', old: '$659' },
  { img: '/images/shop/product/4.png', title: 'Longline Fashion Dress (m)', price: '$1099', old: '$659' },
  { img: '/images/shop/product/5.png', title: 'Chic Mini Dress (m)', price: '$1099', old: '$659' },
  { img: '/images/shop/product/6.png', title: 'Premium Maxi Dress (m)', price: '$1099', old: '$659' },
  { img: '/images/shop/product/7.png', title: 'Oversized Street Jacket (m)', price: '$1099', old: '$659' },
  { img: '/images/shop/product/8.png', title: 'Bacopa Sutera (m)', price: '$1099', old: '$659' },
  { img: '/images/shop/product/1.png', title: 'Vineyard Reach Plus', price: '$999', old: '$599' },
  { img: '/images/shop/product/2.png', title: 'TallStalk Classic', price: '$989', old: '$579' },
  { img: '/images/shop/product/3.png', title: 'Endless Green', price: '$1029', old: '$619' },
  { img: '/images/shop/product/4.png', title: 'Long Vine Premium', price: '$1129', old: '$699' },
]
</script>

<template>
  <div id="bg">
    <div class="page-wraper">
      <PageLoader :show-loader="showLoader" />

      <SiteHeaderMobileNuxt :popular-products="popularProducts" :sidebar-cart-items="sidebarCartItems" :wishlist-items="wishlistItems" />

      <div class="page-content">
        <div class="d-sm-flex justify-content-between container-fluid py-3 bg-dark">
          <nav aria-label="breadcrumb" class="breadcrumb-row text-dark">
            <ul class="breadcrumb mb-0">
              <li class="breadcrumb-item"><NuxtLink to="/">Home</NuxtLink></li>
              <li class="breadcrumb-item">Product Default</li>
            </ul>
          </nav>
        </div>

        <section class="content-inner overflow-hidden p-0 bg-dark">
          <div class="container-fluid">
            <div class="row justify-content-xl-between align-items-center justify-content-center">
              <div class="col-xl-2 col-lg-6 col-md-5 order-md-0 order-1">
                <div class="dz-product-detail style-1">
                  <div class="swiper-btn-center-lr">
                    <div class="swiper product-gallery-swiper thumb-swiper-lg" dir="rtl">
                      <div class="swiper-wrapper">
                        <div v-for="n in productThumbs" :key="`thumb-${n}`" class="swiper-slide">
                          <img :src="`/images/products/product-default/thumb-img/${n}.png`" alt="image" />
                        </div>
                      </div>
                    </div>
                    <div class="image-slider__pagination">
                      <div class="image-slider__current">1</div>
                      <div class="swiper-pagination swiper-pagination-slider1"></div>
                      <div class="image-slider__total">1</div>
                    </div>
                  </div>
                </div>
                <div class="reviews-bx">
                  <span class="title"><i class="flaticon flaticon-star-2"></i> Trustpilot</span>
                  <div class="rating">
                    <i class="flaticon flaticon-star-2"></i><i class="flaticon flaticon-star-2"></i><i class="flaticon flaticon-star-2"></i><i class="flaticon flaticon-star-2"></i><i class="flaticon flaticon-star-2"></i>
                  </div>
                  <p>TrustScore <span>4.2</span></p>
                  <p><span>110,405</span> Reviews</p>
                </div>
              </div>

              <div class="col-xl-5 col-lg-6 col-md-8 order-3 order-xl-2">
                <div class="dz-product-detail sticky-top m-0">
                  <div class="swiper-btn-center-lr">
                    <div class="swiper product-gallery-swiper2 rounded">
                      <div id="lightgallery2" class="swiper-wrapper">
                        <div v-for="n in productGallery" :key="`gallery-${n}`" class="swiper-slide">
                          <div class="dz-media">
                            <a class="mfp-link lg-item" href="javascript:void(0);">
                              <i class="feather icon-maximize dz-maximize top-left"></i>
                            </a>
                            <div class="single-product-media2">
                              <div class="dz-media">
                                <img :src="`/images/products/product-default/pic${n}.png`" alt="image" />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div class="col-xl-4 col-lg-6 col-md-7 order-2 order-xl-3">
                <div class="dz-product-detail style-4 p-t50 bg-white">
                  <div class="dz-content">
                    <div class="dz-content-footer">
                      <div class="dz-content-start">
                        <h2 class="title mb-1"><a href="/shop-list">Premium Maxi Dress (m)</a></h2>
                      </div>
                    </div>
                    <p class="para-text">Lorem Ipsum is simply dummy text of the printing and typesetting industry.</p>
                    <div class="d-flex align-items-center m-b30">
                      <label class="form-label m-r10">Size</label>
                      <div class="btn-group product-size m-0">
                        <input id="size-medium" checked type="radio" class="btn-check" name="btnradio1"><label class="btn" for="size-medium">Medium</label>
                        <input id="size-tall" type="radio" class="btn-check" name="btnradio1"><label class="btn" for="size-tall">Tall</label>
                        <input id="size-standard" type="radio" class="btn-check" name="btnradio1"><label class="btn" for="size-standard">Standard</label>
                        <input id="size-semi" type="radio" class="btn-check" name="btnradio1"><label class="btn" for="size-semi">Semi</label>
                        <input id="size-mini" type="radio" class="btn-check" name="btnradio1"><label class="btn" for="size-mini">Mini</label>
                      </div>
                    </div>
                    <div class="meta-content m-b20 d-flex align-items-end">
                      <div class="me-5"><span class="form-label">Price</span><span class="price">$45.00 <del>$132.17</del></span></div>
                      <div class="quantity btn-quantity style-1 m-0"><label class="form-label">Quantity</label><input id="demo_vertical5" type="text" value="1" name="demo_vertical2"></div>
                    </div>
                    <div class="btn-group cart-btn">
                      <NuxtLink to="/shop-cart" class="btn btn-secondary text-uppercase">Add To Cart</NuxtLink>
                      <NuxtLink to="/shop-wishlist" class="btn btn-outline-secondary btn-icon">Add To Wishlist</NuxtLink>
                    </div>
                    <div class="dz-info m-0">
                      <ul><li><strong>SKU:</strong></li><li>PRT584E63A</li></ul>
                      <ul><li><strong>Category:</strong></li><li><a href="/shop-standard">Casual Wear,</a></li><li><a href="/shop-standard">Fern Fantasy,</a></li><li><a href="/shop-standard">Blossom Haven,</a></li></ul>
                      <ul><li><strong>Tags:</strong></li><li><a href="/shop-standard">Dresses,</a></li><li><a href="/shop-standard">Garden Care,</a></li><li><a href="/shop-standard">Aqua Greens,</a></li><li><a href="/shop-standard">Daily Wear,</a></li></ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section class="content-inner overflow-hidden p-b0">
          <div class="container">
            <div class="section-head style-5 d-md-flex align-items-center justify-content-between">
              <div class="left-content"><h2 class="title mb-0">Complete Your Garden</h2></div>
              <a href="/shop-list" class="text-secondary font-14 d-flex align-items-center gap-1">See all products <i class="icon feather icon-chevron-right font-18"></i></a>
            </div>
            <div class="row">
              <div v-for="(item, idx) in completeGardenProducts" :key="`garden-${idx}`" class="col-xl-3 col-lg-3 col-md-4 col-sm-6 m-b30">
                <div class="shop-card style-1 m-b30">
                  <div class="dz-media"><img :src="item.img" alt="image"></div>
                  <div class="shop-meta">
                    <a href="javascript:void(0);" class="btn btn-primary btn-md w-100" data-bs-toggle="modal" data-bs-target="#exampleModal"><i class="fa-solid fa-eye"></i><span class="d-lg-block d-none">Quick View</span></a>
                    <div class="btn btn-primary meta-icon dz-refresh"><i class="flaticon flaticon-refresh dz-refresh"></i><i class="flaticon flaticon-refresh-on dz-refresh-fill"></i></div>
                    <div class="btn btn-primary meta-icon dz-wishicon"><i class="icon feather icon-heart dz-heart"></i><i class="icon feather icon-heart-on dz-heart-fill"></i></div>
                    <div class="btn btn-primary meta-icon dz-carticon"><i class="flaticon flaticon-shopping-cart-1 dz-cart"></i><i class="flaticon flaticon-shopping-cart-1-on dz-cart-fill"></i></div>
                  </div>
                  <div class="dz-content"><h2 class="title"><a href="/shop-list">{{ item.title }}</a></h2><span class="price">{{ item.price }}<del>{{ item.old }}</del></span></div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section class="content-inner-3 pb-0">
          <div class="container">
            <div class="product-description">
              <div class="dz-tabs">
                <ul id="myTab1" class="nav nav-tabs center" role="tablist">
                  <li class="nav-item" role="presentation"><button id="home-tab" class="nav-link active" data-bs-toggle="tab" data-bs-target="#home-tab-pane" type="button">Product Description</button></li>
                  <li class="nav-item" role="presentation"><button id="information-tab" class="nav-link" data-bs-toggle="tab" data-bs-target="#information-tab-pane" type="button">Additional Information</button></li>
                  <li class="nav-item" role="presentation"><button id="return-tab" class="nav-link" data-bs-toggle="tab" data-bs-target="#return-tab-pane" type="button">Shipping & Return</button></li>
                  <li class="nav-item" role="presentation"><button id="profile-tab" class="nav-link" data-bs-toggle="tab" data-bs-target="#profile-tab-pane" type="button">Product Reviews</button></li>
                </ul>
                <div id="myTabContent" class="tab-content">
                  <div id="home-tab-pane" class="tab-pane fade show active" role="tabpanel">
                    <div class="row g-3 m-b30 align-items-center">
                      <div class="col-xl-4 col-lg-6 col-md-12 col-sm-12">
                        <div class="description style-1">
                          <h2 class="sub-title">The Quality & Style</h2>
                          <h2 class="title">Minimalist Design And Premium Quality Product.</h2>
                          <p class="font-wight-500">Lorem Ipsum is simply dummy text of the printing and typesetting industry.</p>
                        </div>
                      </div>
                      <div class="col-xl-4 col-lg-3 col-md-6 col-sm-6"><div class="related-img dz-media"><img src="/images/feature/product-feature-4/1.png" alt="/"></div></div>
                      <div class="col-xl-4 col-lg-3 col-md-6 col-sm-6"><div class="related-img dz-media"><img src="/images/feature/product-feature-4/2.png" alt="/"></div></div>
                    </div>
                    <div class="row g-lg-4 g-3">
                      <div class="col-xl-3 col-md-6 col-sm-12">
                        <div class="icon-bx-wraper style-6 m-b15">
                          <div class="icon-bx"><i class="flaticon flaticon-chat-8"></i></div>
                          <div class="icon-content"><h3 class="dz-title">Eco Friendly Product</h3></div>
                        </div>
                      </div>
                      <div class="col-xl-3 col-md-6 col-sm-12">
                        <div class="icon-bx-wraper style-6 m-b15">
                          <div class="icon-bx"><i class="flaticon flaticon-paper"></i></div>
                          <div class="icon-content"><h3 class="dz-title">Easy To Clean And Maintain</h3></div>
                        </div>
                      </div>
                      <div class="col-xl-3 col-md-6 col-sm-12">
                        <div class="icon-bx-wraper style-6 m-b15">
                          <div class="icon-bx"><i class="flaticon flaticon-cardboard-box"></i></div>
                          <div class="icon-content"><h3 class="dz-title">Premium Finish Quality</h3></div>
                        </div>
                      </div>
                      <div class="col-xl-3 col-md-6 col-sm-12">
                        <div class="icon-bx-wraper style-6 m-b15 border-0">
                          <div class="icon-bx"><i class="flaticon flaticon-delivery-status"></i></div>
                          <div class="icon-content"><h3 class="dz-title">Moisture Proof Product</h3></div>
                        </div>
                      </div>
                    </div>
                    <img src="/images/background/bg4.jpg" alt="">
                  </div>
                  <div id="information-tab-pane" class="tab-pane fade show" role="tabpanel">
                    <div class="detail-bx text-center"><h5 class="title">Additional Information</h5><p class="para-text">Lorem Ipsum is simply dummy text of the printing and typesetting industry.</p></div>
                  </div>
                  <div id="return-tab-pane" class="tab-pane fade show" role="tabpanel">
                    <div class="detail-bx text-center"><h5 class="title">Shipping Policy</h5><p class="para-text">Lorem Ipsum is simply dummy text of the printing and typesetting industry.</p></div>
                  </div>
                  <div id="profile-tab-pane" class="tab-pane fade" role="tabpanel">
                    <div class="post-comments comments-area style-1 clearfix"><h4 class="comments-title mb-2">Comments (02)</h4></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section class="content-inner-1 overflow-hidden">
          <div class="container">
            <div class="section-head style-5 d-md-flex align-items-center justify-content-between">
              <div class="left-content"><h2 class="title mb-0">Related products</h2></div>
              <a href="/shop-list" class="text-secondary font-14 d-flex align-items-center gap-1">See all products <i class="icon feather icon-chevron-right font-18"></i></a>
            </div>
            <div class="swiper-btn-center-lr">
              <div class="swiper swiper-four">
                <div class="swiper-wrapper">
                  <div v-for="(item, idx) in relatedProducts" :key="`related-${idx}`" class="swiper-slide">
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
                      <div class="dz-content"><h2 class="title"><a href="/shop-list">{{ item.title }}</a></h2><span class="price">{{ item.price }}<del>{{ item.old }}</del></span></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <!-- Newsletter -->
        <section class="content-inner-3 overflow-hidden position-relative border-top">
          <div class="container">
            <div class="row align-items-center">
              <div class="col-lg-6 col-md-12">
                <div class="section-head style-2 d-block wow fadeInUp" data-wow-delay="0.2s">
                  <h2 class="title mb-4">Subscribe Newsletter & Get Fashion News</h2>
                </div>
              </div>
              <div class="col-lg-6 col-md-12 m-b30 wow fadeInUp" data-wow-delay="0.4s">
                <form class="dzSubscribe style-2">
                  <div class="dzSubscribeMsg"></div>
                  <div class="form-group">
                    <div class="input-group mb-0">
                      <input name="dzEmail" required type="email" class="form-control h-70" placeholder="Your Email Address" />
                      <div class="sub-btn">
                        <button name="submit" value="Submit" type="submit" class="btn btn-secondary">Subscribe Now</button>
                      </div>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </section>
      </div>

      <SiteFooterNuxt :footer-social-posts="footerSocialPosts" />

      <div class="modal quick-view-modal fade" id="exampleModal" tabindex="-1" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered">
          <div class="modal-content">
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close">
              <i class="icon feather icon-x"></i>
            </button>
            <div class="modal-body">
              <div class="row g-xl-4 g-3">
                <div class="col-xl-6 col-md-6">
                  <div class="dz-product-detail mb-0">
                    <div class="dz-media"><img src="/images/adv-3.png" alt="image"></div>
                  </div>
                </div>
                <div class="col-xl-6 col-md-6">
                  <div class="dz-product-detail style-4 p-t50">
                    <div class="dz-content">
                      <h4 class="title mb-1"><a href="/shop-list">Premium Maxi Dress (m)</a></h4>
                      <p class="para-text">Lorem Ipsum is simply dummy text of the printing and typesetting industry.</p>
                      <div class="btn-group cart-btn">
                        <NuxtLink to="/shop-cart" class="btn btn-secondary text-uppercase">Add To Cart</NuxtLink>
                        <NuxtLink to="/shop-wishlist" class="btn btn-outline-secondary btn-icon">Add To Wishlist</NuxtLink>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
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









