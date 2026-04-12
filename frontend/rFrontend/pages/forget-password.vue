<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, nextTick } from 'vue'
import { sendOtpRequest, verifyOtpRequest } from '~/public/js/services/axiosClient.js'

useHead({ title: 'FasionAble' })
definePageMeta({ footerStyle: '2' })

type Step = 'request' | 'verify' | 'reset'

type ApiError = {
  response?: { data?: { message?: string; errors?: Record<string, string[]> } }
  message?: string
}

const toast           = useToast()
const currentStep     = ref<Step>('request')
const identifier      = ref('')
const otpCode         = ref('')

const showNewPassword     = ref(false)
const showConfirmPassword = ref(false)
const newPassword         = ref('')
const confirmPassword     = ref('')

const isSendingOtp        = ref(false)
const isVerifyingOtp      = ref(false)
const isResettingPassword = ref(false)

const errorMessage   = ref('')
const successMessage = ref('')
const resendIn       = ref(0)
const devOtpPreview  = ref('')

let resendTimer: ReturnType<typeof setInterval> | null = null

// ─── helpers ────────────────────────────────────────────────────────────────

const normalizeIdentifier = (value: string) => {
  const trimmed = value.trim()
  return trimmed.includes('@') ? trimmed.toLowerCase() : trimmed.replace(/[^\d+]/g, '')
}

const isValidIdentifier = (value: string) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  const phoneRegex = /^\+?[0-9]{8,15}$/
  return emailRegex.test(value) || phoneRegex.test(value)
}

// Backend expects { email } or { phone } — never a combined "identifier" field
const buildIdentifierPayload = (normalized: string) =>
  normalized.includes('@') ? { email: normalized } : { phone: normalized }

const getErrorMessage = (error: unknown, fallback: string): string => {
  const err = error as ApiError
  const apiMsg = err?.response?.data?.message
  if (apiMsg) return apiMsg
  const firstValidation = Object.values(err?.response?.data?.errors ?? {})?.[0]?.[0]
  if (firstValidation) return firstValidation
  return err?.message || fallback
}

const clearMessages = () => {
  errorMessage.value   = ''
  successMessage.value = ''
}

const startResendTimer = (seconds: number) => {
  if (resendTimer) { clearInterval(resendTimer); resendTimer = null }
  resendIn.value = seconds
  resendTimer = setInterval(() => {
    if (resendIn.value <= 1) {
      clearInterval(resendTimer!); resendTimer = null; resendIn.value = 0; return
    }
    resendIn.value -= 1
  }, 1000)
}

const maskedIdentifier = computed(() => {
  const value = identifier.value.trim()
  if (!value) return ''
  if (value.includes('@')) {
    const [name = '', domain = ''] = value.split('@')
    return `${name.slice(0, 2)}${'*'.repeat(Math.max(name.length - 2, 2))}@${domain}`
  }
  const digits = value.replace(/[^\d]/g, '')
  return digits.length <= 4
    ? `${'*'.repeat(Math.max(digits.length - 1, 1))}${digits.slice(-1)}`
    : `${'*'.repeat(digits.length - 4)}${digits.slice(-4)}`
})

// ─── step 1 : send OTP ──────────────────────────────────────────────────────

const sendOtp = async () => {
  clearMessages()
  const normalized = normalizeIdentifier(identifier.value)

  if (!isValidIdentifier(normalized)) {
    errorMessage.value = 'সঠিক email বা phone number দিন।'
    toast.error(errorMessage.value)
    return
  }

  identifier.value   = normalized
  isSendingOtp.value = true

  try {
    // POST /api/forgot-password/send-otp
    // payload: { email } or { phone }
    const res = await sendOtpRequest(buildIdentifierPayload(normalized))

    currentStep.value = 'verify'
    otpCode.value     = ''
    devOtpPreview.value = res?.data?.data?.otp || ''   // dev-only: OTP returned in response

    const msg = res?.data?.message || 'OTP পাঠানো হয়েছে।'
    successMessage.value = msg
    toast.success(msg)
    startResendTimer(60)
  } catch (error: unknown) {
    errorMessage.value = getErrorMessage(error, 'OTP পাঠাতে ব্যর্থ হয়েছে। আবার চেষ্টা করুন।')
    toast.error(errorMessage.value)
  } finally {
    isSendingOtp.value = false
  }
}

const resendOtp = async () => {
  if (resendIn.value > 0 || isSendingOtp.value) return
  await sendOtp()
}

// ─── step 2 : verify OTP ────────────────────────────────────────────────────

