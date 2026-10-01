'use client'

import axios from 'axios'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft, CheckCircle2, LoaderCircle, LockKeyhole, ShoppingBag, Trash2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useCart } from '@/components/cart/CartProvider'
import { createOrder, getMe, logout } from '@/utils/api'

type PlacedOrder = {
  _id?: string
  id?: string
}

const currency = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
})

export default function CheckoutPage() {
  const router = useRouter()
  const { items, subtotal, isHydrated, clearCart, removeItem } = useCart()
  const [isCheckingAuth, setIsCheckingAuth] = useState(true)
  const [hasCustomerAccess, setHasCustomerAccess] = useState(false)
  const [isPlacingOrder, setIsPlacingOrder] = useState(false)
  const [order, setOrder] = useState<PlacedOrder | null>(null)
  const [error, setError] = useState('')
  const itemsWithInvalidIds = items.filter((item) => !/^[0-9a-f]{24}$/i.test(item.id))

  useEffect(() => {
    let isActive = true

    getMe()
      .then((profile: { role?: string }) => {
        if (!isActive) return

        if (profile.role === 'admin') {
          router.replace('/admin/dashboard')
          return
        }

        if (profile.role !== 'user') {
          setError('Checkout is available to customer accounts only.')
          return
        }

        setHasCustomerAccess(true)
      })
      .catch((requestError: unknown) => {
        if (!isActive) return

        if (axios.isAxiosError(requestError) && requestError.response?.status === 401) {
          logout()
          router.replace('/auth?returnTo=%2Fcheckout')
          return
        }

        setError('We could not verify your account. Please try again.')
      })
      .finally(() => {
        if (isActive) setIsCheckingAuth(false)
      })

    return () => {
      isActive = false
    }
  }, [router])

  async function handlePlaceOrder() {
    if (!hasCustomerAccess || items.length === 0 || isPlacingOrder) return

    setIsPlacingOrder(true)
    setError('')

    try {
      const result = await createOrder(items.map((item) => ({
        product: item.id,
        quantity: item.quantity,
      }))) as PlacedOrder

      setOrder(result)
      clearCart()
    } catch (requestError) {
      if (axios.isAxiosError(requestError) && requestError.response?.status === 401) {
        logout()
        router.replace('/auth?returnTo=%2Fcheckout')
        return
      }

      if (axios.isAxiosError(requestError) && requestError.response?.status === 403) {
        router.replace('/admin/dashboard')
        return
      }

      const message = axios.isAxiosError<{ message?: unknown }>(requestError)
        ? requestError.response?.data?.message
        : null
      setError(typeof message === 'string' ? message : 'Your order could not be placed. Please try again.')
    } finally {
      setIsPlacingOrder(false)
    }
  }

  if (isCheckingAuth || !isHydrated) {
    return (
      <main className="flex min-h-[60vh] flex-1 items-center justify-center bg-[#faf9f6] text-[#202a26]">
        <p role="status" className="flex items-center gap-2 text-sm text-[#78847b]">
          <LoaderCircle size={17} className="animate-spin" aria-hidden="true" /> Preparing checkout…
        </p>
      </main>
    )
  }

  if (!hasCustomerAccess) {
    return (
      <main className="flex min-h-[60vh] flex-1 items-center justify-center bg-[#faf9f6] px-5 text-[#202a26]">
        <section className="max-w-md text-center">
          <h1 className="text-2xl font-semibold">Checkout unavailable</h1>
          <p role="alert" className="mt-2 text-sm text-[#78847b]">
            {error || 'Checkout is available to customer accounts only.'}
          </p>
          <Link href="/dashboard" className="mt-5 inline-flex h-10 items-center justify-center bg-[#243b33] px-4 text-sm font-semibold text-white hover:bg-[#365346]">
            Return to account
          </Link>
        </section>
      </main>
    )
  }

  if (order) {
    return (
      <main className="flex flex-1 items-center justify-center bg-[#faf9f6] px-5 py-16 text-[#202a26]">
        <section className="w-full max-w-xl border-t-2 border-[#243b33] bg-white px-6 py-10 text-center sm:px-10">
          <CheckCircle2 size={38} className="mx-auto text-emerald-700" aria-hidden="true" />
          <p className="mt-5 text-xs font-semibold uppercase tracking-[0.18em] text-[#78847b]">Order confirmed</p>
          <h1 className="mt-2 text-3xl font-semibold">Thank you for your order</h1>
          {order._id && <p className="mt-3 text-sm text-neutral-600">Order #{order._id.slice(-8).toUpperCase()}</p>}
          <p className="mt-2 text-sm text-neutral-600">Your order has been received and is being prepared.</p>
          <Link href="/dashboard" className="mt-7 inline-flex h-11 items-center justify-center bg-[#243b33] px-5 text-sm font-semibold text-white hover:bg-[#365346]">
            View your account
          </Link>
        </section>
      </main>
    )
  }

  return (
    <main className="flex-1 bg-[#faf9f6] text-[#202a26]">
      <div className="mx-auto max-w-6xl px-5 py-10 sm:px-8 sm:py-14">
        <Link href="/cart" className="inline-flex items-center gap-2 text-sm font-medium text-[#52645a] hover:text-[#a53b2b]">
          <ArrowLeft size={16} aria-hidden="true" /> Back to cart
        </Link>

        <div className="mb-8 mt-6 border-b border-[#deded7] pb-6">
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#78847b]">Final step</p>
          <h1 className="text-3xl font-semibold sm:text-4xl">Review your order</h1>
        </div>

        {error && <p role="alert" className="mb-6 border-l-2 border-red-700 bg-white px-4 py-3 text-sm text-red-800">{error}</p>}
        {itemsWithInvalidIds.length > 0 && (
          <div role="alert" className="mb-6 border-l-2 border-[#a53b2b] bg-white px-4 py-4">
            <p className="text-sm font-semibold">Some cart items are outdated</p>
            <p className="mt-1 text-sm text-neutral-600">Remove these items, then add them again from the catalogue before placing your order.</p>
            <ul className="mt-3 divide-y divide-neutral-200">
              {itemsWithInvalidIds.map((item) => (
                <li key={item.id} className="flex items-center justify-between gap-4 py-2 text-sm">
                  <span className="truncate">{item.name}</span>
                  <button
                    type="button"
                    onClick={() => removeItem(item.id)}
                    className="inline-flex shrink-0 items-center gap-1 text-[#a53b2b] hover:underline"
                  >
                    <Trash2 size={14} aria-hidden="true" /> Remove
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}

        {items.length === 0 ? (
          <section className="py-12 text-center sm:py-16">
            <ShoppingBag size={34} className="mx-auto mb-4 text-[#78847b]" aria-hidden="true" />
            <h2 className="text-xl font-semibold">Your cart is empty</h2>
            <Link href="/categories" className="mt-5 inline-flex h-10 items-center bg-[#243b33] px-4 text-sm font-semibold text-white hover:bg-[#365346]">
              Browse products
            </Link>
          </section>
        ) : (
          <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_360px] lg:gap-14">
            <section aria-labelledby="review-items-heading" className="border-y border-[#deded7]">
              <h2 id="review-items-heading" className="sr-only">Items in your order</h2>
              {items.map((item) => (
                <article key={item.id} className="flex gap-4 border-b border-[#deded7] py-5 last:border-b-0 sm:gap-6">
                  <div className="relative size-20 shrink-0 overflow-hidden bg-[#e9e7e0] sm:size-24">
                    <Image src={item.image} alt={item.name} fill unoptimized sizes="96px" className="object-cover" />
                  </div>
                  <div className="flex min-w-0 flex-1 items-center justify-between gap-4">
                    <div className="min-w-0">
                      <p className="text-xs text-[#78847b]">{item.category}</p>
                      <h3 className="mt-1 truncate text-sm font-semibold">{item.name}</h3>
                      <p className="mt-1 text-xs text-neutral-500">Quantity {item.quantity}</p>
                    </div>
                    <p className="shrink-0 text-sm font-semibold">{currency.format(item.price * item.quantity)}</p>
                  </div>
                </article>
              ))}
            </section>

            <aside className="h-fit border-t-2 border-[#243b33] bg-white p-5 sm:p-6">
              <h2 className="text-lg font-semibold">Order summary</h2>
              <div className="mt-5 flex justify-between gap-4 text-sm">
                <span className="text-[#78847b]">Items ({items.reduce((count, item) => count + item.quantity, 0)})</span>
                <span className="font-semibold tabular-nums">{currency.format(subtotal)}</span>
              </div>
              <p className="mt-3 text-xs leading-5 text-[#78847b]">Final pricing is confirmed when your order is placed.</p>
              <button
                type="button"
                onClick={handlePlaceOrder}
                disabled={isPlacingOrder || itemsWithInvalidIds.length > 0}
                className="mt-6 inline-flex h-11 w-full items-center justify-center gap-2 bg-[#243b33] px-4 text-sm font-semibold text-white transition-colors hover:bg-[#365346] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#243b33] disabled:cursor-wait disabled:opacity-60"
              >
                {isPlacingOrder ? <LoaderCircle size={17} className="animate-spin" aria-hidden="true" /> : <LockKeyhole size={16} aria-hidden="true" />}
                {isPlacingOrder ? 'Placing order…' : 'Place order'}
              </button>
            </aside>
          </div>
        )}
      </div>
    </main>
  )
}