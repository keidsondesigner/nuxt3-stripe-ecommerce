<template>
  <div class="container mx-auto px-4 py-8">
    <h1 class="text-3xl font-bold mb-8">Checkout</h1>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
      <div class="order-summary">
        <h2 class="text-2xl font-semibold mb-4">Resumo do Pedido</h2>
        <div v-if="cart.items.length > 0">
          <div v-for="item in cart.items" :key="item.id" class="flex justify-between items-center mb-2">
            <span>{{ item.name }} x {{ item.quantity }}</span>
            <span>${{ (item.price * item.quantity).toFixed(2) }}</span>
          </div>
          <div class="border-t border-gray-200 mt-4 pt-4">
            <div class="flex justify-between items-center font-semibold">
              <span>Total</span>
              <span>${{ cart.totalPrice.toFixed(2) }}</span>
            </div>
          </div>
        </div>
        <div v-else>
          <p>Seu carrinho está vazio.</p>
        </div>
      </div>
      <div class="payment-details">
        <h2 class="text-2xl font-semibold mb-4">Detalhes do Pagamento</h2>
        <StripeCheckout />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useCartStore } from '~/stores/cartStore'
import StripeCheckout from '~/components/StripeCheckout.vue'

const cart = useCartStore()
</script>
