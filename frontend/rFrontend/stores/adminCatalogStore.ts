import { defineStore } from 'pinia'
import {
  createBrandRequest,
  createCategoryRequest,
  createProductRequest,
  deleteBrandRequest,
  deleteCategoryRequest,
  deleteProductRequest,
  fetchBrandsRequest,
  fetchCategoriesRequest,
  fetchProductsRequest,
  updateBrandRequest,
  updateCategoryRequest,
  updateProductRequest,
} from '~/public/js/services/axiosClient.js'

type ApiError = {
  response?: { status?: number; data?: { message?: string; errors?: Record<string, string[]> } }
  message?: string
}

type PaginatedResponse<T> = {
  current_page?: number
  data?: T[]
  last_page?: number
  per_page?: number
  total?: number
}

type PaginationMeta = {
  current_page: number
  last_page: number
  per_page: number
  total: number
}

export type BrandItem = {
  id: number
  name: string
  slug: string
  image?: string | null
  image_url?: string | null
  is_active: boolean
}

export type CategoryItem = {
  id: number
  name: string
  slug: string
  parent_id?: number | null
  image?: string | null
  image_url?: string | null
  is_active: boolean
  parent?: CategoryItem | null
  children?: CategoryItem[]
}

export type ProductVariantItem = {
  id?: number
  size: 'S' | 'M' | 'L' | 'XL' | 'XXL'
  color: string
  quantity: number
  price: number
  discount_price?: number | null
}

export type ProductItem = {
  id: number
  title: string
  slug: string
  short_description?: string | null
  price: number | string
  rating?: number | string | null
  image?: string | null
  image_url?: string | null
  category_id?: number | null
  brand_id?: number | null
  is_active: boolean
  category?: CategoryItem | null
  brand?: BrandItem | null
  variants?: ProductVariantItem[]
}

export type BrandPayload = {
  name: string
  slug: string
  image?: string | File | null
  is_active: boolean
}

export type CategoryPayload = {
  name: string
  slug: string
  parent_id?: number | null
  image?: string | File | null
  is_active: boolean
}

export type ProductPayload = {
  title: string
  slug: string
  short_description?: string | null
  price: number | string
  rating?: number | string | null
  image?: string | File | null
  category_id?: number | null
  brand_id?: number | null
  is_active: boolean
  variants: ProductVariantItem[]
}

export type ProductFilters = {
  search: string
  category_id: string
  brand_id: string
  size: string
  color: string
  min_price: string
  max_price: string
  sort: string
}

const defaultPagination = (): PaginationMeta => ({
  current_page: 1,
  last_page: 1,
  per_page: 15,
  total: 0,
})

const defaultProductFilters = (): ProductFilters => ({
  search: '',
  category_id: '',
  brand_id: '',
  size: '',
  color: '',
  min_price: '',
  max_price: '',
  sort: '',
})

const parseErrorMessage = (error: unknown, fallback: string) => {
  const err = error as ApiError
  const apiMessage = err?.response?.data?.message
  if (apiMessage) return apiMessage

  const firstValidation = Object.values(err?.response?.data?.errors ?? {})?.[0]?.[0]
  if (firstValidation) return firstValidation

  return err?.message || fallback
}

const toNullableString = (value: unknown) => {
  if (value === null || value === undefined) return null
  const text = String(value).trim()
  return text || null
}

const isFileValue = (value: unknown): value is File =>
  typeof File !== 'undefined' && value instanceof File

const normalizeImageInput = (value: unknown): string | File | null => {
  if (isFileValue(value)) return value
  return toNullableString(value)
}

const hasFileDeep = (value: unknown): boolean => {
  if (isFileValue(value)) return true

  if (Array.isArray(value)) {
    return value.some((item) => hasFileDeep(item))
  }

  if (value && typeof value === 'object') {
    return Object.values(value as Record<string, unknown>).some((item) => hasFileDeep(item))
  }

  return false
}

