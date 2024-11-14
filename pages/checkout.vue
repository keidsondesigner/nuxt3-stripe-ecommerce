<template>
  <div class="container mx-auto px-4 py-8">
    <h1 class="text-3xl font-bold mb-8">Checkout</h1>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
      <div class="order-summary">
        <h2 class="text-2xl font-semibold mb-4">Resumo do Pedido</h2>
        <div v-if="cartStore.items.length > 0">
          <div v-for="item in cartStore.items" :key="item.id" class="flex justify-between items-center mb-2">
            <span>{{ item.name }} × {{ item.quantity }}</span>
            <span>R$ {{ (item.price * item.quantity).toFixed(2) }}</span>
          </div>
          <div class="border-t border-gray-200 mt-4 pt-4">
            <div class="flex justify-between items-center mb-2">
              <span>Subtotal</span>
              <span>R$ {{ cartStore.totalPrice.toFixed(2) }}</span>
            </div>
            <div class="flex justify-between items-center mb-2">
              <span>Frete</span>
              <span>R$ {{ shippingCost.toFixed(2) }}</span>
            </div>
            <div class="flex justify-between items-center font-semibold text-lg mt-2 pt-2 border-t">
              <span>Total</span>
              <span>R$ {{ totalAmount.toFixed(2) }}</span>
            </div>
          </div>
        </div>
        <div v-else>
          <p>Seu carrinho está vazio.</p>
        </div>
      </div>
      <div class="payment-details">
        <h2 class="text-2xl font-semibold mb-4">Detalhes do Pagamento</h2>
        <StripeCheckout :totalAmount="totalAmount" />
        <p class="text-sm text-gray-500 mt-2">Frete grátis para pedidos acima de R$ 100</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useCartStore } from '~/stores/cartStore'
import StripeCheckout from '~/components/StripeCheckout.vue'

const cartStore = useCartStore()
const shippingCost = computed(() => cartStore.totalPrice >= 100 ? 0 : 10)
const totalAmount = computed(() => cartStore.totalPrice + shippingCost.value)
</script>
