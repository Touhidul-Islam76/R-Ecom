<script setup lang="ts">
import { ref, onMounted, nextTick } from 'vue'
useHead({
  title: 'FasionAble',
  meta: [
    { charset: 'utf-8' },
    { 'http-equiv': 'X-UA-Compatible', content: 'IE=edge' },
    { name: 'author', content: 'DexignZone' },
    { name: 'robots', content: 'index, follow' },
    { name: 'format-detection', content: 'telephone=no' },
    {
      name: 'description',
      content:
        'Elevate your online retail presence with FasionAble HTML Template. Meticulously crafted, this responsive and feature-rich template offers a seamless and visually stunning shopping experience for fashion enthusiasts.',
    },
    { name: 'viewport', content: 'width=device-width, initial-scale=1' },
  ],
  link: [
    { rel: 'canonical', href: 'https://fasionable.dexignzone.com/xhtml/forget-password.html' },
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
const showResetForm = ref(false)

const openResetForm = () => {
  showResetForm.value = true
}

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
      <section class="px-3">
        <div class="row">
          <div class="col-xxl-6 col-xl-6 col-lg-6 col-md-12 p-a0">
            <div class="login-slider">
              <div class="banner-login" style="background-image: url(/images/registration/pic2.jpg)">
                <div class="banner-content">
                  <h4 class="sub-title">Log in</h4>
                  <h2 class="title">WelCome Back</h2>
                  <p class="text">Sign back in to your account to access your courses and embody the art of being human.</p>
                </div>
              </div>
            </div>
          </div>

          <div class="col-xxl-6 col-xl-6 col-lg-6 end-side-content justify-content-center">
            <div v-show="!showResetForm" class="login-area">
              <h2 class="text-secondary text-center">Forgot Password</h2>
              <p class="text-center m-b25">Enter your e-mail address below to reset your password.</p>
              <form>
                <div class="m-b30">
                  <label class="label-title">Email Address</label>
                  <input name="dzName" required class="form-control" placeholder="Email Address" type="email" />
                </div>
                <div class="d-flex justify-content-between">
                  <NuxtLink to="/login" class="btn btn-outline-secondary btnhover text-uppercase">Back</NuxtLink>
                  <button type="button" class="btn btn-secondary btnhover text-uppercase submit-btn" @click="openResetForm">Submit</button>
                </div>
              </form>
            </div>

            <div v-show="showResetForm" class="forget-password-area">
              <h2 class="text-secondary text-center">Reset Password</h2>
              <p class="text-center m-b25">Almost done, enter your new password and you're all set to go</p>
              <form>
                <div class="m-b30">
                  <label class="label-title">New Password</label>
                  <div class="secure-input">
                    <input type="password" name="password" class="form-control dz-password" placeholder="New Password" />
                    <div class="show-pass">
                      <i class="eye-open fa-regular fa-eye"></i>
                    </div>
                  </div>
                </div>
                <div class="m-b30">
                  <label class="label-title">Confirm Password</label>
                  <div class="secure-input">
                    <input type="password" name="password" class="form-control dz-password" placeholder="Confirm Password" />
                    <div class="show-pass">
                      <i class="eye-open fa-regular fa-eye"></i>
                    </div>
                  </div>
                </div>
                <div class="text-center">
                  <NuxtLink to="/account-dashboard" class="btn btn-secondary btnhover text-uppercase sign-btn">Reset Password</NuxtLink>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>

    
  </div>
</template>
