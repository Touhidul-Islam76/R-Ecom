import axios from 'axios'

const apiClient = axios.create({
  baseURL: 'http://localhost:8000/api/',
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
})

apiClient.interceptors.request.use((config) => {
  if (typeof window === 'undefined') return config
  const token = localStorage.getItem('auth_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export const loginRequest     = (payload) => apiClient.post('login', payload)
export const logoutRequest    = (payload = { all_devices: false }) => apiClient.post('logout', payload)
export const sendOtpRequest   = (payload) => apiClient.post('forgot-password/send-otp', payload)
export const verifyOtpRequest = (payload) => apiClient.post('forgot-password/verify-otp', payload)

export default apiClient
