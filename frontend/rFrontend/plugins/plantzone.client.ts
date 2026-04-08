export default defineNuxtPlugin(async () => {
  if (!import.meta.client) return

  const alreadyLoaded = document.getElementById('plantzone-scripts-loaded')
  if (alreadyLoaded) return

  const marker = document.createElement('meta')
  marker.id = 'plantzone-scripts-loaded'
  document.head.appendChild(marker)

  const loadScript = (src: string) =>
    new Promise<void>((resolve, reject) => {
      const existing = document.querySelector(`script[src="${src}"]`)
      if (existing) {
        resolve()
        return
      }

      const script = document.createElement('script')
      script.src = src
      script.async = false
      script.onload = () => resolve()
      script.onerror = () => reject(new Error(`Failed to load ${src}`))
      document.body.appendChild(script)
    })

  const scripts = [
    '/js/jquery.min.js',
    '/vendor/wow/wow.min.js',
    '/vendor/bootstrap/dist/js/bootstrap.bundle.min.js',
    '/vendor/bootstrap-select/dist/js/bootstrap-select.min.js',
    '/vendor/bootstrap-touchspin/bootstrap-touchspin.js',
    '/vendor/counter/waypoints-min.js',
    '/vendor/counter/counterup.min.js',
    '/vendor/swiper/swiper-bundle.min.js',
    '/vendor/magnific-popup/magnific-popup.js',
    '/vendor/group-slide/group-loop.js',
    '/vendor/imagesloaded/imagesloaded.js',
    '/vendor/masonry/masonry-4.2.2.js',
    '/vendor/masonry/isotope.pkgd.min.js',
    '/vendor/countdown/jquery.countdown.js',
    '/vendor/wnumb/wNumb.js',
    '/vendor/nouislider/nouislider.min.js',
    '/js/dz.carousel.js',
    '/vendor/lightgallery/dist/lightgallery.min.js',
    '/vendor/lightgallery/dist/plugins/thumbnail/lg-thumbnail.min.js',
    '/vendor/lightgallery/dist/plugins/zoom/lg-zoom.min.js',
    '/js/dz.ajax.js',
    '/js/custom.js',
  ]

  for (const src of scripts) {
    try {
      await loadScript(src)
    } catch (error) {
      console.error(error)
    }
  }

  type SwiperCtor = new (selector: string | Element, options?: Record<string, any>) => any

  const initHomeSwipers = () => {
    const Swiper = (window as any).Swiper as SwiperCtor | undefined
    if (!Swiper) return

    const categoryEl = document.querySelector('.homepage-category-swiper') as
      | (Element & { _initDone?: boolean })
      | null

    if (categoryEl && !categoryEl._initDone) {
      categoryEl._initDone = true

      new Swiper('.homepage-category-swiper', {
        slidesPerView: 5,
        spaceBetween: 30,
        speed: 1500,
        loop: true,
        navigation: {
          nextEl: '.homepage-category-next',
          prevEl: '.homepage-category-prev',
        },
        breakpoints: {
          1600: { slidesPerView: 5, spaceBetween: 30 },
          1200: { slidesPerView: 5, spaceBetween: 20 },
          991: { slidesPerView: 4, spaceBetween: 20 },
          575: { slidesPerView: 3, spaceBetween: 15 },
          320: { slidesPerView: 2, spaceBetween: 15 },
        },
      })
    }

    const blogEl = document.querySelector('.homepage-blog-swiper') as
      | (Element & { _initDone?: boolean })
      | null

    if (blogEl && !blogEl._initDone) {
      blogEl._initDone = true

      new Swiper('.homepage-blog-swiper', {
        slidesPerView: 4,
        spaceBetween: 30,
        speed: 1500,
        loop: true,
        breakpoints: {
          1600: { slidesPerView: 4, spaceBetween: 30 },
          1200: { slidesPerView: 3, spaceBetween: 20 },
          991: { slidesPerView: 2, spaceBetween: 20 },
          575: { slidesPerView: 1.3, spaceBetween: 15 },
          320: { slidesPerView: 1.1, spaceBetween: 15 },
        },
      })
    }
  }

  setTimeout(() => {
    initHomeSwipers()
  }, 300)

  // Keep navbar-toggler above the slide-in nav on mobile
  // CSS: .mo-left .navbar-toggler.open { z-index: 999 }
  document.addEventListener('click', (e) => {
    const toggler = (e.target as Element).closest('.navicon')
    if (!toggler) return
    toggler.classList.toggle('open')
  })
})