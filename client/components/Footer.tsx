import React from 'react'

const Footer = () => {

const navItems =[
    { name: "Home", path: "/" },
    { name: "Categories", path: "/categories" },
    { name: "Contact", path: "/contact" },
    { name: "Login", path: "/login" },
   

]

  return (
    <header className="bg-gray-800 text-white p-4">
      <div className="mx-10 flex justify-between items-center">
        <div className="text-lg font-bold ">My E-commerce</div>
        <nav>
          <ul className="flex gap-4">
            {navItems.map((item) => (
              <li key={item.path}>
                <a href={item.path} className="hover:text-gray-300">
                  {item.name}
                </a>
              </li>
            ))}
          </ul>
        </nav>


        <div className='flex gap-4'>
            <h1>Register</h1>
            <h1>CArt</h1>
        </div>
      </div>
    </header>
  )
}

export default Footer