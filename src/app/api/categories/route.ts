// import { getCategoriesWithProductCounts } from '@/lib/product/categories';
// import { NextResponse } from 'next/server';

// export async function GET() {
//   try {
//     const categories = await getCategoriesWithProductCounts();

//     const formattedCategories = categories.map(category => ({
//       id: category.id,
//       name: category.categoryName,
//       slug: category.slug, // Agregar la propiedad slug
//       mainImage: category.mainImage,
//       productCount: category._count.products,
//     }));

//     return NextResponse.json({ categories: formattedCategories });
//   } catch (error) {
//     console.error('Error fetching categories:', error);
//     return NextResponse.json(
//       { error: 'Error fetching categories' },
//       { status: 500 },
//     );
//   }
// }
// app/api/categories/route.ts
import { getCategoriesWithProductCounts } from '@/lib/product/categories';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    console.log(
      'Iniciando búsqueda de categorías con getCategoriesWithProductCounts...',
    );

    const categories = await getCategoriesWithProductCounts();
    console.log('Categorías crudas:', categories);

    // Formatear las categorías al formato que espera el frontend
    const formattedCategories = categories.map(category => ({
      id: category.id,
      categoryName: category.categoryName, // Cambiado de 'name' a 'categoryName'
      slug: category.slug,
      // Incluir otras propiedades si son necesarias
      mainImage: category.mainImage,
      productCount: category._count.products,
    }));

    console.log('Categorías formateadas:', formattedCategories);

    return NextResponse.json({ categories: formattedCategories });
  } catch (error) {
    console.error('Error en /api/categories:', error);

    // En caso de error, devolver categorías de ejemplo en el formato correcto
    const fallbackCategories = [
      {
        id: '1',
        categoryName: 'Electrónica',
        slug: 'electronica',
        mainImage: '/images/electronics.jpg',
        productCount: 25,
      },
      {
        id: '2',
        categoryName: 'Ropa',
        slug: 'ropa',
        mainImage: '/images/clothing.jpg',
        productCount: 18,
      },
      {
        id: '3',
        categoryName: 'Hogar',
        slug: 'hogar',
        mainImage: '/images/home.jpg',
        productCount: 32,
      },
      {
        id: '4',
        categoryName: 'Deportes',
        slug: 'deportes',
        mainImage: '/images/sports.jpg',
        productCount: 15,
      },
      {
        id: '5',
        categoryName: 'Tecnología',
        slug: 'tecnologia',
        mainImage: '/images/technology.jpg',
        productCount: 28,
      },
    ];

    return NextResponse.json({ categories: fallbackCategories });
  }
}