const appendFormDataValue = (formData: FormData, key: string, value: unknown): void => {
  if (value === undefined) return

  if (value === null) {
    formData.append(key, '')
    return
  }

  if (isFileValue(value)) {
    formData.append(key, value)
    return
  }

  if (Array.isArray(value)) {
    value.forEach((item, index) => {
      appendFormDataValue(formData, `${key}[${index}]`, item)
    })
    return
  }

  if (value && typeof value === 'object') {
    Object.entries(value as Record<string, unknown>).forEach(([nestedKey, nestedValue]) => {
      appendFormDataValue(formData, `${key}[${nestedKey}]`, nestedValue)
    })
    return
  }

  if (typeof value === 'boolean') {
    formData.append(key, value ? '1' : '0')
    return
  }

  formData.append(key, String(value))
}

const toRequestPayload = <T extends Record<string, unknown>>(payload: T): T | FormData => {
  if (typeof FormData === 'undefined' || !hasFileDeep(payload)) {
    return payload
  }

  const formData = new FormData()
  Object.entries(payload).forEach(([key, value]) => appendFormDataValue(formData, key, value))

  return formData
}

const toNullableNumber = (value: unknown) => {
  if (value === null || value === undefined || value === '') return null
  const numeric = Number(value)
  return Number.isNaN(numeric) ? null : numeric
}

const toRequiredNumber = (value: unknown, fallback = 0) => {
  const numeric = Number(value)
  return Number.isNaN(numeric) ? fallback : numeric
}

const normalizePagination = <T>(payload: PaginatedResponse<T> | undefined): { items: T[]; meta: PaginationMeta } => ({
  items: payload?.data ?? [],
  meta: {
    current_page: payload?.current_page ?? 1,
    last_page: payload?.last_page ?? 1,
    per_page: payload?.per_page ?? 15,
    total: payload?.total ?? 0,
  },
})

const compactParams = (params: Record<string, string | number | null | undefined>) =>
  Object.fromEntries(
    Object.entries(params).filter(([, value]) => value !== '' && value !== null && value !== undefined),
  )

