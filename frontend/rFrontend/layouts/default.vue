<template>
  <div class="page-wraper" id="scroll-container">
    <div id="loading-area" class="loading-page-1">
      <div class="text"><span class="text-primary">Plant</span>Zone</div>
    </div>

    <TheHeader />

    <div class="page-content">
      <slot />
    </div>

    <TheFooter :style="footerStyle" />

    <div class="scroltop-progress2"></div>
    <button class="scroltop" type="button"><i class="fas fa-arrow-up"></i></button>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'

const route = useRoute()
const footerStyle = computed(() => route.meta.footerStyle || '1')

onMounted(() => {
  if (typeof window !== 'undefined' && window.PlantZone) {
    window.PlantZone.init()
    window.PlantZone.load()
  }
})
</script>
