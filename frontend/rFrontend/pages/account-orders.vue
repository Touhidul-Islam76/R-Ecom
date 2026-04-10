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
    { rel: 'canonical', href: 'https://fasionable.dexignzone.com/xhtml/account-order.html' },
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
                  <li class="breadcrumb-item">Account Orders</li>
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

              <div class="col-xl-9 account-wrapper">
                <div class="account-card">
                  <div class="table-responsive table-style-1">
                    <table class="table table-hover mb-3">
                      <thead>
                        <tr>
                          <th>Order #</th>
                          <th>Date Purchased</th>
                          <th>Status</th>
                          <th>Total</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td><a href="/account-order-details" class="fw-medium">#34VB5540K83</a></td>
                          <td>May 21, 2024</td>
                          <td>$358.75</td>
                          <td><span class="badge bg-info m-0">In Progress</span></td>
                          <td><a href="/account-order-details" class="btn-link text-underline p-0">View</a></td>
                        </tr>
                        <tr>
                          <td><a href="/account-order-details" class="fw-medium">#78A643CD409</a></td>
                          <td>December 09, 2024</td>
                          <td><span>$760.50</span></td>
                          <td><span class="badge bg-danger m-0">Canceled</span></td>
                          <td><a href="/account-order-details" class="btn-link text-underline p-0">View</a></td>
                        </tr>
                        <tr>
                          <td><a href="javascript:void(0);" class="fw-medium">#112P45A90V2</a></td>
                          <td>October 15, 2024</td>
                          <td>$1,264.00</td>
                          <td><span class="badge bg-warning m-0">Delayed</span></td>
                          <td><a href="/account-order-details" class="btn-link text-underline p-0">View</a></td>
                        </tr>
                        <tr>
                          <td><a href="/account-order-details" class="fw-medium">#28BA67U0981</a></td>
                          <td>July 19, 2024</td>
                          <td>$198.35</td>
                          <td><span class="badge bg-success m-0">Delivered</span></td>
                          <td><a href="/account-order-details" class="btn-link text-underline p-0">View</a></td>
                        </tr>
                        <tr>
                          <td><a href="/account-order-details" class="fw-medium">#502TR872W2</a></td>
                          <td>April 04, 2024</td>
                          <td>$2,133.90</td>
                          <td><span class="badge bg-success m-0">Delivered</span></td>
                          <td><a href="/account-order-details" class="btn-link text-underline p-0">View</a></td>
                        </tr>
                        <tr>
                          <td><a href="/account-order-details" class="fw-medium">#47H76G09F33</a></td>
                          <td>March 30, 2024</td>
                          <td>$86.40</td>
                          <td><span class="badge bg-success m-0">Delivered</span></td>
                          <td><a href="/account-order-details" class="btn-link text-underline p-0">View</a></td>
                        </tr>
                        <tr>
                          <td><a href="/account-order-details" class="fw-medium">#53U76G09E38</a></td>
                          <td>April 21, 2024</td>
                          <td>$86.40</td>
                          <td><span class="badge bg-success m-0">Delivered</span></td>
                          <td><a href="/account-order-details" class="btn-link text-underline p-0">View</a></td>
                        </tr>
                        <tr>
                          <td><a href="/account-order-details" class="fw-medium">#31M76G09G76</a></td>
                          <td>May 07, 2024</td>
                          <td>$112.40</td>
                          <td><span class="badge bg-success m-0">Delivered</span></td>
                          <td><a href="/account-order-details" class="btn-link text-underline p-0">View</a></td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  <div class="d-flex justify-content-center">
                    <nav aria-label="Table Pagination">
                      <ul class="pagination style-1">
                        <li class="page-item"><a class="page-link" href="javascript:void(0);">Prew</a></li>
                        <li class="page-item"><a class="page-link" href="javascript:void(0);">1</a></li>
                        <li class="page-item"><a class="page-link" href="javascript:void(0);">2</a></li>
                        <li class="page-item"><a class="page-link" href="javascript:void(0);">3</a></li>
                        <li class="page-item"><a class="page-link" href="javascript:void(0);">Next</a></li>
                      </ul>
                    </nav>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      
    </div>
</template>

