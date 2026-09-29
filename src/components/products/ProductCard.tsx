import { Check, Eye, ShoppingCart, Star } from 'lucide-react';
import React, { useState } from 'react';
import { Product } from '../../models/product.model';
import { formatCurrency } from '../../utils/formatters';

export interface ProductCardProps {
  product: Product;
  onAddToCart?: (product: Product) => void;
  onSelect?: (product: Product) => void;
  children?: React.ReactNode;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onAddToCart,
  onSelect,
  children,
}) => {
  const [justAdded, setJustAdded] = useState(false);
  const isOutOfStock = product.stock <= 0;

  const handleAddClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isOutOfStock || !onAddToCart) return;
    onAddToCart(product);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1200);
  };

  return (
    <article
      onClick={() => onSelect?.(product)}
      className="group relative flex flex-col bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200/80 dark:border-neutral-800 overflow-hidden transition-all duration-200 hover:shadow-md hover:border-neutral-300 dark:hover:border-neutral-700 cursor-pointer"
    >
      {/* Product Image Frame */}
      <div className="relative aspect-4/3 w-full bg-neutral-100 dark:bg-neutral-800 overflow-hidden">
        <img
          src={product.imageUrl}
          alt={product.name}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />

        {/* Quick View overlay hint */}
        <div className="absolute inset-0 bg-neutral-950/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/90 dark:bg-neutral-900/90 text-xs font-medium text-neutral-800 dark:text-neutral-100 backdrop-blur-xs shadow-xs">
            <Eye className="w-3.5 h-3.5" /> Ver detalles
          </span>
        </div>

        {/* Stock tag unboxed in accordance with design principles */}
        {isOutOfStock ? (
          <div className="absolute top-2.5 right-2.5 px-2 py-0.5 text-xs font-semibold bg-rose-50 text-rose-700 dark:bg-rose-950/70 dark:text-rose-300 rounded border border-rose-200 dark:border-rose-900">
            Agotado
          </div>
        ) : product.stock <= 5 ? (
          <div className="absolute top-2.5 right-2.5 px-2 py-0.5 text-xs font-semibold bg-amber-50 text-amber-700 dark:bg-amber-950/70 dark:text-amber-300 rounded border border-amber-200 dark:border-amber-900">
            ¡Solo {product.stock} restantes!
          </div>
        ) : null}
      </div>

      {/* Body */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Metadata line without pills */}
          <div className="flex items-center gap-2 text-xs text-neutral-500 dark:text-neutral-400 mb-1">
            <span>{product.category}</span>
            <span>·</span>
            <span className="flex items-center gap-0.5 text-amber-500 font-medium">
              <Star className="w-3 h-3 fill-current" />
              {product.rating.toFixed(1)} ({product.reviewsCount})
            </span>
          </div>

          <h3 className="font-semibold text-base text-neutral-900 dark:text-neutral-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-1">
            {product.name}
          </h3>

          <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400 line-clamp-2 leading-relaxed">
            {product.description}
          </p>
        </div>

        {/* Pricing & Action */}
        <div className="mt-4 pt-3 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-between">
          <div>
            <span className="text-xs text-neutral-400 block">Precio</span>
            <span className="text-lg font-bold text-neutral-900 dark:text-white">
              {formatCurrency(product.price)}
            </span>
          </div>

          <button
            onClick={handleAddClick}
            disabled={isOutOfStock}
            aria-label={`Añadir ${product.name} al carrito`}
            className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
              justAdded
                ? 'bg-emerald-600 text-white'
                : isOutOfStock
                ? 'bg-neutral-100 text-neutral-400 dark:bg-neutral-800 dark:text-neutral-600 cursor-not-allowed'
                : 'bg-neutral-900 hover:bg-neutral-800 text-white dark:bg-neutral-100 dark:text-neutral-900 dark:hover:bg-white shadow-xs'
            }`}
          >
            {justAdded ? (
              <>
                <Check className="w-3.5 h-3.5" /> Añadido
              </>
            ) : (
              <>
                <ShoppingCart className="w-3.5 h-3.5" /> Añadir
              </>
            )}
          </button>
        </div>

        {/* Slot para composición de children (demostración Módulo 2) */}
        {children && <div className="mt-3 pt-2 border-t border-neutral-100 dark:border-neutral-800">{children}</div>}
      </div>
    </article>
  );
};
