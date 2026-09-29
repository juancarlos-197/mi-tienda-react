import { ArrowRight, Sparkles, Tag, Zap } from 'lucide-react';
import React, { useState } from 'react';
import { ArchitectureDiagram } from '../components/admin/ArchitectureDiagram';
import { ProductCard } from '../components/products/ProductCard';
import { ProductDetailModal } from '../components/products/ProductDetailModal';
import { ProductFilter } from '../components/products/ProductFilter';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useProducts } from '../hooks/useProducts';
import { Product } from '../models/product.model';

interface StorePageProps {
  onNavigateToCourse: () => void;
  onNavigateToAdmin: () => void;
}

export const StorePage: React.FC<StorePageProps> = ({ onNavigateToCourse, onNavigateToAdmin }) => {
  const { products, loading, error, filters, updateFilters, resetFilters } = useProducts({
    sortBy: 'name-asc',
  });
  const { addItem } = useCart();
  const { isAdmin } = useAuth();
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [showArchDiagram, setShowArchDiagram] = useState(false);

  const featuredProduct = products.find((p) => p.featured) || products[0];

  return (
    <div className="space-y-8">
      {/* Hero Banner with Modern Anti-Slop Design */}
      <section className="relative rounded-2xl bg-neutral-900 text-white overflow-hidden p-6 sm:p-10 border border-neutral-800">
        <div className="relative z-10 max-w-2xl space-y-4">
          <div className="inline-flex items-center gap-2 text-xs font-semibold px-2.5 py-1 rounded-md bg-neutral-800 text-blue-400 border border-neutral-700">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Tienda Web Completa & Proyecto Práctico</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
            E-Commerce Profesional con Arquitectura React 19
          </h1>

          <p className="text-sm sm:text-base text-neutral-300 leading-relaxed">
            Una tienda electrónica completamente funcional construida con componentes desacoplados, capa de servicios HTTP, interceptores de seguridad con Bearer token, manejo centralizado de errores y carrito global con Context API.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={onNavigateToCourse}
              className="px-4 py-2.5 bg-white text-neutral-900 hover:bg-neutral-100 rounded-lg text-xs font-bold inline-flex items-center gap-2 transition-colors cursor-pointer"
            >
              <span>Ver Ruta del Curso (15 Módulos)</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={() => setShowArchDiagram(!showArchDiagram)}
              className="px-4 py-2.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 rounded-lg text-xs font-medium inline-flex items-center gap-2 transition-colors cursor-pointer border border-neutral-700"
            >
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              <span>{showArchDiagram ? 'Ocultar Arquitectura' : 'Ver Diagrama de Arquitectura'}</span>
            </button>

            {isAdmin && (
              <button
                onClick={onNavigateToAdmin}
                className="px-4 py-2.5 bg-amber-600 hover:bg-amber-500 text-white rounded-lg text-xs font-semibold inline-flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <span>Panel CRUD Productos</span>
              </button>
            )}
          </div>
        </div>

        {/* Hero Decorative background elements */}
        <div className="absolute right-0 top-0 bottom-0 w-1/3 opacity-15 pointer-events-none hidden md:block">
          {featuredProduct && (
            <img
              src={featuredProduct.imageUrl}
              alt=""
              className="w-full h-full object-cover object-center filter grayscale"
            />
          )}
        </div>
      </section>

      {/* Architecture Visualizer Dropdown if toggled */}
      {showArchDiagram && (
        <div className="animate-in fade-in slide-in-from-top-4 duration-300">
          <ArchitectureDiagram />
        </div>
      )}

      {/* Product Filters & Catalog */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-neutral-900 dark:text-white">
              Catálogo de Productos
            </h2>
            <p className="text-xs text-neutral-500">
              Conectado a <code>productService.getProducts()</code> con filtros y ordenamiento en tiempo real
            </p>
          </div>
        </div>

        {/* Filter controls */}
        <ProductFilter
          filters={filters || {}}
          onChange={updateFilters}
          onReset={resetFilters}
          totalResults={products.length}
        />

        {/* Catalog Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 p-4 space-y-4 animate-pulse"
              >
                <div className="aspect-4/3 bg-neutral-200 dark:bg-neutral-800 rounded-lg" />
                <div className="h-4 bg-neutral-200 dark:bg-neutral-800 rounded w-3/4" />
                <div className="h-3 bg-neutral-200 dark:bg-neutral-800 rounded w-1/2" />
                <div className="h-8 bg-neutral-200 dark:bg-neutral-800 rounded mt-4" />
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="p-8 text-center bg-rose-50 dark:bg-rose-950/40 rounded-xl border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300 space-y-3">
            <p className="font-semibold text-sm">{error}</p>
            <button
              onClick={resetFilters}
              className="px-4 py-2 bg-rose-600 text-white rounded-lg text-xs font-semibold"
            >
              Reintentar
            </button>
          </div>
        ) : products.length === 0 ? (
          <div className="p-12 text-center bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 space-y-3">
            <Tag className="w-10 h-10 text-neutral-300 dark:text-neutral-700 mx-auto" />
            <h3 className="font-semibold text-neutral-800 dark:text-neutral-200">
              No se encontraron productos con estos criterios
            </h3>
            <p className="text-xs text-neutral-500">
              Prueba cambiando la búsqueda o restableciendo los filtros.
            </p>
            <button
              onClick={resetFilters}
              className="px-4 py-2 bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 rounded-lg text-xs font-semibold"
            >
              Limpiar filtros
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={(p) => addItem(p, 1)}
                onSelect={(p) => setSelectedProduct(p)}
              />
            ))}
          </div>
        )}
      </section>

      {/* Product Detail Modal */}
      <ProductDetailModal
        product={selectedProduct}
        isOpen={!!selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onAddToCart={(p, qty) => addItem(p, qty)}
      />
    </div>
  );
};
