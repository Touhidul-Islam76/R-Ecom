import { defineStore } from 'pinia'
import { useAuthUser, type AuthUser } from '~/composables/useAuth'
import {
  getCurrentUserRequest,
  loginRequest,
  logoutRequest,
  registerRequest,
  sendOtpRequest,
  updateProfileRequest,
  verifyOtpRequest,
} from '~/public/js/services/axiosClient.js'
import { useCartStore } from '~/stores/cartStore'
import { useWishlistStore } from '~/stores/wishlistStore'

type ApiError = {
  response?: { status?: number; data?: { message?: string; errors?: Record<string, string[]> } }
  message?: string
}

type IdentifierPayload = { email: string } | { phone: string }
type RegisterPayload = {
  name: string
  identifier: string
  password: string
  image?: File | null
}
type ProfileUpdatePayload = {
  name?: string | null
  phone?: string | null
  email?: string | null
  address?: string | null
  district?: string | null
  image?: File | null
}

const normalizeIdentifier = (value: string) => {
  const trimmed = value.trim()
  return trimmed.includes('@') ? trimmed.toLowerCase() : trimmed.replace(/[^\d+]/g, '')
}

const buildIdentifierPayload = (normalized: string): IdentifierPayload =>
  normalized.includes('@') ? { email: normalized } : { phone: normalized }

const parseErrorMessage = (error: unknown, fallback: string) => {
  const err = error as ApiError
  const apiMsg = err?.response?.data?.message
  if (apiMsg) return apiMsg
  const firstValidation = Object.values(err?.response?.data?.errors ?? {})?.[0]?.[0]
  if (firstValidation) return firstValidation
  return err?.message || fallback
}

const parseUserFromResponse = (data: any): AuthUser => {
  if (data?.data?.user) return data.data.user as AuthUser
  if (data?.user) return data.user as AuthUser
  if (data?.data && typeof data.data === 'object' && !Array.isArray(data.data)) return data.data as AuthUser
  if (data && typeof data === 'object' && !Array.isArray(data)) return data as AuthUser
  return {}
}

