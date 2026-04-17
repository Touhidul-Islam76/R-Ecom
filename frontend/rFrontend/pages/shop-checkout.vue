<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { computed, onMounted, ref } from 'vue'
import { getCurrentUserRequest } from '~/public/js/services/axiosClient.js'
import { useCartStore } from '~/stores/cartStore'

type CheckoutProfile = {
  name?: string | null
  phone?: string | null
  address?: string | null
}

const PROFILE_STORAGE_KEY = 'recom_checkout_contact'

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
    { name: 'viewport', content: 'width=device-width, initial-scale=1' },
  ],
})

const toast = useToast()
const cartStore = useCartStore()
const { items, subtotal } = storeToRefs(cartStore)

const isLoggedIn = ref(false)
const isLoadingProfile = ref(false)
const isSubmitting = ref(false)
const backendMissingFields = ref<string[]>([])
const confirmInformation = ref(false)

const checkoutForm = ref({
  name: '',
  phone: '',
  address: '',
})

const hasItems = computed(() => items.value.length > 0)

const requiredMissingFields = computed(() => {
  const missing: string[] = []
  if (!checkoutForm.value.name.trim()) missing.push('name')
  if (!checkoutForm.value.phone.trim()) missing.push('phone')
  if (!checkoutForm.value.address.trim()) missing.push('address')
  return missing
})

const profileStatusText = computed(() => {
  if (isLoadingProfile.value) return 'Loading your account profile...'
  if (!isLoggedIn.value) return 'Guest checkout mode. Please provide delivery details.'
  if (backendMissingFields.value.length) {
    return `Please complete missing profile field(s): ${backendMissingFields.value.join(', ')}.`
  }
  return 'Your saved profile information was prefilled. Please verify before confirming.'
})

const formatPrice = (value: number) => `$${Number(value || 0).toFixed(2)}`

const lineTotal = (price: number, qty: number) => Math.max(0, Number(price || 0)) * Math.max(1, Number(qty || 1))

const parseUser = (payload: any): CheckoutProfile => {
  if (payload?.data?.user) return payload.data.user as CheckoutProfile
  if (payload?.user) return payload.user as CheckoutProfile
  if (payload?.data && typeof payload.data === 'object' && !Array.isArray(payload.data)) {
    return payload.data as CheckoutProfile
  }
  if (payload && typeof payload === 'object' && !Array.isArray(payload)) {
    return payload as CheckoutProfile
  }
  return {}
}

const applyProfile = (profile: CheckoutProfile) => {
  checkoutForm.value.name = String(profile?.name ?? '').trim()
  checkoutForm.value.phone = String(profile?.phone ?? '').trim()
  checkoutForm.value.address = String(profile?.address ?? '').trim()

  backendMissingFields.value = []
  if (!checkoutForm.value.name) backendMissingFields.value.push('name')
  if (!checkoutForm.value.phone) backendMissingFields.value.push('phone')
  if (!checkoutForm.value.address) backendMissingFields.value.push('address')
}

const loadSavedGuestProfile = () => {
  if (typeof window === 'undefined') return
  try {
    const raw = localStorage.getItem(PROFILE_STORAGE_KEY)
    if (!raw) return
    const parsed = JSON.parse(raw)
    applyProfile(parsed as CheckoutProfile)
  } catch {
    applyProfile({})
  }
}

const loadLoggedInProfile = async () => {
  isLoadingProfile.value = true
  try {
    const response = await getCurrentUserRequest()
    applyProfile(parseUser(response?.data))
  } catch {
    try {
      const fallbackRaw = localStorage.getItem('auth_user')
      const fallback = fallbackRaw ? JSON.parse(fallbackRaw) : {}
      applyProfile(fallback as CheckoutProfile)
    } catch {
      applyProfile({})
    }
    toast.warning('Could not refresh profile from backend. Using local account data.')
  } finally {
    isLoadingProfile.value = false
  }
}

const submitCheckout = async () => {
  if (!hasItems.value) {
    toast.error('Your cart is empty.')
    return
  }

  if (requiredMissingFields.value.length) {
    toast.error(`Please provide required field(s): ${requiredMissingFields.value.join(', ')}.`)
    return
  }

  if (!confirmInformation.value) {
    toast.warning('Please confirm that all provided information is correct.')
    return
  }

  isSubmitting.value = true

  try {
    if (typeof window !== 'undefined') {
      localStorage.setItem(
        PROFILE_STORAGE_KEY,
        JSON.stringify({
          name: checkoutForm.value.name.trim(),
          phone: checkoutForm.value.phone.trim(),
          address: checkoutForm.value.address.trim(),
        }),
      )
    }

    toast.success('Information confirmed. Ready for order placement flow.')
  } finally {
    isSubmitting.value = false
  }
}

