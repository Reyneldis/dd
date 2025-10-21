// app/[slug]/page.tsx
'use client';

import { useCart } from '@/hooks/use-cart';
import { useAuth } from '@clerk/nextjs';
import { AnimatePresence, motion } from 'framer-motion';
import {
  AlertCircle,
  Check,
  ChevronLeft,
  ChevronRight,
  Heart,
  Minus,
  Package,
  Plus,
  Share2,
  Shield,
  ShoppingCart,
  Star,
  Truck,
  X,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';

import CheckoutModal from '@/components/shared/checkout/CheckoutModal';
import { useCartModal } from '@/hooks/use-cart-modal';
import type { Product, ProductImage, Review } from '@/types';
import { toast } from 'sonner';

// ... (El código de ProductGallery y QuantitySelector permanece igual) ...

function ProductGallery({
  images,
  productName,
}: {
  images: ProductImage[];
  productName: string;
}) {
  const [selectedImage, setSelectedImage] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isZoomed) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setZoomPosition({ x, y });
  };

  const mainImage =
    images[selectedImage]?.url || '/img/placeholder-category.jpg';

  return (
    <div className="space-y-4">
      <div
        className="relative overflow-hidden rounded-2xl bg-white dark:bg-slate-800 shadow-lg aspect-square cursor-zoom-in"
        onMouseEnter={() => setIsZoomed(true)}
        onMouseLeave={() => setIsZoomed(false)}
        onMouseMove={handleMouseMove}
        onClick={() => setIsZoomed(!isZoomed)}
      >
        <Image
          src={mainImage}
          alt={productName}
          fill
          className="object-cover object-center transition-transform duration-300"
          style={{
            transformOrigin: `${zoomPosition.x}% ${zoomPosition.y}%`,
            transform: isZoomed ? 'scale(2)' : 'scale(1)',
          }}
          priority
        />
        {images.length > 1 && (
          <>
            <button
              className="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/80 dark:bg-slate-800/80 flex items-center justify-center shadow-md hover:bg-white dark:hover:bg-slate-800 transition-colors"
              onClick={e => {
                e.stopPropagation();
                setSelectedImage(prev =>
                  prev === 0 ? images.length - 1 : prev - 1,
                );
              }}
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/80 dark:bg-slate-800/80 flex items-center justify-center shadow-md hover:bg-white dark:hover:bg-slate-800 transition-colors"
              onClick={e => {
                e.stopPropagation();
                setSelectedImage(prev =>
                  prev === images.length - 1 ? 0 : prev + 1,
                );
              }}
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </>
        )}
      </div>
      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-2">
          {images.map((image, index) => (
            <button
              key={image.id}
              onClick={() => setSelectedImage(index)}
              className={`relative w-20 h-20 rounded-lg overflow-hidden border-2 transition-all flex-shrink-0 ${
                selectedImage === index
                  ? 'border-blue-500 opacity-100'
                  : 'border-gray-200 dark:border-gray-700 opacity-70 hover:opacity-100'
              }`}
            >
              <Image
                src={image.url}
                alt={`${productName} ${index + 1}`}
                fill
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function QuantitySelector({
  quantity,
  setQuantity,
  maxStock,
}: {
  quantity: number;
  setQuantity: (value: number) => void;
  maxStock: number;
}) {
  const handleDecrease = () => quantity > 1 && setQuantity(quantity - 1);
  const handleIncrease = () => quantity < maxStock && setQuantity(quantity + 1);
  return (
    <div className="flex items-center border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden">
      <button
        onClick={handleDecrease}
        disabled={quantity <= 1}
        className="w-10 h-10 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-slate-700 disabled:opacity-50"
      >
        <Minus className="w-4 h-4" />
      </button>
      <div className="w-16 h-10 flex items-center justify-center font-medium">
        {quantity}
      </div>
      <button
        onClick={handleIncrease}
        disabled={quantity >= maxStock}
        className="w-10 h-10 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-slate-700 disabled:opacity-50"
      >
        <Plus className="w-4 h-4" />
      </button>
    </div>
  );
}

function ReviewsSection({
  reviews,
  productId,
  isSignedIn,
  userId,
}: {
  reviews: Review[];
  productId: string;
  isSignedIn: boolean;
  userId: string | undefined;
}) {
  const [reviewRating, setReviewRating] = useState(0);
  const [reviewComment, setReviewComment] = useState('');
  const [reviewLoading, setReviewLoading] = useState(false);
  const [reviewSuccess, setReviewSuccess] = useState('');
  const [reviewError, setReviewError] = useState('');
  const [showReviewForm, setShowReviewForm] = useState(false);

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId) return;
    setReviewLoading(true);
    try {
      await fetch('/api/auth/sync-user', { method: 'POST' });
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          productId,
          rating: reviewRating,
          comment: reviewComment,
        }),
      });
      if (res.ok) {
        setReviewSuccess('¡Gracias por tu reseña!');
        setReviewComment('');
        setReviewRating(0);
        setShowReviewForm(false);
        window.location.reload();
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

  const averageRating =
    reviews.length > 0
      ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
      : 0;

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-6 md:p-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Opiniones de clientes
        </h2>
        {reviews.length > 0 && (
          <div className="flex items-center gap-2">
            <div className="flex text-amber-400">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-5 h-5 ${
                    i < Math.round(averageRating)
                  } fill-current`}
                />
              ))}
            </div>
            <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
              {averageRating.toFixed(1)} ({reviews.length}{' '}
              {reviews.length === 1 ? 'reseña' : 'reseñas'})
            </span>
          </div>
        )}
      </div>
      {isSignedIn ? (
        <div className="mb-8">
          {!showReviewForm ? (
            <button
              onClick={() => setShowReviewForm(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Escribir una reseña
            </button>
          ) : (
            <form
              onSubmit={handleReviewSubmit}
              className="space-y-4 p-4 border border-gray-200 dark:border-gray-700 rounded-lg"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                  Deja tu reseña
                </h3>
                <button
                  type="button"
                  onClick={() => setShowReviewForm(false)}
                  className="p-1 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-md"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Calificación
                </label>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map(star => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setReviewRating(star)}
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
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Comentario
                </label>
                <textarea
                  value={reviewComment}
                  onChange={e => setReviewComment(e.target.value)}
                  required
                  maxLength={500}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 resize-none"
                  rows={4}
                />
                <div className="mt-1 text-xs text-gray-500 dark:text-gray-400 text-right">
                  {reviewComment.length}/500
                </div>
              </div>
              <div className="flex items-center justify-between">
                <button
                  type="submit"
                  disabled={
                    reviewLoading ||
                    reviewRating === 0 ||
                    reviewComment.length < 5
                  }
                  className="px-6 py-3 font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50"
                >
                  {reviewLoading ? <>Enviando...</> : 'Enviar reseña'}
                </button>
                {reviewSuccess && (
                  <div className="text-sm font-medium text-green-600 flex items-center gap-1">
                    <Check className="w-4 h-4" />
                    {reviewSuccess}
                  </div>
                )}
                {reviewError && (
                  <div className="text-sm font-medium text-red-600 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {reviewError}
                  </div>
                )}
              </div>
            </form>
          )}
        </div>
      ) : (
        <div className="mb-8 p-4 bg-gray-50 dark:bg-slate-700/30 rounded-lg text-center">
          <p className="text-gray-600 dark:text-gray-400">
            Debes{' '}
            <Link href="/login" className="text-blue-600 hover:underline">
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
        {reviews.length === 0 ? (
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
  );
}

export default function ProductPage() {
  const { addItem, items } = useCart();
  const { isSignedIn, userId } = useAuth();
  const params = useParams<{ slug: string }>();
  const router = useRouter();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [isBuyNowLoading, setIsBuyNowLoading] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [isFavorited, setIsFavorited] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [reviews, setReviews] = useState<Review[]>([]);

  const {
    openCartModal,
    closeCartModal,
    isOpen: isCartModalOpen,
  } = useCartModal();

  const fetchProduct = async (slug: string): Promise<Product | null> => {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/products/${slug}`,
      { cache: 'no-store' },
    );
    if (!res.ok) return null;
    return await res.json();
  };

  const formatUSD = (price: number): string =>
    new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);

  const isInCart = items.some(item => item.id === product?.id);

  const handleBuyNow = async () => {
    if (!product || isBuyNowLoading) return;
    if (isInCart) {
      toast.info('Este producto ya está en tu carrito.');
      setTimeout(openCartModal, 300);
      return;
    }
    setIsBuyNowLoading(true);
    try {
      const imageUrl =
        product.images?.[0]?.url || '/img/placeholder-product.jpg';
      await addItem({
        id: product.id,
        productName: product.productName,
        price: product.price,
        slug: product.slug,
        image: imageUrl,
        quantity,
      });
      toast.success(
        `${product.productName} (x${quantity}) agregado al carrito`,
      );
      setTimeout(openCartModal, 300);
    } catch (error) {
      console.error('Error en handleBuyNow:', error);
      toast.error('Error al agregar el producto al carrito');
    } finally {
      setIsBuyNowLoading(false);
    }
  };

  const handleAddToCart = async () => {
    if (!product || isAddingToCart) return;
    setIsAddingToCart(true);
    try {
      const imageUrl =
        product.images?.[0]?.url || '/img/placeholder-product.jpg';
      await addItem({
        id: product.id,
        productName: product.productName,
        price: product.price,
        slug: product.slug,
        image: imageUrl,
        quantity,
      });
      toast.success(
        `${product.productName} (x${quantity}) agregado al carrito`,
      );
    } catch (error) {
      console.error('Error en handleBuyNow:', error);
      toast.error('Error al agregar el producto al carrito');
    } finally {
      setIsAddingToCart(false);
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: product?.productName || 'Echa un vistazo a este producto',
        text:
          product?.description ?? 'Echa un vistazo a este increíble producto.',
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Enlace copiado al portapapeles');
      setShowShareMenu(false);
    }
  };

  const handleFavorite = () => {
    setIsFavorited(!isFavorited);
    toast.success(
      isFavorited ? 'Eliminado de favoritos' : 'Agregado a favoritos',
    );
  };

  useEffect(() => {
    if (params.slug) {
      setLoading(true);
      fetchProduct(params.slug)
        .then(prod => {
          setProduct(prod);
          if (prod) setQuantity(1);
        })
        .finally(() => setLoading(false));
    }
  }, [params.slug]);

  // --- CORRECCIÓN 2: Usar la variable 'error' para satisfacer a ESLint ---
  useEffect(() => {
    if (product?.id) {
      fetch(`/api/reviews?productId=${product.id}`)
        .then(res => res.json())
        .then(data => setReviews(data.reviews || []))
        .catch(error => console.error(error)); // <-- Cambiado de .catch(console.error)
    }
  }, [product?.id]);

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
      </div>
    );
  if (!product)
    return (
      <div className="flex items-center justify-center min-h-screen text-center p-8">
        <h1 className="text-2xl font-bold">Producto no encontrado</h1>
        <button
          onClick={() => router.push('/products')}
          className="mt-4 px-6 py-3 bg-blue-600 text-white rounded-lg"
        >
          Volver a productos
        </button>
      </div>
    );

  const price =
    typeof product.price === 'string'
      ? parseFloat(product.price)
      : product.price || 0;
  const stock = product.stock || 0;
  const isLowStock = stock > 0 && stock < 5;

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <div className="container px-4 py-8 pt-12 mx-auto max-w-6xl">
        <nav className="mb-8">
          <ol className="flex items-center text-sm text-gray-500 dark:text-gray-400">
            <li>
              <Link href="/" className="hover:text-blue-600">
                Inicio
              </Link>
            </li>
            <li className="mx-2">/</li>
            <li>
              <Link href="/products" className="hover:text-blue-600">
                Productos
              </Link>
            </li>
            <li className="mx-2">/</li>
            <li className="font-medium text-gray-900 dark:text-gray-100 truncate">
              {product.productName}
            </li>
          </ol>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <ProductGallery
              images={product.images || []}
              productName={product.productName}
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="space-y-6"
          >
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                {product.productName}
              </h1>
              {/* --- CORRECCIÓN 1: Añadir un valor por defecto para product.rating --- */}
              <div className="flex items-center gap-4">
                {product.rating && (
                  <div className="flex items-center">
                    <div className="flex text-amber-400">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-5 h-5 ${
                            i < Math.round(product.rating || 0)
                              ? 'fill-current'
                              : ''
                          }`}
                        />
                      ))}
                    </div>
                    <span className="ml-2 text-sm text-gray-600">
                      {product.rating?.toFixed(1)}
                    </span>
                  </div>
                )}
                {product.sold && (
                  <span className="text-sm text-gray-600">
                    {product.sold} vendidos
                  </span>
                )}
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex  justify-center items-baseline gap-2">
                <span className="text-3xl font-bold text-gray-900 dark:text-white">
                  {formatUSD(price)}
                </span>
                {isLowStock && (
                  <span className="px-2 py-1 text-xs font-medium text-orange-800 bg-orange-100 dark:bg-orange-900/30 dark:text-orange-300 rounded-full">
                    ¡Últimas {stock} unidades!
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleFavorite}
                  className="p-2 rounded-full border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-slate-700"
                >
                  <Heart
                    className={`w-5 h-5 ${
                      isFavorited
                        ? 'fill-red-500 text-red-500'
                        : 'text-gray-600'
                    }`}
                  />
                </button>
                <div className="relative">
                  <button
                    onClick={() => setShowShareMenu(!showShareMenu)}
                    className="p-2 rounded-full border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-slate-700"
                  >
                    <Share2 className="w-5 h-5 text-gray-600" />
                  </button>
                  <AnimatePresence>
                    {showShareMenu && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-10"
                      >
                        <button
                          onClick={handleShare}
                          className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-t-lg"
                        >
                          Compartir enlace
                        </button>
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(window.location.href);
                            toast.success('Enlace copiado');
                            setShowShareMenu(false);
                          }}
                          className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-b-lg"
                        >
                          Copiar enlace
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>

            {product.description && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  Descripción
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  {product.description}
                </p>
              </div>
            )}
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

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Cantidad:
                </span>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {stock} disponibles
                </span>
              </div>
              <QuantitySelector
                quantity={quantity}
                setQuantity={setQuantity}
                maxStock={stock}
              />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <button
                  onClick={handleBuyNow}
                  disabled={stock === 0 || isBuyNowLoading}
                  className="flex items-center justify-center cursor-pointer gap-2 px-6 py-3 font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50"
                >
                  {isBuyNowLoading ? (
                    <>Procesando...</>
                  ) : (
                    <>
                      <ShoppingCart className="w-5 h-5" />
                      Pedir ahora
                    </>
                  )}
                </button>
                <button
                  onClick={handleAddToCart}
                  disabled={stock === 0 || isAddingToCart}
                  className="flex items-center justify-center  cursor-pointer gap-2 px-6 py-3 font-medium text-blue-600 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 dark:bg-blue-900/20 dark:border-blue-800 dark:text-blue-400 dark:hover:bg-blue-900/30 disabled:opacity-50"
                >
                  {isAddingToCart ? (
                    <>Agregando...</>
                  ) : (
                    <>
                      <ShoppingCart className="w-5 h-5" />
                      {isInCart ? 'En el carrito' : 'Añadir al carrito'}
                    </>
                  )}
                </button>
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

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-16"
        >
          <ReviewsSection
            reviews={reviews}
            productId={product.id}
            isSignedIn={!!isSignedIn}
            userId={userId || undefined}
          />
        </motion.div>
      </div>
      <CheckoutModal isOpen={isCartModalOpen} onClose={closeCartModal} />
    </main>
  );
}
