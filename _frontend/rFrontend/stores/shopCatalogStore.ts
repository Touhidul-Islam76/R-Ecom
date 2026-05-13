import { defineStore } from 'pinia'
import { fetchCategoriesRequest, fetchProductsRequest } from '~/public/js/services/axiosClient.js'

const SHOP_PRODUCTS_PER_PAGE = 12

export type ShopProductVariant = {
  id?: number
  size: 'S' | 'M' | 'L' | 'XL' | 'XXL'
  color: string
  quantity: number
  price: number | string
  discount_price?: number | string | null
}

export type ShopCategoryItem = {
  id: number
  name: string
  slug: string
}

export type ShopProductItem = {
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
  category?: ShopCategoryItem | null
  brand?: { id: number; name: string; slug: string } | null
  variants?: ShopProductVariant[]
}

type PaginatedResponse<T> = {
  current_page?: number
  data?: T[]
  last_page?: number
  per_page?: number
  total?: number
}

type ShopFilters = {
  search: string
  categoryIds: number[]
  topCategoryId: string
  sizes: string[]
  colors: string[]
  sort: string
  minPrice: number | null
  maxPrice: number | null
  isPriceTouched: boolean
}

const defaultFilters = (): ShopFilters => ({
  search: '',
  categoryIds: [],
  topCategoryId: '',
  sizes: [],
  colors: [],
  sort: '',
  minPrice: null,
  maxPrice: null,
  isPriceTouched: false,
})

export const useShopCatalogStore = defineStore('shopCatalog', {
  state: () => ({
    products: [] as ShopProductItem[],
    categoryOptions: [] as ShopCategoryItem[],
    isLoadingProducts: false,
    isLoadingCategories: false,
    errorMessage: '',
    filters: defaultFilters(),
    pagination: {
      current_page: 1,
      last_page: 1,
      per_page: SHOP_PRODUCTS_PER_PAGE,
      total: 0,
    },
  }),
  actions: {
    activeCategoryIds() {
      const ids = [...this.filters.categoryIds]
      if (this.filters.topCategoryId) {
        ids.push(Number(this.filters.topCategoryId))
      }

      return Array.from(new Set(ids)).filter((id) => Number.isFinite(id) && id > 0)
    },

    async fetchProducts(page = 1) {
      this.isLoadingProducts = true
      this.errorMessage = ''

      try {
        // Keep storefront product count stable regardless of any cached/persisted store snapshot.
        this.pagination.per_page = SHOP_PRODUCTS_PER_PAGE
        const params: Record<string, string | number> = {
          page,
          per_page: SHOP_PRODUCTS_PER_PAGE,
        }
        const search = this.filters.search.trim()

        if (search) params.search = search

        const activeCategories = this.activeCategoryIds()
        if (activeCategories.length) params.category_id = activeCategories.join(',')
        if (this.filters.sizes.length) params.size = this.filters.sizes.join(',')
        if (this.filters.colors.length) params.color = this.filters.colors.join(',')
        if (this.filters.sort) params.sort = this.filters.sort
        if (this.filters.isPriceTouched && this.filters.minPrice !== null) params.min_price = this.filters.minPrice
        if (this.filters.isPriceTouched && this.filters.maxPrice !== null) params.max_price = this.filters.maxPrice

        const response = await fetchProductsRequest(params)
        const payload = (response?.data ?? {}) as PaginatedResponse<ShopProductItem>

        this.products = payload.data ?? []
        this.pagination.current_page = payload.current_page ?? 1
        this.pagination.last_page = payload.last_page ?? 1
        this.pagination.per_page = payload.per_page ?? SHOP_PRODUCTS_PER_PAGE
        this.pagination.total = payload.total ?? 0
      } catch (error) {
        console.error(error)
        this.errorMessage = 'Failed to load products. Please try again.'
      } finally {
        this.isLoadingProducts = false
      }
    },

    async fetchCategoryOptions() {
      this.isLoadingCategories = true
      try {
        const options: ShopCategoryItem[] = []
        let page = 1
        let lastPage = 1

        do {
          const response = await fetchCategoriesRequest({ page })
          const payload = (response?.data ?? {}) as PaginatedResponse<ShopCategoryItem>
          options.push(...(payload.data ?? []))
          lastPage = payload.last_page ?? 1
          page += 1
        } while (page <= lastPage && page <= 50)

        this.categoryOptions = options
      } catch (error) {
        console.error(error)
        this.categoryOptions = []
      } finally {
        this.isLoadingCategories = false
      }
    },

    resetFilters() {
      const defaults = defaultFilters()
      this.filters.search = defaults.search
      this.filters.categoryIds = defaults.categoryIds
      this.filters.topCategoryId = defaults.topCategoryId
      this.filters.sizes = defaults.sizes
      this.filters.colors = defaults.colors
      this.filters.sort = defaults.sort
      this.filters.minPrice = defaults.minPrice
      this.filters.maxPrice = defaults.maxPrice
      this.filters.isPriceTouched = defaults.isPriceTouched
    },
  },
})
