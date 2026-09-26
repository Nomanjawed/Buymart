"use client";
import Image from "next/image";
import React, { useState } from "react";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const Categories = () => {
  
  const categories = [
    { name: "Cars", path: "/", image: "/car.jpg" },
    { name: "Bikes", path: "/", image: "/bike.png" },
    { name: "Aircraft", path: "/", image: "/airplane.jpg" },
    { name: "Fighter Jets", path: "/", image: "/fighter_jett.jpg" },
    { name: "Chess", path: "/", image: "/chess.jpg" },
    { name: "Ships", path: "/", image: "" },
    { name: "Architecture", path: "/", image: "/architecture.jpg" },
    { name: "Character", path: "/", image: "/character.jpg" },
  ];

  const featuredProducts = [
    { name: "Cars", path: "/" },
    { name: "Aircraft", path: "/" },
    { name: "Architecture", path: "/" },
    { name: "Character", path: "/" },
  ];

  return (
    <div className="h-full">
      
                            {/* // SHOP BY CATEGORIES */}

      <div className="px-10 py-10 text-2xl mt-8 text-center text font-semibold">
        <h1>SHOP BY CATEGORIES</h1>
      </div>

      <div
        className="
      flex overflow-x-auto px-2 md:px-6 py-2 gap-6 md:gap-12 scrollbar-none [&::-webkit-scrollbar]:hidden select-none shrink-0  "
      >
        {categories.map(() => (
          <Card className="relative mx-auto bg-amber-100 w-[250px] h-[300px]  pt-0 shrink-0">
            <div className="absolute inset-0 z-30 aspect-video bg-black/35" />
            <Image
              src="/car.jpg"
              alt="Event cover"
              width={50}
              height={50}
              className="relative z-20 aspect-video w-full object-cover brightness-60 grayscale dark:brightness-40"
            />
            <CardHeader>
              <CardAction>
                <Badge variant="secondary">Featured</Badge>
              </CardAction>
              <CardTitle>Design systems meetup</CardTitle>
              <CardDescription>
                A practical talk on component APIs, accessibility, and shipping
                faster.
              </CardDescription>
            </CardHeader>
            <CardFooter>
              <Button className="w-full">View Event</Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      {/* FEATURED PRODUCTS */}
     
{/* 

 <div className="px-10 py-10 text-2xl mt-8 text-center">
        <h1>FEATURED PRODUCTS</h1>
        <div className="mt-8 flex justify-center flex-wrap gap-8 overflow-x-auto overflow-y-hidden no-scrollbar ">
          {featuredProducts.map((product) => (
            <div
              key={product.name}
              className="w-64 overflow-hidden rounded-xl border bg-white shadow-md "
            >
              <label className="flex h-40 cursor-pointer items-center justify-center bg-gray-100">
                {productImages[`featured-${product.name}`] ? (
                  <img
                    src={productImages[`featured-${product.name}`]}
                    alt={product.name}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <span className="text-sm text-gray-500">
                    Upload product image
                  </span>
                )}
              </label>
              <a
                href={product.path}
                className="block p-5 text-center text-xl font-semibold"
              >
                {product.name}
              </a>
            </div>
          ))}
        </div>
      </div> */}


    </div>
  );
};

export default Categories;
