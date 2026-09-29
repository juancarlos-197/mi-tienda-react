import { ArrowRight, Code2, Database, Globe, Key, Layers, Server, Shield } from 'lucide-react';
import React, { useState } from 'react';
import { getEnvironment } from '../../environments/environment';

export const ArchitectureDiagram: React.FC = () => {
  const [selectedLayer, setSelectedLayer] = useState<string>('services');
  const env = getEnvironment();

  const layers = [
    {
      id: 'ui',
      title: '1. UI & Componentes React',
      icon: <Layers className="w-5 h-5 text-blue-500" />,
      color: 'border-blue-500 bg-blue-50 dark:bg-blue-950/30',
      description: 'Páginas y componentes reutilizables (ProductCard, ProductFilter, CartDrawer). No contienen lógica HTTP directa.',
      files: ['/src/components/products/ProductCard.tsx', '/src/pages/StorePage.tsx'],
      role: 'Solo se encarga de renderizar JSX y escuchar eventos del usuario.',
    },
    {
      id: 'hooks',
      title: '2. Custom Hooks & Context',
      icon: <Code2 className="w-5 h-5 text-indigo-500" />,
      color: 'border-indigo-500 bg-indigo-50 dark:bg-indigo-950/30',
      description: 'useProducts(), useAuth(), useForm(), CartContext. Encapsulan estado reactivo y llaman a la capa de servicios.',
      files: ['/src/hooks/useProducts.ts', '/src/context/CartContext.tsx', '/src/context/AuthContext.tsx'],
      role: 'Maneja el ciclo de vida, loading, error, y sincroniza el estado con la UI.',
    },
    {
      id: 'services',
      title: '3. Capa de Servicios (Services)',
      icon: <Globe className="w-5 h-5 text-emerald-500" />,
      color: 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/30',
      description: 'productService, authService, userService. Abstraen los endpoints REST del backend.',
      files: ['/src/services/productService.ts', '/src/services/authService.ts', '/src/services/userService.ts'],
      role: 'Aísla la definición de URLs y parámetros para que los componentes sean independientes del protocolo.',
    },
    {
      id: 'http',
      title: '4. HTTP Client & Interceptors',
      icon: <Shield className="w-5 h-5 text-amber-500" />,
      color: 'border-amber-500 bg-amber-50 dark:bg-amber-950/30',
      description: 'Intercepta cada solicitud saliente para inyectar Authorization: Bearer TOKEN y procesa errores 401, 403, 500.',
      files: ['/src/interceptors/httpInterceptor.ts'],
      role: 'Cliente HTTP centralizado (similar a Axios). Añade headers de entorno y seguridad.',
    },
    {
      id: 'env',
      title: '5. Environment Config',
      icon: <Key className="w-5 h-5 text-purple-500" />,
      color: 'border-purple-500 bg-purple-50 dark:bg-purple-950/30',
      description: `Variables de entorno resueltas (.env, .env.development, .env.production). API activa: ${env.apiUrl}`,
      files: ['/src/environments/environment.ts', '/.env.development', '/.env.production'],
      role: 'Permite cambiar entre localhost:3000 y el dominio de producción sin alterar el código fuente.',
    },
    {
      id: 'backend',
      title: '6. Backend REST API (Express / Mock)',
      icon: <Server className="w-5 h-5 text-rose-500" />,
      color: 'border-rose-500 bg-rose-50 dark:bg-rose-950/30',
      description: 'Controladores REST (/api/products, /api/auth, /api/orders) que validan tokens JWT y gestionan datos.',
      files: ['/src/interceptors/mockBackend.ts', '/server.ts'],
      role: 'Procesa lógica de negocio, descuenta existencias en pedidos y persiste la base de datos.',
    },
  ];

  const active = layers.find((l) => l.id === selectedLayer) || layers[0];

  return (
    <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-5 shadow-2xs space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-neutral-100 dark:border-neutral-800 pb-4">
        <div>
          <h3 className="text-base font-bold text-neutral-900 dark:text-white flex items-center gap-2">
            <Database className="w-4 h-4 text-blue-600" /> Mapa de Arquitectura de la Aplicación
          </h3>
          <p className="text-xs text-neutral-500">
            Flujo unidireccional y desacoplamiento por capas de "Mi Tienda React"
          </p>
        </div>
        <span className="text-2xs font-mono px-2.5 py-1 rounded bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300">
          Entorno: {env.envName} | {env.apiUrl}
        </span>
      </div>

      {/* Layer Flow Horizontal */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-2">
        {layers.map((layer, index) => {
          const isSelected = layer.id === selectedLayer;
          return (
            <button
              key={layer.id}
              onClick={() => setSelectedLayer(layer.id)}
              className={`p-3 rounded-lg border text-left transition-all cursor-pointer relative flex flex-col justify-between h-28 ${
                isSelected
                  ? `${layer.color} shadow-xs ring-2 ring-blue-500/30 font-semibold`
                  : 'border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-800/30 hover:bg-neutral-100/60 dark:hover:bg-neutral-800/60'
              }`}
            >
              <div className="flex items-center justify-between w-full">
                <span className="p-1 rounded bg-white dark:bg-neutral-900 shadow-2xs">
                  {layer.icon}
                </span>
                <span className="text-2xs font-mono text-neutral-400">P{index + 1}</span>
              </div>
              <div className="text-xs font-medium text-neutral-900 dark:text-white leading-tight mt-2 line-clamp-2">
                {layer.title.split(':')[1] || layer.title}
              </div>
            </button>
          );
        })}
      </div>

      {/* Active Layer Inspector */}
      <div className="bg-neutral-50 dark:bg-neutral-800/40 border border-neutral-200/80 dark:border-neutral-700/60 rounded-xl p-4 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {active.icon}
            <h4 className="font-bold text-sm text-neutral-900 dark:text-white">{active.title}</h4>
          </div>
          <span className="text-xs text-neutral-500 font-mono">Capa #{layers.findIndex((l) => l.id === active.id) + 1}</span>
        </div>

        <p className="text-xs text-neutral-600 dark:text-neutral-300 leading-relaxed">
          {active.description}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2 border-t border-neutral-200/50 dark:border-neutral-700/50 text-xs">
          <div>
            <span className="text-neutral-500 font-medium block mb-1">Rol en la Arquitectura:</span>
            <p className="text-neutral-800 dark:text-neutral-200">{active.role}</p>
          </div>
          <div>
            <span className="text-neutral-500 font-medium block mb-1">Archivos clave en este proyecto:</span>
            <div className="flex flex-wrap gap-1">
              {active.files.map((file) => (
                <code
                  key={file}
                  className="px-1.5 py-0.5 rounded bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 text-2xs text-blue-600 dark:text-blue-400"
                >
                  {file}
                </code>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
