"use client"
import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft, Check, Minus, Plus, ShoppingCart } from 'lucide-react'
import { useParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useCart } from '@/components/cart/CartProvider'
import { getSingleProductById } from '@/utils/api'

type Product = {
  _id?: string
  id?: string
  name: string
  description: string
  price: number
  category: string
  image: string
}

const currency = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
})

export default function ProductPage() {
  const { id } = useParams<{ id: string }>()
  const { addItem } = useCart()
  const [product, setProduct] = useState<Product | null>(null)
  const [quantity, setQuantity] = useState(1)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [cartMessage, setCartMessage] = useState('')

  useEffect(() => {
    let isCurrentRequest = true

    getSingleProductById(id)
      .then((result: Product | null) => {
        if (!isCurrentRequest) return
        if (!result) {
          setError('This product could not be found.')
          return
        }
        setProduct(result)
        setError('')
      })
      .catch(() => {
        if (isCurrentRequest) setError('This product could not be loaded. Please try again.')
      })
      .finally(() => {
        if (isCurrentRequest) setIsLoading(false)
      })

    return () => {
      isCurrentRequest = false
    }
  }, [id])

  function handleAddToCart() {
    if (!product) return

    addItem({
      id: product._id ?? product.id ?? id,
      name: product.name,
      category: product.category,
      image: product.image || '/Hero.png',
      price: Number(product.price) || 0,
    }, quantity)
    setCartMessage(`${quantity} ${quantity === 1 ? 'item' : 'items'} added to your cart.`)
  }

  if (isLoading) {
    return (
      <main className="flex-1 bg-[#faf9f6] px-5 py-10 sm:px-8 sm:py-14">
        <div className="mx-auto grid max-w-6xl animate-pulse gap-8 lg:grid-cols-2 lg:gap-14">
          <div className="aspect-square bg-neutral-200" />
          <div className="space-y-5 py-4">
            <div className="h-4 w-24 bg-neutral-200" />
            <div className="h-10 w-3/4 bg-neutral-200" />
            <div className="h-8 w-28 bg-neutral-200" />
            <div className="h-24 w-full bg-neutral-200" />
          </div>
        </div>
      </main>
    )
  }

  if (error || !product) {
    return (
      <main className="flex min-h-[55vh] flex-1 flex-col items-center justify-center bg-[#faf9f6] px-5 text-center">
        <h1 className="text-2xl font-semibold">Product unavailable</h1>
        <p role="alert" className="mt-2 text-sm text-neutral-600">{error || 'This product could not be found.'}</p>
        <Link href="/categories" className="mt-5 inline-flex h-10 items-center gap-2 bg-[#243b33] px-4 text-sm font-semibold text-white hover:bg-[#365346]">
          <ArrowLeft size={16} aria-hidden="true" /> Back to products
        </Link>
      </main>
    )
  }

  return (
    <main className="flex-1 bg-[#faf9f6] px-5 py-8 text-[#202a26] sm:px-8 sm:py-12">
      <div className="mx-auto max-w-6xl">
        <Link href="/categories" className="inline-flex items-center gap-2 text-sm font-medium text-[#52645a] hover:text-[#a53b2b]">
          <ArrowLeft size={16} aria-hidden="true" /> All products
        </Link>

        <div className="mt-6 grid gap-8 lg:grid-cols-2 lg:items-start lg:gap-14">
          <div className="relative aspect-square overflow-hidden bg-[#e9e7e0]">
            <Image
              src={product.image || '/Hero.png'}
              alt={product.name}
              fill
              unoptimized
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
          </div>

          <section aria-labelledby="product-name" className="py-1 sm:py-4">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#a53b2b]">{product.category}</p>
            <h1 id="product-name" className="mt-3 text-3xl font-semibold leading-tight sm:text-4xl">
              {product.name}
            </h1>
            <p className="mt-5 text-2xl font-semibold">{currency.format(Number(product.price) || 0)}</p>

            <div className="mt-7 border-t border-[#deded7] pt-6">
              <h2 className="text-sm font-semibold">Description</h2>
              <p className="mt-2 whitespace-pre-line text-sm leading-6 text-neutral-600 sm:text-base sm:leading-7">
                {product.description}
              </p>
            </div>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <div className="inline-flex h-11 items-center border border-neutral-300 bg-white">
                <button
                  type="button"
                  aria-label="Decrease quantity"
                  disabled={quantity <= 1}
                  onClick={() => setQuantity((current) => Math.max(1, current - 1))}
                  className="flex size-10 items-center justify-center text-neutral-700 hover:bg-neutral-100 disabled:opacity-40"
                >
                  <Minus size={15} aria-hidden="true" />
                </button>
                <output aria-label={`Quantity ${quantity}`} className="w-10 text-center text-sm font-medium tabular-nums">
                  {quantity}
                </output>
                <button
                  type="button"
                  aria-label="Increase quantity"
                  disabled={quantity >= 99}
                  onClick={() => setQuantity((current) => Math.min(99, current + 1))}
                  className="flex size-10 items-center justify-center text-neutral-700 hover:bg-neutral-100 disabled:opacity-40"
                >
                  <Plus size={15} aria-hidden="true" />
                </button>
              </div>

              <button
                type="button"
                onClick={handleAddToCart}
                className="inline-flex h-11 flex-1 items-center justify-center gap-2 bg-[#243b33] px-5 text-sm font-semibold text-white transition hover:bg-[#365346] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#243b33] focus-visible:ring-offset-2 sm:flex-none"
              >
                {cartMessage ? <Check size={17} aria-hidden="true" /> : <ShoppingCart size={17} aria-hidden="true" />}
                Add to cart
              </button>
            </div>
            <p role="status" aria-live="polite" className="mt-3 min-h-5 text-sm text-emerald-800">{cartMessage}</p>
          </section>
        </div>
      </div>
    </main>
  )
}