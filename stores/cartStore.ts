import { defineStore } from 'pinia'

export interface CartItem {
  id: string
  name: string
  price: number
  quantity: number
  image?: string
  size?: string
  color?: string
}

export const useCartStore = defineStore('cart', {
  state: (): { items: CartItem[] } => ({
    items: []
  }),
  getters: {
    totalItems: (state) => state.items.reduce((total, item) => total + item.quantity, 0),
    totalPrice: (state) => state.items.reduce((total, item) => total + item.price * item.quantity, 0)
  },
  actions: {
    addToCart(item: CartItem) {
      const existingItem = this.items.find(i => i.id === item.id)
      if (existingItem) {
        existingItem.quantity += item.quantity
      } else {
        this.items.push(item)
      }
      this.saveToLocalStorage()
    },
    removeFromCart(id: string) {
      const index = this.items.findIndex(item => item.id === id)
      if (index !== -1) {
        this.items.splice(index, 1)
        this.saveToLocalStorage()
      }
    },
    updateQuantity(id: string, quantity: number) {
      const item = this.items.find(i => i.id === id)
      if (item) {
        item.quantity = quantity
        if (item.quantity <= 0) {
          this.removeFromCart(id)
        } else {
          this.saveToLocalStorage()
        }
      }
    },
    clearCart() {
      this.items = []
      this.saveToLocalStorage()
    },
    saveToLocalStorage() {
      localStorage.setItem('cart', JSON.stringify(this.items))
    },
    loadFromLocalStorage() {
      const savedCart = localStorage.getItem('cart')
      if (savedCart) {
        this.items = JSON.parse(savedCart)
      }
    }
  }
})
