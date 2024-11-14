<template>
  <div class="min-h-screen flex items-center justify-center">
    <Card class="w-full max-w-md shadow-lg rounded-lg">
      <CardHeader class="bg-green-50 rounded-t-lg">
        <CardTitle class="text-2xl font-bold text-center text-green-600">
          <Icon name="heroicons:check-circle" class="w-12 h-12 mx-auto mb-2" />
          Compra realizada com sucesso!
        </CardTitle>
        <CardDescription class="text-center text-gray-700">
          Obrigado por sua compra. Seu pedido foi processado com sucesso.
        </CardDescription>
      </CardHeader>
      <CardContent class="p-6">
        <div v-if="transactionDetails" class="space-y-4">
          <div class="flex justify-between items-center">
            <span class="font-semibold">Número do Pedido:</span>
            <span class="text-gray-800">{{ transactionDetails.transactionId }}</span>
          </div>
          <div class="flex justify-between items-center">
            <span class="font-semibold">Valor Total:</span>
            <span class="text-gray-800">R$ {{ transactionDetails.amount.toFixed(2) }}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter class="flex justify-center rounded-b-lg">
        <Button @click="goToHome" class="w-full bg-black text-white py-2 px-4 rounded hover:bg-gray-800 transition-colors">
          <ArrowLeftIcon class="w-5 h-5 mr-2" />
          Voltar para a loja
        </Button>
      </CardFooter>
    </Card>
  </div>
</template>

<script setup lang="ts">
import { Button, Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '#components'
import { ArrowLeftIcon } from '@heroicons/vue/solid'

interface TransactionDetails {
  transactionId: string;
  amount: number;
  currency: string;
}

const transactionDetails = ref<TransactionDetails | null>(null)

onMounted(() => {
  const route = useRoute()
  const transactionId = route.query.transactionId as string
  const amount = parseFloat(route.query.amount as string)
  const currency = route.query.currency as string

  if (transactionId && amount && currency) {
    transactionDetails.value = { transactionId, amount, currency }
  }
})

const goToHome = () => {
  navigateTo('/')
}
</script>
