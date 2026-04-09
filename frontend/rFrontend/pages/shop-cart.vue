<script setup lang="ts">
import { ref, onBeforeUnmount, onMounted } from 'vue'

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
    { rel: 'canonical', href: 'https://fasionable.dexignzone.com/xhtml/shop-cart.html' },
    { rel: 'icon', type: 'image/x-icon', href: '/images/20.jpg.jpeg' },
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
  if (!loader) return

  showTimer = setTimeout(() => {
    loader.classList.add('show')
  }, 500)

  activeTimer = setTimeout(() => {
    loader.classList.add('active')
  }, 1500)

  hideTimer = setTimeout(() => {
    showLoader.value = false
  }, 3500)
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

const cartTableItems = [
  { image: '/images/shop/shop-cart/pic1.jpg', name: 'Indoor Oasis Lush Ble...', price: '$40.00', qtyId: 'qty-1', subtotal: '$160.00' },
  { image: '/images/shop/shop-cart/pic2.jpg', name: 'TallStalk Gardens Ble...', price: '$56.00', qtyId: 'qty-2', subtotal: '$120.00' },
  { image: '/images/shop/shop-cart/pic3.jpg', name: 'Rosa genus & the species...', price: '$30.00', qtyId: 'qty-3', subtotal: '$40.00' },
  { image: '/images/shop/shop-cart/pic4.jpg', name: 'Stretching Vine Nursery...', price: '$42.00', qtyId: 'qty-4', subtotal: '$160.00' },
  { image: '/images/shop/shop-cart/pic5.jpg', name: 'Extended Roots Gardens...', price: '$28.00', qtyId: 'qty-5', subtotal: '$45.00' },
  { image: '/images/shop/shop-cart/pic6.jpg', name: 'Streetwear Edit...', price: '$120.00', qtyId: 'qty-6', subtotal: '$40.00' },
]

const footerSocialPosts = [1, 2, 3, 4, 5, 6]
</script>

<template>
  <div id="bg">
    <div class="page-wraper">
      <PageLoader :show-loader="showLoader" />

      <SiteHeaderMobileNuxt :popular-products="popularProducts" :sidebar-cart-items="sidebarCartItems" :wishlist-items="wishlistItems" />

      <div class="page-content">
        <!-- Banner -->
        <div class="dz-bnr-inr" style="background-image:url(/images/background/bg1.jpg);">
          <div class="container">
            <div class="dz-bnr-inr-entry">
              <nav aria-label="breadcrumb" class="breadcrumb-row">
                <ul class="breadcrumb">
                  <li class="breadcrumb-item"><NuxtLink to="/">Home</NuxtLink></li>
                  <li class="breadcrumb-item">Shop Cart</li>
                </ul>
              </nav>
            </div>
          </div>
        </div>

        <!-- Cart Section -->
        <section class="content-inner shop-account">
          <div class="container">
            <div class="row">
              <div class="col-lg-8">
                <div class="table-responsive">
                  <table class="table check-tbl">
                    <thead>
                      <tr>
                        <th></th>
                        <th></th>
                        <th>Product</th>
                        <th>Price</th>
                        <th>Quantity</th>
                        <th>Subtotal</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="item in cartTableItems" :key="item.qtyId">
                        <td class="product-item-close">
                          <a href="javascript:void(0);"><i class="ti-close"></i></a>
                        </td>
                        <td class="product-item-img"><img :src="item.image" alt="/" /></td>
                        <td class="product-item-name">{{ item.name }}</td>
                        <td class="product-item-price">{{ item.price }}</td>
                        <td class="product-item-quantity">
                          <div class="quantity btn-quantity style-1">
                            <input :id="item.qtyId" type="text" value="1" name="demo_vertical2" />
                          </div>
                        </td>
                        <td class="product-item-totle">{{ item.subtotal }}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div class="row shop-form m-t30 align-items-center">
                  <div class="col-xl-6 col-lg-12 col-sm-12 m-b30 m-xl-0">
                    <div class="custom-control custom-checkbox d-flex align-items-center">
                      <input type="checkbox" class="form-check-input" id="basic_checkbox_01" />
                      <label class="form-check-label text-secondary" for="basic_checkbox_01">
                        Gift Wrap Your Purchase For Just Rs.500.00
                      </label>
                    </div>
                  </div>
                  <div class="col-xl-6 col-lg-12 text-start text-xl-end col-sm-12 d-flex align-items-center justify-content-center gap-2">
                    <a href="/shop-cart" class="btn btn-outline-secondary">Restore To Store</a>
                    <a href="/shop-cart" class="btn btn-secondary">Empty Cart</a>
                  </div>
                  <div class="col-md-12 m-tb40">
                    <div class="form-group">
                      <label class="label-title">Order Special Instructions</label>
                      <textarea
                        id="comments"
                        placeholder="Write Your instructions..."
                        class="form-control"
                        name="comment"
                        cols="90"
                        rows="8"
                        required
                      ></textarea>
                    </div>
                  </div>
                </div>
              </div>

              <div class="col-lg-4">
                <div class="cart-detail">
                  <a href="javascript:void(0);" class="btn btn-outline-secondary w-100 m-b20 btn-lg">Bank Offer 5% Cashback</a>
                  <div class="icon-bx-wraper style-4 m-b15">
                    <div class="icon-bx">
                      <i class="flaticon flaticon-ship"></i>
                    </div>
                    <div class="icon-content">
                      <span class="font-13">Free</span>
                      <h6 class="dz-title">Shipping</h6>
                    </div>
                  </div>
                  <div class="icon-bx-wraper style-4 m-b30">
                    <div class="icon-bx">
                      <img src="/images/shop/shop-cart/icon-box/pic2.png" alt="/" />
                    </div>
                    <div class="icon-content">
                      <h6 class="dz-title">Enjoy The Product</h6>
                      <p>Lorem Ipsum is simply dummy text of the printing</p>
                    </div>
                  </div>
                  <div class="save-text">
                    <i class="icon feather icon-check-circle"></i>
                    <span class="m-l10">You will save <span>Rs.504</span> on this order</span>
                  </div>
                  <table>
                    <tbody>
                      <tr class="total">
                        <td><h6 class="mb-0">Total Amount</h6></td>
                        <td class="price">$125.75</td>
                      </tr>
                    </tbody>
                  </table>
                  <a href="/shop-checkout" class="btn btn-outline-secondary w-100 btn-lg">PLACE ORDER</a>
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









