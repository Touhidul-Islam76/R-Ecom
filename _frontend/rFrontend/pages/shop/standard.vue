<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useShopCatalogStore, type ShopProductItem, type ShopProductVariant } from '~/stores/shopCatalogStore'
import { fetchProductsRequest } from '~/public/js/services/axiosClient.js'
import { useCartStore } from '~/stores/cartStore'
import { useWishlistStore } from '~/stores/wishlistStore'

type SliderApi = {
  on: (eventName: string, handler: (values: string[]) => void) => void
  off?: (eventName: string, handler: (values: string[]) => void) => void
  set: (values: number[]) => void
  updateOptions?: (options: { start?: number[]; range?: { min: number; max: number } }, fireSetEvent?: boolean) => void
}

type SliderElement = HTMLElement & {
  noUiSlider?: SliderApi
}

type ProductListResponse = {
  current_page?: number
  data?: ShopProductItem[]
  last_page?: number
  per_page?: number
  total?: number
}

const SORT_OPTIONS = [
  { label: 'Default sorting', value: '' },
  { label: 'Popularity', value: 'rating_desc' },
  { label: 'Average rating', value: 'rating_desc' },
  { label: 'Latest', value: 'latest' },
  { label: 'Low to high', value: 'price_asc' },
  { label: 'High to low', value: 'price_desc' },
]

const SIZE_ORDER: Array<ShopProductVariant['size']> = ['S', 'M', 'L', 'XL', 'XXL']

const shopCatalogStore = useShopCatalogStore()
const { products, categoryOptions, isLoadingProducts, errorMessage } = storeToRefs(shopCatalogStore)
const filters = shopCatalogStore.filters
const pagination = shopCatalogStore.pagination
const cartStore = useCartStore()
const wishlistStore = useWishlistStore()
const authUser = useAuthUser()
const toast = useToast()

