import Image from 'next/image'

const MadeFromImagination = () => {
  return (
    <section className="relative isolate mt-8 flex min-h-[360px] w-full items-center justify-center overflow-hidden bg-neutral-900 text-white sm:min-h-[440px] lg:min-h-[520px]">
      <Image
        src="/madefromimagination.jpg"
        alt="A 3D-printed model created from an imaginative design"
        fill
        unoptimized
        sizes="100vw"
        className="-z-20 object-cover object-center"
      />
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-linear-to-r from-black/65 via-black/40 to-black/30" />

      <div className="relative z-10 mx-auto max-w-4xl px-5 py-16 text-center sm:px-10">
        <h2 className="text-2xl font-light tracking-wider font-bebas-neue sm:text-4xl lg:text-5xl">Made From Imagination</h2>
        
        <p className="mt-5 font-poppins text-lg  text-white sm:text-xl lg:whitespace-nowrap lg:text-2xl">
          <span className="block leading-0 lg:inline">
            <span aria-hidden="true" className="mr-1 text-3xl text-red-800 sm:text-4xl">“</span>
            <i className="font-extrabold">IDEAS</i>
            <i> start in the mind.</i>
          </span>{' '}
          <span className="block leading-0 lg:inline">
            <i>We give them a </i><i className="font-extrabold">PHYSICAL</i><i> form.</i>
            <span aria-hidden="true" className="ml-1 text-3xl text-red-800 sm:text-4xl">”</span>
          </span>
        </p>
      </div>
    </section>
  )
}

export default MadeFromImagination