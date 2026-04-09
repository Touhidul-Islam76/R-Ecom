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
    { rel: 'canonical', href: 'https://fasionable.dexignzone.com/xhtml/account-profile.html' },
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

const avatarPreview = ref('/images/profile3.jpg')

const handleImageUpload = (event: Event) => {
  const input = event.target as HTMLInputElement | null
  const file = input?.files?.[0]
  if (!file) return

  const reader = new FileReader()
  reader.onload = (e) => {
    const result = e.target?.result
    if (typeof result === 'string') {
      avatarPreview.value = result
    }
  }
  reader.readAsDataURL(file)
}
</script>

<template>
  <div class="page-wraper">
      <PageLoader :show-loader="showLoader" />

      <SiteHeaderStandard :popular-products="popularProducts" :sidebar-cart-items="sidebarCartItems" :wishlist-items="wishlistItems" />
      <div class="page-content">

        <!--Banner Start-->
        <div class="dz-bnr-inr" style="background-image:url('/images/background/bg1.jpg');">
          <div class="container">
            <div class="dz-bnr-inr-entry">
              <nav aria-label="breadcrumb" class="breadcrumb-row">
                <ul class="breadcrumb">
                  <li class="breadcrumb-item"><a href="/"> Home</a></li>
                  <li class="breadcrumb-item">Account Profile</li>
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
                  <div class="profile-edit">
                    <div class="avatar-upload d-flex align-items-center">
                      <div class="position-relative">
                        <div class="avatar-preview thumb">
                          <div id="imagePreview" :style="{ backgroundImage: `url(${avatarPreview})` }"></div>
                        </div>
                        <div class="change-btn thumb-edit d-flex align-items-center flex-wrap">
                          <input id="imageUpload" type="file" class="form-control d-none" accept=".png, .jpg, .jpeg" @change="handleImageUpload" />
                          <label for="imageUpload" class="btn btn-light ms-0"><i class="fa-solid fa-camera"></i></label>
                        </div>
                      </div>
                    </div>
                    <div class="clearfix">
                      <h2 class="title mb-0">John Doe</h2>
                      <span class="text text-primary">johndoe@example.com</span>
                    </div>
                  </div>
                  <form action="#" class="row" @submit.prevent>
                    <div class="col-lg-6">
                      <div class="form-group m-b25">
                        <label class="label-title">First Name</label>
                        <input name="dzName" required="" class="form-control" />
                      </div>
                    </div>
                    <div class="col-lg-6">
                      <div class="form-group m-b25">
                        <label class="label-title">Last Name</label>
                        <input name="dzName" required="" class="form-control" />
                      </div>
                    </div>
                    <div class="col-lg-6">
                      <div class="form-group m-b25">
                        <label class="label-title">Email address</label>
                        <input type="email" name="dzEmail" required="" class="form-control" />
                      </div>
                    </div>
                    <div class="col-lg-6">
                      <div class="form-group m-b25">
                        <label class="label-title">Phone</label>
                        <input type="email" name="dzPhone" required="" class="form-control" />
                      </div>
                    </div>
                    <div class="col-lg-6">
                      <div class="form-group m-b25">
                        <label class="label-title">New password (leave blank to leave unchanged)</label>
                        <input type="password" name="password" required="" class="form-control" />
                      </div>
                    </div>
                    <div class="col-lg-6">
                      <div class="form-group m-b25">
                        <label class="label-title">Confirm new password</label>
                        <input type="password" name="password" required="" class="form-control" />
                      </div>
                    </div>
                  </form>
                  <div class="d-flex flex-wrap justify-content-between align-items-center">
                    <div class="form-group">
                      <div class="custom-control custom-checkbox text-black">
                        <input type="checkbox" class="form-check-input" id="basic_checkbox_22" />
                        <label class="form-check-label" for="basic_checkbox_22">Subscribe me to Newsletter</label>
                      </div>
                    </div>
                    <button class="btn btn-primary mt-3 mt-sm-0" type="button">Update profile</button>
                  </div>
                </div>
              </section>
            </div>
          </div>
        </div>
      </div>


      <SiteFooterStandard :footer-social-posts="footerSocialPosts" />
    </div>
</template>











