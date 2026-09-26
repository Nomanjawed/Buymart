import React from 'react'

const About = () => {
  return (
    <div className="flex w-full justify-center pt-50 pb-5 ">
        <div className="px-10 w-1/3">
            <img src="/about.png" alt="" />     
        </div>
        <div className="px-10 w-1/2 flex flex-col bg-gray-100 p-6">
            <h1 className=' text-4xl'>ABOUT US</h1>
            <p className='text-md mt-2'>We are a forward-thinking 3D printing startup focused on turning ideas into real, tangible products. From concept and prototyping to custom parts and finished designs, we use modern 3D printing technology to make production faster, smarter, and more accessible.
<p className= "mt-3">
Our journey began with a simple belief: great ideas should not be limited by traditional manufacturing methods. Today, we help individuals, designers, startups, engineers, and businesses bring their concepts to life with precision and creativity.</p>

<p className= "mt-3">Whether you need a single prototype, a customized product, or a small production run, our team works closely with you to understand your requirements and deliver practical solutions. We combine innovative technology, careful attention to detail, and a customer-first approach in everything we create.</p>

<p className= "mt-3">As we grow, our vision remains clear: to make 3D printing a powerful tool for creativity, innovation, and modern manufacturing.</p>
</p>
        </div>
    </div>
  )
}

export default About