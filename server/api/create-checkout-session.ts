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
  const body = await readBody(event)
  const { items } = body

  try {
    const lineItems = await Promise.all(items.map(async (item: { id: string; quantity: number }) => {
      const productRef = doc(db, 'products', item.id)
      const productSnap = await getDoc(productRef)
      
      if (!productSnap.exists()) {
        throw new Error(`Produto não encontrado: ${item.id}`)
      }
      
      const productData = productSnap.data()
      
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

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: `${config.public.siteUrl}/success`,
      cancel_url: `${config.public.siteUrl}/cart`,
    })

    return { id: session.id }
  } catch (error) {
    console.error('Erro ao criar sessão de checkout:', error)
    return { error: 'Erro ao criar sessão de checkout' }
  }
})
