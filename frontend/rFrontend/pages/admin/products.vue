<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, reactive, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useAdminCatalogStore, type ProductItem } from '~/stores/adminCatalogStore'
import { useHorizontalDragScroll } from '~/composables/useHorizontalDragScroll'
import { useToast } from '~/composables/useToast'

definePageMeta({ layout: 'admin' })
useHead({ title: 'Products | FasionAble Admin' })

type VariantSize = 'S' | 'M' | 'L' | 'XL' | 'XXL'
type SizeValueMap = Record<VariantSize, string>

const sizeOptions: VariantSize[] = ['S', 'M', 'L', 'XL', 'XXL']

const createSizeValueMap = (defaultValue = ''): SizeValueMap => ({
  S: defaultValue,
  M: defaultValue,
  L: defaultValue,
  XL: defaultValue,
  XXL: defaultValue,
})

const store = useAdminCatalogStore()
const { enableOnElement } = useHorizontalDragScroll()
const toast = useToast()
const {
  products,
  productMeta,
  brandOptions,
  categoryOptions,
  isLoadingProducts,
  isSavingProduct,
  isDeletingProduct,
} = storeToRefs(store)

const editingProductId = ref<number | null>(null)
const tableScrollRefs = ref<HTMLElement[]>([])
const imageFileInputRef = ref<HTMLInputElement | null>(null)
const uploadedPreviewUrl = ref('')
const currentImagePreviewUrl = ref('')
const removeCurrentImage = ref(false)
const filters = reactive({
  search: '',
  category_id: '',
  brand_id: '',
  sort: '',
})

const form = reactive({
  title: '',
  slug: '',
  short_description: '',
  price: '',
  rating: '',
  image_url: '',
  image_file: null as File | null,
  category_id: '',
  brand_id: '',
  is_active: true,
  variant_colors: '',
  size_quantities: createSizeValueMap('0'),
  size_prices: createSizeValueMap(''),
  size_discounts: createSizeValueMap(''),
})

const isEditing = computed(() => editingProductId.value !== null)
const effectiveImagePreview = computed(() => {
  if (uploadedPreviewUrl.value) {
    return uploadedPreviewUrl.value
  }

  if (form.image_url.trim()) {
    return form.image_url.trim()
  }

  if (isEditing.value && !removeCurrentImage.value) {
    return currentImagePreviewUrl.value
  }

  return ''
})

const setTableScrollRef = (el: unknown) => {
  if (el instanceof HTMLElement && !tableScrollRefs.value.includes(el)) {
    tableScrollRefs.value.push(el)
  }
}

const slugify = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')

const toTrimmedString = (value: unknown) => String(value ?? '').trim()

const hasValue = (value: unknown) => toTrimmedString(value) !== ''

const normalizeNumber = (value: unknown, fallback = 0) => {
  const parsed = Number(value)
  return Number.isNaN(parsed) ? fallback : parsed
}

const clearUploadedPreviewUrl = () => {
  if (uploadedPreviewUrl.value) {
    URL.revokeObjectURL(uploadedPreviewUrl.value)
    uploadedPreviewUrl.value = ''
  }
}

const setError = (message: string) => {
  toast.error(message)
}

const setSuccess = (message: string) => {
  toast.success(message)
}

const resetForm = () => {
  clearUploadedPreviewUrl()
  editingProductId.value = null
  removeCurrentImage.value = false
  currentImagePreviewUrl.value = ''
  form.title = ''
  form.slug = ''
  form.short_description = ''
  form.price = ''
  form.rating = ''
  form.image_url = ''
  form.image_file = null
  form.category_id = ''
  form.brand_id = ''
  form.is_active = true
  form.variant_colors = ''
  form.size_quantities = createSizeValueMap('0')
  form.size_prices = createSizeValueMap('')
  form.size_discounts = createSizeValueMap('')
  if (imageFileInputRef.value) imageFileInputRef.value.value = ''
}

const currentProductFilters = () => ({
  search: filters.search.trim(),
  category_id: filters.category_id,
  brand_id: filters.brand_id,
  size: '',
  color: '',
  min_price: '',
  max_price: '',
  sort: filters.sort,
})

const loadProducts = async (page = 1) => {
  try {
    await store.fetchProducts(page, currentProductFilters())
  } catch (error) {
    setError((error as Error).message)
  }
}

