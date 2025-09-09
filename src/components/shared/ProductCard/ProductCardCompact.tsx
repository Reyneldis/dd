// // components/shared/ProductCard/ProductCardCompact.tsx
// 'use client';
// import { useCart } from '@/hooks/use-cart';
// import { ProductFull } from '@/types/product';
// import { Eye, Heart, ShoppingCart, Star } from 'lucide-react';
// import Image from 'next/image';
// import Link from 'next/link';
// import { useState } from 'react';
// import { toast } from 'sonner';

// interface ProductCardCompactProps {
//   product: ProductFull;
// }

// export default function ProductCardCompact({
//   product,
// }: ProductCardCompactProps) {
//   // Desestructurar solo las funciones que necesitas
//   const { addItem, isInCart } = useCart();
//   const [isWishlisted, setIsWishlisted] = useState(false);
//   const [isAdding, setIsAdding] = useState(false);

//   const handleAddToCart = async () => {
//     // Verificar que el producto exista
//     if (!product) {
//       console.error('Producto no válido');
//       toast.error('Producto no válido');
//       return;
//     }

//     // Verificar que el producto tenga un slug válido
//     if (!product.slug) {
//       console.error('El producto no tiene slug válido:', product);
//       toast.error('Producto no válido');
//       return;
//     }

//     setIsAdding(true);
//     try {
//       const mainImage =
//         product.images.find(img => img.isPrimary) || product.images[0];
//       const imageUrl = mainImage?.url || '/img/placeholder-category.jpg';

//       // Crear el objeto cartItem con la estructura correcta
//       const cartItem = {
//         id: product.id, // ID del producto
//         productName: product.productName || '',
//         price: typeof product.price === 'number' ? product.price : 0,
//         slug: product.slug,
//         image: imageUrl,
//         quantity: 1,
//       };

//       // Verificar si el producto ya está en el carrito
//       const productInCart = isInCart(product.slug);
//       if (productInCart) {
//         toast.warning(`${product.productName} ya está en el carrito`);
//       } else {
//         // Agregar al carrito
//         addItem(cartItem);
//         toast.success(`${product.productName} agregado al carrito`);
//       }
//     } catch (error) {
//       console.error('Error al agregar al carrito:', error);
//       toast.error('Error al agregar el producto al carrito');
//     } finally {
//       setIsAdding(false);
//     }
//   };

//   // Verificar que el producto exista antes de renderizar
//   if (!product) {
//     return (
//       <div className="bg-white dark:bg-slate-800 rounded-2xl overflow-hidden shadow-lg border border-slate-200 dark:border-slate-700 flex flex-col h-[320px] items-center justify-center">
//         <p className="text-red-500">Producto no disponible</p>
//       </div>
//     );
//   }

//   const mainImage =
//     product.images.find(img => img.isPrimary) || product.images[0];
//   const imageUrl = mainImage?.url || '/img/placeholder-category.jpg';

//   // Mock rating
//   const rating = 4.6;
//   const maxStars = 5;
//   const filledStars = Math.floor(rating);

//   return (
//     <div className="group relative bg-white dark:bg-slate-800 rounded-2xl overflow-hidden shadow-lg hover:shadow-xl border border-slate-200 dark:border-slate-700 transition-all duration-300 hover:scale-[1.02] flex flex-col h-[320px]">
//       {/* Imagen */}
//       <div className="relative w-full h-[180px] overflow-hidden bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-700 dark:to-slate-800">
//         <Link
//           href={product.slug ? `/products/${product.slug}` : '#'}
//           className="block w-full h-full"
//         >
//           <Image
//             src={imageUrl}
//             alt={product.productName || 'Producto'}
//             width={300}
//             height={180}
//             className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-110"
//             priority={false}
//           />
//         </Link>
//         {/* Botón favorito */}
//         <button
//           onClick={() => setIsWishlisted(!isWishlisted)}
//           className={`absolute top-2 right-2 p-1.5 rounded-full transition-all duration-300 ${
//             isWishlisted
//               ? 'bg-red-500 text-white shadow-lg'
//               : 'bg-white/90 dark:bg-slate-800/90 text-slate-600 dark:text-slate-400 hover:bg-red-500 hover:text-white'
//           }`}
//         >
//           <Heart
//             className={`h-3.5 w-3.5 ${isWishlisted ? 'fill-current' : ''}`}
//           />
//         </button>
//         {/* Badge destacado */}
//         {product.featured && (
//           <div className="absolute top-2 left-2">
//             <span className="inline-flex items-center px-2 py-1 rounded-full bg-gradient-to-r from-amber-400 to-orange-500 text-white text-xs font-bold shadow-md">
//               ⭐
//             </span>
//           </div>
//         )}
//       </div>

