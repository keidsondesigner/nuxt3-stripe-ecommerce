import { loadStripe } from '@stripe/stripe-js'
import type { Stripe } from '@stripe/stripe-js'

export default defineNuxtPlugin(async (nuxtApp) => {
  const config = useRuntimeConfig()
  const stripePublishableKey = config.public.stripePublishableKey

  if (typeof stripePublishableKey !== 'string') {
    console.error('Stripe publishable key is not set or is not a string')
    return {
      provide: {
        stripe: null as Stripe | null
      }
    }
  }

  const stripe = await loadStripe(stripePublishableKey)

  return {
    provide: {
      stripe: stripe as Stripe | null
    }
  }
})
