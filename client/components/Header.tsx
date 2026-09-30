import { ShoppingCartMinus, UserRound } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

const Header = () => {

const navItems =[
    { name: "HOME", path: "/" },
    { name: "CATEGORIES", path: "/categories" },
    { name: "CONTACT", path: "/contact" },
    { name: "LOGIN", path: "/auth" },
   

]

  return (
    <header className="py-3">
      <div className="mx-3 flex justify-between items-center ">
        <div className="text-xl font-bold px-4 tracking-widest font-mono ">BUYMART</div>
        <nav>
          <ul className="flex gap-4">
            {navItems.map((item) => (
              <li key={item.path}>
                <Link href={item.path} className="hover:text-gray-300 text-sm font-semibold">
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>


        <div className='flex gap-4 pr-4'>

            <Link href="/dashboard" aria-label="Your account" className="rounded-sm outline-none focus-visible:ring-2 focus-visible:ring-[#a53b2b]">
              <UserRound aria-hidden="true" />
            </Link>
            <ShoppingCartMinus />
        </div>
      </div>
    </header>
  )
}

export default Header