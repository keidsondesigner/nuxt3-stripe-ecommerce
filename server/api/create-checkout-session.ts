import Stripe from 'stripe'
import { defineEventHandler, readBody } from 'h3'
import { getFirestore, doc, getDoc } from 'firebase/firestore'
import { initializeApp } from 'firebase/app'

const config = useRuntimeConfig()
const stripe = new Stripe(config.stripeSecretKey, { apiVersion: '2024-10-28.acacia' })

// Inicialize o Firebase
const firebaseConfig = {
  apiKey: config.public.firebaseApiKey,
  authDomain: config.public.firebaseAuthDomain,
  projectId: config.public.firebaseProjectId,
  storageBucket: config.public.firebaseStorageBucket,
  messagingSenderId: config.public.firebaseMessagingSenderId,
  appId: config.public.firebaseAppId
}
const app = initializeApp(firebaseConfig)
const db = getFirestore(app)

export default defineEventHandler(async (event) => {
  console.log('Recebendo requisição de checkout...')
  const body = await readBody(event)
  const { token, items, totalAmount: clientTotalAmount } = body
  console.log('Token recebido:', token)
  console.log('Itens recebidos:', items)
  console.log('Valor total do cliente:', clientTotalAmount)

  try {
    let serverTotalAmount = 0
    console.log('Processando itens...')
    const lineItems = await Promise.all(items.map(async (item: { id: string; quantity: number }) => {
      const productRef = doc(db, 'products', item.id)
      const productSnap = await getDoc(productRef)
      
      if (!productSnap.exists()) {
        throw new Error(`Produto não encontrado: ${item.id}`)
      }
      
      const productData = productSnap.data()
      const amount = Math.round(productData.price * 100 * item.quantity)
      serverTotalAmount += amount
      
      console.log(`Produto processado: ${productData.name}, Quantidade: ${item.quantity}, Valor: ${amount}`)
      
      return {
        price_data: {
          currency: 'brl',
          product_data: {
            name: productData.name,
            images: [productData.image],
          },
          unit_amount: Math.round(productData.price * 100), // Stripe usa centavos
        },
        quantity: item.quantity,
      }
    }))

    console.log('Valor total calculado pelo servidor:', serverTotalAmount)
    console.log('Valor total enviado pelo cliente:', Math.round(clientTotalAmount * 100))

    // Verificar se o valor total calculado pelo servidor corresponde ao valor enviado pelo cliente
    // Permitimos uma pequena margem de erro (1 centavo) para lidar com possíveis diferenças de arredondamento
    if (Math.abs(serverTotalAmount - Math.round(clientTotalAmount * 100)) > 1) {
      throw new Error('Discrepância no valor total do pedido')
    }

    console.log('Criando cobrança no Stripe...')
    // Criar o pagamento usando o token do cartão
    const charge = await stripe.charges.create({
      amount: serverTotalAmount,
      currency: 'brl',
      source: token,
      description: 'Compra na loja Modern',
    })

    console.log('Cobrança criada com sucesso:', charge.id)

    // Se o pagamento for bem-sucedido, retorne os detalhes da transação
    return { 
      success: true, 
      transactionId: charge.id,
      amount: charge.amount / 100, // Converter de centavos para reais
      currency: charge.currency
    }
  } catch (error: unknown) {
    console.error('Erro ao processar pagamento:', error)
    if (error instanceof Error) {
      return { error: 'Erro ao processar pagamento', details: error.message }
    } else {
      return { error: 'Erro ao processar pagamento', details: 'Erro desconhecido' }
    }
  }
})
