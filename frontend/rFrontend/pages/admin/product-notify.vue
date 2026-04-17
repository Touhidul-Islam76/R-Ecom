<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { fetchProductsRequest } from '~/public/js/services/axiosClient.js'

definePageMeta({ layout: 'admin' })
useHead({ title: 'Product Notify | FasionAble Admin' })

type NotifyVariantItem = {
  size?: string | null
  color?: string | null
}

type NotifyProductItem = {
  id: number
  title?: string | null
  variants?: NotifyVariantItem[]
}

type NotifyResponse = {
  data?: NotifyProductItem[]
  last_page?: number
}

const isLoading = ref(false)
const hasClosedNotice = ref(false)
const errorMessage = ref('')
const missingProducts = ref<Array<{ id: number; title: string }>>([])

const missingCount = computed(() => missingProducts.value.length)
const previewMissingProducts = computed(() => missingProducts.value.slice(0, 6))
const shouldShowNotice = computed(() => !hasClosedNotice.value && missingCount.value > 0)

const hasValidSizeAndColor = (product: NotifyProductItem) => {
  const variants = product.variants ?? []
  if (!variants.length) return false

  return variants.some((variant) => {
    const size = String(variant.size ?? '').trim()
    const color = String(variant.color ?? '').trim()
    return Boolean(size && color)
  })
}

const loadMissingVariantProducts = async () => {
  isLoading.value = true
  errorMessage.value = ''

  try {
    let page = 1
    let lastPage = 1
    const missing: Array<{ id: number; title: string }> = []

    do {
      const response = await fetchProductsRequest({
        page,
        per_page: 100,
        include_inactive: 1,
      })

      const payload = (response?.data ?? {}) as NotifyResponse
      const rows = payload.data ?? []

      for (const product of rows) {
        if (hasValidSizeAndColor(product)) continue

        missing.push({
          id: Number(product.id),
          title: String(product.title || `Product #${product.id}`),
        })
      }

      lastPage = payload.last_page ?? 1
      page += 1
    } while (page <= lastPage && page <= 100)

    missingProducts.value = missing
  } catch {
    errorMessage.value = 'Could not verify product size and color availability right now.'
    missingProducts.value = []
  } finally {
    isLoading.value = false
  }
}

onMounted(async () => {
  await loadMissingVariantProducts()
})
</script>

<template>
  <div class="row product-notify-page">
    <div class="col-12">
      <div class="page-title-box">
        <div class="page-title-right">
          <ol class="breadcrumb m-0">
            <li class="breadcrumb-item"><NuxtLink to="/admin">Admin</NuxtLink></li>
            <li class="breadcrumb-item"><NuxtLink to="/admin/products">Products</NuxtLink></li>
            <li class="breadcrumb-item active">Product Notify</li>
          </ol>
        </div>
        <h4 class="page-title">Product Notify</h4>
      </div>
    </div>
  </div>

  <div class="row g-3">
    <div class="col-12">
      <div v-if="isLoading" class="alert alert-info" role="alert">
        Checking all products for missing size and color...
      </div>

      <div v-else-if="errorMessage" class="alert alert-warning d-flex flex-wrap gap-2 align-items-center justify-content-between notify-error" role="alert">
        <span>{{ errorMessage }}</span>
        <button type="button" class="btn btn-sm btn-outline-warning" @click="loadMissingVariantProducts">Retry</button>
      </div>

      <div v-else-if="shouldShowNotice" class="alert alert-warning" role="alert">
        <div class="d-flex flex-wrap align-items-center justify-content-between gap-2 mb-2 notify-head">
          <strong>{{ missingCount }} product(s) are missing size/color data.</strong>
          <div class="d-flex gap-2 notify-actions">
            <NuxtLink to="/admin/products" class="btn btn-sm btn-primary">Add</NuxtLink>
            <button type="button" class="btn btn-sm btn-outline-secondary" @click="hasClosedNotice = true">Close</button>
            <button type="button" class="btn btn-sm btn-outline-dark" @click="loadMissingVariantProducts">Refresh</button>
          </div>
        </div>
        <p class="mb-2 text-muted">Open Products page and add proper size and color variants.</p>
        <div class="small">
          <span v-for="(item, index) in previewMissingProducts" :key="item.id">
            {{ item.title }}<span v-if="index < previewMissingProducts.length - 1">, </span>
          </span>
          <span v-if="missingCount > previewMissingProducts.length"> and {{ missingCount - previewMissingProducts.length }} more.</span>
        </div>
      </div>

      <div v-else class="alert alert-success" role="alert">
        All products have valid size and color variants.
      </div>
    </div>

    <div class="col-12">
      <div class="card">
        <div class="card-body">
          <div class="d-flex align-items-center justify-content-between mb-3 notify-card-head">
            <h5 class="header-title mb-2">Missing Variant Data</h5>
            <div class="d-flex gap-2 notify-card-actions">
              <NuxtLink to="/admin/products" class="btn btn-sm btn-primary">Add Variants</NuxtLink>
              <button type="button" class="btn btn-sm btn-outline-secondary" @click="loadMissingVariantProducts">Refresh</button>
            </div>
          </div>

          <div class="table-responsive">
            <table class="table table-hover align-middle mb-0 notify-table">
              <thead>
                <tr>
                  <th style="width: 90px">ID</th>
                  <th>Product</th>
                  <th class="text-end" style="width: 160px">Action</th>
                </tr>
              </thead>
              <tbody>
                <tr v-if="isLoading">
                  <td colspan="3" class="text-center py-4">Checking products...</td>
                </tr>
                <tr v-else-if="missingProducts.length === 0">
                  <td colspan="3" class="text-center py-4 text-muted">No missing size/color products found.</td>
                </tr>
                <tr v-for="item in missingProducts" :key="item.id">
                  <td>#{{ item.id }}</td>
                  <td class="notify-product-title">{{ item.title }}</td>
                  <td class="text-end notify-action-cell">
                    <NuxtLink to="/admin/products" class="btn btn-sm btn-outline-primary">Add</NuxtLink>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.notify-product-title {
  min-width: 220px;
}

@media (max-width: 767.98px) {
  .product-notify-page .page-title-box {
    margin-bottom: 0.5rem;
  }

  .notify-head,
  .notify-card-head {
    align-items: stretch !important;
    flex-direction: column;
  }

  .notify-actions,
  .notify-card-actions {
    display: grid !important;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    width: 100%;
  }

  .notify-card-actions {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .notify-actions .btn,
  .notify-card-actions .btn {
    width: 100%;
  }

  .notify-table {
    font-size: 0.88rem;
  }

  .notify-table th,
  .notify-table td {
    padding: 0.6rem 0.45rem;
    vertical-align: middle;
  }

  .notify-product-title {
    min-width: 180px;
    white-space: normal;
    word-break: break-word;
  }

  .notify-action-cell {
    text-align: left !important;
    min-width: 120px;
  }

  .notify-action-cell .btn {
    width: 100%;
  }
}

@media (max-width: 479.98px) {
  .notify-actions {
    grid-template-columns: 1fr;
  }

  .notify-card-actions {
    grid-template-columns: 1fr;
  }
}
</style>
