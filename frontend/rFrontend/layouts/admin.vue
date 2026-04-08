<template>
  <div class="min-h-screen bg-white text-slate-900">
    <div class="flex min-h-screen">
      <!-- Mobile overlay -->
      <transition name="fade">
        <div
          v-if="sidebarOpen"
          class="fixed inset-0 z-40 bg-slate-900/50 lg:hidden"
          @click="sidebarOpen = false"
        />
      </transition>

      <!-- Sidebar -->
      <aside
        :class="[
          'fixed inset-y-0 left-0 z-50 w-[280px] transform border-r border-slate-200 bg-slate-950 text-white transition-transform duration-300 lg:translate-x-0',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full',
        ]"
      >
        <div class="flex h-full flex-col">
          <!-- Brand -->
          <div class="border-b border-white/10 px-6 py-6">
            <p class="text-xs font-medium uppercase tracking-[0.25em] text-white/60">
              Admin Panel
            </p>
            <h1 class="mt-2 font-serif text-3xl leading-tight text-white">
              PlantZone
            </h1>
            <p class="mt-2 text-sm text-white/60">
              Manage your store with ease
            </p>
          </div>

          <!-- Nav -->
          <nav class="flex-1 space-y-2 overflow-y-auto px-4 py-5">
            <NuxtLink
              v-for="item in menuItems"
              :key="item.name"
              :to="item.to"
              class="group flex items-center justify-between rounded-2xl px-4 py-3 text-sm font-medium transition"
              :class="isActive(item.to)
                ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-900/30'
                : 'text-white/75 hover:bg-white/10 hover:text-white'"
              @click="sidebarOpen = false"
            >
              <span>{{ item.name }}</span>
              <span
                class="h-2.5 w-2.5 rounded-full transition"
                :class="isActive(item.to) ? 'bg-white' : 'bg-white/20 group-hover:bg-emerald-400'"
              />
            </NuxtLink>
          </nav>

          <!-- Bottom -->
          <div class="border-t border-white/10 px-4 py-4">
            <button
              class="inline-flex h-12 w-full items-center justify-center rounded-2xl border border-white/10 bg-white/5 px-4 text-sm font-semibold text-white transition hover:bg-white/10"
            >
              Logout
            </button>
          </div>
        </div>
      </aside>

      <!-- Main content -->
      <div class="flex min-h-screen flex-1 flex-col lg:ml-[280px]">
        <!-- Topbar -->
        <header class="sticky top-0 z-30 border-b border-slate-200 bg-white/90 backdrop-blur">
          <div class="flex items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
            <div class="flex items-center gap-3">
              <button
                class="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:bg-slate-50 lg:hidden"
                @click="sidebarOpen = true"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-5 w-5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                >
                  <path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>

              <div>
                <p class="text-xs font-medium uppercase tracking-[0.2em] text-slate-400">
                  Store Control
                </p>
                <h2 class="text-xl font-semibold text-slate-900">
                  Admin Dashboard
                </h2>
              </div>
            </div>

            <div class="flex items-center gap-3">
              <button
                class="hidden h-11 rounded-2xl border border-slate-200 bg-white px-4 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50 sm:inline-flex sm:items-center sm:justify-center"
              >
                Notifications
              </button>

              <div class="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-3 py-2 shadow-sm">
                <div class="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-100 text-sm font-semibold text-emerald-700">
                  A
                </div>
                <div class="hidden sm:block">
                  <p class="text-sm font-semibold text-slate-900">Admin User</p>
                  <p class="text-xs text-slate-500">admin@store.com</p>
                </div>
              </div>
            </div>
          </div>
        </header>

        <!-- Slot -->
        <main class="flex-1 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
          <slot />
        </main>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const sidebarOpen = ref(false)

const menuItems = computed(() => [
  { name: 'Dashboard', to: '/admin/dashboard' },
  { name: 'Products', to: '/admin/products' },
  { name: 'Categories', to: '/admin/categories' },
  { name: 'Orders', to: '/admin/orders' },
  { name: 'Customers', to: '/admin/customers' },
  { name: 'Payments', to: '/admin/payments' },
  { name: 'Shipping', to: '/admin/shipping' },
  { name: 'Coupons', to: '/admin/coupons' },
  { name: 'Reviews', to: '/admin/reviews' },
  { name: 'Reports', to: '/admin/reports' },
  { name: 'Settings', to: '/admin/settings' },
])

const isActive = (path: string) => route.path === path
</script>

<style scoped>
.font-serif {
  font-family: 'Marcellus', serif;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.25s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>