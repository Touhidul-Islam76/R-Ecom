<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, reactive, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useAdminCatalogStore, type BrandItem } from '~/stores/adminCatalogStore'
import { useHorizontalDragScroll } from '~/composables/useHorizontalDragScroll'
import { useToast } from '~/composables/useToast'

definePageMeta({ layout: 'admin' })
useHead({ title: 'Brands | FasionAble Admin' })

const store = useAdminCatalogStore()
const { enableOnElement } = useHorizontalDragScroll()
const toast = useToast()
const { brands, brandMeta, isLoadingBrands, isSavingBrand, isDeletingBrand } = storeToRefs(store)

const editingBrandId = ref<number | null>(null)
const tableScrollRefs = ref<HTMLElement[]>([])
const imageFileInputRef = ref<HTMLInputElement | null>(null)
const uploadedPreviewUrl = ref('')
const currentImagePreviewUrl = ref('')
const removeCurrentImage = ref(false)
const form = reactive({
  name: '',
  slug: '',
  image_url: '',
  image_file: null as File | null,
  is_active: true,
})

const isEditing = computed(() => editingBrandId.value !== null)
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

const clearUploadedPreviewUrl = () => {
  if (uploadedPreviewUrl.value) {
    URL.revokeObjectURL(uploadedPreviewUrl.value)
    uploadedPreviewUrl.value = ''
  }
}

const resetForm = () => {
  clearUploadedPreviewUrl()
  editingBrandId.value = null
  removeCurrentImage.value = false
  currentImagePreviewUrl.value = ''
  form.name = ''
  form.slug = ''
  form.image_url = ''
  form.image_file = null
  form.is_active = true
  if (imageFileInputRef.value) imageFileInputRef.value.value = ''
}

const setError = (message: string) => {
  toast.error(message)
}

const setSuccess = (message: string) => {
  toast.success(message)
}

const loadBrands = async (page = 1) => {
  try {
    await store.fetchBrands(page)
  } catch (error) {
    setError((error as Error).message)
  }
}

const handleSubmit = async () => {
  try {
    if (!form.name.trim() || !form.slug.trim()) {
      setError('Name and slug are required.')
      return
    }

    const imageValue = removeCurrentImage.value
      ? null
      : form.image_file ?? (form.image_url.trim() || null)

    if (isEditing.value && editingBrandId.value) {
      await store.updateBrand(editingBrandId.value, {
        name: form.name,
        slug: form.slug,
        image: imageValue,
        is_active: form.is_active,
      })
      setSuccess('Brand updated successfully.')
    } else {
      await store.createBrand({
        name: form.name,
        slug: form.slug,
        image: imageValue,
        is_active: form.is_active,
      })
      setSuccess('Brand created successfully.')
    }

    resetForm()
  } catch (error) {
    setError((error as Error).message)
  }
}

const startEdit = (brand: BrandItem) => {
  clearUploadedPreviewUrl()
  editingBrandId.value = brand.id
  removeCurrentImage.value = false
  currentImagePreviewUrl.value = brand.image_url || brand.image || ''
  form.name = brand.name || ''
  form.slug = brand.slug || ''
  form.image_url = brand.image || ''
  form.image_file = null
  form.is_active = Boolean(brand.is_active)
  if (imageFileInputRef.value) imageFileInputRef.value.value = ''
}

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

const getBrandImageSrc = (brand: BrandItem) => brand.image_url || brand.image || ''

const handleDelete = async (brand: BrandItem) => {
  if (!confirm(`Delete brand "${brand.name}"?`)) return

  try {
    await store.deleteBrand(brand.id)
    setSuccess('Brand deleted successfully.')
    if (editingBrandId.value === brand.id) resetForm()
  } catch (error) {
    setError((error as Error).message)
  }
}

const generateSlugFromName = () => {
  form.slug = slugify(form.name)
}

