import Image from 'next/image'

const ThePossibility = () => {
  return (
    <section className="relative isolate mt-3 flex min-h-60 items-center justify-center overflow-hidden bg-neutral-900 px-5 py-12 sm:min-h-64 sm:px-8 sm:py-16 ">
      <Image
        src="/thepossibility.jpg"
        alt=""
        fill
        unoptimized
        sizes="100vw"
        className="z-0 object-cover object-center"
      />
      <div aria-hidden="true" className="absolute inset-0 z-[1] bg-black/35" />

      <div className="relative z-10 mx-auto w-full max-w-3xl rounded-2xl border border-white/35 bg-white/15 px-5 py-7 text-center text-white shadow-xl backdrop-blur-md ring-1 ring-white/15 sm:px-10 sm:py-10">
        
        <h2 className="text-2xl font-bold font-poppins leading-tight sm:text-3xl lg:text-4xl">
          The Possibilities Are Almost Endless
        </h2>
        <p className="mx-auto mt-4 max-w-2xl font-poppins text-xs leading-5 text-white/90 sm:text-base sm:leading-7">
          From intricate models to completely custom creations, 3D printing turns imagination into something real.
        </p>
      </div>
    </section>
  )
}

export default ThePossibility