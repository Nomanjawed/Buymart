'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { getFeaturedProducts } from '@/utils/api'

type Product = {
  _id: string
  name: string
  category: string
  image: string
}

function toCategorySlug(category: string) {
  return category.toLowerCase().trim().replace(/\s+/g, '-')
}

export default function FeaturedProducts() {
  const [products, setProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)

  useEffect(() => {
    let isActive = true

    getFeaturedProducts()
      .then((result: Product[]) => {
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
    return <p role="status" className="mt-8 mb-8 text-center text-sm text-neutral-500">Loading featured products…</p>
  }

  if (hasError) {
    return <p role="alert" className="mt-8 mb-8 text-center text-sm text-red-700">Featured products could not be loaded.</p>
  }

  if (products.length === 0) {
    return <p className="mt-8 mb-8 text-center text-sm text-neutral-500">No featured products yet.</p>
  }

  return (
    <div className="mt-8 mb-8 flex flex-wrap justify-center gap-5">
      {products.map((product) => (
        <Link
          key={product._id}
          href={`/products/${toCategorySlug(product.category)}`}
          className="group w-44 overflow-hidden rounded-lg border border-neutral-200 bg-white text-left transition-shadow hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-offset-2"
        >
          <div className="relative aspect-[4/3] overflow-hidden bg-neutral-100">
            <Image
              src={product.image || '/Hero.png'}
              alt={product.name}
              fill
              unoptimized
              sizes="176px"
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
          </div>
          <span className="block truncate px-4 pt-3 text-base font-semibold">
            {product.name}
          </span>
          <span className="block truncate px-4 pb-3 text-xs text-neutral-500">
            {product.category}
          </span>
        </Link>
      ))}
    </div>
  )
}