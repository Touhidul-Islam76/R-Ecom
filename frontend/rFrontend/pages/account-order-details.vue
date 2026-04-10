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
    { rel: 'canonical', href: 'https://fasionable.dexignzone.com/xhtml/account-order-details.html' },
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
                  <li class="breadcrumb-item">Account Dashboard</li>
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
                <div class="account-card order-details">
                  <div class="order-head">
                    <div class="head-thumb">
                      <img src="/images/shop/small/pic1.png" alt="" />
                    </div>
                    <div class="clearfix m-l20">
                      <div class="badge">In Progress</div>
                      <h4 class="mb-0">Order #17493</h4>
                    </div>
                  </div>
                  <div class="row mb-sm-4 mb-2">
                    <div class="col-sm-6">
                      <div class="shiping-tracker-detail">
                        <span>Item</span>
                        <h6 class="title">casual shirt</h6>
                      </div>
                    </div>
                    <div class="col-sm-6">
                      <div class="shiping-tracker-detail">
                        <span>Courier</span>
                        <h6 class="title">casual shirt</h6>
                      </div>
                    </div>
                    <div class="col-sm-6">
                      <div class="shiping-tracker-detail">
                        <span>Start Time</span>
                        <h6 class="title">05 April 2024, 15:43:23</h6>
                      </div>
                    </div>
                    <div class="col-sm-6">
                      <div class="shiping-tracker-detail">
                        <span>Address</span>
                        <h6 class="title">Address 451 Wall Street UK, London</h6>
                      </div>
                    </div>
                  </div>
                  <div class="content-btn m-b15">
                    <a href="/shop-wishlist" class="btn btn-secondary me-xl-3 me-2 m-b15 btnhover20">Export Details</a>
                    <a href="/product-default" class="btn btn-outline-secondary m-b15 me-xl-3 me-2 btnhover20">Request Confirmation</a>
                    <a href="/account-cancellation-requests" class="btn btn-outline-danger m-b15 btnhover20">Cancel Order</a>
                  </div>
                  <div class="clearfix">
                    <div class="dz-tabs style-3">
                      <div class="nav nav-tabs" id="nav-tab" role="tablist">
                        <button class="nav-link active" id="nav-order-history-tab" data-bs-toggle="tab" data-bs-target="#nav-order-history" role="tab" aria-controls="nav-order-history" aria-selected="true">Order History</button>
                        <button class="nav-link" id="nav-Item-tab" data-bs-toggle="tab" data-bs-target="#nav-Item" role="tab" aria-controls="nav-Item" aria-selected="false">Item Details</button>
                        <button class="nav-link" id="nav-courier-tab" data-bs-toggle="tab" data-bs-target="#nav-courier" role="tab" aria-controls="nav-courier" aria-selected="false">Courier</button>
                        <button class="nav-link" id="nav-receiver-tab" data-bs-toggle="tab" data-bs-target="#nav-receiver" role="tab" aria-controls="nav-receiver" aria-selected="false">Receiver</button>
                      </div>
                    </div>
                    <div class="tab-content" id="nav-tabContent">
                      <div class="tab-pane fade show active" id="nav-order-history" role="tabpanel" aria-labelledby="nav-order-history-tab" tabindex="0">
                        <div class="widget-timeline style-1">
                          <ul class="timeline">
                            <li>
                              <div class="timeline-badge success"></div>
                              <div class="timeline-box">
                                <a class="timeline-panel" href="javascript:void(0);">
                                  <h6 class="mb-0">Product Shiped</h6>
                                  <span>08/04/2024 5:23pm</span>
                                </a>
                                <p><strong>Courier Service : </strong>UPS, R. Gosling</p>
                                <p><strong>Estimated Delivery Date : </strong>09/04/2024</p>
                              </div>
                            </li>
                            <li>
                              <div class="timeline-badge primary"></div>
                              <div class="timeline-box">
                                <a class="timeline-panel" href="javascript:void(0);">
                                  <h6 class="mb-0">Product Shiped</h6>
                                  <span>08/04/2024 5:23pm</span>
                                </a>
                                <p><strong>Tracking Number : </strong>3409-4216-8759</p>
                                <p><strong>Warehouse : </strong>Top Shirt 12b</p>
                              </div>
                            </li>
                            <li>
                              <div class="timeline-badge"></div>
                              <div class="timeline-box">
                                <a class="timeline-panel" href="javascript:void(0);">
                                  <h6 class="mb-0">Product Packaging</h6>
                                  <span>09/04/2024 4:34pm</span>
                                </a>
                              </div>
                            </li>
                            <li>
                              <div class="timeline-badge"></div>
                              <div class="timeline-box">
                                <a class="timeline-panel" href="javascript:void(0);">
                                  <h6 class="mb-0">Order Palced</h6>
                                  <span>10/04/2024 2:36pm</span>
                                </a>
                              </div>
                            </li>
                          </ul>
                        </div>
                      </div>
                      <div class="tab-pane fade" id="nav-Item" role="tabpanel" aria-labelledby="nav-Item-tab" tabindex="0">
                        <h5>Item Details</h5>
                        <div class="tracking-item">
                          <div class="tracking-product"><img src="/images/shop/small/pic1.png" alt="" /></div>
                          <div class="tracking-product-content">
                            <h6 class="title">Collar Casual Shirt</h6>
                            <small class="d-block"><strong>Price</strong> : $150</small>
                            <small class="d-block"><strong>Size</strong> : Xl</small>
                          </div>
                        </div>
                        <div class="tracking-item-content">
                          <span>Total Price</span>
                          <h6>+ $150</h6>
                        </div>
                        <div class="tracking-item-content border-bottom border-light mb-2">
                          <span class="text-success">Total Discounts</span>
                          <h6>- $55</h6>
                        </div>
                        <div class="tracking-item-content">
                          <span>Order Total</span>
                          <h6>$95</h6>
                        </div>
                      </div>
                      <div class="tab-pane fade" id="nav-courier" role="tabpanel" aria-labelledby="nav-courier-tab" tabindex="0">
                        <p>Commyolk Suspendisse et justo. Praesent mattis augue Aliquam ornare hendrerit augue Cras tellus In pulvinar lectus a est Curabitur eget orci Cras laoreet. Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Suspendisse et justo. Praesent mattis commyolk augue aliquam ornare.</p>
                      </div>
                      <div class="tab-pane fade" id="nav-receiver" role="tabpanel" aria-labelledby="nav-receiver-tab" tabindex="0">
                        <h5 class="text-success mb-4">Thank you Your order has been received</h5>
                        <ul class="tracking-receiver">
                          <li>Order Number : <strong>#17493</strong></li>
                          <li>Date : <strong>17/04/2024, 02:34pm</strong></li>
                          <li>Total : <strong>$95</strong></li>
                          <li>Payment Methods : <strong>Cash on Delivery</strong></li>
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

      
    </div>
</template>

