<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, nextTick } from 'vue'
import { useAuthStore } from '~/stores/authStore'

useHead({ title: 'FasionAble' })
definePageMeta({ footerStyle: '2' })

type Step = 'request' | 'verify' | 'reset'

const toast = useToast()
const authStore = useAuthStore()

const currentStep = ref<Step>('request')
const identifier = ref('')
const otpCode = ref('')

const showNewPassword = ref(false)
const showConfirmPassword = ref(false)
const newPassword = ref('')
const confirmPassword = ref('')

const toggleNewPassword = () => { showNewPassword.value = !showNewPassword.value }
const toggleConfirmPassword = () => { showConfirmPassword.value = !showConfirmPassword.value }

const isSendingOtp = computed(() => authStore.isSendingOtp)
const isVerifyingOtp = computed(() => authStore.isVerifyingOtp)
const isResettingPassword = computed(() => authStore.isResettingPassword)

const errorMessage = ref('')
const successMessage = ref('')
const resendIn = ref(0)
const devOtpPreview = ref('')

let resendTimer: ReturnType<typeof setInterval> | null = null

const normalizeIdentifier = (value: string) => {
  const trimmed = value.trim()
  return trimmed.includes('@') ? trimmed.toLowerCase() : trimmed.replace(/[^\d+]/g, '')
}

const isValidIdentifier = (value: string) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  const phoneRegex = /^\+?[0-9]{8,15}$/
  return emailRegex.test(value) || phoneRegex.test(value)
}

const clearMessages = () => {
  errorMessage.value = ''
  successMessage.value = ''
}

