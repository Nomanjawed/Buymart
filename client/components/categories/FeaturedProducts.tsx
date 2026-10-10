'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { getFeaturedProducts } from '@/utils/api'

type FeaturedProduct = {
  _id?: string
  id?: string
  name: string
  category: string
  image: string
}

function toCategorySlug(category: string) {
  return category.toLowerCase().trim().replace(/\s+/g, '-')
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
    return <p role="status" className="my-6 text-center text-sm text-neutral-500">Loading featured products...</p>
  }

  if (hasError) {
    return <p role="alert" className="my-6 text-center text-sm text-red-700">Featured products could not be loaded.</p>
  }

  if (products.length === 0) {
    return <p className="my-6 text-center text-sm text-neutral-500">No featured products yet.</p>
  }

  return (
    <div className="my-4 flex  justify-center items-center snap-x snap-mandatory gap-4 overflow-x-auto px-4 pt-3 pb-3 scrollbar-none md:gap-6 md:px-8">
      {products.map((product, index) => (
        <Link
          key={product._id ?? product.id ?? `${product.name}-${index}`}
          href={`/products/${toCategorySlug(product.category)}`}
          aria-label={`Browse ${product.name}, ${product.category}`}
          className="group relative aspect-square w-48 shrink-0 snap-start overflow-hidden rounded-lg bg-neutral-200 outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-offset-2 md:w-56"
        >
          <Image
            src={product.image || '/Hero.png'}
            alt=""
            fill
            unoptimized
            sizes="(max-width: 768px) 192px, 224px"
            className="object-cover transition-transform duration-300 group-hover:scale-105 group-focus-visible:scale-105"
          />
          <div className="absolute inset-0 flex items-end bg-linear-to-t from-black/75 via-black/10 to-transparent p-4 opacity-0 transition-opacity duration-200 group-hover:opacity-100 group-focus-visible:opacity-100">
            <span className="translate-y-2 text-left text-lg font-semibold text-white transition-transform duration-200 group-hover:translate-y-0 group-focus-visible:translate-y-0">
              {product.name}
            </span>
          </div>
        </Link>
      ))}
    </div>
  )
}
