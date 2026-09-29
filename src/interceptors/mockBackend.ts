import { INITIAL_PRODUCTS } from '../data/initialProducts';
import { INITIAL_USERS } from '../data/initialUsers';
import { HttpMethod } from '../models/api.model';
import { CreateProductDTO, Product } from '../models/product.model';
import { User } from '../models/user.model';
import { storage } from '../utils/storage';

const PRODUCTS_STORAGE_KEY = 'mitienda_db_products';
const USERS_STORAGE_KEY = 'mitienda_db_users';

function getStoredProducts(): Product[] {
  return storage.get<Product[]>(PRODUCTS_STORAGE_KEY, INITIAL_PRODUCTS);
}

function saveStoredProducts(products: Product[]): void {
  storage.set(PRODUCTS_STORAGE_KEY, products);
}

function getStoredUsers(): User[] {
  return storage.get<User[]>(USERS_STORAGE_KEY, INITIAL_USERS);
}

function saveStoredUsers(users: User[]): void {
  storage.set(USERS_STORAGE_KEY, users);
}

// Handler de simulación de backend Express REST API
export async function mockBackendHandler(
  method: HttpMethod,
  endpoint: string,
  body: any,
  headers: Record<string, string>,
  params?: Record<string, any>
): Promise<{ status: number; data: any }> {
  const url = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;

  // Verificar Authorization Header
  const authHeader = headers['Authorization'] || headers['authorization'];
  let currentUser: User | null = null;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.replace('Bearer ', '').trim();
    const users = getStoredUsers();
    // Simulación de decodificación de JWT token simple
    if (token.includes('admin')) {
      currentUser = users.find((u) => u.role === 'admin') || users[0];
    } else if (token.includes('client')) {
      currentUser = users.find((u) => u.role === 'client') || users[1];
    } else {
      currentUser = users[0];
    }
  }

  // --- RUTAS DE AUTENTICACIÓN ---
  if (url === '/auth/login' && method === 'POST') {
    const { email, password } = body || {};
    if (!email || !password) {
      const err: any = new Error('Email y contraseña requeridos');
      err.status = 400;
      throw err;
    }

    const users = getStoredUsers();
    const foundUser = users.find((u) => u.email.toLowerCase() === email.toLowerCase());

    if (!foundUser) {
      const err: any = new Error('Credenciales incorrectas. Verifica tu correo y contraseña.');
      err.status = 401;
      throw err;
    }

    // Generar un token JWT simulado
    const token = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.${btoa(
      JSON.stringify({ id: foundUser.id, role: foundUser.role, email: foundUser.email, iat: Date.now() })
    )}.simulated_signature_${foundUser.role}`;

    return {
      status: 200,
      data: {
        user: foundUser,
        token,
        expiresIn: 3600,
      },
    };
  }

  if (url === '/auth/register' && method === 'POST') {
    const { name, email, role } = body || {};
    if (!name || !email) {
      const err: any = new Error('Nombre y correo son requeridos');
      err.status = 400;
      throw err;
    }

    const users = getStoredUsers();
    const existing = users.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (existing) {
      const err: any = new Error('Ya existe una cuenta registrada con este correo electrónico');
      err.status = 400;
      throw err;
    }

    const newUser: User = {
      id: `user-${Date.now()}`,
      name,
      email,
      role: role || 'client',
      createdAt: new Date().toISOString(),
      avatarUrl: `https://images.unsplash.com/photo-${1534528741775 + Math.floor(Math.random() * 1000)}?auto=format&fit=crop&w=250&q=80`,
    };

    users.push(newUser);
    saveStoredUsers(users);

    const token = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.${btoa(
      JSON.stringify({ id: newUser.id, role: newUser.role, email: newUser.email, iat: Date.now() })
    )}.simulated_signature_${newUser.role}`;

    return {
      status: 201,
      data: {
        user: newUser,
        token,
        expiresIn: 3600,
      },
    };
  }

  if (url === '/auth/me' && method === 'GET') {
    if (!currentUser) {
      const err: any = new Error('No autenticado');
      err.status = 401;
      throw err;
    }
    return { status: 200, data: currentUser };
  }

  // --- RUTAS DE USUARIOS ---
  if (url === '/users' && method === 'GET') {
    if (!currentUser || currentUser.role !== 'admin') {
      const err: any = new Error('Acceso no autorizado: Solo administradores pueden ver usuarios.');
      err.status = 403;
      throw err;
    }
    return { status: 200, data: getStoredUsers() };
  }

  // --- RUTAS DE PRODUCTOS ---
  // GET /products
  if (url === '/products' && method === 'GET') {
    let products = getStoredProducts();

    // Filtros por query params
    if (params) {
      if (params.search) {
        const query = String(params.search).toLowerCase();
        products = products.filter(
          (p) =>
            p.name.toLowerCase().includes(query) ||
            p.description.toLowerCase().includes(query) ||
            p.category.toLowerCase().includes(query)
        );
      }
      if (params.category && params.category !== 'all') {
        products = products.filter((p) => p.category === params.category);
      }
      if (params.minPrice !== undefined && params.minPrice !== '') {
        products = products.filter((p) => p.price >= Number(params.minPrice));
      }
      if (params.maxPrice !== undefined && params.maxPrice !== '') {
        products = products.filter((p) => p.price <= Number(params.maxPrice));
      }
      if (params.inStockOnly === true || params.inStockOnly === 'true') {
        products = products.filter((p) => p.stock > 0);
      }
      if (params.sortBy) {
        switch (params.sortBy) {
          case 'price-asc':
            products.sort((a, b) => a.price - b.price);
            break;
          case 'price-desc':
            products.sort((a, b) => b.price - a.price);
            break;
          case 'name-asc':
            products.sort((a, b) => a.name.localeCompare(b.name));
            break;
          case 'rating-desc':
            products.sort((a, b) => b.rating - a.rating);
            break;
        }
      }
    }

    return { status: 200, data: products };
  }

  // GET /products/:id
  const matchProductById = url.match(/^\/products\/([^/?]+)$/);
  if (matchProductById && method === 'GET') {
    const id = matchProductById[1];
    const products = getStoredProducts();
    const product = products.find((p) => p.id === id);
    if (!product) {
      const err: any = new Error(`Producto con ID ${id} no encontrado`);
      err.status = 404;
      throw err;
    }
    return { status: 200, data: product };
  }

  // POST /products (Crear producto)
  if (url === '/products' && method === 'POST') {
    // Validar autorización de administrador
    if (!currentUser || currentUser.role !== 'admin') {
      const err: any = new Error('Solo los administradores pueden crear productos');
      err.status = 403;
      throw err;
    }

    const payload: CreateProductDTO = body;
    if (!payload.name || payload.price === undefined || payload.stock === undefined) {
      const err: any = new Error('Nombre, precio y stock son obligatorios');
      err.status = 400;
      throw err;
    }

    const newProduct: Product = {
      id: `prod-${Date.now()}`,
      name: payload.name,
      description: payload.description || '',
      price: Number(payload.price),
      stock: Number(payload.stock),
      category: payload.category || 'Accesorios',
      imageUrl: payload.imageUrl || 'https://images.unsplash.com/photo-1526738549149-8e07eca6c147?auto=format&fit=crop&w=1000&q=80',
      featured: Boolean(payload.featured),
      rating: 5.0,
      reviewsCount: 1,
      specs: payload.specs || {},
      createdAt: new Date().toISOString(),
    };

    const products = getStoredProducts();
    products.unshift(newProduct);
    saveStoredProducts(products);

    return { status: 201, data: newProduct };
  }

  // PUT /products/:id (Actualizar producto)
  if (matchProductById && method === 'PUT') {
    if (!currentUser || currentUser.role !== 'admin') {
      const err: any = new Error('Solo los administradores pueden modificar productos');
      err.status = 403;
      throw err;
    }

    const id = matchProductById[1];
    const products = getStoredProducts();
    const index = products.findIndex((p) => p.id === id);

    if (index === -1) {
      const err: any = new Error(`Producto con ID ${id} no encontrado`);
      err.status = 404;
      throw err;
    }

    const updatedProduct: Product = {
      ...products[index],
      ...body,
      id, // asegurar inmutabilidad del ID
      price: body.price !== undefined ? Number(body.price) : products[index].price,
      stock: body.stock !== undefined ? Number(body.stock) : products[index].stock,
    };

    products[index] = updatedProduct;
    saveStoredProducts(products);

    return { status: 200, data: updatedProduct };
  }

  // DELETE /products/:id (Eliminar producto)
  if (matchProductById && method === 'DELETE') {
    if (!currentUser || currentUser.role !== 'admin') {
      const err: any = new Error('Solo los administradores pueden eliminar productos');
      err.status = 403;
      throw err;
    }

    const id = matchProductById[1];
    const products = getStoredProducts();
    const index = products.findIndex((p) => p.id === id);

    if (index === -1) {
      const err: any = new Error(`Producto con ID ${id} no encontrado`);
      err.status = 404;
      throw err;
    }

    const removed = products.splice(index, 1)[0];
    saveStoredProducts(products);

    return { status: 200, data: { success: true, removedId: id, item: removed } };
  }

  // POST /orders (Checkout / Realizar compra)
  if (url === '/orders' && method === 'POST') {
    const { items, customer, payment } = body || {};
    if (!items || !items.length) {
      const err: any = new Error('El carrito no contiene artículos');
      err.status = 400;
      throw err;
    }

    // Descontar inventario de la base de datos
    const products = getStoredProducts();
    items.forEach((item: any) => {
      const p = products.find((prod) => prod.id === item.product.id);
      if (p) {
        p.stock = Math.max(0, p.stock - item.quantity);
      }
    });
    saveStoredProducts(products);

    const order = {
      id: `ord-${Date.now().toString(36).toUpperCase()}`,
      createdAt: new Date().toISOString(),
      items,
      customer,
      paymentMethod: payment?.method || 'Tarjeta de Crédito',
      status: 'completado',
      total: items.reduce((acc: number, item: any) => acc + item.product.price * item.quantity, 0),
    };

    return { status: 201, data: order };
  }

  // Reset database endpoint para el laboratorio
  if (url === '/admin/reset-database' && method === 'POST') {
    saveStoredProducts(INITIAL_PRODUCTS);
    saveStoredUsers(INITIAL_USERS);
    return { status: 200, data: { message: 'Base de datos restaurada a valores iniciales con éxito' } };
  }

  const notFoundErr: any = new Error(`Ruta ${method} ${url} no encontrada`);
  notFoundErr.status = 404;
  throw notFoundErr;
}
