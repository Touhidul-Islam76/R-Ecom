const repository = process.env.GITHUB_REPOSITORY?.split('/')[1]
const baseURL = process.env.NUXT_APP_BASE_URL || (repository ? `/${repository}/` : '/')
const withBase = (assetPath: string) => `${baseURL}${assetPath.replace(/^\/+/, '')}`

export default defineNuxtConfig({
  compatibilityDate: '2026-04-08',
  nitro: {
    prerender: {
      failOnError: false,
    },
  },
  css: [
    '~/assets/css/main.css',
  ],
  routeRules: {
    '/index.vue': { redirect: '/' },
  },
  plugins: [
    { src: '~/plugins/base-url-rewrite.client.ts', mode: 'client' },
    { src: '~/plugins/bootstrap.client.ts', mode: 'client' },
    { src: '~/plugins/loader.client.ts', mode: 'client' },
    { src: '~/plugins/plantzone.client.ts', mode: 'client' },
  ],

  

  app: {
    baseURL,
    head: {
      title: 'FasionAble',
      link: [
        { rel: 'icon', type: 'image/x-icon', href: withBase('/images/20.jpg.jpeg') },

        { rel: 'stylesheet', href: withBase('/icons/iconly/index.min.css') },
        { rel: 'stylesheet', href: withBase('/vendor/magnific-popup/magnific-popup.min.css') },
        { rel: 'stylesheet', href: withBase('/vendor/bootstrap-select/dist/css/bootstrap-select.min.css') },
        { rel: 'stylesheet', href: withBase('/vendor/swiper/swiper-bundle.min.css') },
        { rel: 'stylesheet', href: withBase('/vendor/nouislider/nouislider.min.css') },
        { rel: 'stylesheet', href: withBase('/vendor/animate/animate.css') },
        { rel: 'stylesheet', href: withBase('/vendor/lightgallery/dist/css/lightgallery.css') },
        { rel: 'stylesheet', href: withBase('/vendor/lightgallery/dist/css/lg-thumbnail.css') },
        { rel: 'stylesheet', href: withBase('/vendor/lightgallery/dist/css/lg-zoom.css') },

        { rel: 'stylesheet', href: withBase('/css/style.css') },
        { rel: 'stylesheet', href: withBase('/css/skin/skin-1.css') },
        { rel: 'stylesheet', href: withBase('/css/custom.css') },
      ],
      script: []
    },
  },
})


