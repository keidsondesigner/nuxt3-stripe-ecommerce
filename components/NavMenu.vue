<template>
  <nav class="bg-white shadow-md">
    <div class="container mx-auto px-4 py-3 flex items-center justify-between">
      <NuxtLink to="/" class="text-2xl font-bold">MODERN</NuxtLink>
      <ul class="flex space-x-6">
        <li><NuxtLink to="/new-arrivals" class="hover:text-gray-600">New Arrivals</NuxtLink></li>
        <li><NuxtLink to="/men" class="hover:text-gray-600">Men</NuxtLink></li>
        <li><NuxtLink to="/women" class="hover:text-gray-600">Women</NuxtLink></li>
        <li><NuxtLink to="/accessories" class="hover:text-gray-600">Accessories</NuxtLink></li>
      </ul>
      <div class="flex items-center space-x-4">
        <button aria-label="Search">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </button>
        <button aria-label="User account">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        </button>
        <NuxtLink to="/cart" class="relative">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          <span v-if="cartStore.totalItems > 0" class="absolute -top-2 -right-2 bg-black text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
            {{ cartStore.totalItems }}
          </span>
        </NuxtLink>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { useCartStore } from '~/stores/cartStore'

const cartStore = useCartStore()
</script>
