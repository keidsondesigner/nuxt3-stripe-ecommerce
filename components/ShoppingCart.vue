<template>
  <div class="shopping-cart">
    <h1 class="text-3xl font-bold mb-8">Carrinho de Compras</h1>
    <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
      <div class="col-span-2">
        <div v-if="cartStore.items.length === 0" class="text-gray-500">
          Seu carrinho está vazio.
        </div>
        <div v-else>
          <div v-for="item in cartStore.items" :key="item.id" class="flex items-center justify-between border-b py-4">
            <div class="flex items-center">
              <img :src="item.image || ''" :alt="item.name" class="w-16 h-16 object-cover mr-4">
              <div>
                <h3 class="font-semibold">{{ item.name }}</h3>
                <p class="text-sm text-gray-500">Tamanho: {{ item.size || 'N/A' }} | Cor: {{ item.color || 'N/A' }}</p>
              </div>
            </div>
            <div class="flex items-center">
              <div class="flex items-center mr-4">
                <button @click="decreaseQuantity(item)" class="px-2 py-1 border rounded-l">-</button>
                <span class="px-4 py-1 border-t border-b">{{ item.quantity }}</span>
                <button @click="increaseQuantity(item)" class="px-2 py-1 border rounded-r">+</button>
              </div>
              <span class="mr-4">R$ {{ (item.price * item.quantity).toFixed(2) }}</span>
              <button @click="removeItem(item)" class="text-red-500">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
      <div class="col-span-1">
        <div class="bg-gray-100 p-4 rounded">
          <h2 class="text-xl font-semibold mb-4">Resumo do Pedido</h2>
          <div class="flex justify-between mb-2">
            <span>Subtotal</span>
            <span>R$ {{ cartStore.totalPrice.toFixed(2) }}</span>
          </div>
          <div class="flex justify-between mb-2">
            <span>Frete</span>
            <span>R$ {{ shippingCost.toFixed(2) }}</span>
          </div>
          <div class="flex justify-between font-semibold text-lg mt-4 pt-4 border-t">
            <span>Total</span>
            <span>R$ {{ (cartStore.totalPrice + shippingCost).toFixed(2) }}</span>
          </div>
          <button @click="proceedToCheckout" class="w-full bg-black text-white py-2 px-4 rounded mt-4 hover:bg-gray-800">
            Finalizar Compra
          </button>
          <p class="text-sm text-gray-500 mt-2">Frete grátis para pedidos acima de R$ 100</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useCartStore } from '~/stores/cartStore'
import type { CartItem } from '~/stores/cartStore'
import { computed } from 'vue'

const cartStore = useCartStore()
const shippingCost = computed(() => cartStore.totalPrice >= 100 ? 0 : 10)

const decreaseQuantity = (item: CartItem) => {
  cartStore.updateQuantity(item.id, item.quantity - 1)
}

const increaseQuantity = (item: CartItem) => {
  cartStore.updateQuantity(item.id, item.quantity + 1)
}

const removeItem = (item: CartItem) => {
  cartStore.removeFromCart(item.id)
}

const proceedToCheckout = () => {
  navigateTo('/checkout')
}
</script>
