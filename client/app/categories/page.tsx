'use client'

import Image from "next/image";
import Link from "next/link";
import { ArrowDown } from "lucide-react";
import AddToCartButton from "@/components/cart/AddToCartButton";
import { getAllProducts } from "@/utils/api";
import { useEffect, useState } from "react";

type ApiProduct = {
  _id?: string
  id?: string
  name: string
  description: string
  image: string
  category: string
  price: number
}

type CatalogProduct = Omit<ApiProduct, '_id'> & {
  id: string
  categorySlug: string
}

type Pagination = {
  page: number
  totalPages: number
  totalProducts: number
}

const currency = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
})

function toCategorySlug(category: string) {
  return category.toLowerCase().trim().replace(/\s+/g, '-')
}

export default function CategoriesPage() {
  const [products, setProducts] = useState<CatalogProduct[]>([])
  const [page, setPage] = useState(1)
  const [pagination, setPagination] = useState<Pagination>({ page: 1, totalPages: 1, totalProducts: 8 })
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let isCurrentRequest = true

    getAllProducts(page)
      .then((response) => {
        if (!isCurrentRequest) return

        const apiProducts: ApiProduct[] = Array.isArray(response?.products)
          ? response.products
          : []
        const loadedProducts = apiProducts.map((product, index) => ({
          id: product._id ?? product.id ?? `${product.name}-${index}`,
          name: product.name,
          description: product.description,
          image: product.image,
          category: product.category,
          categorySlug: toCategorySlug(product.category),
          price: Number(product.price),
        }))

        setProducts(loadedProducts)
        setPagination(response?.pagination ?? {
          page,
          totalPages: 1,
          totalProducts: loadedProducts.length,
        })
        setError('')
      })
      .catch(() => {
        if (isCurrentRequest) setError('Products could not be loaded. Please try again.')
      })
      .finally(() => {
        if (isCurrentRequest) setIsLoading(false)
      })

    return () => {
      isCurrentRequest = false
    }
  }, [page])

  function changePage(nextPage: number) {
    setError('')
    setIsLoading(true)
    setPage(nextPage)
  }

  return (
    <main className="bg-[#faf9f6] text-[#202a26]">
      <section className="relative mx-auto h-75 max-w-[1600px] overflow-hidden bg-[#283b35] sm:h-90 lg:h-105">
        <Image
          src="/Hero_section.jpg"
          alt="A selection of detailed 3D-printed designs"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-linear-to-r from-[#14231f]/85 via-[#14231f]/50 to-transparent" />
        <div className="relative flex h-full max-w-7xl flex-col justify-center px-6 text-white sm:px-10 lg:px-16">
          <p className="mb-4 text-md font-light font-bebas-neue uppercase tracking-[0.2em] text-red-800">
            The HOBBLY collection
          </p>
           
          <h1 className="max-w-xl text-4xl font-semibold font-poppins leading-tight sm:text-5xl lg:text-6xl">
            Little details. Lasting delight.
          </h1>
          <p className="mt-4 max-w-md text-sm leading-6 text-white/80 sm:text-base">
            Discover characterful 3D-printed pieces for your desk and shelf
          </p>
          <Link
            href="#products"
            className="mt-7 inline-flex w-fit items-center gap-2 text-sm font-semibold text-white transition-colors hover:text-[#e4c99f] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
          >
            Explore the collection <ArrowDown aria-hidden="true" size={16} />
          </Link>
        </div>
      </section>

      <section id="products" className="mx-auto max-w-7xl px-5 py-12 sm:px-8 sm:py-16 lg:px-12">
        <div className="mb-7 flex items-end justify-between gap-4 sm:mb-9">
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#78847b]">
              Made to be discovered
            </p>
            <h2 className="text-2xl font-poppins font-semibold sm:text-3xl">Shop Products</h2>
          </div>
          <span className="pb-1 text-sm text-[#78847b]">
            {pagination.totalProducts} {pagination.totalProducts === 1 ? 'piece' : 'pieces'}
          </span>
        </div>

        {error ? (
          <p role="alert" className="py-12 text-center text-sm text-red-700">{error}</p>
        ) : isLoading ? (
          <p role="status" className="py-12 text-center text-sm text-[#78847b]">Loading products...</p>
        ) : products.length === 0 ? (
          <p className="py-12 text-center text-sm text-[#78847b]">No products available yet.</p>
        ) : (
          <div className="grid grid-cols-2 gap-x-3 gap-y-6 sm:gap-x-5 sm:gap-y-8 lg:grid-cols-4">
            {products.map((product) => (
              <article key={product.id} className="group overflow-hidden rounded-sm bg-white ring-1 ring-black/5">
                <div className="relative aspect-4/5 overflow-hidden bg-[#e9e7e0]">
                  <Image
                    src={product.image || '/Hero.png'}
                    alt={product.name}
                    fill
                    unoptimized
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                    className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04] group-focus-visible:scale-[1.04]"
                  />
                  <Link
                    href={`/categories/${product.id}`}
                    aria-label={`View ${product.name}`}
                    className="absolute inset-0 z-10 rounded-sm outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#31493e]"
                  />
                  <div className="pointer-events-none absolute inset-0 z-20 flex items-end justify-between gap-3 bg-linear-to-t from-[#14231f]/85 via-[#14231f]/10 to-transparent p-3 opacity-100 transition-opacity duration-300 [@media(hover:hover)]:opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 sm:p-4">
                    <div className="translate-y-0 transition-transform duration-300 [@media(hover:hover)]:translate-y-2 group-hover:translate-y-0 group-focus-within:translate-y-0">
                      <p className="mb-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-white/70 sm:text-xs">
                        {product.category}
                      </p>
                      <h3 className="text-sm font-semibold text-white sm:text-lg">{product.name}</h3>
                    </div>
                    <AddToCartButton product={product} />
                  </div>
                </div>
                <div className="flex items-center justify-between gap-2 px-3 py-3 sm:px-4">
                  <span className="truncate text-xs text-[#78847b]">{product.category}</span>
                  <span className="shrink-0 text-sm font-semibold">{currency.format(product.price)}</span>
                </div>
              </article>
            ))}
          </div>
        )}

        {!error && pagination.totalPages > 1 && (
          <nav aria-label="Product pages" className="mt-8 flex items-center justify-center gap-4">
            <button
              type="button"
              aria-label="Previous page"
              disabled={page <= 1 || isLoading}
              onClick={() => changePage(page - 1)}
              className="inline-flex size-10 items-center justify-center rounded-full border border-neutral-300 transition hover:bg-neutral-100 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Previous
            </button>
            <span className="text-sm text-[#78847b]">Page {pagination.page} of {pagination.totalPages}</span>
            <button
              type="button"
              aria-label="Next page"
              disabled={page >= pagination.totalPages || isLoading}
              onClick={() => changePage(page + 1)}
              className="inline-flex size-10 items-center justify-center rounded-full border border-neutral-300 transition hover:bg-neutral-100 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Next
            </button>
          </nav>
        )}
      </section>
    </main>
  );
}