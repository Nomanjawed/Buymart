import Image from 'next/image'
import React from 'react'

const Hero = () => {
  return (
<div className=" h-[100vh] w-full">
    <div className="bg-gray-400 h-200 relative overflow-hidden">

        <Image
          src="/Hero.png"
          alt="Hero"
          layout="fill"
          objectFit="cover"
        />
      
    <div className="absolute bottom-60 left-5  text-center">
        <h1 className="text-2xl font-bold px-4 tracking-widest font-mono text-slate-50">Welcome to BUYMART</h1>
        <button className="bg-black text-white px-4 py-2 rounded-md hover:bg-slate-50 hover:text-black"   >Get Started</button>
    </div>
   
    </div>

</div>
  )
}

export default Hero
