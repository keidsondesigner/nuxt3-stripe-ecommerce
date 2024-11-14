import { Firestore } from 'firebase/firestore'
import { Stripe } from '@stripe/stripe-js'

declare module '#app' {
  interface NuxtApp {
    $db: Firestore
    $stripe: Stripe | null
  }
}

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $db: Firestore
    $stripe: Stripe | null
  }
}

export {}
