<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useAuthStore } from '~/stores/authStore'

const { handleLogout, isLoggingOut } = useAuth()
const authStore = useAuthStore()
const authUser = useAuthUser()
const backendOrigin = 'http://localhost:8000'

const resolveAvatar = (value: unknown) => {
  if (typeof value !== 'string' || !value.trim()) return ''
  const normalized = value.trim()

  if (
    normalized.startsWith('http://') ||
    normalized.startsWith('https://') ||
    normalized.startsWith('/') ||
    normalized.startsWith('blob:') ||
    normalized.startsWith('data:')
  ) {
    return normalized
  }

  if (normalized.startsWith('assets/images/')) {
    return `${backendOrigin}/${normalized}`
  }

  if (normalized.startsWith('userProfile/')) {
    return `${backendOrigin}/assets/images/${normalized}`
  }

  return normalized
}

const userName = computed(() => String(authUser.value.name || authStore.user.name || 'Admin'))
const userRole = computed(() => String(authUser.value.role || authStore.user.role || 'admin'))
const userAvatar = computed(
  () =>
    resolveAvatar(authUser.value.image_url) ||
    resolveAvatar(authUser.value.image) ||
    resolveAvatar(authStore.user.image_url) ||
    resolveAvatar(authStore.user.image) ||
    '/velonic/images/users/avatar-1.jpg',
)

// ── Head: load Velonic CSS + set html data-attrs ──────────────
useHead({
  htmlAttrs: {
    'data-bs-theme':        'light',
    'data-layout':          'vertical',
    'data-layout-mode':     'fluid',
    'data-layout-position': 'fixed',
    'data-topbar-color':    'light',
    'data-menu-color':      'dark',
    'data-sidenav-size':    'default',
  },
})

// ── Dark / Light mode toggle ──────────────────────────────────
const isDark = ref(false)
const setTheme = (dark: boolean) => {
  isDark.value = dark
  if (process.client) document.documentElement.setAttribute('data-bs-theme', dark ? 'dark' : 'light')
}
const toggleDarkMode = () => setTheme(!isDark.value)

// ── Theme offcanvas helpers ───────────────────────────────────
const setMenuColor = (color: string) => {
  if (process.client) document.documentElement.setAttribute('data-menu-color', color)
}
const resetTheme = () => {
  setTheme(false)
  setMenuColor('dark')
}

// ── Sidebar toggle ────────────────────────────────────────────
const sidenavSize = ref('default')
const toggleSidebar = () => {
  if (process.client) {
    const current = document.documentElement.getAttribute('data-sidenav-size') || 'default'
    const newSize = current === 'default' ? 'condensed' : 'default'
    document.documentElement.setAttribute('data-sidenav-size', newSize)
    localStorage.setItem('sidenav-size', newSize)
  }
}

const route = useRoute()

// ── Vue accordion for sidebar (fixes the collapse/open bug) ───
const openMenu = ref<string | null>(null)
const toggleSubMenu = (id: string) => {
  openMenu.value = openMenu.value === id ? null : id
}
const isMenuOpen = (id: string) => openMenu.value === id

const syncCatalogMenuByRoute = () => {
  if (
    route.path.startsWith('/admin/brands') ||
    route.path.startsWith('/admin/categories') ||
    route.path.startsWith('/admin/products') ||
    route.path.startsWith('/admin/product-notify')
  ) {
    openMenu.value = 'catalog'
  }
}

// ── Load Velonic app JS (only app, no vendor — avoids jQuery conflict) ─
const initVelonicJS = () => {
  // Simplebar on sidebar
  if ((window as any).SimpleBar && document.getElementById('leftside-menu-container')) {
    new (window as any).SimpleBar(document.getElementById('leftside-menu-container')!)
  }
}

const loadAuthProfile = async () => {
  authStore.hydrateAuthFromStorage()

  if (!authStore.hasToken) return

  try {
    await authStore.fetchCurrentUser()
  } catch {
    // Keep cached profile silently if live request fails.
  }
}

onMounted(async () => {
  // Small delay to ensure vendor.min (loaded by plantzone) is ready
  setTimeout(initVelonicJS, 600)

  if (process.client) {
    // Load saved sidenav size
    const saved = localStorage.getItem('sidenav-size')
    if (saved) {
      document.documentElement.setAttribute('data-sidenav-size', saved)
    }
  }

  await loadAuthProfile()
  syncCatalogMenuByRoute()
})

watch(
  () => route.path,
  () => {
    syncCatalogMenuByRoute()
  },
)
</script>

