'use client'

import { ShoppingCartMinus, UserRound } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useCart } from '@/components/cart/CartProvider'
import { getMe, hasAuthToken } from '@/utils/api'

type HeaderUser = {
  fullname?: string
  username?: string
  email?: string
}

const Header = () => {
  const pathname = usePathname()
  const [user, setUser] = useState<HeaderUser | null>(null)
  const { itemCount } = useCart()

  const navItems = [
    { name: "HOME", path: "/" },
    { name: "CATEGORIES", path: "/categories" },
    { name: "CONTACT", path: "/contact" },
  ]

  useEffect(() => {
    let isActive = true

    function loadUser() {
      if (!hasAuthToken()) {
        setUser(null)
        return
      }

      getMe()
        .then((profile: HeaderUser) => {
          if (isActive) setUser(profile)
        })
        .catch(() => {
          if (isActive) setUser(null)
        })
    }

    if (hasAuthToken()) loadUser()
    window.addEventListener('buymart:auth-changed', loadUser)

    return () => {
      isActive = false
      window.removeEventListener('buymart:auth-changed', loadUser)
    }
  }, [pathname])

  const displayName = user?.fullname || user?.username
  const initial = (displayName?.trim().charAt(0) || user?.email?.charAt(0) || '?').toUpperCase()

  return (
    <header className="py-3">
      <div className="mx-3 flex items-center justify-between">
        <Link href="/" className="px-4 font-mono text-xl font-bold tracking-widest">BUYMART</Link>
        <nav>
          <ul className="flex gap-3 sm:gap-4">
            {navItems.map((item) => (
              <li key={item.path}>
                <Link href={item.path} className="text-xs font-semibold hover:text-gray-500 sm:text-sm">
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="flex items-center gap-3 pr-4 sm:gap-4">
          {user ? (
            <Link
              href="/dashboard"
              aria-label={displayName ? `Your account, ${displayName}` : 'Your account'}
              className="flex items-center gap-2 rounded-sm outline-none focus-visible:ring-2 focus-visible:ring-[#a53b2b]"
            >
              <span aria-hidden="true" className="flex size-8 items-center justify-center rounded-full bg-[#243b33] text-sm font-semibold text-white">
                {initial}
              </span>
              <span className="hidden max-w-32 truncate text-sm font-medium sm:inline">
                {displayName || 'Account'}
              </span>
            </Link>
          ) : (
            <Link href="/auth" className="text-xs font-semibold hover:text-[#a53b2b] sm:text-sm">
              <UserRound />
            </Link>
          )}
          <Link
            href="/cart"
            aria-label={`Shopping cart, ${itemCount} ${itemCount === 1 ? 'item' : 'items'}`}
            className="relative rounded-sm p-1 outline-none focus-visible:ring-2 focus-visible:ring-[#a53b2b]"
          >
            <ShoppingCartMinus aria-hidden="true" size={20} />
            {itemCount > 0 && (
              <span className="absolute -right-1 -top-1 flex min-w-4 items-center justify-center rounded-full bg-[#a53b2b] px-1 text-[10px] font-semibold leading-4 text-white">
                {itemCount > 99 ? '99+' : itemCount}
              </span>
            )}
          </Link>
        </div>
      </div>
    </header>
  )
}

export default Header