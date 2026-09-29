import { ArrowRight, ShoppingBag, Tag, X } from 'lucide-react';
import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { formatCurrency } from '../../utils/formatters';
import { CartItemRow } from './CartItemRow';

export const CartDrawer: React.FC = () => {
  const {
    items,
    removeItem,
    updateQuantity,
    clearCart,
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
  } = useCart();
  const { user, isAuthenticated } = useAuth();

  const [couponCode, setCouponCode] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [checkoutStep, setCheckoutStep] = useState<'cart' | 'customer' | 'success'>('cart');
  const [customerInfo, setCustomerInfo] = useState({
    name: user?.name || 'Cliente Demostración',
    email: user?.email || 'cliente@ejemplo.com',
    address: 'Calle Mayor 10, Madrid',
  });

  if (!isCartOpen) return null;

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (couponCode.trim()) {
      applyCoupon(couponCode);
      setCouponCode('');
    }
  };

  const handleCheckoutSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    try {
      await checkout(customerInfo);
      setCheckoutStep('success');
    } catch {
      // Handled in context toast
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-neutral-900/50 backdrop-blur-xs transition-opacity"
        onClick={() => {
          setIsCartOpen(false);
          setCheckoutStep('cart');
        }}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white dark:bg-neutral-900 shadow-2xl flex flex-col border-l border-neutral-200 dark:border-neutral-800">
          {/* Header */}
          <div className="p-4 border-b border-neutral-100 dark:border-neutral-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-neutral-800 dark:text-neutral-200" />
              <h2 className="font-semibold text-base text-neutral-900 dark:text-white">
                {checkoutStep === 'cart'
                  ? `Carrito (${items.reduce((s, i) => s + i.quantity, 0)})`
                  : checkoutStep === 'customer'
                  ? 'Confirmación y Envío'
                  : '¡Pedido Confirmado!'}
              </h2>
            </div>
            <button
              onClick={() => {
                setIsCartOpen(false);
                setCheckoutStep('cart');
              }}
              className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Drawer Body */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {checkoutStep === 'success' ? (
              <div className="text-center py-12 space-y-4">
                <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto text-2xl font-bold">
                  ✓
                </div>
                <h3 className="text-lg font-bold text-neutral-900 dark:text-white">
                  ¡Gracias por tu compra!
                </h3>
                <p className="text-xs text-neutral-500 max-w-xs mx-auto leading-relaxed">
                  Tu pedido ha sido procesado mediante la capa de servicios y persistido en la base de datos simulada.
                </p>
                <button
                  onClick={() => {
                    setIsCartOpen(false);
                    setCheckoutStep('cart');
                  }}
                  className="px-4 py-2 bg-neutral-900 text-white rounded-lg text-xs font-semibold hover:bg-neutral-800"
                >
                  Continuar explorando
                </button>
              </div>
            ) : items.length === 0 ? (
              <div className="text-center py-16 space-y-3">
                <ShoppingBag className="w-12 h-12 text-neutral-300 dark:text-neutral-700 mx-auto" />
                <h3 className="font-medium text-sm text-neutral-800 dark:text-neutral-200">
                  Tu carrito está vacío
                </h3>
                <p className="text-xs text-neutral-500">
                  Agrega productos desde la tienda o consulta los módulos del curso.
                </p>
              </div>
            ) : checkoutStep === 'cart' ? (
              <div>
                <div className="divide-y divide-neutral-100 dark:divide-neutral-800">
                  {items.map((item) => (
                    <CartItemRow
                      key={item.product.id}
                      item={item}
                      onUpdateQuantity={updateQuantity}
                      onRemove={removeItem}
                    />
                  ))}
                </div>

                {/* Coupon Code Section */}
                <div className="mt-6 pt-4 border-t border-neutral-100 dark:border-neutral-800">
                  <div className="flex items-center gap-1.5 text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                    <Tag className="w-3.5 h-3.5" />
                    <span>¿Tienes un cupón de descuento?</span>
                  </div>

                  {coupon ? (
                    <div className="flex items-center justify-between p-2.5 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-lg text-xs text-emerald-800 dark:text-emerald-300">
                      <span>Cupón activo: <strong>{coupon}</strong> (10% descuento)</span>
                      <button
                        onClick={removeCoupon}
                        className="text-xs font-semibold hover:underline cursor-pointer"
                      >
                        Quitar
                      </button>
                    </div>
                  ) : (
                    <form onSubmit={handleApplyCoupon} className="flex gap-2">
                      <input
                        type="text"
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value)}
                        placeholder="Prueba 'REACT2026' o 'REACT10'"
                        className="flex-1 px-3 py-1.5 text-xs border border-neutral-200 dark:border-neutral-700 rounded-lg bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-1 focus:ring-blue-500 uppercase"
                      />
                      <button
                        type="submit"
                        className="px-3 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-white rounded-lg text-xs font-medium transition-colors"
                      >
                        Aplicar
                      </button>
                    </form>
                  )}
                </div>
              </div>
            ) : (
              /* Step 2: Shipping / Customer Information */
              <form id="checkout-form" onSubmit={handleCheckoutSubmit} className="space-y-4">
                <div className="text-xs text-neutral-500 mb-2">
                  Por favor confirma los datos de entrega para procesar la orden:
                </div>
                <div>
                  <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                    Nombre completo
                  </label>
                  <input
                    type="text"
                    required
                    value={customerInfo.name}
                    onChange={(e) => setCustomerInfo({ ...customerInfo, name: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-neutral-200 dark:border-neutral-700 rounded-lg bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                    Correo electrónico
                  </label>
                  <input
                    type="email"
                    required
                    value={customerInfo.email}
                    onChange={(e) => setCustomerInfo({ ...customerInfo, email: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-neutral-200 dark:border-neutral-700 rounded-lg bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                    Dirección de envío
                  </label>
                  <input
                    type="text"
                    required
                    value={customerInfo.address}
                    onChange={(e) => setCustomerInfo({ ...customerInfo, address: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-neutral-200 dark:border-neutral-700 rounded-lg bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100"
                  />
                </div>

                <div className="p-3 bg-blue-50 dark:bg-blue-950/30 rounded-lg border border-blue-200 dark:border-blue-900 text-xs text-blue-800 dark:text-blue-300">
                  Esta orden invocará el endpoint <code>POST /api/orders</code> con el interceptor de seguridad y descontará el stock en tiempo real.
                </div>
              </form>
            )}
          </div>

          {/* Footer Summary & Actions */}
          {items.length > 0 && checkoutStep !== 'success' && (
            <div className="p-4 border-t border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/60 space-y-3">
              <div className="space-y-1.5 text-xs text-neutral-600 dark:text-neutral-400">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-medium text-neutral-900 dark:text-neutral-100">
                    {formatCurrency(subtotal)}
                  </span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-emerald-600 dark:text-emerald-400 font-medium">
                    <span>Descuento cupón (10%)</span>
                    <span>-{formatCurrency(discount)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Gastos de envío</span>
                  <span>{shipping === 0 ? 'Gratis' : formatCurrency(shipping)}</span>
                </div>
                <div className="flex justify-between text-sm font-bold text-neutral-900 dark:text-white pt-2 border-t border-neutral-200 dark:border-neutral-700">
                  <span>Total a pagar</span>
                  <span className="text-base">{formatCurrency(total)}</span>
                </div>
              </div>

              {checkoutStep === 'cart' ? (
                <div className="space-y-2">
                  <button
                    onClick={() => setCheckoutStep('customer')}
                    className="w-full py-2.5 px-4 bg-neutral-900 hover:bg-neutral-800 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-100 text-white rounded-lg text-sm font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer"
                  >
                    <span>Proceder al pago</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                  <button
                    onClick={clearCart}
                    className="w-full py-1 text-2xs text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 text-center"
                  >
                    Vaciar carrito
                  </button>
                </div>
              ) : (
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setCheckoutStep('cart')}
                    className="px-4 py-2 border border-neutral-300 dark:border-neutral-700 text-xs font-semibold rounded-lg text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800"
                  >
                    Volver
                  </button>
                  <button
                    type="submit"
                    form="checkout-form"
                    disabled={isProcessing}
                    className="flex-1 py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer"
                  >
                    {isProcessing ? 'Procesando...' : `Confirmar y Pagar ${formatCurrency(total)}`}
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
