const categoryNames: Record<string, string> = {
  cars: "Cars",
  bikes: "Bikes",
  aircraft: "Aircraft",
  "fighter-jets": "Fighter Jets",
  chess: "Chess",
  ships: "Ships",
  architecture: "Architecture",
  character: "Character",
};

export default async function CategoryPage({
  params,
}: PageProps<"/products/[category]">) {
  const { category } = await params;
  const categoryName = categoryNames[category];

  if (!categoryName) {
    return (
      <main className="flex-1 px-5 py-16 text-center">
        <h1 className="text-2xl font-semibold">Category not found</h1>
      </main>
    );
  }

  return (
    <main className="flex-1 px-5 py-16 text-center">
      <h1 className="text-3xl font-semibold">{categoryName}</h1>
      <p className="mt-3 text-neutral-600">
        Products in this category are coming soon.
      </p>
    </main>
  );
}