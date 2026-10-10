'use client'

import { Check, ShoppingCart } from 'lucide-react'
import { useState } from 'react'
import { useCart, type CartItem } from '@/components/cart/CartProvider'

type AddToCartButtonProps = {
  product: Omit<CartItem, 'quantity'>
  showLabel?: boolean
}

export default function AddToCartButton({ product, showLabel = false }: AddToCartButtonProps) {
  const { addItem } = useCart()
  const [isAdded, setIsAdded] = useState(false)

  function handleAdd() {
    addItem(product)
    setIsAdded(true)
  }

  return (
    <button
      type="button"
      onClick={handleAdd}
      aria-label={isAdded ? `Added ${product.name} to cart` : `Add ${product.name} to cart`}
      title={isAdded ? 'Added to cart' : 'Add to cart'}
      className={`pointer-events-auto relative z-20 inline-flex h-10 shrink-0 items-center justify-center bg-white text-[#202a26] shadow-sm transition hover:bg-[#e4c99f] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2  focus-visible:ring-offset-[#243b33] ${showLabel ? 'gap-2 rounded-md px-3 text-xs font-semibold' : 'size-10 rounded-full'}`}
    >
      {isAdded ? <Check aria-hidden="true" size={17} /> : <ShoppingCart aria-hidden="true" size={17} />}
      {showLabel && <span>{isAdded ? 'Added' : 'Add to cart'}</span>}
    </button>
  )
}
