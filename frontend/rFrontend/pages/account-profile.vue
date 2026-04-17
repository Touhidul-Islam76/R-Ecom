<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { useAuthStore } from '~/stores/authStore'

definePageMeta({ footerStyle: '2' })
useHead({ title: 'Account Profile | FasionAble' })

type ProfileForm = {
  name: string
  email: string
  phone: string
  address: string
  district: string
}

const toast = useToast()
const authStore = useAuthStore()

const profileForm = ref<ProfileForm>({
  name: '',
  email: '',
  phone: '',
  address: '',
  district: '',
})

const initialForm = ref<ProfileForm>({
  name: '',
  email: '',
  phone: '',
  address: '',
  district: '',
})

const backendUser = ref<Record<string, unknown>>({})
const profileImageFile = ref<File | null>(null)
const profileImagePreview = ref('')
const profileImageName = ref('')

const isLoadingProfile = computed(() => authStore.isLoadingProfile)
const isUpdatingProfile = computed(() => authStore.isUpdatingProfile)
const isLoggingOut = computed(() => authStore.isLoggingOut)

const mapUserToForm = (user: Record<string, unknown>): ProfileForm => ({
  name: String(user.name ?? ''),
  email: String(user.email ?? ''),
  phone: String(user.phone ?? ''),
  address: String(user.address ?? ''),
  district: String(user.district ?? ''),
})

const resolveAvatar = (value: unknown) => {
  if (typeof value !== 'string' || !value.trim()) return ''
  const normalized = value.trim()

  if (normalized.startsWith('http://') || normalized.startsWith('https://') || normalized.startsWith('/')) {
    return normalized
  }

  if (normalized.startsWith('assets/images/')) {
    return `http://localhost:8000/${normalized}`
  }

  if (normalized.startsWith('userProfile/')) {
    return `http://localhost:8000/assets/images/${normalized}`
  }

  return normalized
}

const avatarUrl = computed(() => {
  if (profileImagePreview.value) return profileImagePreview.value

  const user = backendUser.value
  return (
    resolveAvatar(user.image_url) ||
    resolveAvatar(user.image) ||
    resolveAvatar(authStore.user.image_url) ||
    resolveAvatar(authStore.user.image) ||
    '/images/profile3.jpg'
  )
})

const headerName = computed(() => profileForm.value.name || 'Customer')
const headerEmailOrPhone = computed(() => profileForm.value.email || profileForm.value.phone || '-')

const backendEntries = computed(() =>
  Object.entries(backendUser.value)
    .filter(([key]) => !['password', 'remember_token'].includes(key))
    .sort(([a], [b]) => a.localeCompare(b))
)

const formatValue = (value: unknown) => {
  if (value === null || value === undefined || value === '') return '-'
  if (typeof value === 'object') return JSON.stringify(value)
  return String(value)
}

const clearPreviewUrl = () => {
  if (profileImagePreview.value.startsWith('blob:')) {
    URL.revokeObjectURL(profileImagePreview.value)
  }
}

const applyProfileData = (user: Record<string, unknown>) => {
  backendUser.value = user
  const nextForm = mapUserToForm(user)
  profileForm.value = { ...nextForm }
  initialForm.value = { ...nextForm }

  profileImageFile.value = null
  profileImageName.value = ''
  clearPreviewUrl()
  profileImagePreview.value = ''
}

const onProfileImageChange = (event: Event) => {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]

  if (!file) {
    profileImageFile.value = null
    profileImageName.value = ''
    clearPreviewUrl()
    profileImagePreview.value = ''
    return
  }

  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp']
  if (!allowedTypes.includes(file.type)) {
    toast.error('Only JPG, JPEG, PNG, and WEBP files are allowed.')
    input.value = ''
    return
  }

  if (file.size > 2 * 1024 * 1024) {
    toast.error('Profile image must be 2MB or smaller.')
    input.value = ''
    return
  }

  clearPreviewUrl()
  profileImageFile.value = file
  profileImageName.value = file.name
  profileImagePreview.value = URL.createObjectURL(file)
}

const buildUpdatePayload = () => {
  const payload: Record<string, string | null | File> = {}
  const fields: Array<keyof ProfileForm> = ['name', 'email', 'phone', 'address', 'district']

  for (const key of fields) {
    const currentValue = profileForm.value[key].trim()
    const initialValue = initialForm.value[key].trim()

    if (currentValue !== initialValue) {
      payload[key] = currentValue || null
    }
  }

  if (profileImageFile.value) {
    payload.image = profileImageFile.value
  }

  return payload
}

const loadProfile = async () => {
  authStore.hydrateAuthFromStorage()

  if (!authStore.hasToken) {
    toast.error('Please login first.')
    await navigateTo('/login')
    return
  }

  try {
    const { user } = await authStore.fetchCurrentUser()
    applyProfileData(user as Record<string, unknown>)
  } catch (error: unknown) {
    const fallbackUser = authStore.user as Record<string, unknown>
    const hasFallbackData = Object.keys(fallbackUser).length > 0

    if (hasFallbackData) {
      applyProfileData(fallbackUser)
      toast.info('Live profile fetch failed. Showing cached profile data.')
      return
    }

    const message = error instanceof Error ? error.message : 'Failed to load profile.'
    toast.error(message)
  }
}

const handleUpdateProfile = async () => {
  const payload = buildUpdatePayload()
  if (Object.keys(payload).length === 0) {
    toast.info('No changes detected.')
    return
  }

  try {
    const { user, message } = await authStore.updateProfile(payload)
    applyProfileData(user as Record<string, unknown>)
    toast.success(message)
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to update profile.'
    toast.error(message)
  }
}

