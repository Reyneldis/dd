'use client';
import { useCart } from '@/hooks/use-cart';

type Product = {
  id: string;
  productName: string;
  price: number | string;
  images?: (string | { url: string; isPrimary?: boolean })[];
  slug: string;
};

export default function AddToCartButton({
  product,
  buttonClassName,
  children,
  icon,
}: {
  product: Product;
  buttonClassName?: string;
  children?: React.ReactNode;
  icon?: React.ReactNode;
}) {
  const { addItem } = useCart();

  const handleAdd = () => {
    addItem({
      id: product.id,
      productName: product.productName,
      price: typeof product.price === 'string' ? parseFloat(product.price) : product.price,
      image:
        product.images && product.images.length > 0
          ? typeof product.images[0] === 'string'
            ? product.images[0]
            : (
                product.images.find(
                  img => typeof img !== 'string' && img.isPrimary,
                ) as { url: string } | undefined
              )?.url || (product.images[0] as { url: string }).url
          : '/img/placeholder-product.jpg',
      slug: product.slug,
    });
  };

  return (
    <button
      onClick={handleAdd}
      className={
        buttonClassName ||
        'w-full mt-2 bg-gradient-to-r from-primary to-secondary text-white text-sm font-semibold py-2 rounded-md hover:brightness-110 shadow transition-all duration-200'
      }
    >
      {icon && <span className="mr-2">{icon}</span>}
      {children ? children : 'Añadir al carrito'}
    </button>
  );
}
