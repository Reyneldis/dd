'use client';
import { useCart } from '@/hooks/use-cart';
import { useAuth } from '@clerk/nextjs';
import { ShoppingCart } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';

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

async function fetchProduct(id: string): Promise<Product | null> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
  const res = await fetch(`${baseUrl}/api/products/${id}`, {
    cache: 'no-store',
  });
  if (!res.ok) return null;
  return await res.json();
}

import CheckoutModal from '@/components/shared/checkout/CheckoutModal';

function formatUSD(price: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(price);
}

export default function ProductPage() {
  const { addItem, items, updateQuantity } = useCart();
  const { isSignedIn, userId } = useAuth();
  const params = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const stock = typeof product?.stock === 'number' ? product.stock : 99;

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

  const [reviews, setReviews] = useState<Review[]>([]);
  const [reviewsLoading, setReviewsLoading] = useState(true);

  useEffect(() => {
    async function loadProduct() {
      if (!params.id) return;

      setLoading(true);
      try {
        const prod = await fetchProduct(params.id);
        setProduct(prod);
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

  const handleAddToCart = async () => {
    if (!product) return;

    if (isInCart) {
      toast.info('Este producto ya está en el carrito');
      return;
    }

    const maxQty = typeof product.stock === 'number' ? product.stock : 99;

    if (quantity > maxQty) {
      toast.error(
        `No puedes agregar más de ${maxQty} unidades de este producto.`,
      );
      return;
    }

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

      // Actualizar el estado local del producto
      setProduct(prev => {
        if (!prev) return null;
        return {
          ...prev,
          stock: prev.stock - quantity,
        };
      });

      toast.success('Producto agregado al carrito');
    } catch (error) {
      console.error('Error al agregar al carrito:', error);
      toast.error('Error al agregar el producto al carrito');
    }
  };

  const handleBuyNow = () => {
    handleAddToCart();
    openCartModal();
  };

  const handleQuantityChange = async (newQuantity: number) => {
    if (!product) return;

    if (newQuantity < 1) {
      setQuantity(1);
      return;
    }

    if (newQuantity > stock) {
      toast.error(`No puedes agregar más de ${stock} unidades`);
      return;
    }

    setQuantity(newQuantity);

    // Si el producto ya está en el carrito, actualizar la cantidad
    if (isInCart) {
      try {
        await updateQuantity(product.id, newQuantity);

        // Actualizar el estado local del producto
        setProduct(prev => {
          if (!prev) return null;
          const difference = newQuantity - quantity;
          return {
            ...prev,
            stock: prev.stock - difference,
          };
        });
      } catch (error) {
        console.error('Error al actualizar cantidad:', error);
        toast.error('Error al actualizar la cantidad');
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
        <div className="text-center">
          <div className="w-24 h-24 mx-auto border-b-2 border-blue-600 rounded-full animate-spin"></div>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
            Cargando producto...
          </p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
        <div className="text-center">
          <h1 className="mb-4 text-2xl font-bold text-gray-800 dark:text-gray-200">
            Producto no encontrado
          </h1>
          <Link
            href="/products"
            className="inline-block px-6 py-3 text-white transition-colors bg-blue-600 rounded-lg hover:bg-blue-700"
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

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <div className="container px-2 py-8 pt-20 mx-auto">
        <div className="max-w-5xl mx-auto">
          <nav className="mb-8">
            <ol className="flex items-center space-x-2 text-xs text-gray-600 md:text-sm dark:text-gray-400">
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
              <li className="font-semibold text-gray-900 dark:text-gray-100">
                {product.productName}
              </li>
            </ol>
          </nav>

          <div className="flex flex-col gap-10 p-4 border shadow-2xl md:flex-row bg-white/90 dark:bg-slate-900/90 rounded-3xl md:p-10 border-neutral-200 dark:border-neutral-800">
            <div className="flex items-center justify-center flex-1 mb-8 md:mb-0">
              <div className="relative w-full max-w-xs overflow-hidden border shadow-xl aspect-square md:max-w-sm lg:max-w-md bg-gradient-to-br from-yellow-100 via-white to-pink-100 dark:from-slate-800 dark:via-slate-900 dark:to-slate-800 rounded-3xl border-neutral-200 dark:border-neutral-700">
                <Image
                  src={mainImage}
                  alt={product.productName}
                  fill
                  className="object-cover object-center transition-transform duration-500 scale-105 hover:scale-110"
                  priority
                />
              </div>
            </div>

            <div className="flex-1 flex flex-col justify-center gap-8 min-w-[320px]">
              <div className="flex flex-col gap-2">
                <h1 className="mb-1 text-4xl font-extrabold leading-tight tracking-tight text-transparent md:text-5xl bg-clip-text bg-gradient-to-r from-emerald-600 via-amber-500 to-emerald-700">
                  {product.productName}
                </h1>
                <div className="flex items-center gap-3 mb-2">
                  {typeof product.rating === 'number' && product.rating > 0 && (
                    <span className="flex items-center gap-1 text-base font-bold text-yellow-500">
                      {'★'.repeat(Math.round(product.rating))}
                      <span className="ml-1 text-neutral-600 dark:text-neutral-300">
                        ({product.rating.toFixed(1)})
                      </span>
                    </span>
                  )}
                  {typeof product.sold === 'number' && product.sold > 0 && (
                    <span className="inline-block px-3 py-1 text-xs font-bold text-green-800 bg-green-200 rounded-full shadow">
                      {product.sold} vendidos
                    </span>
                  )}
                </div>
              </div>

              {product.description && (
                <p className="mb-2 text-base leading-relaxed text-gray-600 dark:text-gray-300 md:text-lg">
                  {product.description}
                </p>
              )}

              {product.features && product.features.length > 0 && (
                <div>
                  <h3 className="mb-1 text-lg font-semibold text-gray-900 dark:text-gray-100">
                    Características
                  </h3>
                  <ul className="flex flex-wrap gap-2">
                    {product.features.map((feature, index) => (
                      <li
                        key={index}
                        className="px-3 py-1 text-xs font-medium text-blue-800 bg-blue-100 rounded-full shadow-sm dark:bg-blue-900/30 dark:text-blue-200"
                      >
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="flex flex-col w-full max-w-md gap-3 mt-4">
                <div className="flex items-center justify-center gap-4">
                  <span className="text-lg font-medium text-neutral-500 dark:text-neutral-400">
                    Stock disponible:
                  </span>
                  <span className="font-semibold text-neutral-800 dark:text-neutral-100">
                    {stock}
                  </span>
                </div>

                <div className="flex items-center justify-between px-2 py-2 shadow-sm bg-neutral-100 dark:bg-neutral-800 rounded-xl">
                  <button
                    className="flex items-center justify-center w-8 h-8 text-xl font-bold transition bg-transparent border border-blue-400 rounded-lg shadow-none dark:border-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950 disabled:opacity-60 disabled:cursor-not-allowed"
                    onClick={() => handleQuantityChange(quantity - 1)}
                    disabled={quantity <= 1}
                    type="button"
                    aria-label="Disminuir cantidad"
                  >
                    −
                  </button>
                  <span className="w-12 text-2xl font-semibold text-center select-none">
                    {quantity}
                  </span>
                  <button
                    className="flex items-center justify-center w-8 h-8 text-xl font-bold transition bg-transparent border border-blue-400 rounded-lg shadow-none dark:border-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950 disabled:opacity-60 disabled:cursor-not-allowed"
                    onClick={() => handleQuantityChange(quantity + 1)}
                    disabled={quantity >= stock}
                    type="button"
                    aria-label="Aumentar cantidad"
                  >
                    ＋
                  </button>
                </div>

                <div className="flex flex-col gap-4 mt-4 md:flex-row">
                  <button
                    className="flex items-center justify-center flex-1 gap-2 px-4 py-4 text-lg font-bold text-yellow-900 transition-all duration-200 shadow-xl cursor-pointer rounded-xl bg-gradient-to-r from-yellow-400 to-orange-400 hover:from-yellow-500 hover:to-orange-500 hover:scale-105 active:scale-95 disabled:opacity-60"
                    type="button"
                    disabled={stock === 0}
                    onClick={handleBuyNow}
                  >
                    Pedir ahora
                  </button>

                  <button
                    className={`flex items-center justify-center flex-1 gap-2 px-4 py-4 text-lg font-bold transition-all duration-200 shadow-xl cursor-pointer rounded-xl ${
                      isInCart
                        ? 'bg-gray-400 text-white cursor-not-allowed'
                        : 'bg-gradient-to-r from-blue-400 to-purple-400 hover:from-blue-500 hover:to-purple-500 text-white'
                    }`}
                    type="button"
                    disabled={stock === 0 || isInCart}
                    onClick={handleAddToCart}
                  >
                    <ShoppingCart className="w-5 h-5" />
                    {isInCart ? 'En el carrito' : 'Añadir'}
                  </button>
                </div>

                <div className="flex items-center justify-center gap-4 mt-2">
                  <span className="text-lg font-semibold text-neutral-700 dark:text-neutral-200">
                    Total:
                  </span>
                  <span className="text-2xl font-bold text-blue-700 dark:text-yellow-300">
                    {formatUSD(price * quantity)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="max-w-4xl mx-auto mt-12">
            <div className="p-6 bg-white border shadow-lg dark:bg-slate-900 rounded-3xl border-neutral-200 dark:border-neutral-800 md:p-10">
              <h3 className="mb-4 text-2xl font-extrabold tracking-tight text-center text-transparent md:text-3xl bg-clip-text bg-gradient-to-r from-emerald-600 via-amber-500 to-emerald-700">
                Opiniones de clientes
              </h3>

              {isSignedIn ? (
                <form
                  onSubmit={handleReviewSubmit}
                  className="flex flex-col gap-4"
                >
                  <div className="flex items-center justify-center gap-2">
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
                    className="w-full p-3 bg-white border rounded border-slate-300 dark:border-slate-700 dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                    rows={3}
                    placeholder="Escribe tu experiencia..."
                    value={reviewComment}
                    onChange={e => setReviewComment(e.target.value)}
                    required
                    maxLength={500}
                  />

                  <button
                    type="submit"
                    className="px-6 py-3 text-lg font-bold text-white transition-all shadow rounded-xl bg-gradient-to-r from-pink-500 to-yellow-400 hover:from-pink-600 hover:to-yellow-500"
                    disabled={
                      reviewLoading ||
                      reviewRating === 0 ||
                      reviewComment.length < 5
                    }
                  >
                    {reviewLoading ? 'Enviando...' : 'Enviar reseña'}
                  </button>

                  {reviewSuccess && (
                    <div className="font-semibold text-center text-green-600">
                      {reviewSuccess}
                    </div>
                  )}

                  {reviewError && (
                    <div className="font-semibold text-center text-red-600">
                      {reviewError}
                    </div>
                  )}
                </form>
              ) : (
                <div className="text-center text-slate-600 dark:text-slate-300">
                  Debes iniciar sesión para dejar una reseña.
                </div>
              )}

              <div className="mt-8">
                <h4 className="mb-2 text-lg font-semibold">
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
                        className="p-4 rounded-lg bg-slate-100 dark:bg-slate-900"
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
                        <div className="mt-2 text-xs text-slate-500">
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

      <CheckoutModal isOpen={isCartModalOpen} onClose={closeCartModal} />
    </main>
  );
}
