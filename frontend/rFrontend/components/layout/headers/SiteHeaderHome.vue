<script setup lang="ts">
withDefaults(
  defineProps<{
    popularProducts?: Array<Record<string, any>>
    cartItems?: Array<Record<string, any>>
    wishlistItems?: Array<Record<string, any>>
  }>(),
  {
    popularProducts: () => [],
    cartItems: () => [],
    wishlistItems: () => [],
  }
)
</script>

<template>
  <SiteHeaderMobileNuxt
    :popular-products="popularProducts"
    :sidebar-cart-items="cartItems"
    :wishlist-items="wishlistItems"
  />
</template>
