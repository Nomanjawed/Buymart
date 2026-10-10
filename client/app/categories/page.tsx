import Image from "next/image";
import Link from "next/link";
import { ArrowDown } from "lucide-react";
import AddToCartButton from "@/components/cart/AddToCartButton";

const products = [
  { id: "vintage-roadster", name: "Vintage Roadster", image: "/car.jpg", category: "Automotive", categorySlug: "cars", price: 28 },
  { id: "city-commuter", name: "City Commuter", image: "/bike.png", category: "Automotive", categorySlug: "bikes", price: 24 },
  { id: "skybound-jet", name: "Skybound Jet", image: "/airplane.jpg", category: "Aviation", categorySlug: "aircraft", price: 32 },
  { id: "chess-knight", name: "Chess Knight", image: "/chess.jpg", category: "Games & hobbies", categorySlug: "chess", price: 16 },
  { id: "modernist-home", name: "Modernist Home", image: "/architecture.jpg", category: "Home & decor", categorySlug: "architecture", price: 36 },
  { id: "pilot-bust", name: "Pilot Bust", image: "/character.jpg", category: "Collectibles", categorySlug: "character", price: 22 },
  { id: "falcon-fighter", name: "Falcon Fighter", image: "/fighter_jett.jpg", category: "Aviation", categorySlug: "fighter-jets", price: 34 },
  { id: "the-maker", name: "The Maker", image: "/Hero.png", category: "Collectibles", categorySlug: "character", price: 26 },
];

export default function CategoriesPage() {
  return (
    <main className="bg-[#faf9f6] text-[#202a26]">
      <section className="relative mx-auto h-75 max-w-[1600px] overflow-hidden bg-[#283b35] sm:h-90 lg:h-105">
        <Image
          src="/Hero_section.jpg"
          alt="A selection of detailed 3D-printed designs"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-linear-to-r from-[#14231f]/85 via-[#14231f]/50 to-transparent" />
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
            <article key={product.id} className="group overflow-hidden rounded-sm bg-white ring-1 ring-black/5">
              <div className="relative aspect-4/5 overflow-hidden bg-[#e9e7e0]">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04] group-focus-visible:scale-[1.04]"
                />
                <Link
                  href={`/products/${product.categorySlug}`}
                  aria-label={`Browse ${product.category} products`}
                  className="absolute inset-0 z-10 rounded-sm outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#31493e]"
                />
                <div className="pointer-events-none absolute inset-0 z-20 flex items-end justify-between gap-3 bg-linear-to-t from-[#14231f]/85 via-[#14231f]/10 to-transparent p-3 opacity-100 transition-opacity duration-300 [@media(hover:hover)]:opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 sm:p-4">
                  <div className="translate-y-0 transition-transform duration-300 [@media(hover:hover)]:translate-y-2 group-hover:translate-y-0 group-focus-within:translate-y-0">
                    <p className="mb-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-white/70 sm:text-xs">
                      {product.category}
                    </p>
                    <h3 className="text-sm font-semibold text-white sm:text-lg">{product.name}</h3>
                  </div>
                  <AddToCartButton product={product} />
                </div>
              </div>
              <div className="flex items-center justify-between gap-2 px-3 py-3 sm:px-4">
                <span className="truncate text-xs text-[#78847b]">{product.category}</span>
                <span className="shrink-0 text-sm font-semibold">${product.price.toFixed(2)}</span>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}