onMounted(async () => {
  await nextTick()
  tableScrollRefs.value.forEach((el) => enableOnElement(el))
  await loadBrands(1)
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
            <li class="breadcrumb-item active">Brands</li>
          </ol>
        </div>
        <h4 class="page-title">Brand Management</h4>
      </div>
    </div>
  </div>

  <div class="row g-3">
    <div class="col-12">
      <div class="card">
        <div class="card-body">
          <h5 class="header-title mb-3">{{ isEditing ? 'Edit Brand' : 'Create Brand' }}</h5>

          <div class="row g-3">
            <div class="col-lg-4">
              <label class="form-label">Name</label>
              <input v-model="form.name" type="text" class="form-control" placeholder="Nike" />
            </div>

            <div class="col-lg-4">
              <label class="form-label">Slug</label>
              <div class="input-group slug-input-group">
                <input v-model="form.slug" type="text" class="form-control" placeholder="nike" />
                <button type="button" class="btn btn-outline-secondary" @click="generateSlugFromName">Auto</button>
              </div>
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

            <div class="col-lg-4">
              <label class="form-label d-block">Preview</label>
              <img
                v-if="effectiveImagePreview"
                :src="effectiveImagePreview"
                alt="Brand Preview"
                class="catalog-preview"
              />
              <div v-else class="text-muted small mt-2">No image selected.</div>
            </div>

            <div class="col-12 d-flex flex-wrap align-items-center gap-3">
              <div v-if="isEditing" class="form-check mb-0">
                <input
                  id="brand-remove-image"
                  v-model="removeCurrentImage"
                  class="form-check-input"
                  type="checkbox"
                  @change="toggleRemoveCurrentImage"
                />
                <label class="form-check-label" for="brand-remove-image">Remove current image</label>
              </div>

              <div class="form-check form-switch mb-0">
                <input id="brand-active" v-model="form.is_active" class="form-check-input" type="checkbox" />
                <label class="form-check-label" for="brand-active">Active</label>
              </div>

              <div class="d-flex gap-2 ms-lg-auto">
                <button
                  type="button"
                  class="btn btn-primary"
                  :disabled="isSavingBrand"
                  @click="handleSubmit"
                >
                  {{ isSavingBrand ? 'Saving...' : isEditing ? 'Update Brand' : 'Create Brand' }}
                </button>
                <button
                  v-if="isEditing"
                  type="button"
                  class="btn btn-light"
                  :disabled="isSavingBrand"
                  @click="resetForm"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="col-12">
      <div class="card">
        <div class="card-body">
          <div class="d-flex justify-content-between align-items-center mb-3">
            <h5 class="header-title mb-0">Brand List</h5>
            <small class="text-muted">Total: {{ brandMeta.total }}</small>
          </div>

          <div :ref="setTableScrollRef" class="table-scroll-wrap">
            <table class="table table-hover align-middle mb-0 brand-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Name</th>
                  <th>Slug</th>
                  <th>Status</th>
                  <th>Image</th>
                  <th class="text-end">Action</th>
                </tr>
              </thead>
              <tbody>
                <tr v-if="isLoadingBrands">
                  <td colspan="6" class="text-center py-4">Loading brands...</td>
                </tr>
                <tr v-else-if="brands.length === 0">
                  <td colspan="6" class="text-center py-4">No brands found.</td>
                </tr>
                <tr v-for="(brand, index) in brands" v-else :key="brand.id">
                  <td>{{ (brandMeta.current_page - 1) * brandMeta.per_page + index + 1 }}</td>
                  <td>{{ brand.name }}</td>
                  <td>{{ brand.slug }}</td>
                  <td>
                    <span
                      class="badge"
                      :class="brand.is_active ? 'bg-success-subtle text-success' : 'bg-danger-subtle text-danger'"
                    >
                      {{ brand.is_active ? 'Active' : 'Inactive' }}
                    </span>
                  </td>
                  <td>
                    <img
                      v-if="getBrandImageSrc(brand)"
                      :src="getBrandImageSrc(brand)"
                      alt="Brand Image"
                      class="catalog-thumb"
                    />
                    <span v-else class="text-muted">N/A</span>
                  </td>
                  <td class="text-end">
                    <div class="btn-group btn-group-sm">
                      <button type="button" class="btn btn-light" @click="startEdit(brand)">Edit</button>
                      <button
                        type="button"
                        class="btn btn-danger-subtle text-danger"
                        :disabled="isDeletingBrand"
                        @click="handleDelete(brand)"
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
              Page {{ brandMeta.current_page }} of {{ brandMeta.last_page }}
            </small>
            <div class="btn-group btn-group-sm">
              <button
                class="btn btn-light"
                :disabled="brandMeta.current_page <= 1 || isLoadingBrands"
                @click="loadBrands(brandMeta.current_page - 1)"
              >
                Prev
              </button>
              <button
                class="btn btn-light"
                :disabled="brandMeta.current_page >= brandMeta.last_page || isLoadingBrands"
                @click="loadBrands(brandMeta.current_page + 1)"
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

.brand-table {
  min-width: 820px;
}

.slug-input-group .btn {
  min-width: 72px;
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
