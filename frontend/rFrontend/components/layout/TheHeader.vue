<template>
  <header class="site-header mo-left header">
    <div class="sticky-header main-bar-wraper navbar-expand-lg">
      <div class="main-bar clearfix">
        <div class="container-fluid clearfix d-lg-flex d-block bg-light">

          <!-- Logo -->
          <div class="logo-header logo-dark me-md-4 me-2">
            <NuxtLink to="/"><img src="/images/20.jpg.jpeg" alt="logo"></NuxtLink>
          </div>

          <!-- Nav Toggle -->
          <button class="navbar-toggler collapsed navicon justify-content-end" type="button"
            data-bs-toggle="collapse" data-bs-target="#navbarNavDropdown"
            aria-controls="navbarNavDropdown" aria-expanded="false" aria-label="Toggle navigation">
            <span></span><span></span><span></span>
          </button>

          <!-- Main Nav -->
          <div class="header-nav w3menu navbar-collapse collapse justify-content-start" id="navbarNavDropdown">
            <div class="logo-header logo-dark">
              <NuxtLink to="/"><img src="/images/20.jpg.jpeg" alt=""></NuxtLink>
            </div>
            <ul class="nav navbar-nav">
              <li class="has-mega-menu sub-menu-down auto-width menu-left">
                <NuxtLink to="/"><span>Home</span><i class="fas fa-chevron-down tabindex"></i></NuxtLink>
              </li>
              <li class="has-mega-menu sub-menu-down">
                <a href="javascript:void(0);"><span>Shop</span><i class="fas fa-chevron-down tabindex"></i></a>
                <div class="mega-menu shop-menu">
                  <ul>
                    <li class="side-left">
                      <ul>
                        <li><span class="menu-title">Shop Structure</span>
                          <ul>
                            <li><NuxtLink to="/shop-standard">Shop Standard</NuxtLink></li>
                            <li><NuxtLink to="/shop-list">Shop List</NuxtLink></li>
                            <li><NuxtLink to="/shop-with-category">Shop With Category</NuxtLink></li>
                            <li><NuxtLink to="/shop-filters-top-bar">Shop Filters Top Bar</NuxtLink></li>
                            <li><NuxtLink to="/shop-sidebar">Shop Sidebar</NuxtLink></li>
                            <li><NuxtLink to="/shop-style-1">Shop Style 1</NuxtLink></li>
                            <li><NuxtLink to="/shop-style-2">Shop Style 2</NuxtLink></li>
                          </ul>
                        </li>
                        <li><span class="menu-title">Product Structure</span>
                          <ul>
                            <li><NuxtLink to="/product-default">Default</NuxtLink></li>
                            <li><NuxtLink to="/product-thumbnail">Thumbnail</NuxtLink></li>
                            <li><NuxtLink to="/product-grid-media">Grid Media</NuxtLink></li>
                            <li><NuxtLink to="/product-carousel">Carousel</NuxtLink></li>
                            <li><NuxtLink to="/product-full-width">Full Width</NuxtLink></li>
                          </ul>
                        </li>
                        <li><span class="menu-title">Shop Pages</span>
                          <ul>
                            <li v-if="isLoggedIn"><NuxtLink to="/shop-wishlist">Wishlist</NuxtLink></li>
                            <li><NuxtLink to="/shop-cart">Cart</NuxtLink></li>
                            <li><NuxtLink to="/shop-checkout">Checkout</NuxtLink></li>
                            <li><NuxtLink to="/shop-compare">Compare</NuxtLink></li>
                            <li><NuxtLink to="/shop-order-tracking">Order Tracking</NuxtLink></li>
                            <li><NuxtLink to="/login">Login</NuxtLink></li>
                            <li><NuxtLink to="/registration">Registration</NuxtLink></li>
                            <li><NuxtLink to="/forget-password">Forget Password <div class="badge badge-sm rounded badge-animated">New</div></NuxtLink></li>
                          </ul>
                        </li>
                        <li class="month-deal">
                          <div class="clearfix me-3">
                            <h3>Deal of the month</h3>
                            <p class="mb-0">Yes! Send me exclusive offers, personalised, and unique gift ideas, tips for shopping on PlantZone <NuxtLink to="/shop-standard" class="dz-link-2">View All Products</NuxtLink></p>
                          </div>
                          <div class="sale-countdown">
                            <div class="countdown text-center">
                              <div class="date"><span class="time days text-primary"></span><span class="work-time">Days</span></div>
                              <div class="date"><span class="time hours text-primary"></span><span class="work-time">Hours</span></div>
                              <div class="date"><span class="time mins text-primary"></span><span class="work-time">Minutess</span></div>
                              <div class="date"><span class="time secs text-primary"></span><span class="work-time">Second</span></div>
                            </div>
                          </div>
                        </li>
                      </ul>
                    </li>
                    <li class="side-right">
                      <div class="adv-media"><img src="/images/adv-1.png" alt="/"></div>
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
                        <li><NuxtLink to="/blog-dark-2-column">Blog 2 Column</NuxtLink></li>
                        <li><NuxtLink to="/blog-dark-2-column-sidebar">Blog 2 Column Sidebar</NuxtLink></li>
                        <li><NuxtLink to="/blog-3-column">Blog 3 Column</NuxtLink></li>
                        <li><NuxtLink to="/blog-dark-half-image">Blog Half Image</NuxtLink></li>
                      </ul>
                      <span class="menu-title">Blog Light Style</span>
                      <ul>
                        <li><NuxtLink to="/blog-light-2-column">Blog 2 Column</NuxtLink></li>
                        <li><NuxtLink to="/blog-light-2-column-sidebar">Blog 2 Column Sidebar</NuxtLink></li>
                        <li><NuxtLink to="/blog-light-half-image">Blog Half Image</NuxtLink></li>
                        <li><NuxtLink to="/blog-exclusive">Blog Exclusive</NuxtLink></li>
                      </ul>
                    </li>
                    <li>
                      <span class="menu-title">Blog List Sidebar</span>
                      <ul>
                        <li><NuxtLink to="/blog-list-no-sidebar">No Sidebar <div class="badge badge-sm rounded">New</div></NuxtLink></li>
                        <li><NuxtLink to="/blog-list-left-sidebar">left Sidebar <div class="badge badge-sm rounded">New</div></NuxtLink></li>
                        <li><NuxtLink to="/blog-list-right-sidebar">Right Sidebar <div class="badge badge-sm rounded">New</div></NuxtLink></li>
                        <li><NuxtLink to="/blog-list-both-sidebar">Both Sidebar <div class="badge badge-sm rounded">New</div></NuxtLink></li>
                      </ul>
                      <span class="menu-title">Blog Grid Sidebar</span>
                      <ul>
                        <li><NuxtLink to="/blog-grid-no-sidebar">No Sidebar <div class="badge badge-sm rounded">New</div></NuxtLink></li>
                        <li><NuxtLink to="/blog-grid-left-sidebar">left Sidebar <div class="badge badge-sm rounded">New</div></NuxtLink></li>
                        <li><NuxtLink to="/blog-grid-right-sidebar">Right Sidebar <div class="badge badge-sm rounded">New</div></NuxtLink></li>
                        <li><NuxtLink to="/blog-grid-both-sidebar">Both Sidebar <div class="badge badge-sm rounded">New</div></NuxtLink></li>
                        <li><NuxtLink to="/blog-grid-wide-sidebar">Wide Sidebar <div class="badge badge-sm rounded">New</div></NuxtLink></li>
                      </ul>
                    </li>
                    <li>
                      <span class="menu-title">Blog Sidebar</span>
                      <ul>
                        <li><NuxtLink to="/blog-left-sidebar">Blog left Sidebar</NuxtLink></li>
                        <li><NuxtLink to="/blog-right-sidebar">Blog Right Sidebar</NuxtLink></li>
                        <li><NuxtLink to="/blog-both-sidebar">Blog Both Sidebar</NuxtLink></li>
                        <li><NuxtLink to="/blog-wide-sidebar">Blog Wide Sidebar</NuxtLink></li>
                      </ul>
                      <span class="menu-title">Blog Page</span>
                      <ul>
                        <li><NuxtLink to="/blog-archive">Blog Archive</NuxtLink></li>
                        <li><NuxtLink to="/blog-author">Author</NuxtLink></li>
                        <li><NuxtLink to="/blog-category">Blog Category</NuxtLink></li>
                        <li><NuxtLink to="/blog-tag">Blog Tag</NuxtLink></li>
                      </ul>
                    </li>
                    <li class="post-menu">
                      <span class="menu-title">Recent Posts</span>
                      <div class="widget widget_post pt-2">
                        <ul>
                          <li>
                            <div class="dz-media"><img src="/images/shop/product/small/1.png" alt=""></div>
                            <div class="dz-content">
                              <h6 class="name"><NuxtLink to="/post-standard">A Journey Through Plant</NuxtLink></h6>
                              <span class="time">Jun 23, 2024</span>
                            </div>
                          </li>
                          <li>
                            <div class="dz-media"><img src="/images/shop/product/small/2.png" alt=""></div>
                            <div class="dz-content">
                              <h6 class="name"><NuxtLink to="/post-standard">Into Plant Care Cultivation</NuxtLink></h6>
                              <span class="time">Feb 16, 2024</span>
                            </div>
                          </li>
                          <li>
                            <div class="dz-media"><img src="/images/shop/product/small/3.png" alt=""></div>
                            <div class="dz-content">
                              <h6 class="name"><NuxtLink to="/post-standard">The Wonders of Plants</NuxtLink></h6>
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
                        <li><NuxtLink to="/post-text">Text Post <div class="badge badge-sm rounded">New</div></NuxtLink></li>
                        <li><NuxtLink to="/post-image">Image Post <div class="badge badge-sm rounded">New</div></NuxtLink></li>
                        <li><NuxtLink to="/post-video">Video Post</NuxtLink></li>
                        <li><NuxtLink to="/post-link">Link Post</NuxtLink></li>
                        <li><NuxtLink to="/post-audio">Audio Post</NuxtLink></li>
                        <li><NuxtLink to="/post-quote">Post Quote</NuxtLink></li>
                        <li><NuxtLink to="/post-tutorial">Tutorial Post <div class="badge badge-sm rounded">New</div></NuxtLink></li>
                        <li><NuxtLink to="/post-cateloge">Cateloge Post <div class="badge badge-sm rounded">New</div></NuxtLink></li>
                      </ul>
                    </div>
                    <div class="col-md-4 col-sm-4 col-6">
                      <a href="javascript:void(0);" class="menu-title">Multiple Media</a>
                      <ul>
                        <li><NuxtLink to="/post-banner">Banner</NuxtLink></li>
                        <li><NuxtLink to="/post-slide-show">Slider</NuxtLink></li>
                        <li><NuxtLink to="/post-gallery">Gallery</NuxtLink></li>
                        <li><NuxtLink to="/post-status">Status Slider <div class="badge badge-sm rounded">New</div></NuxtLink></li>
                      </ul>
                      <a href="javascript:void(0);" class="menu-title">Post Layout Type</a>
                      <ul>
                        <li><NuxtLink to="/post-standard">Standard Post</NuxtLink></li>
                        <li><NuxtLink to="/post-corner">Corner Post</NuxtLink></li>
                        <li><NuxtLink to="/post-side">Side Post <div class="badge badge-sm rounded">New</div></NuxtLink></li>
                      </ul>
                    </div>
                    <div class="col-md-4 col-sm-4 col-6">
                      <a href="javascript:void(0);" class="menu-title">Side Bar</a>
                      <ul>
                        <li><NuxtLink to="/post-left-sidebar">Left Sidebar</NuxtLink></li>
                        <li><NuxtLink to="/post-right-sidebar">Right Sidebar</NuxtLink></li>
                        <li><NuxtLink to="/post-both-sidebar">Both Sidebar</NuxtLink></li>
                        <li><NuxtLink to="/post-no-sidebar">No Sidebar</NuxtLink></li>
                      </ul>
                    </div>
                  </div>
                </div>
              </li>
              <li class="has-mega-menu sub-menu-down wide-width">
                <a href="javascript:void(0);"><span>Pages</span><i class="fas fa-chevron-down tabindex"></i></a>
                <div class="mega-menu">
                  <ul>
                    <li>
                      <span class="menu-title">Pages</span>
                      <ul>
                        <li><NuxtLink to="/about-us">About Us</NuxtLink></li>
                        <li><NuxtLink to="/about-me">About Me</NuxtLink></li>
                        <li><NuxtLink to="/pricing-table">Pricing Table</NuxtLink></li>
                        <li><NuxtLink to="/our-gift-vouchers">Our Gift Vouchers</NuxtLink></li>
                        <li><NuxtLink to="/what-we-do">What We Do</NuxtLink></li>
                        <li><NuxtLink to="/faqs-1">Faqs 1</NuxtLink></li>
                        <li><NuxtLink to="/faqs-2">Faqs 2</NuxtLink></li>
                        <li><NuxtLink to="/our-team">Our Team</NuxtLink></li>
                      </ul>
                    </li>
                    <li>
                      <span class="menu-title">Contact Us</span>
                      <ul>
                        <li><NuxtLink to="/contact-us-1">Contact Us 1</NuxtLink></li>
                      </ul>
                      <span class="menu-title">Web Pages</span>
                      <ul>
                        <li><NuxtLink to="/error-1">Error 404 1</NuxtLink></li>
                        <li><NuxtLink to="/error-2">Error 404 2</NuxtLink></li>
                        <li><NuxtLink to="/coming-soon">Coming Soon</NuxtLink></li>
                        <li><NuxtLink to="/under-construction">Under Construction</NuxtLink></li>
                      </ul>
                    </li>
                    <li>
                      <span class="menu-title">Banner Style</span>
                      <ul>
                        <li><NuxtLink to="/banner-with-bg-color">Banner with BG Color</NuxtLink></li>
                        <li><NuxtLink to="/banner-with-image">Banner with Image</NuxtLink></li>
                        <li><NuxtLink to="/banner-with-video">Banner with Video</NuxtLink></li>
                        <li><NuxtLink to="/banner-with-kanbern">Banner with Kanbern</NuxtLink></li>
                        <li><NuxtLink to="/banner-small">Banner Small</NuxtLink></li>
                        <li><NuxtLink to="/banner-medium">Banner Medium</NuxtLink></li>
                        <li><NuxtLink to="/banner-large">Banner Large</NuxtLink></li>
                      </ul>
                    </li>
                    <li>
                      <span class="menu-title">Dashboard</span>
                      <ul>
                        <li><NuxtLink to="/account-dashboard">Dashboard</NuxtLink></li>
                        <li><NuxtLink to="/account-orders">Orders</NuxtLink></li>
                        <li><NuxtLink to="/account-order-details">Orders Details</NuxtLink></li>
                        <li><NuxtLink to="/account-order-confirmation">Orders Confirmation</NuxtLink></li>
                        <li><NuxtLink to="/account-downloads">Downloads</NuxtLink></li>
                        <li><NuxtLink to="/account-return-request">Return Request</NuxtLink></li>
                        <li><NuxtLink to="/account-return-request-detail">Return Request Detail</NuxtLink></li>
                        <li><NuxtLink to="/account-refund-requests-confirmed">Return Request Confirmed</NuxtLink></li>
                      </ul>
                    </li>
                  </ul>
                </div>
              </li>
              <li class="sub-menu-down">
                <a href="javascript:void(0);"><span>My Account</span><i class="fas fa-chevron-down tabindex"></i></a>
                <ul class="sub-menu">
                  <li><NuxtLink to="/account-dashboard">Dashboard</NuxtLink></li>
                  <li><NuxtLink to="/account-orders">Orders</NuxtLink></li>
                  <li><NuxtLink to="/account-order-details">Orders Details</NuxtLink></li>
                  <li><NuxtLink to="/account-order-confirmation">Orders Confirmation</NuxtLink></li>
                  <li><NuxtLink to="/account-downloads">Downloads</NuxtLink></li>
                  <li><NuxtLink to="/account-return-request">Return Request</NuxtLink></li>
                  <li><NuxtLink to="/account-return-request-detail">Return Request Detail</NuxtLink></li>
                  <li><NuxtLink to="/account-refund-requests-confirmed">Return Request Confirmed</NuxtLink></li>
                  <li><NuxtLink to="/account-profile">Profile</NuxtLink></li>
                  <li><NuxtLink to="/account-address">Address</NuxtLink></li>
                  <li><NuxtLink to="/account-shipping-methods">Shipping methods</NuxtLink></li>
                  <li><NuxtLink to="/account-payment-methods">Payment Methods</NuxtLink></li>
                  <li><NuxtLink to="/account-review">Review</NuxtLink></li>
                  <li><NuxtLink to="/account-billing-address">Billing address</NuxtLink></li>
                  <li><NuxtLink to="/account-shipping-address">Shipping address</NuxtLink></li>
                  <li><NuxtLink to="/account-cancellation-requests">Cancellation Requests</NuxtLink></li>
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
                  <NuxtLink class="nav-link" to="/login">Login / Register</NuxtLink>
                </li>
                <li class="nav-item search-link">
                  <a class="nav-link" href="javascript:void(0);" data-bs-toggle="offcanvas" data-bs-target="#offcanvasTop" aria-controls="offcanvasTop">
                    <i class="iconly-Light-Search"></i>
                  </a>
                </li>
                <li v-if="isLoggedIn" class="nav-item wishlist-link">
                  <a class="nav-link" href="javascript:void(0);" data-bs-toggle="offcanvas" data-bs-target="#offcanvasRight" aria-controls="offcanvasRight">
                    <i class="iconly-Light-Heart2"></i>
                  </a>
                </li>
                <li class="nav-item cart-link">
                  <a href="javascript:void(0);" class="nav-link cart-btn" data-bs-toggle="offcanvas" data-bs-target="#offcanvasRight" aria-controls="offcanvasRight">
                    <i class="iconly-Broken-Buy"></i>
                    <span class="badge badge-circle">{{ totalItems }}</span>
                  </a>
                </li>
                <li class="nav-item filte-link">
                  <a href="javascript:void(0);" class="nav-link filte-btn" data-bs-toggle="offcanvas" data-bs-target="#offcanvasLeft" aria-controls="offcanvasLeft">
                    <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 30 13" fill="none">
                      <rect y="11" width="30" height="2" fill="black"/>
                      <rect width="30" height="2" fill="black"/>
                    </svg>
                  </a>
                </li>
              </ul>
            </div>
          </div>

        </div>
      </div>
    </div>
  </header>

  <!-- Search Offcanvas -->
  <div class="dz-search-area dz-offcanvas offcanvas offcanvas-top" tabindex="-1" id="offcanvasTop">
    <button type="button" class="btn-close" data-bs-dismiss="offcanvas" aria-label="Close">&times;</button>
    <div class="container">
      <form class="header-item-search">
        <h5 class="dz-title">Search Our Site</h5>
        <div class="input-group search-input">
          <input type="search" class="form-control" placeholder="Search Here">
          <button class="btn" type="button"><i class="iconly-Light-Search"></i></button>
        </div>
        <ul class="recent-tag">
          <li class="pe-0"><span>Quick Search :</span></li>
          <li><NuxtLink to="/shop-list">Small Plants</NuxtLink></li>
          <li><NuxtLink to="/shop-list">House Plants</NuxtLink></li>
          <li><NuxtLink to="/shop-list">Aqua Greens</NuxtLink></li>
          <li><NuxtLink to="/shop-list">Plant Paradise</NuxtLink></li>
        </ul>
      </form>
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
              <button class="nav-link active" id="shopping-cart" data-bs-toggle="tab" data-bs-target="#shopping-cart-pane" type="button" role="tab" aria-selected="true">
                Shopping Cart <span class="badge badge-light">{{ totalItems }}</span>
              </button>
            </li>
            <li v-if="isLoggedIn" class="nav-item" role="presentation">
              <button class="nav-link" id="wishlist" data-bs-toggle="tab" data-bs-target="#wishlist-pane" type="button" role="tab" aria-selected="false">
                Wishlist <span class="badge badge-light">2</span>
              </button>
            </li>
          </ul>
          <div class="tab-content pt-4" id="dz-shopcart-sidebar">
            <div class="tab-pane fade show active" id="shopping-cart-pane" role="tabpanel" tabindex="0">
              <div class="shop-sidebar-cart">
                <ul class="sidebar-cart-list">
                  <li v-if="!hasCartItems" class="text-center text-muted py-3">
                    Your cart is empty.
                  </li>
                  <li v-for="(item, i) in cartItems" :key="`cart-${item.product_id}-${item.size}-${item.color}-${i}`">
                    <div class="cart-widget">
                      <div class="dz-media me-3"><img :src="item.image" alt=""></div>
                      <div class="cart-content">
                        <h6 class="title"><NuxtLink :to="`/product/${item.product_id}`">{{ item.title }}</NuxtLink></h6>
                        <small v-if="itemOption(item.size, item.color)" class="d-block text-muted">{{ itemOption(item.size, item.color) }}</small>
                        <div class="d-flex align-items-center">
                          <div class="btn-quantity light quantity-sm me-3 ms-0 style-1">
                            <input type="text" :value="item.quantity" name="demo_vertical2" readonly>
                          </div>
                          <h6 class="dz-price mb-0">{{ formatPrice(item.price) }}</h6>
                        </div>
                      </div>
                      <a href="javascript:void(0);" class="dz-close" @click.prevent="removeCartItem(i)"><i class="ti-close"></i></a>
                    </div>
                  </li>
                </ul>
                <div class="cart-total">
                  <h5 class="mb-0">Subtotal:</h5>
                  <h5 class="mb-0">{{ formatPrice(subtotal) }}</h5>
                </div>
                <div class="mt-auto">
                  <div class="shipping-time">
                    <div class="dz-icon"><i class="flaticon flaticon-ship"></i></div>
                    <div class="shipping-content">
                      <h6 class="title pe-4">Congratulations, you've got free shipping!</h6>
                      <div class="progress">
                        <div class="progress-bar progress-animated border-0" style="width: 75%;" role="progressbar">
                          <span class="sr-only">75% Complete</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <NuxtLink :to="hasCartItems ? '/shop-checkout' : '/shop-standard'" class="btn btn-outline-secondary btn-block m-b20">
                    {{ hasCartItems ? 'Checkout' : 'Shop Now' }}
                  </NuxtLink>
                  <NuxtLink to="/shop-cart" class="btn btn-secondary btn-block">View Cart</NuxtLink>
                </div>
              </div>
            </div>
            <div v-if="isLoggedIn" class="tab-pane fade" id="wishlist-pane" role="tabpanel" tabindex="0">
              <div class="shop-sidebar-cart">
                <ul class="sidebar-cart-list">
                  <li v-for="(item, i) in wishlistItems" :key="i">
                    <div class="cart-widget">
                      <div class="dz-media me-3"><img :src="item.img" alt=""></div>
                      <div class="cart-content">
                        <h6 class="title"><NuxtLink to="/product-thumbnail">{{ item.name }}</NuxtLink></h6>
                        <div class="d-flex align-items-center">
                          <h6 class="dz-price mb-0">${{ item.price }}</h6>
                        </div>
                      </div>
                      <a href="javascript:void(0);" class="dz-close"><i class="ti-close"></i></a>
                    </div>
                  </li>
                </ul>
                <div class="mt-auto">
                  <NuxtLink to="/shop-wishlist" class="btn btn-secondary btn-block">Check Your Favourite</NuxtLink>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Filter Sidebar Offcanvas -->
  <div class="offcanvas dz-offcanvas offcanvas offcanvas-end" tabindex="-1" id="offcanvasLeft">
    <button type="button" class="btn-close" data-bs-dismiss="offcanvas" aria-label="Close">&times;</button>
    <div class="offcanvas-body">
      <div class="contact-sidebar">
        <div class="contact-box1 deznav-scroll">
          <div class="logo-contact logo-header m-0">
            <NuxtLink to="/" class="logo-white"><img src="/images/20.jpg.jpeg" alt="/"></NuxtLink>
          </div>
          <p class="text">Transform your website into a dynamic online storefront with PlantZone, where style seamlessly meets functionality, ensuring a captivating and user-friendly eCommerce journey through the lush world of plants.</p>
          <h4 class="dz-title">Contact Us</h4>
          <ul class="contact-address">
            <li>785 15h Street, Office 478 Berlin, De 81566</li>
            <li>Demo@gmail.com</li>
            <li>+1012 3456 789</li>
          </ul>
          <h4 class="dz-title">Newsletter</h4>
          <form class="dzSubscribe dz-subscribe-wrapper1" action="script/mailchamp.php" method="post">
            <div class="dzSubscribeMsg"></div>
            <div class="form-group">
              <div class="input-group mb-0">
                <input name="dzEmail" required type="email" class="form-control" placeholder="Your Email Address">
                <div class="input-group-addon">
                  <button name="submit" value="Submit" type="submit" class="btn">
                    <i class="icon feather icon-arrow-right"></i>
                  </button>
                </div>
              </div>
              <div class="custom-control custom-checkbox d-flex m-b40">
                <input type="checkbox" class="form-check-input" id="basic_checkbox_1">
                <label class="form-check-label">I Agree To The <span><NuxtLink to="/privacy-policy">Privacy Policy</NuxtLink></span></label>
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
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { computed, onMounted } from 'vue'
import { useCartStore } from '~/stores/cartStore'

const cartStore = useCartStore()
const authUser = useAuthUser()
const { items: cartItems, subtotal, totalItems } = storeToRefs(cartStore)
const hasCartItems = computed(() => cartItems.value.length > 0)
const isLoggedIn = computed(() =>
  Boolean(authUser.value?.id || authUser.value?.email || authUser.value?.phone || authUser.value?.role),
)

const formatPrice = (value: number) => `$${Number(value || 0).toFixed(2)}`
const itemOption = (size: string | null, color: string | null) => [size, color].filter(Boolean).join(' / ')

const removeCartItem = async (index: number) => {
  await cartStore.removeItem(index)
}

onMounted(() => {
  cartStore.hydrateCart()
})

const wishlistItems = [
  { img: '/images/shop/shop-cart/pic1.jpg', name: 'Large Majesty Palm (m)', price: '59' },
  { img: '/images/shop/shop-cart/pic2.jpg', name: 'Endless Stems Gardens (m)', price: '79' },
  { img: '/images/shop/shop-cart/pic3.jpg', name: 'Feather Reed Grass (m)', price: '49' },
]
</script>
