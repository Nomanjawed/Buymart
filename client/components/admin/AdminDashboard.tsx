'use client'

import Image from 'next/image'
import {
  ClipboardList,
  ImagePlus,
  LayoutDashboard,
  LogOut,
  Package,
  Pencil,
  Plus,
  Search,
  ShieldCheck,
  Trash2,
  X,
} from 'lucide-react'
import { useMemo, useState, type FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import { logout } from '@/utils/api'

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

function ProductEditor({
  product,
  onSave,
  onCancel,
}: {
  product: Product | null
  onSave: (draft: ProductDraft) => void
  onCancel: () => void
}) {
  const [draft, setDraft] = useState<ProductDraft>(product ?? emptyDraft)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadError, setUploadError] = useState('')

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

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    onSave({ ...draft, price: Number(draft.price) })
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
              <input
                required
                maxLength={60}
                value={draft.category}
                onChange={(event) => setDraft({ ...draft, category: event.target.value })}
                placeholder="e.g. Cars"
                className="h-11 w-full border border-neutral-300 px-3 font-normal outline-none focus:border-[#31493e] focus:ring-2 focus:ring-[#31493e]/15"
              />
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
              className="h-10 border border-neutral-300 px-4 text-sm font-medium hover:bg-neutral-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isUploading || !draft.image}
              className="h-10 bg-[#243b33] px-4 text-sm font-semibold text-white transition hover:bg-[#182a24] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {product ? 'Save changes' : 'Add product'}
            </button>
          </div>
        </form>
      </section>
    </div>
  )
}

export default function AdminDashboard() {
  const router = useRouter()
  const [activeView, setActiveView] = useState<DashboardView>('products')
  const [products, setProducts] = useState<Product[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [isEditorOpen, setIsEditorOpen] = useState(false)
  const [notice, setNotice] = useState('')

  const filteredProducts = useMemo(() => {
    const query = searchQuery.trim().toLowerCase()
    if (!query) return products

    return products.filter((product) =>
      `${product.name} ${product.category}`.toLowerCase().includes(query),
    )
  }, [products, searchQuery])

  function saveProduct(draft: ProductDraft) {
    if (editingProduct) {
      setProducts((currentProducts) => currentProducts.map((product) =>
        product.id === editingProduct.id ? { ...draft, id: editingProduct.id } : product,
      ))
      setNotice('Product changes saved in this session.')
    } else {
      setProducts((currentProducts) => [
        { ...draft, id: globalThis.crypto.randomUUID() },
        ...currentProducts,
      ])
      setNotice('Product added to this session.')
    }

    setEditingProduct(null)
    setIsEditorOpen(false)
  }

  function deleteProduct(product: Product) {
    if (!window.confirm(`Delete ${product.name}?`)) return

    setProducts((currentProducts) => currentProducts.filter((item) => item.id !== product.id))
    setNotice('Product removed from this session.')
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

  return (
    <main className="min-h-[75vh] flex-1 bg-[#f3f4f0] text-[#1e2924]">
      <div className="mx-auto max-w-360 px-4 py-7 sm:px-7 sm:py-10 lg:px-10">
        <header className="mb-8 flex flex-wrap items-end justify-between gap-5 border-b border-[#d9ddd6] pb-6">
          <div>
            <p className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#a53b2b]">
              <ShieldCheck size={15} aria-hidden="true" /> Buymart / Admin console
            </p>
            <h1 className="text-3xl font-semibold sm:text-4xl">Store operations</h1>
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
              className={`inline-flex h-11 shrink-0 items-center gap-3 px-3 text-sm font-medium transition lg:w-full ${activeView === 'products' ? 'bg-[#243b33] text-white' : 'text-neutral-600 hover:bg-white'}`}
            >
              <Package size={17} aria-hidden="true" /> Products
            </button>
            <button
              type="button"
              aria-current={activeView === 'orders' ? 'page' : undefined}
              onClick={() => setActiveView('orders')}
              className={`inline-flex h-11 shrink-0 items-center gap-3 px-3 text-sm font-medium transition lg:w-full ${activeView === 'orders' ? 'bg-[#243b33] text-white' : 'text-neutral-600 hover:bg-white'}`}
            >
              <ClipboardList size={17} aria-hidden="true" /> Orders
            </button>
          </nav>

          <div className="min-w-0">
            {notice && (
              <p role="status" className="mb-5 border-l-2 border-emerald-700 bg-white px-4 py-3 text-sm text-emerald-900">
                {notice} Product data is not connected to the API yet.
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
                    <p className="text-xs text-neutral-500">Products in this session</p>
                    <p className="mt-1 text-2xl font-semibold">{products.length}</p>
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

                  {filteredProducts.length ? (
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
                              onClick={() => deleteProduct(product)}
                              className="inline-flex size-9 items-center justify-center text-[#a53b2b] hover:bg-red-50"
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
              </section>
            ) : (
              <section aria-labelledby="orders-title">
                <div className="mb-6">
                  <p className="mb-1 text-xs font-semibold uppercase tracking-[0.16em] text-[#78847b]">Fulfillment</p>
                  <h2 id="orders-title" className="text-2xl font-semibold">Orders</h2>
                </div>

                <div className="mb-5 grid gap-3 sm:grid-cols-3">
                  {['All orders', 'Processing', 'Completed'].map((label) => (
                    <div key={label} className="border border-[#d9ddd6] bg-white px-4 py-3">
                      <p className="text-xs text-neutral-500">{label}</p>
                      <p className="mt-1 text-2xl font-semibold">—</p>
                    </div>
                  ))}
                </div>

                <div className="overflow-x-auto border border-[#d9ddd6] bg-white">
                  <table className="w-full min-w-170 text-left">
                    <thead className="border-b border-neutral-200 bg-[#f8f9f6] text-[11px] font-semibold uppercase tracking-[0.12em] text-neutral-500">
                      <tr>
                        <th className="px-5 py-3">Order</th>
                        <th className="px-5 py-3">Customer</th>
                        <th className="px-5 py-3">Items</th>
                        <th className="px-5 py-3">Placed</th>
                        <th className="px-5 py-3 text-right">Total</th>
                        <th className="px-5 py-3">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td colSpan={6} className="px-5 py-16 text-center">
                          <ClipboardList size={26} aria-hidden="true" className="mx-auto text-neutral-400" />
                          <p className="mt-3 font-semibold">Order data isn&apos;t connected yet</p>
                          <p className="mt-1 text-sm text-neutral-500">Orders will appear here when the admin orders API is integrated.</p>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </section>
            )}
          </div>
        </div>
      </div>

      {isEditorOpen && (
        <ProductEditor
          key={editingProduct?.id ?? 'new-product'}
          product={editingProduct}
          onSave={saveProduct}
          onCancel={() => {
            setEditingProduct(null)
            setIsEditorOpen(false)
          }}
        />
      )}
    </main>
  )
}