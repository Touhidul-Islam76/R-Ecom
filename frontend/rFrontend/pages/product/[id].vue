<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import {
  createProductReviewRequest,
  fetchProductReviewsRequest,
  fetchProductsRequest,
  getProductRequest,
  reserveProductStockRequest,
} from '~/public/js/services/axiosClient.js'
import { useCartStore } from '~/stores/cartStore'

type ProductVariant = {
  id?: number
  size: 'S' | 'M' | 'L' | 'XL' | 'XXL'
  color: string
  quantity: number
  price: number | string
  discount_price?: number | string | null
}

type ProductItem = {
  id: number
  title: string
  slug: string
  short_description?: string | null
  description?: string | null
  details?: string | null
  price: number | string
  rating?: number | string | null
  image?: string | null
  image_url?: string | null
  category_id?: number | null
  brand_id?: number | null
  category?: { id: number; name: string } | null
  brand?: { id: number; name: string } | null
  variants?: ProductVariant[]
}

type ProductReviewUser = {
  id?: number
  name?: string
  image?: string | null
  image_url?: string | null
}

type ProductReviewItem = {
  id: number
  rating: number | string
  title?: string | null
  comment?: string | null
  is_approved?: boolean
  verified_purchase?: boolean
  helpful_count?: number | null
  created_at?: string
  user?: ProductReviewUser | null
}

type PaginatedResponse<T> = {
  current_page?: number
  data?: T[]
  last_page?: number
  per_page?: number
  total?: number
}

type OutOfStockItem = {
  size?: string
  color?: string
  requested_quantity?: number
  available_quantity?: number
}

const route = useRoute()
const router = useRouter()
const toast = useToast()
const cartStore = useCartStore()

const product = ref<ProductItem | null>(null)
const relatedProducts = ref<ProductItem[]>([])
const reviews = ref<ProductReviewItem[]>([])
const isLoading = ref(false)
const isLoadingReviews = ref(false)
const isSubmittingReview = ref(false)
const errorMessage = ref('')
const notice = ref('')
const reviewMeta = ref({
  current_page: 1,
  last_page: 1,
  per_page: 5,
  total: 0,
})
const reviewForm = ref({
  rating: 5,
  title: '',
  comment: '',
})

const quantity = ref(1)
const selectedSize = ref('')
const selectedColor = ref('')
const isZoomActive = ref(false)
const zoomX = ref(50)
const zoomY = ref(50)
const zoomPaneSide = ref<'right' | 'left'>('right')
const canZoom = ref(false)
const ZOOM_MEDIA_QUERY = '(min-width: 992px) and (hover: hover) and (pointer: fine)'
let zoomMediaQuery: MediaQueryList | null = null
let activeReviewRequestId = 0

const toNumber = (value: unknown): number => {
  const numeric = Number(value)
  return Number.isNaN(numeric) ? 0 : numeric
}

const formatPrice = (value: unknown): string => `$${toNumber(value).toFixed(2)}`

const productImage = computed(() => product.value?.image_url || product.value?.image || '/assets/default/profile4.jpg')
const productDescription = computed(() => {
  const source =
    product.value?.short_description ??
    product.value?.description ??
    product.value?.details ??
    ''

  const text = String(source ?? '').trim()
  return text || 'No description available for this product yet.'
})

const escapeHtml = (value: string) =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')

const productDescriptionHtml = computed(() => {
  const text = productDescription.value
  const hasHtmlTag = /<[a-z][\s\S]*>/i.test(text)

  if (hasHtmlTag) {
    return text
  }

  return escapeHtml(text).replace(/\n/g, '<br>')
})

const availableVariants = computed(() => {
  return (product.value?.variants ?? []).filter((variant) => toNumber(variant.quantity) > 0)
})

const sizeOptions = computed(() => {
  const sizes = new Set<string>()
  for (const variant of availableVariants.value) {
    sizes.add(variant.size)
  }
  return Array.from(sizes)
})

const colorOptions = computed(() => {
  const colors = new Set<string>()
  for (const variant of availableVariants.value) {
    if (selectedSize.value && variant.size !== selectedSize.value) continue
    colors.add(variant.color)
  }
  return Array.from(colors)
})

const hasVariantData = computed(() => (product.value?.variants?.length ?? 0) > 0)
const showVariantSelectors = computed(() => sizeOptions.value.length > 0 && colorOptions.value.length > 0)
const isVariantOutOfStock = computed(() => hasVariantData.value && !showVariantSelectors.value)

const selectedVariant = computed(() => {
  const variants = availableVariants.value
  if (!variants.length) return null

  return (
    variants.find(
      (variant) =>
        (!selectedSize.value || variant.size === selectedSize.value) &&
        (!selectedColor.value || variant.color === selectedColor.value),
    ) ?? variants[0]
  )
})

