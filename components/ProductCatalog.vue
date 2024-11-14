<template>
  <div class="container mx-auto px-4 py-8">
    <div v-if="loading" class="flex items-center justify-center h-64">
      <div class="w-8 h-8 border-4 border-blue-500 rounded-full animate-spin border-t-transparent"></div>
    </div>
    <div v-else-if="products.length === 0" class="text-center py-4">
      <p class="text-gray-600">Nenhum produto encontrado. Use o botão na página principal para adicionar produtos de exemplo.</p>
    </div>
    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
      <Card v-for="product in products" :key="product.id" class="overflow-hidden">
        <NuxtLink :to="`/product/${product.id}`" class="block">
          <CardHeader>
            <img :src="product.image" :alt="product.name" class="w-full h-64 object-cover rounded-t-lg">
          </CardHeader>
          <CardContent>
            <CardTitle>{{ product.name }}</CardTitle>
            <p class="text-gray-600 mb-4">{{ product.description }}</p>
            <div class="flex justify-between items-center mb-4">
              <span class="text-2xl font-bold">R$ {{ product.price.toFixed(2) }}</span>
            </div>
          </CardContent>
        </NuxtLink>
        <CardFooter>
          <div class="flex items-center space-x-2 mb-2">
            <Button variant="outline" size="sm" @click="decreaseQuantity(product)">-</Button>
            <span class="px-2">{{ product.quantity || 1 }}</span>
            <Button variant="outline" size="sm" @click="increaseQuantity(product)">+</Button>
          </div>
          <Button class="w-full" @click="addToCart(product)">
            Adicionar ao Carrinho
          </Button>
        </CardFooter>
      </Card>
    </div>
    <div class="mt-8 text-center">
      <Button @click="goToCart" v-if="cartStore.items.length > 0">
        Finalizar Compra
      </Button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { collection, getDocs } from 'firebase/firestore'
import { useCartStore } from '~/stores/cartStore'

interface Product {
  id: string
  name: string
  description: string
  price: number
  image: string
  quantity?: number
}

const { $db } = useNuxtApp()

const products = ref<Product[]>([])
const loading = ref(true)

const cartStore = useCartStore()

const fetchProducts = async () => {
  try {
    loading.value = true
    console.log('Iniciando busca de produtos...')
    
    if (!$db) {
      console.error('Firestore não está inicializado')
      return
    }

    const productsCollection = collection($db, 'products')
    const querySnapshot = await getDocs(productsCollection)
    
    const fetchedProducts: Product[] = []

    querySnapshot.forEach((doc) => {
      console.log('Documento:', doc.id, doc.data())
      const productData = doc.data() as Omit<Product, 'id'>
      fetchedProducts.push({
        id: doc.id,
        ...productData,
        quantity: 1
      })
    })

    console.log('Produtos buscados:', fetchedProducts)
    products.value = fetchedProducts
  } catch (error) {
    console.error('Erro ao buscar produtos:', error)
  } finally {
    loading.value = false
  }
}

const addToCart = (product: Product) => {
  console.log('Adicionando produto ao carrinho:', product)
  cartStore.addToCart({
    id: product.id,
    name: product.name,
    price: product.price,
    quantity: product.quantity || 1
  })
}

const increaseQuantity = (product: Product) => {
  if (product.quantity) {
    product.quantity++
  } else {
    product.quantity = 2
  }
}

const decreaseQuantity = (product: Product) => {
  if (product.quantity && product.quantity > 1) {
    product.quantity--
  }
}

const goToCart = () => {
  navigateTo('/cart')
}

onMounted(() => {
  console.log('ProductCatalog montado, chamando fetchProducts...')
  fetchProducts()
})

defineExpose({ fetchProducts })
</script>
