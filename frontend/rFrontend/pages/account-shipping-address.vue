<script setup lang="ts">
import { onMounted, nextTick } from 'vue'
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
    { rel: 'canonical', href: 'https://fasionable.dexignzone.com/xhtml/account-shipping-address.html' },
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

onMounted(() => {

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

</script>

<template>
  <div class="page-wraper">
      

      
      <div class="page-content">

        <!--Banner Start-->
        <div class="dz-bnr-inr" style="background-image:url('/images/background/bg1.jpg');">
          <div class="container">
            <div class="dz-bnr-inr-entry">
              <nav aria-label="breadcrumb" class="breadcrumb-row">
                <ul class="breadcrumb">
                  <li class="breadcrumb-item"><a href="/"> Home</a></li>
                  <li class="breadcrumb-item">Account Shipping Address</li>
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
                    <h3 class="m-b30">Shipping address</h3>
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
                        <select class="form-select default-select w-100">
                          <option selected>Kota</option>
                          <option value="1">Another option</option>
                          <option value="2">Jaipur</option>
                          <option value="3">Udaipur</option>
                        </select>
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
                        <label class="label-title">pincode*</label>
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

      
    </div>
</template>