const verifyOtp = async () => {
  clearMessages()

  // Backend generates & validates 4-digit OTP
  if (!/^\d{4}$/.test(otpCode.value.trim())) {
    errorMessage.value = 'OTP অবশ্যই ৪ সংখ্যার হতে হবে।'
    toast.error(errorMessage.value)
    return
  }

  isVerifyingOtp.value = true

  try {
    // POST /api/forgot-password/verify-otp
    // payload: { email/phone, otp }  — no password here, just verify
    const res = await verifyOtpRequest({
      ...buildIdentifierPayload(identifier.value),
      otp: otpCode.value.trim(),
    })

    currentStep.value    = 'reset'
    devOtpPreview.value  = ''
    const msg = res?.data?.message || 'OTP সফলভাবে যাচাই হয়েছে।'
    successMessage.value = msg
    toast.success(msg)
  } catch (error: unknown) {
    errorMessage.value = getErrorMessage(error, 'OTP যাচাই ব্যর্থ হয়েছে। আবার চেষ্টা করুন।')
    toast.error(errorMessage.value)
  } finally {
    isVerifyingOtp.value = false
  }
}

// ─── step 3 : reset password ─────────────────────────────────────────────────

const resetPassword = async () => {
  clearMessages()

  if (newPassword.value.trim().length < 8) {
    errorMessage.value = 'Password কমপক্ষে ৮ অক্ষর হতে হবে।'
    toast.error(errorMessage.value)
    return
  }
  if (newPassword.value !== confirmPassword.value) {
    errorMessage.value = 'Password দুটো মিলছে না।'
    toast.error(errorMessage.value)
    return
  }

  isResettingPassword.value = true

  try {
    // POST /api/forgot-password/verify-otp
    // Backend reuses this route: when password is provided it verifies OTP + resets password
    // payload: { email/phone, otp, password, password_confirmation }
    const res = await verifyOtpRequest({
      ...buildIdentifierPayload(identifier.value),
      otp:                  otpCode.value.trim(),
      password:             newPassword.value,
      password_confirmation: confirmPassword.value,
    })

    const msg = res?.data?.message || 'Password সফলভাবে পরিবর্তন হয়েছে!'
    successMessage.value = msg
    toast.success(msg)

    // reset state
    currentStep.value    = 'request'
    otpCode.value        = ''
    newPassword.value    = ''
    confirmPassword.value = ''
    identifier.value     = ''

    setTimeout(() => navigateTo('/login'), 1500)
  } catch (error: unknown) {
    errorMessage.value = getErrorMessage(error, 'Password পরিবর্তন ব্যর্থ হয়েছে। আবার চেষ্টা করুন।')
    toast.error(errorMessage.value)
  } finally {
    isResettingPassword.value = false
  }
}

// ─── navigation ─────────────────────────────────────────────────────────────

const backToRequest = () => {
  clearMessages()
  currentStep.value = 'request'
  otpCode.value     = ''
}

const backToVerify = () => {
  clearMessages()
  currentStep.value = 'verify'
}

// ─── lifecycle ───────────────────────────────────────────────────────────────

onMounted(() => {
  const plantZone = (window as Window & { PlantZone?: { init: () => void; load: () => void } }).PlantZone
  if (plantZone) { plantZone.init(); plantZone.load() }

  nextTick(() => {
    const carousel = (window as Window & { PlantZoneCarousel?: { load: () => void } }).PlantZoneCarousel
    if (carousel) carousel.load()
  })
})

onUnmounted(() => {
  if (resendTimer) { clearInterval(resendTimer); resendTimer = null }
})
</script>

