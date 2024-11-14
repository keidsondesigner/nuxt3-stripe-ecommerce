import { defineEventHandler } from 'h3'
import { initializeApp } from 'firebase/app'
import { getFirestore, collection, addDoc } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID
}

// console.log('Firebase config (add-sample-products):', firebaseConfig)

const app = initializeApp(firebaseConfig)
const db = getFirestore(app)

const sampleProducts = [
  { 
    name: 'Smartphone', 
    description: 'Último modelo de smartphone', 
    price: 999.99,
    image: 'https://images.pexels.com/photos/607812/pexels-photo-607812.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
  },
  { 
    name: 'Laptop', 
    description: 'Laptop potente para trabalho e jogos', 
    price: 1299.99,
    image: 'https://images.pexels.com/photos/18105/pexels-photo.jpg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
  },
  { 
    name: 'Fones de ouvido', 
    description: 'Fones de ouvido sem fio com cancelamento de ruído', 
    price: 199.99,
    image: 'https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
  },
  { 
    name: 'Smartwatch', 
    description: 'Relógio inteligente com monitor de saúde', 
    price: 249.99,
    image: 'https://images.pexels.com/photos/437037/pexels-photo-437037.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
  },
  { 
    name: 'Câmera digital', 
    description: 'Câmera de alta resolução para fotógrafos amadores', 
    price: 599.99,
    image: 'https://images.pexels.com/photos/51383/photo-camera-subject-photographer-51383.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
  }
]

export default defineEventHandler(async (event) => {
  try {
    console.log('Iniciando adição de produtos de exemplo...')
    const productsCollection = collection(db, 'products')
    const addedProducts = []

    for (const product of sampleProducts) {
      const docRef = await addDoc(productsCollection, product)
      console.log('Produto adicionado com ID:', docRef.id)
      addedProducts.push({ id: docRef.id, ...product })
    }

    console.log('Produtos adicionados:', addedProducts)
    return { message: 'Produtos de exemplo adicionados com sucesso!', products: addedProducts }
  } catch (error: unknown) {
    console.error('Erro ao adicionar produtos de exemplo:', error)
    if (error instanceof Error) {
      return { error: 'Falha ao adicionar produtos de exemplo', details: error.message }
    } else {
      return { error: 'Falha ao adicionar produtos de exemplo', details: 'Erro desconhecido' }
    }
  }
})
