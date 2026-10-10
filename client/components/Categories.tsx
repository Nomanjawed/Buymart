import Image from "next/image";
import Link from "next/link";
import FeaturedProducts from "./categories/FeaturedProducts";

const Categories = () => {
  const categories = [
    { name: "Cars",  image: "/cars.jpg" },
    { name: "Bikes",  image: "/bikes.jpg" },
    { name: "Aircraft",  image: "/airplanes.jpg" },
    { name: "Fighter Jets",  image: "/fighterjet.jpg" },
    { name: "Chess",  image: "/chess-set.jpg" },
    { name: "Ships",  image: "/ships.jpg" },
    { name: "Architecture",  image: "/building.jpg" },
    { name: "Character",  image: "/characters.jpg" },
    { name: "Space",  image: "/space.jpg" },
  ];

  return (
    <section className="w-full mt-6 md:mt-18">

                                 {/* CHOOSE YOUR WORLD */}
      <div className="mb-3 px-5 text-center md:mb-10">
        <h2 className="text-3xl font-light md:text-5xl  font-bebas-neue">Choose Your World</h2>
      </div>

      <div
        aria-label="Shop by category"
        className="flex  gap-4 overflow-x-auto pt-3  md:pt-3 px-4 pb-3 md:gap-6 md:px-8 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >

        {categories.map((category) => (
          <Link
            key={category.name}
            href={`/products/${category.name}`}
            aria-label={`Browse ${category.name}`}
            className="group relative aspect-square w-48 shrink-0 snap-start overflow-hidden rounded-lg bg-neutral-200 outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-offset-2 md:w-56 "
          >
            {category.image ? (
              <Image
                src={category.image}
                alt=""
                fill
                sizes="(max-width: 768px) 192px, 224px"
                className="object-cover transition-transform duration-300 group-hover:scale-105 group-focus-visible:scale-105 "
              />
            ) : (
              <div
                aria-hidden="true"
                className="h-full w-full bg-[linear-gradient(145deg,#d7e3e5,#80969a)]"
              />
            )}
            <div className="absolute inset-0 flex items-end bg-gradient-to-t from-black/75 via-black/10 to-transparent p-4 opacity-0 transition-opacity duration-200 group-hover:opacity-100 group-focus-visible:opacity-100">
              <span className="translate-y-2 text-left text-lg font-semibold text-white transition-transform duration-200 group-hover:translate-y-0 group-focus-visible:translate-y-0">
                {category.name}
              </span>
            </div>
          </Link>
        ))}
      </div>
                                      {/* Featured Products */}
      <div className="mt-4 px-5 text-center md:mt-10 ">
        <h2 className="text-3xl font-light md:text-5xl font-bebas-neue">Featured Products</h2>
        <FeaturedProducts />
        <Link
        href={`/categories/`}
        className=" bg-black font-medium font-poppins  text-white rounded-md px-3 py-1 hover:bg-white hover:text-black   ">View All Products</Link>

      </div>
    </section>
  );
};

export default Categories;
