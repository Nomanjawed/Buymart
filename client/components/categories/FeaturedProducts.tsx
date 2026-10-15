'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import AddToCartButton from '@/components/cart/AddToCartButton'
import { getFeaturedProducts } from '@/utils/api'

type FeaturedProduct = {
  _id?: string
  id?: string
  name: string
  category: string
  image: string
  price: number
}

export default function FeaturedProducts() {
  const [products, setProducts] = useState<FeaturedProduct[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)

  useEffect(() => {
      let isActive = true

    getFeaturedProducts()
      .then((result: FeaturedProduct[]) => {
        if (isActive) setProducts(result)
      })
      .catch(() => {
        if (isActive) setHasError(true)
      })
      .finally(() => {
        if (isActive) setIsLoading(false)
      })

    return () => {
      isActive = false
    }
  }, [])

  if (isLoading) {
    return (
      <div
        role="status"
        aria-label="Loading featured products"
        className="my-4 -mx-5 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pt-3 pb-3 scrollbar-none md:justify-center md:gap-6 md:px-8"
      >
        {Array.from({ length: 5 }, (_, index) => (
          <div
            key={index}
            aria-hidden="true"
            className="relative aspect-square w-48 shrink-0 animate-pulse overflow-hidden rounded-lg bg-neutral-200 md:w-56"
          >
            <div className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-2 bg-linear-to-t from-black/70 via-black/45 to-transparent px-3 py-3 sm:px-4">
              <div className="h-4 w-2/3 rounded-sm bg-white/45" />
              <div className="size-10 shrink-0 rounded-full bg-white/70" />
            </div>
          </div>
        ))}
        <span className="sr-only">Loading featured products...</span>
      </div>
    )
  }

  if (hasError) {
    return <p role="alert" className="my-6 text-center text-sm text-red-700">Featured products could not be loaded.</p>
  }

  if (products.length === 0) {
    return <p className="my-6 text-center text-sm text-neutral-500">No featured products yet.</p>
  }

  return (
    <div className="my-4 -mx-5 flex snap-x md:justify-center snap-mandatory gap-4 overflow-x-auto px-4 pt-3 pb-3 scrollbar-none md:gap-6 md:px-8">
      {products.map((product, index) => (
        <article
          key={product._id ?? product.id ?? `${product.name}-${index}`}
          className="group relative aspect-square w-48 shrink-0 overflow-hidden rounded-lg bg-neutral-200 md:w-56"
        >
          <Image
            src={product.image || '/Hero.png'}
            alt=""
            fill
            unoptimized
            sizes="(max-width: 768px) 192px, 224px"
            className="object-cover transition-transform duration-300 group-hover:scale-105 group-focus-visible:scale-105"
          />
          <Link
            href={`/categories/${product._id ?? product.id ?? ''}`}
            aria-label={`View ${product.name}`}
            className="absolute inset-0 z-10 rounded-lg outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-white"
          />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 flex items-center justify-between gap-2 bg-linear-to-t from-black/85 via-black/65 to-black/20 px-3 py-3 opacity-100 transition-opacity duration-200 [@media(hover:hover)]:opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 sm:px-4">
            <span className="min-w-0 truncate text-left text-sm font-semibold text-white sm:text-base">
              {product.name}
            </span>
            <AddToCartButton
              product={{
                id: product._id ?? product.id ?? `${product.name}-${index}`,
                name: product.name,
                category: product.category,
                image: product.image || '/Hero.png',
                price: Number(product.price) || 0,
              }}
            />
          </div>
        </article>
      ))}
    </div>
  )
}