//       {/* Contenido */}
//       <div className="flex-1 flex flex-col p-4 space-y-3">
//         {/* Nombre y rating */}
//         <div className="space-y-2">
//           <Link
//             href={product.slug ? `/products/${product.slug}` : '#'}
//             className="block"
//           >
//             <h3 className="text-sm font-semibold text-slate-900 dark:text-white line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
//               {product.productName || 'Producto sin nombre'}
//             </h3>
//           </Link>
//           {/* Rating compacto */}
//           <div className="flex items-center gap-1">
//             <div className="flex items-center gap-0.5">
//               {[...Array(filledStars)].map((_, i) => (
//                 <Star
//                   key={i}
//                   className="h-3 w-3 text-yellow-400 fill-yellow-400"
//                 />
//               ))}
//               {[...Array(maxStars - filledStars)].map((_, i) => (
//                 <Star key={i + 'empty'} className="h-3 w-3 text-slate-300" />
//               ))}
//             </div>
//             <span className="text-xs text-slate-500 dark:text-slate-400 ml-1">
//               {rating}
//             </span>
//           </div>
//         </div>

//         {/* Categoría */}
//         <div className="flex items-center justify-between">
//           <span className="text-xs text-slate-500 dark:text-slate-400">
//             {product.category?.categoryName || 'Sin categoría'}
//           </span>
//         </div>

//         {/* Precio y botones */}
//         <div className="flex items-center justify-between pt-2">
//           <p className="text-lg font-bold text-yellow-500 dark:text-white">
//             $
//             {typeof product.price === 'number'
//               ? product.price.toFixed(2)
//               : '0.00'}
//           </p>
//           <div className="flex items-center gap-1.5">
//             <Link
//               href={product.slug ? `/products/${product.slug}` : '#'}
//               className="p-2 rounded-lg bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 hover:bg-blue-100 dark:hover:bg-blue-900/30 hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-200"
//               aria-label="Ver detalles"
//             >
//               <Eye className="h-4 w-4" />
//             </Link>
//             <button
//               onClick={handleAddToCart}
//               disabled={isAdding || !product.slug}
//               className={`p-2 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg ${
//                 product.slug && isInCart(product.slug)
//                   ? 'bg-green-500 hover:bg-green-600 text-white'
//                   : 'bg-blue-500 hover:bg-blue-600 text-white'
//               } ${isAdding ? 'opacity-50 cursor-not-allowed' : ''}`}
//               aria-label={
//                 product.slug && isInCart(product.slug)
//                   ? 'Producto en el carrito'
//                   : 'Añadir al carrito'
//               }
//             >
//               <ShoppingCart className="h-4 w-4" />
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* Efecto de brillo sutil */}
//       <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 pointer-events-none"></div>
//     </div>
//   );
// }
// components/shared/ProductCard/ProductCardCompact.tsx
'use client';
import { useCart } from '@/hooks/use-cart';
import { ProductFull } from '@/types/product';
import { Eye, Heart, ShoppingCart, Star } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { toast } from 'sonner';

interface ProductCardCompactProps {
  product: ProductFull;
}

