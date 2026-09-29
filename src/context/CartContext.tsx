import confetti from 'canvas-confetti';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { CartItem } from '../models/cart.model';
import { Product } from '../models/product.model';
import { productService } from '../services/productService';
import { storage } from '../utils/storage';
import { useNotification } from './NotificationContext';

const CART_STORAGE_KEY = 'mitienda_cart_items';

interface CartContextType {
  items: CartItem[];
  addItem: (product: Product, quantity?: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  subtotal: number;
  discount: number;
  shipping: number;
  total: number;
  coupon: string | null;
  applyCoupon: (code: string) => boolean;
  removeCoupon: () => void;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  checkout: (customer: any) => Promise<any>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>(() => {
    return storage.get<CartItem[]>(CART_STORAGE_KEY, []);
  });
  const [coupon, setCoupon] = useState<string | null>(null);
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const { success, warning, error } = useNotification();

  useEffect(() => {
    storage.set(CART_STORAGE_KEY, items);
  }, [items]);

  const addItem = (product: Product, quantity: number = 1) => {
    if (product.stock <= 0) {
      warning(`Lo sentimos, el producto "${product.name}" no tiene existencias disponibles.`);
      return;
    }

    setItems((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        const nextQty = existing.quantity + quantity;
        if (nextQty > product.stock) {
          warning(`Solo quedan ${product.stock} unidades en stock.`);
          return prev.map((item) =>
            item.product.id === product.id ? { ...item, quantity: product.stock } : item
          );
        }
        success(`Se sumaron ${quantity} unidades de "${product.name}"`);
        return prev.map((item) =>
          item.product.id === product.id ? { ...item, quantity: nextQty } : item
        );
      } else {
        success(`"${product.name}" añadido al carrito`);
        return [...prev, { product, quantity: Math.min(quantity, product.stock) }];
      }
    });
  };

  const removeItem = (productId: string) => {
    setItems((prev) => prev.filter((item) => item.product.id !== productId));
    success('Producto removido del carrito');
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(productId);
      return;
    }

    setItems((prev) =>
      prev.map((item) => {
        if (item.product.id === productId) {
          const maxAllowed = Math.min(quantity, item.product.stock);
          if (quantity > item.product.stock) {
            warning(`Existencias limitadas a ${item.product.stock} unidades.`);
          }
          return { ...item, quantity: maxAllowed };
        }
        return item;
      })
    );
  };

  const clearCart = () => {
    setItems([]);
    setCoupon(null);
  };

  const applyCoupon = (code: string): boolean => {
    const clean = code.trim().toUpperCase();
    if (clean === 'REACT2026' || clean === 'REACT10') {
      setCoupon(clean);
      success('¡Cupón de descuento del 10% aplicado exitosamente!');
      return true;
    } else {
      warning('El código de cupón ingresado no es válido.');
      return false;
    }
  };

  const removeCoupon = () => {
    setCoupon(null);
    infoNotification('Cupón removido');
  };

  const infoNotification = (msg: string) => {
    success(msg);
  };

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const discount = coupon ? subtotal * 0.1 : 0;
  const shipping = subtotal > 500 || subtotal === 0 ? 0 : 25;
  const total = Math.max(0, subtotal - discount + shipping);

  const checkout = async (customer: any) => {
    if (items.length === 0) {
      error('El carrito está vacío');
      throw new Error('Carrito vacío');
    }

    try {
      const order = await productService.checkoutOrder({
        items,
        customer,
        payment: { method: 'Tarjeta / Simulado', total },
      });

      // Efecto confetti de celebración
      try {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
        });
      } catch {
        // Safe fallback
      }

      clearCart();
      setIsCartOpen(false);
      success('¡Compra completada con éxito! Tu pedido ha sido procesado.');
      return order;
    } catch (err: any) {
      error(err.message || 'Error al procesar el pedido');
      throw err;
    }
  };

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        totalItems,
        subtotal,
        discount,
        shipping,
        total,
        coupon,
        applyCoupon,
        removeCoupon,
        isCartOpen,
        setIsCartOpen,
        checkout,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart debe usarse dentro de un CartProvider');
  }
  return context;
};
