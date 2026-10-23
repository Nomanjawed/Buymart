'use client'

import axios from 'axios'
import Image from 'next/image'
import { CalendarDays, Eye, LoaderCircle, LogOut, Mail, Package, Search, UserRound, X } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useEffect, useState, type FormEvent } from 'react'
import { getMe, getMyOrders, logout, trackOrderByNumber } from '@/utils/api'

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
  calculatedPrice?: number
  product?: {
    name?: string
    category?: string
    image?: string
    price?: number
  } | null
}

type CustomerOrder = {
  _id: string
  orderNumber?: string
  orderStatus?: string
  paymentMethod?: string
  paymentStatus?: string
  createdAt?: string
  updatedAt?: string
  shippingDetails?: {
    fullName?: string
    phone?: string
    address?: string
    city?: string
    postalCode?: string
  }
  products: OrderItem[]
}

type TrackedOrder = {
  orderNumber: string
  orderStatus: string
  updatedAt?: string
}

const currency = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
})

function formatDate(value?: string) {
  if (!value) return 'Date unavailable'

  const date = new Date(value)
  return Number.isNaN(date.getTime())
    ? 'Date unavailable'
    : new Intl.DateTimeFormat('en', { dateStyle: 'medium' }).format(date)
}

function getOrderTotal(order: CustomerOrder) {
  return order.products.reduce((total, item) => {
    return total + (item.calculatedPrice ?? (item.product?.price ?? 0) * item.quantity)
  }, 0)
}

