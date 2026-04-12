import {
  deleteEntry,
  getEntry,
  isValidIdentifier,
  normalizeIdentifier,
  now,
} from '~/server/utils/forgot-password-store'

export default defineEventHandler(async (event) => {
  const body = await readBody<{
    identifier?: string
    resetToken?: string
    newPassword?: string
    confirmPassword?: string
  }>(event)

  const identifier = normalizeIdentifier(body?.identifier || '')
  const resetToken = (body?.resetToken || '').trim()
  const newPassword = (body?.newPassword || '').trim()
  const confirmPassword = (body?.confirmPassword || '').trim()

  if (!isValidIdentifier(identifier)) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid contact information.',
    })
  }

  if (!resetToken) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Reset token is missing. Verify OTP again.',
    })
  }

  if (newPassword.length < 8) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Password must be at least 8 characters long.',
    })
  }

  if (newPassword !== confirmPassword) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Passwords do not match.',
    })
  }

  const entry = getEntry(identifier)
  if (!entry || !entry.verified || entry.resetToken !== resetToken) {
    throw createError({
      statusCode: 400,
      statusMessage: 'OTP verification is invalid or expired. Please try again.',
    })
  }

  if (!entry.resetTokenExpiresAt || entry.resetTokenExpiresAt < now()) {
    deleteEntry(identifier)
    throw createError({
      statusCode: 400,
      statusMessage: 'Reset session expired. Please verify OTP again.',
    })
  }

  // NOTE: Replace this section with your real user DB password update.
  deleteEntry(identifier)

  return {
    success: true,
    message: 'Password reset successful. You can now sign in with your new password.',
  }
})
