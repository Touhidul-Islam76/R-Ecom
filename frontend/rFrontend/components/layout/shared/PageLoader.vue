<script setup lang="ts">
defineProps<{
  showLoader: boolean
}>()
</script>

<template>
  <div v-if="showLoader" id="loading-area" class="loading-page-1">
    <div class="text"><span class="text-primary">Fashion</span>Able</div>
  </div>
</template>

