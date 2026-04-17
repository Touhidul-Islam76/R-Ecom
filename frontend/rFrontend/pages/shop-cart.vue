<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { computed, onMounted, ref, watch } from 'vue'
import { getProductRequest, reserveProductStockRequest } from '~/public/js/services/axiosClient.js'
import { useCartStore, type CartItem } from '~/stores/cartStore'

type ProductVariant = {
  size: 'S' | 'M' | 'L' | 'XL' | 'XXL'
  color: string
  quantity: number
}

type ProductDetailPayload = {
  variants?: ProductVariant[]
}

type OutOfStockItem = {
  size?: string
  color?: string
  available_quantity?: number
}

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
    { rel: 'canonical', href: 'https://fasionable.dexignzone.com/xhtml/shop-cart.html' },
    { rel: 'icon', type: 'image/x-icon', href: '/images/20.jpg.jpeg' },
    { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
    { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
    { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Marcellus&display=swap' },
  ],
})

const cartStore = useCartStore()
const { items, subtotal } = storeToRefs(cartStore)
const toast = useToast()

const hasItems = computed(() => items.value.length > 0)
const availabilityMap = ref<Record<string, number>>({})
const loadingMap = ref<Record<string, boolean>>({})
const releasedBufferMap = ref<Record<string, number>>({})

const formatPrice = (value: number) => `$${Number(value || 0).toFixed(2)}`
const lineTotal = (item: CartItem) => Math.max(0, Number(item.price || 0)) * Math.max(1, Number(item.quantity || 1))
const itemOption = (item: CartItem) => [item.size, item.color].filter(Boolean).join(' / ')
const variantKey = (item: CartItem) =>
  `${item.product_id}::${String(item.size ?? '').toLowerCase()}::${String(item.color ?? '').toLowerCase()}`

const toNumber = (value: unknown): number => {
  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : 0
}

const getAvailableUnits = (item: CartItem) => {
  const key = variantKey(item)
  return Math.max(0, toNumber(availabilityMap.value[key]))
}

const getReleasedUnits = (item: CartItem) => {
  const key = variantKey(item)
  return Math.max(0, toNumber(releasedBufferMap.value[key]))
}

const hasIncrementStock = (item: CartItem) => getReleasedUnits(item) > 0 || getAvailableUnits(item) > 0

const isIncrementLoading = (item: CartItem) => loadingMap.value[variantKey(item)] === true

const syncVariantAvailability = async (item: CartItem) => {
  if (!item.size || !item.color) return

  const key = variantKey(item)

  try {
    const response = await getProductRequest(item.product_id)
    const product = (response?.data ?? {}) as ProductDetailPayload
    const variants = Array.isArray(product.variants) ? product.variants : []

    const matchedVariant = variants.find(
      (variant) =>
        variant.size === item.size &&
        String(variant.color).toLowerCase() === String(item.color).toLowerCase(),
    )

    availabilityMap.value[key] = Math.max(0, toNumber(matchedVariant?.quantity))
  } catch {
    availabilityMap.value[key] = 0
  }
}

const syncAllAvailabilities = async () => {
  const visited = new Set<string>()
  const tasks: Array<Promise<void>> = []

  for (const item of items.value) {
    const key = variantKey(item)
    if (visited.has(key)) continue
    visited.add(key)
    tasks.push(syncVariantAvailability(item))
  }

  await Promise.all(tasks)
}

const notifyEmptyCart = () => {
  toast.warning('Your cart is empty. Add products from shop page.')
}

const increaseQty = async (index: number) => {
  const item = items.value[index]
  if (!item) return

  if (!item.size || !item.color) {
    toast.error('Variant information is missing for this cart item.')
    return
  }

  const key = variantKey(item)
  if (loadingMap.value[key]) return

  if (!hasIncrementStock(item)) {
    toast.error(`No more stock available for ${item.title} (${item.size}/${item.color}).`)
    return
  }

  const releasedUnits = getReleasedUnits(item)
  if (releasedUnits > 0) {
    releasedBufferMap.value[key] = releasedUnits - 1
    await cartStore.setItemQuantity(index, item.quantity + 1)
    return
  }

  loadingMap.value[key] = true

  try {
    const response = await reserveProductStockRequest(item.product_id, {
      size: item.size,
      color: item.color,
      quantity: 1,
    })

    await cartStore.setItemQuantity(index, item.quantity + 1)
    const latestQuantity = toNumber(response?.data?.variant?.quantity)
    availabilityMap.value[key] = Math.max(0, latestQuantity)
  } catch (error: unknown) {
    const err = error as { response?: { data?: { out_of_stock?: OutOfStockItem[] } } }
    const outOfStock = err?.response?.data?.out_of_stock ?? []

    if (outOfStock.length) {
      availabilityMap.value[key] = Math.max(0, toNumber(outOfStock[0]?.available_quantity))
      toast.error(`No more stock available for ${item.title} (${item.size}/${item.color}).`)
      return
    }

    toast.error('Unable to update quantity right now. Please try again.')
  } finally {
    loadingMap.value[key] = false
  }
}

const decreaseQty = async (index: number) => {
  const item = items.value[index]
  if (!item) return
  if (item.quantity <= 1) return

  const key = variantKey(item)
  releasedBufferMap.value[key] = getReleasedUnits(item) + 1
  await cartStore.setItemQuantity(index, item.quantity - 1)
}

