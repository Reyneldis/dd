'use client';
import CheckoutModal from '@/components/shared/checkout/CheckoutModal';
import { useCart } from '@/hooks/use-cart';
import type { Product } from '@/types';
import { useAuth } from '@clerk/nextjs';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ShoppingCart } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import React, { useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';

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

interface CartItem {
  id: string;
  productName: string;
  price: number;
  image: string;
  slug: string;
  quantity: number;
}

async function fetchProduct(slug: string): Promise<Product | null> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
  const res = await fetch(`${baseUrl}/api/products/${slug}`, {
    cache: 'no-store',
  });
  if (!res.ok) return null;
  return await res.json();
}

const ThreeDCard = ({ children }: { children: React.ReactNode }) => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });
  const rotateX = useTransform(scrollYProgress, [0, 1], [20, -20]);
  const rotateY = useTransform(scrollYProgress, [0, 1], [-20, 20]);
  return (
    <motion.div
      ref={ref}
      style={{
        rotateX,
        rotateY,
        transformStyle: 'preserve-3d',
      }}
      className="relative w-full h-full rounded-2xl shadow-xl transition-all duration-700 [perspective:1000px]"
    >
      {children}
    </motion.div>
  );
};

export default function ProductPage() {
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const { addItem, items, updateQuantity } = useCart();
  const { isSignedIn, userId } = useAuth();
  const params = useParams<{ productsSlug: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const stock = typeof product?.stock === 'number' ? product.stock : 99;

  // Formulario de reseña
  const [reviewRating, setReviewRating] = useState(0);
  const [reviewComment, setReviewComment] = useState('');
  const [reviewLoading, setReviewLoading] = useState(false);
  const [reviewSuccess, setReviewSuccess] = useState('');
  const [reviewError, setReviewError] = useState('');

  const [reviews, setReviews] = useState<Review[]>([]);
  const [reviewsLoading, setReviewsLoading] = useState(true);

  // Función para verificar si el producto ya está en el carrito
  const isProductInCart = (productSlug: string) => {
    return items.some(item => item.slug === productSlug);
  };

  // Función para verificar si hay stock suficiente
  const hasEnoughStock = (requestedQuantity: number) => {
    return requestedQuantity <= stock;
  };

  // Función para agregar al carrito (sin retornar valor)
  const handleAddToCart = () => {
    if (!product) return;

    // Verificar si el producto ya está en el carrito
    if (isProductInCart(product.slug)) {
      toast.info('Este producto ya está en tu carrito');
      return;
    }

    // Verificar stock
    if (!hasEnoughStock(quantity)) {
      toast.error(
        `No puedes agregar más de ${stock} unidades de este producto.`,
      );
      return;
    }

    // Crear el item para el carrito
    const cartItem: Omit<CartItem, 'quantity'> = {
      id: product.id,
      productName: product.productName,
      price: product.price,
      image: product.images?.[0]?.url || '/img/placeholder-category.jpg',
      slug: product.slug,
    };

    // Agregar al carrito
    addItem(cartItem);
    // Actualizar la cantidad
    updateQuantity(product.id, quantity);
    toast.success('Producto agregado al carrito');
  };

  // Función para "Comprar ahora" que maneja su propia lógica
  const handleBuyNow = () => {
    if (!product) return;

    // Verificar si el producto ya está en el carrito
    if (isProductInCart(product.slug)) {
      toast.info('Este producto ya está en tu carrito');
      // Abrimos el modal de todas formas para que pueda proceder al pago
      setCheckoutOpen(true);
      return;
    }

    // Verificar stock
    if (!hasEnoughStock(quantity)) {
      toast.error(
        `No puedes agregar más de ${stock} unidades de este producto.`,
      );
      return;
    }

    // Si todo está bien, agregar al carrito y abrir el modal
    const cartItem: Omit<CartItem, 'quantity'> = {
      id: product.id,
      productName: product.productName,
      price: product.price,
      image: product.images?.[0]?.url || '/img/placeholder-category.jpg',
      slug: product.slug,
    };

    addItem(cartItem);
    updateQuantity(product.id, quantity);
    toast.success('Producto agregado al carrito');
    setCheckoutOpen(true);
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setReviewLoading(true);
    setReviewSuccess('');
    setReviewError('');
    try {
      // Forzar sincronización de usuario antes de enviar la reseña
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
      setLoading(true);
      try {
        const prod = await fetchProduct(params.productsSlug);
        setProduct(prod);
      } catch (error) {
        console.error('Error loading product:', error);
      } finally {
        setLoading(false);
      }
    }
    loadProduct();
  }, [params.productsSlug]);

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

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-24 w-24 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
            Cargando producto...
          </p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-4">
            Producto no encontrado
          </h1>
          <Link
            href="/products"
            className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
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

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <div className="container mx-auto px-2 py-8 pt-20">
        <div className="max-w-5xl mx-auto">
          {/* Breadcrumb */}
          <nav className="mb-8">
            <ol className="flex items-center space-x-2 text-xs md:text-sm text-gray-600 dark:text-gray-400">
              <li>
                <Link
                  href="/"
                  className="hover:text-blue-600 dark:hover:text-blue-400"
                >
                  Inicio
                </Link>
              </li>
              <li>/</li>
              <li>
                <Link
                  href="/products"
                  className="hover:text-blue-600 dark:hover:text-blue-400"
                >
                  Productos
                </Link>
              </li>
              <li>/</li>
              <li className="text-gray-900 dark:text-gray-100 font-semibold">
                {product.productName}
              </li>
            </ol>
          </nav>

          {/* Tarjeta principal con efecto 3D */}
          <ThreeDCard>
            <div className="flex flex-col md:flex-row gap-10 bg-white/90 dark:bg-slate-900/90 rounded-3xl shadow-2xl p-4 md:p-10 border border-neutral-200 dark:border-neutral-800">
              {/* Imagen a la izquierda */}
              <div className="flex-1 flex items-center justify-center mb-8 md:mb-0">
                <div className="relative aspect-square w-full max-w-xs md:max-w-sm lg:max-w-md bg-gradient-to-br from-yellow-100 via-white to-pink-100 dark:from-slate-800 dark:via-slate-900 dark:to-slate-800 rounded-3xl shadow-xl overflow-hidden border border-neutral-200 dark:border-neutral-700">
                  <Image
                    src={mainImage}
                    alt={product.productName}
                    fill
                    className="object-cover object-center scale-105 hover:scale-110 transition-transform duration-500"
                    priority
                  />
                </div>
              </div>

              {/* Info a la derecha */}
              <div className="flex-1 flex flex-col justify-center gap-8 min-w-[320px]">
                <div className="flex flex-col gap-2">
                  <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-emerald-600 via-amber-500 to-emerald-700 leading-tight mb-1">
                    {product.productName}
                  </h1>
                  <div className="flex items-center gap-3 mb-2">
                    {typeof product.rating === 'number' &&
                      product.rating > 0 && (
                        <span className="flex items-center gap-1 text-yellow-500 font-bold text-base">
                          {'★'.repeat(Math.round(product.rating))}
                          <span className="text-neutral-600 dark:text-neutral-300 ml-1">
                            ({product.rating.toFixed(1)})
                          </span>
                        </span>
                      )}
                    {typeof product.sold === 'number' && product.sold > 0 && (
                      <span className="inline-block px-3 py-1 rounded-full bg-green-200 text-green-800 text-xs font-bold shadow">
                        {product.sold} vendidos
                      </span>
                    )}
                  </div>
                </div>

                {product.description && (
                  <p className="text-gray-600 dark:text-gray-300 text-base md:text-lg leading-relaxed mb-2">
                    {product.description}
                  </p>
                )}

                {product.features && product.features.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-1">
                      Características
                    </h3>
                    <ul className="flex flex-wrap gap-2">
                      {product.features.map((feature, index) => (
                        <li
                          key={index}
                          className="bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 px-3 py-1 rounded-full text-xs font-medium shadow-sm"
                        >
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="flex flex-col gap-3 mt-4 w-full max-w-md">
                  <div className="flex items-center justify-center gap-4">
                    <span className="text-lg text-neutral-500 font-medium  dark:text-neutral-400">
                      Stock disponible:
                    </span>
                    <span className="font-semibold text-neutral-800 dark:text-neutral-100">
                      {stock}
                    </span>
                  </div>

                  <div className="flex items-center justify-between bg-neutral-100 dark:bg-neutral-800 rounded-xl px-2 py-2 shadow-sm">
                    <button
                      className="w-8 h-8 flex items-center justify-center text-xl font-bold border border-blue-400 dark:border-blue-600 rounded-lg transition hover:bg-blue-50 dark:hover:bg-blue-950 disabled:opacity-60 disabled:cursor-not-allowed bg-transparent shadow-none"
                      onClick={() => setQuantity(q => Math.max(1, q - 1))}
                      disabled={quantity <= 1}
                      type="button"
                      aria-label="Disminuir cantidad"
                    >
                      −
                    </button>
                    <span className="w-12 text-center font-semibold text-2xl select-none">
                      {quantity}
                    </span>
                    <button
                      className="w-8 h-8 flex items-center justify-center text-xl font-bold border border-blue-400 dark:border-blue-600 rounded-lg transition hover:bg-blue-50 dark:hover:bg-blue-950 disabled:opacity-60 disabled:cursor-not-allowed bg-transparent shadow-none"
                      onClick={() => setQuantity(q => Math.min(q + 1, stock))}
                      disabled={quantity >= stock}
                      type="button"
                      aria-label="Aumentar cantidad"
                    >
                      ＋
                    </button>
                  </div>

                  <div className="flex flex-col md:flex-row gap-4 mt-4">
                    <button
                      className="flex-1 py-4 px-4 cursor-pointer rounded-xl bg-gradient-to-r from-yellow-400 to-orange-400 text-yellow-900 font-bold text-lg shadow-xl hover:from-yellow-500 hover:to-orange-500 transition-all duration-200 hover:scale-105 active:scale-95 flex items-center justify-center gap-2 disabled:opacity-60"
                      type="button"
                      disabled={stock === 0}
                      onClick={handleBuyNow}
                    >
                      Pedir ahora
                    </button>
                    <button
                      className="flex-1 py-4 cursor-pointer px-4 rounded-xl bg-gradient-to-r from-blue-400 to-purple-400 text-white font-bold text-lg shadow-xl hover:from-blue-500 hover:to-purple-500 transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-60"
                      type="button"
                      disabled={stock === 0}
                      onClick={handleAddToCart}
                    >
                      <ShoppingCart className="h-5 w-5" />
                      Añadir
                    </button>
                  </div>

                  <div className="flex items-center justify-center gap-4 mt-2">
                    <span className="text-lg font-semibold text-neutral-700 dark:text-neutral-200">
                      Total:
                    </span>
                    <span className="text-2xl font-bold text-blue-700 dark:text-yellow-300">
                      {(product.price * quantity).toLocaleString('es', {
                        style: 'currency',
                        currency: 'USD',
                      })}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </ThreeDCard>

          {/* Card de reseñas debajo */}
          <div className="mt-12 max-w-4xl mx-auto">
            <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-lg border border-neutral-200 dark:border-neutral-800 p-6 md:p-10">
              <h3 className="text-2xl md:text-3xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-emerald-600 via-amber-500 to-emerald-700 text-center mb-4">
                Opiniones de clientes
              </h3>
              {isSignedIn ? (
                <form
                  onSubmit={handleReviewSubmit}
                  className="flex flex-col gap-4"
                >
                  <div className="flex items-center gap-2 justify-center">
                    <span className="font-semibold">Calificación:</span>
                    {[1, 2, 3, 4, 5].map(star => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setReviewRating(star)}
                        className={
                          star <= reviewRating
                            ? 'text-amber-400 text-2xl'
                            : 'text-slate-300 dark:text-slate-600 text-2xl'
                        }
                        aria-label={`Calificar con ${star} estrellas`}
                      >
                        ★
                      </button>
                    ))}
                  </div>
                  <textarea
                    className="w-full p-3 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                    rows={3}
                    placeholder="Escribe tu experiencia..."
                    value={reviewComment}
                    onChange={e => setReviewComment(e.target.value)}
                    required
                    maxLength={500}
                  />
                  <button
                    type="submit"
                    className="py-3 px-6 rounded-xl bg-gradient-to-r from-pink-500 to-yellow-400 text-white font-bold text-lg shadow hover:from-pink-600 hover:to-yellow-500 transition-all"
                    disabled={
                      reviewLoading ||
                      reviewRating === 0 ||
                      reviewComment.length < 5
                    }
                  >
                    {reviewLoading ? 'Enviando...' : 'Enviar reseña'}
                  </button>
                  {reviewSuccess && (
                    <div className="text-green-600 font-semibold text-center">
                      {reviewSuccess}
                    </div>
                  )}
                  {reviewError && (
                    <div className="text-red-600 font-semibold text-center">
                      {reviewError}
                    </div>
                  )}
                </form>
              ) : (
                <div className="text-slate-600 dark:text-slate-300 text-center">
                  Debes iniciar sesión para dejar una reseña.
                </div>
              )}

              {/* Mostrar reseñas existentes */}
              <div className="mt-8">
                <h4 className="text-lg font-semibold mb-2">
                  Reseñas recientes
                </h4>
                {reviewsLoading ? (
                  <div>Cargando reseñas...</div>
                ) : reviews.length === 0 ? (
                  <div>No hay reseñas para este producto.</div>
                ) : (
                  <ul className="flex flex-col gap-4">
                    {reviews.map(r => (
                      <li
                        key={r.id}
                        className="bg-slate-100 dark:bg-slate-900 rounded-lg p-4"
                      >
                        <div className="flex items-center gap-3 mb-1">
                          <span className="font-bold">
                            {r.user?.firstName} {r.user?.lastName}
                          </span>
                          <span className="text-amber-400">
                            {'★'.repeat(r.rating)}
                            {'☆'.repeat(5 - r.rating)}
                          </span>
                        </div>
                        <p className="text-slate-600 dark:text-slate-300">
                          {r.comment}
                        </p>
                        <div className="text-xs text-slate-500 mt-2">
                          {new Date(r.createdAt).toLocaleDateString()}
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <CheckoutModal
        isOpen={checkoutOpen}
        onClose={() => setCheckoutOpen(false)}
      />
    </main>
  );
}
