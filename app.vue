<template>
  <div class="bg-white text-black">
    <NavMenu />
    <NuxtPage />
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useCartStore } from '~/stores/cartStore'

const cartStore = useCartStore()

onMounted(() => {
  cartStore.loadFromLocalStorage()
})
</script>

<style>
body {
  background-color: white;
  color: black;
}
</style>
