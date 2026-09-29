import { Check, ShieldCheck, ShoppingCart, Star, Truck } from 'lucide-react';
import React, { useState } from 'react';
import { Product } from '../../models/product.model';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { Modal } from '../common/Modal';

interface ProductDetailModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (product: Product, quantity: number) => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  isOpen,
  onClose,
  onAddToCart,
}) => {
  const [quantity, setQuantity] = useState<number>(1);
  const [added, setAdded] = useState(false);

  if (!product) return null;

  const handleAdd = () => {
    onAddToCart(product, quantity);
    setAdded(true);
    setTimeout(() => {
      setAdded(false);
      onClose();
    }, 900);
  };

  const isOutOfStock = product.stock <= 0;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Detalle del Producto" maxWidth="2xl">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Product Image */}
        <div className="aspect-square rounded-lg overflow-hidden bg-neutral-100 dark:bg-neutral-800">
          <img
            src={product.imageUrl}
            alt={product.name}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Details & Specs */}
        <div className="flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center gap-2 text-xs text-neutral-500 mb-1">
              <span className="font-semibold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                {product.category}
              </span>
              <span>·</span>
              <span>Agregado {formatDate(product.createdAt)}</span>
            </div>

            <h2 className="text-xl font-bold text-neutral-900 dark:text-white leading-tight">
              {product.name}
            </h2>

            <div className="flex items-center gap-2 mt-2">
              <div className="flex items-center text-amber-500">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-3.5 h-3.5 ${
                      i < Math.floor(product.rating)
                        ? 'fill-current'
                        : 'text-neutral-300 dark:text-neutral-700'
                    }`}
                  />
                ))}
              </div>
              <span className="text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                {product.rating.toFixed(1)}
              </span>
              <span className="text-xs text-neutral-400">
                ({product.reviewsCount} opiniones verificadas)
              </span>
            </div>

            <p className="mt-3 text-sm text-neutral-600 dark:text-neutral-300 leading-relaxed">
              {product.description}
            </p>

            {/* Technical specs table if available */}
            {product.specs && Object.keys(product.specs).length > 0 && (
              <div className="mt-4 pt-3 border-t border-neutral-100 dark:border-neutral-800">
                <h4 className="text-xs font-semibold uppercase text-neutral-500 mb-2">
                  Especificaciones Técnicas
                </h4>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  {Object.entries(product.specs).map(([key, value]) => (
                    <div key={key} className="bg-neutral-50 dark:bg-neutral-800/60 p-2 rounded">
                      <span className="text-neutral-500 block">{key}</span>
                      <span className="font-medium text-neutral-800 dark:text-neutral-200">{value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Pricing & Add to Cart Section */}
          <div className="pt-4 border-t border-neutral-100 dark:border-neutral-800 space-y-3">
            <div className="flex items-baseline justify-between">
              <div>
                <span className="text-xs text-neutral-400 block">Precio final</span>
                <span className="text-2xl font-bold text-neutral-900 dark:text-white">
                  {formatCurrency(product.price)}
                </span>
              </div>
              <div className="text-right">
                <span className="text-xs text-neutral-400 block">Disponibilidad</span>
                <span
                  className={`text-xs font-semibold ${
                    isOutOfStock
                      ? 'text-rose-600'
                      : product.stock < 5
                      ? 'text-amber-600'
                      : 'text-emerald-600'
                  }`}
                >
                  {isOutOfStock ? 'Agotado' : `${product.stock} unidades en almacén`}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {/* Quantity selector */}
              <div className="flex items-center border border-neutral-200 dark:border-neutral-700 rounded-lg overflow-hidden bg-neutral-50 dark:bg-neutral-800">
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  disabled={quantity <= 1 || isOutOfStock}
                  className="px-3 py-2 text-neutral-600 hover:bg-neutral-200 dark:hover:bg-neutral-700 disabled:opacity-30"
                >
                  -
                </button>
                <span className="px-3 py-2 text-xs font-semibold text-neutral-800 dark:text-neutral-200 min-w-8 text-center">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
                  disabled={quantity >= product.stock || isOutOfStock}
                  className="px-3 py-2 text-neutral-600 hover:bg-neutral-200 dark:hover:bg-neutral-700 disabled:opacity-30"
                >
                  +
                </button>
              </div>

              {/* Add button */}
              <button
                type="button"
                onClick={handleAdd}
                disabled={isOutOfStock}
                className={`flex-1 py-2.5 px-4 rounded-lg font-medium text-sm inline-flex items-center justify-center gap-2 transition-colors ${
                  added
                    ? 'bg-emerald-600 text-white'
                    : isOutOfStock
                    ? 'bg-neutral-200 text-neutral-400 dark:bg-neutral-800 dark:text-neutral-600 cursor-not-allowed'
                    : 'bg-neutral-900 text-white hover:bg-neutral-800 dark:bg-neutral-100 dark:text-neutral-900 dark:hover:bg-white'
                }`}
              >
                {added ? (
                  <>
                    <Check className="w-4 h-4" /> ¡Añadido al carrito!
                  </>
                ) : (
                  <>
                    <ShoppingCart className="w-4 h-4" /> Añadir al Carrito
                  </>
                )}
              </button>
            </div>

            <div className="flex items-center justify-between text-2xs text-neutral-500 pt-2 border-t border-neutral-100 dark:border-neutral-800">
              <span className="flex items-center gap-1">
                <Truck className="w-3.5 h-3.5 text-blue-500" /> Envío gratis desde $500
              </span>
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" /> Garantía de 2 años
              </span>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};
