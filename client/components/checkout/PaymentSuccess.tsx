'use client'

import { CheckCircle2, LoaderCircle } from 'lucide-react'
import Link from 'next/link'
import { useEffect, useEffectEvent, useState } from 'react'
import { useCart } from '@/components/cart/CartProvider'
import { confirmOrderPayment } from '@/utils/api'

type ConfirmedOrder = {
  orderNumber?: string
}

export default function PaymentSuccess({ sessionId }: { sessionId: string }) {
  const { clearCart } = useCart()
  const [order, setOrder] = useState<ConfirmedOrder | null>(null)
  const [error, setError] = useState('')
  const [isConfirming, setIsConfirming] = useState(true)
  const clearCartAfterConfirmation = useEffectEvent(() => clearCart())

  useEffect(() => {
    let isActive = true

    if (!sessionId) {
      return () => {
        isActive = false
      }
    }

    confirmOrderPayment(sessionId)
      .then((confirmedOrder: ConfirmedOrder) => {
        if (!isActive) return
        setOrder(confirmedOrder)
        clearCartAfterConfirmation()
      })
      .catch((requestError: unknown) => {
        if (!isActive) return
        setError(requestError instanceof Error ? requestError.message : 'We could not confirm your payment.')
      })
      .finally(() => {
        if (isActive) setIsConfirming(false)
      })

    return () => {
      isActive = false
    }
  }, [sessionId])

  return (
    <main className="flex min-h-[60vh] flex-1 items-center justify-center bg-[#faf9f6] px-5 py-12 text-[#202a26]">
      <section className="w-full max-w-xl border-t-2 border-[#243b33] bg-white px-6 py-10 text-center sm:px-10">
        {!sessionId ? (
          <>
            <h1 className="text-2xl font-semibold">Payment not confirmed</h1>
            <p role="alert" className="mt-3 text-sm text-[#a53b2b]">
              The payment session is missing, so the order could not be confirmed.
            </p>
            <Link href="/dashboard" className="mt-6 inline-flex h-11 items-center justify-center bg-[#243b33] px-5 text-sm font-semibold text-white hover:bg-[#365346]">
              View your account
            </Link>
          </>
        ) : isConfirming ? (
          <>
            <LoaderCircle size={36} className="mx-auto animate-spin text-[#52645a]" aria-hidden="true" />
            <h1 className="mt-5 text-2xl font-semibold">Confirming your payment</h1>
            <p role="status" className="mt-2 text-sm text-neutral-600">Please wait while we verify the order.</p>
          </>
        ) : order ? (
          <>
            <CheckCircle2 size={38} className="mx-auto text-emerald-700" aria-hidden="true" />
            <p className="mt-5 text-xs font-semibold uppercase tracking-[0.18em] text-[#78847b]">Payment confirmed</p>
            <h1 className="mt-2 text-3xl font-semibold">Thank you for your order</h1>
            {order.orderNumber && <p className="mt-3 text-sm text-neutral-600">Order {order.orderNumber}</p>}
            <p className="mt-2 text-sm text-neutral-600">Your order is being prepared.</p>
            <Link href="/dashboard" className="mt-7 inline-flex h-11 items-center justify-center bg-[#243b33] px-5 text-sm font-semibold text-white hover:bg-[#365346]">
              View your account
            </Link>
          </>
        ) : (
          <>
            <h1 className="text-2xl font-semibold">Payment not confirmed</h1>
            <p role="alert" className="mt-3 text-sm text-[#a53b2b]">{error}</p>
            <Link href="/dashboard" className="mt-6 inline-flex h-11 items-center justify-center bg-[#243b33] px-5 text-sm font-semibold text-white hover:bg-[#365346]">
              View your account
            </Link>
          </>
        )}
      </section>
    </main>
  )
}