<template>
  <div class="wrapper">

    <!-- ===== Topbar ===== -->
    <div class="navbar-custom">
      <div class="topbar container-fluid">
        <div class="d-flex align-items-center gap-1">

          <!-- Logo (topbar) -->
          <div class="logo-topbar">
            <NuxtLink to="/admin" class="logo-light">
              <span class="logo-lg"><img src="/velonic/images/logo.png" alt="logo"></span>
              <span class="logo-sm"><img src="/velonic/images/logo-sm.png" alt="logo"></span>
            </NuxtLink>
            <NuxtLink to="/admin" class="logo-dark">
              <span class="logo-lg"><img src="/velonic/images/logo-dark.png" alt="logo"></span>
              <span class="logo-sm"><img src="/velonic/images/logo-sm.png" alt="logo"></span>
            </NuxtLink>
          </div>

          <!-- Sidebar toggle -->
          <button class="button-toggle-menu" @click="toggleSidebar">
            <i class="ri-menu-line"></i>
          </button>

          <!-- Desktop search -->
          <div class="app-search d-none d-lg-block">
            <form @submit.prevent>
              <div class="input-group">
                <input type="search" class="form-control" placeholder="Search...">
                <span class="ri-search-line search-icon text-muted"></span>
              </div>
            </form>
          </div>
        </div>

        <ul class="topbar-menu d-flex align-items-center gap-3">

          <!-- Mobile search -->
          <li class="dropdown d-lg-none">
            <a class="nav-link dropdown-toggle arrow-none" data-bs-toggle="dropdown" href="#" role="button">
              <i class="ri-search-line fs-22"></i>
            </a>
            <div class="dropdown-menu dropdown-menu-animated dropdown-lg p-0">
              <form class="p-3">
                <input type="search" class="form-control" placeholder="Search ...">
              </form>
            </div>
          </li>

          <!-- Language -->
          <li class="dropdown">
            <a class="nav-link dropdown-toggle arrow-none" data-bs-toggle="dropdown" href="#" role="button">
              <img src="/velonic/images/flags/us.jpg" alt="flag" class="me-0 me-sm-1" height="12">
              <span class="align-middle d-none d-lg-inline-block">English</span>
              <i class="ri-arrow-down-s-line d-none d-sm-inline-block align-middle"></i>
            </a>
            <div class="dropdown-menu dropdown-menu-end dropdown-menu-animated">
              <a href="javascript:void(0);" class="dropdown-item">
                <img src="/velonic/images/flags/germany.jpg" alt="de" class="me-1" height="12">
                <span class="align-middle">German</span>
              </a>
              <a href="javascript:void(0);" class="dropdown-item">
                <img src="/velonic/images/flags/italy.jpg" alt="it" class="me-1" height="12">
                <span class="align-middle">Italian</span>
              </a>
              <a href="javascript:void(0);" class="dropdown-item">
                <img src="/velonic/images/flags/spain.jpg" alt="es" class="me-1" height="12">
                <span class="align-middle">Spanish</span>
              </a>
              <a href="javascript:void(0);" class="dropdown-item">
                <img src="/velonic/images/flags/russia.jpg" alt="ru" class="me-1" height="12">
                <span class="align-middle">Russian</span>
              </a>
            </div>
          </li>

          <!-- Messages -->
          <li class="dropdown notification-list">
            <a class="nav-link dropdown-toggle arrow-none" data-bs-toggle="dropdown" href="#" role="button">
              <i class="ri-mail-line fs-22"></i>
              <span class="noti-icon-badge badge text-bg-purple">4</span>
            </a>
            <div class="dropdown-menu dropdown-menu-end dropdown-menu-animated dropdown-lg py-0">
              <div class="p-2 border-top-0 border-start-0 border-end-0 border-dashed border">
                <div class="row align-items-center">
                  <div class="col"><h6 class="m-0 fs-16 fw-semibold">Messages</h6></div>
                  <div class="col-auto"><a href="javascript:void(0);" class="text-dark text-decoration-underline"><small>Clear All</small></a></div>
                </div>
              </div>
              <div style="max-height:300px;overflow-y:auto">
                <a href="javascript:void(0);" class="dropdown-item p-0 notify-item read-noti card m-0 shadow-none">
                  <div class="card-body">
                    <div class="d-flex align-items-center">
                      <div class="flex-shrink-0"><div class="notify-icon"><img src="/velonic/images/users/avatar-1.jpg" class="img-fluid rounded-circle" alt=""></div></div>
                      <div class="flex-grow-1 text-truncate ms-2">
                        <h5 class="noti-item-title fw-semibold fs-14">Cristina Pride <small class="fw-normal text-muted float-end ms-1">1 day ago</small></h5>
                        <small class="noti-item-subtitle text-muted">Hi, How are you? What about our next meeting</small>
                      </div>
                    </div>
                  </div>
                </a>
                <a href="javascript:void(0);" class="dropdown-item p-0 notify-item read-noti card m-0 shadow-none">
                  <div class="card-body">
                    <div class="d-flex align-items-center">
                      <div class="flex-shrink-0"><div class="notify-icon"><img src="/velonic/images/users/avatar-2.jpg" class="img-fluid rounded-circle" alt=""></div></div>
                      <div class="flex-grow-1 text-truncate ms-2">
                        <h5 class="noti-item-title fw-semibold fs-14">Sam Garret <small class="fw-normal text-muted float-end ms-1">2 days ago</small></h5>
                        <small class="noti-item-subtitle text-muted">Yeah everything is fine</small>
                      </div>
                    </div>
                  </div>
                </a>
                <a href="javascript:void(0);" class="dropdown-item p-0 notify-item read-noti card m-0 shadow-none">
                  <div class="card-body">
                    <div class="d-flex align-items-center">
                      <div class="flex-shrink-0"><div class="notify-icon"><img src="/velonic/images/users/avatar-3.jpg" class="img-fluid rounded-circle" alt=""></div></div>
                      <div class="flex-grow-1 text-truncate ms-2">
                        <h5 class="noti-item-title fw-semibold fs-14">Karen Robinson <small class="fw-normal text-muted float-end ms-1">2 days ago</small></h5>
                        <small class="noti-item-subtitle text-muted">Wow that's great</small>
                      </div>
                    </div>
                  </div>
                </a>
                <a href="javascript:void(0);" class="dropdown-item p-0 notify-item read-noti card m-0 shadow-none">
                  <div class="card-body">
                    <div class="d-flex align-items-center">
                      <div class="flex-shrink-0"><div class="notify-icon"><img src="/velonic/images/users/avatar-4.jpg" class="img-fluid rounded-circle" alt=""></div></div>
                      <div class="flex-grow-1 text-truncate ms-2">
                        <h5 class="noti-item-title fw-semibold fs-14">Sherry Marshall <small class="fw-normal text-muted float-end ms-1">3 days ago</small></h5>
                        <small class="noti-item-subtitle text-muted">Hi, How are you? What about our next meeting</small>
                      </div>
                    </div>
                  </div>
                </a>
                <a href="javascript:void(0);" class="dropdown-item p-0 notify-item read-noti card m-0 shadow-none">
                  <div class="card-body">
                    <div class="d-flex align-items-center">
                      <div class="flex-shrink-0"><div class="notify-icon"><img src="/velonic/images/users/avatar-5.jpg" class="img-fluid rounded-circle" alt=""></div></div>
                      <div class="flex-grow-1 text-truncate ms-2">
                        <h5 class="noti-item-title fw-semibold fs-14">Shawn Millard <small class="fw-normal text-muted float-end ms-1">4 days ago</small></h5>
                        <small class="noti-item-subtitle text-muted">Yeah everything is fine</small>
                      </div>
                    </div>
                  </div>
                </a>
              </div>
              <a href="javascript:void(0);" class="dropdown-item text-center text-primary text-decoration-underline fw-bold notify-item border-top border-light py-2">View All</a>
            </div>
          </li>

          <!-- Notifications -->
          <li class="dropdown notification-list">
            <a class="nav-link dropdown-toggle arrow-none" data-bs-toggle="dropdown" href="#" role="button">
              <i class="ri-notification-3-line fs-22"></i>
              <span class="noti-icon-badge badge text-bg-pink">3</span>
            </a>
            <div class="dropdown-menu dropdown-menu-end dropdown-menu-animated dropdown-lg py-0">
              <div class="p-2 border-top-0 border-start-0 border-end-0 border-dashed border">
                <div class="row align-items-center">
                  <div class="col"><h6 class="m-0 fs-16 fw-semibold">Notification</h6></div>
                  <div class="col-auto"><a href="javascript:void(0);" class="text-dark text-decoration-underline"><small>Clear All</small></a></div>
                </div>
              </div>
              <div style="max-height:300px;overflow-y:auto">
                <a href="javascript:void(0);" class="dropdown-item notify-item">
                  <div class="notify-icon bg-primary-subtle"><i class="mdi mdi-comment-account-outline text-primary"></i></div>
                  <p class="notify-details">Caleb Flakelar commented on Admin<small class="noti-time">1 min ago</small></p>
                </a>
                <a href="javascript:void(0);" class="dropdown-item notify-item">
                  <div class="notify-icon bg-warning-subtle"><i class="mdi mdi-account-plus text-warning"></i></div>
                  <p class="notify-details">New user registered.<small class="noti-time">5 hours ago</small></p>
                </a>
                <a href="javascript:void(0);" class="dropdown-item notify-item">
                  <div class="notify-icon bg-danger-subtle"><i class="mdi mdi-heart text-danger"></i></div>
                  <p class="notify-details">Carlos Crouch liked your post.<small class="noti-time">3 days ago</small></p>
                </a>
                <a href="javascript:void(0);" class="dropdown-item notify-item">
                  <div class="notify-icon bg-pink-subtle"><i class="mdi mdi-comment-account-outline text-pink"></i></div>
                  <p class="notify-details">Caleb Flakelar commented on Admin<small class="noti-time">4 days ago</small></p>
                </a>
                <a href="javascript:void(0);" class="dropdown-item notify-item">
                  <div class="notify-icon bg-purple-subtle"><i class="mdi mdi-account-plus text-purple"></i></div>
                  <p class="notify-details">New user registered.<small class="noti-time">7 days ago</small></p>
                </a>
                <a href="javascript:void(0);" class="dropdown-item notify-item">
                  <div class="notify-icon bg-success-subtle"><i class="mdi mdi-heart text-success"></i></div>
                  <p class="notify-details">Carlos Crouch liked <b>Admin</b>.<small class="noti-time">Carlos Crouch liked</small></p>
                </a>
              </div>
              <a href="javascript:void(0);" class="dropdown-item text-center text-primary text-decoration-underline fw-bold notify-item border-top border-light py-2">View All</a>
            </div>
          </li>

          <!-- Theme settings toggle -->
          <li class="d-none d-sm-inline-block">
            <a class="nav-link" data-bs-toggle="offcanvas" href="#theme-settings-offcanvas">
              <i class="ri-settings-3-line fs-22"></i>
            </a>
          </li>

          <!-- Dark mode toggle -->
          <li class="d-none d-sm-inline-block">
            <div class="nav-link" style="cursor:pointer" @click="toggleDarkMode">
              <i :class="isDark ? 'ri-sun-line fs-22' : 'ri-moon-line fs-22'"></i>
            </div>
          </li>

          <!-- Profile -->
          <li class="dropdown">
            <a class="nav-link dropdown-toggle arrow-none nav-user" data-bs-toggle="dropdown" href="#" role="button">
              <span class="account-user-avatar">
                <img :src="userAvatar" alt="user" width="32" class="rounded-circle">
              </span>
              <span class="d-lg-block d-none">
                <h5 class="my-0 fw-normal">
                  {{ userName }}
                  <i class="ri-arrow-down-s-line d-none d-sm-inline-block align-middle"></i>
                </h5>
              </span>
            </a>
            <div class="dropdown-menu dropdown-menu-end dropdown-menu-animated profile-dropdown">
              <div class="dropdown-header noti-title">
                <h6 class="text-overflow m-0">Welcome {{ userName }}!</h6>
              </div>
              <NuxtLink to="/admin/my-account" class="dropdown-item">
                <i class="ri-account-circle-line fs-18 align-middle me-1"></i>
                <span>My Account</span>
              </NuxtLink>
              <a href="javascript:void(0);" class="dropdown-item">
                <i class="ri-settings-4-line fs-18 align-middle me-1"></i>
                <span>Settings</span>
              </a>
              <a href="javascript:void(0);" class="dropdown-item">
                <i class="ri-customer-service-2-line fs-18 align-middle me-1"></i>
                <span>Support</span>
              </a>
              <a href="javascript:void(0);" class="dropdown-item">
                <i class="ri-lock-password-line fs-18 align-middle me-1"></i>
                <span>Lock Screen</span>
              </a>
              <div class="dropdown-divider"></div>
              <a
                href="javascript:void(0);"
                class="dropdown-item"
                :class="{ disabled: isLoggingOut }"
                @click.prevent="handleLogout"
              >
                <i class="ri-logout-box-line fs-18 align-middle me-1"></i>
                <span>{{ isLoggingOut ? 'Logging out...' : 'Logout' }}</span>
              </a>
            </div>
          </li>

        </ul>
      </div>
    </div>
    <!-- ===== Topbar End ===== -->

    <!-- ===== Left Sidebar ===== -->
    <div class="leftside-menu">

      <NuxtLink to="/admin/account-dashboard" class="logo logo-light">
        <span class="logo-lg"><img src="/velonic/images/logo.png" alt="logo"></span>
        <span class="logo-sm"><img src="/velonic/images/logo-sm.png" alt="logo"></span>
      </NuxtLink>
      <NuxtLink to="/admin/account-dashboard" class="logo logo-dark">
        <span class="logo-lg"><img src="/velonic/images/logo-dark.png" alt="logo"></span>
        <span class="logo-sm"><img src="/velonic/images/logo-sm.png" alt="logo"></span>
      </NuxtLink>

      <!-- Sidebar scroll area -->
      <div class="h-100" id="leftside-menu-container" style="overflow-y:auto;overflow-x:hidden">
        <ul class="side-nav">

            <li class="side-nav-title">Main</li>

            <li class="side-nav-item">
                <NuxtLink to="/admin/account-dashboard" class="side-nav-link">
                    <i class="ri-dashboard-3-line"></i>
                    <span class="badge bg-success float-end">9+</span>
                    <span> Dashboard </span>
                </NuxtLink>
            </li>

            <li class="side-nav-item">
                <NuxtLink to="/admin/my-account" class="side-nav-link" :class="{ active: route.path === '/admin/my-account' }">
                    <i class="ri-account-circle-line"></i>
                    <span> My Account </span>
                </NuxtLink>
            </li>

            <li class="side-nav-item" :class="{ menuitem: isMenuOpen('catalog') }">
                <a
                    href="javascript:void(0);"
                    class="side-nav-link"
                    :class="{ 'collapsed': !isMenuOpen('catalog') }"
                    @click.prevent="toggleSubMenu('catalog')"
                >
                    <i class="ri-store-2-line"></i>
                    <span> Catalog </span>
                    <span class="menu-arrow" :style="isMenuOpen('catalog') ? 'transform:rotate(90deg)' : ''"></span>
                </a>
                <div class="collapse" :class="{ show: isMenuOpen('catalog') }">
                    <ul class="side-nav-second-level">
                        <li>
                            <NuxtLink to="/admin/brands" :class="{ active: route.path === '/admin/brands' }">Brands</NuxtLink>
                        </li>
                        <li>
                            <NuxtLink to="/admin/categories" :class="{ active: route.path === '/admin/categories' }">Categories</NuxtLink>
                        </li>
                        <li>
                            <NuxtLink to="/admin/products" :class="{ active: route.path === '/admin/products' }">Products</NuxtLink>
                        </li>
                        <li>
                          <NuxtLink to="/admin/product-notify" :class="{ active: route.path === '/admin/product-notify' }">Product Notify</NuxtLink>
                        </li>
                    </ul>
                </div>
            </li>

            <li class="side-nav-item" :class="{ menuitem: isMenuOpen('pages') }">
                <a
                    href="javascript:void(0);"
                    class="side-nav-link"
                    :class="{ 'collapsed': !isMenuOpen('pages') }"
                    @click.prevent="toggleSubMenu('pages')"
                >
                    <i class="ri-pages-line"></i>
                    <span> Pages </span>
                    <span class="menu-arrow" :style="isMenuOpen('pages') ? 'transform:rotate(90deg)' : ''"></span>
                </a>
                <div class="collapse" :class="{ show: isMenuOpen('pages') }">
                    <ul class="side-nav-second-level">
                        <li>
                            <a href="javascript: void(0);">Starter Page</a>
                        </li>
                        <li>
                            <a href="javascript: void(0);">Contact List</a>
                        </li>
                        <li>
                            <a href="javascript: void(0);">Profile</a>
                        </li>
                        <li>
                            <a href="javascript: void(0);">Timeline</a>
                        </li>
                        <li>
                            <a href="javascript: void(0);">Invoice</a>
                        </li>
                        <li>
                            <a href="javascript: void(0);">FAQ</a>
                        </li>
                        <li>
                            <a href="javascript: void(0);">Pricing</a>
                        </li>
                        <li>
                            <a href="javascript: void(0);">Maintenance</a>
                        </li>
                        <li>
                            <a href="javascript: void(0);">Error 404</a>
                        </li>
                        <li>
                            <a href="javascript: void(0);">Error 404-alt</a>
                        </li>
                        <li>
                            <a href="javascript: void(0);">Error 500</a>
                        </li>
                    </ul>
                </div>
            </li>

            <li class="side-nav-item" :class="{ menuitem: isMenuOpen('auth') }">
                <a
                    href="javascript:void(0);"
                    class="side-nav-link"
                    :class="{ 'collapsed': !isMenuOpen('auth') }"
                    @click.prevent="toggleSubMenu('auth')"
                >
                    <i class="ri-group-2-line"></i>
                    <span> Authentication </span>
                    <span class="menu-arrow" :style="isMenuOpen('auth') ? 'transform:rotate(90deg)' : ''"></span>
                </a>
                <div class="collapse" :class="{ show: isMenuOpen('auth') }">
                    <ul class="side-nav-second-level">
                        <li>
                            <a href="javascript: void(0);">Login</a>
                        </li>
                        <li>
                            <a href="javascript: void(0);">Register</a>
                        </li>
                        <li>
                            <a href="javascript: void(0);">Logout</a>
                        </li>
                        <li>
                            <a href="javascript: void(0);">Forgot Password</a>
                        </li>
                        <li>
                            <a href="javascript: void(0);">Lock Screen</a>
                        </li>
                    </ul>
                </div>
            </li>

            <li class="side-nav-item" :class="{ menuitem: isMenuOpen('layouts') }">
                <a
                    href="javascript:void(0);"
                    class="side-nav-link"
                    :class="{ 'collapsed': !isMenuOpen('layouts') }"
                    @click.prevent="toggleSubMenu('layouts')"
                >
                    <i class="ri-layout-line"></i>
                    <span class="badge bg-warning float-end">New</span>
                    <span> Layouts </span>
                    <span class="menu-arrow" :style="isMenuOpen('layouts') ? 'transform:rotate(90deg)' : ''"></span>
                </a>
                <div class="collapse" :class="{ show: isMenuOpen('layouts') }">
                    <ul class="side-nav-second-level">
                        <li>
                            <a href="javascript: void(0);" target="_blank">Horizontal</a>
                        </li>
                        <li>
                            <a href="javascript: void(0);" target="_blank">Light Sidebar</a>
                        </li>
                        <li>
                            <a href="javascript: void(0);" target="_blank">Small Sidebar</a>
                        </li>
                        <li>
                            <a href="javascript: void(0);" target="_blank">Collapsed Sidebar</a>
                        </li>
                        <li>
                            <a href="javascript: void(0);" target="_blank">Unsticky Layout</a>
                        </li>
                        <li>
                            <a href="javascript: void(0);" target="_blank">Boxed Layout</a>
                        </li>
                    </ul>
                </div>
            </li>

            <li class="side-nav-title">Components</li>

            <li class="side-nav-item" :class="{ menuitem: isMenuOpen('baseui') }">
                <a
                    href="javascript:void(0);"
                    class="side-nav-link"
                    :class="{ 'collapsed': !isMenuOpen('baseui') }"
                    @click.prevent="toggleSubMenu('baseui')"
                >
                    <i class="ri-briefcase-line"></i>
                    <span> Base UI </span>
                    <span class="menu-arrow" :style="isMenuOpen('baseui') ? 'transform:rotate(90deg)' : ''"></span>
                </a>
                <div class="collapse" :class="{ show: isMenuOpen('baseui') }">
                    <ul class="side-nav-second-level">
                        <li>
                            <a href="javascript: void(0);">Accordions</a>
                        </li>
                        <li>
                            <a href="javascript: void(0);">Alerts</a>
                        </li>
                        <li>
                            <a href="javascript: void(0);">Avatars</a>
                        </li>
                        <li>
                            <a href="javascript: void(0);">Buttons</a>
                        </li>
                        <li>
                            <a href="javascript: void(0);">Badges</a>
                        </li>
                        <li>
                            <a href="javascript: void(0);">Breadcrumb</a>
                        </li>
                        <li>
                            <a href="javascript: void(0);">Cards</a>
                        </li>
                        <li>
                            <a href="javascript: void(0);">Carousel</a>
                        </li>
                        <li>
                            <a href="javascript: void(0);">Collapse</a>
                        </li>
                        <li>
                            <a href="javascript: void(0);">Dropdowns</a>
                        </li>
                        <li>
                            <a href="javascript: void(0);">Embed Video</a>
                        </li>
                        <li>
                            <a href="javascript: void(0);">Grid</a>
                        </li>
                        <li>
                            <a href="javascript: void(0);">Links</a>
                        </li>
                        <li>
                            <a href="javascript: void(0);">List Group</a>
                        </li>
                        <li>
                            <a href="javascript: void(0);">Modals</a>
                        </li>
                        <li>
                            <a href="javascript: void(0);">Notifications</a>
                        </li>
                        <li>
                            <a href="javascript: void(0);">Offcanvas</a>
                        </li>
                        <li>
                            <a href="javascript: void(0);">Placeholders</a>
                        </li>
                        <li>
                            <a href="javascript: void(0);">Pagination</a>
                        </li>
                        <li>
                            <a href="javascript: void(0);">Popovers</a>
                        </li>
                        <li>
                            <a href="javascript: void(0);">Progress</a>
                        </li>
                        <li>
                            <a href="javascript: void(0);">Spinners</a>
                        </li>
                        <li>
                            <a href="javascript: void(0);">Tabs</a>
                        </li>
                        <li>
                            <a href="javascript: void(0);">Tooltips</a>
                        </li>
                        <li>
                            <a href="javascript: void(0);">Typography</a>
                        </li>
                        <li>
                            <a href="javascript: void(0);">Utilities</a>
                        </li>
                    </ul>
                </div>
            </li>

            <li class="side-nav-item" :class="{ menuitem: isMenuOpen('extendedui') }">
                <a
                    href="javascript:void(0);"
                    class="side-nav-link"
                    :class="{ 'collapsed': !isMenuOpen('extendedui') }"
                    @click.prevent="toggleSubMenu('extendedui')"
                >
                    <i class="ri-compasses-2-line"></i>
                    <span> Extended UI </span>
                    <span class="menu-arrow" :style="isMenuOpen('extendedui') ? 'transform:rotate(90deg)' : ''"></span>
                </a>
                <div class="collapse" :class="{ show: isMenuOpen('extendedui') }">
                    <ul class="side-nav-second-level">
                        <li>
                            <a href="javascript: void(0);">Portlets</a>
                        </li>
                        <li>
                            <a href="javascript: void(0);">Scrollbar</a>
                        </li>
                        <li>
                            <a href="javascript: void(0);">Range Slider</a>
                        </li>
                        <li>
                            <a href="javascript: void(0);">Scrollspy</a>
                        </li>
                    </ul>
                </div>
            </li>

            <li class="side-nav-item" :class="{ menuitem: isMenuOpen('icons') }">
                <a
                    href="javascript:void(0);"
                    class="side-nav-link"
                    :class="{ 'collapsed': !isMenuOpen('icons') }"
                    @click.prevent="toggleSubMenu('icons')"
                >
                    <i class="ri-pencil-ruler-2-line"></i>
                    <span> Icons </span>
                    <span class="menu-arrow" :style="isMenuOpen('icons') ? 'transform:rotate(90deg)' : ''"></span>
                </a>
                <div class="collapse" :class="{ show: isMenuOpen('icons') }">
                    <ul class="side-nav-second-level">
                        <li>
                            <a href="javascript: void(0);">Remix Icons</a>
                        </li>
                        <li>
                            <a href="javascript: void(0);">Bootstrap Icons</a>
                        </li>
                        <li>
                            <a href="javascript: void(0);">Material Design Icons</a>
                        </li>
                    </ul>
                </div>
            </li>

            <li class="side-nav-item" :class="{ menuitem: isMenuOpen('charts') }">
                <a
                    href="javascript:void(0);"
                    class="side-nav-link"
                    :class="{ 'collapsed': !isMenuOpen('charts') }"
                    @click.prevent="toggleSubMenu('charts')"
                >
                    <i class="ri-donut-chart-fill"></i>
                    <span> Charts </span>
                    <span class="menu-arrow" :style="isMenuOpen('charts') ? 'transform:rotate(90deg)' : ''"></span>
                </a>
                <div class="collapse" :class="{ show: isMenuOpen('charts') }">
                    <ul class="side-nav-second-level">
                        <li>
                            <a href="javascript: void(0);">Apex Charts</a>
                        </li>
                        <li>
                            <a href="javascript: void(0);">Chartjs</a>
                        </li>
                        <li>
                            <a href="javascript: void(0);">Sparkline Charts</a>
                        </li>
                    </ul>
                </div>
            </li>

            <li class="side-nav-item" :class="{ menuitem: isMenuOpen('forms') }">
                <a
                    href="javascript:void(0);"
                    class="side-nav-link"
                    :class="{ 'collapsed': !isMenuOpen('forms') }"
                    @click.prevent="toggleSubMenu('forms')"
                >
                    <i class="ri-survey-line"></i>
                    <span> Forms </span>
                    <span class="menu-arrow" :style="isMenuOpen('forms') ? 'transform:rotate(90deg)' : ''"></span>
                </a>
                <div class="collapse" :class="{ show: isMenuOpen('forms') }">
                    <ul class="side-nav-second-level">
                        <li>
                            <a href="javascript: void(0);">Basic Elements</a>
                        </li>
                        <li>
                            <a href="javascript: void(0);">Form Advanced</a>
                        </li>
                        <li>
                            <a href="javascript: void(0);">Form Validation</a>
                        </li>
                        <li>
                            <a href="javascript: void(0);">Form Wizard</a>
                        </li>
                        <li>
                            <a href="javascript: void(0);">File Uploads</a>
                        </li>
                        <li>
                            <a href="javascript: void(0);">Form Editors</a>
                        </li>
                        <li>
                            <a href="javascript: void(0);">Image Crop</a>
                        </li>
                        <li>
                            <a href="javascript: void(0);">X Editable</a>
                        </li>
                    </ul>
                </div>
            </li>

            <li class="side-nav-item" :class="{ menuitem: isMenuOpen('tables') }">
                <a
                    href="javascript:void(0);"
                    class="side-nav-link"
                    :class="{ 'collapsed': !isMenuOpen('tables') }"
                    @click.prevent="toggleSubMenu('tables')"
                >
                    <i class="ri-table-line"></i>
                    <span> Tables </span>
                    <span class="menu-arrow" :style="isMenuOpen('tables') ? 'transform:rotate(90deg)' : ''"></span>
                </a>
                <div class="collapse" :class="{ show: isMenuOpen('tables') }">
                    <ul class="side-nav-second-level">
                        <li>
                            <a href="javascript: void(0);">Basic Tables</a>
                        </li>
                        <li>
                            <a href="javascript: void(0);">Data Tables</a>
                        </li>
                        <li>
                            <a href="javascript: void(0);">Editable Tables</a>
                        </li>
                        <li>
                            <a href="javascript: void(0);">Responsive Table</a>
                        </li>
                    </ul>
                </div>
            </li>

            <li class="side-nav-item" :class="{ menuitem: isMenuOpen('maps') }">
                <a
                    href="javascript:void(0);"
                    class="side-nav-link"
                    :class="{ 'collapsed': !isMenuOpen('maps') }"
                    @click.prevent="toggleSubMenu('maps')"
                >
                    <i class="ri-map-pin-line"></i>
                    <span> Maps </span>
                    <span class="menu-arrow" :style="isMenuOpen('maps') ? 'transform:rotate(90deg)' : ''"></span>
                </a>
                <div class="collapse" :class="{ show: isMenuOpen('maps') }">
                    <ul class="side-nav-second-level">
                        <li>
                            <a href="javascript: void(0);">Google Maps</a>
                        </li>
                        <li>
                            <a href="javascript: void(0);">Vector Maps</a>
                        </li>
                    </ul>
                </div>
            </li>

            <li class="side-nav-item" :class="{ menuitem: isMenuOpen('multilevel') }">
                <a
                    href="javascript:void(0);"
                    class="side-nav-link"
                    :class="{ 'collapsed': !isMenuOpen('multilevel') }"
                    @click.prevent="toggleSubMenu('multilevel')"
                >
                    <i class="ri-share-line"></i>
                    <span> Multi Level </span>
                    <span class="menu-arrow" :style="isMenuOpen('multilevel') ? 'transform:rotate(90deg)' : ''"></span>
                </a>
                <div class="collapse" :class="{ show: isMenuOpen('multilevel') }">
                    <ul class="side-nav-second-level">
                        <li>
                            <a href="javascript: void(0);">Level 1.1</a>
                        </li>
                        <li class="side-nav-item" :class="{ menuitem: isMenuOpen('secondlevel') }">
                            <a
                                href="javascript:void(0);"
                                :class="{ 'collapsed': !isMenuOpen('secondlevel') }"
                                @click.prevent="toggleSubMenu('secondlevel')"
                            >
                                <span> Level 1.2 </span>
                                <span class="menu-arrow" :style="isMenuOpen('secondlevel') ? 'transform:rotate(90deg)' : ''"></span>
                            </a>
                            <div class="collapse" :class="{ show: isMenuOpen('secondlevel') }">
                                <ul class="side-nav-third-level">
                                    <li>
                                        <a href="javascript: void(0);">Item 1</a>
                                    </li>
                                    <li>
                                        <a href="javascript: void(0);">Item 2</a>
                                    </li>
                                </ul>
                            </div>
                        </li>
                        <li class="side-nav-item" :class="{ menuitem: isMenuOpen('thirdlevel') }">
                            <a
                                href="javascript:void(0);"
                                :class="{ 'collapsed': !isMenuOpen('thirdlevel') }"
                                @click.prevent="toggleSubMenu('thirdlevel')"
                            >
                                <span> Level 1.3 </span>
                                <span class="menu-arrow" :style="isMenuOpen('thirdlevel') ? 'transform:rotate(90deg)' : ''"></span>
                            </a>
                            <div class="collapse" :class="{ show: isMenuOpen('thirdlevel') }">
                                <ul class="side-nav-third-level">
                                    <li>
                                        <a href="javascript: void(0);">Item 1</a>
                                    </li>
                                    <li class="side-nav-item" :class="{ menuitem: isMenuOpen('fourthlevel') }">
                                        <a
                                            href="javascript:void(0);"
                                            :class="{ 'collapsed': !isMenuOpen('fourthlevel') }"
                                            @click.prevent="toggleSubMenu('fourthlevel')"
                                        >
                                            <span> Item 2 </span>
                                            <span class="menu-arrow" :style="isMenuOpen('fourthlevel') ? 'transform:rotate(90deg)' : ''"></span>
                                        </a>
                                        <div class="collapse" :class="{ show: isMenuOpen('fourthlevel') }">
                                            <ul class="side-nav-forth-level">
                                                <li>
                                                    <a href="javascript: void(0);">Item 2.1</a>
                                                </li>
                                                <li>
                                                    <a href="javascript: void(0);">Item 2.2</a>
                                                </li>
                                            </ul>
                                        </div>
                                    </li>
                                </ul>
                            </div>
                        </li>
                    </ul>
                </div>
            </li>

        </ul>
        <div class="clearfix"></div>
      </div>
    </div>
    <!-- ===== Left Sidebar End ===== -->

    <!-- ===== Page Content ===== -->
    <div class="content-page">
      <div class="content">
        <div class="container-fluid">
          <slot />
        </div>
      </div>

      <footer class="footer">
        <div class="container-fluid">
          <div class="row">
            <div class="col-md-6">
              {{ new Date().getFullYear() }} &copy; FasionAble Admin Panel
            </div>
            <div class="col-md-6 text-end text-capitalize">
              {{ userRole }} Panel
            </div>
          </div>
        </div>
      </footer>
    </div>
    <!-- ===== Page Content End ===== -->

  </div>
  <!-- End wrapper -->

  <!-- ===== Theme Settings Offcanvas ===== -->
  <div class="offcanvas offcanvas-end" tabindex="-1" id="theme-settings-offcanvas">
    <div class="d-flex align-items-center bg-primary p-3 offcanvas-header">
      <h5 class="text-white m-0">Theme Settings</h5>
      <button type="button" class="btn-close btn-close-white ms-auto" data-bs-dismiss="offcanvas" aria-label="Close"></button>
    </div>
    <div class="offcanvas-body p-0">
      <div class="p-3">
        <h5 class="my-3 fs-16 fw-bold">Color Scheme</h5>
        <div class="row">
          <div class="col-4">
            <div class="form-check form-switch card-switch mb-1">
              <input class="form-check-input" type="checkbox" name="data-bs-theme" id="layout-color-light" value="light" @change="setTheme(false)">
              <label class="form-check-label" for="layout-color-light">
                <img src="/velonic/images/layouts/light.png" alt="" class="img-fluid">
              </label>
            </div>
            <h5 class="font-14 text-center text-muted mt-2">Light</h5>
          </div>
          <div class="col-4">
            <div class="form-check form-switch card-switch mb-1">
              <input class="form-check-input" type="checkbox" name="data-bs-theme" id="layout-color-dark" value="dark" @change="setTheme(true)">
              <label class="form-check-label" for="layout-color-dark">
                <img src="/velonic/images/layouts/dark.png" alt="" class="img-fluid">
              </label>
            </div>
            <h5 class="font-14 text-center text-muted mt-2">Dark</h5>
          </div>
        </div>

        <h5 class="my-3 fs-16 fw-bold">Sidebar Color</h5>
        <div class="row">
          <div class="col-4">
            <div class="form-check form-switch card-switch mb-1">
              <input class="form-check-input" type="checkbox" name="data-menu-color" id="leftbar-color-dark" value="dark" @change="setMenuColor('dark')">
              <label class="form-check-label" for="leftbar-color-dark">
                <img src="/velonic/images/layouts/dark.png" alt="" class="img-fluid">
              </label>
            </div>
            <h5 class="font-14 text-center text-muted mt-2">Dark</h5>
          </div>
          <div class="col-4">
            <div class="form-check form-switch card-switch mb-1">
              <input class="form-check-input" type="checkbox" name="data-menu-color" id="leftbar-color-light" value="light" @change="setMenuColor('light')">
              <label class="form-check-label" for="leftbar-color-light">
                <img src="/velonic/images/layouts/light.png" alt="" class="img-fluid">
              </label>
            </div>
            <h5 class="font-14 text-center text-muted mt-2">Light</h5>
          </div>
        </div>
      </div>
    </div>
    <div class="offcanvas-footer border-top p-3 text-center">
      <div class="row">
        <div class="col-6">
          <button type="button" class="btn btn-light w-100" @click="resetTheme()">Reset</button>
        </div>
      </div>
    </div>
  </div>

</template>

<style scoped>
.nav-user .account-user-avatar img {
  width: 32px;
  height: 32px;
  object-fit: cover;
}
</style>
