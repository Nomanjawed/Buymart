'use client'

import Image from 'next/image'
import {
  ClipboardList,
  Eye,
  ImagePlus,
  LayoutDashboard,
  LoaderCircle,
  LogOut,
  Package,
  Pencil,
  Plus,
  Search,
  Save,
  ShieldCheck,
  Trash2,
  X,
} from 'lucide-react'
import axios from 'axios'
import { useEffect, useMemo, useState, type FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import {
  createProduct as createProductRequest,
  deleteProduct as deleteProductRequest,
  getAllOrders,
  getAllProducts,
  getMe,
  logout,
  updateOrderStatus,
  updateProduct as updateProductRequest,
} from '@/utils/api'

type Product = {
  id: string
  name: string
  description: string
  category: string
  price: number
  image: string
}

type ProductDraft = Omit<Product, 'id'>
type DashboardView = 'products' | 'orders'
type ApiProduct = Omit<Product, 'id'> & { _id?: string; id?: string }
type ProductPagination = { page: number; totalPages: number; totalProducts: number }
type OrderStatus = 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
const orderStatuses: OrderStatus[] = ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled']
type AdminOrder = {
  _id: string
  orderNumber?: string
  orderStatus?: OrderStatus
  createdAt?: string
  userId?: { fullname?: string; username?: string; email?: string } | null
  shippingDetails?: {
    fullName?: string
    phone?: string
    address?: string
    city?: string
    postalCode?: string
  }
  products: Array<{
    quantity: number
    calculatedPrice?: number
    product?: { name?: string; category?: string; image?: string; price?: number } | null
  }>
}

const emptyDraft: ProductDraft = {
  name: '',
  description: '',
  category: '',
  price: 0,
  image: '',
}

const currency = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
})
const productCategories = [
  'Cars',
  'Bikes',
  'Aircraft',
  'Fighter Jets',
  'Chess',
  'Ships',
  'Architecture',
  'Character',
  'Space',
]

function getRequestError(error: unknown, fallback: string) {
  if (axios.isAxiosError<{ message?: unknown }>(error)) {
    const message = error.response?.data?.message
    if (typeof message === 'string') return message
  }

  return error instanceof Error ? error.message : fallback
}

function getOrderTotal(order: AdminOrder) {
  return order.products.reduce((total, item) => {
    return total + (item.calculatedPrice ?? (item.product?.price ?? 0) * item.quantity)
  }, 0)
}

function formatOrderDate(value?: string) {
  if (!value) return 'Date unavailable'

  const date = new Date(value)
  return Number.isNaN(date.getTime())
    ? 'Date unavailable'
    : new Intl.DateTimeFormat('en', { dateStyle: 'medium' }).format(date)
}

