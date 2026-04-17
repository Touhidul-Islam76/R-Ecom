<template>
  <PageLoader />
  <div class="layout-wrapper">
    <SiteHeaderHome />
    <div class="layout-content">
      <slot />
    </div>
    <SiteFooterHome />
  </div>
</template>

<style scoped>
.layout-wrapper {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}
.layout-content {
  flex: 1 0 auto;
}
</style>
