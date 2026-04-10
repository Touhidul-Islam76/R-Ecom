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
    { rel: 'canonical', href: 'https://fasionable.dexignzone.com/xhtml/about-us.html' },
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

</script>

<template>
  <div id="bg">
    <div class="page-wraper">
      

      
      <div class="page-content">
        <div class="dz-bnr-inr" style="background-image: url('/images/background/bg1.jpg')">
          <div class="container">
            <div class="dz-bnr-inr-entry">
              <nav aria-label="breadcrumb" class="breadcrumb-row">
                <ul class="breadcrumb">
                  <li class="breadcrumb-item"><NuxtLink to="/">Home</NuxtLink></li>
                  <li class="breadcrumb-item">About us</li>
                </ul>
              </nav>
            </div>
          </div>
        </div>

        <section class="content-inner overflow-hidden">
          <div class="container">
            <div class="row align-items-center">
              <div class="col-lg-6 m-b30">
                <div class="row g-xl-2 g-md-2 g-3">
                  <div class="col-lg-12 wow fadeInUp" data-wow-delay="0.6s">
                    <div class="about-thumb"><img src="/images/about/pic6.jpg" alt="" class="rounded" /></div>
                  </div>
                  <div class="col-xl-4 col-lg-4 col-sm-4 col-4 wow fadeInUp" data-wow-delay="0.5s">
                    <div class="about-thumb"><img src="/images/about/pic5.jpg" alt="" class="rounded" /></div>
                  </div>
                  <div class="col-xl-8 col-lg-8 col-sm-8 col-8 wow fadeInUp" data-wow-delay="0.4s">
                    <div class="about-thumb"><img src="/images/about/pic4.jpg" alt="" class="rounded" /></div>
                  </div>
                </div>
              </div>
              <div class="col-lg-6">
                <div class="section-head wow fadeInUp m-md-r100" data-wow-delay="0.1s">
                  <h2 class="title">Growing Green, Nurturing Life</h2>
                  <p>
                    At FasionAble, we are on a mission to redefine fashion by blending style, quality, and individuality into every garment we offer.
                    We believe that what you wear is an extension of your unique personality, and it should reflect your values and aspirations.
                  </p>
                </div>
                <div class="row justify-content-center">
                  <div class="col-lg-6 col-md-6 col-sm-6 m-b30">
                    <div class="icon-bx-wraper style-5">
                      <div class="icon-media"><i class="fab fa-instagram"></i></div>
                      <div class="icon-content"><h3 class="title">Eco Friendly Product</h3></div>
                    </div>
                  </div>
                  <div class="col-lg-6 col-md-6 col-sm-6 m-b30">
                    <div class="icon-bx-wraper style-5">
                      <div class="icon-media"><i class="fab fa-instagram"></i></div>
                      <div class="icon-content"><h3 class="title">Easy To Clean And Maintain</h3></div>
                    </div>
                  </div>
                  <div class="col-lg-6 col-md-6 col-sm-6 m-b30">
                    <div class="icon-bx-wraper style-5">
                      <div class="icon-media"><i class="fab fa-instagram"></i></div>
                      <div class="icon-content"><h4 class="title">Premium Finish Quality</h4></div>
                    </div>
                  </div>
                  <div class="col-lg-6 col-md-6 col-sm-6 m-b30">
                    <div class="icon-bx-wraper style-5">
                      <div class="icon-media"><i class="fab fa-instagram"></i></div>
                      <div class="icon-content"><h4 class="title">Moisture Proof Product</h4></div>
                    </div>
                  </div>
                </div>
                <NuxtLink class="btn btn-outline-secondary btn-lg" to="/product-default">View Details</NuxtLink>
              </div>
            </div>
          </div>
        </section>

        <section
          class="section-wrapper-1 content-inner overflow-hidden bg-parallax"
          style="background-image: url('/images/background/bg2.jpg'); background-attachment: fixed"
        >
          <div class="container">
            <div class="section-head style-3">
              <h2 class="title text-white wow flipInX" data-wow-delay="0.4s">Our Story of Cultivating Beauty and Growth</h2>
            </div>
            <ul class="list-check style-2">
              <li>Our Botanical Journey: Tracing our passion from roots to flourishing expertise.</li>
              <li>The Green Difference: Innovative care and personalized approaches set us apart.</li>
              <li>Meet Our Fashion Whisperers: Dedicated to fostering flourishing ecosystems and green happiness.</li>
            </ul>
          </div>
        </section>

        <section class="content-inner">
          <div class="container-fluid p-0">
            <div class="section-head style-3 d-block wow fadeInUp text-center" data-wow-delay="0.2s">
              <div class="mx-auto">
                <h2 class="title mb-4">Expert in creating the perfect blends</h2>
              </div>
            </div>
            <div class="swiper swiper-team">
              <div class="swiper-wrapper">
                <div class="swiper-slide wow fadeInUp" data-wow-delay="0.2s">
                  <div class="dz-team style-1 m-md-b0 m-sm-b0 m-b30 box-hover">
                    <div class="dz-media">
                      <a href="javascript:void(0);"><img src="/images/team/pic1.jpg" alt="" /></a>
                      <ul class="team-social-icon">
                        <li><a href="https://www.linkedin.com/in/dexignzone/" target="_blank"><i class="fa-brands fa-linkedin-in"></i></a></li>
                        <li><a href="https://www.instagram.com/dexignzone/" target="_blank"><i class="fab fa-instagram"></i></a></li>
                        <li><a href="https://www.facebook.com/dexignzone" target="_blank"><i class="fab fa-facebook-f"></i></a></li>
                      </ul>
                    </div>
                    <div class="dz-content"><h3 class="title"><a href="/our-team">John Doe</a></h3><span>CEO & Founder</span></div>
                  </div>
                </div>
                <div class="swiper-slide wow fadeInUp" data-wow-delay="0.3s">
                  <div class="dz-team style-1 m-md-b0 m-sm-b0 m-b30 box-hover">
                    <div class="dz-media">
                      <a href="javascript:void(0);"><img src="/images/team/pic2.jpg" alt="" /></a>
                      <ul class="team-social-icon">
                        <li><a href="https://www.linkedin.com/in/dexignzone/" target="_blank"><i class="fa-brands fa-linkedin-in"></i></a></li>
                        <li><a href="https://www.instagram.com/dexignzone/" target="_blank"><i class="fab fa-instagram"></i></a></li>
                        <li><a href="https://www.facebook.com/dexignzone" target="_blank"><i class="fab fa-facebook-f"></i></a></li>
                      </ul>
                    </div>
                    <div class="dz-content"><h3 class="title"><a href="/our-team">Ivan Mathews</a></h3><span>iOS Developer</span></div>
                  </div>
                </div>
                <div class="swiper-slide wow fadeInUp" data-wow-delay="0.4s">
                  <div class="dz-team style-1 m-md-b0 m-sm-b0 m-b30 box-hover">
                    <div class="dz-media">
                      <a href="javascript:void(0);"><img src="/images/team/pic3.jpg" alt="" /></a>
                      <ul class="team-social-icon">
                        <li><a href="https://www.linkedin.com/in/dexignzone/" target="_blank"><i class="fa-brands fa-linkedin-in"></i></a></li>
                        <li><a href="https://www.instagram.com/dexignzone/" target="_blank"><i class="fab fa-instagram"></i></a></li>
                        <li><a href="https://www.facebook.com/dexignzone" target="_blank"><i class="fab fa-facebook-f"></i></a></li>
                      </ul>
                    </div>
                    <div class="dz-content"><h3 class="title"><a href="/our-team">Macauley Herring</a></h3><span>Customer Success</span></div>
                  </div>
                </div>
                <div class="swiper-slide wow fadeInUp" data-wow-delay="0.5s">
                  <div class="dz-team style-1 m-md-b0 m-sm-b0 m-b30 box-hover">
                    <div class="dz-media">
                      <a href="javascript:void(0);"><img src="/images/team/pic4.jpg" alt="" /></a>
                      <ul class="team-social-icon">
                        <li><a href="https://www.linkedin.com/in/dexignzone/" target="_blank"><i class="fa-brands fa-linkedin-in"></i></a></li>
                        <li><a href="https://www.instagram.com/dexignzone/" target="_blank"><i class="fab fa-instagram"></i></a></li>
                        <li><a href="https://www.facebook.com/dexignzone" target="_blank"><i class="fab fa-facebook-f"></i></a></li>
                      </ul>
                    </div>
                    <div class="dz-content"><h3 class="title"><a href="/our-team">Alya Levine</a></h3><span>CTO</span></div>
                  </div>
                </div>
                <div class="swiper-slide wow fadeInUp" data-wow-delay="0.6s">
                  <div class="dz-team style-1 m-md-b0 m-sm-b0 m-b30 box-hover">
                    <div class="dz-media">
                      <a href="javascript:void(0);"><img src="/images/team/pic5.jpg" alt="" /></a>
                      <ul class="team-social-icon">
                        <li><a href="https://www.linkedin.com/in/dexignzone/" target="_blank"><i class="fa-brands fa-linkedin-in"></i></a></li>
                        <li><a href="https://www.instagram.com/dexignzone/" target="_blank"><i class="fab fa-instagram"></i></a></li>
                        <li><a href="https://www.facebook.com/dexignzone" target="_blank"><i class="fab fa-facebook-f"></i></a></li>
                      </ul>
                    </div>
                    <div class="dz-content"><h3 class="title"><a href="/our-team">Rose Hernandez</a></h3><span>Backend Developer</span></div>
                  </div>
                </div>
                <div class="swiper-slide wow fadeInUp" data-wow-delay="0.7s">
                  <div class="dz-team style-1 m-md-b0 m-sm-b0 m-b30 box-hover">
                    <div class="dz-media">
                      <a href="javascript:void(0);"><img src="/images/team/pic6.jpg" alt="" /></a>
                      <ul class="team-social-icon">
                        <li><a href="https://www.linkedin.com/in/dexignzone/" target="_blank"><i class="fa-brands fa-linkedin-in"></i></a></li>
                        <li><a href="https://www.instagram.com/dexignzone/" target="_blank"><i class="fab fa-instagram"></i></a></li>
                        <li><a href="https://www.facebook.com/dexignzone" target="_blank"><i class="fab fa-facebook-f"></i></a></li>
                      </ul>
                    </div>
                    <div class="dz-content"><h3 class="title"><a href="/our-team">Elen Benitez</a></h3><span>Designer</span></div>
                  </div>
                </div>
                <div class="swiper-slide wow fadeInUp" data-wow-delay="0.8s">
                  <div class="dz-team style-1 m-md-b0 m-sm-b0 m-b30 box-hover">
                    <div class="dz-media">
                      <a href="javascript:void(0);"><img src="/images/team/pic1.jpg" alt="" /></a>
                      <ul class="team-social-icon">
                        <li><a href="https://www.linkedin.com/in/dexignzone/" target="_blank"><i class="fa-brands fa-linkedin-in"></i></a></li>
                        <li><a href="https://www.instagram.com/dexignzone/" target="_blank"><i class="fab fa-instagram"></i></a></li>
                        <li><a href="https://www.facebook.com/dexignzone" target="_blank"><i class="fab fa-facebook-f"></i></a></li>
                      </ul>
                    </div>
                    <div class="dz-content"><h3 class="title"><a href="/our-team">John Doe</a></h3><span>CEO & Founder</span></div>
                  </div>
                </div>
                <div class="swiper-slide wow fadeInUp" data-wow-delay="0.9s">
                  <div class="dz-team style-1 m-md-b0 m-sm-b0 m-b30 box-hover">
                    <div class="dz-media">
                      <a href="javascript:void(0);"><img src="/images/team/pic2.jpg" alt="" /></a>
                      <ul class="team-social-icon">
                        <li><a href="https://www.linkedin.com/in/dexignzone/" target="_blank"><i class="fa-brands fa-linkedin-in"></i></a></li>
                        <li><a href="https://www.instagram.com/dexignzone/" target="_blank"><i class="fab fa-instagram"></i></a></li>
                        <li><a href="https://www.facebook.com/dexignzone" target="_blank"><i class="fab fa-facebook-f"></i></a></li>
                      </ul>
                    </div>
                    <div class="dz-content"><h3 class="title"><a href="/our-team">Ivan Mathews</a></h3><span>iOS Developer</span></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section class="about-style4 content-inner overflow-hidden">
          <div class="container">
            <div class="row align-items-center">
              <div class="col-lg-5 order-lg-1 order-2 wow fadeInUp" data-wow-delay="0.2s">
                <div class="side-content">
                  <div class="about-thumb"><img src="/images/about/pic1.jpg" alt="" /></div>
                </div>
              </div>
              <div class="col-lg-7 m-b30 aos-item wow fadeInUp order-lg-2 order-1" data-wow-delay="0.4s">
                <div class="right-contant">
                  <div class="section-head style-3">
                    <h2 class="title">What pet lovers say <br /> about us ?</h2>
                  </div>
                  <div class="swiper swiper-five">
                    <div class="swiper-wrapper">
                      <div class="swiper-slide">
                        <div class="about-content">
                          <p class="para-text">
                            It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout.
                            The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters.
                          </p>
                          <div class="about-bx-detail">
                            <div class="about-bx-pic radius"><img src="/images/testimonial/testimonial1.jpg" alt="" /></div>
                            <div><h3 class="name">Kenneth Fong</h3><span class="position">Postgraduate Student</span></div>
                          </div>
                        </div>
                      </div>
                      <div class="swiper-slide">
                        <div class="about-content">
                          <p class="para-text">
                            It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout.
                            The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters.
                          </p>
                          <div class="about-bx-detail">
                            <div class="about-bx-pic radius"><img src="/images/testimonial/testimonial2.jpg" alt="" /></div>
                            <div><h6 class="name">Joe Do</h6><span class="position">Undergraduate Student</span></div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div class="pagination-align">
                      <div class="about-button-prev btn-prev"><i class="flaticon flaticon-left-chevron"></i></div>
                      <div class="about-button-next btn-next"><i class="flaticon flaticon-chevron"></i></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <img src="/images/about/Plant-1.png" alt="" class="Plant" />
        </section>

        <section class="content-inner overflow-hidden">
          <div class="container">
            <div class="row justify-content-center">
              <div class="col-lg-3 col-md-6 col-sm-12">
                <div class="dz-card style-8 card-2 box-hover wow fadeInUp" data-wow-delay="0.2s">
                  <div class="dz-media"><img src="/images/blog/grid/1.jpg" alt="" /></div>
                  <div class="dz-info">
                    <div class="dz-meta"><ul><li class="post-date">20 Apr 2023</li></ul></div>
                    <h2 class="dz-title"><a class="text-white" href="/post-left-sidebar">Essential Fashion Care Tips for Beginners</a></h2>
                    <a href="/post-left-sidebar" class="font-14 mt-auto read-btn">Read More <i class="icon feather icon-chevron-right"></i></a>
                  </div>
                </div>
              </div>
              <div class="col-lg-3 col-md-6 col-sm-12">
                <div class="dz-card style-8 card-2 box-hover wow fadeInUp" data-wow-delay="0.4s">
                  <div class="dz-media"><img src="/images/blog/grid/2.jpg" alt="" /></div>
                  <div class="dz-info">
                    <div class="dz-meta"><ul><li class="post-date">20 Apr 2023</li></ul></div>
                    <h2 class="dz-title"><a class="text-white" href="/post-left-sidebar">Keeping Your Indoor Garden Thriving</a></h2>
                    <a href="/post-left-sidebar" class="font-14 mt-auto read-btn">Read More <i class="icon feather icon-chevron-right"></i></a>
                  </div>
                </div>
              </div>
              <div class="col-lg-3 col-md-6 col-sm-12">
                <div class="dz-card style-8 card-3 box-hover wow fadeInUp" data-wow-delay="0.6s">
                  <div class="dz-media"><img src="/images/blog/grid/3.jpg" alt="" /></div>
                  <div class="dz-info">
                    <div class="dz-meta"><ul><li class="post-date">20 Apr 2023</li></ul></div>
                    <h2 class="dz-title"><a class="text-white" href="/post-left-sidebar">Nurturing Your Dresses with Expert Care</a></h2>
                    <a href="/post-left-sidebar" class="font-14 mt-auto read-btn">Read More <i class="icon feather icon-chevron-right"></i></a>
                  </div>
                </div>
              </div>
              <div class="col-lg-3 col-md-6 col-sm-12">
                <div class="dz-card style-8 card-4 box-hover wow fadeInUp" data-wow-delay="0.8s">
                  <div class="dz-media"><img src="/images/blog/grid/4.jpg" alt="" /></div>
                  <div class="dz-info">
                    <div class="dz-meta"><ul><li class="post-date">20 Apr 2023</li></ul></div>
                    <h2 class="dz-title"><a class="text-white" href="/post-left-sidebar">the Basics for Healthy and Happy Dresses</a></h2>
                    <a href="/post-left-sidebar" class="font-14 mt-auto read-btn">Read More <i class="icon feather icon-chevron-right"></i></a>
                  </div>
                </div>
              </div>
              <div class="col-lg-12 m-b30 text-center">
                <a class="btn btn-secondary" href="/blog-dark-2-column">Loadmore</a>
              </div>
            </div>
          </div>
        </section>

        <section class="content-inner-1 companies bg-white">
          <div class="container">
            <div class="section-head style-3 d-block wow fadeInUp text-center" data-wow-delay="0.2s">
              <div class="max-w600 mx-auto">
                <h2 class="title mb-4">We're just keep growing with 6.3k trusted companies</h2>
              </div>
            </div>
            <div class="section-inner">
              <div class="swiper swiper-company">
                <div class="swiper-wrapper">
                  <div class="swiper-slide wow fadeInUp" data-wow-delay="0.1s"><a href="javascript:void(0);" class="companies-wrapper"><div class="companies-media"><img src="/images/companies/logo1.png" alt="" /></div></a></div>
                  <div class="swiper-slide wow fadeInUp" data-wow-delay="0.2s"><a href="javascript:void(0);" class="companies-wrapper"><div class="companies-media"><img src="/images/companies/logo2.png" alt="" /></div></a></div>
                  <div class="swiper-slide wow fadeInUp" data-wow-delay="0.3s"><a href="javascript:void(0);" class="companies-wrapper"><div class="companies-media"><img src="/images/companies/logo3.png" alt="" /></div></a></div>
                  <div class="swiper-slide wow fadeInUp" data-wow-delay="0.4s"><a href="javascript:void(0);" class="companies-wrapper"><div class="companies-media"><img src="/images/companies/logo4.png" alt="" /></div></a></div>
                  <div class="swiper-slide wow fadeInUp" data-wow-delay="0.5s"><a href="javascript:void(0);" class="companies-wrapper"><div class="companies-media"><img src="/images/companies/logo5.png" alt="" /></div></a></div>
                  <div class="swiper-slide wow fadeInUp" data-wow-delay="0.6s"><a href="javascript:void(0);" class="companies-wrapper"><div class="companies-media"><img src="/images/companies/logo6.png" alt="" /></div></a></div>
                  <div class="swiper-slide wow fadeInUp" data-wow-delay="0.7s"><a href="javascript:void(0);" class="companies-wrapper"><div class="companies-media"><img src="/images/companies/logo1.png" alt="" /></div></a></div>
                  <div class="swiper-slide wow fadeInUp" data-wow-delay="0.8s"><a href="javascript:void(0);" class="companies-wrapper"><div class="companies-media"><img src="/images/companies/logo2.png" alt="" /></div></a></div>
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

