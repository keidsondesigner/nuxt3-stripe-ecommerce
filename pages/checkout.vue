<template>
  <div class="container mx-auto px-4 py-8">
    <h1 class="text-3xl font-bold mb-8">Checkout</h1>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
      <div class="order-summary">
        <h2 class="text-2xl font-semibold mb-4">Order Summary</h2>
        <div v-if="cartStore.items.length > 0">
          <div v-for="item in cartStore.items" :key="item.id" class="flex justify-between items-center mb-2">
            <span>{{ item.name }} × {{ item.quantity }}</span>
            <span>${{ (item.price * item.quantity).toFixed(2) }}</span>
          </div>
          <div class="border-t border-gray-200 mt-4 pt-4">
            <div class="flex justify-between items-center mb-2">
              <span>Subtotal</span>
              <span>${{ cartStore.totalPrice.toFixed(2) }}</span>
            </div>
            <div class="flex justify-between items-center mb-2">
              <span>Shipping</span>
              <span>${{ shippingCost.toFixed(2) }}</span>
            </div>
            <div class="flex justify-between items-center font-semibold text-lg mt-2 pt-2 border-t">
              <span>Total</span>
              <span>${{ (cartStore.totalPrice + shippingCost).toFixed(2) }}</span>
            </div>
          </div>
        </div>
        <div v-else>
          <p>Your cart is empty.</p>
        </div>
      </div>
      <div class="payment-details">
        <h2 class="text-2xl font-semibold mb-4">Payment Details</h2>
        <form @submit.prevent="processPayment">
          <div class="mb-4">
            <label for="card-number" class="block text-sm font-medium text-gray-700">Card number</label>
            <input type="text" id="card-number" v-model="cardNumber" placeholder="4242 4242 4242 4242" class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500">
          </div>
          <div class="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label for="expiry-date" class="block text-sm font-medium text-gray-700">Expiry date</label>
              <input type="text" id="expiry-date" v-model="expiryDate" placeholder="MM / YY" class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500">
            </div>
            <div>
              <label for="security-code" class="block text-sm font-medium text-gray-700">Security code</label>
              <input type="text" id="security-code" v-model="securityCode" placeholder="123" class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500">
            </div>
          </div>
          <div class="mb-4">
            <label for="country" class="block text-sm font-medium text-gray-700">Country</label>
            <select id="country" v-model="country" class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500">
              <option value="BR">Brazil</option>
              <!-- Add more country options as needed -->
            </select>
          </div>
          <button type="submit" class="w-full bg-black text-white py-2 px-4 rounded-md hover:bg-gray-800 transition-colors">
            Pay Now
          </button>
        </form>
        <p class="text-sm text-gray-500 mt-2">Free shipping on orders over $100</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useCartStore } from '~/stores/cartStore'

const cartStore = useCartStore()
const shippingCost = computed(() => cartStore.totalPrice >= 100 ? 0 : 10)

const cardNumber = ref('')
const expiryDate = ref('')
const securityCode = ref('')
const country = ref('BR')

const processPayment = () => {
  // Implement payment processing logic here
  console.log('Processing payment...')
}
</script>
