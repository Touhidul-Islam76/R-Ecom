<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, reactive, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useAdminCatalogStore, type CategoryItem } from '~/stores/adminCatalogStore'
import { useHorizontalDragScroll } from '~/composables/useHorizontalDragScroll'
import { useToast } from '~/composables/useToast'

definePageMeta({ layout: 'admin' })
useHead({ title: 'Categories | FasionAble Admin' })

const store = useAdminCatalogStore()
const { enableOnElement } = useHorizontalDragScroll()
const toast = useToast()
const { categories, categoryMeta, categoryOptions, isLoadingCategories, isSavingCategory, isDeletingCategory } =
  storeToRefs(store)

const editingCategoryId = ref<number | null>(null)
const tableScrollRefs = ref<HTMLElement[]>([])
const imageFileInputRef = ref<HTMLInputElement | null>(null)
const uploadedPreviewUrl = ref('')
const currentImagePreviewUrl = ref('')
const removeCurrentImage = ref(false)
const form = reactive({
  name: '',
  slug: '',
  parent_id: '',
  image_url: '',
  image_file: null as File | null,
  is_active: true,
})

const isEditing = computed(() => editingCategoryId.value !== null)
const parentChoices = computed(() =>
  categoryOptions.value.filter((category) => category.id !== editingCategoryId.value),
)
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

const setError = (message: string) => {
  toast.error(message)
}

const setSuccess = (message: string) => {
  toast.success(message)
}

const resetForm = () => {
  clearUploadedPreviewUrl()
  editingCategoryId.value = null
  removeCurrentImage.value = false
  currentImagePreviewUrl.value = ''
  form.name = ''
  form.slug = ''
  form.parent_id = ''
  form.image_url = ''
  form.image_file = null
  form.is_active = true
  if (imageFileInputRef.value) imageFileInputRef.value.value = ''
}

const loadCategories = async (page = 1) => {
  try {
    await store.fetchCategories(page)
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

    const payload = {
      name: form.name,
      slug: form.slug,
      parent_id: form.parent_id ? Number(form.parent_id) : null,
      image: removeCurrentImage.value ? null : form.image_file ?? (form.image_url.trim() || null),
      is_active: form.is_active,
    }

    if (isEditing.value && editingCategoryId.value) {
      await store.updateCategory(editingCategoryId.value, payload)
      setSuccess('Category updated successfully.')
    } else {
      await store.createCategory(payload)
      setSuccess('Category created successfully.')
    }

    resetForm()
  } catch (error) {
    setError((error as Error).message)
  }
}

