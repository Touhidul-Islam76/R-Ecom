import { defineStore } from 'pinia'
import {
  addCartItemRequest,
  clearCartRequest,
  fetchCartRequest,
  removeCartItemRequest,
  updateCartItemRequest,
} from '~/public/js/services/axiosClient.js'

export type CartItem = {
  id?: number
  product_id: number
  product_variant_id?: number | null
  title: string
  image: string
  price: number
  size: string | null
  color: string | null
  quantity: number
}

type CartSyncOptions = {
  mergeGuestCart?: boolean
}

const LEGACY_CART_STORAGE_KEY = 'recom_cart'
const GUEST_CART_STORAGE_KEY = 'recom_cart_guest'
const USER_CART_STORAGE_KEY = 'recom_cart_user'
const GUEST_TOKEN_STORAGE_KEY = 'recom_guest_token'
const GUEST_CART_TTL_MS = 30 * 24 * 60 * 60 * 1000

type PersistedGuestCart = {
  version: 1
  items: CartItem[]
  updatedAt: number
  expiresAt: number
}

type PersistedUserCart = {
  version: 1
  items: CartItem[]
  updatedAt: number
}

const toNumber = (value: unknown): number => {
  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : 0
}

const normalizeText = (value: unknown): string | null => {
  const text = String(value ?? '').trim()
  return text === '' ? null : text
}

const normalizeCartItem = (item: unknown): CartItem | null => {
  const row = item as Record<string, unknown>
  const id = Math.floor(toNumber(row?.id))
  const productId = Math.floor(toNumber(row?.product_id))
  const productVariantId = Math.floor(toNumber(row?.product_variant_id))
  const rawPrice = row?.price ?? row?.unit_price
  const quantity = Math.max(1, Math.floor(toNumber(row?.quantity)))

  if (!productId) return null

  return {
    id: id > 0 ? id : undefined,
    product_id: productId,
    product_variant_id: productVariantId > 0 ? productVariantId : null,
    title: String(row?.title ?? '').trim() || 'Product',
    image:
      String(row?.image ?? '').trim() ||
      String(row?.image_url ?? '').trim() ||
      '/assets/default/profile4.jpg',
    price: Math.max(0, toNumber(rawPrice)),
    size: normalizeText(row?.size),
    color: normalizeText(row?.color),
    quantity,
  }
}

const normalizeCartItems = (items: unknown): CartItem[] => {
  if (!Array.isArray(items)) return []

  return items
    .map((item) => normalizeCartItem(item))
    .filter((item): item is CartItem => Boolean(item))
}

const isSameOption = (left: CartItem, right: CartItem) =>
  left.product_id === right.product_id &&
  String(left.size ?? '').toLowerCase() === String(right.size ?? '').toLowerCase() &&
  String(left.color ?? '').toLowerCase() === String(right.color ?? '').toLowerCase()

const cloneItems = (items: CartItem[]): CartItem[] => items.map((item) => ({ ...item }))

const createGuestToken = (): string => {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID()
  }

  return `guest_${Date.now()}_${Math.random().toString(36).slice(2, 14)}`
}

const extractServerItems = (payload: unknown): CartItem[] | null => {
  const row = payload as Record<string, unknown>

  if (Array.isArray(payload)) {
    return normalizeCartItems(payload)
  }

  if (row && typeof row === 'object' && Array.isArray(row.items)) {
    return normalizeCartItems(row.items)
  }

  const nested = row?.data as Record<string, unknown>
  if (nested && typeof nested === 'object' && Array.isArray(nested.items)) {
    return normalizeCartItems(nested.items)
  }

  return null
}

const isClientAuthenticated = (): boolean => {
  if (typeof window === 'undefined') return false
  return Boolean(localStorage.getItem('auth_token'))
}

const getActiveStorageKey = (): string =>
  isClientAuthenticated() ? USER_CART_STORAGE_KEY : GUEST_CART_STORAGE_KEY

const readLegacyCartItems = (): CartItem[] => {
  if (typeof window === 'undefined') return []

  try {
    const legacyRaw = localStorage.getItem(LEGACY_CART_STORAGE_KEY)
    if (!legacyRaw) return []

    const parsed = JSON.parse(legacyRaw)
    if (Array.isArray(parsed)) {
      return normalizeCartItems(parsed)
    }

    const row = parsed as Record<string, unknown>
    if (row && Array.isArray(row.items)) {
      return normalizeCartItems(row.items)
    }
  } catch {
    // Ignore malformed legacy state and fallback to empty cart.
  }

  return []
}

const readStoredItemsForKey = (key: string): CartItem[] => {
  if (typeof window === 'undefined') return []

  try {
    const raw = localStorage.getItem(key)
    if (!raw) return []

    const parsed = JSON.parse(raw) as Record<string, unknown>
    const storedItems = Array.isArray(parsed?.items)
      ? normalizeCartItems(parsed.items)
      : Array.isArray(parsed)
        ? normalizeCartItems(parsed)
        : []

    if (key !== GUEST_CART_STORAGE_KEY) return storedItems

    const expiresAt = Number(parsed?.expiresAt)
    const hasExpiry = Number.isFinite(expiresAt)

    if (hasExpiry && expiresAt <= Date.now()) {
      localStorage.removeItem(GUEST_CART_STORAGE_KEY)
      return []
    }

    return storedItems
  } catch {
    return []
  }
}

