export default defineNuxtPlugin(async () => {
  if (!import.meta.client) return

  const { app } = useRuntimeConfig()
  const withBase = (assetPath: string) => `${app.baseURL}${assetPath.replace(/^\/+/, '')}`
  const bridgeBootstrapJQueryPlugins = () => {
    const w = window as any
    const $ = w.jQuery || w.$
    const bs = w.bootstrap

    if (!$?.fn || !bs) return

    if (!$.fn.scrollspy && bs.ScrollSpy) {
      $.fn.scrollspy = function (option?: any) {
        return this.each(function () {
          const el = this as Element
          const opts = typeof option === 'object' ? option : undefined
          const instance = bs.ScrollSpy.getOrCreateInstance(el, opts)

          if (typeof option === 'string' && typeof instance?.[option] === 'function') {
            instance[option]()
          } else if (typeof instance?.refresh === 'function') {
            instance.refresh()
          }
        })
      }
    }

    if (!$.fn.tab && bs.Tab) {
      $.fn.tab = function (option?: any) {
        return this.each(function () {
          const el = this as Element
          const instance = bs.Tab.getOrCreateInstance(el)

          if (typeof option === 'string' && typeof instance?.[option] === 'function') {
            instance[option]()
          } else if (typeof instance?.show === 'function') {
            instance.show()
          }
        })
      }
    }

    if (!$.fn.modal && bs.Modal) {
      $.fn.modal = function (option?: any) {
        return this.each(function () {
          const el = this as Element
          const opts = typeof option === 'object' ? option : undefined
          const instance = bs.Modal.getOrCreateInstance(el, opts)

          if (typeof option === 'string' && typeof instance?.[option] === 'function') {
            instance[option]()
          } else if (typeof instance?.show === 'function') {
            instance.show()
          }
        })
      }
    }
  }

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
    withBase('/js/jquery.min.js'),
    withBase('/vendor/wow/wow.min.js'),
    withBase('/vendor/bootstrap/dist/js/bootstrap.bundle.min.js'),
    withBase('/vendor/bootstrap-select/dist/js/bootstrap-select.min.js'),
    withBase('/vendor/bootstrap-touchspin/bootstrap-touchspin.js'),
    withBase('/vendor/counter/waypoints-min.js'),
    withBase('/vendor/counter/counterup.min.js'),
    withBase('/vendor/swiper/swiper-bundle.min.js'),
    withBase('/vendor/magnific-popup/magnific-popup.js'),
    withBase('/vendor/group-slide/group-loop.js'),
    withBase('/vendor/imagesloaded/imagesloaded.js'),
    withBase('/vendor/masonry/masonry-4.2.2.js'),
    withBase('/vendor/masonry/isotope.pkgd.min.js'),
    withBase('/vendor/countdown/jquery.countdown.js'),
    withBase('/vendor/wnumb/wNumb.js'),
    withBase('/vendor/nouislider/nouislider.min.js'),
    withBase('/js/dz.carousel.js'),
    withBase('/vendor/lightgallery/dist/lightgallery.min.js'),
    withBase('/vendor/lightgallery/dist/plugins/thumbnail/lg-thumbnail.min.js'),
    withBase('/vendor/lightgallery/dist/plugins/zoom/lg-zoom.min.js'),
    withBase('/js/dz.ajax.js'),
    withBase('/js/custom.js'),
  ]

  for (const src of scripts) {
    try {
      if (src.endsWith('/js/custom.js')) {
        bridgeBootstrapJQueryPlugins()
      }

      await loadScript(src)

      if (src.endsWith('/vendor/bootstrap/dist/js/bootstrap.bundle.min.js')) {
        bridgeBootstrapJQueryPlugins()
      }
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
