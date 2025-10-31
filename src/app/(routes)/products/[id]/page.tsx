// app/[...]/ProductPage.tsx

'use client';
import { useCart } from '@/hooks/use-cart';
import { useAuth } from '@clerk/nextjs';
import { motion } from 'framer-motion';
import {
  Minus,
  Package,
  Plus,
  Shield,
  ShoppingCart,
  Star,
  Truck,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';

// ... (las interfaces que ya tenías)
interface ReviewUser {
  firstName?: string;
  lastName?: string;
  avatar?: string;
}

interface Review {
  id: string;
  rating: number;
  comment: string;
  createdAt: string;
  user?: ReviewUser;
}

import { useCartModal } from '@/hooks/use-cart-modal';
import type { Product } from '@/types';
import { toast } from 'sonner';

// CAMBIO: Importa el nuevo componente específico
import ProductDetailAddToCartButton from '@/components/shared/FeaturedProducts/ProductDetailAddToCartButton';
import CheckoutModal from '@/components/shared/checkout/CheckoutModal';

export default function ProductPage() {
  // --- SOLUCIÓN: Mueve las funciones auxiliares DENTRO del componente ---
  const fetchProduct = async (id: string): Promise<Product | null> => {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const res = await fetch(`${baseUrl}/api/products/${id}`, {
      cache: 'no-store',
    });
    if (!res.ok) return null;
    return await res.json();
  };

  const formatUSD = (price: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(price);
  };
  // --- FIN DE LA SOLUCIÓN ---

  // --- CORRECCIÓN CLAVE: Elimina updateQuantity de la destructuración ---
  const { addItem, items } = useCart();
  // --- FIN DE LA CORRECCIÓN ---

  const { isSignedIn, userId } = useAuth();
  const params = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [originalStock, setOriginalStock] = useState(0);
  const [isBuyNowLoading, setIsBuyNowLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);

  const {
    openCartModal,
    closeCartModal,
    isOpen: isCartModalOpen,
  } = useCartModal();

  const [reviewRating, setReviewRating] = useState(0);
  const [reviewComment, setReviewComment] = useState('');
  const [reviewLoading, setReviewLoading] = useState(false);
  const [reviewSuccess, setReviewSuccess] = useState('');
  const [reviewError, setReviewError] = useState('');
  const [reviews, setReviews] = useState<Review[]>([]);
  const [reviewsLoading, setReviewsLoading] = useState(true);

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setReviewLoading(true);
    setReviewSuccess('');
    setReviewError('');
    try {
      await fetch('/api/auth/sync-user', { method: 'POST' });
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          productId: product?.id,
          rating: reviewRating,
          comment: reviewComment,
        }),
      });
      if (res.ok) {
        setReviewSuccess('¡Gracias por tu reseña!');
        setReviewComment('');
        setReviewRating(0);
      } else {
        const data = await res.json();
        setReviewError(data.error || 'Error al enviar la reseña');
      }
    } catch {
      setReviewError('Error al enviar la reseña');
    } finally {
      setReviewLoading(false);
    }
  };

  useEffect(() => {
    async function loadProduct() {
      if (!params.id) return;

      setLoading(true);
      try {
        const prod = await fetchProduct(params.id); // Ahora esta función está en el mismo scope
        setProduct(prod);
        if (prod) {
          setOriginalStock(prod.stock);
          setQuantity(1);
        }
      } catch (error) {
        console.error('Error loading product:', error);
      } finally {
        setLoading(false);
      }
    }

    loadProduct();
  }, [params.id]);

  useEffect(() => {
    if (product?.id) {
      (async () => {
        setReviewsLoading(true);
        try {
          const res = await fetch(`/api/reviews?productId=${product.id}`);
          if (res.ok) {
            const data = await res.json();
            setReviews(data.reviews || []);
          }
        } catch (error) {
          console.error('Error loading reviews:', error);
        } finally {
          setReviewsLoading(false);
        }
      })();
    }
  }, [product?.id]);

  const isInCart = items.some(item => item.id === product?.id);

  // --- FUNCIÓN handleBuyNow CORREGIDA Y FINAL ---
  const handleBuyNow = async () => {
    if (!product) return;
    if (isBuyNowLoading) return;

    // Si el producto ya está en el carrito, solo notificamos y abrimos el modal.
    if (isInCart) {
      toast.info(
        'Este producto ya está en tu carrito. Revisa la cantidad en el carrito.',
      );
      setTimeout(() => {
        openCartModal();
      }, 300); // Pequeña demora para que el usuario vea la notificación
      return; // Detenemos la ejecución aquí.
    }

    // Si no está, lo añadimos con la cantidad seleccionada.
    setIsBuyNowLoading(true);
    try {
      const cartItem = {
        id: product.id,
        productName: product.productName,
        price: product.price,
        image: product.images?.[0]?.url || '/img/placeholder-category.jpg',
        slug: product.slug || '',
        quantity,
      };
      await addItem(cartItem);
      toast.success(
        `${product.productName} (x${quantity}) agregado al carrito`,
      );

      setTimeout(() => {
        openCartModal();
      }, 300);
    } catch (error) {
      console.error('Error al procesar "Pedir ahora":', error);
      toast.error('Error al agregar el producto al carrito');
    } finally {
      setIsBuyNowLoading(false);
    }
  };
  // --- FIN DE LA FUNCIÓN CORREGIDA ---

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity < 1) {
      setQuantity(1);
      return;
    }

    if (newQuantity > originalStock) {
      toast.error(`No puedes solicitar más de ${originalStock} unidades`);
      return;
    }

    setQuantity(newQuantity);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
          <p className="mt-6 text-lg font-medium text-gray-600 dark:text-gray-300">
            Cargando producto...
          </p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
        <div className="text-center p-8 bg-white dark:bg-slate-800 rounded-2xl shadow-xl max-w-md mx-auto">
          <div className="w-20 h-20 mx-auto mb-4 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
            <Package className="w-10 h-10 text-red-500" />
          </div>
          <h1 className="mb-4 text-2xl font-bold text-gray-800 dark:text-gray-200">
            Producto no encontrado
          </h1>
          <p className="mb-6 text-gray-600 dark:text-gray-400">
            El producto que buscas no existe o ha sido eliminado.
          </p>
          <Link
            href="/products"
            className="inline-block px-6 py-3 text-white font-medium transition-all bg-blue-600 rounded-lg hover:bg-blue-700 transform hover:scale-105"
          >
            Volver a productos
          </Link>
        </div>
      </div>
    );
  }

  const mainImage =
    product.image ||
    product.images?.[0]?.url ||
    '/img/placeholder-category.jpg';

  const price =
    typeof product.price === 'string'
      ? parseFloat(product.price)
      : product.price || 0;

  const rating = product.rating ?? 0;
  const sold = product.sold ?? 0;

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <div className="container px-4 py-8 pt-12 mx-auto">
        <div className="max-w-6xl mx-auto">
          {/* Breadcrumb mejorado */}
          <nav className="mb-8">
            <ol className="flex items-center text-sm text-gray-500 dark:text-gray-400">
              <li>
                <Link
                  href="/"
                  className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  Inicio
                </Link>
              </li>
              <li className="mx-2">/</li>
              <li>
                <Link
                  href="/products"
                  className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  Productos
                </Link>
              </li>
              <li className="mx-2">/</li>
              <li className="font-medium text-gray-900 dark:text-gray-100 truncate max-w-xs">
                {product.productName}
              </li>
            </ol>
          </nav>

          {/* Contenido principal del producto */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            {/* Sección de imágenes */}
            <div className="space-y-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="relative overflow-hidden rounded-2xl bg-white dark:bg-slate-800 shadow-lg aspect-square"
              >
                <Image
                  src={mainImage}
                  alt={product.productName}
                  fill
                  className="object-cover object-center transition-transform duration-500 hover:scale-105"
                  priority
                />

                {/* Badge de descuento si aplica */}
                {product.featured && (
                  <div className="absolute top-4 left-4 px-3 py-1 bg-red-500 text-white text-sm font-medium rounded-full">
                    Oferta
                  </div>
                )}
              </motion.div>

              {/* Miniaturas de imágenes */}
              {product.images && product.images.length > 1 && (
                <div className="flex gap-2 overflow-x-auto pb-2">
                  {product.images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`relative w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                        selectedImage === index
                          ? 'border-blue-500 opacity-100'
                          : 'border-gray-200 dark:border-gray-700 opacity-70 hover:opacity-100'
                      }`}
                    >
                      <Image
                        src={image.url}
                        alt={`${product.productName} ${index + 1}`}
                        fill
                        className="object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Sección de información del producto */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="space-y-6"
            >
              {/* Título y calificación */}
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                  {product.productName}
                </h1>

                <div className="flex items-center gap-4">
                  {rating > 0 && (
                    <div className="flex items-center">
                      <div className="flex text-amber-400">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-5 h-5 ${
                              i < Math.round(rating) ? 'fill-current' : ''
                            }`}
                          />
                        ))}
                      </div>
                      <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">
                        {rating.toFixed(1)}
                      </span>
                    </div>
                  )}

                  {sold > 0 && (
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {sold} vendidos
                    </span>
                  )}
                </div>
              </div>

              {/* Precio */}
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold text-gray-900 dark:text-white">
                  {formatUSD(price)}
                </span>
                {originalStock <= 5 && originalStock > 0 && (
                  <span className="px-2 py-1 text-xs font-medium text-orange-800 bg-orange-100 dark:bg-orange-900/30 dark:text-orange-300 rounded-full">
                    ¡Últimas {originalStock} unidades!
                  </span>
                )}
              </div>

              {/* Descripción */}
              {product.description && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    Descripción
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                    {product.description}
                  </p>
                </div>
              )}

              {/* Características */}
              {product.features && product.features.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    Características
                  </h3>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {product.features.map((feature, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <div className="w-5 h-5 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                        </div>
                        <span className="text-sm text-gray-600 dark:text-gray-300">
                          {feature}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Beneficios */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 py-4 border-t border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <Truck className="w-5 h-5 text-blue-500" />
                  <span>Envío gratis</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <Shield className="w-5 h-5 text-green-500" />
                  <span>Garantía de devolución</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <Package className="w-5 h-5 text-purple-500" />
                  <span>Empaque seguro</span>
                </div>
              </div>

              {/* Selector de cantidad y botones de compra */}
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Cantidad:
                  </span>
                  <div className="flex items-center">
                    <button
                      className="w-10 h-10 rounded-l-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-slate-800 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      onClick={() => handleQuantityChange(quantity - 1)}
                      disabled={quantity <= 1}
                      type="button"
                      aria-label="Disminuir cantidad"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <div className="w-16 h-10 border-t border-b border-gray-300 dark:border-gray-600 bg-white dark:bg-slate-800 flex items-center justify-center">
                      {quantity}
                    </div>
                    <button
                      className="w-10 h-10 rounded-r-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-slate-800 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      onClick={() => handleQuantityChange(quantity + 1)}
                      disabled={quantity >= originalStock}
                      type="button"
                      aria-label="Aumentar cantidad"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {originalStock} disponibles
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <button
                    className="flex items-center justify-center gap-2 px-6 py-3 font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    type="button"
                    disabled={originalStock === 0 || isBuyNowLoading}
                    onClick={handleBuyNow}
                  >
                    {isBuyNowLoading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Procesando...
                      </>
                    ) : (
                      <>
                        <ShoppingCart className="w-5 h-5" />
                        Pedir ahora
                      </>
                    )}
                  </button>

                  <ProductDetailAddToCartButton
                    product={product}
                    quantity={quantity}
                    openModalOnSuccess={false}
                    buttonClassName="flex items-center justify-center gap-2 px-6 py-3 font-medium text-blue-600 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed dark:bg-blue-900/20 dark:border-blue-800 dark:text-blue-400 dark:hover:bg-blue-900/30"
                    icon={<ShoppingCart className="w-5 h-5" />}
                  >
                    {isInCart ? 'Actualizar cantidad' : 'Añadir al carrito'}
                  </ProductDetailAddToCartButton>
                </div>

                <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 dark:text-gray-400">
                      Total:
                    </span>
                    <span className="text-2xl font-bold text-gray-900 dark:text-white">
                      {formatUSD(price * quantity)}
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Sección de reseñas */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-16"
          >
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-6 md:p-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                Opiniones de clientes
              </h2>

              {isSignedIn ? (
                <form onSubmit={handleReviewSubmit} className="mb-8">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                    Deja tu reseña
                  </h3>

                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Calificación
                    </label>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map(star => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setReviewRating(star)}
                          className="p-1 transition-colors"
                          aria-label={`Calificar con ${star} estrellas`}
                        >
                          <Star
                            className={`w-8 h-8 ${
                              star <= reviewRating
                                ? 'text-amber-400 fill-current'
                                : 'text-gray-300 dark:text-gray-600'
                            }`}
                          />
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="mb-4">
                    <label
                      htmlFor="review-comment"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                    >
                      Comentario
                    </label>
                    <textarea
                      id="review-comment"
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                      rows={4}
                      placeholder="Comparte tu experiencia con este producto..."
                      value={reviewComment}
                      onChange={e => setReviewComment(e.target.value)}
                      required
                      maxLength={500}
                    />
                    <div className="mt-1 text-xs text-gray-500 dark:text-gray-400 text-right">
                      {reviewComment.length}/500
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <button
                      type="submit"
                      className="px-6 py-3 font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      disabled={
                        reviewLoading ||
                        reviewRating === 0 ||
                        reviewComment.length < 5
                      }
                    >
                      {reviewLoading ? (
                        <>
                          <div className="w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin inline-block"></div>
                          Enviando...
                        </>
                      ) : (
                        'Enviar reseña'
                      )}
                    </button>

                    {reviewSuccess && (
                      <div className="text-sm font-medium text-green-600 dark:text-green-400">
                        {reviewSuccess}
                      </div>
                    )}

                    {reviewError && (
                      <div className="text-sm font-medium text-red-600 dark:text-red-400">
                        {reviewError}
                      </div>
                    )}
                  </div>
                </form>
              ) : (
                <div className="mb-8 p-4 bg-gray-50 dark:bg-slate-700/30 rounded-lg text-center">
                  <p className="text-gray-600 dark:text-gray-400">
                    Debes{' '}
                    <Link
                      href="/login"
                      className="text-blue-600 hover:underline"
                    >
                      iniciar sesión
                    </Link>{' '}
                    para dejar una reseña.
                  </p>
                </div>
              )}

              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                  Reseñas recientes
                </h3>

                {reviewsLoading ? (
                  <div className="flex justify-center py-8">
                    <div className="w-8 h-8 border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin"></div>
                  </div>
                ) : reviews.length === 0 ? (
                  <div className="py-8 text-center text-gray-500 dark:text-gray-400">
                    No hay reseñas para este producto. ¡Sé el primero en opinar!
                  </div>
                ) : (
                  <div className="space-y-6">
                    {reviews.map(r => (
                      <div
                        key={r.id}
                        className="border-b border-gray-200 dark:border-gray-700 pb-6 last:border-0"
                      >
                        <div className="flex items-start gap-4">
                          <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center flex-shrink-0">
                            <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
                              {r.user?.firstName?.[0] || 'U'}
                            </span>
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-1">
                              <h4 className="font-medium text-gray-900 dark:text-white">
                                {r.user?.firstName} {r.user?.lastName}
                              </h4>
                              <div className="flex text-amber-400">
                                {[...Array(5)].map((_, i) => (
                                  <Star
                                    key={i}
                                    className={`w-4 h-4 ${
                                      i < r.rating ? 'fill-current' : ''
                                    }`}
                                  />
                                ))}
                              </div>
                            </div>
                            <p className="text-gray-600 dark:text-gray-300 mb-2">
                              {r.comment}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              {new Date(r.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <CheckoutModal isOpen={isCartModalOpen} onClose={closeCartModal} />
    </main>
  );
}