export const useCartStore = defineStore('cart', {
  state: () => ({
    items: [] as CartItem[],
    isHydrated: false,
  }),
  getters: {
    totalItems: (state) => state.items.reduce((sum, item) => sum + item.quantity, 0),
    subtotal: (state) =>
      state.items.reduce((sum, item) => sum + Math.max(0, item.price) * Math.max(1, item.quantity), 0),
  },
  actions: {
    ensureGuestToken() {
      if (typeof window === 'undefined') return null
      if (isClientAuthenticated()) return null

      let token = String(localStorage.getItem(GUEST_TOKEN_STORAGE_KEY) ?? '').trim()
      if (!token) {
        token = createGuestToken()
        localStorage.setItem(GUEST_TOKEN_STORAGE_KEY, token)
      }

      return token
    },

    hydrateCart() {
      if (this.isHydrated || typeof window === 'undefined') return

      try {
        const activeStorageKey = getActiveStorageKey()
        let items = readStoredItemsForKey(activeStorageKey)

        // One-time migration from legacy storage key to scoped keys.
        if (items.length === 0) {
          const legacyItems = readLegacyCartItems()
          if (legacyItems.length > 0) {
            items = legacyItems
            this.items = legacyItems
            this.persistCart()
          }
          localStorage.removeItem(LEGACY_CART_STORAGE_KEY)
        }

        this.items = items
      } catch {
        this.items = []
      } finally {
        this.isHydrated = true
      }

      if (!isClientAuthenticated()) {
        this.ensureGuestToken()
      }
      void this.refreshFromServer()
    },

    persistCart() {
      if (typeof window === 'undefined') return

      const now = Date.now()

      if (isClientAuthenticated()) {
        const payload: PersistedUserCart = {
          version: 1,
          items: this.items,
          updatedAt: now,
        }
        localStorage.setItem(USER_CART_STORAGE_KEY, JSON.stringify(payload))
        return
      }

      const payload: PersistedGuestCart = {
        version: 1,
        items: this.items,
        updatedAt: now,
        expiresAt: now + GUEST_CART_TTL_MS,
      }
      localStorage.setItem(GUEST_CART_STORAGE_KEY, JSON.stringify(payload))
    },

    resetLocalCart() {
      this.items = []
      this.persistCart()
    },

    clearGuestSession() {
      if (typeof window === 'undefined') return

      localStorage.removeItem(GUEST_TOKEN_STORAGE_KEY)
      localStorage.removeItem(GUEST_CART_STORAGE_KEY)
    },

    onAuthStateChanged() {
      this.isHydrated = false
      this.hydrateCart()
    },

    applyServerCart(payload: unknown): boolean {
      const normalized = extractServerItems(payload)
      if (!normalized) return false

      this.items = normalized
      this.persistCart()
      return true
    },

    async refreshFromServer(options: CartSyncOptions = {}) {
      if (typeof window === 'undefined') return
      this.hydrateCart()

      const guestToken = isClientAuthenticated() ? undefined : this.ensureGuestToken() ?? undefined

      try {
        const response = await fetchCartRequest(guestToken, options)
        this.applyServerCart(response?.data)
      } catch (error) {
        console.warn('Failed to refresh cart from backend.', error)
      }
    },

    async addItem(item: CartItem) {
      this.hydrateCart()

      const normalized = normalizeCartItem(item)
      if (!normalized) return

      const existingIndex = this.items.findIndex((row) => isSameOption(row, normalized))

      if (existingIndex >= 0) {
        this.items[existingIndex].quantity += normalized.quantity
      } else {
        this.items.push(normalized)
      }

      this.persistCart()

      const guestToken = isClientAuthenticated() ? undefined : this.ensureGuestToken() ?? undefined
      const payload: Record<string, unknown> = {
        product_id: normalized.product_id,
        quantity: normalized.quantity,
      }

      if (normalized.size) payload.size = normalized.size
      if (normalized.color) payload.color = normalized.color

      try {
        const response = await addCartItemRequest(payload, guestToken)
        this.applyServerCart(response?.data)
      } catch (error) {
        console.warn('Failed to sync add-to-cart with backend.', error)
      }
    },

    async setItemQuantity(index: number, quantity: number) {
      this.hydrateCart()
      const safeQuantity = Math.max(1, Math.floor(toNumber(quantity)))

      if (index < 0 || index >= this.items.length) return

      const previousItems = cloneItems(this.items)
      this.items[index].quantity = safeQuantity
      this.persistCart()

      const targetId = this.items[index]?.id
      if (!targetId) return

      const guestToken = isClientAuthenticated() ? undefined : this.ensureGuestToken() ?? undefined

      try {
        const response = await updateCartItemRequest(targetId, { quantity: safeQuantity }, guestToken)
        this.applyServerCart(response?.data)
      } catch (error) {
        this.items = previousItems
        this.persistCart()
        console.warn('Failed to sync cart quantity update with backend.', error)
      }
    },

    async removeItem(index: number) {
      this.hydrateCart()
      if (index < 0 || index >= this.items.length) return

      const previousItems = cloneItems(this.items)
      const targetId = this.items[index]?.id

      this.items.splice(index, 1)
      this.persistCart()

      if (!targetId) return

      const guestToken = isClientAuthenticated() ? undefined : this.ensureGuestToken() ?? undefined

      try {
        const response = await removeCartItemRequest(targetId, guestToken)
        this.applyServerCart(response?.data)
      } catch (error) {
        this.items = previousItems
        this.persistCart()
        console.warn('Failed to sync cart item removal with backend.', error)
      }
    },

    async clearCart() {
      this.hydrateCart()
      const previousItems = cloneItems(this.items)

      this.items = []
      this.persistCart()

      const guestToken = isClientAuthenticated() ? undefined : this.ensureGuestToken() ?? undefined

      try {
        const response = await clearCartRequest(guestToken)
        this.applyServerCart(response?.data)
      } catch (error) {
        this.items = previousItems
        this.persistCart()
        console.warn('Failed to sync cart clear operation with backend.', error)
      }
    },
  },
})
