export interface ModuleTopic {
  title: string;
  description: string;
  codeSnippet?: string;
  explanation?: string;
  practicalTip?: string;
}

export interface CourseModule {
  id: number;
  slug: string;
  title: string;
  badge: string;
  shortDesc: string;
  summary: string;
  objectives: string[];
  topics: ModuleTopic[];
  filesInApp: string[];
  interactiveDemoId?: 'state-playground' | 'hooks-playground' | 'interceptor-demo' | 'env-demo' | 'crud-demo' | 'form-demo';
}

export const COURSE_MODULES: CourseModule[] = [
  {
    id: 1,
    slug: 'fundamentos-react',
    title: 'Módulo 1: Proyecto y Fundamentos de React',
    badge: 'Fundamentos',
    shortDesc: '¿Qué es React?, Vite, JSX, Componentes, Props, State y Renderizado Condicional.',
    summary: 'Aprende los pilares fundamentales que sustentan React: el Virtual DOM, la sintaxis declarativa JSX, el flujo unidireccional de datos y cómo Vite optimiza el desarrollo moderno con ES Modules ultrarrápidos.',
    objectives: [
      'Entender el modelo mental de React y cómo difiere del DOM imperativo de JavaScript tradicional.',
      'Comprender la anatomía de un proyecto Vite + React y la compilación con JSX/TSX.',
      'Aprender a declarar componentes funcionales, pasar Props y manejar Estado con useState.',
      'Dominar el renderizado condicional (&&, ternarios) y la iteración de colecciones con Array.map() y keys.',
    ],
    filesInApp: ['/src/main.tsx', '/src/App.tsx', '/index.html'],
    interactiveDemoId: 'state-playground',
    topics: [
      {
        title: '¿Qué es React y por qué Vite?',
        description: 'Biblioteca para interfaces declarativas basada en componentes y un Virtual DOM reactivo.',
        explanation: 'En lugar de manipular elementos del DOM con document.getElementById o innerHTML, en React describes cómo debe lucir la UI para un estado dado. Vite reemplaza a los antiguos empaquetadores lentos (como Webpack/Create React App) aprovechando los Native ES Modules del navegador para recargas casi instantáneas en desarrollo.',
        codeSnippet: `// main.tsx: Punto de entrada de la aplicación
import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css';

const root = createRoot(document.getElementById('root')!);
root.render(<App />);`,
        practicalTip: 'En Vite las variables de entorno para el cliente deben tener el prefijo VITE_ (por ejemplo VITE_API_URL).',
      },
      {
        title: 'JSX y Componentes Funcionales',
        description: 'Sintaxis que combina HTML con el poder expresivo de JavaScript.',
        explanation: 'JSX no es HTML dentro de JS; es azúcar sintáctico que el compilador transforma en llamadas a funciones de React. Toda etiqueta debe cerrarse, y las expresiones JavaScript se evalúan dentro de llaves {}.',
        codeSnippet: `function Greeting({ name, role }: { name: string; role: string }) {
  return (
    <div className="p-4 bg-white rounded-lg shadow">
      <h2 className="text-xl font-bold">¡Bienvenido, {name}!</h2>
      <p className="text-sm text-gray-500">Rol asignado: {role.toUpperCase()}</p>
    </div>
  );
}`,
      },
      {
        title: 'Renderizado Condicional y Listas con map()',
        description: 'Mostrar elementos según condiciones lógicas y mapear arreglos a componentes.',
        explanation: 'Las listas requieren siempre un atributo key único y estable (como el id de la base de datos) para que React pueda reconciliar eficientemente qué ítems han cambiado, se han agregado o eliminado.',
        codeSnippet: `{/* Renderizado condicional con ternario */}
{inStock ? (
  <span className="text-emerald-600 font-semibold">En existencias ({stock} uds.)</span>
) : (
  <span className="text-rose-600 font-semibold">Agotado temporalmente</span>
)}

{/* Iteración de listas */}
<div className="grid grid-cols-3 gap-4">
  {products.map((product) => (
    <ProductCard key={product.id} product={product} />
  ))}
</div>`,
        practicalTip: 'Nunca uses el índice del array (index) como key si los elementos pueden reordenarse, filtrarse o eliminarse, pues causará bugs visuales.',
      },
    ],
  },
  {
    id: 2,
    slug: 'componentes-props',
    title: 'Módulo 2: Componentes y Props',
    badge: 'Arquitectura UI',
    shortDesc: 'Componentes reutilizables, Props, Children, contenedores y componentes de presentación.',
    summary: 'Diseña interfaces escalables separando la presentación visual de la lógica de negocio. Domina el patrón de composición con props.children y la comunicación entre componentes padre e hijo.',
    objectives: [
      'Construir componentes reutilizables fuertemente tipados con TypeScript.',
      'Manejar el prop especial children para crear contenedores y layouts flexibles.',
      'Establecer comunicación bidireccional limpia mediante callbacks (onSelect, onAddToCart).',
      'Distinguir entre componentes "tontos" (Presentational) y componentes "inteligentes" (Containers).',
    ],
    filesInApp: [
      '/src/components/products/ProductCard.tsx',
      '/src/components/common/Button.tsx',
      '/src/components/common/Modal.tsx',
    ],
    topics: [
      {
        title: 'Componente ProductCard Reutilizable',
        description: 'La tarjeta de producto con props fuertemente tipadas y callbacks.',
        explanation: 'En el curso analizamos este componente exacto. Recibe el objeto product, maneja visualmente el precio, el stock y delega la acción de compra mediante un prop onAddToCart.',
        codeSnippet: `interface ProductCardProps {
  product: Product;
  onAddToCart?: (product: Product) => void;
  children?: React.ReactNode;
}

export function ProductCard({ product, onAddToCart, children }: ProductCardProps) {
  return (
    <article className="border border-neutral-200 bg-white rounded-xl overflow-hidden flex flex-col">
      <img src={product.imageUrl} alt={product.name} className="h-48 w-full object-cover" />
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          <span className="text-xs uppercase tracking-wider text-neutral-500">{product.category}</span>
          <h3 className="font-semibold text-lg text-neutral-900 mt-1">{product.name}</h3>
        </div>
        <div className="mt-4 flex items-center justify-between">
          <span className="text-xl font-bold">\${product.price}</span>
          <button 
            onClick={() => onAddToCart?.(product)}
            className="px-4 py-2 bg-neutral-900 text-white rounded-lg text-sm"
          >
            Añadir
          </button>
        </div>
        {children}
      </div>
    </article>
  );
}`,
      },
      {
        title: 'Patrón Presentational vs Container',
        description: 'Separación entre quién obtiene los datos y quién los dibuja.',
        explanation: 'ProductListContainer se encarga de llamar a useProducts(), gestionar loading/error y ProductList se limita a renderizar los datos visualmente. Esto maximiza la reusabilidad y facilita las pruebas.',
        codeSnippet: `// Container Component: maneja datos y estado
function ProductsContainer() {
  const { products, loading, error } = useProducts();
  if (loading) return <Spinner />;
  if (error) return <ErrorMessage message={error} />;
  return <ProductGrid items={products} />;
}

// Presentational Component: puramente visual
function ProductGrid({ items }: { items: Product[] }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {items.map(p => <ProductCard key={p.id} product={p} />)}
    </div>
  );
}`,
      },
    ],
  },
  {
    id: 3,
    slug: 'hooks',
    title: 'Módulo 3: Hooks Nativos y Custom Hooks',
    badge: 'Hooks',
    shortDesc: 'useState, useEffect, useContext, useRef, useMemo, useCallback y creación de Custom Hooks.',
    summary: 'Los Hooks son la esencia reactiva de React moderno. Permiten usar estado y ciclo de vida en componentes funcionales, y extraer lógica reutilizable mediante Custom Hooks como useProducts(), useAuth(), useFetch() y useForm().',
    objectives: [
      'Dominar las reglas de los hooks (solo en el top-level de componentes de React o custom hooks).',
      'Comprender el array de dependencias de useEffect y las funciones de limpieza (cleanup).',
      'Optimizar renderizados costosos con useMemo y estabilizar referencias con useCallback.',
      'Aprender a abstraer lógica de negocio en Custom Hooks modulares.',
    ],
    filesInApp: [
      '/src/hooks/useProducts.ts',
      '/src/hooks/useAuth.ts',
      '/src/hooks/useFetch.ts',
      '/src/hooks/useForm.ts',
    ],
    interactiveDemoId: 'hooks-playground',
    topics: [
      {
        title: 'El ciclo de vida con useEffect',
        description: 'Sincronizar el componente con sistemas externos (APIs, timers, listeners).',
        explanation: 'useEffect se ejecuta después del render. Si el array de dependencias está vacío [], corre solo al montar. Si incluye variables, se re-ejecuta cuando cambien. Su función retornada es el cleanup para desuscribirse o limpiar timers.',
        codeSnippet: `useEffect(() => {
  let isMounted = true;

  const loadData = async () => {
    try {
      const data = await productService.getProducts();
      if (isMounted) setProducts(data);
    } catch (err) {
      if (isMounted) setError(err.message);
    }
  };

  loadData();

  return () => {
    // Función de limpieza
    isMounted = false;
  };
}, [/* dependencias */]);`,
      },
      {
        title: 'Custom Hook: useProducts()',
        description: 'Encapsula la carga de productos, filtros, estados de carga y operaciones CRUD.',
        explanation: 'En lugar de repetir llamadas a la API en cada página, creamos un hook reutilizable que devuelve { products, loading, error, createProduct, updateProduct, deleteProduct }.',
        codeSnippet: `export function useProducts(initialFilters?: ProductFilterOptions) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const data = await productService.getProducts(initialFilters);
      setProducts(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [initialFilters]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  return { products, loading, error, refetch: fetchProducts };
}`,
      },
    ],
  },
  {
    id: 4,
    slug: 'routing',
    title: 'Módulo 4: Enrutamiento y Rutas Protegidas',
    badge: 'Navegación',
    shortDesc: 'Estructura de URLs, parámetros dinámicos (:id), query strings y guardas de seguridad.',
    summary: 'Construye una aplicación SPA con navegación fluida. Implementa rutas públicas como el catálogo y login, rutas con parámetros dinámicos (/products/:id), y rutas protegidas (/dashboard, /admin/products) exclusivas para usuarios con rol administrador.',
    objectives: [
      'Diseñar la jerarquía de rutas de una tienda en línea real.',
      'Extraer parámetros de la URL para cargar detalles específicos de productos.',
      'Construir un componente ProtectedRoute que evalúe autenticación y roles.',
      'Sincronizar el estado de búsqueda y filtros con la URL.',
    ],
    filesInApp: [
      '/src/routes/AppRoutes.tsx',
      '/src/routes/ProtectedRoute.tsx',
    ],
    topics: [
      {
        title: 'Arquitectura de Rutas',
        description: 'Organización de URLs públicas, privadas y de administración.',
        explanation: 'La tienda implementa rutas como /products, /products/:id, /cart, /login, /register, y rutas con verificación de rol como /dashboard, /admin/products y /admin/users.',
        codeSnippet: `// Diagrama de decisión de acceso:
// Usuario accede a /dashboard
//    │
//    ├── ¿Está autenticado?
//    │      ├── NO ──► Redirige a /login (con returnUrl)
//    │      └── SÍ
//    │           ├── ¿Rol es 'admin'?
//    │           │      ├── SÍ ──► Muestra Dashboard
//    │           │      └── NO ──► Muestra Error 403 (Sin permisos)`,
      },
      {
        title: 'Implementación de ProtectedRoute',
        description: 'Componente de orden superior que intercepta la navegación no autorizada.',
        codeSnippet: `interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: 'admin' | 'client';
}

export function ProtectedRoute({ children, requiredRole }: ProtectedRouteProps) {
  const { user, isAuthenticated, loading } = useAuth();

  if (loading) return <LoadingScreen />;

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && user?.role !== requiredRole) {
    return <ForbiddenView />;
  }

  return <>{children}</>;
}`,
      },
    ],
  },
  {
    id: 5,
    slug: 'servicios-http',
    title: 'Módulo 5: Capa de Servicios y Separación de Lógica',
    badge: 'Arquitectura',
    shortDesc: 'productService, authService, userService: desacoplando componentes del transporte HTTP.',
    summary: 'Aprende por qué los componentes React nunca deben hacer llamadas fetch o axios directamente en su cuerpo. La capa de servicios aísla los endpoints, la transformación de datos y las cabeceras, permitiendo reutilización y tests unitarios sencillos.',
    objectives: [
      'Separar la UI de las llamadas a la API REST.',
      'Crear servicios modulares: productService, authService, userService.',
      'Manejar DTOs (Data Transfer Objects) y tipado estricto de peticiones y respuestas.',
      'Garantizar que la app pueda cambiar de backend (Mock, Express, Firebase o SQL) sin modificar los componentes.',
    ],
    filesInApp: [
      '/src/services/productService.ts',
      '/src/services/authService.ts',
      '/src/services/userService.ts',
    ],
    topics: [
      {
        title: 'El principio de Responsabilidad Única en Servicios',
        description: 'Tus componentes deben encargarse de cómo se ve la app, no de cómo se formula el HTTP.',
        explanation: 'Si mañana el endpoint /products cambia a /api/v2/catalog/items, solo cambias una línea en productService.ts. Si hicieras fetch en 15 componentes, tendrías que modificar 15 archivos.',
        codeSnippet: `// services/productService.ts
export const productService = {
  async getProducts(params?: ProductFilterOptions): Promise<Product[]> {
    return http.get('/products', { params });
  },

  async getProductById(id: string): Promise<Product> {
    return http.get(\`/products/\${id}\`);
  },

  async createProduct(dto: CreateProductDTO): Promise<Product> {
    return http.post('/products', dto);
  },

  async updateProduct(id: string, dto: UpdateProductDTO): Promise<Product> {
    return http.put(\`/products/\${id}\`, dto);
  },

  async deleteProduct(id: string): Promise<void> {
    return http.delete(\`/products/\${id}\`);
  },
};`,
      },
    ],
  },
  {
    id: 6,
    slug: 'environments',
    title: 'Módulo 6: Variables de Entorno y Configuración',
    badge: 'DevOps & Config',
    shortDesc: '.env.development, .env.production y la resolución dinámica con import.meta.env.',
    summary: 'Configura diferentes ambientes de ejecución sin cambiar el código fuente. Aprende cómo Vite resuelve VITE_API_URL en modo desarrollo local vs producción en la nube.',
    objectives: [
      'Entender los archivos .env, .env.development y .env.production.',
      'Aprender la sintaxis import.meta.env en Vite vs process.env en Node/Webpack.',
      'Construir un singleton de configuración tipado con valores predeterminados y fallbacks.',
      'Asegurar secretos: qué variables pueden ir al cliente y cuáles jamás deben exponerse.',
    ],
    filesInApp: [
      '/.env',
      '/.env.development',
      '/.env.production',
      '/src/environments/environment.ts',
    ],
    interactiveDemoId: 'env-demo',
    topics: [
      {
        title: 'Archivos .env en Vite',
        description: 'Prefijo VITE_ obligatorio para que las variables sean accesibles en el navegador.',
        explanation: 'Por seguridad, Vite solo empaqueta en el bundle cliente las variables que comiencen por VITE_. Cualquier otra variable como DB_PASSWORD o SECRET_KEY no será expuesta en el JavaScript descargado por el usuario.',
        codeSnippet: `# .env.development
VITE_API_URL=http://localhost:3000/api
VITE_ENV_NAME=development

# .env.production
VITE_API_URL=https://api.mitienda-react.com/api
VITE_ENV_NAME=production`,
      },
      {
        title: 'Acceso Tipado en TypeScript',
        description: 'Encapsulamos import.meta.env en un objeto environment.ts para autocompletado.',
        codeSnippet: `export const environment = {
  apiUrl: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
  isProduction: import.meta.env.PROD,
  appName: import.meta.env.VITE_APP_NAME || 'Mi Tienda',
};`,
      },
    ],
  },
  {
    id: 7,
    slug: 'interceptors',
    title: 'Módulo 7: Interceptores HTTP y Token Bearer',
    badge: 'Seguridad HTTP',
    shortDesc: 'Inyección automática de Authorization: Bearer TOKEN y captura centralizada de 401, 403, 500.',
    summary: 'Un interceptor es un middleware que se ejecuta antes de enviar una petición o después de recibir una respuesta. Aquí inyectamos el token de seguridad automáticamente en las cabeceras y manejamos errores globales como tokens expirados o accesos denegados.',
    objectives: [
      'Implementar un cliente HTTP centralizado con interceptores de Request y Response.',
      'Inyectar cabeceras Authorization: Bearer <TOKEN> de manera transparente.',
      'Capturar respuestas HTTP 401 para cerrar sesión automáticamente.',
      'Capturar respuestas 403 (Forbidden) y 500 (Internal Server Error) para emitir notificaciones visuales.',
    ],
    filesInApp: [
      '/src/interceptors/httpInterceptor.ts',
      '/src/interceptors/mockBackend.ts',
    ],
    interactiveDemoId: 'interceptor-demo',
    topics: [
      {
        title: 'Interceptor de Petición (Request Interceptor)',
        description: 'Añade metadatos, contentType y el JWT token a cada request saliente.',
        explanation: 'En lugar de que cada servicio tenga que leer el token del localStorage y pasarlo a mano, el interceptor lo inyecta automáticamente si existe.',
        codeSnippet: `// Antes de enviar la petición:
const token = localStorage.getItem('auth_token');
if (token) {
  config.headers['Authorization'] = \`Bearer \${token}\`;
}
return config;`,
      },
      {
        title: 'Interceptor de Respuesta (Response Interceptor)',
        description: 'Manejo global de códigos de estado HTTP.',
        codeSnippet: `// Al recibir la respuesta:
switch (status) {
  case 401: // Token expirado
    authService.logout();
    toast.error('Sesión expirada. Inicia sesión de nuevo.');
    window.location.href = '/login';
    break;
  case 403: // Sin permisos
    toast.error('No tienes permisos para esta acción.');
    break;
  case 500: // Error servidor
    toast.error('Error interno del servidor. Inténtalo más tarde.');
    break;
}`,
      },
    ],
  },
  {
    id: 8,
    slug: 'autenticacion',
    title: 'Módulo 8: Autenticación, JWT y Sesión',
    badge: 'Seguridad',
    shortDesc: 'Login, logout, registro, almacenamiento seguro de token y sincronización de estado de usuario.',
    summary: 'Construye un sistema completo de autenticación de usuarios. Maneja estados de carga, persistencia en localStorage para no perder la sesión al recargar la página, y control de acceso basado en roles (Admin vs Cliente).',
    objectives: [
      'Crear formularios de login y registro con validación en tiempo real.',
      'Guardar y recuperar el token JWT de forma segura.',
      'Implementar el hook useAuth() y AuthContext.',
      'Diferenciar las capacidades del panel de administración vs la tienda para clientes.',
    ],
    filesInApp: [
      '/src/context/AuthContext.tsx',
      '/src/services/authService.ts',
      '/src/pages/LoginPage.tsx',
      '/src/pages/RegisterPage.tsx',
    ],
    topics: [
      {
        title: 'Flujo de Autenticación con Token',
        description: 'El cliente envía credenciales, el servidor devuelve un token JWT y los datos del perfil.',
        explanation: 'El token recibido se almacena para persistir la sesión. En cada recarga de página, un useEffect en AuthProvider lee el token y verifica su validez contra el endpoint /auth/me.',
        codeSnippet: `const { user, login, logout, isAdmin } = useAuth();

const handleLogin = async (credentials) => {
  try {
    await login(credentials);
    navigate(isAdmin ? '/dashboard' : '/products');
  } catch (error) {
    setError('Credenciales inválidas');
  }
};`,
      },
    ],
  },
  {
    id: 9,
    slug: 'context-api',
    title: 'Módulo 9: Context API y Estado Compartido',
    badge: 'Estado Global',
    shortDesc: 'AuthContext, ThemeContext, CartContext y NotificationContext sin caer en "prop drilling".',
    summary: 'Evita pasar props a través de 5 niveles de componentes anidados. Context API permite compartir estado verdaderamente global como el carrito de compras, el tema oscuro/claro y las notificaciones toast con cualquier componente que lo necesite.',
    objectives: [
      'Comprender el problema de "prop drilling" y cuándo usar Context API.',
      'Crear proveedores (Providers) limpios con Custom Hooks exportados (useCart, useTheme).',
      'Optimizar el estado del carrito de compras con persistencia automática.',
      'Separar contextos por dominio de negocio para evitar renders innecesarios.',
    ],
    filesInApp: [
      '/src/context/CartContext.tsx',
      '/src/context/ThemeContext.tsx',
      '/src/context/NotificationContext.tsx',
      '/src/context/AuthContext.tsx',
    ],
    topics: [
      {
        title: 'Diseño del CartContext',
        description: 'El carrito de compras disponible en cualquier punto de la aplicación.',
        codeSnippet: `export function CartProvider({ children }) {
  const [items, setItems] = useState(() => storage.get('cart', []));

  const addItem = (product) => {
    setItems(prev => {
      const exists = prev.find(i => i.product.id === product.id);
      if (exists) {
        return prev.map(i => i.product.id === product.id ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, { product, quantity: 1 }];
    });
  };

  const total = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  return (
    <CartContext.Provider value={{ items, addItem, total }}>
      {children}
    </CartContext.Provider>
  );
}`,
      },
    ],
  },
  {
    id: 10,
    slug: 'crud-productos',
    title: 'Módulo 10: CRUD Completo de Productos',
    badge: 'Operaciones CRUD',
    shortDesc: 'Crear, Leer, Actualizar y Eliminar productos con filtros, búsqueda y control de stock.',
    summary: 'El núcleo de cualquier aplicación empresarial. Implementa una tabla administrativa completa con creación de nuevos productos, edición modal, borrado con confirmación, búsqueda en tiempo real y filtrado por categoría y rango de precio.',
    objectives: [
      'Implementar las 4 operaciones CRUD con métodos HTTP POST, GET, PUT y DELETE.',
      'Optimizar búsquedas con debounce para no saturar al servidor.',
      'Validar restricciones de negocio: stock no negativo, precios válidos.',
      'Actualizar la lista reactivamente en la UI tras cada operación exitosa.',
    ],
    filesInApp: [
      '/src/pages/AdminProductsPage.tsx',
      '/src/components/admin/ProductModalForm.tsx',
      '/src/hooks/useProducts.ts',
    ],
    interactiveDemoId: 'crud-demo',
    topics: [
      {
        title: 'Tabla Administrativa con Acciones',
        description: 'Listado interactivo con botones de edición rápida, borrado seguro y alta de productos.',
        codeSnippet: `// Operaciones CRUD en acción
const handleCreate = async (formData) => {
  await createProduct(formData);
  closeModal();
};

const handleUpdate = async (id, formData) => {
  await updateProduct(id, formData);
  closeModal();
};

const handleDelete = async (id) => {
  if (window.confirm('¿Seguro que deseas eliminar este producto?')) {
    await deleteProduct(id);
  }
};`,
      },
    ],
  },
  {
    id: 11,
    slug: 'formularios-validaciones',
    title: 'Módulo 11: Formularios y Validaciones',
    badge: 'Formularios',
    shortDesc: 'Formularios controlados, validación de esquemas, mensajes de error y hook useForm().',
    summary: 'Aprende a capturar entradas de usuario con precisión. Explora la diferencia entre componentes controlados vs no controlados, validación en evento Blur vs Submit, y construcción de un hook reutilizable useForm con reglas tipadas.',
    objectives: [
      'Entender los inputs controlados (value y onChange vinculados a estado).',
      'Construir un motor de validación flexible (required, email, minLength, minPrice).',
      'Mostrar mensajes de error accesibles solo cuando el campo ha sido "tocado" (touched).',
      'Deshabilitar el envío mientras la petición esté en curso (isSubmitting).',
    ],
    filesInApp: [
      '/src/hooks/useForm.ts',
      '/src/utils/validators.ts',
      '/src/components/admin/ProductModalForm.tsx',
    ],
    interactiveDemoId: 'form-demo',
    topics: [
      {
        title: 'Hook Reutilizable useForm()',
        description: 'Maneja valores, errores, estados de foco y validación automática de esquemas.',
        codeSnippet: `const { values, errors, touched, handleChange, handleBlur, handleSubmit } = useForm(
  { name: '', price: 0, stock: 10 },
  {
    name: [validators.required(), validators.minLength(3)],
    price: [validators.required(), validators.minNumber(1)],
    stock: [validators.required(), validators.positiveInteger()],
  },
  async (values) => {
    await productService.createProduct(values);
  }
);`,
      },
    ],
  },
  {
    id: 12,
    slug: 'estado-global-redux',
    title: 'Módulo 12: Estado Global con Redux Toolkit',
    badge: 'Estado Avanzado',
    shortDesc: 'Arquitectura Redux: Store, Slices, Reducers, Actions, Dispatch y comparación con Context API.',
    summary: 'Para aplicaciones de escala empresarial, Redux Toolkit proporciona un flujo unidireccional predecible con soporte para Redux DevTools, serialización estricta y lógica asíncrona mediante Thunks.',
    objectives: [
      'Comprender cuándo la complejidad de una app justifica Redux frente a Context API.',
      'Aprender la anatomía de un Slice con createSlice y reducers inmutables (Immer.js).',
      'Comparar el modelo mental: useDispatch() y useSelector().',
      'Explorar las mejores prácticas de arquitectura para estado global.',
    ],
    filesInApp: [
      '/src/context/CartContext.tsx',
      '/src/data/courseCurriculum.ts',
    ],
    topics: [
      {
        title: '¿Cuándo usar Redux Toolkit vs Context API?',
        description: 'Criterios objetivos para elegir la herramienta correcta de gestión de estado.',
        explanation: 'Usa Context API para datos que cambian con baja frecuencia (Tema, Usuario autenticado, Idioma). Usa Redux Toolkit cuando tienes flujos de datos muy dinámicos, actualizaciones frecuentes de alto rendimiento, o cuando necesitas "viajar en el tiempo" con Redux DevTools.',
        codeSnippet: `// Comparativa Conceptual:
// Context API:
const { items, addItem } = useCart();
addItem(product);

// Redux Toolkit:
const items = useSelector((state) => state.cart.items);
const dispatch = useDispatch();
dispatch(cartSlice.actions.addItem(product));`,
      },
    ],
  },
  {
    id: 13,
    slug: 'testing',
    title: 'Módulo 13: Estrategias de Testing en React',
    badge: 'Calidad de Software',
    shortDesc: 'Pruebas unitarias de componentes, hooks y mocks de servicios HTTP con Vitest.',
    summary: 'Asegura la estabilidad de tu tienda web escribiendo pruebas confiables. Aprende a probar componentes según el comportamiento del usuario con React Testing Library y a simular peticiones del cliente HTTP.',
    objectives: [
      'Conocer la pirámide de pruebas: Unitarias, Integración y End-to-End (E2E).',
      'Probar renderizado y eventos de usuario en ProductCard y botones.',
      'Hacer mocks de la capa de servicios productService sin tocar redes reales.',
      'Asegurar que los formularios rechacen datos incorrectos.',
    ],
    filesInApp: ['/src/data/courseCurriculum.ts'],
    topics: [
      {
        title: 'Filosofía de React Testing Library',
        description: '"Cuanto más se parezcan tus pruebas a cómo usan el software tus usuarios, mayor confianza tendrás."',
        codeSnippet: `// Ejemplo de test conceptual para ProductCard
test('renderiza el producto y llama a onAddToCart al hacer clic', async () => {
  const handleAddToCart = vi.fn();
  render(<ProductCard product={mockProduct} onAddToCart={handleAddToCart} />);

  expect(screen.getByText('MacBook Pro 16"')).toBeInTheDocument();
  
  const button = screen.getByRole('button', { name: /añadir/i });
  await userEvent.click(button);

  expect(handleAddToCart).toHaveBeenCalledWith(mockProduct);
});`,
      },
    ],
  },
  {
    id: 14,
    slug: 'optimizacion',
    title: 'Módulo 14: Optimización de Rendimiento',
    badge: 'Performance',
    shortDesc: 'React.memo, useMemo, useCallback, Lazy Loading con React.lazy y virtualización.',
    summary: 'Evita cuellos de botella en catálogos de miles de productos. Domina las técnicas de memoización para no re-renderizar componentes hijos innecesariamente y divide el bundle con Code Splitting dinámico.',
    objectives: [
      'Identificar renders innecesarios con React DevTools Profiler.',
      'Aprender cuándo usar y cuándo NO usar useMemo y useCallback.',
      'Implementar Code Splitting con React.lazy() y <Suspense />.',
      'Optimizar imágenes con srcset y formatos WebP/AVIF modernos.',
    ],
    filesInApp: [
      '/src/hooks/useDebounce.ts',
      '/src/components/products/ProductCard.tsx',
    ],
    topics: [
      {
        title: 'Estabilizar Funciones con useCallback',
        description: 'Evita que los componentes hijos optimizados con React.memo se vuelvan a renderizar por cambios de referencia.',
        codeSnippet: `// Sin useCallback, cada render crea una nueva referencia de función en memoria:
const handleSelect = (id) => setSelectedId(id);

// Con useCallback, la referencia se mantiene idéntica entre renders:
const handleSelect = useCallback((id) => {
  setSelectedId(id);
}, []);`,
      },
    ],
  },
  {
    id: 15,
    slug: 'build-produccion',
    title: 'Módulo 15: Compilación y Despliegue en Producción',
    badge: 'Producción',
    shortDesc: 'npm run build, Tree-shaking, Minificación, Servidores Express/Nginx y Cloud Run.',
    summary: 'Lleva tu aplicación a millones de usuarios. Aprende cómo Vite transforma el código TypeScript en un bundle altamente comprimido, cómo configurar el servidor backend en Express y cómo servir los estáticos con caché óptima.',
    objectives: [
      'Ejecutar npm run build y analizar el tamaño de los bundles generados en /dist.',
      'Configurar un servidor Express para servir la SPA y las rutas de API REST en el mismo puerto.',
      'Manejar el fallback del router SPA (reescritura de cualquier ruta a index.html).',
      'Desplegar en plataformas modernas como Google Cloud Run, Vercel o Netlify.',
    ],
    filesInApp: [
      '/vite.config.ts',
      '/package.json',
      '/.env.production',
    ],
    topics: [
      {
        title: 'Servidor Full-Stack Express + React',
        description: 'Servir la API y la aplicación web compilada desde un solo contenedor.',
        codeSnippet: `// server.ts
import express from 'express';
import path from 'path';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// 1. Rutas de la API REST
app.use('/api', apiRouter);

// 2. Servir estáticos de React compilados
app.use(express.static(path.join(__dirname, 'dist')));

// 3. Fallback SPA: Cualquier ruta redirige a index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, () => {
  console.log(\`Servidor corriendo en el puerto \${PORT}\`);
});`,
      },
    ],
  },
];