const startEdit = (category: CategoryItem) => {
  clearUploadedPreviewUrl()
  editingCategoryId.value = category.id
  removeCurrentImage.value = false
  currentImagePreviewUrl.value = category.image_url || category.image || ''
  form.name = category.name || ''
  form.slug = category.slug || ''
  form.parent_id = category.parent_id ? String(category.parent_id) : ''
  form.image_url = category.image || ''
  form.image_file = null
  form.is_active = Boolean(category.is_active)
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

const getCategoryImageSrc = (category: CategoryItem) => category.image_url || category.image || ''

const handleDelete = async (category: CategoryItem) => {
  if (!confirm(`Delete category "${category.name}"?`)) return

  try {
    await store.deleteCategory(category.id)
    setSuccess('Category deleted successfully.')
    if (editingCategoryId.value === category.id) resetForm()
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
  await Promise.all([loadCategories(1), store.loadCategoryOptions()])
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
            <li class="breadcrumb-item active">Categories</li>
          </ol>
        </div>
        <h4 class="page-title">Category Management</h4>
      </div>
    </div>
  </div>

  <div class="row g-3">
    <div class="col-12">
      <div class="card">
        <div class="card-body">
          <h5 class="header-title mb-3">{{ isEditing ? 'Edit Category' : 'Create Category' }}</h5>

          <div class="row g-3">
            <div class="col-lg-3">
              <label class="form-label">Name</label>
              <input v-model="form.name" type="text" class="form-control" placeholder="Men Shoes" />
            </div>

            <div class="col-lg-3">
              <label class="form-label">Slug</label>
              <div class="input-group slug-input-group">
                <input v-model="form.slug" type="text" class="form-control" placeholder="men-shoes" />
                <button type="button" class="btn btn-outline-secondary" @click="generateSlugFromName">Auto</button>
              </div>
            </div>

            <div class="col-lg-3">
              <label class="form-label">Parent Category</label>
              <select v-model="form.parent_id" class="form-select">
                <option value="">No Parent</option>
                <option v-for="category in parentChoices" :key="category.id" :value="String(category.id)">
                  {{ category.name }}
                </option>
              </select>
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
                alt="Category Preview"
                class="catalog-preview"
              />
              <div v-else class="text-muted small mt-2">No image selected.</div>
            </div>

            <div class="col-12 d-flex flex-wrap align-items-center gap-3">
              <div v-if="isEditing" class="form-check mb-0">
                <input
                  id="category-remove-image"
                  v-model="removeCurrentImage"
                  class="form-check-input"
                  type="checkbox"
                  @change="toggleRemoveCurrentImage"
                />
                <label class="form-check-label" for="category-remove-image">Remove current image</label>
              </div>

              <div class="form-check form-switch mb-0">
                <input id="category-active" v-model="form.is_active" class="form-check-input" type="checkbox" />
                <label class="form-check-label" for="category-active">Active</label>
              </div>

              <div class="d-flex gap-2 ms-lg-auto">
                <button
                  type="button"
                  class="btn btn-primary"
                  :disabled="isSavingCategory"
                  @click="handleSubmit"
                >
                  {{ isSavingCategory ? 'Saving...' : isEditing ? 'Update Category' : 'Create Category' }}
                </button>
                <button
                  v-if="isEditing"
                  type="button"
                  class="btn btn-light"
                  :disabled="isSavingCategory"
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
            <h5 class="header-title mb-0">Category List</h5>
            <small class="text-muted">Total: {{ categoryMeta.total }}</small>
          </div>

          <div :ref="setTableScrollRef" class="table-scroll-wrap">
            <table class="table table-hover align-middle mb-0 category-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Name</th>
                  <th>Slug</th>
                  <th>Parent</th>
                  <th>Status</th>
                  <th>Image</th>
                  <th class="text-end">Action</th>
                </tr>
              </thead>
              <tbody>
                <tr v-if="isLoadingCategories">
                  <td colspan="7" class="text-center py-4">Loading categories...</td>
                </tr>
                <tr v-else-if="categories.length === 0">
                  <td colspan="7" class="text-center py-4">No categories found.</td>
                </tr>
                <tr v-for="(category, index) in categories" v-else :key="category.id">
                  <td>{{ (categoryMeta.current_page - 1) * categoryMeta.per_page + index + 1 }}</td>
                  <td>{{ category.name }}</td>
                  <td>{{ category.slug }}</td>
                  <td>{{ category.parent?.name || 'Root' }}</td>
                  <td>
                    <span
                      class="badge"
                      :class="category.is_active ? 'bg-success-subtle text-success' : 'bg-danger-subtle text-danger'"
                    >
                      {{ category.is_active ? 'Active' : 'Inactive' }}
                    </span>
                  </td>
                  <td>
                    <img
                      v-if="getCategoryImageSrc(category)"
                      :src="getCategoryImageSrc(category)"
                      alt="Category Image"
                      class="catalog-thumb"
                    />
                    <span v-else class="text-muted">N/A</span>
                  </td>
                  <td class="text-end">
                    <div class="btn-group btn-group-sm">
                      <button type="button" class="btn btn-light" @click="startEdit(category)">Edit</button>
                      <button
                        type="button"
                        class="btn btn-danger-subtle text-danger"
                        :disabled="isDeletingCategory"
                        @click="handleDelete(category)"
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
              Page {{ categoryMeta.current_page }} of {{ categoryMeta.last_page }}
            </small>
            <div class="btn-group btn-group-sm">
              <button
                class="btn btn-light"
                :disabled="categoryMeta.current_page <= 1 || isLoadingCategories"
                @click="loadCategories(categoryMeta.current_page - 1)"
              >
                Prev
              </button>
              <button
                class="btn btn-light"
                :disabled="categoryMeta.current_page >= categoryMeta.last_page || isLoadingCategories"
                @click="loadCategories(categoryMeta.current_page + 1)"
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

.category-table {
  min-width: 1000px;
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
