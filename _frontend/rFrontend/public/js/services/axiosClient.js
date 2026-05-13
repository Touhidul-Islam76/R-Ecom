import axios from 'axios'

const CART_GUEST_TOKEN_STORAGE_KEY = 'recom_guest_token'

const apiClient = axios.create({
  baseURL: 'http://localhost:8000/api/',
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
})

const resolvePayloadConfig = (payload) =>
  payload instanceof FormData
    ? { headers: { 'Content-Type': 'multipart/form-data' } }
    : {}

apiClient.interceptors.request.use((config) => {
  if (typeof window === 'undefined') return config
  const token = localStorage.getItem('auth_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  const guestToken = localStorage.getItem(CART_GUEST_TOKEN_STORAGE_KEY)
  if (guestToken && !config.headers['X-Guest-Token']) {
    config.headers['X-Guest-Token'] = guestToken
  }

  return config
})

const buildCartRequestConfig = (guestToken, options = {}) => {
  const headers = {}

  if (guestToken) {
    headers['X-Guest-Token'] = guestToken
  }

  if (options?.mergeGuestCart) {
    headers['X-Merge-Guest-Cart'] = '1'
  }

  return Object.keys(headers).length > 0 ? { headers } : {}
}

export const loginRequest     = (payload) => apiClient.post('login', payload)
export const registerRequest  = (payload) => apiClient.post('register', payload, {
  headers: { 'Content-Type': 'multipart/form-data' },
})
export const logoutRequest    = (payload = { all_devices: false }) => apiClient.post('logout', payload)
export const getCurrentUserRequest = () => apiClient.get('user')
export const updateProfileRequest  = (payload) => apiClient.put('profile/update', payload, {
  headers: { 'Content-Type': 'multipart/form-data' },
})
export const sendOtpRequest   = (payload) => apiClient.post('forgot-password/send-otp', payload)
export const verifyOtpRequest = (payload) => apiClient.post('forgot-password/verify-otp', payload)

export const fetchBrandsRequest = (params = {}) => apiClient.get('brands', { params })
export const createBrandRequest = (payload) => apiClient.post('brands', payload, resolvePayloadConfig(payload))
export const getBrandRequest = (brandId) => apiClient.get(`brands/${brandId}`)
export const updateBrandRequest = (brandId, payload) =>
  apiClient.put(`brands/${brandId}`, payload, resolvePayloadConfig(payload))
export const deleteBrandRequest = (brandId) => apiClient.delete(`brands/${brandId}`)

export const fetchCategoriesRequest = (params = {}) => apiClient.get('categories', { params })
export const createCategoryRequest = (payload) =>
  apiClient.post('categories', payload, resolvePayloadConfig(payload))
export const getCategoryRequest = (categoryId) => apiClient.get(`categories/${categoryId}`)
export const updateCategoryRequest = (categoryId, payload) =>
  apiClient.put(`categories/${categoryId}`, payload, resolvePayloadConfig(payload))
export const deleteCategoryRequest = (categoryId) => apiClient.delete(`categories/${categoryId}`)

export const fetchProductsRequest = (params = {}) => apiClient.get('products', { params })
export const createProductRequest = (payload) => apiClient.post('products', payload, resolvePayloadConfig(payload))
export const getProductRequest = (productId) => apiClient.get(`products/${productId}`)
export const updateProductRequest = (productId, payload) =>
  apiClient.put(`products/${productId}`, payload, resolvePayloadConfig(payload))
export const deleteProductRequest = (productId) => apiClient.delete(`products/${productId}`)
export const reserveProductStockRequest = (productId, payload) =>
  apiClient.post(`products/${productId}/reserve-stock`, payload)
export const fetchProductReviewsRequest = (productId, params = {}) =>
  apiClient.get(`products/${productId}/reviews`, { params })
export const createProductReviewRequest = (productId, payload) =>
  apiClient.post(`products/${productId}/reviews`, payload)

export const fetchCartRequest = (guestToken, options = {}) =>
  apiClient.get('cart', buildCartRequestConfig(guestToken, options))
export const addCartItemRequest = (payload, guestToken, options = {}) =>
  apiClient.post('cart/items', payload, buildCartRequestConfig(guestToken, options))
export const updateCartItemRequest = (cartItemId, payload, guestToken, options = {}) =>
  apiClient.patch(`cart/items/${cartItemId}`, payload, buildCartRequestConfig(guestToken, options))
export const removeCartItemRequest = (cartItemId, guestToken, options = {}) =>
  apiClient.delete(`cart/items/${cartItemId}`, buildCartRequestConfig(guestToken, options))
export const clearCartRequest = (guestToken, options = {}) =>
  apiClient.delete('cart/items', buildCartRequestConfig(guestToken, options))

export const fetchWishlistRequest = () => apiClient.get('wishlist')
export const addWishlistItemRequest = (payload) => apiClient.post('wishlist/items', payload)
export const removeWishlistItemRequest = (productId) => apiClient.delete(`wishlist/items/${productId}`)
export const clearWishlistRequest = () => apiClient.delete('wishlist/items')

export default apiClient
