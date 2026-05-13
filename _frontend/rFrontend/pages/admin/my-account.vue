<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { useAuthStore } from '~/stores/authStore'
import { useToast } from '~/composables/useToast'

definePageMeta({ layout: 'admin' })
useHead({ title: 'My Account | FasionAble Admin' })

type ProfileForm = {
  name: string
  email: string
  phone: string
  district: string
  address: string
}

type ProfileUpdatePayload = {
  name?: string | null
  email?: string | null
  phone?: string | null
  district?: string | null
  address?: string | null
  image?: File | null
}

const toast = useToast()
const authStore = useAuthStore()

const backendUser = ref<Record<string, unknown>>({})
const profileForm = ref<ProfileForm>({
  name: '',
  email: '',
  phone: '',
  district: '',
  address: '',
})
const initialForm = ref<ProfileForm>({
  name: '',
  email: '',
  phone: '',
  district: '',
  address: '',
})
const profileImageFile = ref<File | null>(null)
const profileImagePreview = ref('')
const profileImageName = ref('')

const isLoadingProfile = computed(() => authStore.isLoadingProfile)
const isUpdatingProfile = computed(() => authStore.isUpdatingProfile)
const backendOrigin = 'http://localhost:8000'

const mapUserToForm = (user: Record<string, unknown>): ProfileForm => ({
  name: String(user.name ?? ''),
  email: String(user.email ?? ''),
  phone: String(user.phone ?? ''),
  district: String(user.district ?? ''),
  address: String(user.address ?? ''),
})

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

const avatarUrl = computed(
  () =>
    profileImagePreview.value ||
    resolveAvatar(backendUser.value.image_url) ||
    resolveAvatar(backendUser.value.image) ||
    resolveAvatar(authStore.user.image_url) ||
    resolveAvatar(authStore.user.image) ||
    '/velonic/images/users/avatar-1.jpg',
)

const headerName = computed(() => profileForm.value.name || 'Admin')
const headerRole = computed(() => String(backendUser.value.role ?? authStore.user.role ?? 'admin'))

