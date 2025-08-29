import { getCategoriesWithProductCounts } from '@/lib/product/categories';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const categories = await getCategoriesWithProductCounts();

    const formattedCategories = categories.map(category => ({
      id: category.id,
      name: category.categoryName,
      slug: category.slug, // Agregar la propiedad slug
      mainImage: category.mainImage,
      productCount: category._count.products,
    }));

    return NextResponse.json({ categories: formattedCategories });
  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json(
      { error: 'Error fetching categories' },
      { status: 500 },
    );
  }
}
