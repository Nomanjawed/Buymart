'use client'

import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft, Minus, Plus, ShoppingBag, Trash2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useCart } from '@/components/cart/CartProvider'
import { hasAuthToken } from '@/utils/api'

const currency = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
})

export default function CartPage() {
  const router = useRouter()
  const { items, itemCount, subtotal, setQuantity, removeItem } = useCart()

  function handleCheckout() {
    router.push(hasAuthToken() ? '/checkout' : '/auth?returnTo=%2Fcheckout')
  }

  return (
    <main className="flex-1 bg-[#faf9f6] text-[#202a26]">
      <div className="mx-auto max-w-6xl px-5 py-10 sm:px-8 sm:py-14">
        <div className="mb-8 border-b border-[#deded7] pb-6 sm:mb-10">
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#78847b]">Your selection</p>
          <div className="flex flex-wrap items-end justify-between gap-3">
            <h1 className="text-3xl font-semibold sm:text-4xl">Shopping cart</h1>
            <span className="text-sm text-[#78847b]">{itemCount} {itemCount === 1 ? 'item' : 'items'}</span>
          </div>
        </div>

        {items.length === 0 ? (
          <section className="py-12 text-center sm:py-20">
            <ShoppingBag aria-hidden="true" size={36} className="mx-auto mb-4 text-[#78847b]" />
            <h2 className="text-xl font-semibold">Your cart is empty</h2>
            <p className="mt-2 text-sm text-[#78847b]">Find something special for your collection.</p>
            <Link
              href="/categories"
              className="mt-6 inline-flex h-10 items-center gap-2 rounded-sm bg-[#243b33] px-4 text-sm font-semibold text-white transition-colors hover:bg-[#365346] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#243b33]"
            >
              <ArrowLeft aria-hidden="true" size={16} />
              Continue shopping
            </Link>
          </section>
        ) : (
          <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_320px] lg:gap-14">
            <section aria-label="Cart items" className="divide-y divide-[#deded7] border-y border-[#deded7]">
              {items.map((item) => (
                <article key={item.id} className="flex gap-4 py-5 sm:gap-6">
                  <div className="relative aspect-square size-24 shrink-0 overflow-hidden bg-[#e9e7e0] sm:size-32">
                    <Image src={item.image} alt={item.name} fill unoptimized sizes="128px" className="object-cover" />
                  </div>
                  <div className="flex min-w-0 flex-1 flex-col justify-between gap-3 sm:flex-row sm:items-center">
                    <div className="min-w-0">
                      <p className="mb-1 text-xs text-[#78847b]">{item.category}</p>
                      <h2 className="truncate font-semibold">{item.name}</h2>
                      <p className="mt-1 text-sm">{currency.format(item.price)}</p>
                    </div>
                    <div className="flex items-center justify-between gap-4 sm:justify-end">
                      <div className="inline-flex h-9 items-center border border-[#deded7]">
                        <button
                          type="button"
                          onClick={() => setQuantity(item.id, item.quantity - 1)}
                          disabled={item.quantity <= 1}
                          aria-label={`Decrease ${item.name} quantity`}
                          className="flex size-9 items-center justify-center text-[#52645a] hover:bg-[#f0f0eb] disabled:cursor-not-allowed disabled:opacity-40"
                        >
                          <Minus aria-hidden="true" size={14} />
                        </button>
                        <span aria-label={`Quantity ${item.quantity}`} className="w-8 text-center text-sm tabular-nums">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => setQuantity(item.id, item.quantity + 1)}
                          aria-label={`Increase ${item.name} quantity`}
                          className="flex size-9 items-center justify-center text-[#52645a] hover:bg-[#f0f0eb]"
                        >
                          <Plus aria-hidden="true" size={14} />
                        </button>
                      </div>
                      <span className="w-20 text-right text-sm font-semibold tabular-nums">
                        {currency.format(item.price * item.quantity)}
                      </span>
                      <button
                        type="button"
                        onClick={() => removeItem(item.id)}
                        aria-label={`Remove ${item.name} from cart`}
                        className="flex size-9 items-center justify-center text-[#78847b] hover:text-[#a53b2b] focus-visible:outline-2 focus-visible:outline-[#a53b2b]"
                      >
                        <Trash2 aria-hidden="true" size={17} />
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </section>

            <aside className="h-fit border-t-2 border-[#243b33] bg-white p-5 sm:p-6">
              <h2 className="text-lg font-semibold">Order summary</h2>
              <div className="mt-5 flex justify-between gap-4 text-sm">
                <span className="text-[#78847b]">Subtotal</span>
                <span className="font-semibold tabular-nums">{currency.format(subtotal)}</span>
              </div>
              <p className="mt-3 text-xs leading-5 text-[#78847b]">Shipping and taxes are calculated at checkout.</p>
              <button
                type="button"
                onClick={handleCheckout}
                className="mt-6 h-11 w-full rounded-sm bg-[#243b33] px-4 text-sm font-semibold text-white transition-colors hover:bg-[#365346] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#243b33]"
              >
                Checkout
              </button>
              <Link href="/categories" className="mt-4 block text-center text-sm font-medium text-[#52645a] hover:text-[#a53b2b]">
                Continue shopping
              </Link>
            </aside>
          </div>
        )}
      </div>
    </main>
  )
}