<template>
  <div class="page-wraper">
    

    

    <div class="page-content">
      <section class="px-3">
        <div class="row">
          <div class="col-xxl-6 col-xl-6 col-lg-6 col-md-12 p-a0">
            <div class="login-slider">
              <div class="banner-login" style="background-image: url(/images/registration/pic2.jpg)">
                <div class="banner-content">
                  <h4 class="sub-title">Log in</h4>
                  <h2 class="title">WelCome Back</h2>
                  <p class="text">Sign back in to your account to access your courses and embody the art of being human.</p>
                </div>
              </div>
            </div>
          </div>

          <div class="col-xxl-6 col-xl-6 col-lg-6 end-side-content justify-content-center">
            <Transition name="form-switch" mode="out-in">
              <div v-if="currentStep === 'request'" key="request-form" class="login-area">
                <h2 class="text-secondary text-center">Forgot Password</h2>
                <p class="text-center m-b25">Enter your email or phone number to receive an OTP.</p>
                <form @submit.prevent="sendOtp">
                  <div class="m-b30">
                    <label class="label-title">Email or Phone Number</label>
                    <input
                      v-model="identifier"
                      name="identifier"
                      required
                      class="form-control"
                      placeholder="example@email.com or +8801XXXXXXXXX"
                      type="text"
                    />
                  </div>
                  <div class="d-flex justify-content-between">
                    <NuxtLink to="/login" class="btn btn-outline-secondary btnhover text-uppercase">Back</NuxtLink>
                    <button
                      type="button"
                      class="btn btn-secondary btnhover text-uppercase submit-btn"
                      :disabled="isSendingOtp"
                      @click="sendOtp"
                    >
                      {{ isSendingOtp ? 'Sending...' : 'Send OTP' }}
                    </button>
                  </div>
                </form>
              </div>

              <div v-else-if="currentStep === 'verify'" key="verify-form" class="login-area">
                <h2 class="text-secondary text-center">Verify OTP</h2>
                <p class="text-center m-b25">
                  Enter the 4-digit OTP sent to
                  <span class="text-primary">{{ maskedIdentifier }}</span>
                </p>
                <form @submit.prevent="verifyOtp">
                  <div class="m-b20">
                    <label class="label-title">OTP Code</label>
                    <input
                      v-model="otpCode"
                      name="otpCode"
                      required
                      class="form-control"
                      placeholder="4-digit OTP"
                      type="text"
                      maxlength="4"
                      inputmode="numeric"
                    />
                  </div>

                  <div class="d-flex justify-content-between align-items-center m-b30">
                    <button
                      type="button"
                      class="btn btn-link p-0 text-primary btn-border"
                      :disabled="resendIn > 0 || isSendingOtp"
                      @click="resendOtp"
                    >
                      {{ resendIn > 0 ? `Resend OTP in ${resendIn}s` : 'Resend OTP' }}
                    </button>
                    <button
                      type="button"
                      class="btn btn-outline-secondary btnhover text-uppercase"
                      @click="backToRequest"
                    >
                      Change Contact
                    </button>
                  </div>

                  <div class="text-end">
                    <button
                      type="button"
                      class="btn btn-secondary btnhover text-uppercase"
                      :disabled="isVerifyingOtp"
                      @click="verifyOtp"
                    >
                      {{ isVerifyingOtp ? 'Verifying...' : 'Verify OTP' }}
                    </button>
                  </div>
                </form>

                <p v-if="devOtpPreview" class="text-center text-muted m-t20 mb-0">
                  Dev OTP (for local testing): <strong>{{ devOtpPreview }}</strong>
                </p>
              </div>

              <div v-else key="reset-form" class="forget-password-area active">
                <h2 class="text-secondary text-center">Reset Password</h2>
                <p class="text-center m-b25">Almost done, enter your new password and you're all set to go</p>
                <form @submit.prevent="resetPassword">
                  <div class="m-b30">
                    <label class="label-title">New Password</label>
                    <div class="secure-input">
                      <input
                        v-model="newPassword"
                        :type="showNewPassword ? 'text' : 'password'"
                        name="newPassword"
                        class="form-control dz-password"
                        placeholder="New Password"
                      />
                      <div
                        class="show-pass"
                        :class="{ active: showNewPassword }"
                        role="button"
                        tabindex="0"
                        @click="toggleNewPassword"
                        @keydown.enter.prevent="toggleNewPassword"
                        @keydown.space.prevent="toggleNewPassword"
                      >
                        <i class="eye-open fa-regular fa-eye"></i>
                      </div>
                    </div>
                  </div>
                  <div class="m-b30">
                    <label class="label-title">Confirm Password</label>
                    <div class="secure-input">
                      <input
                        v-model="confirmPassword"
                        :type="showConfirmPassword ? 'text' : 'password'"
                        name="confirmPassword"
                        class="form-control dz-password"
                        placeholder="Confirm Password"
                      />
                      <div
                        class="show-pass"
                        :class="{ active: showConfirmPassword }"
                        role="button"
                        tabindex="0"
                        @click="toggleConfirmPassword"
                        @keydown.enter.prevent="toggleConfirmPassword"
                        @keydown.space.prevent="toggleConfirmPassword"
                      >
                        <i class="eye-open fa-regular fa-eye"></i>
                      </div>
                    </div>
                  </div>
                  <div class="d-flex justify-content-between">
                    <button type="button" class="btn btn-outline-secondary btnhover text-uppercase" @click="backToVerify">
                      Back
                    </button>
                    <button
                      type="button"
                      class="btn btn-secondary btnhover text-uppercase sign-btn"
                      :disabled="isResettingPassword"
                      @click="resetPassword"
                    >
                      {{ isResettingPassword ? 'Resetting...' : 'Reset Password' }}
                    </button>
                  </div>
                </form>
              </div>
            </Transition>

            <p v-if="errorMessage" class="text-danger text-center m-t20 mb-0">{{ errorMessage }}</p>
            <p v-if="successMessage" class="text-success text-center m-t20 mb-0">{{ successMessage }}</p>
          </div>
        </div>
      </section>
    </div>

    
  </div>
</template>

<style scoped>
.form-switch-enter-active,
.form-switch-leave-active {
  overflow: hidden;
  transition: opacity 0.85s ease, transform 0.85s ease, max-height 0.85s ease;
}

.form-switch-enter-from,
.form-switch-leave-to {
  opacity: 0;
  transform: translateY(22px);
  max-height: 0;
}

.form-switch-enter-to,
.form-switch-leave-from {
  opacity: 1;
  transform: translateY(0);
  max-height: 900px;
}
</style>
