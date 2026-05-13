import { ref } from 'vue'
import { logoutRequest } from '~/public/js/services/axiosClient.js'
import { useCartStore } from '~/stores/cartStore'
import { useWishlistStore } from '~/stores/wishlistStore'

export type AuthUser = {
  id?: number
  name?: string
  email?: string | null
  phone?: string | null
  address?: string | null
  district?: string | null
  image?: string | null
  image_url?: string | null
  role?: string
  created_at?: string
  updated_at?: string
  [key: string]: unknown
}

export const useAuthUser = () =>
  useState<AuthUser>('auth:user', () => ({}))

export const useAuth = () => {
  const toast        = useToast()
  const isLoggingOut = ref(false)

  const getErrorMessage = (error: unknown, fallback = 'Something went wrong'): string => {
    const err = error as {
      response?: { data?: { message?: string; errors?: Record<string, string[]> } }
      message?: string
    }
    const apiMsg = err?.response?.data?.message
    if (apiMsg) return apiMsg
    const firstValidation = Object.values(err?.response?.data?.errors ?? {})?.[0]?.[0]
    if (firstValidation) return firstValidation
    return err?.message || fallback
  }

  const clearAuth = () => {
    localStorage.removeItem('auth_token')
    localStorage.removeItem('auth_user')
    localStorage.removeItem('remember_me')
    useAuthUser().value = {}
    window.dispatchEvent(new Event('auth-change'))

    const cartStore = useCartStore()
    cartStore.onAuthStateChanged()
    void cartStore.refreshFromServer()
    const wishlistStore = useWishlistStore()
    wishlistStore.resetLocalWishlist()
  }

  const getAuthUser = (): AuthUser => {
    if (typeof window === 'undefined') return {}
    try {
      return JSON.parse(localStorage.getItem('auth_user') || '{}')
    } catch {
      return {}
    }
  }

  const handleLogout = async () => {
    isLoggingOut.value = true
    try {
      const res = await logoutRequest({ all_devices: false })
      toast.success(res?.data?.message || 'Logout সফল হয়েছে!')
    } catch (error: unknown) {
      const status = (error as { response?: { status?: number } })?.response?.status
      if (status === 401) {
        toast.info('Session মেয়াদ শেষ। Locally logout করা হয়েছে।')
      } else {
        toast.error(getErrorMessage(error, 'Logout ব্যর্থ হয়েছে।'))
      }
    } finally {
      clearAuth()
      isLoggingOut.value = false
      await navigateTo('/')
    }
  }

  return { handleLogout, clearAuth, getAuthUser, getErrorMessage, isLoggingOut }
}