export default function DashboardPage() {
  const router = useRouter()
  const [user, setUser] = useState<UserProfile | null>(null)
  const [orders, setOrders] = useState<CustomerOrder[]>([])
  const [selectedOrder, setSelectedOrder] = useState<CustomerOrder | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [pageError, setPageError] = useState('')
  const [ordersError, setOrdersError] = useState('')
  const [trackingNumber, setTrackingNumber] = useState('')
  const [trackedOrder, setTrackedOrder] = useState<TrackedOrder | null>(null)
  const [isTracking, setIsTracking] = useState(false)
  const [trackingError, setTrackingError] = useState('')

  async function handleTrackOrder(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const orderNumber = trackingNumber.trim()
    if (!orderNumber || isTracking) return

    setIsTracking(true)
    setTrackingError('')
    setTrackedOrder(null)

    try {
      const result = await trackOrderByNumber(orderNumber) as TrackedOrder
      setTrackedOrder(result)
    } catch (error) {
      const responseMessage = axios.isAxiosError<{ message?: unknown }>(error)
        ? error.response?.data?.message
        : null
      setTrackingError(typeof responseMessage === 'string' ? responseMessage : 'We could not find that order.')
    } finally {
      setIsTracking(false)
    }
  }

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

          <section aria-labelledby="track-order-heading" className="mb-6 border border-neutral-200 bg-white p-5 sm:p-6">
            <h3 id="track-order-heading" className="font-semibold">Track an order</h3>
            <p className="mt-1 text-sm text-neutral-600">Enter the order number from your confirmation.</p>
            <form onSubmit={handleTrackOrder} className="mt-4 flex flex-col gap-3 sm:flex-row">
              <label className="sr-only" htmlFor="tracking-order-number">Order number</label>
              <input
                id="tracking-order-number"
                value={trackingNumber}
                onChange={(event) => setTrackingNumber(event.target.value)}
                placeholder="e.g. ORD-123456789-123"
                required
                className="h-11 min-w-0 flex-1 border border-neutral-300 px-3 text-sm outline-none focus:border-[#31493e] focus:ring-2 focus:ring-[#31493e]/15"
              />
              <button
                type="submit"
                disabled={isTracking}
                className="inline-flex h-11 items-center justify-center gap-2 bg-[#243b33] px-4 text-sm font-semibold text-white hover:bg-[#365346] disabled:cursor-wait disabled:opacity-60"
              >
                {isTracking ? <LoaderCircle size={16} className="animate-spin" aria-hidden="true" /> : <Search size={16} aria-hidden="true" />}
                Track order
              </button>
            </form>
            {trackingError && <p role="alert" className="mt-3 text-sm text-[#a53b2b]">{trackingError}</p>}
            {trackedOrder && (
              <div role="status" className="mt-4 flex flex-wrap items-center justify-between gap-3 border-l-2 border-emerald-700 bg-[#f4f7f3] px-4 py-3">
                <div>
                  <p className="text-xs text-neutral-500">Order {trackedOrder.orderNumber}</p>
                  <p className="mt-1 font-semibold capitalize">{trackedOrder.orderStatus}</p>
                </div>
                {trackedOrder.updatedAt && (
                  <p className="text-xs text-neutral-500">Updated {formatDate(trackedOrder.updatedAt)}</p>
                )}
              </div>
            )}
          </section>

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
                    <div>
                      <h3 className="text-sm font-semibold">{order.orderNumber || `Order #${order._id.slice(-8).toUpperCase()}`}</h3>
                      <p className="mt-1 text-xs font-medium capitalize text-[#52645a]">
                        {order.orderStatus || 'pending'} · Payment {order.paymentStatus === 'paid' ? 'Paid' : 'Pending'}
                      </p>
                    </div>
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
                  <div className="mt-4 flex justify-end border-t border-neutral-100 pt-3">
                    <button
                      type="button"
                      onClick={() => setSelectedOrder(order)}
                      className="inline-flex h-9 items-center gap-2 border border-neutral-300 px-3 text-sm font-medium text-neutral-700 transition hover:bg-neutral-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#31493e]"
                    >
                      <Eye size={16} aria-hidden="true" /> View order
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>

      {selectedOrder && (
        <div
          role="presentation"
          onClick={(event) => {
            if (event.target === event.currentTarget) setSelectedOrder(null)
          }}
          onKeyDown={(event) => {
            if (event.key === 'Escape') setSelectedOrder(null)
          }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#101b17]/55 p-4"
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="customer-order-receipt-title"
            className="max-h-[90vh] w-full max-w-2xl overflow-y-auto bg-white shadow-2xl"
          >
            <header className="flex items-start justify-between border-b border-neutral-200 px-5 py-4 sm:px-7">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.15em] text-[#78847b]">Order receipt</p>
                <h2 id="customer-order-receipt-title" className="mt-1 text-lg font-semibold">
                  {selectedOrder.orderNumber || `Order #${selectedOrder._id.slice(-8).toUpperCase()}`}
                </h2>
              </div>
              <button
                type="button"
                autoFocus
                aria-label="Close order receipt"
                onClick={() => setSelectedOrder(null)}
                className="inline-flex size-9 items-center justify-center text-neutral-500 hover:bg-neutral-100 hover:text-neutral-900"
              >
                <X size={18} aria-hidden="true" />
              </button>
            </header>

            <div className="space-y-6 px-5 py-5 sm:px-7">
              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-neutral-500">Order status</p>
                  <p className="mt-1 text-sm font-semibold capitalize">{selectedOrder.orderStatus || 'pending'}</p>
                  <p className="mt-1 text-xs text-neutral-500">Placed {formatDate(selectedOrder.createdAt)}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-neutral-500">Payment</p>
                  <p className="mt-1 text-sm font-medium">
                    {selectedOrder.paymentMethod === 'cod' ? 'Cash on delivery' : selectedOrder.paymentMethod === 'card' ? 'Card' : 'Not provided'}
                  </p>
                  <p className="mt-1 text-xs capitalize text-neutral-500">
                    {selectedOrder.paymentStatus === 'paid' ? 'Paid' : (selectedOrder.paymentStatus || 'pending').replace(/_/g, ' ')}
                  </p>
                </div>
              </div>

              <div className="border-t border-neutral-200 pt-5">
                <h3 className="text-xs font-semibold uppercase tracking-wide text-neutral-500">Shipping details</h3>
                <dl className="mt-3 grid gap-x-6 gap-y-4 text-sm sm:grid-cols-2">
                  <div>
                    <dt className="text-xs text-neutral-500">Full name</dt>
                    <dd className="mt-1 font-medium">{selectedOrder.shippingDetails?.fullName || user?.fullname || 'Not provided'}</dd>
                  </div>
                  <div>
                    <dt className="text-xs text-neutral-500">Email address</dt>
                    <dd className="mt-1 break-all">{user?.email || 'Not provided'}</dd>
                  </div>
                  <div>
                    <dt className="text-xs text-neutral-500">Phone</dt>
                    <dd className="mt-1">{selectedOrder.shippingDetails?.phone || 'Not provided'}</dd>
                  </div>
                  <div>
                    <dt className="text-xs text-neutral-500">City / postal code</dt>
                    <dd className="mt-1">{[selectedOrder.shippingDetails?.city, selectedOrder.shippingDetails?.postalCode].filter(Boolean).join(', ') || 'Not provided'}</dd>
                  </div>
                  <div className="sm:col-span-2">
                    <dt className="text-xs text-neutral-500">Address</dt>
                    <dd className="mt-1 wrap-break-word">{selectedOrder.shippingDetails?.address || 'Not provided'}</dd>
                  </div>
                </dl>
              </div>

              <div className="border-t border-neutral-200 pt-5">
                <h3 className="text-xs font-semibold uppercase tracking-wide text-neutral-500">Products</h3>
                <ul className="mt-3 divide-y divide-neutral-200 border-y border-neutral-200">
                  {selectedOrder.products.map((item, index) => {
                    const lineTotal = item.calculatedPrice ?? (item.product?.price ?? 0) * item.quantity
                    const unitPrice = item.quantity > 0 ? lineTotal / item.quantity : 0

                    return (
                      <li key={item._id || `${selectedOrder._id}-${index}`} className="flex items-center justify-between gap-4 py-3 text-sm">
                        <div className="flex min-w-0 items-center gap-3">
                          <div className="relative size-14 shrink-0 overflow-hidden bg-neutral-100">
                            <Image
                              src={item.product?.image || '/Hero.png'}
                              alt={item.product?.name || 'Ordered product'}
                              fill
                              unoptimized
                              sizes="56px"
                              className="object-cover"
                            />
                          </div>
                          <div className="min-w-0">
                            <p className="truncate font-medium">{item.product?.name || 'Product unavailable'}</p>
                            {item.product?.category && <p className="mt-0.5 text-xs text-neutral-500">{item.product.category}</p>}
                            <p className="mt-0.5 text-xs text-neutral-500">Qty {item.quantity} · {currency.format(unitPrice)} each</p>
                          </div>
                        </div>
                        <p className="shrink-0 font-semibold">{currency.format(lineTotal)}</p>
                      </li>
                    )
                  })}
                </ul>
                <div className="flex justify-between gap-4 pt-4 text-sm font-semibold">
                  <span>Order total</span>
                  <span>{currency.format(getOrderTotal(selectedOrder))}</span>
                </div>
              </div>
            </div>
          </section>
        </div>
      )}
    </main>
  )
}
