<template>
  <div class="stripe-checkout">
    <form @submit.prevent="handleSubmit">
      <div class="mb-4">
        <label for="card-element" class="block text-sm font-medium text-gray-700">Informações do Cartão</label>
        <div id="card-element" ref="cardElement" class="mt-1 p-3 border border-gray-300 rounded-md shadow-sm"></div>
      </div>
      <div class="mb-4">
        <label for="country" class="block text-sm font-medium text-gray-700">País</label>
        <select id="country" v-model="country" class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500">
          <option value="BR">Brasil</option>
        </select>
      </div>
      <button type="submit" class="w-full bg-black text-white py-2 px-4 rounded-md hover:bg-gray-800 transition-colors">
        Pagar Agora
      </button>
    </form>
  </div>
</template>

<script setup lang="ts">
import type { Stripe, StripeElements, StripeCardElement } from '@stripe/stripe-js'
import { useCartStore } from '~/stores/cartStore'

const { $stripe } = useNuxtApp()
const cart = useCartStore()

const country = ref('BR')
const cardElement = ref<HTMLElement | null>(null)
let elements: StripeElements | null = null
let card: StripeCardElement | null = null

onMounted(async () => {
  if (!$stripe) {
    console.error('Stripe não está inicializado')
    return
  }

  elements = $stripe.elements()
  card = elements.create('card')
  card.mount(cardElement.value as HTMLElement)
})

const handleSubmit = async () => {
  if (!$stripe || !elements || !card) {
    console.error('Stripe não está inicializado ou elementos não estão prontos')
    return
  }

  try {
    const { token, error } = await $stripe.createToken(card)

    if (error) {
      console.error('Erro ao criar token:', error)
      return
    }

    // Enviar o token e os itens do carrinho para o servidor
    const response = await fetch('/api/create-checkout-session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        token: token.id,
        items: cart.items,
      }),
    })

    const result = await response.json()

    if (result.error) {
      console.error('Erro ao processar pagamento:', result.error)
    } else {
      console.log('Pagamento processado com sucesso:', result)
      // Redirecionar para a página de sucesso ou limpar o carrinho
      cart.clearCart()
      navigateTo('/success')
    }
  } catch (error) {
    console.error('Erro ao processar pagamento:', error)
  }
}
</script>
