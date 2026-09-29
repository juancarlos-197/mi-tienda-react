import { useState } from 'react';
import { ValidationRule } from '../utils/validators';

export type ValidationSchema<T> = Partial<Record<keyof T, ValidationRule[]>>;
export type FormErrors<T> = Partial<Record<keyof T, string>>;

export function useForm<T extends Record<string, any>>(
  initialValues: T,
  validationSchema?: ValidationSchema<T>,
  onSubmit?: (values: T) => void | Promise<void>
) {
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<FormErrors<T>>({});
  const [touched, setTouched] = useState<Partial<Record<keyof T, boolean>>>({});
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const validateField = (fieldName: keyof T, value: any): string | null => {
    if (!validationSchema || !validationSchema[fieldName]) return null;

    const rules = validationSchema[fieldName]!;
    for (const rule of rules) {
      if (!rule.validate(value)) {
        return rule.message;
      }
    }
    return null;
  };

  const validateForm = (): boolean => {
    if (!validationSchema) return true;

    const newErrors: FormErrors<T> = {};
    let isValid = true;

    Object.keys(validationSchema).forEach((key) => {
      const fieldKey = key as keyof T;
      const errorMsg = validateField(fieldKey, values[fieldKey]);
      if (errorMsg) {
        newErrors[fieldKey] = errorMsg;
        isValid = false;
      }
    });

    setErrors(newErrors);
    return isValid;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    const finalValue = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;

    setValues((prev) => ({
      ...prev,
      [name]: finalValue,
    }));

    if (touched[name as keyof T]) {
      const errorMsg = validateField(name as keyof T, finalValue);
      setErrors((prev) => ({
        ...prev,
        [name]: errorMsg || undefined,
      }));
    }
  };

  const handleBlur = (
    e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));

    const errorMsg = validateField(name as keyof T, value);
    setErrors((prev) => ({
      ...prev,
      [name]: errorMsg || undefined,
    }));
  };

  const setFieldValue = (field: keyof T, value: any) => {
    setValues((prev) => ({ ...prev, [field]: value }));
  };

  const resetForm = () => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
    setIsSubmitting(false);
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    // Marcar todos como tocados para revelar errores
    const allTouched: Partial<Record<keyof T, boolean>> = {};
    Object.keys(values).forEach((k) => {
      allTouched[k as keyof T] = true;
    });
    setTouched(allTouched);

    const isValid = validateForm();
    if (!isValid) return;

    if (onSubmit) {
      setIsSubmitting(true);
      try {
        await onSubmit(values);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  return {
    values,
    errors,
    touched,
    isSubmitting,
    handleChange,
    handleBlur,
    setFieldValue,
    setValues,
    handleSubmit,
    resetForm,
    validateField,
  };
}
