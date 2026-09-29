export interface ValidationRule {
  validate: (value: any) => boolean;
  message: string;
}

export const validators = {
  required: (message = 'Este campo es obligatorio'): ValidationRule => ({
    validate: (val) => val !== undefined && val !== null && String(val).trim().length > 0,
    message,
  }),

  email: (message = 'Ingresa un correo electrónico válido'): ValidationRule => ({
    validate: (val) => !val || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(val).trim()),
    message,
  }),

  minLength: (min: number, message?: string): ValidationRule => ({
    validate: (val) => !val || String(val).length >= min,
    message: message || `Debe tener al menos ${min} caracteres`,
  }),

  minNumber: (min: number, message?: string): ValidationRule => ({
    validate: (val) => {
      const num = Number(val);
      return !isNaN(num) && num >= min;
    },
    message: message || `El valor mínimo permitido es ${min}`,
  }),

  positiveInteger: (message = 'Debe ser un número entero mayor o igual a 0'): ValidationRule => ({
    validate: (val) => {
      const num = Number(val);
      return !isNaN(num) && Number.isInteger(num) && num >= 0;
    },
    message,
  }),

  url: (message = 'Ingresa una URL válida'): ValidationRule => ({
    validate: (val) => {
      if (!val) return true;
      try {
        new URL(String(val));
        return true;
      } catch {
        return false;
      }
    },
    message,
  }),
};