const applyFilters = async () => {
  await loadProducts(1)
}

const resetFilters = async () => {
  filters.search = ''
  filters.category_id = ''
  filters.brand_id = ''
  filters.sort = ''
  await loadProducts(1)
}

const parseColors = () =>
  Array.from(
    new Set(
      form.variant_colors
        .split(',')
        .map((item) => item.trim())
        .filter(Boolean),
    ),
  )

const buildVariantsFromForm = () => {
  const colors = parseColors()
  if (!colors.length) {
    throw new Error('At least one color is required. Example: Black, White')
  }

  const basePrice = normalizeNumber(form.price, 0)
  if (basePrice <= 0) {
    throw new Error('Base price must be greater than 0.')
  }

  const variants: Array<{
    size: VariantSize
    color: string
    quantity: number
    price: number
    discount_price: number | null
  }> = []

  for (const color of colors) {
    for (const size of sizeOptions) {
      const quantity = Math.max(0, Math.floor(normalizeNumber(form.size_quantities[size], 0)))
      if (quantity <= 0) continue

      const sizePrice = toTrimmedString(form.size_prices[size])
      const sizeDiscount = toTrimmedString(form.size_discounts[size])

      const price = sizePrice ? normalizeNumber(sizePrice, basePrice) : basePrice
      const discount_price = sizeDiscount ? normalizeNumber(sizeDiscount, 0) : null

      variants.push({
        size,
        color,
        quantity,
        price,
        discount_price,
      })
    }
  }

  if (!variants.length) {
    throw new Error('Set at least one size quantity greater than 0.')
  }

  return variants
}

const generateSlugFromTitle = () => {
  form.slug = slugify(form.title)
}

const handleSubmit = async () => {
  try {
    if (!form.title.trim() || !form.slug.trim() || !hasValue(form.price)) {
      setError('Title, slug, and base price are required.')
      return
    }

    const payload = {
      title: form.title,
      slug: form.slug,
      short_description: form.short_description || null,
      price: normalizeNumber(form.price, 0),
      rating: hasValue(form.rating) ? normalizeNumber(form.rating, 0) : null,
      image: removeCurrentImage.value ? null : form.image_file ?? (form.image_url.trim() || null),
      category_id: form.category_id ? Number(form.category_id) : null,
      brand_id: form.brand_id ? Number(form.brand_id) : null,
      is_active: form.is_active,
      variants: buildVariantsFromForm(),
    }

    if (isEditing.value && editingProductId.value) {
      await store.updateProduct(editingProductId.value, payload)
      setSuccess('Product updated successfully.')
    } else {
      await store.createProduct(payload)
      setSuccess('Product created successfully.')
    }

    resetForm()
  } catch (error) {
    setError((error as Error).message)
  }
}

const startEdit = (product: ProductItem) => {
  clearUploadedPreviewUrl()
  editingProductId.value = product.id
  removeCurrentImage.value = false
  currentImagePreviewUrl.value = product.image_url || product.image || ''
  form.title = product.title || ''
  form.slug = product.slug || ''
  form.short_description = product.short_description || ''
  form.price = String(product.price ?? '')
  form.rating = product.rating === null || product.rating === undefined ? '' : String(product.rating)
  form.image_url = product.image || ''
  form.image_file = null
  form.category_id = product.category_id ? String(product.category_id) : ''
  form.brand_id = product.brand_id ? String(product.brand_id) : ''
  form.is_active = Boolean(product.is_active)
  if (imageFileInputRef.value) imageFileInputRef.value.value = ''

  form.size_quantities = createSizeValueMap('0')
  form.size_prices = createSizeValueMap('')
  form.size_discounts = createSizeValueMap('')

  const variants = product.variants ?? []
  const colors = Array.from(new Set(variants.map((variant) => variant.color).filter(Boolean)))
  form.variant_colors = colors.join(', ')

  for (const size of sizeOptions) {
    const bySize = variants.filter((variant) => variant.size === size)
    const totalQuantity = bySize.reduce((sum, variant) => sum + (Number(variant.quantity) || 0), 0)
    const first = bySize[0]
    const firstDiscount = bySize.find((variant) => variant.discount_price !== null && variant.discount_price !== undefined)

    form.size_quantities[size] = String(totalQuantity)
    form.size_prices[size] = first?.price !== undefined ? String(first.price) : ''
    form.size_discounts[size] = firstDiscount?.discount_price !== undefined && firstDiscount?.discount_price !== null
      ? String(firstDiscount.discount_price)
      : ''
  }

}

