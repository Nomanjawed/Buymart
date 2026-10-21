import Link from 'next/link'
import { ArrowLeft, CreditCard } from 'lucide-react'

export default function CancelPage() {
  return (
    <main className="flex min-h-[60vh] flex-1 items-center justify-center bg-[#faf9f6] px-5 py-12 text-[#202a26]">
      <section className="w-full max-w-xl border-t-2 border-[#d6b78b] bg-white px-6 py-10 text-center sm:px-10">
        <CreditCard size={34} className="mx-auto text-[#52645a]" aria-hidden="true" />
        <h1 className="mt-5 text-2xl font-semibold">Payment was cancelled</h1>
        <p className="mt-2 text-sm leading-6 text-neutral-600">
         You can return to checkout and try another payment method.
        </p>
        <Link href="/checkout" className="mt-7 inline-flex h-11 items-center justify-center gap-2 bg-[#243b33] px-5 text-sm font-semibold text-white hover:bg-[#365346]">
          <ArrowLeft size={16} aria-hidden="true" /> Return to checkout
        </Link>
      </section>
    </main>
  )
}