onMounted(async () => {
  cartStore.hydrateCart()

  if (typeof window === 'undefined') return
  isLoggedIn.value = Boolean(localStorage.getItem('auth_token'))

  if (isLoggedIn.value) {
    await loadLoggedInProfile()
  } else {
    loadSavedGuestProfile()
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
                  <li class="breadcrumb-item">Shop Checkout</li>
                </ul>
              </nav>
            </div>
          </div>
        </div>

        <div class="content-inner-1">
          <div class="container">
            <div v-if="!hasItems" class="alert alert-warning m-b20">
              Your checkout is empty. Please add products first.
            </div>

            <div class="row shop-checkout">
              <div class="col-xl-7">
                <h2 class="title m-b10 text-capitalize">Delivery Information</h2>
                <p class="text-muted m-b20">{{ profileStatusText }}</p>

                <form class="checkout-profile-form" @submit.prevent="submitCheckout">
                  <div class="row">
                    <div class="col-md-12">
                      <div class="form-group m-b15">
                        <label class="label-title">Name *</label>
                        <input
                          v-model.trim="checkoutForm.name"
                          name="checkoutName"
                          required
                          class="form-control"
                          placeholder="Enter full name"
                        >
                      </div>
                    </div>

                    <div class="col-md-12">
                      <div class="form-group m-b15">
                        <label class="label-title">Phone *</label>
                        <input
                          v-model.trim="checkoutForm.phone"
                          name="checkoutPhone"
                          required
                          class="form-control"
                          placeholder="Enter phone number"
                        >
                      </div>
                    </div>

                    <div class="col-md-12">
                      <div class="form-group m-b15">
                        <label class="label-title">Address *</label>
                        <textarea
                          v-model.trim="checkoutForm.address"
                          name="checkoutAddress"
                          required
                          class="form-control"
                          rows="4"
                          placeholder="Enter delivery address"
                        ></textarea>
                      </div>
                    </div>

                    <div class="col-md-12">
                      <div class="form-group m-b20">
                        <div class="custom-control custom-checkbox d-flex align-items-start">
                          <input id="confirm_info" v-model="confirmInformation" type="checkbox" class="form-check-input mt-1">
                          <label class="form-check-label m-l10" for="confirm_info">
                            I confirm that the name, phone, and address are correct.
                          </label>
                        </div>
                      </div>
                    </div>

                    <div class="col-md-12">
                      <button type="submit" class="btn btn-secondary w-100 text-uppercase" :disabled="isSubmitting || !hasItems">
                        {{ isSubmitting ? 'Confirming...' : 'Confirm Information' }}
                      </button>
                    </div>
                  </div>
                </form>
              </div>

              <div class="col-xl-5 side-bar">
                <h2 class="title m-b15">Selected Products</h2>
                <div class="order-detail sticky-top">
                  <div v-if="!items.length" class="alert alert-warning mb-0">No products selected.</div>

                  <template v-else>
                    <div
                      v-for="(item, index) in items"
                      :key="`${item.product_id}-${item.size}-${item.color}-${index}`"
                      class="cart-item style-1"
                    >
                      <div class="dz-media">
                        <img :src="item.image" :alt="item.title">
                      </div>
                      <div class="dz-content">
                        <h6 class="title mb-1">{{ item.title }}</h6>
                        <small class="d-block text-muted mb-1">
                          Qty: {{ item.quantity }}
                          <span v-if="item.size || item.color">| {{ item.size || '-' }} / {{ item.color || '-' }}</span>
                        </small>
                        <span class="price">{{ formatPrice(lineTotal(item.price, item.quantity)) }}</span>
                      </div>
                    </div>
                  </template>

                  <table class="m-t20">
                    <tbody>
                      <tr class="total">
                        <td>Total</td>
                        <td class="price">{{ formatPrice(subtotal) }}</td>
                      </tr>
                    </tbody>
                  </table>

                  <NuxtLink to="/shop-cart" class="btn btn-outline-secondary w-100 text-uppercase m-t20">Back To Cart</NuxtLink>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.checkout-profile-form {
  border: 1px solid #ececec;
  border-radius: 14px;
  padding: 22px;
  background: #fff;
}

.order-detail .cart-item.style-1 .dz-media img {
  width: 70px;
  height: 70px;
  object-fit: cover;
}

@media (max-width: 1199.98px) {
  .side-bar {
    margin-top: 20px;
  }
}
</style>
