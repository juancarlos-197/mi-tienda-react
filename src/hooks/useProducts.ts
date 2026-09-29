import { useCallback, useEffect, useState } from 'react';
import { useNotification } from '../context/NotificationContext';
import { CreateProductDTO, Product, ProductFilterOptions, UpdateProductDTO } from '../models/product.model';
import { productService } from '../services/productService';

export function useProducts(initialFilters?: ProductFilterOptions) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<ProductFilterOptions | undefined>(initialFilters);
  const { success, error: toastError } = useNotification();

  const fetchProducts = useCallback(async (currentFilters?: ProductFilterOptions) => {
    setLoading(true);
    setError(null);
    try {
      const data = await productService.getProducts(currentFilters);
      setProducts(data);
    } catch (err: any) {
      const msg = err.message || 'Error al cargar el catálogo de productos';
      setError(msg);
      toastError(msg);
    } finally {
      setLoading(false);
    }
  }, [toastError]);

  useEffect(() => {
    fetchProducts(filters);
  }, [fetchProducts, filters]);

  const updateFilters = (newFilters: Partial<ProductFilterOptions>) => {
    setFilters((prev) => ({ ...(prev || {}), ...newFilters }));
  };

  const resetFilters = () => {
    setFilters({});
  };

  // Acciones CRUD integradas
  const createProduct = async (dto: CreateProductDTO): Promise<Product> => {
    try {
      const created = await productService.createProduct(dto);
      setProducts((prev) => [created, ...prev]);
      success(`Producto "${created.name}" creado con éxito`);
      return created;
    } catch (err: any) {
      const msg = err.message || 'Error al crear producto';
      toastError(msg);
      throw err;
    }
  };

  const updateProduct = async (id: string, dto: UpdateProductDTO): Promise<Product> => {
    try {
      const updated = await productService.updateProduct(id, dto);
      setProducts((prev) => prev.map((p) => (p.id === id ? updated : p)));
      success(`Producto "${updated.name}" actualizado`);
      return updated;
    } catch (err: any) {
      const msg = err.message || 'Error al actualizar producto';
      toastError(msg);
      throw err;
    }
  };

  const deleteProduct = async (id: string): Promise<void> => {
    try {
      await productService.deleteProduct(id);
      setProducts((prev) => prev.filter((p) => p.id !== id));
      success('Producto eliminado correctamente');
    } catch (err: any) {
      const msg = err.message || 'Error al eliminar producto';
      toastError(msg);
      throw err;
    }
  };

  const resetDatabase = async () => {
    try {
      await productService.resetDatabase();
      await fetchProducts(filters);
      success('Base de datos restablecida a los valores iniciales');
    } catch (err: any) {
      toastError(err.message || 'Error al restablecer datos');
    }
  };

  return {
    products,
    loading,
    error,
    filters,
    setFilters,
    updateFilters,
    resetFilters,
    refetch: () => fetchProducts(filters),
    createProduct,
    updateProduct,
    deleteProduct,
    resetDatabase,
  };
}