const currentPrice = computed(() => {
  if (selectedVariant.value && toNumber(selectedVariant.value.discount_price) > 0) {
    return toNumber(selectedVariant.value.discount_price)
  }
  if (selectedVariant.value) {
    return toNumber(selectedVariant.value.price)
  }
  return toNumber(product.value?.price)
})

const oldPrice = computed(() => {
  if (selectedVariant.value && toNumber(selectedVariant.value.discount_price) > 0) {
    return toNumber(selectedVariant.value.price)
  }
  return null
})

const ratingValue = computed(() => Math.max(0, Math.min(5, Math.round(toNumber(product.value?.rating)))))
const lensStyle = computed(() => ({
  left: `${zoomX.value}%`,
  top: `${zoomY.value}%`,
}))

const zoomPaneStyle = computed(() => ({
  backgroundImage: `url('${productImage.value}')`,
  backgroundPosition: `${zoomX.value}% ${zoomY.value}%`,
}))

const reviewCount = computed(() => reviewMeta.value.total || reviews.value.length)
const reviewAverage = computed(() => toNumber(product.value?.rating))
const isReviewFormVisible = computed(() => {
  if (typeof window === 'undefined') return false
  return Boolean(localStorage.getItem('auth_token'))
})

const reviewCurrentPage = computed(() => Math.max(1, Number(reviewMeta.value.current_page) || 1))
const reviewLastPage = computed(() => Math.max(1, Number(reviewMeta.value.last_page) || 1))
const isReviewPrevDisabled = computed(() => isLoadingReviews.value || reviewCurrentPage.value <= 1)
const isReviewNextDisabled = computed(() => isLoadingReviews.value || reviewCurrentPage.value >= reviewLastPage.value)
const shouldShowReviewPagination = computed(() => {
  const perPage = Math.max(1, Number(reviewMeta.value.per_page) || 5)
  const total = Math.max(0, Number(reviewMeta.value.total) || reviews.value.length)
  const inferredLastPage = Math.max(1, Math.ceil(total / perPage))
  return Math.max(reviewLastPage.value, inferredLastPage) > 1
})

const reviewPageNumbers = computed(() => {
  const totalPages = reviewLastPage.value
  const currentPage = reviewCurrentPage.value
  const pages: number[] = []

  let start = Math.max(1, currentPage - 2)
  let end = Math.min(totalPages, start + 4)
  start = Math.max(1, end - 4)

  for (let page = start; page <= end; page += 1) {
    pages.push(page)
  }

  return pages
})

useHead(() => ({
  title: product.value ? `${product.value.title} | PlantZone` : 'Product Details | PlantZone',
}))

const syncVariantSelection = () => {
  const variants = availableVariants.value
  if (!variants.length) {
    selectedSize.value = ''
    selectedColor.value = ''
    return
  }

  if (!selectedSize.value) {
    selectedSize.value = variants[0].size
  }

  const colorsForSize = variants
    .filter((variant) => variant.size === selectedSize.value)
    .map((variant) => variant.color)

  if (!colorsForSize.includes(selectedColor.value)) {
    selectedColor.value = colorsForSize[0] ?? variants[0].color
  }
}

const getApiErrorMessage = (error: unknown, fallback: string) => {
  const err = error as {
    response?: { data?: { message?: string; errors?: Record<string, string[]> } }
    message?: string
  }

  const apiMessage = err?.response?.data?.message
  if (apiMessage) return apiMessage

  const validationErrors = err?.response?.data?.errors ?? {}
  const firstKey = Object.keys(validationErrors)[0]
  if (firstKey && validationErrors[firstKey]?.length) {
    return validationErrors[firstKey][0]
  }

  return err?.message || fallback
}

const getReviewUserImage = (review: ProductReviewItem) =>
  review.user?.image_url || review.user?.image || '/assets/default/profile4.jpg'

const getReviewRating = (review: ProductReviewItem) => Math.max(1, Math.min(5, Math.round(toNumber(review.rating))))

const formatReviewDate = (value: string | undefined) => {
  if (!value) return ''

  const parsed = new Date(value)
  if (Number.isNaN(parsed.getTime())) return ''

  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(parsed)
}

const loadRelatedProducts = async () => {
  if (!product.value?.category_id) {
    relatedProducts.value = []
    return
  }

  try {
    const response = await fetchProductsRequest({
      page: 1,
      category_id: product.value.category_id,
      sort: 'latest',
    })

    const payload = (response?.data ?? {}) as PaginatedResponse<ProductItem>
    relatedProducts.value = (payload.data ?? [])
      .filter((item) => item.id !== product.value?.id)
      .slice(0, 4)
  } catch {
    relatedProducts.value = []
  }
}

