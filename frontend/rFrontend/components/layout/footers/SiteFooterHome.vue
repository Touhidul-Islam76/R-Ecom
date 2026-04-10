<script setup lang="ts">
const footerPosts = [
  { img: '/images/shop/product/small/1.png', title: 'A Journey Through Fashion', date: 'July 23, 2023' },
  { img: '/images/shop/product/small/2.png', title: 'Into Fashion Styling Trends', date: 'Feb 23, 2024' },
  { img: '/images/shop/product/small/3.png', title: 'The Wonders of Style', date: 'Jun 26, 2024' },
]
</script>
<template>
<!-- Footer -->
    <footer class="site-footer style-1">
      <div class="footer-top">
        <div class="container">
          <div class="row">
            <div class="col-xl-3 col-md-4 col-sm-6 wow fadeInUp" data-wow-delay="0.1s">
              <div class="widget widget_about me-2">
                <div class="footer-logo logo-white">
                  <a href="/"><img src="/images/20.jpg.jpeg" alt=""></a>
                </div>
                <ul class="widget-address">
                  <li><p><span>Address</span> : 451 Wall Street, UK, London</p></li>
                  <li><p><span>E-mail</span> : <a href="mailto:example@info.com">example@info.com</a></p></li>
                  <li><p><span>Phone</span> : <a href="tel:+9912121211">+919912121211</a></p></li>
                </ul>
                <div class="subscribe_widget">
                  <h2 class="title fw-medium text-capitalize footer-title">subscribe to our newsletter</h2>
                  <form class="dzSubscribe style-1" action="script/mailchamp.php" method="post">
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
                    </div>
                  </form>
                </div>
              </div>
            </div>
            <div class="col-xl-3 col-md-4 col-sm-6 wow fadeInUp" data-wow-delay="0.2s">
              <div class="widget widget_post">
                <h2 class="footer-title">Recent Posts</h2>
                <ul>
                  <li v-for="(post, i) in footerPosts" :key="i">
                    <div class="dz-media"><img :src="post.img" alt=""></div>
                    <div class="dz-content">
                      <h6 class="name"><a href="/post-standard">{{ post.title }}</a></h6>
                      <span class="time">{{ post.date }}</span>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
            <div class="col-xl-2 col-md-4 col-sm-4 col-6 wow fadeInUp" data-wow-delay="0.3s">
              <div class="widget widget_services">
                <h2 class="footer-title">Our Stores</h2>
                <ul>
                  <li v-for="store in ['New York','London SF','Edinburgh','Los Angeles','Chicago','Las Vegas']" :key="store">
                    <a href="javascript:void(0);">{{ store }}</a>
                  </li>
                </ul>
              </div>
            </div>
            <div class="col-xl-2 col-md-4 col-sm-4 col-6 wow fadeInUp" data-wow-delay="0.4s">
              <div class="widget widget_services">
                <h2 class="footer-title">Useful Links</h2>
                <ul>
                  <li v-for="link in ['Privacy Policy','Returns','Terms & Conditions','Contact Us','Latest News','Our Sitemap']" :key="link">
                    <a href="javascript:void(0);">{{ link }}</a>
                  </li>
                </ul>
              </div>
            </div>
            <div class="col-xl-2 col-md-4 col-sm-4 wow fadeInUp" data-wow-delay="0.5s">
              <div class="widget widget_services">
                <h2 class="footer-title">Footer Menu</h2>
                <ul>
                  <li v-for="link in ['Instagram profile','New Collection','Popular Outfit','Contact Us','Latest News']" :key="link">
                    <a href="javascript:void(0);">{{ link }}</a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="footer-bottom">
        <div class="container">
          <div class="row fb-inner wow fadeInUp" data-wow-delay="0.1s">
            <div class="col-lg-6 col-md-12 text-start">
              <p class="copyright-text">Â© 2024 <a href="https://www.dexignzone.com/">DexignZone</a> Theme. All Rights Reserved.</p>
            </div>
            <div class="col-lg-6 col-md-12 text-end">
              <div class="d-flex align-items-center justify-content-center justify-content-md-center justify-content-xl-end">
                <span class="me-3">We Accept: </span>
                <img src="/images/footer-img.png" alt="">
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>

    <!-- Scroll to Top -->
    <div class="scroltop-progress2"></div>
    <button class="scroltop" type="button"><i class="fas fa-arrow-up"></i></button>

</template>


