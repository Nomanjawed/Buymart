'use client'

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react'

export type CartItem = {
  id: string
  name: string
  category: string
  image: string
  price: number
  quantity: number
}

type NewCartItem = Omit<CartItem, 'quantity'>

type CartContextValue = {
  items: CartItem[]
  itemCount: number
  subtotal: number
  isHydrated: boolean
  addItem: (item: NewCartItem) => void
  setQuantity: (id: string, quantity: number) => void
  removeItem: (id: string) => void
  clearCart: () => void
}

const CartContext = createContext<CartContextValue | null>(null)
const CART_STORAGE_KEY = 'buymart-cart'

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])
  const [isHydrated, setIsHydrated] = useState(false)

  useEffect(() => {
    function restoreCart() {
      try {
        const storedItems = window.localStorage.getItem(CART_STORAGE_KEY)
        const parsedItems: unknown = storedItems ? JSON.parse(storedItems) : []
        setItems(Array.isArray(parsedItems) ? parsedItems : [])
      } catch {
        setItems([])
      }

      setIsHydrated(true)
    }

    restoreCart()
  }, [])

  useEffect(() => {
    if (isHydrated) {
      window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items))
    }
  }, [isHydrated, items])

  function addItem(item: NewCartItem) {
    setItems((currentItems) => {
      const existingItem = currentItems.find((currentItem) => currentItem.id === item.id)

      if (existingItem) {
        return currentItems.map((currentItem) =>
          currentItem.id === item.id
            ? { ...currentItem, quantity: currentItem.quantity + 1 }
            : currentItem,
        )
      }

      return [...currentItems, { ...item, quantity: 1 }]
    })
  }

  function setQuantity(id: string, quantity: number) {
    if (quantity < 1) return

    setItems((currentItems) =>
      currentItems.map((item) => item.id === id ? { ...item, quantity } : item),
    )
  }

  function removeItem(id: string) {
    setItems((currentItems) => currentItems.filter((item) => item.id !== id))
  }

  function clearCart() {
    setItems([])
  }

  const itemCount = items.reduce((total, item) => total + item.quantity, 0)
  const subtotal = items.reduce((total, item) => total + item.price * item.quantity, 0)

  return (
    <CartContext.Provider value={{ items, itemCount, subtotal, isHydrated, addItem, setQuantity, removeItem, clearCart }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const cart = useContext(CartContext)

  if (!cart) {
    throw new Error('useCart must be used within CartProvider')
  }

  return cart
}