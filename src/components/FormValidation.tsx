
import { useState } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

interface ValidationRule {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  custom?: (value: any) => string | null;
}

interface ValidationRules {
  [key: string]: ValidationRule;
}

export const useFormValidation = (rules: ValidationRules) => {
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validateField = (name: string, value: any): string | null => {
    const rule = rules[name];
    if (!rule) return null;

    if (rule.required && (!value || (typeof value === 'string' && !value.trim()))) {
      return 'Este campo é obrigatório';
    }

    if (value && rule.minLength && value.length < rule.minLength) {
      return `Mínimo de ${rule.minLength} caracteres`;
    }

    if (value && rule.maxLength && value.length > rule.maxLength) {
      return `Máximo de ${rule.maxLength} caracteres`;
    }

    if (value && rule.pattern && !rule.pattern.test(value)) {
      return 'Formato inválido';
    }

    if (rule.custom) {
      return rule.custom(value);
    }

    return null;
  };

  const validateForm = (data: { [key: string]: any }): boolean => {
    const newErrors: { [key: string]: string } = {};

    Object.keys(rules).forEach(fieldName => {
      const error = validateField(fieldName, data[fieldName]);
      if (error) {
        newErrors[fieldName] = error;
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateSingleField = (name: string, value: any) => {
    const error = validateField(name, value);
    setErrors(prev => ({
      ...prev,
      [name]: error || ''
    }));
    return !error;
  };

  const clearErrors = () => setErrors({});

  return {
    errors,
    validateForm,
    validateSingleField,
    clearErrors,
    hasErrors: Object.values(errors).some(error => error !== '')
  };
};

interface FormErrorProps {
  error: string;
}

export const FormError = ({ error }: FormErrorProps) => {
  if (!error) return null;

  return (
    <Alert className="mt-2 py-2 border-red-200 bg-red-50">
      <AlertCircle className="h-4 w-4 text-red-500" />
      <AlertDescription className="text-red-700 text-sm">
        {error}
      </AlertDescription>
    </Alert>
  );
};

export const phoneValidation = (phone: string): string | null => {
  const phoneRegex = /^\(\d{2}\)\s\d{4,5}-\d{4}$/;
  if (!phoneRegex.test(phone)) {
    return 'Formato: (11) 99999-9999';
  }
  return null;
};

export const emailValidation = (email: string): string | null => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return 'Email inválido';
  }
  return null;
};