const backendEntries = computed(() =>
  Object.entries(backendUser.value)
    .filter(([key]) => !['password', 'remember_token', 'otp'].includes(key))
    .sort(([a], [b]) => a.localeCompare(b)),
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
  const mapped = mapUserToForm(user)
  profileForm.value = { ...mapped }
  initialForm.value = { ...mapped }

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

const buildUpdatePayload = (): ProfileUpdatePayload => {
  const payload: ProfileUpdatePayload = {}
  const fields: Array<keyof ProfileForm> = ['name', 'email', 'phone', 'district', 'address']

  for (const field of fields) {
    const currentValue = profileForm.value[field].trim()
    const initialValue = initialForm.value[field].trim()
    if (currentValue !== initialValue) {
      payload[field] = currentValue || null
    }
  }

  if (profileImageFile.value) {
    payload.image = profileImageFile.value
  }

  return payload
}

const resetChanges = () => {
  profileForm.value = { ...initialForm.value }
  profileImageFile.value = null
  profileImageName.value = ''
  clearPreviewUrl()
  profileImagePreview.value = ''
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
    const fallback = authStore.user as Record<string, unknown>
    if (Object.keys(fallback).length) {
      applyProfileData(fallback)
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

onMounted(async () => {
  await loadProfile()
})

onUnmounted(() => {
  clearPreviewUrl()
})
</script>

<template>
  <div class="row">
    <div class="col-12">
      <div class="page-title-box">
        <div class="page-title-right">
          <ol class="breadcrumb m-0">
            <li class="breadcrumb-item"><NuxtLink to="/admin">Admin</NuxtLink></li>
            <li class="breadcrumb-item active">My Account</li>
          </ol>
        </div>
        <h4 class="page-title">My Account</h4>
      </div>
    </div>
  </div>

  <div class="row g-3">
    <div class="col-xl-4">
      <div class="card h-100">
        <div class="card-body text-center">
          <div class="admin-avatar-wrap mx-auto mb-3">
            <img :src="avatarUrl" alt="Admin Avatar" class="admin-avatar rounded-circle" />
            <label class="avatar-edit-btn" for="admin-profile-image">
              <i class="ri-camera-line"></i>
            </label>
            <input
              id="admin-profile-image"
              type="file"
              class="d-none"
              accept=".jpg,.jpeg,.png,.webp"
              @change="onProfileImageChange"
            />
          </div>

          <h4 class="mb-1">{{ headerName }}</h4>
          <p class="text-muted text-capitalize mb-2">{{ headerRole }}</p>
          <small class="text-muted d-block mb-3">
            {{ profileImageName || 'Accepted: JPG, JPEG, PNG, WEBP (max 2MB)' }}
          </small>

          <button type="button" class="btn btn-light btn-sm" :disabled="isLoadingProfile" @click="loadProfile">
            {{ isLoadingProfile ? 'Refreshing...' : 'Refresh Profile' }}
          </button>
        </div>
      </div>
    </div>

    <div class="col-xl-8">
      <div class="card">
        <div class="card-body">
          <h5 class="header-title mb-3">Update Profile</h5>

          <form class="row g-3" @submit.prevent="handleUpdateProfile">
            <div class="col-md-6">
              <label class="form-label">Name</label>
              <input v-model="profileForm.name" type="text" class="form-control" placeholder="Full name" />
            </div>

            <div class="col-md-6">
              <label class="form-label">Email</label>
              <input v-model="profileForm.email" type="email" class="form-control" placeholder="Email address" />
            </div>

            <div class="col-md-6">
              <label class="form-label">Phone</label>
              <input v-model="profileForm.phone" type="text" class="form-control" placeholder="Phone number" />
            </div>

            <div class="col-md-6">
              <label class="form-label">District</label>
              <input v-model="profileForm.district" type="text" class="form-control" placeholder="District" />
            </div>

            <div class="col-12">
              <label class="form-label">Address</label>
              <input v-model="profileForm.address" type="text" class="form-control" placeholder="Address" />
            </div>

            <div class="col-12 d-flex flex-wrap justify-content-end gap-2">
              <button type="button" class="btn btn-light" :disabled="isUpdatingProfile" @click="resetChanges">
                Reset
              </button>
              <button type="submit" class="btn btn-primary" :disabled="isUpdatingProfile || isLoadingProfile">
                {{ isUpdatingProfile ? 'Updating...' : 'Save Changes' }}
              </button>
            </div>
          </form>
        </div>
      </div>

      <!-- <div class="card">
        <div class="card-body">
          <h5 class="header-title mb-3">Backend Profile Data</h5>

          <div v-if="backendEntries.length === 0" class="text-muted">No profile data found.</div>

          <div v-else class="backend-grid">
            <div v-for="[key, value] in backendEntries" :key="key" class="backend-item">
              <span class="backend-key">{{ key }}</span>
              <span class="backend-value">{{ formatValue(value) }}</span>
            </div>
          </div>
        </div>
      </div> -->
    </div>
  </div>
</template>

<style scoped>
.page-title {
  background: transparent !important;
}

.admin-avatar-wrap {
  position: relative;
  width: 120px;
  height: 120px;
}

.admin-avatar {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border: 2px solid #e9ecef;
}

.avatar-edit-btn {
  position: absolute;
  right: 2px;
  bottom: 2px;
  width: 34px;
  height: 34px;
  border-radius: 50%;
  border: 1px solid #e5e7eb;
  background: #ffffff;
  color: #344054;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.backend-grid {
  display: grid;
  gap: 10px;
  grid-template-columns: repeat(auto-fit, minmax(210px, 1fr));
}

.backend-item {
  border: 1px solid #eceff3;
  border-radius: 10px;
  padding: 10px 12px;
  background: #fff;
}

.backend-key {
  display: block;
  font-size: 11px;
  text-transform: uppercase;
  color: #6b7280;
  margin-bottom: 4px;
}

.backend-value {
  color: #111827;
  word-break: break-word;
}
</style>
