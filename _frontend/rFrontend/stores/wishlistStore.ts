import { defineStore } from 'pinia'
import {
  addWishlistItemRequest,
  clearWishlistRequest,
  fetchWishlistRequest,
  removeWishlistItemRequest,
} from '~/public/js/services/axiosClient.js'

export type WishlistItem = {
  id: number
  product_id: number
  title: string
  slug: string
  image: string
  price: number
  old_price: number | null
  added_at?: string
}

const WISHLIST_STORAGE_KEY = 'recom_wishlist'

const toNumber = (value: unknown): number => {
  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : 0
}

const normalizeWishlistItem = (item: unknown): WishlistItem | null => {
  const row = item as Record<string, unknown>
  const id = Math.floor(toNumber(row?.id))
  const productId = Math.floor(toNumber(row?.product_id))

  if (!id || !productId) return null

  const oldPriceRaw = row?.old_price
  const oldPrice = oldPriceRaw === null || oldPriceRaw === undefined ? null : Math.max(0, toNumber(oldPriceRaw))

  return {
    id,
    product_id: productId,
    title: String(row?.title ?? '').trim() || 'Product',
    slug: String(row?.slug ?? '').trim(),
    image:
      String(row?.image ?? '').trim() ||
      String(row?.image_url ?? '').trim() ||
      '/assets/default/profile4.jpg',
    price: Math.max(0, toNumber(row?.price)),
    old_price: oldPrice,
    added_at: String(row?.added_at ?? '').trim() || undefined,
  }
}

const normalizeWishlistItems = (items: unknown): WishlistItem[] => {
  if (!Array.isArray(items)) return []

  return items
    .map((item) => normalizeWishlistItem(item))
    .filter((item): item is WishlistItem => Boolean(item))
}

const extractServerItems = (payload: unknown): WishlistItem[] | null => {
  const row = payload as Record<string, unknown>

  if (Array.isArray(payload)) {
    return normalizeWishlistItems(payload)
  }

  if (row && typeof row === 'object' && Array.isArray(row.items)) {
    return normalizeWishlistItems(row.items)
  }

  const nested = row?.data as Record<string, unknown>
  if (nested && typeof nested === 'object' && Array.isArray(nested.items)) {
    return normalizeWishlistItems(nested.items)
  }

  return null
}

const hasAuthToken = (): boolean => {
  if (typeof window === 'undefined') return false
  return Boolean(localStorage.getItem('auth_token'))
}

export const useWishlistStore = defineStore('wishlist', {
  state: () => ({
    items: [] as WishlistItem[],
    isHydrated: false,
    isLoading: false,
  }),
  getters: {
    totalItems: (state) => state.items.length,
    hasProduct: (state) => (productId: number) =>
      state.items.some((item) => item.product_id === Number(productId)),
  },
  actions: {
    hydrateWishlist() {
      if (this.isHydrated || typeof window === 'undefined') return

      try {
        const raw = localStorage.getItem(WISHLIST_STORAGE_KEY)
        const parsed = raw ? JSON.parse(raw) : []
        this.items = normalizeWishlistItems(parsed)
      } catch {
        this.items = []
      } finally {
        this.isHydrated = true
      }
    },

    persistWishlist() {
      if (typeof window === 'undefined') return
      localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(this.items))
    },

    resetLocalWishlist() {
      this.items = []
      this.persistWishlist()
    },

    applyServerWishlist(payload: unknown): boolean {
      const normalized = extractServerItems(payload)
      if (!normalized) return false

      this.items = normalized
      this.persistWishlist()
      return true
    },

    async refreshFromServer() {
      if (typeof window === 'undefined') return
      this.hydrateWishlist()

      if (!hasAuthToken()) {
        this.resetLocalWishlist()
        return
      }

      this.isLoading = true
      try {
        const response = await fetchWishlistRequest()
        this.applyServerWishlist(response?.data)
      } catch (error) {
        console.warn('Failed to refresh wishlist from backend.', error)
      } finally {
        this.isLoading = false
      }
    },

    async addProduct(productId: number): Promise<boolean> {
      this.hydrateWishlist()

      if (!hasAuthToken()) return false

      try {
        const response = await addWishlistItemRequest({ product_id: Number(productId) })
        this.applyServerWishlist(response?.data)
        return true
      } catch (error) {
        console.warn('Failed to add product to wishlist.', error)
        return false
      }
    },

    async removeProduct(productId: number): Promise<boolean> {
      this.hydrateWishlist()

      if (!hasAuthToken()) return false

      try {
        const response = await removeWishlistItemRequest(Number(productId))
        this.applyServerWishlist(response?.data)
        return true
      } catch (error) {
        console.warn('Failed to remove product from wishlist.', error)
        return false
      }
    },

    async toggleProduct(productId: number): Promise<boolean> {
      if (this.hasProduct(productId)) {
        return this.removeProduct(productId)
      }

      return this.addProduct(productId)
    },

    async clearWishlist() {
      this.hydrateWishlist()

      if (!hasAuthToken()) {
        this.resetLocalWishlist()
        return
      }

      try {
        const response = await clearWishlistRequest()
        this.applyServerWishlist(response?.data)
      } catch (error) {
        console.warn('Failed to clear wishlist.', error)
      }
    },
  },
})

