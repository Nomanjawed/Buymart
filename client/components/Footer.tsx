const Footer = () => {
  return (
    <footer className="mt-auto bg-slate-100 text-neutral-800">
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-x-6 gap-y-9 px-5 py-10 sm:px-8 md:grid-cols-4 md:gap-8 lg:px-10">
        <div className="col-span-2 md:col-span-1">
          <p className="font-mono text-xl font-bold tracking-widest">BuyMart</p>
        </div>

        <nav aria-label="Footer navigation" className="flex flex-col items-start gap-3 text-sm">
          <h2 className="mb-1 text-xs font-semibold uppercase tracking-[0.14em] text-neutral-500">Explore</h2>
          <span>Home</span>
          <span>About</span>
          <span>Categories</span>
          <span>Contact Us</span>
        </nav>

        <nav aria-label="Policies" className="flex flex-col items-start gap-3 text-sm">
          <h2 className="mb-1 text-xs font-semibold uppercase tracking-[0.14em] text-neutral-500">Policies</h2>
          <span>Privacy policy</span>
          <span>Return policy</span>
          <span>Terms &amp; conditions</span>
        </nav>

        <div className="flex flex-col items-start gap-3 text-sm">
          <h2 className="mb-1 text-xs font-semibold uppercase tracking-[0.14em] text-neutral-500">Follow us</h2>
          <span>Instagram</span>
          <span>Facebook</span>
          <span>TikTok</span>
          <span>X</span>
        </div>
      </div>

      <div className="border-t border-neutral-300 px-5 py-4 sm:px-8 lg:px-10">
        <p className="mx-auto max-w-7xl text-center text-xs text-neutral-600 sm:text-left">
          © 2026 BuyMart. All rights reserved.
        </p>
      </div>
    </footer>
  )
}

export default Footer