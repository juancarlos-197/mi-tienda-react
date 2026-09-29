import { AlertCircle, Edit, Plus, RefreshCw, RotateCcw, Search, ShieldAlert, Trash2 } from 'lucide-react';
import React, { useState } from 'react';
import { ProductModalForm } from '../components/admin/ProductModalForm';
import { Button } from '../components/common/Button';
import { Modal } from '../components/common/Modal';
import { useAuth } from '../context/AuthContext';
import { useProducts } from '../hooks/useProducts';
import { CreateProductDTO, Product } from '../models/product.model';
import { formatCurrency } from '../utils/formatters';

export const AdminProductsPage: React.FC = () => {
  const { user, isAdmin, quickLogin } = useAuth();
  const {
    products,
    loading,
    createProduct,
    updateProduct,
    deleteProduct,
    resetDatabase,
    refetch,
  } = useProducts();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deletingProduct, setDeletingProduct] = useState<Product | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Filtros locales para la tabla administrativa
  const filteredProducts = products.filter((p) => {
    const matchSearch =
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchCat = selectedCategory === 'all' || p.category === selectedCategory;
    return matchSearch && matchCat;
  });

  const handleOpenCreate = () => {
    setEditingProduct(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (product: Product) => {
    setEditingProduct(product);
    setIsModalOpen(true);
  };

  const handleSubmitForm = async (formData: CreateProductDTO) => {
    if (editingProduct) {
      await updateProduct(editingProduct.id, formData);
    } else {
      await createProduct(formData);
    }
    setIsModalOpen(false);
  };

  const handleConfirmDelete = async () => {
    if (!deletingProduct) return;
    setIsDeleting(true);
    try {
      await deleteProduct(deletingProduct.id);
      setDeletingProduct(null);
    } finally {
      setIsDeleting(false);
    }
  };

  // Si el usuario no es admin, mostrar pantalla explicativa de seguridad HTTP 403
  if (!isAdmin) {
    return (
      <div className="max-w-2xl mx-auto my-12 p-8 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl text-center space-y-4 shadow-sm">
        <div className="w-12 h-12 rounded-full bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center mx-auto">
          <ShieldAlert className="w-6 h-6" />
        </div>
        <h2 className="text-xl font-bold text-neutral-900 dark:text-white">
          Acceso Restringido (Ruta Protegida)
        </h2>
        <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed max-w-md mx-auto">
          El panel CRUD de productos requiere el rol <code>admin</code>. Actualmente tu sesión está como{' '}
          <strong>{user ? user.role : 'Invitado sin autenticar'}</strong>.
        </p>
        <div className="pt-3">
          <Button
            onClick={() => quickLogin('admin')}
            variant="primary"
            size="md"
          >
            Iniciar Sesión como Administrador (1 Clic)
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-neutral-900 p-6 rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-2xs">
        <div>
          <h1 className="text-2xl font-extrabold text-neutral-900 dark:text-white tracking-tight">
            Gestión CRUD de Productos
          </h1>
          <p className="text-xs text-neutral-500 mt-1">
            Demostración del Módulo 10: Crear, Leer, Actualizar y Eliminar productos con validación.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={resetDatabase}
            title="Restablecer base de datos inicial"
            className="px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 text-xs font-medium text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors inline-flex items-center gap-1.5 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5 text-neutral-500" />
            <span className="hidden sm:inline">Restablecer Datos</span>
          </button>

          <Button
            onClick={handleOpenCreate}
            variant="primary"
            size="md"
            leftIcon={<Plus className="w-4 h-4" />}
          >
            + Nuevo producto
          </Button>
        </div>
      </div>

      {/* Table Filters & Stats Bar */}
      <div className="bg-white dark:bg-neutral-900 p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 flex flex-col sm:flex-row gap-3 items-center justify-between shadow-2xs">
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-neutral-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar por nombre..."
            className="w-full pl-9 pr-3 py-1.5 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg text-xs text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end text-xs">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-2.5 py-1.5 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg text-xs text-neutral-800 dark:text-neutral-200 focus:outline-none"
          >
            <option value="all">Todas las categorías</option>
            <option value="Portátiles">Portátiles</option>
            <option value="Periféricos">Periféricos</option>
            <option value="Monitores">Monitores</option>
            <option value="Audio">Audio</option>
            <option value="Componentes">Componentes</option>
            <option value="Accesorios">Accesorios</option>
          </select>

          <span className="text-neutral-400">|</span>

          <span className="text-neutral-600 dark:text-neutral-400 font-medium">
            {filteredProducts.length} items registrados
          </span>
        </div>
      </div>

      {/* Main CRUD Table */}
      <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl overflow-hidden shadow-2xs">
        {loading ? (
          <div className="p-12 text-center text-neutral-500 space-y-2">
            <RefreshCw className="w-6 h-6 animate-spin mx-auto text-blue-600" />
            <p className="text-xs">Cargando base de datos de productos...</p>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="p-12 text-center text-neutral-500 space-y-2">
            <p className="text-sm font-semibold">No se encontraron productos</p>
            <p className="text-xs">Prueba borrando el término de búsqueda o crea uno nuevo con "+ Nuevo producto".</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-800/60 text-neutral-600 dark:text-neutral-400 font-semibold uppercase tracking-wider text-2xs">
                  <th className="py-3 px-4">Producto</th>
                  <th className="py-3 px-4">Categoría</th>
                  <th className="py-3 px-4">Precio</th>
                  <th className="py-3 px-4">Stock</th>
                  <th className="py-3 px-4">Estado</th>
                  <th className="py-3 px-4 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
                {filteredProducts.map((p) => {
                  const isLow = p.stock <= 5 && p.stock > 0;
                  const isOut = p.stock <= 0;

                  return (
                    <tr
                      key={p.id}
                      className="hover:bg-neutral-50/80 dark:hover:bg-neutral-800/40 transition-colors"
                    >
                      {/* Producto */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={p.imageUrl}
                            alt=""
                            className="w-10 h-10 rounded-lg object-cover bg-neutral-100 dark:bg-neutral-800 shrink-0"
                          />
                          <div className="min-w-0">
                            <span className="font-semibold text-neutral-900 dark:text-white block truncate max-w-xs sm:max-w-md">
                              {p.name}
                            </span>
                            <span className="text-2xs text-neutral-400 block truncate max-w-xs">
                              {p.description}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Categoría */}
                      <td className="py-3 px-4 text-neutral-600 dark:text-neutral-300 font-medium">
                        {p.category}
                      </td>

                      {/* Precio */}
                      <td className="py-3 px-4 font-bold text-neutral-900 dark:text-white">
                        {formatCurrency(p.price)}
                      </td>

                      {/* Stock */}
                      <td className="py-3 px-4 font-mono font-semibold">
                        <span
                          className={
                            isOut
                              ? 'text-rose-600 dark:text-rose-400'
                              : isLow
                              ? 'text-amber-600 dark:text-amber-400'
                              : 'text-neutral-800 dark:text-neutral-200'
                          }
                        >
                          {p.stock} uds.
                        </span>
                      </td>

                      {/* Estado */}
                      <td className="py-3 px-4">
                        {isOut ? (
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-2xs font-semibold bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300 border border-rose-200 dark:border-rose-900">
                            Agotado
                          </span>
                        ) : isLow ? (
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-2xs font-semibold bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-200 dark:border-amber-900">
                            Bajo Stock
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-2xs font-semibold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-900">
                            Disponible
                          </span>
                        )}
                      </td>

                      {/* Acciones */}
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleOpenEdit(p)}
                            title="Editar producto"
                            className="p-1.5 rounded-lg text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
                          >
                            <Edit className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                          </button>

                          <button
                            onClick={() => setDeletingProduct(p)}
                            title="Eliminar producto"
                            className="p-1.5 rounded-lg text-neutral-600 hover:text-rose-600 dark:text-neutral-400 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4 text-rose-600 dark:text-rose-400" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal Form for Create / Edit */}
      <ProductModalForm
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmitProduct={handleSubmitForm}
        productToEdit={editingProduct}
      />

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={!!deletingProduct}
        onClose={() => setDeletingProduct(null)}
        title="Confirmar Eliminación"
        maxWidth="sm"
      >
        <div className="space-y-4 text-xs">
          <div className="flex items-start gap-3 p-3 bg-rose-50 dark:bg-rose-950/50 rounded-lg text-rose-800 dark:text-rose-200">
            <AlertCircle className="w-5 h-5 shrink-0 text-rose-600" />
            <div>
              <p className="font-semibold">¿Seguro que deseas eliminar este producto?</p>
              <p className="mt-1 text-2xs leading-relaxed">
                "{deletingProduct?.name}" será removido permanentemente de la base de datos REST.
              </p>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-neutral-100 dark:border-neutral-800">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setDeletingProduct(null)}
              disabled={isDeleting}
            >
              Cancelar
            </Button>
            <Button
              variant="danger"
              size="sm"
              onClick={handleConfirmDelete}
              isLoading={isDeleting}
            >
              Eliminar
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