useHead({
  title: 'PlantZone Shop Standard',
  meta: [
    { charset: 'utf-8' },
    { 'http-equiv': 'X-UA-Compatible', content: 'IE=edge' },
    { name: 'author', content: 'DexignZone' },
    { name: 'robots', content: 'index, follow' },
    { name: 'format-detection', content: 'telephone=no' },
    {
      name: 'keywords',
      content:
        'garden shop, flowers, landscape gardener, delivery, ecommerce, greenery, shopping, store, plant template, plant store',
    },
    {
      name: 'description',
      content:
        'Elevate your online retail presence with PlantZone Shop & eCommerce HTML Template and deliver a modern shopping experience for plant enthusiasts.',
    },
    { property: 'og:title', content: 'PlantZone Shop & eCommerce HTML Template | DexignZone' },
    {
      property: 'og:description',
      content:
        'Elevate your online retail presence with PlantZone Shop & eCommerce HTML Template and deliver a modern shopping experience for plant enthusiasts.',
    },
    { property: 'og:image', content: 'https://plantzone.dexignzone.com/xhtml/social-image.png' },
    { name: 'twitter:title', content: 'PlantZone: Shop & eCommerce HTML Template | DexignZone' },
    {
      name: 'twitter:description',
      content:
        'Elevate your online retail presence with PlantZone Shop & eCommerce HTML Template and deliver a modern shopping experience for plant enthusiasts.',
    },
    { name: 'twitter:image', content: 'https://plantzone.dexignzone.com/xhtml/social-image.png' },
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'viewport', content: 'width=device-width, initial-scale=1' },
  ],
  link: [
    { rel: 'canonical', href: 'https://plantzone.dexignzone.com/xhtml/shop-standard.html' },
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

const suspendAutoFetch = ref(true)
const isResettingSlider = ref(false)
const sliderMinPrice = ref(0)
const sliderMaxPrice = ref(400)
let sliderSetHandler: ((values: string[]) => void) | null = null
let filterDebounceTimer: ReturnType<typeof setTimeout> | null = null

const toNumber = (value: unknown): number => {
  const numeric = Number(value)
  return Number.isNaN(numeric) ? 0 : numeric
}

const formatPrice = (value: unknown): string => `$${toNumber(value).toFixed(2)}`

const currentProducts = computed(() => products.value)

const categoryCounts = computed(() => {
  const map = new Map<number, number>()
  for (const product of products.value) {
    const categoryId = product.category?.id ?? product.category_id
    if (!categoryId) continue
    map.set(categoryId, (map.get(categoryId) ?? 0) + 1)
  }
  return map
})

const sideCategories = computed(() => {
  if (categoryOptions.value.length) {
    return categoryOptions.value.map((category) => ({
      id: category.id,
      name: category.name,
      count: categoryCounts.value.get(category.id) ?? 0,
    }))
  }

  const fallback = new Map<number, string>()
  for (const product of products.value) {
    const id = product.category?.id ?? product.category_id
    const name = product.category?.name
    if (id && name) fallback.set(id, name)
  }

  return Array.from(fallback.entries()).map(([id, name]) => ({
    id,
    name,
    count: categoryCounts.value.get(id) ?? 0,
  }))
})

const sizeFilters = computed(() =>
  SIZE_ORDER.map((size) => {
    const count = products.value.filter((product) =>
      (product.variants ?? []).some((variant) => variant.size === size),
    ).length

    return {
      id: `size_filter_${size}`,
      name: size,
      count,
    }
  }),
)

const colorTags = computed(() => {
  const map = new Map<string, number>()
  for (const product of products.value) {
    for (const variant of product.variants ?? []) {
      const color = variant.color?.trim()
      if (!color) continue
      map.set(color, (map.get(color) ?? 0) + 1)
    }
  }
  return Array.from(map.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8)
    .map(([name]) => name)
})

const featuredProducts = computed(() =>
  [...products.value]
    .sort((a, b) => toNumber(b.rating) - toNumber(a.rating))
    .slice(0, 3),
)

const displayFrom = computed(() => {
  if (pagination.total === 0) return 0
  return (pagination.current_page - 1) * pagination.per_page + 1
})

const displayTo = computed(() => {
  if (pagination.total === 0) return 0
  return Math.min(pagination.current_page * pagination.per_page, pagination.total)
})

const pageNumbers = computed(() => {
  if (pagination.last_page <= 1) return []
  const start = Math.max(1, pagination.current_page - 1)
  const end = Math.min(pagination.last_page, start + 2)
  const pages: number[] = []
  for (let page = start; page <= end; page += 1) pages.push(page)
  return pages
})

const getProductImage = (product: ShopProductItem | null | undefined) =>
  product?.image_url || product?.image || '/assets/default/profile4.jpg'

const getProductRating = (product: ShopProductItem) => Math.max(0, Math.min(5, Math.round(toNumber(product.rating))))

const getProductReviewCount = (product: ShopProductItem) => {
  const base = (product.variants ?? []).length
  return base ? base * 25 : 0
}

const getCurrentPrice = (product: ShopProductItem | null | undefined) => {
  if (!product) return 0
  const discountedVariant = (product.variants ?? []).find(
    (variant) => variant.discount_price !== null && toNumber(variant.discount_price) > 0,
  )
  return discountedVariant ? toNumber(discountedVariant.discount_price) : toNumber(product.price)
}

const getPriceBoundsFromProducts = (items: ShopProductItem[]): { min: number; max: number } => {
  const prices = items
    .map((item) => getCurrentPrice(item))
    .filter((price) => Number.isFinite(price) && price >= 0)

  if (!prices.length) {
    return { min: 0, max: 400 }
  }

  const min = Math.floor(Math.min(...prices))
  const max = Math.ceil(Math.max(...prices))

  if (min === max) {
    return { min: Math.max(0, min - 1), max: max + 1 }
  }

  return { min, max }
}

const syncSliderLabels = (minValue: number, maxValue: number) => {
  const minEl = document.getElementById('slider-margin-value-min')
  const maxEl = document.getElementById('slider-margin-value-max')
  if (minEl) minEl.textContent = `Min Price: $${Math.round(minValue)}`
  if (maxEl) maxEl.textContent = `Max Price: $${Math.round(maxValue)}`
}

const applySliderBounds = () => {
  const sliderEl = document.getElementById('slider-tooltips') as SliderElement | null
  const slider = sliderEl?.noUiSlider
  if (!slider) return

  const min = sliderMinPrice.value
  const max = sliderMaxPrice.value
  const currentMin = filters.isPriceTouched && filters.minPrice !== null ? filters.minPrice : min
  const currentMax = filters.isPriceTouched && filters.maxPrice !== null ? filters.maxPrice : max

  isResettingSlider.value = true
  if (slider.updateOptions) {
    slider.updateOptions({
      start: [currentMin, currentMax],
      range: { min, max },
    }, false)
  }
  slider.set([currentMin, currentMax])
  syncSliderLabels(currentMin, currentMax)

  setTimeout(() => {
    isResettingSlider.value = false
  }, 0)
}

const loadGlobalPriceBounds = async () => {
  const perPage = 100
  let page = 1
  let lastPage = 1
  const allProducts: ShopProductItem[] = []

  try {
    do {
      const response = await fetchProductsRequest({ page, per_page: perPage })
      const payload = (response?.data ?? {}) as ProductListResponse
      allProducts.push(...(payload.data ?? []))
      lastPage = payload.last_page ?? 1
      page += 1
    } while (page <= lastPage && page <= 100)

    const bounds = getPriceBoundsFromProducts(allProducts)
    sliderMinPrice.value = bounds.min
    sliderMaxPrice.value = bounds.max
  } catch {
    const bounds = getPriceBoundsFromProducts(products.value)
    sliderMinPrice.value = bounds.min
    sliderMaxPrice.value = bounds.max
  }
}

const getOldPrice = (product: ShopProductItem | null | undefined): number | null => {
  if (!product) return null
  const discountedVariant = (product.variants ?? []).find(
    (variant) => variant.discount_price !== null && toNumber(variant.discount_price) > 0,
  )
  if (!discountedVariant) return null
  return toNumber(discountedVariant.price)
}

const isOnSale = (product: ShopProductItem) => getOldPrice(product) !== null
const isLoggedIn = computed(() =>
  Boolean(authUser.value?.id || authUser.value?.email || authUser.value?.phone || authUser.value?.role),
)
const isWishlisted = (productId: number) => wishlistStore.hasProduct(Number(productId))

const pickDefaultVariant = (product: ShopProductItem): ShopProductVariant | null => {
  const variants = product.variants ?? []
  if (!variants.length) return null
  return variants[0] ?? null
}

const addProductToCart = async (product: ShopProductItem) => {
  const defaultVariant = pickDefaultVariant(product)
  const unitPrice = defaultVariant
    ? toNumber(defaultVariant.discount_price) > 0
      ? toNumber(defaultVariant.discount_price)
      : toNumber(defaultVariant.price)
    : getCurrentPrice(product)

  await cartStore.addItem({
    product_id: product.id,
    title: product.title,
    image: getProductImage(product),
    price: unitPrice,
    size: defaultVariant?.size ?? null,
    color: defaultVariant?.color ?? null,
    quantity: 1,
  })

  toast.success('Product added to cart.')
}

const toggleWishlist = async (product: ShopProductItem) => {
  if (!isLoggedIn.value) return

  const wasWishlisted = isWishlisted(product.id)
  const ok = await wishlistStore.toggleProduct(product.id)

  if (!ok) {
    toast.error('Could not update wishlist right now. Please try again.')
    return
  }

  toast.success(wasWishlisted ? 'Removed from wishlist.' : 'Added to wishlist.')
}

const handleAuthChange = () => {
  if (isLoggedIn.value) {
    void wishlistStore.refreshFromServer()
    return
  }

  wishlistStore.resetLocalWishlist()
}

const queueFilteredFetch = () => {
  if (suspendAutoFetch.value) return
  if (filterDebounceTimer) clearTimeout(filterDebounceTimer)
  filterDebounceTimer = setTimeout(() => {
    shopCatalogStore.fetchProducts(1)
  }, 350)
}

const toggleCategory = (categoryId: number) => {
  const index = filters.categoryIds.indexOf(categoryId)
  if (index >= 0) {
    filters.categoryIds.splice(index, 1)
  } else {
    filters.categoryIds.push(categoryId)
  }
}

const toggleSize = (size: string) => {
  const index = filters.sizes.indexOf(size)
  if (index >= 0) {
    filters.sizes.splice(index, 1)
  } else {
    filters.sizes.push(size)
  }
}

const toggleColor = (color: string) => {
  const index = filters.colors.indexOf(color)
  if (index >= 0) {
    filters.colors.splice(index, 1)
  } else {
    filters.colors.push(color)
  }
}

const goToPage = (page: number) => {
  if (page < 1 || page > pagination.last_page || page === pagination.current_page) return
  shopCatalogStore.fetchProducts(page)
}

const resetFilters = () => {
  shopCatalogStore.resetFilters()

  const sliderEl = document.getElementById('slider-tooltips') as SliderElement | null
  if (sliderEl?.noUiSlider) {
    isResettingSlider.value = true
    sliderEl.noUiSlider.set([sliderMinPrice.value, sliderMaxPrice.value])
    syncSliderLabels(sliderMinPrice.value, sliderMaxPrice.value)
    setTimeout(() => {
      isResettingSlider.value = false
      filters.minPrice = null
      filters.maxPrice = null
      filters.isPriceTouched = false
    }, 0)
  }

  queueFilteredFetch()
}

const bindPriceSlider = () => {
  const sliderEl = document.getElementById('slider-tooltips') as SliderElement | null
  const slider = sliderEl?.noUiSlider
  if (!slider) return false

  applySliderBounds()

  if (sliderSetHandler && slider.off) {
    slider.off('set', sliderSetHandler)
  }

  sliderSetHandler = (values) => {
    if (isResettingSlider.value) return
    filters.isPriceTouched = true
    filters.minPrice = Math.round(toNumber(values[0]))
    filters.maxPrice = Math.round(toNumber(values[1]))
  }

  slider.on('set', sliderSetHandler)
  return true
}

const waitForSliderAndBind = () => {
  let attempts = 0
  const interval = setInterval(() => {
    attempts += 1
    if (bindPriceSlider() || attempts >= 30) {
      clearInterval(interval)
    }
  }, 150)
}

watch(
  () => [
    filters.search,
    filters.topCategoryId,
    filters.sort,
    filters.minPrice,
    filters.maxPrice,
    filters.isPriceTouched,
  ],
  queueFilteredFetch,
)

watch(() => filters.categoryIds.slice(), queueFilteredFetch, { deep: true })
watch(() => filters.sizes.slice(), queueFilteredFetch, { deep: true })
watch(() => filters.colors.slice(), queueFilteredFetch, { deep: true })

onMounted(async () => {
  cartStore.hydrateCart()
  wishlistStore.hydrateWishlist()
  if (isLoggedIn.value) {
    void wishlistStore.refreshFromServer()
  }

  const plantZone = (window as Window & { PlantZone?: { init: () => void; load: () => void } }).PlantZone
  if (plantZone) {
    plantZone.init()
    plantZone.load()
  }

  await Promise.all([shopCatalogStore.fetchProducts(1), shopCatalogStore.fetchCategoryOptions(), loadGlobalPriceBounds()])

  nextTick(() => {
    const plantZoneCarousel = (window as Window & { PlantZoneCarousel?: { load: () => void } }).PlantZoneCarousel
    if (plantZoneCarousel) {
      plantZoneCarousel.load()
    }

    waitForSliderAndBind()
    suspendAutoFetch.value = false
  })

  if (typeof window !== 'undefined') {
    window.addEventListener('auth-change', handleAuthChange)
  }
})

onBeforeUnmount(() => {
  const sliderEl = document.getElementById('slider-tooltips') as SliderElement | null
  if (sliderEl?.noUiSlider && sliderSetHandler && sliderEl.noUiSlider.off) {
    sliderEl.noUiSlider.off('set', sliderSetHandler)
  }

  if (filterDebounceTimer) {
    clearTimeout(filterDebounceTimer)
    filterDebounceTimer = null
  }

  if (typeof window !== 'undefined') {
    window.removeEventListener('auth-change', handleAuthChange)
  }
})
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
                  <li class="breadcrumb-item"><NuxtLink to="/">Home</NuxtLink></li>
                  <li class="breadcrumb-item">Shop Standard</li>
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
                            <input
                              v-model.trim="filters.search"
                              name="dzSearch"
                              type="search"
                              class="form-control"
                              placeholder="Search Here"
                              @keyup.enter="queueFilteredFetch"
                            >
                            <div class="input-group-addon">
                              <button name="submit" value="Submit" type="button" class="btn" @click="queueFilteredFetch">
                                <i class="icon feather icon-search"></i>
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div class="widget widget_categories">
                        <h3 class="widget-title">Product Category</h3>
                        <ul>
                          <li v-for="item in sideCategories" :key="item.id" class="cat-item cat-item-26">
                            <div class="custom-control custom-checkbox d-flex">
                              <input
                                :id="`category_filter_${item.id}`"
                                :checked="filters.categoryIds.includes(item.id)"
                                type="checkbox"
                                class="form-check-input square"
                                @change="toggleCategory(item.id)"
                              >
                              <label class="form-check-label text-start flex-1" :for="`category_filter_${item.id}`">{{ item.name }}</label>({{ item.count }})
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
                              <input
                                :id="item.id"
                                :checked="filters.sizes.includes(item.name)"
                                type="checkbox"
                                class="form-check-input square"
                                @change="toggleSize(item.name)"
                              >
                              <label class="form-check-label text-start flex-1" :for="item.id">{{ item.name }}</label>({{ item.count }})
                            </div>
                          </li>
                        </ul>
                      </div>

                      <div class="widget recent-posts-entry">
                        <h2 class="widget-title">Featured Products</h2>
                        <div class="widget-post-bx">
                          <div v-for="(item, idx) in featuredProducts" :key="idx" class="widget-post clearfix">
                            <div class="dz-media"><a href="javascript:void(0);"><img :src="getProductImage(item)" alt="/" /></a></div>
                            <div class="dz-info">
                              <h6 class="title"><a href="javascript:void(0);">{{ item.title }}</a></h6>
                              <span class="price">
                                {{ formatPrice(getCurrentPrice(item)) }}
                                <del v-if="getOldPrice(item)">{{ formatPrice(getOldPrice(item)) }}</del>
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div class="widget widget_tag_cloud">
                        <h2 class="widget-title">Colors</h2>
                        <div class="tagcloud">
                          <a
                            v-for="(tag, idx) in colorTags"
                            :key="idx"
                            href="javascript:void(0);"
                            :class="{ active: filters.colors.includes(tag) }"
                            @click.prevent="toggleColor(tag)"
                          >{{ tag }}</a>
                        </div>
                      </div>

                      <a href="javascript:void(0);" class="btn btn-lg font-14 btn-secondary btn-sharp btn-block text-uppercase" @click.prevent="resetFilters">Reset ALL FILTERS</a>
                    </aside>
                  </div>
                </div>
              </div>

              <div class="col-80 col-xl-9">
                <div class="filter-wrapper">
                  <div class="filter-left-area">
                    <span>Showing {{ displayFrom }}-{{ displayTo }} Of {{ pagination.total }} Results</span>
                  </div>
                  <div class="filter-right-area">
                    <a href="javascript:void(0);" class="panel-btn">
                      <svg class="me-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 25 25" width="20" height="20"><g id="Layer_28" data-name="Layer 28"><path d="M2.54,5H15v.5A1.5,1.5,0,0,0,16.5,7h2A1.5,1.5,0,0,0,20,5.5V5h2.33a.5.5,0,0,0,0-1H20V3.5A1.5,1.5,0,0,0,18.5,2h-2A1.5,1.5,0,0,0,15,3.5V4H2.54a.5.5,0,0,0,0,1ZM16,3.5a.5.5,0,0,1,.5-.5h2a.5.5,0,0,1,.5.5v2a.5.5,0,0,1-.5.5h-2a.5.5,0,0,1-.5-.5Z"></path><path d="M22.4,20H18v-.5A1.5,1.5,0,0,0,16.5,18h-2A1.5,1.5,0,0,0,13,19.5V20H2.55a.5.5,0,0,0,0,1H13v.5A1.5,1.5,0,0,0,14.5,23h2A1.5,1.5,0,0,0,18,21.5V21h4.4a.5.5,0,0,0,0-1ZM17,21.5a.5.5,0,0,1-.5.5h-2a.5.5,0,0,1-.5-.5v-2a.5.5,0,0,1,.5-.5h2a.5.5,0,0,1,.5.5Z"></path><path d="M8.5,15h2A1.5,1.5,0,0,0,12,13.5V13H22.45a.5.5,0,1,0,0-1H12v-.5A1.5,1.5,0,0,0,10.5,10h-2A1.5,1.5,0,0,0,7,11.5V12H2.6a.5.5,0,1,0,0,1H7v.5A1.5,1.5,0,0,0,8.5,15ZM8,11.5a.5.5,0,0,1,.5-.5h2a.5.5,0,0,1,.5.5v2a.5.5,0,0,1-.5.5h-2a.5.5,0,0,1-.5-.5Z"></path></g></svg>
                      Filter
                    </a>
                    <div class="form-group">
                      <select v-model="filters.sort" class="default-select">
                        <option v-for="option in SORT_OPTIONS" :key="option.label" :value="option.value">{{ option.label }}</option>
                      </select>
                    </div>
                    <div class="form-group Category">
                      <select v-model="filters.topCategoryId" class="default-select">
                        <option value="">Categories</option>
                        <option v-for="category in sideCategories" :key="`top-cat-${category.id}`" :value="String(category.id)">
                          {{ category.name }}
                        </option>
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
                  <div v-if="errorMessage" class="col-12">
                    <div class="alert alert-danger m-b20">{{ errorMessage }}</div>
                  </div>
                  <div v-if="isLoadingProducts" class="col-12">
                    <div class="alert alert-info m-b20">Loading products...</div>
                  </div>
                  <div v-else-if="!currentProducts.length" class="col-12">
                    <div class="alert alert-warning m-b20">No products found for the selected filters.</div>
                  </div>
                  <div class="col-12 tab-content shop-" id="pills-tabContent">
                    <div class="tab-pane fade" id="tab-list-list" role="tabpanel" aria-labelledby="tab-list-list-btn">
                      <div class="row">
                        <div v-for="(item, idx) in currentProducts" :key="`list-${item.id}-${idx}`" class="col-md-12 col-sm-12 col-xxxl-6">
                          <div class="dz-shop-card style-2">
                            <div class="dz-media">
                              <img :src="getProductImage(item)" alt="image">
                              <div v-if="isOnSale(item)" class="product-tag">
                                <span class="badge badge-secondary">Sale</span>
                              </div>
                            </div>
                            <div class="dz-content">
                              <div class="dz-header">
                                <div>
                                  <h2 class="title mb-0"><NuxtLink :to="`/product/${item.id}`">{{ item.title }}</NuxtLink></h2>
                                  <ul class="dz-tags">
                                    <li v-if="item.category?.name"><a href="javascript:void(0);">{{ item.category.name }},</a></li>
                                    <li v-if="item.brand?.name"><a href="javascript:void(0);">{{ item.brand.name }}</a></li>
                                  </ul>
                                </div>
                                <div class="review-num">
                                  <ul class="dz-rating">
                                    <li v-for="starIndex in 5" :key="`list-star-${item.id}-${starIndex}`" :class="{ 'star-fill': starIndex <= getProductRating(item) }">
                                      <i class="flaticon-star-1"></i>
                                    </li>
                                  </ul>
                                  <span><a href="javascript:void(0);">{{ getProductReviewCount(item) }} Review</a></span>
                                </div>
                              </div>
                              <div class="dz-body">
                                <div class="dz-rating-box">
                                  <div>
                                    <p class="dz-para">{{ item.short_description || 'Product details are available on the product page.' }}</p>
                                  </div>
                                </div>
                                <div class="rate">
                                  <div class="d-flex align-items-center mb-xl-3 mb-2">
                                    <div class="meta-content m-0">
                                      <span class="price-name">Price</span>
                                      <span class="price">
                                        {{ formatPrice(getCurrentPrice(item)) }}
                                        <del v-if="getOldPrice(item)">{{ formatPrice(getOldPrice(item)) }}</del>
                                      </span>
                                    </div>
                                  </div>
                                  <div class="d-flex">
                                    <button type="button" class="btn btn-secondary btn-md btn-icon" @click="addProductToCart(item)">
                                      <i class="icon feather icon-shopping-cart d-md-none d-block"></i>
                                      <span class="d-md-block d-none">Add to cart</span>
                                    </button>
                                    <button
                                      v-if="isLoggedIn"
                                      type="button"
                                      class="btn btn-primary meta-icon dz-wishicon list-wish-btn ms-2"
                                      :class="{ active: isWishlisted(item.id) }"
                                      @click="toggleWishlist(item)"
                                    >
                                      <i class="icon feather icon-heart dz-heart"></i>
                                      <i class="icon feather icon-heart-on dz-heart-fill"></i>
                                    </button>
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
                        <div v-for="(item, idx) in currentProducts" :key="`col-${item.id}-${idx}`" class="col-6 col-xl-4 col-lg-6 col-md-6 col-sm-6 m-md-b15 m-sm-b0 m-b30">
                          <div class="shop-card">
                            <div class="dz-media">
                              <img :src="getProductImage(item)" alt="image">
                              <div class="shop-meta">
                                <button
                                  v-if="isLoggedIn"
                                  type="button"
                                  class="btn btn-primary meta-icon dz-wishicon"
                                  :class="{ active: isWishlisted(item.id) }"
                                  @click="toggleWishlist(item)"
                                >
                                  <i class="icon feather icon-heart dz-heart"></i>
                                  <i class="icon feather icon-heart-on dz-heart-fill"></i>
                                </button>
                                <NuxtLink
                                  :to="`/product/${item.id}`"
                                  class="btn btn-primary meta-icon dz-viewicon"
                                >
                                  <i class="flaticon flaticon-eye d-md-none d-block"></i>
                                  <span class="d-md-block d-none"><i class="flaticon flaticon-eye"></i></span>
                                </NuxtLink>
                                <button type="button" class="btn btn-primary meta-icon dz-carticon" @click="addProductToCart(item)">
                                  <i class="flaticon flaticon-basket"></i>
                                  <i class="flaticon flaticon-basket-on dz-heart-fill"></i>
                                </button>
                              </div>
                            </div>
                            <div class="dz-content">
                              <h2 class="title"><NuxtLink :to="`/product/${item.id}`">{{ item.title }}</NuxtLink></h2>
                              <span class="price">
                                {{ formatPrice(getCurrentPrice(item)) }}
                                <del v-if="getOldPrice(item)">{{ formatPrice(getOldPrice(item)) }}</del>
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div class="tab-pane fade active show" id="tab-list-grid" role="tabpanel" aria-labelledby="tab-list-grid-btn">
                      <div class="row gx-xl-4 g-3">
                        <div v-for="(item, idx) in currentProducts" :key="`grid-${item.id}-${idx}`" class="col-6 col-xl-3 col-lg-4 col-md-4 col-sm-6 m-md-b30 m-b30">
                          <div class="shop-card style-1">
                            <div class="dz-media">
                              <img :src="getProductImage(item)" alt="image">
                            </div>
                            <div class="shop-meta">
                              <NuxtLink
                                :to="`/product/${item.id}`"
                                class="btn btn-primary btn-md w-100"
                              >
                                <i class="fa-solid fa-eye"></i>
                                <span class="d-lg-block d-none">Quick View</span>
                              </NuxtLink>
                              <div class="btn btn-primary meta-icon dz-refresh">
                                <i class="flaticon flaticon-refresh dz-refresh"></i>
                                <i class="flaticon flaticon-refresh-on dz-refresh-fill"></i>
                              </div>
                              <button
                                v-if="isLoggedIn"
                                type="button"
                                class="btn btn-primary meta-icon dz-wishicon"
                                :class="{ active: isWishlisted(item.id) }"
                                @click="toggleWishlist(item)"
                              >
                                <i class="icon feather icon-heart dz-heart"></i>
                                <i class="icon feather icon-heart-on dz-heart-fill"></i>
                              </button>
                              <button type="button" class="btn btn-primary meta-icon dz-carticon" @click="addProductToCart(item)">
                                <i class="flaticon flaticon-shopping-cart-1 dz-cart"></i>
                                <i class="flaticon flaticon-shopping-cart-1-on dz-cart-fill"></i>
                              </button>
                            </div>
                            <div class="dz-content">
                              <h2 class="title"><NuxtLink :to="`/product/${item.id}`">{{ item.title }}</NuxtLink></h2>
                              <span class="price">
                                {{ formatPrice(getCurrentPrice(item)) }}
                                <del v-if="getOldPrice(item)">{{ formatPrice(getOldPrice(item)) }}</del>
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div class="row page mt-0">
                  <div class="col-md-6"><p class="page-text">Showing {{ displayFrom }}-{{ displayTo }} Of {{ pagination.total }} Results</p></div>
                  <div class="col-md-6">
                    <nav aria-label="Blog Pagination">
                      <ul class="pagination style-1">
                        <li class="page-item" :class="{ disabled: pagination.current_page <= 1 }">
                          <a class="page-link prev" href="javascript:void(0);" @click.prevent="goToPage(pagination.current_page - 1)">Prev</a>
                        </li>
                        <li v-for="page in pageNumbers" :key="`page-${page}`" class="page-item">
                          <a
                            class="page-link"
                            :class="{ active: page === pagination.current_page }"
                            href="javascript:void(0);"
                            @click.prevent="goToPage(page)"
                          >{{ page }}</a>
                        </li>
                        <li class="page-item" :class="{ disabled: pagination.current_page >= pagination.last_page }">
                          <a class="page-link next" href="javascript:void(0);" @click.prevent="goToPage(pagination.current_page + 1)">Next</a>
                        </li>
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
              <div class="col-lg-6 col-md-12"><div class="section-head style-2 d-block wow fadeInUp" data-wow-delay="0.2s"><h2 class="title mb-4">Subscribe Newsletter & Get Plant News</h2></div></div>
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
.dz-shop-card .dz-media,
.shop-card .dz-media,
.widget-post .dz-media {
  display: flex;
  align-items: center;
  justify-content: center;
}

.dz-shop-card .dz-media img,
.shop-card .dz-media img,
.widget-post .dz-media img {
  width: 250px !important;
  height: 250px !important;
  object-fit: cover;
  object-position: center;
  display: block;
}

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

.tagcloud a.active {
  background-color: #0f5132;
  color: #fff;
}

.pagination .page-item.disabled .page-link {
  opacity: 0.5;
  pointer-events: none;
}

.shop-card .shop-meta .meta-icon.dz-wishicon,
.shop-card.style-2 .shop-meta .meta-icon.dz-wishicon,
.list-wish-btn {
  border-radius: 6px !important;
}

.list-wish-btn {
  width: 42px;
  min-width: 42px;
  height: 42px;
  padding: 0;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.shop-card .shop-meta .meta-icon {
  cursor: pointer;
}

.shop-card.style-1 {
  border-radius: 4px !important;
  overflow: visible;
  border: 1px solid #e7ecef;
  box-shadow: 0 8px 22px rgba(22, 34, 51, 0.08);
  background: #fff;
  padding-top: 0;
  margin-top: 0;
}

.shop-card.style-1 .dz-media {
  padding: 12px 12px 0;
  margin-top: 0;
}

.shop-card.style-1 .dz-media img {
  width: 100% !important;
  height: auto !important;
  max-width: none;
  aspect-ratio: 1 / 1;
  border-radius: 4px;
}

.shop-card.style-1 .dz-content {
  width: 100%;
  margin: 0;
  padding: 14px 12px 16px;
  text-align: left;
  border-radius: 0 0 4px 4px;
}

.shop-card.style-1 .dz-content .title {
  font-size: 16px;
  line-height: 1.35;
}

.shop-card.style-1 .dz-content .price {
  font-size: 14px;
}

.shop-card.style-1 .shop-meta {
  z-index: 20;
}

.shop-card.style-1 .shop-meta .btn,
.shop-card.style-1 .shop-meta .meta-icon,
.shop-card.style-1 .shop-meta .btn i,
.shop-card.style-1 .shop-meta .meta-icon i,
.shop-card.style-1 .shop-meta .btn span {
  color: #fff !important;
  opacity: 1;
  visibility: visible;
}

.shop-card.style-1 .shop-meta .meta-icon i {
  font-size: 20px;
}

.shop-card.style-1 .shop-meta .meta-icon:hover,
.shop-card.style-1 .shop-meta .meta-icon:focus,
.shop-card.style-1 .shop-meta .btn:hover,
.shop-card.style-1 .shop-meta .btn:focus {
  color: #fff !important;
}

.shop-card.style-1 .shop-meta .meta-icon.active,
.shop-card.style-1 .shop-meta .meta-icon.active i {
  color: #1f2937 !important;
}
@media (max-width: 767.98px) {
  .shop-card.style-1 {
    box-shadow: 0 5px 14px rgba(22, 34, 51, 0.07);
  }

  .shop-card.style-1 .dz-media {
    padding: 10px 10px 0;
  }

  .shop-card.style-1 .dz-content {
    padding: 12px 10px 14px;
  }

  .shop-card.style-1 .dz-content .title {
    font-size: 15px;
  }

  .shop-card.style-1 .dz-content .price {
    font-size: 13px;
  }
}

</style>


