"use client";

import { Product, Category } from "@/lib/types";
import Link from "next/link";
import { SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import ProductGrid from "@/components/product-grid";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useEffect, useState } from "react";

interface ClientProps {
  products: Product[];
  category: Category;
  categories: Category[];
  params: {
    id: string;
  };
}

export default function CategoryClientPage({
  products,
  category,
  categories,
  params,
}: ClientProps) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  return (
    <div className="container mx-auto px-4 py-8">
      <nav className="flex items-center gap-2 mb-8">
        <Link href="/" className="text-muted-foreground hover:text-foreground">
          Home
        </Link>
        <span className="text-muted-foreground">/</span>
        <Link
          href="/categories"
          className="text-muted-foreground hover:text-foreground"
        >
          Categories
        </Link>
        <span className="text-muted-foreground">/</span>
        <span className="font-medium">{category.name}</span>
      </nav>

      <div className="lg:grid lg:grid-cols-4 lg:gap-8">
        <div className="lg:hidden mb-4">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" className="w-full">
                <SlidersHorizontal className="mr-2 h-4 w-4" />
                Filters
              </Button>
            </SheetTrigger>
            <SheetContent side="left">
              <SheetHeader>
                <SheetTitle>Categories</SheetTitle>
              </SheetHeader>
              <CategoryList categories={categories} currentId={category.id} />
            </SheetContent>
          </Sheet>
        </div>

        <div className="hidden lg:block space-y-6">
          <h2 className="text-lg font-semibold mb-4">Categories</h2>
          <CategoryList categories={categories} currentId={category.id} />
        </div>

        <div className="lg:col-span-3">
          <header className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold">{category.name}</h1>
            <span className="text-sm text-muted-foreground">
              {products.length} products
            </span>
          </header>
          <ProductGrid products={products} />
        </div>
      </div>
    </div>
  );
}

function CategoryList({
  categories,
  currentId,
}: {
  categories: Category[];
  currentId: number;
}) {
  return (
    <div className="space-y-2">
      {categories.map((cat) => (
        <Link
          key={cat.id}
          href={`/category/${cat.id}`}
          className={`block p-2 rounded-lg transition-colors ${
            cat.id === currentId
              ? "bg-accent font-medium"
              : "hover:bg-accent/50"
          }`}
        >
          {cat.name}
        </Link>
      ))}
    </div>
  );
}
