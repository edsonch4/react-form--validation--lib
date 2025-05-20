import { useRef, useState, useCallback } from "react";

export type ValidationRule = (value: string, field?: HTMLInputElement) => boolean;

export const defaultValidationMessages: Record<string, Record<string, string>> = {
  pt: {
    required: "Este campo é obrigatório.",
    email: "Digite um email válido.",
    onlyLetters: "Use apenas letras.",
    equalsTo: "Os campos não coincidem.",
    fileType: "Tipo de arquivo inválido.",
    minlength: "Mínimo de caracteres não atingido.",
    maxlength: "Máximo de caracteres excedido.",
    pattern: "Formato inválido.",
    default: "Campo inválido.",
  },
  en: {
    required: "This field is required.",
    email: "Please enter a valid email.",
    onlyLetters: "Letters only.",
    equalsTo: "Fields do not match.",
    fileType: "Invalid file type.",
    minlength: "Too short.",
    maxlength: "Too long.",
    pattern: "Invalid format.",
    default: "Invalid field.",
  },
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

export function addValidationRule(name: string, rule: ValidationRule, messages?: Record<string, string>) {
  validationRules[name] = rule;
  if (messages) {
    for (const lang in messages) {
      defaultValidationMessages[lang] = {
        ...defaultValidationMessages[lang],
        [name]: messages[lang],
      };
    }
  }
}

interface UseFormValidationOptions {
  lang?: string;
  messages?: Record<string, Record<string, Record<string, string>>>;
  defaultMessages?: Record<string, Record<string, string>>;
}

export function useFormValidation(options: UseFormValidationOptions = {}) {
  const formRef = useRef<HTMLFormElement>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const {
    lang = "pt",
    messages = {},
    defaultMessages = {},
  } = options;

  const getMessage = (fieldName: string, rule: string): string => {
    return (
      messages[lang]?.[fieldName]?.[rule] ||
      defaultMessages[lang]?.[rule] ||
      defaultValidationMessages[lang]?.[rule] ||
      defaultValidationMessages[lang]?.default ||
      "Campo inválido"
    );
  };

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
        message = getMessage(field.name, "required");
      }

      if (valid && field.type === "email") {
        valid = validationRules.email(field.value);
        if (!valid) message = getMessage(field.name, "email");
      }

      if (valid && field.type === "file") {
        valid = validationRules.fileType("", field);
        if (!valid) message = getMessage(field.name, "fileType");
      }

      if (valid && field.dataset.equalsTo) {
        valid = validationRules.equalsTo(field.value, field);
        if (!valid) message = getMessage(field.name, "equalsTo");
      }

      if (valid && field.dataset.validate) {
        const rules = field.dataset.validate.split(",");
        for (const ruleName of rules) {
          const rule = validationRules[ruleName.trim()];
          if (rule && !rule(field.value, field)) {
            valid = false;
            message = getMessage(field.name, ruleName.trim());
            break;
          }
        }
      }

      if (valid && field.minLength > 0) {
        const min = field.minLength;
        if (field.value.length < min) {
          valid = false;
          message = getMessage(field.name, "minlength") || `Mínimo ${min} caracteres.`;
        }
      }

      if (valid && field.maxLength > -1) {
        const max = field.maxLength;
        if (field.value.length > max) {
          valid = false;
          message = getMessage(field.name, "maxlength") || `Máximo ${max} caracteres.`;
        }
      }

      if (valid && field.pattern) {
        const pattern = new RegExp(field.pattern);
        if (!pattern.test(field.value)) {
          valid = false;
          message = getMessage(field.name, "pattern");
        }
      }

      if (!valid) {
        newErrors[field.name] = message;
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [lang, messages, defaultMessages]);

  return { formRef, errors, validate };
}