const loadProductReviews = async (page = 1) => {
  const productId = Number(route.params.id || product.value?.id)
  if (!productId) {
    reviews.value = []
    reviewMeta.value = { current_page: 1, last_page: 1, per_page: 5, total: 0 }
    return
  }

  const safePage = Math.max(1, Math.floor(Number(page) || 1))
  const requestId = ++activeReviewRequestId
  const previousMeta = { ...reviewMeta.value }

  isLoadingReviews.value = true

  try {
    const response = await fetchProductReviewsRequest(productId, {
      page: safePage,
      per_page: reviewMeta.value.per_page || 5,
    })

    if (requestId !== activeReviewRequestId) return

    const payload = (response?.data ?? {}) as PaginatedResponse<ProductReviewItem>
    const reviewRecord =
      payload.data && !Array.isArray(payload.data)
        ? (payload.data as unknown as Record<string, ProductReviewItem>)
        : {}
    const normalizedReviews = Array.isArray(payload.data) ? payload.data : Object.values(reviewRecord)

    reviews.value = normalizedReviews

    const resolvedPerPage = Math.max(1, Number(payload.per_page ?? previousMeta.per_page ?? 5) || 5)
    const resolvedTotal = Math.max(0, Number(payload.total ?? previousMeta.total ?? normalizedReviews.length) || 0)
    const inferredLastPage = Math.max(1, Math.ceil(resolvedTotal / resolvedPerPage))

    reviewMeta.value = {
      current_page: Math.max(1, Number(payload.current_page ?? previousMeta.current_page ?? safePage) || safePage),
      last_page: Math.max(
        1,
        Number(payload.last_page ?? previousMeta.last_page ?? inferredLastPage) || inferredLastPage,
      ),
      per_page: resolvedPerPage,
      total: resolvedTotal,
    }
  } catch (error) {
    if (requestId !== activeReviewRequestId) return

    console.error(error)
    toast.error('Failed to load reviews.')
  } finally {
    if (requestId === activeReviewRequestId) {
      isLoadingReviews.value = false
    }
  }
}

const goToReviewPage = async (page: number) => {
  if (isLoadingReviews.value) return
  if (page < 1 || page > reviewLastPage.value || page === reviewCurrentPage.value) return
  await loadProductReviews(page)
}

const loadProduct = async () => {
  const productId = Number(route.params.id)
  if (!Number.isFinite(productId) || productId <= 0) {
    errorMessage.value = 'Invalid product id.'
    product.value = null
    reviews.value = []
    reviewMeta.value = { current_page: 1, last_page: 1, per_page: 5, total: 0 }
    return
  }

  isLoading.value = true
  errorMessage.value = ''

  try {
    const response = await getProductRequest(productId)
    product.value = response?.data as ProductItem
    quantity.value = 1
    syncVariantSelection()
    await Promise.all([loadRelatedProducts(), loadProductReviews(1)])
  } catch (error) {
    console.error(error)
    errorMessage.value = 'Product not found or failed to load.'
    product.value = null
    relatedProducts.value = []
    reviews.value = []
    reviewMeta.value = { current_page: 1, last_page: 1, per_page: 5, total: 0 }
  } finally {
    isLoading.value = false
  }
}

const updateQuantity = (delta: number) => {
  const next = quantity.value + delta
  quantity.value = next < 1 ? 1 : next
}

const normalizeVariantName = (size: unknown, color: unknown) => {
  const normalizedSize = String(size ?? '').trim() || 'Unknown size'
  const normalizedColor = String(color ?? '').trim() || 'Unknown color'
  return `Size ${normalizedSize}, Color ${normalizedColor}`
}

