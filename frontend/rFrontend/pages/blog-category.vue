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
    { rel: 'canonical', href: 'https://fasionable.dexignzone.com/xhtml/blog-category.html' },
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
  <div id="bg">
    <div class="page-wraper">
      <PageLoader :show-loader="showLoader" />

      <SiteHeaderMobile :popular-products="popularProducts" :sidebar-cart-items="sidebarCartItems" :wishlist-items="wishlistItems" />

            <div class="page-content">
        <!--Banner Start-->
        <div class="dz-bnr-inr" style="background-image: url('/images/background/bg1.jpg');">
          <div class="container">
            <div class="dz-bnr-inr-entry">
              <nav aria-label="breadcrumb" class="breadcrumb-row">
                <ul class="breadcrumb">
                  <li class="breadcrumb-item"><a href="/">Home</a></li>
                  <li class="breadcrumb-item">Blog Category</li>
                </ul>
              </nav>
            </div>
          </div>
        </div>
        <!--Banner End-->

        <section class="content-inner z-index-unset">
          <div class="container">
            <div class="row">
              <div class="col-xl-8 col-lg-8">
                <div class="row justify-content-center">
                  <div class="col-lg-12 col-md-12 wow fadeInUp" data-wow-delay="0.1s">
                    <div class="search-info m-b50">
                      <div class="title m-b10">
                        <p class="search-name">Category:</p><h2 class="search-result">Fashion</h2>
                      </div>
                      <p class="found-posts m-b0">Found 6 Posts</p>
                    </div>
                  </div>
                  <div class="col-lg-12 col-md-6 col-sm-6 m-lg-b30 m-b50 wow fadeInUp" data-wow-delay="0.2s">
                    <div class="dz-card blog-half style-5">
                      <div class="dz-media">
                        <img src="/images/blog/blogpost-4/pic1.jpg" alt="/" />
                      </div>
                      <div class="dz-info">
                        <div class="dz-meta">
                          <ul>
                            <li class="post-date">27 Mar 2023</li>
                          </ul>
                        </div>
                        <h2 class="dz-title">
                          <a href="/post-header-image">Essential Fashion Care Tips for Beginners</a>
                        </h2>
                        <a href="/post-header-image" class="font-14 read-btn">Read More
                          <i class="icon feather icon-chevron-right"></i>
                        </a>
                      </div>
                    </div>
                  </div>
                  <div class="col-lg-12 col-md-6 col-sm-6 m-lg-b30 m-b50 wow fadeInUp" data-wow-delay="0.3s">
                    <div class="dz-card blog-half style-5">
                      <div class="dz-media">
                        <img src="/images/blog/blogpost-4/pic2.jpg" alt="/" />
                      </div>
                      <div class="dz-info">
                        <div class="dz-meta">
                          <ul>
                            <li class="post-date">17 May 2023</li>
                          </ul>
                        </div>
                        <h2 class="dz-title">
                          <a href="/post-header-image">Keeping Your Indoor Garden Thriving</a>
                        </h2>
                        <a href="/post-header-image" class="font-14 read-btn">Read More
                          <i class="icon feather icon-chevron-right"></i>
                        </a>
                      </div>
                    </div>
                  </div>
                  <div class="col-lg-12 col-md-6 col-sm-6 m-lg-b30 m-b50 wow fadeInUp" data-wow-delay="0.4s">
                    <div class="dz-card blog-half style-5">
                      <div class="dz-media">
                        <img src="/images/blog/blogpost-4/pic3.jpg" alt="/" />
                      </div>
                      <div class="dz-info">
                        <div class="dz-meta">
                          <ul>
                            <li class="post-date">10 Dec 2023</li>
                          </ul>
                        </div>
                        <h2 class="dz-title">
                          <a href="/post-header-image">Nurturing Your Dresses with Expert Care</a>
                        </h2>
                        <a href="/post-header-image" class="font-14 read-btn">Read More
                          <i class="icon feather icon-chevron-right"></i>
                        </a>
                      </div>
                    </div>
                  </div>
                  <div class="col-lg-12 col-md-6 col-sm-6 m-lg-b30 m-b50 wow fadeInUp" data-wow-delay="0.5s">
                    <div class="dz-card blog-half style-5">
                      <div class="dz-media">
                        <img src="/images/blog/blogpost-4/pic4.jpg" alt="/" />
                      </div>
                      <div class="dz-info">
                        <div class="dz-meta">
                          <ul>
                            <li class="post-date">25 Jan 2023</li>
                          </ul>
                        </div>
                        <h2 class="dz-title">
                          <a href="/post-header-image">the Basics for Healthy and Happy Dresses</a>
                        </h2>
                        <a href="/post-header-image" class="font-14 read-btn">Read More
                          <i class="icon feather icon-chevron-right"></i>
                        </a>
                      </div>
                    </div>
                  </div>
                  <div class="col-lg-12 col-md-6 col-sm-6 m-lg-b30 m-b50 wow fadeInUp" data-wow-delay="0.6s">
                    <div class="dz-card blog-half style-5">
                      <div class="dz-media">
                        <img src="/images/blog/blogpost-4/pic5.jpg" alt="/" />
                      </div>
                      <div class="dz-info">
                        <div class="dz-meta">
                          <ul>
                            <li class="post-date">15 May 2023</li>
                          </ul>
                        </div>
                        <h2 class="dz-title">
                          <a href="/post-header-image">The Zen of Fashion Care through Gardening</a>
                        </h2>
                        <a href="/post-header-image" class="font-14 read-btn">Read More
                          <i class="icon feather icon-chevron-right"></i>
                        </a>
                      </div>
                    </div>
                  </div>
                  <div class="col-lg-12 col-md-6 col-sm-6 m-lg-b30 m-b50 wow fadeInUp" data-wow-delay="0.7s">
                    <div class="dz-card blog-half style-5">
                      <div class="dz-media">
                        <img src="/images/blog/blogpost-4/pic6.jpg" alt="/" />
                      </div>
                      <div class="dz-info">
                        <div class="dz-meta">
                          <ul>
                            <li class="post-date">30 Oct 2023</li>
                          </ul>
                        </div>
                        <h2 class="dz-title">
                          <a href="/post-header-image">Fashion Care Practices for Eco-Conscious</a>
                        </h2>
                        <a href="/post-header-image" class="font-14 read-btn">Read More
                          <i class="icon feather icon-chevron-right"></i>
                        </a>
                      </div>
                    </div>
                  </div>
                  <div class="col-12 text-center mt-sm-4 mb-sm-4 wow fadeInUp" data-wow-delay="0.8s">
                    <a href="/blog-category" class="btn btn-secondary">Loadmore</a>
                  </div>
                </div>
              </div>

              <div class="col-xl-4 col-lg-4">
                <aside class="side-bar sticky-top mt-lg-0 mt-md-5 mt-3">
                  <div class="widget">
                    <h3 class="widget-title">Search</h3>
                    <div class="search-bx">
                      <form role="search" method="post">
                        <div class="input-group">
                          <input name="text" class="form-control" placeholder="Search Here" type="text" />
                          <span class="input-group-btn">
                            <button class="btn">
                              <i class="icon feather icon-search"></i>
                            </button>
                          </span>
                        </div>
                      </form>
                    </div>
                  </div>
                  <div class="widget widget_categories style-1">
                    <h3 class="widget-title">Product Category</h3>
                    <ul>
                      <li class="cat-item"><a href="/blog-category">Bonsai</a> (10)</li>
                      <li class="cat-item"><a href="/blog-category">Daily Wear</a> (5)</li>
                      <li class="cat-item"><a href="/blog-category">indoor Living</a> (17)</li>
                      <li class="cat-item"><a href="/blog-category">Perennials</a> (13)</li>
                      <li class="cat-item"><a href="/blog-category">Fashion For Gift</a> (06)</li>
                      <li class="cat-item"><a href="/blog-category">garden Tools</a> (17)</li>
                      <li class="cat-item"><a href="/blog-category">Best Sellers</a> (13)</li>
                      <li class="cat-item"><a href="/blog-category">Blossom Haven</a> (06)</li>
                      <li class="cat-item"><a href="/blog-category">Casual Wear</a> (22)</li>
                    </ul>
                  </div>
                  <div class="widget recent-posts-entry">
                    <h3 class="widget-title">Featured Products</h3>
                    <div class="widget-post-bx">
                      <div class="widget-post clearfix">
                        <div class="dz-media">
                          <a href="/post-standard"><img src="/images/blog/recent-blog/pic1.jpg" alt="/" /></a>
                        </div>
                        <div class="dz-info">
                          <h6 class="title"><a href="/post-standard">Classic Denim Set (m)</a></h6>
                          <span class="price">$659 <del>$1299</del></span>
                        </div>
                      </div>
                      <div class="widget-post clearfix">
                        <div class="dz-media">
                          <a href="/post-standard"><img src="/images/blog/recent-blog/pic2.jpg" alt="/" /></a>
                        </div>
                        <div class="dz-info">
                          <h6 class="title"><a href="/post-standard">Runway Reach Dress (m)</a></h6>
                          <span class="price">$700 <del>$1449</del></span>
                        </div>
                      </div>
                      <div class="widget-post clearfix">
                        <div class="dz-media">
                          <a href="/post-standard"><img src="/images/blog/recent-blog/pic3.jpg" alt="/" /></a>
                        </div>
                        <div class="dz-info">
                          <h6 class="title"><a href="/post-standard">Longline Fashion Dress (m)</a></h6>
                          <span class="price">$449 <del>$999</del></span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="widget widget_tag_cloud">
                    <h3 class="widget-title">Tags</h3>
                    <div class="tagcloud">
                      <a href="/blog-tag">fashion </a>
                      <a href="/blog-tag">Green Dreams</a>
                      <a href="/blog-tag">Seeds</a>
                      <a href="/blog-tag">Photo</a>
                      <a href="/blog-tag">capes</a>
                      <a href="/blog-tag">Urban Oasis</a>
                      <a href="/blog-tag">Fern Fantasy</a>
                      <a href="/blog-tag">Fashion Paradise</a>
                    </div>
                  </div>
                </aside>
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

      <SiteFooterStandard :footer-social-posts="footerSocialPosts" />

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
