export default function ProductCardCompact({
  product,
}: ProductCardCompactProps) {
  const { addItem, isInCart } = useCart();
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isAdding, setIsAdding] = useState(false);

  const handleAddToCart = async () => {
    if (!product) {
      console.error('Producto no válido');
      toast.error('Producto no válido');
      return;
    }

    if (!product.slug) {
      console.error('El producto no tiene slug válido:', product);
      toast.error('Producto no válido');
      return;
    }

    setIsAdding(true);
    try {
      const mainImage =
        product.images.find(img => img.isPrimary) || product.images[0];
      const imageUrl = mainImage?.url || '/img/placeholder-category.jpg';

      const cartItem = {
        id: product.id,
        productName: product.productName || '',
        price: typeof product.price === 'number' ? product.price : 0,
        slug: product.slug,
        image: imageUrl,
        quantity: 1,
      };

      const productInCart = isInCart(product.slug);
      if (productInCart) {
        toast.warning(`${product.productName} ya está en el carrito`);
      } else {
        addItem(cartItem);
        toast.success(`${product.productName} agregado al carrito`);
      }
    } catch (error) {
      console.error('Error al agregar al carrito:', error);
      toast.error('Error al agregar el producto al carrito');
    } finally {
      setIsAdding(false);
    }
  };

  if (!product) {
    return (
      <div className="bg-white dark:bg-slate-800 rounded-2xl overflow-hidden shadow-lg border border-slate-200 dark:border-slate-700 flex flex-col h-[320px] items-center justify-center">
        <p className="text-red-500">Producto no disponible</p>
      </div>
    );
  }

  const mainImage =
    product.images.find(img => img.isPrimary) || product.images[0];
  const imageUrl = mainImage?.url || '/img/placeholder-category.jpg';

  // Mock rating
  const rating = 4.6;
  const maxStars = 5;
  const filledStars = Math.floor(rating);

  // Mock stock
  const stock = product.stock || Math.floor(Math.random() * 100) + 10;
  const isLowStock = stock < 20;
  const isOutOfStock = stock === 0;

  return (
    <div className="group relative bg-white dark:bg-slate-800 rounded-2xl overflow-hidden shadow-lg hover:shadow-xl border border-slate-200 dark:border-slate-700 transition-all duration-300 hover:scale-[1.02] flex flex-col h-[320px]">
      {/* Imagen */}
      <div className="relative w-full h-[180px] overflow-hidden bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-700 dark:to-slate-800">
        <Link
          href={product.slug ? `/products/${product.slug}` : '#'}
          className="block w-full h-full"
        >
          <Image
            src={imageUrl}
            alt={product.productName || 'Producto'}
            width={300}
            height={180}
            className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-110"
            priority={false}
          />
        </Link>

        {/* Botón favorito */}
        <button
          onClick={() => setIsWishlisted(!isWishlisted)}
          className={`absolute top-2 right-2 p-1.5 rounded-full transition-all duration-300 ${
            isWishlisted
              ? 'bg-red-500 text-white shadow-lg'
              : 'bg-white/90 dark:bg-slate-800/90 text-slate-600 dark:text-slate-400 hover:bg-red-500 hover:text-white'
          }`}
        >
          <Heart
            className={`h-3.5 w-3.5 ${isWishlisted ? 'fill-current' : ''}`}
          />
        </button>

        {/* Indicador de stock */}
        <div className="absolute top-2 left-2">
          <span
            className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-bold shadow-md ${
              isOutOfStock
                ? 'bg-red-500 text-white'
                : isLowStock
                ? 'bg-amber-500 text-white'
                : 'bg-green-500 text-white'
            }`}
          >
            {isOutOfStock ? 'Agotado' : `${stock} disponibles`}
          </span>
        </div>
      </div>

      {/* Contenido */}
      <div className="flex-1 flex flex-col p-4 space-y-3">
        {/* Nombre y rating */}
        <div className="space-y-2">
          <Link
            href={product.slug ? `/products/${product.slug}` : '#'}
            className="block"
          >
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
              {product.productName || 'Producto sin nombre'}
            </h3>
          </Link>

          {/* Rating compacto */}
          <div className="flex items-center gap-1">
            <div className="flex items-center gap-0.5">
              {[...Array(filledStars)].map((_, i) => (
                <Star
                  key={i}
                  className="h-3 w-3 text-yellow-400 fill-yellow-400"
                />
              ))}
              {[...Array(maxStars - filledStars)].map((_, i) => (
                <Star key={i + 'empty'} className="h-3 w-3 text-slate-300" />
              ))}
            </div>
            <span className="text-xs text-slate-500 dark:text-slate-400 ml-1">
              {rating}
            </span>
          </div>
        </div>

        {/* Categoría */}
        <div className="flex items-center justify-between">
          <span className="text-xs text-slate-500 dark:text-slate-400">
            {product.category?.categoryName || 'Sin categoría'}
          </span>
        </div>

        {/* Precio y botones */}
        <div className="flex items-center justify-between pt-2">
          <div className="flex flex-col">
            <div className="flex items-end gap-1">
              <span className="text-lg font-bold text-slate-400 dark:text-slate-400 mb-0.5">
                $
              </span>
              <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400 leading-none">
                {typeof product.price === 'number'
                  ? product.price.toFixed(2)
                  : '0.00'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <Link
              href={product.slug ? `/products/${product.slug}` : '#'}
              className="p-2 rounded-lg bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 hover:bg-blue-100 dark:hover:bg-blue-900/30 hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-200"
              aria-label="Ver detalles"
            >
              <Eye className="h-4 w-4" />
            </Link>
            <button
              onClick={handleAddToCart}
              disabled={isAdding || !product.slug || isOutOfStock}
              className={`p-2 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg ${
                isOutOfStock
                  ? 'bg-gray-400 text-white cursor-not-allowed'
                  : product.slug && isInCart(product.slug)
                  ? 'bg-green-500 hover:bg-green-600 text-white'
                  : 'bg-blue-500 hover:bg-blue-600 text-white'
              } ${isAdding ? 'opacity-50 cursor-not-allowed' : ''}`}
              aria-label={
                isOutOfStock
                  ? 'Producto agotado'
                  : product.slug && isInCart(product.slug)
                  ? 'Producto en el carrito'
                  : 'Añadir al carrito'
              }
            >
              <ShoppingCart className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Efecto de brillo sutil */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 pointer-events-none"></div>
    </div>
  );
}