const reserveCurrentSelectionStock = async () => {
  if (!product.value || !selectedVariant.value) {
    toast.error('Please select a valid product option first.')
    return false
  }

  const requestedQuantity = Math.max(1, Math.floor(Number(quantity.value) || 1))

  try {
    const response = await reserveProductStockRequest(product.value.id, {
      size: selectedVariant.value.size,
      color: selectedVariant.value.color,
      quantity: requestedQuantity,
    })

    const updatedVariant = (response?.data?.variant ?? null) as ProductVariant | null
    if (updatedVariant && product.value.variants?.length) {
      const targetIndex = product.value.variants.findIndex((variant) =>
        Number(variant.id ?? 0) > 0 && Number(variant.id) === Number(updatedVariant.id),
      )

      if (targetIndex >= 0) {
        product.value.variants[targetIndex] = {
          ...product.value.variants[targetIndex],
          ...updatedVariant,
        }
      } else {
        const fallbackIndex = product.value.variants.findIndex(
          (variant) =>
            variant.size === selectedVariant.value?.size &&
            String(variant.color).toLowerCase() === String(selectedVariant.value?.color).toLowerCase(),
        )

        if (fallbackIndex >= 0) {
          const remaining = Math.max(0, toNumber(product.value.variants[fallbackIndex].quantity) - requestedQuantity)
          product.value.variants[fallbackIndex] = {
            ...product.value.variants[fallbackIndex],
            quantity: remaining,
          }
        }
      }
    }

    return true
  } catch (error) {
    const err = error as {
      response?: { data?: { out_of_stock?: OutOfStockItem[]; message?: string } }
    }

    const outOfStockItems = err?.response?.data?.out_of_stock ?? []
    if (outOfStockItems.length) {
      const outOfStockMessage = outOfStockItems
        .map((item) => {
          const optionName = normalizeVariantName(item.size, item.color)
          const available = Math.max(0, Number(item.available_quantity ?? 0))
          const requested = Math.max(1, Number(item.requested_quantity ?? requestedQuantity))

          if (available <= 0) {
            return `${optionName} is out of stock.`
          }

          return `${optionName} has only ${available} left (requested ${requested}).`
        })
        .join(' ')

      toast.error(outOfStockMessage)
      return false
    }

    toast.error(getApiErrorMessage(error, 'Unable to reserve stock right now.'))
    return false
  }
}

const addToCart = async (goCheckout = false) => {
  if (!product.value) return

  const stockReserved = await reserveCurrentSelectionStock()
  if (!stockReserved) return

  await cartStore.addItem({
    product_id: product.value.id,
    title: product.value.title,
    image: productImage.value,
    price: currentPrice.value,
    size: selectedVariant.value?.size ?? (selectedSize.value || null),
    color: selectedVariant.value?.color ?? (selectedColor.value || null),
    quantity: quantity.value,
  })
  notice.value = goCheckout ? 'Product added. Redirecting to checkout...' : 'Product added to cart.'
  toast.success(goCheckout ? 'Product reserved and sent to checkout.' : 'Product reserved and added to cart.')

  if (goCheckout) {
    router.push('/shop-checkout')
  }
}

const buyNow = async () => addToCart(true)

const submitReview = async () => {
  const productId = Number(product.value?.id)
  if (!productId) return

  if (!isReviewFormVisible.value) {
    toast.info('Please login first to submit a review.')
    return
  }

  isSubmittingReview.value = true

  try {
    await createProductReviewRequest(productId, {
      rating: Math.max(1, Math.min(5, Number(reviewForm.value.rating) || 5)),
      title: reviewForm.value.title.trim() || null,
      comment: reviewForm.value.comment.trim() || null,
    })

    reviewForm.value = {
      rating: 5,
      title: '',
      comment: '',
    }

    toast.success('Review submitted successfully. It may appear after moderation approval.')
    await loadProductReviews(1)
  } catch (error) {
    const message = getApiErrorMessage(error, 'Failed to submit review.')
    toast.error(message)
  } finally {
    isSubmittingReview.value = false
  }
}

const syncZoomCapability = () => {
  if (typeof window === 'undefined') return
  canZoom.value = window.matchMedia(ZOOM_MEDIA_QUERY).matches
  if (!canZoom.value) {
    isZoomActive.value = false
  }
}

const detectZoomPaneSide = (rect: DOMRect) => {
  const paneWidth = 380
  const gutter = 18
  const rightSpace = window.innerWidth - rect.right - gutter
  const leftSpace = rect.left - gutter

  zoomPaneSide.value = rightSpace >= paneWidth || rightSpace >= leftSpace ? 'right' : 'left'
}

const onImageMouseEnter = (event: MouseEvent) => {
  if (!canZoom.value) return

  const target = event.currentTarget as HTMLElement | null
  if (!target) return

  detectZoomPaneSide(target.getBoundingClientRect())
  isZoomActive.value = true
}

const onImageMouseMove = (event: MouseEvent) => {
  if (!canZoom.value) return

  const target = event.currentTarget as HTMLElement | null
  if (!target) return

  const rect = target.getBoundingClientRect()
  if (!rect.width || !rect.height) return

  detectZoomPaneSide(rect)

  const rawX = ((event.clientX - rect.left) / rect.width) * 100
  const rawY = ((event.clientY - rect.top) / rect.height) * 100

  const lensWidthPercent = (120 / rect.width) * 100
  const lensHeightPercent = (120 / rect.height) * 100
  const minX = lensWidthPercent / 2
  const maxX = 100 - minX
  const minY = lensHeightPercent / 2
  const maxY = 100 - minY

  zoomX.value = Math.max(minX, Math.min(maxX, rawX))
  zoomY.value = Math.max(minY, Math.min(maxY, rawY))
  isZoomActive.value = true
}

