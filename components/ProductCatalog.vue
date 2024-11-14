<template>
  <div class="product-catalog">
    <div v-if="loading" class="flex items-center justify-center h-64">
      <div class="w-8 h-8 border-4 border-blue-500 rounded-full animate-spin border-t-transparent"></div>
    </div>
    <div v-else-if="products.length === 0" class="text-center py-4">
      <p class="text-gray-600">No products found. Use the button on the main page to add sample products.</p>
    </div>
    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      <div v-for="product in products" :key="product.id" class="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <NuxtLink :to="`/product/${product.id}`" class="block">
          <img :src="product.image" :alt="product.name" class="w-full h-64 object-cover">
          <div class="p-4">
            <h3 class="text-lg font-semibold mb-2">{{ product.name }}</h3>
            <p class="text-gray-600 mb-4">{{ product.description }}</p>
            <div class="flex justify-between items-center">
              <span class="text-xl font-bold">${{ product.price.toFixed(2) }}</span>
            </div>
          </div>
        </NuxtLink>
        <div class="p-4 pt-0">
          <button @click="addToCart(product)" class="w-full bg-black text-white py-2 px-4 rounded hover:bg-gray-800 transition-colors">
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { collection, getDocs, Firestore } from 'firebase/firestore'
import { useCartStore } from '~/stores/cartStore'

interface Product {
  id: string
  name: string
  description: string
  price: number
  image: string
}

const nuxtApp = useNuxtApp()
const $db = nuxtApp.$db as Firestore

const products = ref<Product[]>([])
const loading = ref(true)

const cartStore = useCartStore()

const fetchProducts = async () => {
  try {
    loading.value = true
    const productsCollection = collection($db, 'products')
    const querySnapshot = await getDocs(productsCollection)
    
    const fetchedProducts: Product[] = []

    querySnapshot.forEach((doc) => {
      const productData = doc.data() as Omit<Product, 'id'>
      fetchedProducts.push({
        id: doc.id,
        ...productData
      })
    })

    products.value = fetchedProducts
  } catch (error) {
    console.error('Error fetching products:', error)
  } finally {
    loading.value = false
  }
}

const addToCart = (product: Product) => {
  cartStore.addToCart({
    id: product.id,
    name: product.name,
    price: product.price,
    quantity: 1
  })
}

onMounted(() => {
  fetchProducts()
})
</script>
