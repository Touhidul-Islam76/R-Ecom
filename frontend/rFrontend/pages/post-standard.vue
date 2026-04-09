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
    { rel: 'canonical', href: 'https://fasionable.dexignzone.com/xhtml/post-left-sidebar.html' },
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
        <section class="content-inner-1 z-index-unset">
          <div class="container">
            <div class="row">
              <div class="col-xl-8 col-lg-8 order-lg-1 order-1">
                <div class="dz-blog blog-single style-1 sidebar">
                  <h1 class="dz-title">garden into a vibrant oasis with our expert garden care services</h1>
                  <div class="dz-meta">
                    <ul>
                      <li class="post-date">12 Jan 2024</li>
                      <li class="dz-user">
                        <i class="fa-solid fa-user"></i>
                        <a href="javascript:void(0);">By User</a>
                      </li>
                      <li class="dz-comment">
                        <i class="fa-solid fa-message"></i>
                        <a href="javascript:void(0);">24 Comments</a>
                      </li>
                    </ul>
                  </div>
                  <div class="dz-media rounded">
                    <img src="/images/blog/detail/pic1.jpg" alt="/" />
                  </div>
                  <div class="dz-info">
                    <div class="dz-post-text">
                      <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.</p>
                      <blockquote class="wp-block-quote is-style-default"><p>Create An Information Architecture That's Easy To Use Way Precise Usability Considerations For Partially </p><cite>Ronald M. Spino</cite><i class="flaticon-right-quote"></i></blockquote>
                      <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.</p>
                      <figure class="wp-container-5 wp-block-gallery-3 wp-block-gallery has-nested-images columns-3 is-cropped">
                        <figure class="wp-block-image size-large"><img src="/images/blog/blogpost-3/pic1.jpg" alt="/" /></figure>
                        <figure class="wp-block-image size-large"><img src="/images/blog/blogpost-3/pic2.jpg" alt="/" /></figure>
                        <figure class="wp-block-image size-large"><img src="/images/blog/blogpost-3/pic3.jpg" alt="/" /></figure>
                        <figure class="wp-block-image size-large"><img src="/images/blog/blogpost-3/pic4.jpg" alt="/" /></figure>
                        <figure class="wp-block-image size-large"><img src="/images/blog/blogpost-3/pic1.jpg" alt="/" /></figure>
                      </figure>
                      <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.</p>

                      <h3 class="dz-title">Additional information</h3>
                      <p>It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.</p>

                      <ul class="list-check-2 check-circle">
                        <li>Explore Our Colorful Blooms</li>
                        <li>Dresses for Cool Corners</li>
                        <li>Discover Low-Maintenance Beauties</li>
                        <li>Crafting a Legacy of Love and Care</li>
                        <li>Embrace the Beauty of Leaves</li>
                        <li>Aromatic Dresses for Your Garden</li>
                      </ul>

                      <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged.</p>
                    </div>
                    <div class="dz-share-post meta-bottom">
                      <div class="post-tags">
                        <strong>Tags:</strong>
                        <a href="javascript:void(0);">Casual Wear</a>
                        <a href="javascript:void(0);">Cactus Corner</a>
                        <a href="javascript:void(0);">Daily Wear</a>
                        <a href="javascript:void(0);">Fashion Paradise</a>
                        <a href="javascript:void(0);">Fern Fantasy</a>
                      </div>
                      <div class="dz-social-icon primary-light">
                        <ul>
                          <li>
                            <a href="https://www.facebook.com/dexignzone">
                              <i class="fab fa-facebook-f"></i>
                            </a>
                          </li>
                          <li>
                            <a href="https://www.instagram.com/dexignzone/">
                              <i class="fab fa-instagram"></i>
                            </a>
                          </li>
                          <li>
                            <a href="https://twitter.com/dexignzones">
                              <i class="fab fa-twitter"></i>
                            </a>
                          </li>
                          <li>
                            <a href="https://www.linkedin.com/showcase/3686700/admin/">
                              <i class="fa-brands fa-linkedin-in"></i>
                            </a>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>

                <div class="row">
                  <h3 class="left-title">Latest Cosmetic News</h3>
                  <div class="col-xl-6 col-lg-6 col-md-6 col-sm-12">
                    <div class="dz-card style-5 light">
                      <div class="dz-media">
                        <img src="/images/blog/blogpost-5/pic1.jpg" alt="/" />
                      </div>
                      <div class="dz-info">
                        <div class="dz-meta">
                          <ul>
                            <li class="post-date">20 Apr 2023</li>
                          </ul>
                        </div>
                        <h2 class="dz-title">
                          <a href="/blog-right-sidebar">Essential Fashion Care Tips for Beginners</a>
                        </h2>
                        <a href="/blog-right-sidebar" class="font-14 read-btn">Read More
                          <i class="icon feather icon-chevron-right"></i>
                        </a>
                      </div>
                    </div>
                  </div>

                  <div class="col-xl-6 col-lg-6 col-md-6 col-sm-12">
                    <div class="dz-card style-5 light">
                      <div class="dz-media">
                        <img src="/images/blog/blogpost-5/pic2.jpg" alt="/" />
                      </div>
                      <div class="dz-info">
                        <div class="dz-meta">
                          <ul>
                            <li class="post-date">20 Apr 2023</li>
                          </ul>
                        </div>
                        <h2 class="dz-title">
                          <a href="/blog-right-sidebar">Essential Fashion Care Tips for Beginners</a>
                        </h2>
                        <a href="/blog-right-sidebar" class="font-14 read-btn">Read More
                          <i class="icon feather icon-chevron-right"></i>
                        </a>
                      </div>
                    </div>
                  </div>
                </div>

                <div class="clear" id="comment-list">
                  <div class="post-comments comments-area style-1 clearfix">
                    <h4 class="comments-title mb-2">Comments (02)</h4>
                    <p class="dz-title-text">There are many variations of passages of Lorem Ipsum available.</p>
                    <div id="comment">
                      <ol class="comment-list">
                        <li class="comment even thread-even depth-1 comment" id="comment-2">
                          <div class="comment-body">
                            <div class="comment-author vcard">
                              <img src="/images/profile4.jpg" alt="/" class="avatar" />
                              <cite class="fn">Michel Poe</cite>
                            </div>
                            <div class="comment-content dz-page-text">
                              <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.</p>
                            </div>
                            <div class="reply">
                              <a rel="nofollow" class="comment-reply-link" href="javascript:void(0);">Reply</a>
                            </div>
                          </div>
                          <ol class="children">
                            <li class="comment byuser comment-author-w3itexpertsuser bypostauthor odd alt depth-2 comment" id="comment-3">
                              <div class="comment-body" id="div-comment-3">
                                <div class="comment-author vcard">
                                  <img src="/images/profile3.jpg" alt="/" class="avatar" />
                                  <cite class="fn">Celesto Anderson</cite>
                                </div>
                                <div class="comment-content dz-page-text">
                                  <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.</p>
                                </div>
                                <div class="reply">
                                  <a class="comment-reply-link" href="javascript:void(0);">Reply</a>
                                </div>
                              </div>
                            </li>
                          </ol>
                        </li>
                        <li class="comment even thread-odd thread-alt depth-1 comment" id="comment-4">
                          <div class="comment-body" id="div-comment-4">
                            <div class="comment-author vcard">
                              <img src="/images/profile2.jpg" alt="/" class="avatar" />
                              <cite class="fn">Monsur Rahman Lito</cite>
                            </div>
                            <div class="comment-content dz-page-text">
                              <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.</p>
                            </div>
                            <div class="reply">
                              <a class="comment-reply-link" href="javascript:void(0);"> Reply</a>
                            </div>
                          </div>
                        </li>
                      </ol>
                    </div>
                    <div class="default-form comment-respond style-1" id="respond">
                      <h4 class="comment-reply-title mb-2" id="reply-title">Good Comments</h4>
                      <p class="dz-title-text">There are many variations of passages of Lorem Ipsum available.</p>
                      <div class="clearfix">
                        <form method="post" id="comments_form" class="comment-form" novalidate>
                          <p class="comment-form-author"><input id="name" placeholder="Author" name="author" type="text" value="" /></p>
                          <p class="comment-form-email"><input id="email" required placeholder="Email" name="email" type="email" value="" /></p>
                          <p class="comment-form-comment"><textarea id="comments" placeholder="Type Comment Here" class="form-control4" name="comment" cols="45" rows="3" required></textarea></p>
                          <p class="col-md-12 col-sm-12 col-xs-12 form-submit">
                            <button id="submit" type="submit" class="submit btn btn-secondary btnhover3 filled">
                              Submit Now
                            </button>
                          </p>
                        </form>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div class="col-xl-4 col-lg-4 order-lg-2 order-1">
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