const handleLogout = async () => {
  try {
    const { expired, message } = await authStore.logout(false)
    if (expired) {
      toast.info(message)
    } else {
      toast.success(message)
    }
    await navigateTo('/login')
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Logout failed.'
    toast.error(message)
  }
}

onMounted(async () => {
  await loadProfile()
})

onUnmounted(() => {
  clearPreviewUrl()
})
</script>

<template>
  <div class="page-content">
    <div class="dz-bnr-inr" style="background-image: url('/images/background/bg1.jpg')">
      <div class="container">
        <div class="dz-bnr-inr-entry">
          <nav aria-label="breadcrumb" class="breadcrumb-row">
            <ul class="breadcrumb">
              <li class="breadcrumb-item"><NuxtLink to="/">Home</NuxtLink></li>
              <li class="breadcrumb-item">Account Profile</li>
            </ul>
          </nav>
        </div>
      </div>
    </div>

    <div class="content-inner-1">
      <div class="container">
        <section class="account-wrapper account-wrapper--full">
          <div class="account-card">
            <div class="profile-edit">
              <div class="avatar-upload d-flex align-items-center">
                <div class="position-relative">
                  <div class="avatar-preview thumb">
                    <div id="imagePreview" :style="{ backgroundImage: `url(${avatarUrl})` }"></div>
                  </div>
                  <div class="change-btn thumb-edit d-flex align-items-center flex-wrap">
                    <input
                      id="imageUpload"
                      type="file"
                      class="form-control d-none"
                      accept=".jpg,.jpeg,.png,.webp"
                      @change="onProfileImageChange"
                    >
                    <label for="imageUpload" class="btn btn-light ms-0"><i class="fa-solid fa-camera"></i></label>
                  </div>
                </div>
              </div>
              <div class="clearfix">
                <h2 class="title mb-0">{{ headerName }}</h2>
                <span class="text text-primary">{{ headerEmailOrPhone }}</span>
                <small class="d-block mt-1 text-muted">{{ profileImageName || 'Accepted: JPG, JPEG, PNG, WEBP (max 2MB)' }}</small>
              </div>
            </div>

            <form class="row" @submit.prevent="handleUpdateProfile">
              <div class="col-lg-6">
                <div class="form-group m-b25">
                  <label class="label-title">Name</label>
                  <input v-model="profileForm.name" type="text" class="form-control" placeholder="Full name">
                </div>
              </div>

              <div class="col-lg-6">
                <div class="form-group m-b25">
                  <label class="label-title">Email</label>
                  <input v-model="profileForm.email" type="email" class="form-control" placeholder="Email address">
                </div>
              </div>

              <div class="col-lg-6">
                <div class="form-group m-b25">
                  <label class="label-title">Phone</label>
                  <input v-model="profileForm.phone" type="text" class="form-control" placeholder="Phone number">
                </div>
              </div>

              <div class="col-lg-6">
                <div class="form-group m-b25">
                  <label class="label-title">District</label>
                  <input v-model="profileForm.district" type="text" class="form-control" placeholder="District">
                </div>
              </div>

              <div class="col-12">
                <div class="form-group m-b25">
                  <label class="label-title">Address</label>
                  <input v-model="profileForm.address" type="text" class="form-control" placeholder="Address">
                </div>
              </div>

              <div class="d-flex flex-wrap justify-content-between align-items-center gap-2">
                <button class="btn btn-primary" type="submit" :disabled="isUpdatingProfile || isLoadingProfile">
                  {{ isUpdatingProfile ? 'Updating...' : 'Update Profile' }}
                </button>
                <button
                  type="button"
                  class="btn btn-outline-danger btnhover"
                  :disabled="isLoggingOut"
                  @click="handleLogout"
                >
                  {{ isLoggingOut ? 'Logging out...' : 'Log Out' }}
                </button>
              </div>
            </form>
          </div>

          <!-- <div class="account-card mt-4">
            <div class="d-flex justify-content-between align-items-center mb-3">
              <h4 class="title mb-0">Backend Profile Data</h4>
              <button
                type="button"
                class="btn btn-sm btn-outline-secondary"
                :disabled="isLoadingProfile"
                @click="loadProfile"
              >
                {{ isLoadingProfile ? 'Refreshing...' : 'Refresh Data' }}
              </button>
            </div>

            <div v-if="backendEntries.length === 0" class="text-muted">
              No profile data found yet.
            </div>

            <div v-else class="backend-grid">
              <div v-for="[key, value] in backendEntries" :key="key" class="backend-item">
                <span class="backend-key">{{ key }}</span>
                <span class="backend-value">{{ formatValue(value) }}</span>
              </div>
            </div>
          </div> -->
        </section>
      </div>
    </div>
  </div>
</template>

<style scoped>
.account-wrapper--full {
  width: 100%;
}

.backend-grid {
  display: grid;
  gap: 12px;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
}

.backend-item {
  border: 1px solid #e6e6e6;
  border-radius: 10px;
  padding: 12px;
  background: #fff;
}

.backend-key {
  display: block;
  font-size: 12px;
  color: #666;
  text-transform: uppercase;
  margin-bottom: 4px;
}

.backend-value {
  word-break: break-word;
  color: #222;
}

.profile-edit .thumb-edit label {
  display: flex;
  align-items: center;
  justify-content: center;
  line-height: 1;
  padding: 0;
}

.profile-edit .thumb-edit label i {
  display: block;
  line-height: 1;
}
</style>