const handleDelete = async (product: ProductItem) => {
  if (!confirm(`Delete product "${product.title}"?`)) return

  try {
    await store.deleteProduct(product.id)
    setSuccess('Product deleted successfully.')
    if (editingProductId.value === product.id) resetForm()
  } catch (error) {
    setError((error as Error).message)
  }
}

const getProductColors = (product: ProductItem) =>
  Array.from(new Set((product.variants ?? []).map((variant) => variant.color).filter(Boolean))).join(', ') || 'N/A'

const getProductSizes = (product: ProductItem) =>
  Array.from(new Set((product.variants ?? []).map((variant) => variant.size).filter(Boolean))).join(', ') || 'N/A'

const getProductStock = (product: ProductItem) =>
  (product.variants ?? []).reduce((sum, variant) => sum + (Number(variant.quantity) || 0), 0)

const handleImageFileChange = (event: Event) => {
  clearUploadedPreviewUrl()
  const target = event.target as HTMLInputElement | null
  form.image_file = target?.files?.[0] ?? null
  if (form.image_file) {
    uploadedPreviewUrl.value = URL.createObjectURL(form.image_file)
    removeCurrentImage.value = false
  }
}

const handleImageUrlInput = () => {
  if (form.image_url.trim()) {
    removeCurrentImage.value = false
  }
}

const toggleRemoveCurrentImage = () => {
  if (!removeCurrentImage.value) return

  clearUploadedPreviewUrl()
  form.image_file = null
  form.image_url = ''
  if (imageFileInputRef.value) imageFileInputRef.value.value = ''
}

const getProductImageSrc = (product: ProductItem) => product.image_url || product.image || ''

onMounted(async () => {
  await nextTick()
  tableScrollRefs.value.forEach((el) => enableOnElement(el))
  await Promise.all([loadProducts(1), store.preloadCatalogOptions()])
})

onBeforeUnmount(() => {
  clearUploadedPreviewUrl()
})
</script>