export const useAdminCatalogStore = defineStore('adminCatalog', {
  state: () => ({
    brands: [] as BrandItem[],
    brandMeta: defaultPagination(),
    isLoadingBrands: false,
    isSavingBrand: false,
    isDeletingBrand: false,

    categories: [] as CategoryItem[],
    categoryMeta: defaultPagination(),
    isLoadingCategories: false,
    isSavingCategory: false,
    isDeletingCategory: false,

    products: [] as ProductItem[],
    productMeta: defaultPagination(),
    productFilters: defaultProductFilters(),
    isLoadingProducts: false,
    isSavingProduct: false,
    isDeletingProduct: false,

    brandOptions: [] as BrandItem[],
    categoryOptions: [] as CategoryItem[],
    isLoadingOptions: false,

    lastMessage: '' as string,
    lastError: '' as string,
  }),
  actions: {
    setLastMessage(message: string) {
      this.lastMessage = message
      this.lastError = ''
    },

    setLastError(error: unknown, fallback: string) {
      this.lastMessage = ''
      this.lastError = parseErrorMessage(error, fallback)
      return this.lastError
    },

    clearNotices() {
      this.lastMessage = ''
      this.lastError = ''
    },

    async fetchBrands(page = 1) {
      this.isLoadingBrands = true
      try {
        const response = await fetchBrandsRequest({ page, include_inactive: 1 })
        const normalized = normalizePagination<BrandItem>(response?.data as PaginatedResponse<BrandItem>)
        this.brands = normalized.items
        this.brandMeta = normalized.meta
      } catch (error) {
        throw new Error(this.setLastError(error, 'Failed to load brands.'))
      } finally {
        this.isLoadingBrands = false
      }
    },

    async createBrand(payload: BrandPayload) {
      this.isSavingBrand = true
      try {
        const requestBody = {
          name: payload.name.trim(),
          slug: payload.slug.trim(),
          image: normalizeImageInput(payload.image),
          is_active: Boolean(payload.is_active),
        }

        await createBrandRequest(toRequestPayload(requestBody))
        await this.fetchBrands(1)
        await this.loadBrandOptions()
        this.setLastMessage('Brand created successfully.')
      } catch (error) {
        throw new Error(this.setLastError(error, 'Failed to create brand.'))
      } finally {
        this.isSavingBrand = false
      }
    },

    async updateBrand(brandId: number, payload: BrandPayload) {
      this.isSavingBrand = true
      try {
        const requestBody = {
          name: payload.name.trim(),
          slug: payload.slug.trim(),
          image: normalizeImageInput(payload.image),
          is_active: Boolean(payload.is_active),
        }

        await updateBrandRequest(brandId, toRequestPayload(requestBody))
        await this.fetchBrands(this.brandMeta.current_page)
        await this.loadBrandOptions()
        this.setLastMessage('Brand updated successfully.')
      } catch (error) {
        throw new Error(this.setLastError(error, 'Failed to update brand.'))
      } finally {
        this.isSavingBrand = false
      }
    },

    async deleteBrand(brandId: number) {
      this.isDeletingBrand = true
      try {
        await deleteBrandRequest(brandId)
        await this.fetchBrands(this.brandMeta.current_page)
        await this.loadBrandOptions()
        this.setLastMessage('Brand deleted successfully.')
      } catch (error) {
        throw new Error(this.setLastError(error, 'Failed to delete brand.'))
      } finally {
        this.isDeletingBrand = false
      }
    },

    async fetchCategories(page = 1) {
      this.isLoadingCategories = true
      try {
        const response = await fetchCategoriesRequest({ page, include_inactive: 1 })
        const normalized = normalizePagination<CategoryItem>(response?.data as PaginatedResponse<CategoryItem>)
        this.categories = normalized.items
        this.categoryMeta = normalized.meta
      } catch (error) {
        throw new Error(this.setLastError(error, 'Failed to load categories.'))
      } finally {
        this.isLoadingCategories = false
      }
    },

    async createCategory(payload: CategoryPayload) {
      this.isSavingCategory = true
      try {
        const requestBody = {
          name: payload.name.trim(),
          slug: payload.slug.trim(),
          parent_id: toNullableNumber(payload.parent_id),
          image: normalizeImageInput(payload.image),
          is_active: Boolean(payload.is_active),
        }

        await createCategoryRequest(toRequestPayload(requestBody))
        await this.fetchCategories(1)
        await this.loadCategoryOptions()
        this.setLastMessage('Category created successfully.')
      } catch (error) {
        throw new Error(this.setLastError(error, 'Failed to create category.'))
      } finally {
        this.isSavingCategory = false
      }
    },

    async updateCategory(categoryId: number, payload: CategoryPayload) {
      this.isSavingCategory = true
      try {
        const requestBody = {
          name: payload.name.trim(),
          slug: payload.slug.trim(),
          parent_id: toNullableNumber(payload.parent_id),
          image: normalizeImageInput(payload.image),
          is_active: Boolean(payload.is_active),
        }

        await updateCategoryRequest(categoryId, toRequestPayload(requestBody))
        await this.fetchCategories(this.categoryMeta.current_page)
        await this.loadCategoryOptions()
        this.setLastMessage('Category updated successfully.')
      } catch (error) {
        throw new Error(this.setLastError(error, 'Failed to update category.'))
      } finally {
        this.isSavingCategory = false
      }
    },

    async deleteCategory(categoryId: number) {
      this.isDeletingCategory = true
      try {
        await deleteCategoryRequest(categoryId)
        await this.fetchCategories(this.categoryMeta.current_page)
        await this.loadCategoryOptions()
        this.setLastMessage('Category deleted successfully.')
      } catch (error) {
        throw new Error(this.setLastError(error, 'Failed to delete category.'))
      } finally {
        this.isDeletingCategory = false
      }
    },

    setProductFilters(filters: Partial<ProductFilters>) {
      this.productFilters = {
        ...this.productFilters,
        ...filters,
      }
    },

    resetProductFilters() {
      this.productFilters = defaultProductFilters()
    },

    async fetchProducts(page = 1, filters?: Partial<ProductFilters>) {
      if (filters) this.setProductFilters(filters)

      this.isLoadingProducts = true
      try {
        const params = compactParams({
          page,
          include_inactive: 1,
          ...this.productFilters,
        })

        const response = await fetchProductsRequest(params)
        const normalized = normalizePagination<ProductItem>(response?.data as PaginatedResponse<ProductItem>)
        this.products = normalized.items
        this.productMeta = normalized.meta
      } catch (error) {
        throw new Error(this.setLastError(error, 'Failed to load products.'))
      } finally {
        this.isLoadingProducts = false
      }
    },

    async createProduct(payload: ProductPayload) {
      this.isSavingProduct = true
      try {
        const requestBody = {
          title: payload.title.trim(),
          slug: payload.slug.trim(),
          short_description: toNullableString(payload.short_description),
          price: toRequiredNumber(payload.price),
          rating: toNullableNumber(payload.rating),
          image: normalizeImageInput(payload.image),
          category_id: toNullableNumber(payload.category_id),
          brand_id: toNullableNumber(payload.brand_id),
          is_active: Boolean(payload.is_active),
          variants: payload.variants.map((variant) => ({
            size: variant.size,
            color: variant.color.trim(),
            quantity: Math.max(0, Math.floor(toRequiredNumber(variant.quantity, 0))),
            price: toRequiredNumber(variant.price),
            discount_price: toNullableNumber(variant.discount_price),
          })),
        }

        if (!requestBody.variants.length) {
          throw new Error('At least one product variant is required.')
        }

        await createProductRequest(toRequestPayload(requestBody))
        await this.fetchProducts(1)
        this.setLastMessage('Product created successfully.')
      } catch (error) {
        throw new Error(this.setLastError(error, 'Failed to create product.'))
      } finally {
        this.isSavingProduct = false
      }
    },

    async updateProduct(productId: number, payload: ProductPayload) {
      this.isSavingProduct = true
      try {
        const requestBody = {
          title: payload.title.trim(),
          slug: payload.slug.trim(),
          short_description: toNullableString(payload.short_description),
          price: toRequiredNumber(payload.price),
          rating: toNullableNumber(payload.rating),
          image: normalizeImageInput(payload.image),
          category_id: toNullableNumber(payload.category_id),
          brand_id: toNullableNumber(payload.brand_id),
          is_active: Boolean(payload.is_active),
          variants: payload.variants.map((variant) => ({
            size: variant.size,
            color: variant.color.trim(),
            quantity: Math.max(0, Math.floor(toRequiredNumber(variant.quantity, 0))),
            price: toRequiredNumber(variant.price),
            discount_price: toNullableNumber(variant.discount_price),
          })),
        }

        if (!requestBody.variants.length) {
          throw new Error('At least one product variant is required.')
        }

        await updateProductRequest(productId, toRequestPayload(requestBody))
        await this.fetchProducts(this.productMeta.current_page)
        this.setLastMessage('Product updated successfully.')
      } catch (error) {
        throw new Error(this.setLastError(error, 'Failed to update product.'))
      } finally {
        this.isSavingProduct = false
      }
    },

    async deleteProduct(productId: number) {
      this.isDeletingProduct = true
      try {
        await deleteProductRequest(productId)
        await this.fetchProducts(this.productMeta.current_page)
        this.setLastMessage('Product deleted successfully.')
      } catch (error) {
        throw new Error(this.setLastError(error, 'Failed to delete product.'))
      } finally {
        this.isDeletingProduct = false
      }
    },

    async loadBrandOptions() {
      this.isLoadingOptions = true
      try {
        const options: BrandItem[] = []
        let page = 1
        let lastPage = 1

        do {
          const response = await fetchBrandsRequest({ page, include_inactive: 1 })
          const payload = response?.data as PaginatedResponse<BrandItem>
          const rows = payload?.data ?? []
          options.push(...rows)
          lastPage = payload?.last_page ?? 1
          page += 1
        } while (page <= lastPage && page <= 50)

        this.brandOptions = options
      } catch (error) {
        this.setLastError(error, 'Failed to load brand options.')
      } finally {
        this.isLoadingOptions = false
      }
    },

    async loadCategoryOptions() {
      this.isLoadingOptions = true
      try {
        const options: CategoryItem[] = []
        let page = 1
        let lastPage = 1

        do {
          const response = await fetchCategoriesRequest({ page, include_inactive: 1 })
          const payload = response?.data as PaginatedResponse<CategoryItem>
          const rows = payload?.data ?? []
          options.push(...rows)
          lastPage = payload?.last_page ?? 1
          page += 1
        } while (page <= lastPage && page <= 50)

        this.categoryOptions = options
      } catch (error) {
        this.setLastError(error, 'Failed to load category options.')
      } finally {
        this.isLoadingOptions = false
      }
    },

    async preloadCatalogOptions() {
      await Promise.all([this.loadBrandOptions(), this.loadCategoryOptions()])
    },
  },
})