const onImageMouseLeave = () => {
  isZoomActive.value = false
}

watch(
  () => route.params.id,
  () => {
    loadProduct()
  },
)

watch(selectedSize, () => {
  syncVariantSelection()
})

onMounted(() => {
  cartStore.hydrateCart()
  syncZoomCapability()
  if (typeof window !== 'undefined') {
    zoomMediaQuery = window.matchMedia(ZOOM_MEDIA_QUERY)
    if (zoomMediaQuery.addEventListener) {
      zoomMediaQuery.addEventListener('change', syncZoomCapability)
    } else {
      zoomMediaQuery.addListener(syncZoomCapability)
    }
  }

  loadProduct()
})

onBeforeUnmount(() => {
  if (!zoomMediaQuery) return

  if (zoomMediaQuery.removeEventListener) {
    zoomMediaQuery.removeEventListener('change', syncZoomCapability)
  } else {
    zoomMediaQuery.removeListener(syncZoomCapability)
  }
})
</script>

<template>
  <div id="bg">
    <div class="page-wraper">
      <div class="page-content">
        <div class="dz-bnr-inr" style="background-image:url('/images/background/bg1.jpg');">
          <div class="container">
            <div class="dz-bnr-inr-entry">
              <nav aria-label="breadcrumb" class="breadcrumb-row">
                <ul class="breadcrumb">
                  <li class="breadcrumb-item"><NuxtLink to="/">Home</NuxtLink></li>
                  <li class="breadcrumb-item"><NuxtLink to="/shop-standard">Shop Standard</NuxtLink></li>
                  <li class="breadcrumb-item">{{ product?.title || 'Product' }}</li>
                </ul>
              </nav>
            </div>
          </div>
        </div>

        <section class="content-inner">
          <div class="container">
            <div v-if="errorMessage" class="alert alert-danger m-b20">{{ errorMessage }}</div>
            <div v-if="notice" class="alert alert-success m-b20">{{ notice }}</div>
            <div v-if="isLoading" class="alert alert-info m-b20">Loading product details...</div>

            <div v-if="product" class="product-focus-wrap">
              <div class="product-main-grid">
                <div class="product-main-media">
                  <div class="product-media-wrap rounded border p-3 bg-white" @mouseleave="onImageMouseLeave">
                    <div
                      class="product-image-stage"
                      :class="{ 'can-zoom': canZoom }"
                      @mouseenter="onImageMouseEnter"
                      @mousemove="onImageMouseMove"
                      @mouseleave="onImageMouseLeave"
                    >
                      <img class="product-main-image" :src="productImage" :alt="product.title">
                      <div v-if="canZoom" v-show="isZoomActive" class="zoom-lens" :style="lensStyle"></div>
                    </div>
                    <div
                      v-if="canZoom && isZoomActive"
                      class="product-zoom-pane d-none d-lg-block"
                      :class="`side-${zoomPaneSide}`"
                      :style="zoomPaneStyle"
                    ></div>
                  </div>
                </div>

                <div class="product-main-details">
                  <div class="dz-product-detail style-4 bg-white p-4 rounded border">
                    <div class="dz-content">
                      <h2 class="title mb-2">{{ product.title }}</h2>

                      <div class="d-flex align-items-center m-b10 gap-2">
                        <ul class="dz-rating m-0">
                          <li v-for="star in 5" :key="`star-${star}`" :class="{ 'star-fill': star <= ratingValue }">
                            <i class="flaticon-star-1"></i>
                          </li>
                        </ul>
                        <span class="text-muted">({{ toNumber(product.rating).toFixed(1) }})</span>
                      </div>

                      <div class="m-b20">
                        <h5 class="mb-2">Product Description</h5>
                        <p class="product-description-text mb-0" v-html="productDescriptionHtml"></p>
                      </div>

                      <div class="meta-content m-b20">
                        <span class="price">
                          {{ formatPrice(currentPrice) }}
                          <del v-if="oldPrice !== null">{{ formatPrice(oldPrice) }}</del>
                        </span>
                      </div>

                      <template v-if="showVariantSelectors">
                        <div class="m-b20">
                          <label class="form-label m-r10">Size</label>
                          <div class="variant-wrap">
                            <button
                              v-for="size in sizeOptions"
                              :key="`size-${size}`"
                              type="button"
                              class="variant-btn"
                              :class="{ active: selectedSize === size }"
                              @click="selectedSize = size"
                            >
                              {{ size }}
                            </button>
                          </div>
                        </div>

                        <div class="m-b20">
                          <label class="form-label m-r10">Color</label>
                          <div class="variant-wrap">
                            <button
                              v-for="color in colorOptions"
                              :key="`color-${color}`"
                              type="button"
                              class="variant-btn"
                              :class="{ active: selectedColor === color }"
                              @click="selectedColor = color"
                            >
                              {{ color }}
                            </button>
                          </div>
                        </div>
                      </template>

                      <p v-else-if="isVariantOutOfStock" class="text-muted m-b20">Out of stock</p>

                      <div class="m-b20 d-flex align-items-center gap-3">
                        <label class="form-label m-0">Quantity</label>
                        <div class="qty-wrap">
                          <button type="button" class="qty-btn" :disabled="isVariantOutOfStock" @click="updateQuantity(-1)">-</button>
                          <input v-model.number="quantity" type="number" min="1" class="qty-input" :disabled="isVariantOutOfStock">
                          <button type="button" class="qty-btn" :disabled="isVariantOutOfStock" @click="updateQuantity(1)">+</button>
                        </div>
                      </div>

                      <div class="btn-row m-b20">
                        <button type="button" class="btn btn-outline-secondary btn-lg w-100" :disabled="isVariantOutOfStock" @click="buyNow">
                          Buy Now
                        </button>
                        <button type="button" class="btn btn-secondary btn-lg w-100" :disabled="isVariantOutOfStock" @click="addToCart()">
                          Add To Cart
                        </button>
                      </div>

                      <div class="dz-info m-0">
                        <ul><li><strong>SKU:</strong></li><li>{{ product.slug }}</li></ul>
                        <ul v-if="product.category?.name"><li><strong>Category:</strong></li><li>{{ product.category.name }}</li></ul>
                        <ul v-if="product.brand?.name"><li><strong>Brand:</strong></li><li>{{ product.brand.name }}</li></ul>
                        <ul v-if="selectedVariant"><li><strong>Stock:</strong></li><li>{{ selectedVariant.quantity }}</li></ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section class="content-inner-1 border-top product-review-section">
          <div class="container">
            <div class="section-head style-5 d-md-flex align-items-center justify-content-between">
              <div class="left-content">
                <h2 class="title mb-0">Customer Reviews</h2>
                <p class="text-muted mb-0 mt-1">{{ reviewCount }} verified customer feedback entries</p>
              </div>
            </div>

            <div class="review-summary-card m-b30">
              <div class="review-summary-score">
                <h3 class="score">{{ reviewAverage.toFixed(1) }}</h3>
                <div>
                  <ul class="dz-rating review-stars m-0">
                    <li v-for="star in 5" :key="`avg-star-${star}`" :class="{ 'star-fill': star <= Math.round(reviewAverage) }">
                      <i class="flaticon-star-1"></i>
                    </li>
                  </ul>
                  <p class="text-muted mb-0">{{ reviewCount }} review(s)</p>
                </div>
              </div>
            </div>

            <div class="row g-4">
              <div class="col-lg-8">
                <div v-if="isLoadingReviews && !reviews.length" class="alert alert-info m-b20">Loading reviews...</div>
                <div v-else-if="!reviews.length" class="alert alert-warning m-b20">No reviews yet for this product.</div>

                <div v-for="review in reviews" :key="`review-${review.id}`" class="review-item-card m-b20">
                  <div class="review-item-head">
                    <div class="review-user">
                      <img :src="getReviewUserImage(review)" :alt="review.user?.name || 'Reviewer'" class="review-avatar">
                      <div>
                        <h6 class="mb-0">{{ review.user?.name || 'Anonymous User' }}</h6>
                        <small class="text-muted">{{ formatReviewDate(review.created_at) }}</small>
                      </div>
                    </div>
                    <span v-if="review.verified_purchase" class="badge bg-success-subtle text-success">Verified Purchase</span>
                  </div>

                  <ul class="dz-rating review-stars m-b10">
                    <li v-for="star in 5" :key="`review-star-${review.id}-${star}`" :class="{ 'star-fill': star <= getReviewRating(review) }">
                      <i class="flaticon-star-1"></i>
                    </li>
                  </ul>

                  <h6 v-if="review.title" class="mb-2">{{ review.title }}</h6>
                  <p class="mb-2 review-comment">{{ review.comment || 'No comment provided.' }}</p>
                  <small class="text-muted">Helpful: {{ toNumber(review.helpful_count) }}</small>
                </div>

                <div v-if="shouldShowReviewPagination" class="mt-3">
                  <nav aria-label="Review Pagination">
                    <ul class="pagination style-1 mb-0">
                      <li class="page-item" :class="{ disabled: isReviewPrevDisabled }">
                        <button
                          class="page-link prev"
                          :class="{ 'is-disabled-link': isReviewPrevDisabled }"
                          type="button"
                          :disabled="isReviewPrevDisabled"
                          @click.prevent="goToReviewPage(reviewCurrentPage - 1)"
                        >Prev</button>
                      </li>
                      <li v-for="page in reviewPageNumbers" :key="`review-page-${page}`" class="page-item">
                        <button
                          class="page-link"
                          :class="{ active: page === reviewCurrentPage }"
                          type="button"
                          :disabled="isLoadingReviews"
                          @click.prevent="goToReviewPage(page)"
                        >{{ page }}</button>
                      </li>
                      <li class="page-item" :class="{ disabled: isReviewNextDisabled }">
                        <button
                          class="page-link next"
                          :class="{ 'is-disabled-link': isReviewNextDisabled }"
                          type="button"
                          :disabled="isReviewNextDisabled"
                          @click.prevent="goToReviewPage(reviewCurrentPage + 1)"
                        >Next</button>
                      </li>
                    </ul>
                  </nav>
                </div>
              </div>

              <div class="col-lg-4">
                <div class="review-form-card">
                  <h5 class="mb-3">Write a Review</h5>

                  <div v-if="!isReviewFormVisible" class="review-login-card">
                    <h6 class="mb-2">Share Your Experience</h6>
                    <p class="text-muted mb-3">
                      Sign in to post your review, track your feedback, and help other customers make better choices.
                    </p>
                    <div class="review-login-actions">
                      <NuxtLink to="/login" class="btn btn-secondary w-100">Login To Review</NuxtLink>
                      <NuxtLink to="/registration" class="btn btn-outline-secondary w-100">Create Account</NuxtLink>
                    </div>
                  </div>

                  <form v-else @submit.prevent="submitReview">
                    <div class="m-b15">
                      <label class="form-label">Rating</label>
                      <select v-model.number="reviewForm.rating" class="form-select">
                        <option :value="5">5 - Excellent</option>
                        <option :value="4">4 - Good</option>
                        <option :value="3">3 - Average</option>
                        <option :value="2">2 - Poor</option>
                        <option :value="1">1 - Bad</option>
                      </select>
                    </div>

                    <div class="m-b15">
                      <label class="form-label">Title</label>
                      <input v-model.trim="reviewForm.title" type="text" class="form-control" maxlength="255" placeholder="Review title">
                    </div>

                    <div class="m-b20">
                      <label class="form-label">Comment</label>
                      <textarea
                        v-model.trim="reviewForm.comment"
                        class="form-control"
                        rows="4"
                        maxlength="3000"
                        placeholder="Share your experience with this product"
                      ></textarea>
                    </div>

                    <button type="submit" class="btn btn-secondary w-100" :disabled="isSubmittingReview">
                      {{ isSubmittingReview ? 'Submitting...' : 'Submit Review' }}
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section v-if="relatedProducts.length" class="content-inner-1 overflow-hidden border-top">
          <div class="container">
            <div class="section-head style-5 d-md-flex align-items-center justify-content-between">
              <div class="left-content"><h2 class="title mb-0">Related Products</h2></div>
            </div>
            <div class="row gx-xl-4 g-3">
              <div v-for="item in relatedProducts" :key="`related-${item.id}`" class="col-6 col-xl-3 col-lg-4 col-md-4 col-sm-6 m-md-b30 m-b30">
                <div class="shop-card style-1">
                  <div class="dz-media">
                    <img :src="item.image_url || item.image || '/assets/default/profile4.jpg'" :alt="item.title">
                  </div>
                  <div class="dz-content">
                    <h2 class="title"><NuxtLink :to="`/product/${item.id}`">{{ item.title }}</NuxtLink></h2>
                    <span class="price">{{ formatPrice(item.price) }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  </div>
</template>

<style scoped>
.product-focus-wrap {
  max-width: 1240px;
  margin: 0 auto;
}

.product-main-grid {
  display: grid;
  grid-template-columns: minmax(340px, 520px) minmax(420px, 620px);
  justify-content: center;
  align-items: start;
  gap: 32px;
}

.product-main-media,
.product-main-details {
  min-width: 0;
}

.product-media-wrap {
  position: relative;
  overflow: visible;
}

.product-image-stage {
  position: relative;
  border-radius: 10px;
  overflow: hidden;
  border: 1px solid #ececec;
  background: #ffffff;
}

.product-image-stage.can-zoom {
  cursor: crosshair;
}

.product-main-image {
  width: 100%;
  height: 460px;
  object-fit: contain;
  display: block;
}

.zoom-lens {
  position: absolute;
  width: 120px;
  height: 120px;
  transform: translate(-50%, -50%);
  border: 1px solid rgba(15, 81, 50, 0.55);
  background: rgba(255, 255, 255, 0.26);
  box-shadow: 0 8px 20px rgba(15, 81, 50, 0.2);
  pointer-events: none;
  border-radius: 8px;
}

.product-zoom-pane {
  position: absolute;
  top: 0;
  width: 380px;
  height: 460px;
  border: 1px solid #ececec;
  border-radius: 10px;
  background-repeat: no-repeat;
  background-size: 260%;
  background-color: #ffffff;
  box-shadow: 0 18px 40px rgba(19, 34, 28, 0.16);
  z-index: 9;
  pointer-events: none;
}

.product-zoom-pane.side-right {
  left: calc(100% + 18px);
}

.product-zoom-pane.side-left {
  right: calc(100% + 18px);
}

.product-description-text {
  color: #4a4a4a;
  line-height: 1.8;
  white-space: normal;
}

.variant-wrap {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.variant-btn {
  border: 1px solid #d7d7d7;
  background: #fff;
  color: #1f1f1f;
  border-radius: 6px;
  padding: 0.35rem 0.75rem;
  font-size: 0.9rem;
}

.variant-btn.active {
  border-color: #0f5132;
  background: #0f5132;
  color: #fff;
}

.qty-wrap {
  display: inline-flex;
  align-items: center;
  border: 1px solid #d7d7d7;
  border-radius: 6px;
  overflow: hidden;
}

.qty-btn {
  width: 2rem;
  height: 2rem;
  border: 0;
  background: #f6f6f6;
  text-align: center;
}

.qty-input {
  width: 3rem;
  text-align: center;
  border: 0;
  border-left: 1px solid #d7d7d7;
  border-right: 1px solid #d7d7d7;
}

.btn-row {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0.75rem;
}

.product-review-section {
  background: #fff;
}

.review-summary-card {
  border: 1px solid #ececec;
  border-radius: 12px;
  padding: 16px 20px;
  background: #fafafa;
}

.review-summary-score {
  display: flex;
  align-items: center;
  gap: 14px;
}

.review-summary-score .score {
  margin: 0;
  font-size: 2rem;
  line-height: 1;
}

.review-stars {
  display: flex;
  align-items: center;
  gap: 2px;
  list-style: none;
  padding-left: 0;
  margin-bottom: 0;
}

.review-stars li {
  display: inline-flex;
  line-height: 1;
}

.review-item-card {
  border: 1px solid #ececec;
  border-radius: 12px;
  padding: 16px;
  background: #fff;
}

.review-item-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 10px;
}

.review-user {
  display: flex;
  align-items: center;
  gap: 10px;
}

.review-avatar {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  object-fit: cover;
  border: 1px solid #e6e6e6;
}

.review-comment {
  color: #4a4a4a;
  line-height: 1.7;
}

.review-form-card {
  border: 1px solid #ececec;
  border-radius: 12px;
  padding: 16px;
  background: #fff;
  position: sticky;
  top: 90px;
}

.review-login-card {
  border: 1px dashed #d9dfdb;
  border-radius: 10px;
  padding: 14px;
  background: #f8fbf9;
}

.review-login-actions {
  display: grid;
  grid-template-columns: 1fr;
  gap: 10px;
}

.pagination .page-item.disabled .page-link {
  opacity: 0.55;
  pointer-events: none;
}

.pagination .page-link.is-disabled-link {
  cursor: not-allowed;
}

.pagination .page-link[disabled] {
  opacity: 0.55;
  cursor: not-allowed;
  pointer-events: none;
}

@media (max-width: 575.98px) {
  .product-main-image {
    height: 300px;
  }

  .btn-row {
    grid-template-columns: 1fr;
  }

  .review-item-head {
    flex-direction: column;
    align-items: flex-start;
  }
}

@media (max-width: 1399.98px) {
  .product-zoom-pane {
    width: 340px;
  }
}

@media (max-width: 1199.98px) {
  .product-focus-wrap {
    max-width: 1100px;
  }

  .product-main-grid {
    grid-template-columns: minmax(320px, 460px) minmax(360px, 1fr);
    gap: 24px;
  }
}

@media (max-width: 991.98px) {
  .zoom-lens,
  .product-zoom-pane {
    display: none !important;
  }

  .product-focus-wrap {
    max-width: 760px;
  }

  .product-main-grid {
    grid-template-columns: minmax(0, 1fr);
    gap: 18px;
  }

  .review-form-card {
    position: static;
    top: auto;
  }
}
</style>