function ProductEditor({
  product,
  onSave,
  onCancel,
  isSaving,
}: {
  product: Product | null
  onSave: (draft: ProductDraft) => Promise<void>
  onCancel: () => void
  isSaving: boolean
}) {
  const [draft, setDraft] = useState<ProductDraft>(product ?? emptyDraft)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadError, setUploadError] = useState('')
  const [saveError, setSaveError] = useState('')

  async function handleImageChange(event: React.ChangeEvent<HTMLInputElement>) {
    const input = event.currentTarget
    const file = input.files?.[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
      setUploadError('Choose an image file.')
      return
    }

    if (file.size > 10 * 1024 * 1024) {
      setUploadError('Images must be 10 MB or smaller.')
      return
    }

    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
    const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET


    if (!cloudName || !uploadPreset) {
      setUploadError('Set the Cloudinary cloud name and unsigned upload preset to enable uploads.')
      return
    }

    const payload = new FormData()
    payload.append('file', file)
    payload.append('upload_preset', uploadPreset)

    setIsUploading(true)
    setUploadError('')

    try {
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        { method: 'POST', body: payload },
      )
      const result = await response.json() as {
        secure_url?: string
        error?: { message?: string }
      }

      if (!response.ok || !result.secure_url) {
        throw new Error(result.error?.message || 'Cloudinary could not upload this image.')
      }

      setDraft((currentDraft) => ({ ...currentDraft, image: result.secure_url! }))
    } catch (error) {
      setUploadError(error instanceof Error ? error.message : 'Image upload failed.')
    } finally {
      setIsUploading(false)
      input.value = ''
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setSaveError('')

    try {
      await onSave({ ...draft, price: Number(draft.price) })
    } catch (error) {
      setSaveError(getRequestError(error, 'The product could not be saved.'))
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-[#101b17]/55 sm:items-center sm:p-5">
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="product-editor-title"
        className="max-h-[92vh] w-full overflow-y-auto bg-white shadow-2xl sm:max-w-2xl"
      >
        <div className="flex items-start justify-between border-b border-neutral-200 px-5 py-5 sm:px-7">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#a53b2b]">
              Product catalogue
            </p>
            <h2 id="product-editor-title" className="mt-1 text-xl font-semibold">
              {product ? 'Edit product' : 'Add a product'}
            </h2>
          </div>
          <button
            type="button"
            aria-label="Close product editor"
            onClick={onCancel}
            className="inline-flex size-9 items-center justify-center text-neutral-500 hover:bg-neutral-100 hover:text-neutral-900"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 px-5 py-6 sm:px-7">
          <div className="grid gap-5 sm:grid-cols-2">
            <label className="space-y-2 text-sm font-medium">
              Product name
              <input
                required
                maxLength={100}
                value={draft.name}
                onChange={(event) => setDraft({ ...draft, name: event.target.value })}
                className="h-11 w-full border border-neutral-300 px-3 font-normal outline-none focus:border-[#31493e] focus:ring-2 focus:ring-[#31493e]/15"
              />
            </label>
            <label className="space-y-2 text-sm font-medium">
              Category
              <select
                required
                value={draft.category}
                onChange={(event) => setDraft({ ...draft, category: event.target.value })}
                className="h-11 w-full border border-neutral-300 px-3 font-normal outline-none focus:border-[#31493e] focus:ring-2 focus:ring-[#31493e]/15"
              >
                <option value="" disabled>Select a category</option>
                {productCategories.map((category) => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </label>
          </div>

          <label className="block space-y-2 text-sm font-medium">
            Description
            <textarea
              required
              rows={3}
              maxLength={1000}
              value={draft.description}
              onChange={(event) => setDraft({ ...draft, description: event.target.value })}
              className="w-full resize-y border border-neutral-300 px-3 py-2 font-normal outline-none focus:border-[#31493e] focus:ring-2 focus:ring-[#31493e]/15"
            />
          </label>

          <label className="block max-w-56 space-y-2 text-sm font-medium">
            Price
            <div className="flex h-11 items-center border border-neutral-300 px-3 focus-within:border-[#31493e] focus-within:ring-2 focus-within:ring-[#31493e]/15">
              <span className="text-neutral-500">$</span>
              <input
                required
                type="number"
                min="0.01"
                step="0.01"
                value={draft.price || ''}
                onChange={(event) => setDraft({ ...draft, price: Number(event.target.value) })}
                className="h-full min-w-0 flex-1 pl-2 outline-none"
              />
            </div>
          </label>

          <div>
            <span className="mb-2 block text-sm font-medium">Product image</span>
            <div className="flex flex-wrap items-center gap-3">
              <label className="inline-flex h-10 cursor-pointer items-center gap-2 border border-neutral-300 px-3 text-sm font-medium transition hover:bg-neutral-50">
                <ImagePlus size={16} aria-hidden="true" />
                {isUploading ? 'Uploading…' : draft.image ? 'Replace image' : 'Upload image'}
                <input
                  type="file"
                  accept="image/*"
                  disabled={isUploading}
                  onChange={handleImageChange}
                  className="sr-only"
                />
              </label>
              {draft.image && (
                <span className="max-w-64 truncate text-xs text-emerald-800">Image uploaded</span>
              )}
            </div>
            {uploadError && <p role="alert" className="mt-2 text-sm text-red-700">{uploadError}</p>}
            {saveError && <p role="alert" className="mt-2 text-sm text-red-700">{saveError}</p>}
            {draft.image && (
              <div className="relative mt-3 aspect-16/7 max-w-sm overflow-hidden bg-neutral-100">
                <Image src={draft.image} alt="Product image preview" fill unoptimized className="object-cover" />
              </div>
            )}
          </div>

          <div className="flex justify-end gap-3 border-t border-neutral-200 pt-5">
            <button
              type="button"
              onClick={onCancel}
              disabled={isSaving}
              className="h-10 border border-neutral-300 px-4 text-sm font-medium hover:bg-neutral-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isUploading || isSaving || !draft.image}
              className="h-10 bg-[#243b33] px-4 text-sm font-semibold text-white transition hover:bg-[#182a24] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isSaving ? 'Saving…' : product ? 'Save changes' : 'Add product'}
            </button>
          </div>
        </form>
      </section>
    </div>
  )
}

export default function AdminDashboard() {
  const router = useRouter()
  const [hasAdminAccess, setHasAdminAccess] = useState(false)
  const [isCheckingAccess, setIsCheckingAccess] = useState(true)
  const [accessError, setAccessError] = useState('')
  const [activeView, setActiveView] = useState<DashboardView>('products')
  const [products, setProducts] = useState<Product[]>([])
  const [orders, setOrders] = useState<AdminOrder[]>([])
  const [selectedOrder, setSelectedOrder] = useState<AdminOrder | null>(null)
  const [pendingOrderStatuses, setPendingOrderStatuses] = useState<Record<string, OrderStatus>>({})
  const [updatingOrderNumber, setUpdatingOrderNumber] = useState<string | null>(null)
  const [isOrdersLoading, setIsOrdersLoading] = useState(false)
  const [ordersError, setOrdersError] = useState('')
  const [page, setPage] = useState(1)
  const [reloadKey, setReloadKey] = useState(0)
  const [pagination, setPagination] = useState<ProductPagination>({
    page: 1,
    totalPages: 1,
    totalProducts: 0,
  })
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [loadError, setLoadError] = useState('')
  const [mutationError, setMutationError] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [isEditorOpen, setIsEditorOpen] = useState(false)
  const [notice, setNotice] = useState('')

  useEffect(() => {
    let isCurrentRequest = true

    getMe()
      .then((profile: { role?: string }) => {
        if (!isCurrentRequest) return

        if (profile.role !== 'admin') {
          router.replace('/dashboard')
          return
        }

        setHasAdminAccess(true)
      })
      .catch((error: unknown) => {
        if (!isCurrentRequest) return

        if (axios.isAxiosError(error) && error.response?.status === 401) {
          router.replace('/auth')
        } else {
          setAccessError('Admin access could not be verified. Please try again.')
        }
      })
      .finally(() => {
        if (isCurrentRequest) setIsCheckingAccess(false)
      })

    return () => {
      isCurrentRequest = false
    }
  }, [router])

  useEffect(() => {
    if (!hasAdminAccess) return

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
          category: product.category,
          price: Number(product.price),
          image: product.image,
        }))

        setProducts(loadedProducts)
        setPagination(response?.pagination ?? {
          page,
          totalPages: 1,
          totalProducts: loadedProducts.length,
        })
        setLoadError('')
      })
      .catch((error: unknown) => {
        if (isCurrentRequest) {
          setLoadError(getRequestError(error, 'Products could not be loaded.'))
        }
      })
      .finally(() => {
        if (isCurrentRequest) setIsLoading(false)
      })

    return () => {
      isCurrentRequest = false
    }
  }, [hasAdminAccess, page, reloadKey])

  useEffect(() => {
    if (!hasAdminAccess || activeView !== 'orders') return

    let isCurrentRequest = true

    getAllOrders()
      .then((result: AdminOrder[]) => {
        if (!isCurrentRequest) return

        setOrders(result)
        setOrdersError('')
      })
      .catch((error: unknown) => {
        if (!isCurrentRequest) return

        if (axios.isAxiosError(error) && error.response?.status === 401) {
          logout()
          router.replace('/auth')
          return
        }

        setOrdersError(getRequestError(error, 'Orders could not be loaded.'))
      })
      .finally(() => {
        if (isCurrentRequest) setIsOrdersLoading(false)
      })

    return () => {
      isCurrentRequest = false
    }
  }, [activeView, hasAdminAccess, router])

  const filteredProducts = useMemo(() => {
    const query = searchQuery.trim().toLowerCase()
    if (!query) return products

    return products.filter((product) =>
      `${product.name} ${product.category}`.toLowerCase().includes(query),
    )
  }, [products, searchQuery])

  async function saveProduct(draft: ProductDraft) {
    setIsSaving(true)
    setMutationError('')

    try {
      if (editingProduct) {
        await updateProductRequest(editingProduct.id, draft)
        setNotice('Product updated.')
      } else {
        await createProductRequest(draft)
        setNotice('Product created.')
      }

      setIsEditorOpen(false)
      setEditingProduct(null)
      setIsLoading(true)
      setReloadKey((currentKey) => currentKey + 1)
    } finally {
      setIsSaving(false)
    }
  }

  async function deleteProduct(product: Product) {
    if (!window.confirm(`Delete ${product.name}?`)) return

    setDeletingId(product.id)
    setMutationError('')

    try {
      await deleteProductRequest(product.id)
      setNotice('Product deleted.')
      setIsLoading(true)

      if (products.length === 1 && page > 1) {
        setPage((currentPage) => currentPage - 1)
      } else {
        setReloadKey((currentKey) => currentKey + 1)
      }
    } catch (error) {
      setMutationError(getRequestError(error, 'The product could not be deleted.'))
    } finally {
      setDeletingId(null)
    }
  }

  function openNewProduct() {
    setEditingProduct(null)
    setIsEditorOpen(true)
  }

  function openProductEditor(product: Product) {
    setEditingProduct(product)
    setIsEditorOpen(true)
  }

  function handleSignOut() {
    logout()
    router.replace('/auth')
  }

  function openOrders() {
    setOrdersError('')
    setIsOrdersLoading(true)
    setActiveView('orders')
  }

  async function saveOrderStatus(order: AdminOrder) {
    if (!order.orderNumber || updatingOrderNumber) return

    const orderStatus = pendingOrderStatuses[order.orderNumber] ?? order.orderStatus ?? 'pending'
    if (orderStatus === order.orderStatus) return

    setUpdatingOrderNumber(order.orderNumber)
    setMutationError('')

    try {
      await updateOrderStatus(order.orderNumber, orderStatus)
      setOrders((currentOrders) => currentOrders.map((currentOrder) =>
        currentOrder.orderNumber === order.orderNumber ? { ...currentOrder, orderStatus } : currentOrder,
      ))
      setSelectedOrder((currentOrder) => {
        if (!currentOrder || currentOrder.orderNumber !== order.orderNumber) return currentOrder
        return { ...currentOrder, orderStatus }
      })
      setPendingOrderStatuses((currentStatuses) => {
        const nextStatuses = { ...currentStatuses }
        delete nextStatuses[order.orderNumber!]
        return nextStatuses
      })
      setNotice(`Order ${order.orderNumber} updated to ${orderStatus}.`)
    } catch (error) {
      setMutationError(getRequestError(error, 'The order status could not be updated.'))
    } finally {
      setUpdatingOrderNumber(null)
    }
  }

  if (isCheckingAccess || !hasAdminAccess) {
    return (
      <main className="flex min-h-[60vh] flex-1 items-center justify-center bg-[#f3f4f0] px-5 text-center">
        <div>
          <p role={accessError ? 'alert' : 'status'} className={accessError ? 'text-sm text-red-700' : 'text-sm text-neutral-600'}>
            {accessError || 'Verifying admin access…'}
          </p>
          {accessError && (
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="mt-3 text-sm font-semibold text-[#a53b2b] hover:underline"
            >
              Try again
            </button>
          )}
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-[75vh] flex-1 bg-[#f3f4f0] text-[#1e2924]">
      <div className="mx-auto max-w-360 px-4 py-7 sm:px-7 sm:py-10 lg:px-10">
        <header className="mb-8 flex flex-wrap items-end justify-between gap-5 border-b border-[#d9ddd6] pb-6">
          <div>
            <p className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#a53b2b]">
              <ShieldCheck size={15} aria-hidden="true" /> Hobbly / Admin console
            </p>
            <h1 className="text-3xl font-semibold font-poppins sm:text-4xl">Store operations</h1>
            <p className="mt-2 text-sm text-neutral-600">Manage the product catalogue and review incoming orders.</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex h-10 items-center gap-2 border border-[#d9ddd6] bg-white px-3 text-xs font-semibold uppercase tracking-wide text-neutral-600">
              <span className="size-2 rounded-full bg-emerald-600" /> Admin access
            </div>
            <button
              type="button"
              onClick={handleSignOut}
              className="inline-flex h-10 items-center gap-2 border border-[#d9ddd6] bg-white px-3 text-sm font-medium text-neutral-700 transition hover:bg-neutral-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#31493e]"
            >
              <LogOut size={16} aria-hidden="true" /> Sign out
            </button>
          </div>
        </header>

        <div className="grid gap-7 lg:grid-cols-[220px_minmax(0,1fr)]">
          <nav aria-label="Admin sections" className="flex gap-2 overflow-x-auto border-b border-[#d9ddd6] pb-3 lg:block lg:space-y-1 lg:border-0 lg:pb-0">
            <button
              type="button"
              aria-current={activeView === 'products' ? 'page' : undefined}
              onClick={() => setActiveView('products')}
              className={`inline-flex h-11 shrink-0 items-center gap-3 px-3 text-sm font-medium transition lg:w-full ${activeView === 'products' ? 'bg-black text-white' : 'text-neutral-600 hover:bg-white'}`}
            >
              <Package size={17} aria-hidden="true" /> Products
            </button>
            <button
              type="button"
              aria-current={activeView === 'orders' ? 'page' : undefined}
              onClick={openOrders}
              className={`inline-flex h-11 shrink-0 items-center gap-3 px-3 text-sm font-medium transition lg:w-full ${activeView === 'orders' ? 'bg-black text-white' : 'text-neutral-600 hover:bg-white'}`}
            >
              <ClipboardList size={17} aria-hidden="true" /> Orders
            </button>
          </nav>

          <div className="min-w-0">
            {notice && (
              <p role="status" className="mb-5 border-l-2 border-emerald-700 bg-white px-4 py-3 text-sm text-emerald-900">
                {notice}
              </p>
            )}
            {mutationError && (
              <p role="alert" className="mb-5 border-l-2 border-red-700 bg-white px-4 py-3 text-sm text-red-800">
                {mutationError}
              </p>
            )}

            {activeView === 'products' ? (
              <section aria-labelledby="products-title">
                <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
                  <div>
                    <p className="mb-1 text-xs font-semibold uppercase tracking-[0.16em] text-[#78847b]">Catalogue</p>
                    <h2 id="products-title" className="text-2xl font-semibold">Products</h2>
                  </div>
                  <button
                    type="button"
                    onClick={openNewProduct}
                    className="inline-flex h-11 items-center gap-2 bg-[#a53b2b] px-4 text-sm font-semibold text-white transition hover:bg-[#8b3023] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#a53b2b] focus-visible:ring-offset-2"
                  >
                    <Plus size={17} aria-hidden="true" /> Add product
                  </button>
                </div>

                <div className="mb-5 grid gap-3 sm:grid-cols-3">
                  <div className="border border-[#d9ddd6] bg-white px-4 py-3">
                    <p className="text-xs text-neutral-500">Products in catalogue</p>
                    <p className="mt-1 text-2xl font-semibold">{pagination.totalProducts}</p>
                  </div>
                  <div className="border border-[#d9ddd6] bg-white px-4 py-3 sm:col-span-2">
                    <label className="flex h-full min-h-12 items-center gap-3">
                      <Search size={17} aria-hidden="true" className="shrink-0 text-neutral-500" />
                      <input
                        type="search"
                        value={searchQuery}
                        onChange={(event) => setSearchQuery(event.target.value)}
                        placeholder="Search products or categories"
                        aria-label="Search products or categories"
                        className="w-full bg-transparent text-sm outline-none placeholder:text-neutral-400"
                      />
                    </label>
                  </div>
                </div>

                <div className="overflow-hidden border border-[#d9ddd6] bg-white">
                  <div className="hidden grid-cols-[minmax(220px,2fr)_minmax(110px,1fr)_minmax(90px,0.7fr)_100px] gap-4 border-b border-neutral-200 bg-[#f8f9f6] px-4 py-3 text-[11px] font-semibold uppercase tracking-[0.12em] text-neutral-500 md:grid md:px-5">
                    <span>Product</span><span>Category</span><span>Price</span><span className="text-right">Actions</span>
                  </div>

                  {isLoading ? (
                    <p role="status" className="px-5 py-14 text-center text-sm text-neutral-500">Loading products…</p>
                  ) : loadError ? (
                    <div className="px-5 py-14 text-center">
                      <p role="alert" className="text-sm text-red-700">{loadError}</p>
                      <button
                        type="button"
                        onClick={() => {
                          setIsLoading(true)
                          setReloadKey((currentKey) => currentKey + 1)
                        }}
                        className="mt-3 text-sm font-semibold text-[#a53b2b] hover:underline"
                      >
                        Try again
                      </button>
                    </div>
                  ) : filteredProducts.length ? (
                    <ul className="divide-y divide-neutral-200">
                      {filteredProducts.map((product) => (
                        <li key={product.id} className="grid gap-3 px-4 py-4 md:grid-cols-[minmax(220px,2fr)_minmax(110px,1fr)_minmax(90px,0.7fr)_100px] md:items-center md:gap-4 md:px-5">
                          <div className="flex min-w-0 items-center gap-3">
                            <div className="relative size-14 shrink-0 overflow-hidden bg-neutral-100">
                              <Image src={product.image} alt="" fill unoptimized sizes="56px" className="object-cover" />
                            </div>
                            <div className="min-w-0">
                              <p className="truncate text-sm font-semibold">{product.name}</p>
                              <p className="mt-1 line-clamp-1 text-xs text-neutral-500">{product.description}</p>
                            </div>
                          </div>
                          <p className="text-xs text-neutral-600 md:text-sm">{product.category}</p>
                          <p className="text-sm font-semibold">{currency.format(product.price)}</p>
                          <div className="flex items-center gap-1 md:justify-end">
                            <button
                              type="button"
                              aria-label={`Edit ${product.name}`}
                              title="Edit product"
                              onClick={() => openProductEditor(product)}
                              className="inline-flex size-9 items-center justify-center text-neutral-600 hover:bg-neutral-100 hover:text-neutral-950"
                            >
                              <Pencil size={16} />
                            </button>
                            <button
                              type="button"
                              aria-label={`Delete ${product.name}`}
                              title="Delete product"
                              disabled={deletingId === product.id}
                              onClick={() => deleteProduct(product)}
                              className="inline-flex size-9 items-center justify-center text-[#a53b2b] hover:bg-red-50 disabled:cursor-wait disabled:opacity-50"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <div className="px-5 py-14 text-center sm:py-20">
                      <span className="mx-auto flex size-12 items-center justify-center bg-[#e9eee9] text-[#31493e]">
                        {searchQuery ? <Search size={21} /> : <LayoutDashboard size={21} />}
                      </span>
                      <h3 className="mt-4 font-semibold">
                        {searchQuery ? 'No matching products' : 'Your catalogue is empty'}
                      </h3>
                      <p className="mx-auto mt-1 max-w-sm text-sm leading-6 text-neutral-500">
                        {searchQuery ? 'Try another product name or category.' : 'Add your first product to start building the store catalogue.'}
                      </p>
                      {!searchQuery && (
                        <button type="button" onClick={openNewProduct} className="mt-5 text-sm font-semibold text-[#a53b2b] hover:underline">
                          Add your first product
                        </button>
                      )}
                    </div>
                  )}
                </div>
                {pagination.totalPages > 1 && (
                  <nav aria-label="Product pages" className="mt-5 flex items-center justify-center gap-4">
                    <button
                      type="button"
                      disabled={page <= 1 || isLoading}
                      onClick={() => {
                        setLoadError('')
                        setIsLoading(true)
                        setPage((currentPage) => currentPage - 1)
                      }}
                      className="h-9 border border-neutral-300 px-3 text-sm disabled:opacity-40"
                    >
                      Previous
                    </button>
                    <span className="text-sm text-neutral-600">Page {pagination.page} of {pagination.totalPages}</span>
                    <button
                      type="button"
                      disabled={page >= pagination.totalPages || isLoading}
                      onClick={() => {
                        setLoadError('')
                        setIsLoading(true)
                        setPage((currentPage) => currentPage + 1)
                      }}
                      className="h-9 border border-neutral-300 px-3 text-sm disabled:opacity-40"
                    >
                      Next
                    </button>
                  </nav>
                )}
              </section>
            ) : (
              <section aria-labelledby="orders-title">
                <div className="mb-6">
                  <p className="mb-1 text-xs font-semibold uppercase tracking-[0.16em] text-[#78847b]">Fulfillment</p>
                  <h2 id="orders-title" className="text-2xl font-semibold">Orders</h2>
                </div>

                <div className="mb-5 grid gap-3 sm:grid-cols-3">
                  <div className="border border-[#d9ddd6] bg-white px-4 py-3">
                    <p className="text-xs text-neutral-500">Total orders</p>
                    <p className="mt-1 text-2xl font-semibold">{isOrdersLoading ? '—' : orders.length}</p>
                  </div>
                  <div className="border border-[#d9ddd6] bg-white px-4 py-3">
                    <p className="text-xs text-neutral-500">Items ordered</p>
                    <p className="mt-1 text-2xl font-semibold">
                      {isOrdersLoading ? '—' : orders.reduce((total, order) => total + order.products.reduce((count, item) => count + item.quantity, 0), 0)}
                    </p>
                  </div>
                  <div className="border border-[#d9ddd6] bg-white px-4 py-3">
                    <p className="text-xs text-neutral-500">Order value</p>
                    <p className="mt-1 text-2xl font-semibold">
                      {isOrdersLoading ? '—' : currency.format(orders.reduce((total, order) => total + getOrderTotal(order), 0))}
                    </p>
                  </div>
                </div>

                <div className="overflow-x-auto border border-[#d9ddd6] bg-white">
                  <table className="w-full min-w-225 text-left">
                    <thead className="border-b border-neutral-200 bg-[#f8f9f6] text-[11px] font-semibold uppercase tracking-[0.12em] text-neutral-500">
                      <tr>
                        <th className="px-5 py-3">Order</th>
                        <th className="px-5 py-3">Customer</th>
                        <th className="px-5 py-3">Items</th>
                        <th className="px-5 py-3">Placed</th>
                        <th className="px-5 py-3 text-right">Total</th>
                        <th className="px-5 py-3">Order status</th>
                        <th className="px-5 py-3 text-right">Details</th>
                      </tr>
                    </thead>
                    <tbody>
                      {isOrdersLoading ? (
                        <tr>
                          <td colSpan={7} className="px-5 py-16 text-center text-sm text-neutral-500">
                            <LoaderCircle size={22} aria-hidden="true" className="mx-auto mb-3 animate-spin" />
                            Loading orders…
                          </td>
                        </tr>
                      ) : ordersError ? (
                        <tr>
                          <td colSpan={7} role="alert" className="px-5 py-16 text-center text-sm text-red-700">{ordersError}</td>
                        </tr>
                      ) : orders.length === 0 ? (
                        <tr>
                          <td colSpan={7} className="px-5 py-16 text-center">
                            <ClipboardList size={26} aria-hidden="true" className="mx-auto text-neutral-400" />
                            <p className="mt-3 font-semibold">No orders yet</p>
                            <p className="mt-1 text-sm text-neutral-500">Customer orders will appear here.</p>
                          </td>
                        </tr>
                      ) : orders.map((order) => (
                        <tr key={order._id} className="border-b border-neutral-100 last:border-0">
                          <td className="px-5 py-4 text-sm font-semibold">{order.orderNumber || `#${order._id.slice(-8).toUpperCase()}`}</td>
                          <td className="px-5 py-4">
                            <p className="text-sm font-medium">{order.shippingDetails?.fullName || order.userId?.fullname || order.userId?.username || 'Customer unavailable'}</p>
                            <p className="mt-1 text-xs text-neutral-500">{order.userId?.email || 'No email'}</p>
                          </td>
                          <td className="max-w-64 px-5 py-4 text-sm">
                            <p>{order.products.reduce((count, item) => count + item.quantity, 0)} items</p>
                            <p className="mt-1 truncate text-xs text-neutral-500">
                              {order.products.map((item) => item.product?.name || 'Product unavailable').join(', ')}
                            </p>
                          </td>
                          <td className="whitespace-nowrap px-5 py-4 text-sm text-neutral-600">{formatOrderDate(order.createdAt)}</td>
                          <td className="whitespace-nowrap px-5 py-4 text-right text-sm font-semibold">{currency.format(getOrderTotal(order))}</td>
                          <td className="px-5 py-4">
                            <div className="flex flex-col items-start gap-2">
                              <span className="text-xs font-semibold capitalize text-neutral-700">{order.orderStatus || 'pending'}</span>
                              <div className="flex items-center gap-2">
                                <select
                                  aria-label={`Set status for ${order.orderNumber || order._id}`}
                                  value={pendingOrderStatuses[order.orderNumber || order._id] ?? order.orderStatus ?? 'pending'}
                                  onChange={(event) => setPendingOrderStatuses((currentStatuses) => ({
                                    ...currentStatuses,
                                    [order.orderNumber || order._id]: event.target.value as OrderStatus,
                                  }))}
                                  className="h-9 border border-neutral-300 bg-white px-2 text-xs outline-none focus:border-[#31493e] focus:ring-2 focus:ring-[#31493e]/15"
                                >
                                  {orderStatuses.map((status) => (
                                    <option key={status} value={status}>{status}</option>
                                  ))}
                                </select>
                                <button
                                  type="button"
                                  disabled={!order.orderNumber || updatingOrderNumber === order.orderNumber || (pendingOrderStatuses[order.orderNumber || order._id] ?? order.orderStatus ?? 'pending') === order.orderStatus}
                                  onClick={() => saveOrderStatus(order)}
                                  className="inline-flex h-9 items-center gap-1 bg-red-900 px-2 text-xs font-semibold text-white hover:bg-red-800 disabled:cursor-not-allowed disabled:opacity-40"
                                >
                                  {updatingOrderNumber === order.orderNumber ? <LoaderCircle size={13} className="animate-spin" aria-hidden="true" /> : <Save size={13} aria-hidden="true" />}
                                  Update
                                </button>
                              </div>
                            </div>
                          </td>
                          <td className="px-5 py-4 text-right">
                            <button
                              type="button"
                              aria-label={`View order ${order._id.slice(-8)}`}
                              title="View order details"
                              onClick={() => setSelectedOrder(order)}
                              className="inline-flex size-9 items-center justify-center text-neutral-600 hover:bg-neutral-100 hover:text-[#243b33] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#31493e]"
                            >
                              <Eye size={17} aria-hidden="true" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>
            )}
          </div>
        </div>
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
            aria-labelledby="order-detail-title"
            className="max-h-[85vh] w-full max-w-lg overflow-y-auto bg-white shadow-2xl"
          >
            <header className="flex items-start justify-between border-b border-neutral-200 px-5 py-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.15em] text-[#78847b]">Order details</p>
                <h2 id="order-detail-title" className="mt-1 text-lg font-semibold">
                  {selectedOrder.orderNumber || `#${selectedOrder._id.slice(-8).toUpperCase()}`}
                </h2>
              </div>
              <button
                type="button"
                autoFocus
                aria-label="Close order details"
                onClick={() => setSelectedOrder(null)}
                className="inline-flex size-9 items-center justify-center text-neutral-500 hover:bg-neutral-100 hover:text-neutral-900"
              >
                <X size={18} aria-hidden="true" />
              </button>
            </header>

            <div className="space-y-5 px-5 py-5">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-neutral-500">Customer</p>
                <p className="mt-1 text-sm font-medium">
                  {selectedOrder.shippingDetails?.fullName || selectedOrder.userId?.fullname || selectedOrder.userId?.username || 'Customer unavailable'}
                </p>
                <p className="mt-0.5 break-all text-sm text-neutral-600">
                  {selectedOrder.userId?.email || 'No email available'}
                </p>
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-neutral-500">Shipping details</p>
                <dl className="mt-2 grid gap-3 text-sm sm:grid-cols-2">
                  <div>
                    <dt className="text-xs text-neutral-500">Phone</dt>
                    <dd className="mt-0.5">{selectedOrder.shippingDetails?.phone || 'Not provided'}</dd>
                  </div>
                  <div>
                    <dt className="text-xs text-neutral-500">City</dt>
                    <dd className="mt-0.5">{selectedOrder.shippingDetails?.city || 'Not provided'}</dd>
                  </div>
                  <div className="sm:col-span-2">
                    <dt className="text-xs text-neutral-500">Address</dt>
                    <dd className="mt-0.5 wrap-break-word">{selectedOrder.shippingDetails?.address || 'Not provided'}</dd>
                  </div>
                  <div>
                    <dt className="text-xs text-neutral-500">Postal code</dt>
                    <dd className="mt-0.5">{selectedOrder.shippingDetails?.postalCode || 'Not provided'}</dd>
                  </div>
                </dl>
              </div>

              <div>
                <div className="mb-2 flex items-center justify-between gap-3">
                  <p className="text-xs font-semibold uppercase tracking-wide text-neutral-500">Items</p>
                  <time className="text-xs text-neutral-500" dateTime={selectedOrder.createdAt}>
                    {formatOrderDate(selectedOrder.createdAt)}
                  </time>
                </div>
                <p className="mb-2 text-xs font-medium capitalize text-[#52645a]">Status: {selectedOrder.orderStatus || 'pending'}</p>
                <ul className="divide-y divide-neutral-200 border-y border-neutral-200">
                  {selectedOrder.products.map((item, index) => {
                    const lineTotal = item.calculatedPrice ?? (item.product?.price ?? 0) * item.quantity

                    return (
                      <li key={`${selectedOrder._id}-${index}`} className="flex items-center justify-between gap-4 py-3 text-sm">
                        <div className="flex min-w-0 items-center gap-3">
                          <div className="relative size-12 shrink-0 overflow-hidden bg-neutral-100">
                            <Image
                              src={item.product?.image || '/Hero.png'}
                              alt={item.product?.name || 'Ordered product'}
                              fill
                              unoptimized
                              sizes="48px"
                              className="object-cover"
                            />
                          </div>
                          <div className="min-w-0">
                            <p className="truncate font-medium">{item.product?.name || 'Product unavailable'}</p>
                            <p className="mt-0.5 text-xs text-neutral-500">
                              Qty {item.quantity} · {currency.format(lineTotal / item.quantity)} each
                            </p>
                          </div>
                        </div>
                        <p className="shrink-0 font-semibold">{currency.format(lineTotal)}</p>
                      </li>
                    )
                  })}
                </ul>
              </div>

              <div className="flex items-center justify-between border-t border-neutral-200 pt-4">
                <span className="text-sm font-semibold">Order total</span>
                <span className="text-base font-semibold">{currency.format(getOrderTotal(selectedOrder))}</span>
              </div>
            </div>
          </section>
        </div>
      )}

      {isEditorOpen && (
        <ProductEditor
          key={editingProduct?.id ?? 'new-product'}
          product={editingProduct}
          onSave={saveProduct}
          isSaving={isSaving}
          onCancel={() => {
            setEditingProduct(null)
            setIsEditorOpen(false)
          }}
        />
      )}
    </main>
  )
}