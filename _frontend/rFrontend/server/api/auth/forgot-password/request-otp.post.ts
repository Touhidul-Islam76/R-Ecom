import {
  constants,
  createOtp,
  isEmailIdentifier,
  isValidIdentifier,
  maskIdentifier,
  normalizeIdentifier,
  now,
  setEntry,
  getEntry,
} from '~/server/utils/forgot-password-store'

export default defineEventHandler(async (event) => {
  const body = await readBody<{ identifier?: string }>(event)
  const identifier = normalizeIdentifier(body?.identifier || '')

  if (!isValidIdentifier(identifier)) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Please provide a valid email or phone number.',
    })
  }

  const existing = getEntry(identifier)
  const timestamp = now()
  if (existing && existing.resendAvailableAt > timestamp) {
    const waitSeconds = Math.ceil((existing.resendAvailableAt - timestamp) / 1000)
    throw createError({
      statusCode: 429,
      statusMessage: `Please wait ${waitSeconds}s before requesting a new OTP.`,
    })
  }

  const otp = createOtp()
  setEntry(identifier, {
    otp,
    expiresAt: timestamp + constants.OTP_EXPIRY_MS,
    resendAvailableAt: timestamp + constants.RESEND_DELAY_MS,
    attempts: 0,
    verified: false,
  })

  console.info(`[OTP DEMO] ${identifier} -> ${otp}`)

  return {
    success: true,
    message: `OTP sent to your ${isEmailIdentifier(identifier) ? 'email' : 'phone'} (${maskIdentifier(identifier)}).`,
    expiresIn: Math.floor(constants.OTP_EXPIRY_MS / 1000),
    resendIn: Math.floor(constants.RESEND_DELAY_MS / 1000),
    devOtp: process.dev ? otp : undefined,
  }
})
