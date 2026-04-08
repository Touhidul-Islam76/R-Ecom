<template>
  <div class="min-h-screen bg-white text-slate-900">
    <main>
      <section class="px-4 sm:px-6 lg:px-8">
        <div
          class="mx-auto grid min-h-[720px] max-w-7xl grid-cols-1 overflow-hidden lg:grid-cols-2"
        >
          <!-- Left banner -->
          <div class="order-2 lg:order-1 lg:sticky lg:top-0 lg:h-screen">
            <div
              class="relative flex min-h-[320px] items-end overflow-hidden rounded-3xl lg:min-h-[720px] lg:rounded-none"
            >
              <div class="absolute inset-0 bg-black/35"></div>

              <div class="relative z-10 w-full p-8 text-white sm:p-10 lg:p-14 xl:p-16">
                <p class="mb-3 text-sm font-medium uppercase tracking-[0.2em] text-white/80">
                  Password Reset
                </p>
                <h1 class="font-serif text-4xl leading-tight sm:text-5xl xl:text-6xl">
                  Forgot Password?
                </h1>
                <p class="mt-4 max-w-xl text-sm leading-7 text-white/85 sm:text-base">
                  Enter your email address and weâ€™ll send you a link to reset your password and
                  get back into your account.
                </p>
              </div>
            </div>
          </div>

          <!-- Right form -->
          <div class="order-1 flex items-center lg:order-2">
            <div class="w-full px-0 py-10 sm:py-14 lg:px-10 xl:px-16">
              <div class="mx-auto w-full max-w-xl">
                <h2 class="text-3xl font-semibold tracking-tight sm:text-4xl">
                  Reset Password
                </h2>
                <p class="mt-2 text-sm text-slate-500 sm:text-base">
                  Please enter your email to receive a password reset link
                </p>

                <form class="mt-8 space-y-6" @submit.prevent="handleForgotPassword">
                  <!-- Optional social buttons kept same style -->
                  <div class="grid grid-cols-1 gap-3 xl:grid-cols-2">
                    <button
                      type="button"
                      class="inline-flex h-14 w-full items-center justify-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50"
                    >
                      <svg
                        width="22"
                        height="22"
                        viewBox="0 0 26 26"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        aria-hidden="true"
                      >
                        <g clip-path="url(#clip0_google)">
                          <path
                            d="M5.76215 15.7122L4.85713 19.0908L1.54929 19.1607C0.560727 17.3272 0 15.2294 0 13.0001C0 10.8443 0.524266 8.81147 1.45356 7.02148H1.45427L4.39918 7.56139L5.68923 10.4886C5.41922 11.2758 5.27206 12.1208 5.27206 13.0001C5.27216 13.9543 5.44502 14.8687 5.76215 15.7122Z"
                            fill="#FBBB00"
                          />
                          <path
                            d="M25.7722 10.5715C25.9215 11.3579 25.9994 12.1701 25.9994 13.0001C25.9994 13.9308 25.9015 14.8387 25.7151 15.7144C25.0823 18.6944 23.4287 21.2965 21.138 23.138L21.1373 23.1373L17.428 22.948L16.903 19.6708C18.423 18.7794 19.6109 17.3844 20.2366 15.7144H13.2852V10.5715H20.338H25.7722Z"
                            fill="#518EF8"
                          />
                          <path
                            d="M21.1374 23.1371L21.1381 23.1378C18.9103 24.9285 16.0802 26 12.9995 26C8.04883 26 3.74456 23.2329 1.54883 19.1607L5.76169 15.7122C6.85953 18.6421 9.68596 20.7279 12.9995 20.7279C14.4238 20.7279 15.7581 20.3428 16.9031 19.6707L21.1374 23.1371Z"
                            fill="#28B446"
                          />
                          <path
                            d="M21.2974 2.99284L17.086 6.44069C15.901 5.69999 14.5003 5.27211 12.9996 5.27211C9.61098 5.27211 6.73168 7.45352 5.68884 10.4886L1.45384 7.02142H1.45312C3.61671 2.85 7.97527 0 12.9996 0C16.1538 0 19.046 1.12359 21.2974 2.99284Z"
                            fill="#F14336"
                          />
                        </g>
                        <defs>
                          <clipPath id="clip0_google">
                            <rect width="26" height="26" fill="white" />
                          </clipPath>
                        </defs>
                      </svg>
                      Log in with Google
                    </button>

                    <button
                      type="button"
                      class="inline-flex h-14 w-full items-center justify-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50"
                    >
                      <svg
                        height="22"
                        viewBox="0 0 176 176"
                        width="22"
                        xmlns="http://www.w3.org/2000/svg"
                        aria-hidden="true"
                      >
                        <g>
                          <circle cx="88" cy="88" fill="#1877F2" r="88" />
                          <path
                            d="m115.88 77.58-1.77 15.33a2.87 2.87 0 0 1 -2.82 2.57h-16l-.08 45.45a2.05 2.05 0 0 1 -2 2.07h-16.21a2 2 0 0 1 -2-2.08v-45.44h-12a2.87 2.87 0 0 1 -2.84-2.9l-.06-15.33a2.88 2.88 0 0 1 2.84-2.92h12.06v-14.8c0-17.18 10.2-26.53 25.16-26.53h12.26a2.88 2.88 0 0 1 2.85 2.92v12.9a2.88 2.88 0 0 1 -2.85 2.92h-7.52c-8.13 0-9.71 4-9.71 9.78v12.81h17.87a2.88 2.88 0 0 1 2.82 3.25z"
                            fill="#fff"
                          />
                        </g>
                      </svg>
                      Log in with facebook
                    </button>
                  </div>

                  <!-- divider -->
                  <div class="relative py-1 text-center">
                    <div class="absolute inset-0 flex items-center">
                      <div class="w-full border-t border-slate-200"></div>
                    </div>
                    <span class="relative bg-white px-4 text-sm text-slate-400">or</span>
                  </div>

                  <!-- Email -->
                  <div>
                    <label class="mb-2 block text-sm font-medium text-slate-700">
                      Email Address
                    </label>
                    <input
                      v-model="form.email"
                      type="email"
                      required
                      placeholder="Email Address"
                      class="h-14 w-full rounded-2xl border border-slate-200 px-4 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
                    />
                  </div>

                  <!-- Submit -->
                  <button
                    type="submit"
                    class="h-14 w-full rounded-2xl bg-slate-900 text-white font-semibold hover:bg-slate-800"
                  >
                    Send Reset Otp
                  </button>

                  <!-- Back links -->
                  <div class="space-y-2">
                    <p class="text-sm text-slate-500">
                      Remember your password?
                      <NuxtLink
                        to="/login"
                        class="font-semibold text-emerald-600 hover:text-emerald-700"
                      >
                        Sign in
                      </NuxtLink>
                    </p>

                    <p class="text-sm text-slate-500">
                      Donâ€™t have an account?
                      <NuxtLink
                        to="/registration"
                        class="font-semibold text-emerald-600 hover:text-emerald-700"
                      >
                        Sign up
                      </NuxtLink>
                    </p>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue'

definePageMeta({
  layout: false,
})

const form = reactive({
  email: '',
})

const handleForgotPassword = () => {
  console.log('forgot-password', form)
}
</script>

<style scoped>
.font-serif {
  font-family: 'Marcellus', serif;
}
</style>

