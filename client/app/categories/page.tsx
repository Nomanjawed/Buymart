import Image from "next/image";
import Link from "next/link";
import { ArrowDown } from "lucide-react";
import ProductCatalog from "@/components/categories/ProductCatalog";

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

      <ProductCatalog />
    </main>
  );
}