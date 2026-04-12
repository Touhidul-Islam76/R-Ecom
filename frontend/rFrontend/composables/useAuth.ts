import { ref } from 'vue'
import { logoutRequest } from '~/public/js/services/axiosClient.js'

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
  }

  const getAuthUser = (): { role?: string; name?: string; email?: string } => {
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
      clearAuth()
      toast.success(res?.data?.message || 'Logout সফল হয়েছে!')
      await navigateTo('/login')
    } catch (error: unknown) {
      const status = (error as { response?: { status?: number } })?.response?.status
      if (status === 401) {
        clearAuth()
        toast.info('Session মেয়াদ শেষ। Locally logout করা হয়েছে।')
        await navigateTo('/login')
        return
      }
      toast.error(getErrorMessage(error, 'Logout ব্যর্থ হয়েছে।'))
    } finally {
      isLoggingOut.value = false
    }
  }

  return { handleLogout, clearAuth, getAuthUser, getErrorMessage, isLoggingOut }
}
