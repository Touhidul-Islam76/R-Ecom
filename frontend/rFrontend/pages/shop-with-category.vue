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

