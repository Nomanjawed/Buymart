import Image from 'next/image'

const About = () => {
  return (
    <section className="grid w-full grid-cols-1 pt-8 pb-6 md:pb-13 sm:pt-12 lg:grid-cols-2 lg:pt-16">
      <div className="relative aspect-[4/3] min-h-64 overflow-hidden bg-neutral-200 sm:aspect-[16/10] lg:aspect-auto lg:min-h-[640px]">
        <Image
          src="/About_us.jpg"
          alt="A detailed 3D-printed model from the Buymart collection"
          fill
          sizes="(max-width: 1024px) 100vw, 50vw"
          className="object-cover object-center"
        />
      </div>

      <div className="flex min-w-0 flex-col justify-center bg-gray-100 px-5 py-8 sm:px-8 sm:py-10 lg:px-10 lg:py-12 xl:px-16">
        <h2 className="text-3xl font-bebas-neue font-light leading-tight sm:text-4xl">
          From Imagination to Something You Can Hold
        </h2>
        <p className="mt-5 text-sm font-poppins leading-6 text-neutral-700 sm:text-base sm:leading-7">
          It started with a simple question:
          <span className="mt-2 block text-lg font-semibold leading-snug text-neutral-900 sm:text-xl">
            What if almost anything you can imagine could become something real?
          </span>
        </p>

        <p className="mt-4 text-sm font-poppins leading-5 text-neutral-700 sm:text-base md:leading-6 lg:leading-6">
          That question led us into <span className="font-semibold">3D printing</span>. What began as an interest in turning digital designs into physical objects grew into a bigger purpose: creating things that people can actually see, touch, display, and make their own. From detailed models and collectibles to functional objects, creative pieces, and completely customized designs, 3D printing gives ideas a way to exist beyond the screen.
        </p>

        <p className="mt-4 text-sm font-poppins leading-5 text-neutral-700 sm:text-base sm:leading-6">
          A car, a building, a character, a concept, a personal design, or something that has never been made before. If you can imagine it, we want to explore how we can create it. Our journey is about pushing that possibility further with every print. Because we believe the best part of 3D printing isn&apos;t simply making an object. It&apos;s turning an idea into something real.
        </p>

        <p className="mt-4 text-sm font-poppins leading-5 text-neutral-700 sm:text-base sm:leading-6">
          Whether you&apos;re a <span className="font-semibold">collector</span>, an <span className="font-semibold">enthusiast</span>, a <span className="font-semibold">gift hunter</span>, or simply someone who likes having unusual things around you, we want you to find something here that feels worth keeping.
        </p>

        <p className="mt-5 md:mt-5 text-lg italic font-poppins font-bold leading-relaxed text-neutral-900 md:text-2xl">
          <span className="font-semibold text-red-800">"</span>You don&apos;t have to be a collector to start collecting.
          <span className="font-semibold text-red-800">"</span>
        </p>
      </div>
    </section>
  )
}

export default About

