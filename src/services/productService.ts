import { http } from '../interceptors/httpInterceptor';
import { CreateProductDTO, Product, ProductCategory, ProductFilterOptions, UpdateProductDTO } from '../models/product.model';

export const productService = {
  // Obtener catálogo con soporte de filtros y orden
  async getProducts(filters?: ProductFilterOptions): Promise<Product[]> {
    const params: Record<string, any> = {};
    if (filters) {
      if (filters.search) params.search = filters.search;
      if (filters.category && filters.category !== 'all') params.category = filters.category;
      if (filters.minPrice !== undefined) params.minPrice = filters.minPrice;
      if (filters.maxPrice !== undefined) params.maxPrice = filters.maxPrice;
      if (filters.inStockOnly !== undefined) params.inStockOnly = filters.inStockOnly;
      if (filters.sortBy) params.sortBy = filters.sortBy;
    }

    const data = await http.get<Product[]>('/products', { params });
    return data;
  },

  // Obtener detalle de un producto por ID
  async getProductById(id: string): Promise<Product> {
    const data = await http.get<Product>(`/products/${id}`);
    return data;
  },

  // Crear un nuevo producto (Requiere rol admin)
  async createProduct(dto: CreateProductDTO): Promise<Product> {
    const data = await http.post<Product>('/products', dto);
    return data;
  },

  // Actualizar un producto existente (Requiere rol admin)
  async updateProduct(id: string, dto: UpdateProductDTO): Promise<Product> {
    const data = await http.put<Product>(`/products/${id}`, dto);
    return data;
  },

  // Eliminar un producto (Requiere rol admin)
  async deleteProduct(id: string): Promise<{ success: boolean; removedId: string }> {
    const data = await http.delete<{ success: boolean; removedId: string }>(`/products/${id}`);
    return data;
  },

  // Checkout / Realizar pedido
  async checkoutOrder(orderData: { items: any[]; customer: any; payment?: any }): Promise<any> {
    const data = await http.post<any>('/orders', orderData);
    return data;
  },

  // Categorías fijas
  getCategories(): ProductCategory[] {
    return [
      'Portátiles',
      'Periféricos',
      'Monitores',
      'Audio',
      'Componentes',
      'Accesorios',
    ];
  },

  // Restablecer catálogo inicial
  async resetDatabase(): Promise<{ message: string }> {
    const data = await http.post<{ message: string }>('/admin/reset-database');
    return data;
  },
};
