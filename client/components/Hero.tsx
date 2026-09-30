import Image from 'next/image'
import React from 'react'

const Hero = () => {
  return (
<div className=" h-[100vh] w-full">
    <div className="bg-gray-400 h-200 relative overflow-hidden">

        <Image
          src="/Hero_section.jpg"
          alt="Hero"
          layout="fill"
          objectFit="cover"
        />
      
    <div className="absolute top-50 left-5 px-6 ">
      <h1 className= "text-left font-semibold mb-5 mt-40 flex gap-2 items-center text-red-900">
        <span className="text-red-900"> | </span> 3D PRINTED MODELS</h1>

        <h1 className="text-2xl font-bold  tracking-widest text-left font-mono text-slate-50">Some Things Deserve 
          <h1 className="text-4xl font-bold  tracking-widest text-left font-mono text-slate-50 mb-5">More Than a Screen</h1>
        </h1>
                                                          {/* BUTTON */}
        <button className="bg-black text-white  py-2 rounded-md hover:bg-slate-50 hover:text-black px-3"   >Explore the Collection</button>
    </div>
   
    </div>

</div>
  )
}

export default Hero