<template>
  <div class="row">
    <div class="col-12">
      <div class="page-title-box">
        <div class="page-title-right">
          <ol class="breadcrumb m-0">
            <li class="breadcrumb-item"><NuxtLink to="/admin">Admin</NuxtLink></li>
            <li class="breadcrumb-item active">Products</li>
          </ol>
        </div>
        <h4 class="page-title">Product Management</h4>
      </div>
    </div>
  </div>

  <div class="row g-3">
    <div class="col-12">
      <div class="card">
        <div class="card-body">
          <h5 class="header-title mb-3">{{ isEditing ? 'Edit Product' : 'Create Product' }}</h5>

          <div class="row g-3">
            <div class="col-lg-3">
              <label class="form-label">Title</label>
              <input v-model="form.title" type="text" class="form-control" placeholder="Running Shoe Pro" />
            </div>
            <div class="col-lg-3">
              <label class="form-label">Slug</label>
              <div class="input-group slug-input-group">
                <input v-model="form.slug" type="text" class="form-control" placeholder="running-shoe-pro" />
                <button type="button" class="btn btn-outline-secondary" @click="generateSlugFromTitle">Auto</button>
              </div>
            </div>
            <div class="col-lg-2">
              <label class="form-label">Base Price</label>
              <input v-model="form.price" type="number" min="0" class="form-control" />
            </div>
            <div class="col-lg-2">
              <label class="form-label">Rating</label>
              <input v-model="form.rating" type="number" min="0" max="5" step="0.1" class="form-control" />
            </div>
            <div class="col-lg-2">
              <label class="form-label">Image URL</label>
              <input
                v-model="form.image_url"
                type="text"
                class="form-control"
                placeholder="https://..."
                @input="handleImageUrlInput"
              />
            </div>
            <div class="col-lg-2">
              <label class="form-label">Upload Image</label>
              <input
                ref="imageFileInputRef"
                type="file"
                class="form-control"
                accept="image/*"
                @change="handleImageFileChange"
              />
            </div>

            <div class="col-lg-2">
              <label class="form-label d-block">Preview</label>
              <img
                v-if="effectiveImagePreview"
                :src="effectiveImagePreview"
                alt="Product Preview"
                class="catalog-preview"
              />
              <div v-else class="text-muted small mt-2">No image selected.</div>
            </div>

            <div class="col-lg-3">
              <label class="form-label">Category</label>
              <select v-model="form.category_id" class="form-select">
                <option value="">Select Category</option>
                <option v-for="category in categoryOptions" :key="category.id" :value="String(category.id)">
                  {{ category.name }}
                </option>
              </select>
            </div>
            <div class="col-lg-3">
              <label class="form-label">Brand</label>
              <select v-model="form.brand_id" class="form-select">
                <option value="">Select Brand</option>
                <option v-for="brand in brandOptions" :key="brand.id" :value="String(brand.id)">
                  {{ brand.name }}
                </option>
              </select>
            </div>
            <div class="col-lg-6">
              <label class="form-label">Description</label>
              <textarea
                v-model="form.short_description"
                class="form-control"
                rows="2"
                placeholder="Short product description"
              ></textarea>
            </div>

            <div class="col-lg-8">
              <label class="form-label">Colors (comma separated)</label>
              <input
                v-model="form.variant_colors"
                type="text"
                class="form-control"
                placeholder="Black, White, Navy"
              />
              <small class="text-muted">All selected colors will be used for sizes with quantity &gt; 0.</small>
            </div>
            <div class="col-lg-4 d-flex align-items-end">
              <div class="form-check form-switch mb-0">
                <input id="product-active" v-model="form.is_active" class="form-check-input" type="checkbox" />
                <label class="form-check-label" for="product-active">Active Product</label>
              </div>
            </div>

            <div class="col-12">
              <div :ref="setTableScrollRef" class="table-scroll-wrap">
                <table class="table table-bordered align-middle mb-0 variant-table">
                  <thead>
                    <tr>
                      <th>Size</th>
                      <th>Quantity</th>
                      <th>Price (optional override)</th>
                      <th>Discount Price (optional)</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="size in sizeOptions" :key="size">
                      <td class="fw-semibold">{{ size }}</td>
                      <td>
                        <input v-model="form.size_quantities[size]" type="number" min="0" class="form-control" />
                      </td>
                      <td>
                        <input v-model="form.size_prices[size]" type="number" min="0" class="form-control" />
                      </td>
                      <td>
                        <input v-model="form.size_discounts[size]" type="number" min="0" class="form-control" />
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div class="col-12 d-flex flex-wrap gap-2">
              <div v-if="isEditing" class="form-check my-auto">
                <input
                  id="product-remove-image"
                  v-model="removeCurrentImage"
                  class="form-check-input"
                  type="checkbox"
                  @change="toggleRemoveCurrentImage"
                />
                <label class="form-check-label" for="product-remove-image">Remove current image</label>
              </div>

              <button
                type="button"
                class="btn btn-primary"
                :disabled="isSavingProduct"
                @click="handleSubmit"
              >
                {{ isSavingProduct ? 'Saving...' : isEditing ? 'Update Product' : 'Create Product' }}
              </button>
              <button
                v-if="isEditing"
                type="button"
                class="btn btn-light"
                :disabled="isSavingProduct"
                @click="resetForm"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="col-12">
      <div class="card">
        <div class="card-body">
          <div class="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
            <h5 class="header-title mb-0">Product List</h5>
            <small class="text-muted">Total: {{ productMeta.total }}</small>
          </div>

          <div class="row g-2">
            <div class="col-md-4">
              <input v-model="filters.search" type="text" class="form-control" placeholder="Search title/slug..." />
            </div>
            <div class="col-md-2">
              <select v-model="filters.category_id" class="form-select">
                <option value="">Category</option>
                <option v-for="category in categoryOptions" :key="category.id" :value="String(category.id)">
                  {{ category.name }}
                </option>
              </select>
            </div>
            <div class="col-md-2">
              <select v-model="filters.brand_id" class="form-select">
                <option value="">Brand</option>
                <option v-for="brand in brandOptions" :key="brand.id" :value="String(brand.id)">
                  {{ brand.name }}
                </option>
              </select>
            </div>
            <div class="col-md-2">
              <select v-model="filters.sort" class="form-select">
                <option value="">Sort</option>
                <option value="price_asc">Price Low-High</option>
                <option value="price_desc">Price High-Low</option>
                <option value="rating_desc">Top Rated</option>
              </select>
            </div>
          </div>

          <div class="filter-action-row">
            <button type="button" class="btn btn-primary" @click="applyFilters">Filter</button>
            <button type="button" class="btn btn-light" @click="resetFilters">Reset</button>
          </div>

          <div :ref="setTableScrollRef" class="table-scroll-wrap">
            <table class="table table-hover align-middle mb-0 product-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Title</th>
                  <th>Image</th>
                  <th>Category</th>
                  <th>Brand</th>
                  <th>Base Price</th>
                  <th>Colors</th>
                  <th>Sizes</th>
                  <th>Total Stock</th>
                  <th>Status</th>
                  <th class="text-end">Action</th>
                </tr>
              </thead>
              <tbody>
                <tr v-if="isLoadingProducts">
                  <td colspan="11" class="text-center py-4">Loading products...</td>
                </tr>
                <tr v-else-if="products.length === 0">
                  <td colspan="11" class="text-center py-4">No products found.</td>
                </tr>
                <tr v-for="(product, index) in products" v-else :key="product.id">
                  <td>{{ (productMeta.current_page - 1) * productMeta.per_page + index + 1 }}</td>
                  <td>
                    <div class="fw-medium">{{ product.title }}</div>
                    <small class="text-muted">{{ product.slug }}</small>
                  </td>
                  <td>
                    <img
                      v-if="getProductImageSrc(product)"
                      :src="getProductImageSrc(product)"
                      alt="Product Image"
                      class="catalog-thumb"
                    />
                    <span v-else class="text-muted">N/A</span>
                  </td>
                  <td>{{ product.category?.name || 'N/A' }}</td>
                  <td>{{ product.brand?.name || 'N/A' }}</td>
                  <td>{{ product.price }}</td>
                  <td>{{ getProductColors(product) }}</td>
                  <td>{{ getProductSizes(product) }}</td>
                  <td>{{ getProductStock(product) }}</td>
                  <td>
                    <span
                      class="badge"
                      :class="product.is_active ? 'bg-success-subtle text-success' : 'bg-danger-subtle text-danger'"
                    >
                      {{ product.is_active ? 'Active' : 'Inactive' }}
                    </span>
                  </td>
                  <td class="text-end">
                    <div class="btn-group btn-group-sm">
                      <button type="button" class="btn btn-light" @click="startEdit(product)">Edit</button>
                      <button
                        type="button"
                        class="btn btn-danger-subtle text-danger"
                        :disabled="isDeletingProduct"
                        @click="handleDelete(product)"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div class="d-flex justify-content-between align-items-center mt-3">
            <small class="text-muted">
              Page {{ productMeta.current_page }} of {{ productMeta.last_page }}
            </small>
            <div class="btn-group btn-group-sm">
              <button
                class="btn btn-light"
                :disabled="productMeta.current_page <= 1 || isLoadingProducts"
                @click="loadProducts(productMeta.current_page - 1)"
              >
                Prev
              </button>
              <button
                class="btn btn-light"
                :disabled="productMeta.current_page >= productMeta.last_page || isLoadingProducts"
                @click="loadProducts(productMeta.current_page + 1)"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.table-scroll-wrap {
  width: 100%;
  overflow-x: auto;
  cursor: grab;
}

.page-title {
  background: transparent !important;
}

.table-scroll-wrap.is-dragging,
.table-scroll-wrap.is-dragging * {
  cursor: grabbing;
  user-select: none;
}

@media (max-width: 991.98px), (pointer: coarse) {
  .table-scroll-wrap {
    cursor: auto;
  }
}

.filter-action-row {
  margin: 14px 0 18px;
  display: flex;
  gap: 10px;
  justify-content: flex-end;
}

.filter-action-row .btn {
  min-width: 120px;
  padding: 0.5rem 1rem;
}

.slug-input-group .btn {
  min-width: 72px;
}

@media (max-width: 767.98px) {
  .filter-action-row {
    justify-content: stretch;
  }

  .filter-action-row .btn {
    flex: 1 1 auto;
  }
}

.variant-table {
  min-width: 720px;
}

.product-table {
  min-width: 1400px;
}

.catalog-thumb {
  width: 44px;
  height: 44px;
  object-fit: cover;
  border-radius: 8px;
  border: 1px solid #e9ecef;
}

.catalog-preview {
  width: 92px;
  height: 92px;
  object-fit: cover;
  border-radius: 10px;
  border: 1px solid #e9ecef;
}
</style>
