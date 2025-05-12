
import { useRef, useState, useCallback } from "react";

export type ValidationRule = (value: string, field?: HTMLInputElement) => boolean;

export const validationMessages: Record<string, string> = {
  required: "Este campo é obrigatório.",
  email: "Digite um email válido.",
  onlyLetters: "Use apenas letras.",
  equalsTo: "Os campos não coincidem.",
  fileType: "Tipo de arquivo inválido.",
  default: "Campo inválido.",
};

const validationRules: Record<string, ValidationRule> = {
  email: (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
  onlyLetters: (value) => /^[A-Za-zÀ-ÿ\s]+$/.test(value),
  equalsTo: (value, field) => {
    const targetName = field?.dataset.equalsTo;
    if (!targetName) return true;
    const form = field?.form;
    const target = form?.elements.namedItem(targetName) as HTMLInputElement;
    return target && value === target.value;
  },
  fileType: (_, field) => {
    const accept = field?.accept;
    if (!accept || !field?.files?.length) return true;
    const file = field.files[0];
    return accept.split(",").some((type) => file.type.includes(type.trim()));
  },
};

export function addValidationRule(name: string, rule: ValidationRule, message?: string) {
  validationRules[name] = rule;
  if (message) validationMessages[name] = message;
}

export function useFormValidation() {
  const formRef = useRef<HTMLFormElement>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = useCallback(() => {
    const form = formRef.current;
    if (!form) return false;

    const newErrors: Record<string, string> = {};
    const elements = Array.from(form.elements) as HTMLInputElement[];

    for (const field of elements) {
      if (!field.name || field.disabled || field.type === "submit") continue;

      let valid = true;
      let message = "";

      if (field.required && !field.value.trim()) {
        valid = false;
        message = validationMessages.required;
      }

      if (valid && field.type === "email") {
        valid = validationRules.email(field.value);
        if (!valid) message = validationMessages.email;
      }

      if (valid && field.type === "file") {
        valid = validationRules.fileType("", field);
        if (!valid) message = validationMessages.fileType;
      }

      if (valid && field.dataset.equalsTo) {
        valid = validationRules.equalsTo(field.value, field);
        if (!valid) message = validationMessages.equalsTo;
      }

      if (valid && field.dataset.validate) {
        const rules = field.dataset.validate.split(",");
        for (const ruleName of rules) {
          const rule = validationRules[ruleName.trim()];
          if (rule && !rule(field.value, field)) {
            valid = false;
            message = validationMessages[ruleName.trim()] || validationMessages.default;
            break;
          }
        }
      }

      if (valid && field.dataset.minlength) {
        const min = parseInt(field.dataset.minlength);
        if (field.value.length < min) {
          valid = false;
          message = `Mínimo ${min} caracteres.`;
        }
      }

      if (valid && field.dataset.maxlength) {
        const max = parseInt(field.dataset.maxlength);
        if (field.value.length > max) {
          valid = false;
          message = `Máximo ${max} caracteres.`;
        }
      }

      if (valid && field.dataset.pattern) {
        const pattern = new RegExp(field.dataset.pattern);
        if (!pattern.test(field.value)) {
          valid = false;
          message = validationMessages.default;
        }
      }

      if (!valid) {
        newErrors[field.name] = message;
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, []);

  return { formRef, errors, validate };
}