const startResendTimer = (seconds: number) => {
  if (resendTimer) {
    clearInterval(resendTimer)
    resendTimer = null
  }

  resendIn.value = seconds
  resendTimer = setInterval(() => {
    if (resendIn.value <= 1) {
      clearInterval(resendTimer!)
      resendTimer = null
      resendIn.value = 0
      return
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

const sendOtp = async () => {
  clearMessages()
  const normalized = normalizeIdentifier(identifier.value)

  if (!isValidIdentifier(normalized)) {
    errorMessage.value = 'Please enter a valid email or phone number.'
    toast.error(errorMessage.value)
    return
  }

  try {
    const result = await authStore.sendOtp(normalized)

    identifier.value = result.identifier
    currentStep.value = 'verify'
    otpCode.value = ''
    devOtpPreview.value = result.otpPreview

    successMessage.value = result.message
    toast.success(result.message)
    startResendTimer(60)
  } catch (error: unknown) {
    errorMessage.value = error instanceof Error ? error.message : 'Failed to send OTP. Please try again.'
    toast.error(errorMessage.value)
  }
}

const resendOtp = async () => {
  if (resendIn.value > 0 || isSendingOtp.value) return
  await sendOtp()
}

const verifyOtp = async () => {
  clearMessages()

  if (!/^\d{4}$/.test(otpCode.value.trim())) {
    errorMessage.value = 'OTP must be 4 digits.'
    toast.error(errorMessage.value)
    return
  }

  try {
    const result = await authStore.verifyOtp(identifier.value, otpCode.value.trim())

    currentStep.value = 'reset'
    devOtpPreview.value = ''
    successMessage.value = result.message
    toast.success(result.message)
  } catch (error: unknown) {
    errorMessage.value = error instanceof Error ? error.message : 'OTP verification failed. Please try again.'
    toast.error(errorMessage.value)
  }
}

const resetPassword = async () => {
  clearMessages()

  if (newPassword.value.trim().length < 8) {
    errorMessage.value = 'Password must be at least 8 characters long.'
    toast.error(errorMessage.value)
    return
  }

  if (newPassword.value !== confirmPassword.value) {
    errorMessage.value = 'Passwords do not match.'
    toast.error(errorMessage.value)
    return
  }

  try {
    const result = await authStore.resetPassword(
      identifier.value,
      otpCode.value.trim(),
      newPassword.value,
      confirmPassword.value,
    )

    successMessage.value = result.message
    toast.success(result.message)

    currentStep.value = 'request'
    otpCode.value = ''
    newPassword.value = ''
    confirmPassword.value = ''
    identifier.value = ''

    setTimeout(() => navigateTo('/login'), 1500)
  } catch (error: unknown) {
    errorMessage.value = error instanceof Error ? error.message : 'Failed to reset password. Please try again.'
    toast.error(errorMessage.value)
  }
}

const backToRequest = () => {
  clearMessages()
  currentStep.value = 'request'
  otpCode.value = ''
}

const backToVerify = () => {
  clearMessages()
  currentStep.value = 'verify'
}

onMounted(() => {
  const plantZone = (window as Window & { PlantZone?: { init: () => void; load: () => void } }).PlantZone
  if (plantZone) {
    plantZone.init()
    plantZone.load()
  }

  nextTick(() => {
    const carousel = (window as Window & { PlantZoneCarousel?: { load: () => void } }).PlantZoneCarousel
    if (carousel) carousel.load()
  })
})

onUnmounted(() => {
  if (resendTimer) {
    clearInterval(resendTimer)
    resendTimer = null
  }
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
                    <div class="dz-search-password">
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
                        <svg class="eye-close" xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="#8ea5c8"><path d="M11 17.188a8.71 8.71 0 0 1-1.576-.147.69.69 0 0 1-.579-.678.7.7 0 0 1 .817-.676 7.33 7.33 0 0 0 1.339.127c4.073 0 7.61-3.566 8.722-4.812a18.51 18.51 0 0 0-2.434-2.274.69.69 0 0 1 .335-1.226.69.69 0 0 1 .268.019c.087.024.169.064.24.12a18.79 18.79 0 0 1 3.036 2.939.69.69 0 0 1 0 .848c-.185.234-4.581 5.763-10.167 5.763zm7.361-13.549a.69.69 0 0 0-.972 0l-2.186 2.186a10.68 10.68 0 0 0-2.606-.864c-.527-.099-1.061-.149-1.597-.149-5.585 0-9.982 5.528-10.166 5.763a.69.69 0 0 0 0 .848c.897 1.09 1.915 2.075 3.033 2.936.529.415 1.083.796 1.66 1.142l-1.888 1.887c-.066.063-.118.139-.154.223a.69.69 0 0 0 .145.757.67.67 0 0 0 .226.15c.085.034.175.052.266.051a.69.69 0 0 0 .265-.056c.084-.036.16-.088.223-.154l13.75-13.75a.69.69 0 0 0 0-.972zm-13.65 9.636A18.51 18.51 0 0 1 2.278 11C3.39 9.754 6.927 6.187 11 6.187a7.31 7.31 0 0 1 1.348.127 8.92 8.92 0 0 1 1.814.55L12.895 8.13c-.661-.437-1.453-.632-2.241-.552a3.44 3.44 0 0 0-2.085.989c-.56.56-.91 1.297-.989 2.085a3.44 3.44 0 0 0 .552 2.241l-1.601 1.604a14.43 14.43 0 0 1-1.82-1.222zm4.432-1.392c-.134-.275-.204-.577-.206-.883a2.07 2.07 0 0 1 .6-1.456 2.12 2.12 0 0 1 2.338-.392l-2.731 2.731z"/></svg>
                        <svg class="eye-open" xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="#8ea5c8"><path d="M19.873 9.611c-.179-.244-4.436-5.985-9.873-5.985S.305 9.367.127 9.611a.66.66 0 0 0 0 .778c.178.244 4.436 5.985 9.873 5.985s9.694-5.74 9.873-5.984a.66.66 0 0 0 0-.778zM10 15.055c-4.005 0-7.474-3.81-8.501-5.055C2.525 8.753 5.986 4.945 10 4.945c4.005 0 7.473 3.809 8.501 5.055-1.025 1.247-4.487 5.054-8.501 5.054zm0-9.011A3.96 3.96 0 0 0 6.044 10 3.96 3.96 0 0 0 10 13.956 3.96 3.96 0 0 0 13.956 10 3.96 3.96 0 0 0 10 6.044zm0 6.593A2.64 2.64 0 0 1 7.363 10 2.64 2.64 0 0 1 10 7.363 2.64 2.64 0 0 1 12.637 10 2.64 2.64 0 0 1 10 12.637z"/></svg>
                      </div>
                    </div>
                  </div>
                  <div class="m-b30">
                    <label class="label-title">Confirm Password</label>
                    <div class="dz-search-password">
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
                        <svg class="eye-close" xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="#8ea5c8"><path d="M11 17.188a8.71 8.71 0 0 1-1.576-.147.69.69 0 0 1-.579-.678.7.7 0 0 1 .817-.676 7.33 7.33 0 0 0 1.339.127c4.073 0 7.61-3.566 8.722-4.812a18.51 18.51 0 0 0-2.434-2.274.69.69 0 0 1 .335-1.226.69.69 0 0 1 .268.019c.087.024.169.064.24.12a18.79 18.79 0 0 1 3.036 2.939.69.69 0 0 1 0 .848c-.185.234-4.581 5.763-10.167 5.763zm7.361-13.549a.69.69 0 0 0-.972 0l-2.186 2.186a10.68 10.68 0 0 0-2.606-.864c-.527-.099-1.061-.149-1.597-.149-5.585 0-9.982 5.528-10.166 5.763a.69.69 0 0 0 0 .848c.897 1.09 1.915 2.075 3.033 2.936.529.415 1.083.796 1.66 1.142l-1.888 1.887c-.066.063-.118.139-.154.223a.69.69 0 0 0 .145.757.67.67 0 0 0 .226.15c.085.034.175.052.266.051a.69.69 0 0 0 .265-.056c.084-.036.16-.088.223-.154l13.75-13.75a.69.69 0 0 0 0-.972zm-13.65 9.636A18.51 18.51 0 0 1 2.278 11C3.39 9.754 6.927 6.187 11 6.187a7.31 7.31 0 0 1 1.348.127 8.92 8.92 0 0 1 1.814.55L12.895 8.13c-.661-.437-1.453-.632-2.241-.552a3.44 3.44 0 0 0-2.085.989c-.56.56-.91 1.297-.989 2.085a3.44 3.44 0 0 0 .552 2.241l-1.601 1.604a14.43 14.43 0 0 1-1.82-1.222zm4.432-1.392c-.134-.275-.204-.577-.206-.883a2.07 2.07 0 0 1 .6-1.456 2.12 2.12 0 0 1 2.338-.392l-2.731 2.731z"/></svg>
                        <svg class="eye-open" xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="#8ea5c8"><path d="M19.873 9.611c-.179-.244-4.436-5.985-9.873-5.985S.305 9.367.127 9.611a.66.66 0 0 0 0 .778c.178.244 4.436 5.985 9.873 5.985s9.694-5.74 9.873-5.984a.66.66 0 0 0 0-.778zM10 15.055c-4.005 0-7.474-3.81-8.501-5.055C2.525 8.753 5.986 4.945 10 4.945c4.005 0 7.473 3.809 8.501 5.055-1.025 1.247-4.487 5.054-8.501 5.054zm0-9.011A3.96 3.96 0 0 0 6.044 10 3.96 3.96 0 0 0 10 13.956 3.96 3.96 0 0 0 13.956 10 3.96 3.96 0 0 0 10 6.044zm0 6.593A2.64 2.64 0 0 1 7.363 10 2.64 2.64 0 0 1 10 7.363 2.64 2.64 0 0 1 12.637 10 2.64 2.64 0 0 1 10 12.637z"/></svg>
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

