<template>
  <div v-if="product" class="product-details">
    <div class="product-image">
      <img :src="product.image" :alt="product.name" />
    </div>
    <div class="product-info">
      <h1>{{ product.name }}</h1>
      <p class="price">R$ {{ product.price.toFixed(2) }}</p>
      <div class="size-selection">
        <p>Size</p>
        <div class="size-buttons">
          <button v-for="size in ['XS', 'S', 'M', 'L', 'XL', 'XXL']" :key="size" class="size-button">
            {{ size }}
          </button>
        </div>
      </div>
      <div class="color-selection">
        <p>Color</p>
        <div class="color-buttons">
          <button v-for="color in ['black', 'white', 'blue', 'gray', 'beige']" :key="color" class="color-button" :style="{ backgroundColor: color }"></button>
        </div>
      </div>
      <div class="quantity">
        <p>Quantity</p>
        <div class="quantity-selector">
          <button @click="decreaseQuantity">-</button>
          <span>{{ quantity }}</span>
          <button @click="increaseQuantity">+</button>
        </div>
      </div>
      <button class="add-to-cart" @click="addToCart">Add to Cart</button>
      <div class="description">
        <h2>Description</h2>
        <p>{{ product.description }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { getFirestore, doc, getDoc } from 'firebase/firestore'
import { useCartStore } from '~/stores/cartStore'

const route = useRoute()
const product = ref(null)
const quantity = ref(1)
const cartStore = useCartStore()

const decreaseQuantity = () => {
  if (quantity.value > 1) quantity.value--
}

const increaseQuantity = () => {
  quantity.value++
}

const addToCart = () => {
  if (product.value) {
    cartStore.addToCart({
      id: product.value.id,
      name: product.value.name,
      price: product.value.price,
      quantity: quantity.value
    })
  }
}

onMounted(async () => {
  const db = getFirestore()
  const productDoc = await getDoc(doc(db, 'products', route.params.id))
  if (productDoc.exists()) {
    product.value = { id: productDoc.id, ...productDoc.data() }
  }
})
</script>

<style scoped>
.product-details {
  display: flex;
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.product-image {
  flex: 1;
}

.product-image img {
  width: 100%;
  height: auto;
}

.product-info {
  flex: 1;
  padding-left: 40px;
}

h1 {
  font-size: 24px;
  margin-bottom: 10px;
}

.price {
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 20px;
}

.size-selection, .color-selection, .quantity {
  margin-bottom: 20px;
}

.size-buttons, .color-buttons {
  display: flex;
  gap: 10px;
}

.size-button, .color-button {
  width: 40px;
  height: 40px;
  border: 1px solid #ccc;
  background-color: #fff;
  cursor: pointer;
}

.color-button {
  border-radius: 50%;
}

.quantity-selector {
  display: flex;
  align-items: center;
  gap: 10px;
}

.quantity-selector button {
  width: 30px;
  height: 30px;
  background-color: #f0f0f0;
  border: none;
  cursor: pointer;
}

.add-to-cart {
  width: 100%;
  padding: 10px;
  background-color: #000;
  color: #fff;
  border: none;
  cursor: pointer;
  margin-bottom: 20px;
}

.description h2 {
  font-size: 18px;
  margin-bottom: 10px;
}
</style>
