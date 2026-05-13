import {
  constants,
  createResetToken,
  deleteEntry,
  getEntry,
  isValidIdentifier,
  normalizeIdentifier,
  now,
  setEntry,
} from '~/server/utils/forgot-password-store'

export default defineEventHandler(async (event) => {
  const body = await readBody<{ identifier?: string; otp?: string }>(event)
  const identifier = normalizeIdentifier(body?.identifier || '')
  const otp = (body?.otp || '').trim()

  if (!isValidIdentifier(identifier)) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid contact information.',
    })
  }

  if (!/^\d{6}$/.test(otp)) {
    throw createError({
      statusCode: 400,
      statusMessage: 'OTP must be a 6-digit number.',
    })
  }

  const entry = getEntry(identifier)
  if (!entry) {
    throw createError({
      statusCode: 404,
      statusMessage: 'No OTP request found. Please request a new OTP.',
    })
  }

  const timestamp = now()
  if (entry.expiresAt < timestamp) {
    deleteEntry(identifier)
    throw createError({
      statusCode: 400,
      statusMessage: 'OTP expired. Please request a new OTP.',
    })
  }

  if (entry.attempts >= constants.MAX_VERIFY_ATTEMPTS) {
    deleteEntry(identifier)
    throw createError({
      statusCode: 429,
      statusMessage: 'Too many failed attempts. Please request a new OTP.',
    })
  }

  if (entry.otp !== otp) {
    entry.attempts += 1
    setEntry(identifier, entry)
    throw createError({
      statusCode: 400,
      statusMessage: 'Incorrect OTP. Please try again.',
    })
  }

  const resetToken = createResetToken()
  setEntry(identifier, {
    ...entry,
    verified: true,
    attempts: 0,
    resetToken,
    resetTokenExpiresAt: timestamp + constants.RESET_TOKEN_EXPIRY_MS,
  })

  return {
    success: true,
    message: 'OTP verified successfully.',
    resetToken,
  }
})
