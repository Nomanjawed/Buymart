import About from '@/components/About'
import Categories from '@/components/Categories'
import Hero from '@/components/Hero'
import MadeFromImagination from '@/components/MadeFromImagination'
import ThePossibility from '@/components/ThePossibility'
import Why3Dprinted from '@/components/Why3Dprinted'
import React from 'react'

const page = () => {
  return (
   <>
   <Hero />
   <Categories />
   <MadeFromImagination />  
   <About />
   <ThePossibility /> 
   <Why3Dprinted />
   </>  

  )
}

export default page