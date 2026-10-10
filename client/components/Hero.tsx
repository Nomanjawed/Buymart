import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

const Hero = () => {
  return (
    <section className="relative isolate h-[70svh] min-h-[520px] max-h-[760px] overflow-hidden bg-neutral-800">
      <Image
        src="/Hero_section.jpg"
        alt="A collection of detailed 3D-printed models"
        fill
        priority
        unoptimized
        sizes="100vw"
        className="object-cover object-center"
      />
      <div aria-hidden="true" className="absolute inset-0 bg-linear-to-r from-black/65 via-black/25 to-transparent" />

      <div className="relative z-10 mx-auto flex h-full max-w-7xl items-center px-6 sm:px-10">
        <div className="max-w-xl">
          <p className="mb-5 flex items-center gap-2 text-sm border border-y-0 border-r-0 pl-3 border-l-red-800 font-medium tracking-widest text-red-800">
             3D PRINTED MODELS
          </p>
          <h1 className="font-mono font-bebas-neue text-3xl font-light leading-4 md:leading-tight tracking-wide text-white sm:text-5xl">
            Some Things Deserve
            <span className="mt-1 block text-4xl sm:text-6xl">More Than a Screen</span>
          </h1>
          <Link href="/categories" className="mt-7 inline-flex rounded-md bg-black px-4 py-3 text-sm font-medium font-poppins text-white transition-colors hover:bg-white hover:text-black">
            Explore The Collection
          </Link>
        </div>
      </div>
    </section>
  )
}

export default Hero
