type ForgotPasswordEntry = {
  otp: string
  expiresAt: number
  resendAvailableAt: number
  attempts: number
  verified: boolean
  resetToken?: string
  resetTokenExpiresAt?: number
}

const OTP_EXPIRY_MS = 5 * 60 * 1000
const RESEND_DELAY_MS = 60 * 1000
const RESET_TOKEN_EXPIRY_MS = 10 * 60 * 1000
const MAX_VERIFY_ATTEMPTS = 5

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const phoneRegex = /^\+?[0-9]{8,15}$/

type GlobalWithForgotStore = typeof globalThis & {
  __forgotPasswordStore?: Map<string, ForgotPasswordEntry>
}

const getStore = () => {
  const g = globalThis as GlobalWithForgotStore
  if (!g.__forgotPasswordStore) {
    g.__forgotPasswordStore = new Map<string, ForgotPasswordEntry>()
  }
  return g.__forgotPasswordStore
}

export const normalizeIdentifier = (raw: string) => {
  const value = (raw || '').trim()
  if (value.includes('@')) {
    return value.toLowerCase()
  }
  return value.replace(/[^\d+]/g, '')
}

export const isValidIdentifier = (raw: string) => {
  const normalized = normalizeIdentifier(raw)
  return emailRegex.test(normalized) || phoneRegex.test(normalized)
}

export const isEmailIdentifier = (identifier: string) => identifier.includes('@')

export const maskIdentifier = (identifier: string) => {
  if (isEmailIdentifier(identifier)) {
    const [name, domain = ''] = identifier.split('@')
    if (!name) return identifier
    const visible = name.slice(0, 2)
    return `${visible}${'*'.repeat(Math.max(name.length - 2, 2))}@${domain}`
  }

  const digits = identifier.replace(/[^\d]/g, '')
  if (digits.length <= 4) {
    return `${'*'.repeat(Math.max(digits.length - 1, 1))}${digits.slice(-1)}`
  }
  return `${'*'.repeat(digits.length - 4)}${digits.slice(-4)}`
}

export const createOtp = () => String(Math.floor(100000 + Math.random() * 900000))

export const createResetToken = () => crypto.randomUUID()

export const getEntry = (identifier: string) => getStore().get(identifier)

export const setEntry = (identifier: string, entry: ForgotPasswordEntry) => {
  getStore().set(identifier, entry)
}

export const deleteEntry = (identifier: string) => {
  getStore().delete(identifier)
}

export const now = () => Date.now()

export const constants = {
  OTP_EXPIRY_MS,
  RESEND_DELAY_MS,
  RESET_TOKEN_EXPIRY_MS,
  MAX_VERIFY_ATTEMPTS,
}
