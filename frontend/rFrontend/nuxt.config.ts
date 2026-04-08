export default defineNuxtConfig({
  css: [
    '~/assets/css/main.css',
  ],
  routeRules: {
    '/index.vue': { redirect: '/' },
  },
  plugins: [
    { src: '~/plugins/bootstrap.client.ts', mode: 'client' },
    { src: '~/plugins/loader.client.ts', mode: 'client' },
    { src: '~/plugins/plantzone.client.ts', mode: 'client' },
  ],

  

  app: {
    head: {
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/images/favicon.png' },

        { rel: 'stylesheet', href: '/icons/iconly/index.min.css' },
        { rel: 'stylesheet', href: '/vendor/magnific-popup/magnific-popup.min.css' },
        { rel: 'stylesheet', href: '/vendor/bootstrap-select/dist/css/bootstrap-select.min.css' },
        { rel: 'stylesheet', href: '/vendor/swiper/swiper-bundle.min.css' },
        { rel: 'stylesheet', href: '/vendor/nouislider/nouislider.min.css' },
        { rel: 'stylesheet', href: '/vendor/animate/animate.css' },
        { rel: 'stylesheet', href: '/vendor/lightgallery/dist/css/lightgallery.css' },
        { rel: 'stylesheet', href: '/vendor/lightgallery/dist/css/lg-thumbnail.css' },
        { rel: 'stylesheet', href: '/vendor/lightgallery/dist/css/lg-zoom.css' },

        { rel: 'stylesheet', href: '/css/style.css' },
        { rel: 'stylesheet', href: '/css/skin/skin-1.css' },
        { rel: 'stylesheet', href: '/css/custom.css' },
      ],
      script: []
    },
  },
})

