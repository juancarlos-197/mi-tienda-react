export type ProductCategory = 
  | 'Portátiles'
  | 'Periféricos'
  | 'Monitores'
  | 'Audio'
  | 'Componentes'
  | 'Accesorios';

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  category: ProductCategory;
  imageUrl: string;
  featured?: boolean;
  rating: number;
  reviewsCount: number;
  specs?: Record<string, string>;
  createdAt: string;
}

export interface CreateProductDTO {
  name: string;
  description: string;
  price: number;
  stock: number;
  category: ProductCategory;
  imageUrl: string;
  featured?: boolean;
  specs?: Record<string, string>;
}

export type UpdateProductDTO = Partial<CreateProductDTO>;

export interface ProductFilterOptions {
  search?: string;
  category?: ProductCategory | 'all';
  minPrice?: number;
  maxPrice?: number;
  inStockOnly?: boolean;
  sortBy?: 'price-asc' | 'price-desc' | 'name-asc' | 'rating-desc';
}