const notifyAuthChange = () => {
  if (typeof window === 'undefined') return
  window.dispatchEvent(new Event('auth-change'))
}

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: null as string | null,
    user: {} as AuthUser,
    isRegistering: false,
    isLoggingIn: false,
    isLoggingOut: false,
    isSendingOtp: false,
    isVerifyingOtp: false,
    isResettingPassword: false,
    isLoadingProfile: false,
    isUpdatingProfile: false,
  }),
  getters: {
    hasToken: (state) => Boolean(state.token),
  },
  actions: {
    hydrateAuthFromStorage() {
      if (typeof window === 'undefined') return
      this.token = localStorage.getItem('auth_token')
      try {
        this.user = JSON.parse(localStorage.getItem('auth_user') || '{}') as AuthUser
      } catch {
        this.user = {}
      }
      useAuthUser().value = this.user
    },

    setAuthUser(user: AuthUser) {
      this.user = user
      useAuthUser().value = user

      if (typeof window !== 'undefined') {
        localStorage.setItem('auth_user', JSON.stringify(user))
      }

      notifyAuthChange()
    },

    setAuthSession(token: string, user: AuthUser, rememberMe: boolean) {
      this.token = token
      this.setAuthUser(user)

      if (typeof window !== 'undefined') {
        localStorage.setItem('auth_token', token)
        localStorage.setItem('remember_me', rememberMe ? '1' : '0')
      }
    },

    clearAuth() {
      this.token = null
      this.user = {}
      useAuthUser().value = {}

      if (typeof window !== 'undefined') {
        localStorage.removeItem('auth_token')
        localStorage.removeItem('auth_user')
        localStorage.removeItem('remember_me')

        const cartStore = useCartStore()
        cartStore.onAuthStateChanged()
        void cartStore.refreshFromServer()
        const wishlistStore = useWishlistStore()
        wishlistStore.resetLocalWishlist()
      }

      notifyAuthChange()
    },

    getErrorMessage(error: unknown, fallback = 'Something went wrong') {
      return parseErrorMessage(error, fallback)
    },

    async fetchCurrentUser() {
      this.isLoadingProfile = true
      try {
        const res = await getCurrentUserRequest()
        const user = parseUserFromResponse(res?.data)
        this.setAuthUser(user)

        return {
          user,
          message: (res?.data?.message as string | undefined) || 'Profile loaded successfully.',
        }
      } catch (error: unknown) {
        throw new Error(this.getErrorMessage(error, 'Failed to load profile data.'))
      } finally {
        this.isLoadingProfile = false
      }
    },

    async updateProfile(payload: ProfileUpdatePayload) {
      this.isUpdatingProfile = true
      try {
        const formData = new FormData()

        if (payload.name !== undefined) formData.append('name', payload.name ?? '')
        if (payload.phone !== undefined) formData.append('phone', payload.phone ?? '')
        if (payload.email !== undefined) formData.append('email', payload.email ?? '')
        if (payload.address !== undefined) formData.append('address', payload.address ?? '')
        if (payload.district !== undefined) formData.append('district', payload.district ?? '')
        if (payload.image) formData.append('image', payload.image)

        if (Array.from(formData.keys()).length === 0) {
          throw new Error('Provide at least one field to update.')
        }

        const res = await updateProfileRequest(formData)
        const user = parseUserFromResponse(res?.data)
        this.setAuthUser(user)

        return {
          user,
          message: (res?.data?.message as string | undefined) || 'Profile updated successfully.',
        }
      } catch (error: unknown) {
        throw new Error(this.getErrorMessage(error, 'Failed to update profile.'))
      } finally {
        this.isUpdatingProfile = false
      }
    },

    async login(identifier: string, password: string, rememberMe = false) {
      const normalizedIdentifier = normalizeIdentifier(identifier)
      const trimmedPassword = password.trim()

      if (!normalizedIdentifier || !trimmedPassword) {
        throw new Error('Please enter a valid email or phone number along with the password.')
      }

      this.isLoggingIn = true
      try {
        const res = await loginRequest({
          ...buildIdentifierPayload(normalizedIdentifier),
          password: trimmedPassword,
        })

        const token = res?.data?.data?.token as string | undefined
        if (!token) {
          throw new Error('token not found in response. Login may have failed. Please try again.')
        }

        const user = (res?.data?.data?.user ?? {}) as AuthUser
        this.setAuthSession(token, user, rememberMe)

        try {
          const cartStore = useCartStore()
          cartStore.onAuthStateChanged()
          await cartStore.refreshFromServer({ mergeGuestCart: false })
          const wishlistStore = useWishlistStore()
          wishlistStore.resetLocalWishlist()
          await wishlistStore.refreshFromServer()
        } catch {
          // Keep login successful even if cart/wishlist sync fails temporarily.
        }

        return {
          token,
          user,
          message: (res?.data?.message as string | undefined) || 'Login was successful!',
        }
      } catch (error: unknown) {
        throw new Error(this.getErrorMessage(error, 'Login failed. Please try again.'))
      } finally {
        this.isLoggingIn = false
      }
    },

    async register(payload: RegisterPayload) {
      const name = payload.name.trim()
      const normalizedIdentifier = normalizeIdentifier(payload.identifier)
      const trimmedPassword = payload.password.trim()

      if (!name) {
        throw new Error('Name is required.')
      }

      if (!normalizedIdentifier) {
        throw new Error('Please provide an email or phone number.')
      }

      if (!trimmedPassword) {
        throw new Error('Password is required.')
      }

      this.isRegistering = true
      try {
        const formData = new FormData()
        formData.append('name', name)
        formData.append('password', trimmedPassword)

        if (normalizedIdentifier.includes('@')) {
          formData.append('email', normalizedIdentifier)
        } else {
          formData.append('phone', normalizedIdentifier)
        }

        if (payload.image) {
          formData.append('image', payload.image)
        }

        const res = await registerRequest(formData)
        const token = res?.data?.data?.token as string | undefined
        const user = (res?.data?.data?.user ?? {}) as AuthUser

        if (token) {
          this.setAuthSession(token, user, true)

          try {
            const cartStore = useCartStore()
            cartStore.onAuthStateChanged()
            await cartStore.refreshFromServer({ mergeGuestCart: true })
            cartStore.clearGuestSession()
            const wishlistStore = useWishlistStore()
            wishlistStore.resetLocalWishlist()
            await wishlistStore.refreshFromServer()
          } catch {
            // Keep registration successful even if cart/wishlist sync fails temporarily.
          }
        }

        return {
          token,
          user,
          message: (res?.data?.message as string | undefined) || 'User registered successfully.',
        }
      } catch (error: unknown) {
        throw new Error(this.getErrorMessage(error, 'Registration failed. Please try again.'))
      } finally {
        this.isRegistering = false
      }
    },

    async logout(allDevices = false) {
      this.isLoggingOut = true
      try {
        const res = await logoutRequest({ all_devices: allDevices })
        this.clearAuth()
        return {
          expired: false,
          message: (res?.data?.message as string | undefined) || 'Logout was successful!',
        }
      } catch (error: unknown) {
        const status = (error as ApiError)?.response?.status
        if (status === 401) {
          this.clearAuth()
          return {
            expired: true,
            message: 'Session has expired. You have been logged out locally.',
          }
        }
        throw new Error(this.getErrorMessage(error, 'Logout failed. Please try again.'))
      } finally {
        this.isLoggingOut = false
      }
    },

    async sendOtp(identifier: string) {
      this.isSendingOtp = true
      try {
        const normalizedIdentifier = normalizeIdentifier(identifier)
        const res = await sendOtpRequest(buildIdentifierPayload(normalizedIdentifier))

        return {
          identifier: normalizedIdentifier,
          message: (res?.data?.message as string | undefined) || 'OTP has been sent.',
          otpPreview: (res?.data?.data?.otp as string | undefined) || '',
        }
      } catch (error: unknown) {
        throw new Error(this.getErrorMessage(error, 'Failed to send OTP. Please try again.'))
      } finally {
        this.isSendingOtp = false
      }
    },

    async verifyOtp(identifier: string, otp: string) {
      this.isVerifyingOtp = true
      try {
        const normalizedIdentifier = normalizeIdentifier(identifier)
        const res = await verifyOtpRequest({
          ...buildIdentifierPayload(normalizedIdentifier),
          otp: otp.trim(),
        })

        return {
          message: (res?.data?.message as string | undefined) || 'OTP verified successfully.',
        }
      } catch (error: unknown) {
        throw new Error(this.getErrorMessage(error, 'OTP verification failed. Please try again.'))
      } finally {
        this.isVerifyingOtp = false
      }
    },

    async resetPassword(identifier: string, otp: string, password: string, passwordConfirmation: string) {
      this.isResettingPassword = true
      try {
        const normalizedIdentifier = normalizeIdentifier(identifier)
        const res = await verifyOtpRequest({
          ...buildIdentifierPayload(normalizedIdentifier),
          otp: otp.trim(),
          password,
          password_confirmation: passwordConfirmation,
        })

        return {
          message: (res?.data?.message as string | undefined) || 'Password has been reset successfully!',
        }
      } catch (error: unknown) {
        throw new Error(this.getErrorMessage(error, 'Failed to reset password. Please try again.'))
      } finally {
        this.isResettingPassword = false
      }
    },
  },
})
