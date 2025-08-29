
import { getCategories } from "@/lib/product/categories";
import { Plus } from "lucide-react";
import Link from "next/link";
import CategoriesTable from "./CategoriesTable";

export default async function CategoriesPage() {
  const categories = await getCategories();

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Gestionar Categorías</h1>
        <Link href="/admin/categories/new">
          <button className="bg-blue-500 text-white px-4 py-2 rounded flex items-center">
            <Plus className="mr-2" />
            Añadir Categoría
          </button>
        </Link>
      </div>
      <CategoriesTable categories={categories} />
    </div>
  );
}
