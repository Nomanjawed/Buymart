import React from 'react'

const Why3Dprinted = () => {
  return (
    <div className=" mt-20 py-16 ">
      <div className="mb-8 text-center">
        
        <h2 className="mt-2 text-3xl font-bold text-gray-900">Why choose 3D printing?</h2>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3 md:grid-rows-2 px-10">
        
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <h3 className="text-2xl font-semibold text-gray-900">Precision Printing</h3>
            <img src="/airplane.jpg" alt="" />
          <p className="mt-2 text-sm text-gray-600">We create detailed, accurate prints with consistent quality and clean finishes.</p>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <h3 className="text-2xl font-semibold text-gray-900">Custom Designs</h3>
          <p className="mt-2 text-sm text-gray-600">Turn your ideas into unique 3D products made specifically to match your vision.</p>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <h3 className="text-2xl font-semibold text-gray-900">Quality Materials</h3>
          <p className="mt-2 text-sm text-gray-600">We use reliable materials to create prints that are durable, functional, and built to last.</p>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm md:col-span-2 h-[350]">
          <h3 className="text-2xl font-semibold text-gray-900">Fast & Reliable</h3>
          <p className="mt-2 text-sm text-gray-600">From prototypes to final products, we focus on efficient production and dependable delivery.</p>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm md:col-start-3 h-[350]">
          <h3 className="text-2xl font-semibold text-gray-900">Customer Focused</h3>
          <p className="mt-2 text-sm text-gray-600">We work closely with you to make sure every project meets your expectations.</p>
        </div>
      </div>
    </div>
  )
}

export default Why3Dprinted