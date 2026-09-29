import { Code2, Cpu, Globe, Heart, ShieldCheck } from 'lucide-react';
import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/50 mt-16 text-neutral-600 dark:text-neutral-400 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-3">
            <div className="flex items-center gap-2 font-bold text-neutral-900 dark:text-white text-sm">
              <Code2 className="w-4 h-4 text-blue-500" />
              <span>Mi Tienda React Full-Stack</span>
            </div>
            <p className="text-2xs leading-relaxed text-neutral-500">
              Proyecto de referencia profesional para el curso completo de React. Arquitectura por capas, servicios desacoplados, interceptores HTTP, JWT y Context API.
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-neutral-900 dark:text-white mb-2 text-2xs uppercase tracking-wider">
              Arquitectura Front-End
            </h4>
            <ul className="space-y-1.5 text-2xs">
              <li>· Vite + React 19 + TypeScript</li>
              <li>· Capa de Servicios (Services)</li>
              <li>· Cliente HTTP e Interceptores</li>
              <li>· Context API (Auth, Cart, Theme)</li>
              <li>· Formularios controlados & validación</li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-neutral-900 dark:text-white mb-2 text-2xs uppercase tracking-wider">
              Backend & Seguridad
            </h4>
            <ul className="space-y-1.5 text-2xs">
              <li>· Mock REST Express Controller</li>
              <li>· Authorization: Bearer TOKEN</li>
              <li>· Manejo centralizado de 401, 403, 500</li>
              <li>· Control de acceso RBAC (Admin / Client)</li>
              <li>· Sincronización y persistencia de datos</li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-neutral-900 dark:text-white mb-2 text-2xs uppercase tracking-wider">
              Ruta del Curso
            </h4>
            <div className="space-y-1 text-2xs">
              <span className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400">
                <ShieldCheck className="w-3.5 h-3.5" /> 15 Módulos interactivos
              </span>
              <span className="flex items-center gap-1.5 text-blue-600 dark:text-blue-400">
                <Globe className="w-3.5 h-3.5" /> Laboratorio HTTP en tiempo real
              </span>
              <span className="flex items-center gap-1.5 text-amber-600 dark:text-amber-400">
                <Cpu className="w-3.5 h-3.5" /> CRUD administrativo completo
              </span>
            </div>
          </div>
        </div>

        <div className="border-t border-neutral-200 dark:border-neutral-800 mt-8 pt-6 flex flex-col sm:flex-row items-center justify-between text-2xs gap-4">
          <p>© 2026 Curso de React. Desarrollado con dedicación técnica y enfoque pedagógico.</p>
          <div className="flex items-center gap-4 text-neutral-500">
            <span>React 19</span>
            <span>·</span>
            <span>TypeScript</span>
            <span>·</span>
            <span>Tailwind CSS</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
