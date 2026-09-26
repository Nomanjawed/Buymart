import React from 'react'

const Why3Dprinted = () => {
  return (
    <div className=" mt-20 py-16 ">
      <div className="mb-8 text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-gray-500">
          Why us
        </p>
        <h2 className="mt-2 text-3xl font-bold text-gray-900">Why choose 3D printing?</h2>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3 md:grid-rows-2">
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900">1</h3>
          <p className="mt-2 text-sm text-gray-600">Write your content here.</p>
        </div>
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900">2</h3>
          <p className="mt-2 text-sm text-gray-600">Write your content here.</p>
        </div>
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900">3</h3>
          <p className="mt-2 text-sm text-gray-600">Write your content here.</p>
        </div>
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm md:col-span-2">
          <h3 className="text-lg font-semibold text-gray-900">4</h3>
          <p className="mt-2 text-sm text-gray-600">Write your content here.</p>
        </div>
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm md:col-start-3">
          <h3 className="text-lg font-semibold text-gray-900">5</h3>
          <p className="mt-2 text-sm text-gray-600">Write your content here.</p>
        </div>
      </div>
    </div>
  )
}

export default Why3Dprinted