import Image from "next/image";
import Link from "next/link";
import { ArrowDown, ShoppingCart } from "lucide-react";

const products = [
  { name: "Vintage Roadster", image: "/car.jpg", category: "Automotive" },
  { name: "City Commuter", image: "/bike.png", category: "Automotive" },
  { name: "Skybound Jet", image: "/airplane.jpg", category: "Aviation" },
  { name: "Chess Knight", image: "/chess.jpg", category: "Games & hobbies" },
  { name: "Modernist Home", image: "/architecture.jpg", category: "Home & decor" },
  { name: "Pilot Bust", image: "/character.jpg", category: "Collectibles" },
  { name: "Falcon Fighter", image: "/fighter_jett.jpg", category: "Aviation" },
  { name: "The Maker", image: "/Hero.png", category: "Collectibles" },
];

export default function CategoriesPage() {
  return (
    <main className="bg-[#faf9f6] text-[#202a26]">
      <section className="relative mx-auto h-[300px] max-w-[1600px] overflow-hidden bg-[#283b35] sm:h-[360px] lg:h-[420px]">
        <Image
          src="/Hero_section.jpg"
          alt="A selection of detailed 3D-printed designs"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#14231f]/85 via-[#14231f]/50 to-transparent" />
        <div className="relative flex h-full max-w-7xl flex-col justify-center px-6 text-white sm:px-10 lg:px-16">
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-[#d6b78b]">
            The Buymart collection
          </p>
          <h1 className="max-w-xl text-4xl font-semibold leading-tight sm:text-5xl lg:text-6xl">
            Little details. Lasting delight.
          </h1>
          <p className="mt-4 max-w-md text-sm leading-6 text-white/80 sm:text-base">
            Discover characterful 3D-printed pieces for your desk, shelf, and next adventure.
          </p>
          <Link
            href="#products"
            className="mt-7 inline-flex w-fit items-center gap-2 text-sm font-semibold text-white transition-colors hover:text-[#e4c99f] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
          >
            Explore the collection <ArrowDown aria-hidden="true" size={16} />
          </Link>
        </div>
      </section>

      <section id="products" className="mx-auto max-w-7xl px-5 py-12 sm:px-8 sm:py-16 lg:px-12">
        <div className="mb-7 flex items-end justify-between gap-4 sm:mb-9">
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#78847b]">
              Made to be discovered
            </p>
            <h2 className="text-2xl font-semibold sm:text-3xl">Shop all products</h2>
          </div>
          <span className="pb-1 text-sm text-[#78847b]">{products.length} pieces</span>
        </div>

        <div className="grid grid-cols-2 gap-x-3 gap-y-6 sm:gap-x-5 sm:gap-y-8 lg:grid-cols-4">
          {products.map((product) => (
            <Link
              key={product.name}
              href={`/products/${encodeURIComponent(product.category.toLowerCase())}`}
              aria-label={`View ${product.name}, ${product.category}`}
              className="group relative block overflow-hidden rounded-sm bg-[#e9e7e0] outline-none focus-visible:ring-2 focus-visible:ring-[#31493e] focus-visible:ring-offset-4"
            >
              <div className="relative aspect-[4/5] overflow-hidden">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04] group-focus-visible:scale-[1.04]"
                />
                <div className="absolute inset-0 flex items-end justify-between gap-3 bg-gradient-to-t from-[#14231f]/85 via-[#14231f]/10 to-transparent p-3 opacity-100 transition-opacity duration-300 [@media(hover:hover)]:opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100 sm:p-4">
                  <div className="translate-y-0 transition-transform duration-300 [@media(hover:hover)]:translate-y-2 group-hover:translate-y-0 group-focus-visible:translate-y-0">
                    <p className="mb-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-white/70 sm:text-xs">
                      {product.category}
                    </p>
                    <h3 className="text-sm font-semibold text-white sm:text-lg">{product.name}</h3>
                  </div>
                  <span
                    aria-hidden="true"
                    className="mb-0.5 inline-flex size-9 shrink-0 items-center justify-center rounded-full bg-white text-[#202a26] shadow-sm transition-transform duration-300 group-hover:scale-100 group-focus-visible:scale-100 [@media(hover:hover)]:scale-90"
                  >
                    <ShoppingCart size={16} strokeWidth={1.8} />
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}