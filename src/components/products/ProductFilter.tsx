import { RotateCcw, Search, SlidersHorizontal } from 'lucide-react';
import React from 'react';
import { ProductCategory, ProductFilterOptions } from '../../models/product.model';
import { productService } from '../../services/productService';

interface ProductFilterProps {
  filters: ProductFilterOptions;
  onChange: (filters: Partial<ProductFilterOptions>) => void;
  onReset: () => void;
  totalResults: number;
}

export const ProductFilter: React.FC<ProductFilterProps> = ({
  filters,
  onChange,
  onReset,
  totalResults,
}) => {
  const categories: (ProductCategory | 'all')[] = ['all', ...productService.getCategories()];

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange({ search: e.target.value });
  };

  const handleCategorySelect = (category: ProductCategory | 'all') => {
    onChange({ category });
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onChange({ sortBy: e.target.value as any });
  };

  const handleInStockToggle = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange({ inStockOnly: e.target.checked });
  };

  return (
    <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-4 shadow-2xs space-y-4">
      {/* Top search & sort row */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:max-w-md">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-neutral-400 pointer-events-none" />
          <input
            type="text"
            value={filters.search || ''}
            onChange={handleSearchChange}
            placeholder="Buscar por nombre, descripción o categoría..."
            className="w-full pl-9 pr-4 py-2 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg text-sm text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
          <div className="flex items-center gap-1.5 text-xs text-neutral-500 dark:text-neutral-400">
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>Ordenar:</span>
            <select
              value={filters.sortBy || 'name-asc'}
              onChange={handleSortChange}
              className="bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-md px-2 py-1 text-xs text-neutral-800 dark:text-neutral-200 focus:outline-none"
            >
              <option value="name-asc">Nombre (A - Z)</option>
              <option value="price-asc">Precio: Menor a Mayor</option>
              <option value="price-desc">Precio: Mayor a Menor</option>
              <option value="rating-desc">Mejor Valorados</option>
            </select>
          </div>

          <button
            onClick={onReset}
            title="Restablecer filtros"
            className="text-xs text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200 inline-flex items-center gap-1 px-2 py-1 rounded hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
          >
            <RotateCcw className="w-3 h-3" /> Limpiar
          </button>
        </div>
      </div>

      {/* Category Pills and Stock Toggle */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-neutral-100 dark:border-neutral-800">
        <div className="flex flex-wrap items-center gap-1.5">
          {categories.map((cat) => {
            const isSelected = (filters.category || 'all') === cat;
            return (
              <button
                key={cat}
                onClick={() => handleCategorySelect(cat)}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                  isSelected
                    ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900'
                    : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-700'
                }`}
              >
                {cat === 'all' ? 'Todos los productos' : cat}
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-4 text-xs text-neutral-600 dark:text-neutral-400">
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={Boolean(filters.inStockOnly)}
              onChange={handleInStockToggle}
              className="rounded border-neutral-300 dark:border-neutral-700 text-blue-600 focus:ring-blue-500 h-3.5 w-3.5"
            />
            <span>Solo disponibles</span>
          </label>

          <span className="text-neutral-400">|</span>
          <span className="font-medium text-neutral-900 dark:text-neutral-100">
            {totalResults} {totalResults === 1 ? 'producto' : 'productos'}
          </span>
        </div>
      </div>
    </div>
  );
};
