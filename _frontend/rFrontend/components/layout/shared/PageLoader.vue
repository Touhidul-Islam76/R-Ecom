<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref } from 'vue'

const localVisible = ref(true)
const visible = computed(() => localVisible.value)

let showTimer: ReturnType<typeof setTimeout> | null = null
let activeTimer: ReturnType<typeof setTimeout> | null = null
let hideTimer: ReturnType<typeof setTimeout> | null = null

const clearTimers = () => {
  if (showTimer) clearTimeout(showTimer)
  if (activeTimer) clearTimeout(activeTimer)
  if (hideTimer) clearTimeout(hideTimer)
}

const runLoaderCycle = () => {
  clearTimers()
  localVisible.value = true

  nextTick(() => {
    const loader = document.getElementById('loading-area')
    if (!loader) return

    loader.style.display = ''
    loader.classList.remove('show', 'active')

    showTimer = setTimeout(() => {
      loader.classList.add('show')
    }, 500)

    activeTimer = setTimeout(() => {
      loader.classList.add('active')
    }, 1500)

    hideTimer = setTimeout(() => {
      localVisible.value = false
    }, 3500)
  })
}

onMounted(() => {
  runLoaderCycle()
})

onBeforeUnmount(() => {
  clearTimers()
})
</script>

<template>
  <div v-if="visible" id="loading-area" class="loading-page-1">
    <div class="text"><span class="text-primary">Fashion</span>Able</div>
  </div>
</template>

<style scoped>
#loading-area {
  /* Failsafe: if any runtime script breaks, loader won't block the full page forever */
  animation: loader-failsafe-hide 0s linear 6s forwards;
}

@keyframes loader-failsafe-hide {
  to {
    opacity: 0;
    visibility: hidden;
    pointer-events: none;
  }
}
</style>