const removeItem = async (index: number) => {
  await cartStore.removeItem(index)
}

const clearCart = async () => {
  await cartStore.clearCart()
}

onMounted(() => {
  cartStore.hydrateCart()
  syncAllAvailabilities()

  if (!hasItems.value) {
    notifyEmptyCart()
  }
})

watch(
  () => hasItems.value,
  (current, previous) => {
    if (!current && previous) {
      notifyEmptyCart()
    }
  },
)
</script>

<template>
  <div id="bg">
    <div class="page-wraper">
      <div class="page-content">
        <div class="dz-bnr-inr" style="background-image:url(/images/background/bg1.jpg);">
          <div class="container">
            <div class="dz-bnr-inr-entry">
              <nav aria-label="breadcrumb" class="breadcrumb-row">
                <ul class="breadcrumb">
                  <li class="breadcrumb-item"><NuxtLink to="/">Home</NuxtLink></li>
                  <li class="breadcrumb-item">Shop Cart</li>
                </ul>
              </nav>
            </div>
          </div>
        </div>

        <section class="content-inner shop-account">
          <div class="container">
            <div class="row">
              <div class="col-lg-8">
                <div v-if="hasItems" class="table-responsive">
                  <table class="table check-tbl">
                    <thead>
                      <tr>
                        <th></th>
                        <th></th>
                        <th>Product</th>
                        <th>Price</th>
                        <th>Quantity</th>
                        <th>Subtotal</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="(item, index) in items" :key="`${item.product_id}-${item.size}-${item.color}-${index}`">
                        <td class="product-item-close">
                          <a href="javascript:void(0);" @click.prevent="removeItem(index)">
                            <i class="ti-close"></i>
                          </a>
                        </td>
                        <td class="product-item-img"><img :src="item.image" :alt="item.title"></td>
                        <td class="product-item-name">
                          <div>{{ item.title }}</div>
                          <small v-if="itemOption(item)" class="text-muted">{{ itemOption(item) }}</small>
                        </td>
                        <td class="product-item-price">{{ formatPrice(item.price) }}</td>
                        <td class="product-item-quantity">
                          <div class="qty-inline">
                            <button type="button" class="qty-action" @click="decreaseQty(index)">-</button>
                            <span class="qty-badge">{{ item.quantity }}</span>
                            <button
                              type="button"
                              class="qty-action"
                              :class="{ 'qty-disabled': !hasIncrementStock(item) || isIncrementLoading(item) }"
                              :disabled="isIncrementLoading(item)"
                              @click="increaseQty(index)"
                            >
                              +
                            </button>
                          </div>
                        </td>
                        <td class="product-item-totle">{{ formatPrice(lineTotal(item)) }}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div class="row shop-form m-t30 align-items-center">
                  <div class="col-xl-6 col-lg-12 col-sm-12 m-b30 m-xl-0">
                    <div class="custom-control custom-checkbox d-flex align-items-center">
                      <input type="checkbox" class="form-check-input" id="gift_wrap">
                      <label class="form-check-label text-secondary" for="gift_wrap">
                        Gift wrap this order for an additional $5.00
                      </label>
                    </div>
                  </div>
                  <div class="col-xl-6 col-lg-12 text-start text-xl-end col-sm-12 d-flex align-items-center justify-content-center gap-2">
                    <NuxtLink to="/shop-standard" class="btn btn-outline-secondary">Continue Shopping</NuxtLink>
                    <button type="button" class="btn btn-secondary" @click="clearCart">Empty Cart</button>
                  </div>
                </div>
              </div>

              <div class="col-lg-4">
                <div class="cart-detail">
                  <a href="javascript:void(0);" class="btn btn-outline-secondary w-100 m-b20 btn-lg">Fast Delivery Available</a>
                  <div class="icon-bx-wraper style-4 m-b15">
                    <div class="icon-bx">
                      <i class="flaticon flaticon-ship"></i>
                    </div>
                    <div class="icon-content">
                      <span class="font-13">Secure</span>
                      <h6 class="dz-title">Checkout</h6>
                    </div>
                  </div>
                  <div class="save-text">
                    <i class="icon feather icon-check-circle"></i>
                    <span class="m-l10">Items in cart: <span>{{ items.length }}</span></span>
                  </div>
                  <table>
                    <tbody>
                      <tr class="total">
                        <td><h6 class="mb-0">Total Amount</h6></td>
                        <td class="price">{{ formatPrice(subtotal) }}</td>
                      </tr>
                    </tbody>
                  </table>
                  <NuxtLink :to="hasItems ? '/shop-checkout' : '/shop-standard'" class="btn btn-outline-secondary w-100 btn-lg">
                    {{ hasItems ? 'PLACE ORDER' : 'SHOP NOW' }}
                  </NuxtLink>
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
.qty-badge {
  display: inline-block;
  min-width: 34px;
  text-align: center;
  border: 1px solid #d7d7d7;
  border-radius: 6px;
  padding: 4px 8px;
  font-weight: 600;
}

.qty-inline {
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

.qty-action {
  width: 30px;
  height: 30px;
  border: 1px solid #d7d7d7;
  border-radius: 6px;
  background: #fff;
  font-weight: 600;
  line-height: 1;
}

.qty-action.qty-disabled,
.qty-action:disabled {
  opacity: 0.45;
  cursor: not-allowed;
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
</style>
