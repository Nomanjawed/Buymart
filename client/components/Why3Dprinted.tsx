import Image from 'next/image'

const Why3Dprinted = () => {
  const benefits = [
    {
      title: 'Precision Printing',
      description: 'We create detailed, accurate prints with consistent quality and clean finishes.',
      image: '/precision.jpg',
      className: '',
    },
    {
      title: 'Custom Designs',
      description: 'Turn your ideas into unique 3D products made specifically to match your vision.',
      image: '/custom-design.jpg',
      className: '',
    },
    {
      title: 'Quality Materials',
      description: 'We use reliable materials to create prints that are durable, functional, and built to last.',
      image: '/quality-material.jpg',
      className: '',
    },
    {
      title: 'Fast & Reliable',
      description: 'From prototypes to final products, we focus on efficient production and dependable delivery.',
      image: '/fast-reliable.jpg',
      className: 'md:col-span-2',
    },
    {
      title: 'Customer Focused',
      description: 'We work closely with you to make sure every project meets your expectations.',
      image: '/customer-focused.jpg',
      className: 'md:col-start-3',
    },
  ]

  return (
    <section className="mb-6 py-6 md:py-10 md:mt-6">
      <div className="mb-8 text-center">
        <h2 className="mt-2 text-3xl font-light md:text-5xl text-gray-900 font-bebas-neue">Why choose 3D printing?</h2>
      </div>

      <div className=" grid auto-rows-65 grid-cols-1 font-poppins gap-4 px-5 sm:px-10 md:h-215 md:grid-cols-3 md:grid-rows-2">
        {benefits.map((benefit) => (
          <article
            key={benefit.title}
            className={`group relative isolate overflow-hidden rounded-xl bg-neutral-800 ${benefit.className}`}
          >
            <Image
              src={benefit.image}
              alt=""
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 66vw, 50vw"
              className="-z-20 object-cover transition-transform duration-500 group-hover:scale-[1.03]"
            />
            <div aria-hidden="true" className="absolute inset-0 -z-10 bg-linear-to-t from-black/85 via-black/35 to-black/5" />
            <div className="absolute inset-x-0 bottom-0 p-5 text-white sm:p-7">
              <h3 className="text-md font-semibold sm:text-2xl">{benefit.title}</h3>
              <p className="mt-2 max-w-xl text-xs  leading-5 sm:text-sm sm:leading-6 text-white/85">{benefit.description}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}

export default Why3Dprinted