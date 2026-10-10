'use client'

import axios from 'axios'
import { CalendarDays, LogOut, Mail, Package, UserRound } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { getMe, getMyOrders, logout } from '@/utils/api'

type UserProfile = {
  _id?: string
  fullname?: string
  username?: string
  email?: string
  createdAt?: string
  role?: string
}

type OrderItem = {
  _id?: string
  quantity: number
  product?: {
    name?: string
    category?: string
  } | null
}

type CustomerOrder = {
  _id: string
  createdAt?: string
  products: OrderItem[]
}

function formatDate(value?: string) {
  if (!value) return 'Date unavailable'

  const date = new Date(value)
  return Number.isNaN(date.getTime())
    ? 'Date unavailable'
    : new Intl.DateTimeFormat('en', { dateStyle: 'medium' }).format(date)
}

export default function DashboardPage() {
  const router = useRouter()
  const [user, setUser] = useState<UserProfile | null>(null)
  const [orders, setOrders] = useState<CustomerOrder[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [pageError, setPageError] = useState('')
  const [ordersError, setOrdersError] = useState('')

  useEffect(() => {
    let isActive = true

    async function loadDashboard() {
      const [profileResult, ordersResult] = await Promise.allSettled([
        getMe(),
        getMyOrders(),
      ])

      if (!isActive) return

      if (profileResult.status === 'rejected') {
        if (axios.isAxiosError(profileResult.reason) && profileResult.reason.response?.status === 401) {
          router.replace('/auth')
          return
        }
        setPageError('We could not load your account details. Please try again.')
        setIsLoading(false)
        return
      }

      const profile = profileResult.value as UserProfile
      if (profile.role === 'admin') {
        router.replace('/admin/dashboard')
        return
      }

      setUser(profile)

      if (ordersResult.status === 'fulfilled') {
        setOrders(ordersResult.value as CustomerOrder[])
      } else if (axios.isAxiosError(ordersResult.reason) && ordersResult.reason.response?.status === 401) {
        router.replace('/auth')
        return
      } else {
        setOrdersError('Your orders could not be loaded right now.')
      }

      setIsLoading(false)
    }

    loadDashboard().catch(() => {
      if (isActive) {
        setPageError('We could not load your account. Please try again.')
        setIsLoading(false)
      }
    })

    return () => {
      isActive = false
    }
  }, [router])

  return (
    <main className="flex-1 bg-[#f4f4f1] text-neutral-950">
      <section className="bg-[#243b33] text-white">
        <div className="mx-auto flex max-w-6xl flex-col justify-between gap-6 px-5 py-10 sm:px-8 sm:py-14 md:flex-row md:items-end">
          <div>
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-[#d8b98e]">
              HOBBLY / Your account
            </p>
            <h1 className="text-3xl font-semibold sm:text-4xl">
              {user?.fullname ? `Hello, ${user.fullname}` : 'Your dashboard'}
            </h1>
            <p className="mt-2 text-sm text-white/70">Your details and order history.</p>
          </div>
            <div className="flex flex-wrap items-center gap-4 border-t border-white/20 pt-4 md:border-l md:border-t-0 md:pl-6 md:pt-0">
              <div className="flex items-center gap-3">
                <Package aria-hidden="true" size={20} className="text-[#d8b98e]" />
                <div>
                  <p className="text-2xl font-semibold">{isLoading ? '—' : orders.length}</p>
                  <p className="text-xs text-white/70">{orders.length === 1 ? 'Order' : 'Orders'}</p>
                </div>
            </div>
              <button
                type="button"
                onClick={() => {
                  logout()
                  router.replace('/auth')
                }}
                className="inline-flex h-10 items-center gap-2 rounded-sm border border-white/35 px-3 text-sm font-medium text-white transition-colors hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
              >
                <LogOut aria-hidden="true" size={16} />
                Sign out
              </button>
          </div>
        </div>
      </section>

      <div className="mx-auto grid max-w-6xl gap-8 px-5 py-9 sm:px-8 sm:py-12 lg:grid-cols-[minmax(260px,0.8fr)_minmax(0,1.7fr)]">
        <section aria-labelledby="account-heading" className="self-start border-t-2 border-[#a53b2b] bg-white p-5 sm:p-6">
          <div className="mb-6 flex items-center gap-3">
            <span className="flex size-10 items-center justify-center rounded-full bg-[#edf1ed] text-[#243b33]">
              <UserRound aria-hidden="true" size={19} />
            </span>
            <div>
              <h2 id="account-heading" className="font-semibold">Account information</h2>
              <p className="text-xs text-neutral-500">Your personal details</p>
            </div>
          </div>

          {isLoading ? (
            <p className="text-sm text-neutral-500">Loading account…</p>
          ) : pageError ? (
            <p role="alert" className="text-sm text-[#a53b2b]">{pageError}</p>
          ) : user ? (
            <dl className="space-y-5">
              <div>
                <dt className="text-xs font-medium uppercase tracking-wide text-neutral-500">Full name</dt>
                <dd className="mt-1 text-sm font-medium">{user.fullname || 'Not provided'}</dd>
              </div>
              <div>
                <dt className="text-xs font-medium uppercase tracking-wide text-neutral-500">Username</dt>
                <dd className="mt-1 text-sm">{user.username ? `@${user.username}` : 'Not provided'}</dd>
              </div>
              <div className="flex items-start gap-2.5">
                <Mail aria-hidden="true" size={16} className="mt-0.5 shrink-0 text-neutral-500" />
                <div>
                  <dt className="text-xs font-medium uppercase tracking-wide text-neutral-500">Email address</dt>
                  <dd className="mt-1 break-all text-sm">{user.email || 'Not provided'}</dd>
                </div>
              </div>
              <div className="flex items-start gap-2.5">
                <CalendarDays aria-hidden="true" size={16} className="mt-0.5 shrink-0 text-neutral-500" />
                <div>
                  <dt className="text-xs font-medium uppercase tracking-wide text-neutral-500">Member since</dt>
                  <dd className="mt-1 text-sm">{formatDate(user.createdAt)}</dd>
                </div>
              </div>
            </dl>
          ) : null}
        </section>

        <section aria-labelledby="orders-heading">
          <div className="mb-5 flex items-end justify-between gap-4">
            <div>
              <p className="mb-1 text-xs font-semibold uppercase tracking-[0.16em] text-[#78847b]">Your purchases</p>
              <h2 id="orders-heading" className="text-2xl font-semibold">Order history</h2>
            </div>
            {!isLoading && !ordersError && (
              <span className="pb-1 text-sm text-neutral-500">{orders.length} total</span>
            )}
          </div>

          {isLoading ? (
            <div aria-live="polite" className="border border-neutral-200 bg-white px-5 py-8 text-sm text-neutral-500">
              Loading your orders…
            </div>
          ) : ordersError ? (
            <div role="alert" className="border border-[#e5c9c4] bg-white px-5 py-8 text-sm text-[#a53b2b]">
              {ordersError}
            </div>
          ) : orders.length === 0 ? (
            <div className="border border-neutral-200 bg-white px-5 py-10 text-center sm:py-14">
              <Package aria-hidden="true" size={28} className="mx-auto mb-3 text-neutral-400" />
              <h3 className="font-semibold">No orders yet</h3>
              <p className="mt-1 text-sm text-neutral-500">Your purchases will appear here.</p>
            </div>
          ) : (
            <div className="divide-y divide-neutral-200 border border-neutral-200 bg-white">
              {orders.map((order) => (
                <article key={order._id} className="p-5 sm:p-6">
                  <div className="mb-4 flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                    <h3 className="text-sm font-semibold">Order #{order._id.slice(-8).toUpperCase()}</h3>
                    <time className="text-xs text-neutral-500" dateTime={order.createdAt}>
                      {formatDate(order.createdAt)}
                    </time>
                  </div>
                  <ul className="space-y-3">
                    {(order.products || []).map((item, index) => (
                      <li key={item._id || `${order._id}-${index}`} className="flex justify-between gap-4 text-sm">
                        <div className="min-w-0">
                          <p className="truncate font-medium">{item.product?.name || 'Product unavailable'}</p>
                          {item.product?.category && (
                            <p className="mt-0.5 text-xs text-neutral-500">{item.product.category}</p>
                          )}
                        </div>
                        <span className="shrink-0 text-neutral-600">Qty {item.quantity}</span>
                      </li>
                    ))}
                  </ul>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  )
}
