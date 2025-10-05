'use client';
import { useCart } from '@/hooks/use-cart';
import { Minus, Plus, ShoppingBag, Trash2, X } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';
import CheckoutModal from './checkout/CheckoutModal';

interface CartModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CartModal({ isOpen, onClose }: CartModalProps) {
  const {
    items,
    removeItem,
    updateQuantity,
    clearCart,
    loading: cartLoading,
  } = useCart();
  const [isCheckoutOpen, setCheckoutOpen] = useState(false);

  const total = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  const handleQuantityChange = async (itemId: string, newQuantity: number) => {
    try {
      await updateQuantity(itemId, newQuantity);
    } catch (error) {
      console.error('Error al actualizar cantidad:', error);
    }
  };

  const handleRemoveItem = async (itemId: string) => {
    try {
      await removeItem(itemId);
    } catch (error) {
      console.error('Error al eliminar producto:', error);
    }
  };

  const handleClearCart = async () => {
    try {
      await clearCart();
    } catch (error) {
      console.error('Error al vaciar carrito:', error);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center sm:items-center"
      role="dialog"
      aria-modal="true"
      aria-labelledby="cart-modal-title"
    >
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative w-full max-w-md bg-background rounded-t-lg sm:rounded-lg shadow-xl border">
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center gap-2">
            <ShoppingBag className="h-5 w-5 text-primary" />
            <h2 id="cart-modal-title" className="text-lg font-semibold">
              Carrito de Compras
            </h2>
            {items.length > 0 && (
              <span className="bg-primary text-primary-foreground text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                {items.length}
              </span>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-muted rounded-md transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="max-h-96 overflow-y-auto">
          {items.length === 0 ? (
            <div className="p-8 text-center">
              <ShoppingBag className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">
                Tu carrito está vacío
              </h3>
              <p className="text-muted-foreground mb-4">
                Añade algunos productos para verlos aquí
              </p>
            </div>
          ) : (
            <div className="p-4 space-y-4">
              {items.map(item => (
                <div
                  key={item.id}
                  className="flex gap-3 p-3 bg-muted/20 rounded-lg"
                >
                  <div className="relative w-16 h-16 rounded-md overflow-hidden bg-muted">
                    {item.image ? (
                      <Image
                        src={item.image}
                        alt={item.productName}
                        width={64}
                        height={64}
                      />
                    ) : (
                      <div className="h-full w-full flex items-center justify-center">
                        <ShoppingBag className="h-8 w-8 text-muted-foreground" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-sm truncate">
                      {item.productName}
                    </h3>
                    <p className="text-sm font-medium text-primary">
                      ${Number(item.price).toFixed(2)}
                    </p>

                    <div className="flex items-center gap-2 mt-2">
                      <button
                        onClick={() =>
                          handleQuantityChange(item.id, item.quantity - 1)
                        }
                        disabled={cartLoading}
                        className="p-1 hover:bg-muted rounded-md transition-colors disabled:opacity-50"
                      >
                        <Minus className="h-3 w-3" />
                      </button>

                      <div className="flex items-center gap-1">
                        <span className="text-sm font-medium min-w-[20px] text-center">
                          {item.quantity}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          ({item.quantity > 1 ? 'unidades' : 'unidad'})
                        </span>
                      </div>

                      <button
                        onClick={() =>
                          handleQuantityChange(item.id, item.quantity + 1)
                        }
                        disabled={cartLoading}
                        className="p-1 hover:bg-muted rounded-md transition-colors disabled:opacity-50"
                      >
                        <Plus className="h-3 w-3" />
                      </button>
                    </div>
                  </div>

                  <button
                    onClick={() => handleRemoveItem(item.id)}
                    disabled={cartLoading}
                    className="p-1 hover:bg-muted rounded-md transition-colors text-muted-foreground hover:text-destructive disabled:opacity-50"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {items.length > 0 && (
          <div className="p-4 border-t space-y-3">
            <div className="flex justify-between items-center">
              <span className="font-medium">Total:</span>
              <span className="text-lg font-bold text-primary">
                ${Number(total).toFixed(2)}
              </span>
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleClearCart}
                className="flex-1 px-4 py-2 text-sm border border-border rounded-md hover:bg-muted transition-colors"
              >
                Vaciar Carrito
              </button>
              <button
                onClick={() => setCheckoutOpen(true)}
                className="flex-1 px-4 py-2 text-sm bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-md transition-all duration-300 hover:scale-105 text-center font-semibold"
              >
                Finalizar Pedido
              </button>
            </div>
            {isCheckoutOpen && (
              <CheckoutModal
                isOpen={isCheckoutOpen}
                onClose={() => setCheckoutOpen(false)}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
}
