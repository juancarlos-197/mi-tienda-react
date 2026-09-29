import { Trash2 } from 'lucide-react';
import React from 'react';
import { CartItem } from '../../models/cart.model';
import { formatCurrency } from '../../utils/formatters';

interface CartItemRowProps {
  item: CartItem;
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemove: (productId: string) => void;
}

export const CartItemRow: React.FC<CartItemRowProps> = ({
  item,
  onUpdateQuantity,
  onRemove,
}) => {
  const { product, quantity } = item;

  return (
    <div className="flex gap-3 py-3 border-b border-neutral-100 dark:border-neutral-800 last:border-0 items-center">
      <img
        src={product.imageUrl}
        alt={product.name}
        className="w-16 h-16 rounded-lg object-cover bg-neutral-100 dark:bg-neutral-800 shrink-0"
      />

      <div className="flex-1 min-w-0">
        <h4 className="text-xs font-semibold text-neutral-900 dark:text-neutral-100 truncate">
          {product.name}
        </h4>
        <span className="text-2xs text-neutral-500 uppercase tracking-wider block">
          {product.category}
        </span>
        <div className="text-xs font-bold text-neutral-800 dark:text-neutral-200 mt-1">
          {formatCurrency(product.price)}
        </div>
      </div>

      <div className="flex flex-col items-end gap-2 shrink-0">
        <button
          onClick={() => onRemove(product.id)}
          aria-label={`Eliminar ${product.name}`}
          className="text-neutral-400 hover:text-rose-500 transition-colors p-1"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>

        <div className="flex items-center border border-neutral-200 dark:border-neutral-700 rounded-md overflow-hidden bg-neutral-50 dark:bg-neutral-800">
          <button
            onClick={() => onUpdateQuantity(product.id, quantity - 1)}
            className="px-2 py-0.5 text-xs text-neutral-600 hover:bg-neutral-200 dark:hover:bg-neutral-700 cursor-pointer"
          >
            -
          </button>
          <span className="px-2 py-0.5 text-xs font-medium text-center min-w-6">
            {quantity}
          </span>
          <button
            onClick={() => onUpdateQuantity(product.id, quantity + 1)}
            disabled={quantity >= product.stock}
            className="px-2 py-0.5 text-xs text-neutral-600 hover:bg-neutral-200 dark:hover:bg-neutral-700 disabled:opacity-30 cursor-pointer"
          >
            +
          </button>
        </div>
      </div>
    </div>
  );
};
