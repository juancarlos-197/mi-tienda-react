import React, { useEffect } from 'react';
import { useForm } from '../../hooks/useForm';
import { CreateProductDTO, Product, ProductCategory } from '../../models/product.model';
import { productService } from '../../services/productService';
import { validators } from '../../utils/validators';
import { Button } from '../common/Button';
import { Input } from '../common/Input';
import { Modal } from '../common/Modal';

interface ProductModalFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmitProduct: (data: CreateProductDTO) => Promise<void>;
  productToEdit?: Product | null;
}

export const ProductModalForm: React.FC<ProductModalFormProps> = ({
  isOpen,
  onClose,
  onSubmitProduct,
  productToEdit,
}) => {
  const isEditing = !!productToEdit;
  const categories = productService.getCategories();

  const initialFormValues: CreateProductDTO = {
    name: productToEdit?.name || '',
    description: productToEdit?.description || '',
    price: productToEdit?.price || 199,
    stock: productToEdit?.stock || 10,
    category: productToEdit?.category || 'Periféricos',
    imageUrl: productToEdit?.imageUrl || 'https://images.unsplash.com/photo-1526738549149-8e07eca6c147?auto=format&fit=crop&w=1000&q=80',
    featured: productToEdit?.featured || false,
  };

  const validationSchema = {
    name: [
      validators.required('El nombre del producto es obligatorio'),
      validators.minLength(3, 'El nombre debe contener al menos 3 caracteres'),
    ],
    price: [
      validators.required('El precio es obligatorio'),
      validators.minNumber(1, 'El precio debe ser superior a $0'),
    ],
    stock: [
      validators.required('La cantidad de inventario es obligatoria'),
      validators.positiveInteger('El stock no puede ser un número negativo'),
    ],
    description: [
      validators.required('La descripción es obligatoria'),
      validators.minLength(10, 'La descripción debe tener al menos 10 caracteres'),
    ],
    imageUrl: [
      validators.required('La imagen es obligatoria'),
      validators.url('Debe ser una URL válida (http/https)'),
    ],
  };

  const {
    values,
    errors,
    touched,
    isSubmitting,
    handleChange,
    handleBlur,
    handleSubmit,
    setValues,
    resetForm,
  } = useForm<CreateProductDTO>(
    initialFormValues,
    validationSchema,
    async (formValues) => {
      await onSubmitProduct({
        ...formValues,
        price: Number(formValues.price),
        stock: Number(formValues.stock),
      });
      resetForm();
      onClose();
    }
  );

  useEffect(() => {
    if (isOpen) {
      if (productToEdit) {
        setValues({
          name: productToEdit.name,
          description: productToEdit.description,
          price: productToEdit.price,
          stock: productToEdit.stock,
          category: productToEdit.category,
          imageUrl: productToEdit.imageUrl,
          featured: Boolean(productToEdit.featured),
        });
      } else {
        resetForm();
      }
    }
  }, [isOpen, productToEdit]);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? `Editar: ${productToEdit?.name}` : 'Crear Nuevo Producto'}
      maxWidth="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Nombre */}
        <Input
          label="Nombre del Producto *"
          name="name"
          value={values.name}
          onChange={handleChange}
          onBlur={handleBlur}
          error={touched.name ? errors.name : undefined}
          placeholder="Ej: Teclado Mecánico RGB"
        />

        {/* Categoría & Destacado */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
              Categoría *
            </label>
            <select
              name="category"
              value={values.category}
              onChange={handleChange}
              className="block w-full rounded-lg border border-neutral-300 dark:border-neutral-700 text-sm py-2 px-3 text-neutral-900 dark:text-neutral-100 bg-white dark:bg-neutral-900 focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center pt-6">
            <label className="flex items-center gap-2 cursor-pointer text-sm text-neutral-700 dark:text-neutral-300">
              <input
                type="checkbox"
                name="featured"
                checked={values.featured}
                onChange={handleChange}
                className="h-4 w-4 rounded border-neutral-300 text-blue-600 focus:ring-blue-500"
              />
              <span>Marcar como destacado</span>
            </label>
          </div>
        </div>

        {/* Precio & Stock */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Precio ($ USD) *"
            type="number"
            step="0.01"
            name="price"
            value={values.price}
            onChange={handleChange}
            onBlur={handleBlur}
            error={touched.price ? errors.price : undefined}
            placeholder="Ej: 299.99"
          />

          <Input
            label="Stock disponible *"
            type="number"
            name="stock"
            value={values.stock}
            onChange={handleChange}
            onBlur={handleBlur}
            error={touched.stock ? errors.stock : undefined}
            placeholder="Ej: 25"
          />
        </div>

        {/* URL de la Imagen */}
        <Input
          label="URL de la Imagen *"
          type="url"
          name="imageUrl"
          value={values.imageUrl}
          onChange={handleChange}
          onBlur={handleBlur}
          error={touched.imageUrl ? errors.imageUrl : undefined}
          placeholder="https://images.unsplash.com/..."
          helperText="Usa un enlace directo a una imagen (JPG/PNG)"
        />

        {/* Vista previa en miniatura */}
        {values.imageUrl && !errors.imageUrl && (
          <div className="flex items-center gap-3 p-2 bg-neutral-50 dark:bg-neutral-800/60 rounded-lg">
            <img
              src={values.imageUrl}
              alt="Vista previa"
              className="h-12 w-12 rounded object-cover"
              onError={(e) => {
                (e.target as HTMLElement).style.display = 'none';
              }}
            />
            <span className="text-2xs text-neutral-500">Vista previa de imagen cargada</span>
          </div>
        )}

        {/* Descripción */}
        <div>
          <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
            Descripción detallada *
          </label>
          <textarea
            name="description"
            rows={3}
            value={values.description}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="Describe las características y ventajas del producto..."
            className={`block w-full rounded-lg border text-sm py-2 px-3 text-neutral-900 dark:text-neutral-100 bg-white dark:bg-neutral-900 ${
              touched.description && errors.description
                ? 'border-rose-500 focus:border-rose-500'
                : 'border-neutral-300 dark:border-neutral-700 focus:border-blue-500'
            }`}
          />
          {touched.description && errors.description && (
            <p className="mt-1 text-xs text-rose-600">{errors.description}</p>
          )}
        </div>

        {/* Botones de acción */}
        <div className="flex justify-end gap-3 pt-4 border-t border-neutral-100 dark:border-neutral-800">
          <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
            Cancelar
          </Button>
          <Button type="submit" variant="primary" isLoading={isSubmitting}>
            {isEditing ? 'Guardar Cambios' : 'Crear Producto'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
