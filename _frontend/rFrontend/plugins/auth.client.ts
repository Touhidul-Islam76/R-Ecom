export default defineNuxtPlugin(() => {
  try {
    const stored = localStorage.getItem('auth_user')
    if (stored) {
      useAuthUser().value = JSON.parse(stored)
    }
  } catch { /* noop */ }
})
