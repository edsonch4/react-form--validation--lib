# React Form Validation Hook

Uma biblioteca leve, poderosa e extensível para validação de formulários em React com suporte a atributos HTML e validações customizadas.

## ✨ Destaques

- Validação baseada em atributos (`required`, `type="email"`, `data-*`)
- Mensagens de erro globais, multilíngues e personalizáveis
- Possibilidade de definir mensagens específicas por campo
- Regras customizadas com `addValidationRule`
- Suporte a campos de texto, email, checkbox, file, e mais
- Pronto para usar com Tailwind CSS (ou qualquer outro estilo)

## 🚀 Instalação
```bash
npm installreact-form--validation--lib
yarn add react-form--validation--lib
```

## 🔧 Uso Básico
```tsx
import React from "react";
import { useFormValidation } from "react-form--validation--lib";

export default function MyForm() {
  const { formRef, errors, validate } = useFormValidation();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      alert("Formulário válido!");
    }
  };

  return (
    <form ref={formRef} onSubmit={handleSubmit}>
      <input name="email" type="email" required placeholder="Email" />
      {errors.email && <p>{errors.email}</p>}

      <input name="name" data-validate="onlyLetters" required placeholder="Nome" />
      {errors.name && <p>{errors.name}</p>}

      <input name="password" type="password" required />
      <input name="confirm" data-equals-to="password" required placeholder="Confirme a senha" />
      {errors.confirm && <p>{errors.confirm}</p>}

      <input name="avatar" type="file" accept="image/*" />
      {errors.avatar && <p>{errors.avatar}</p>}

      <button type="submit">Enviar</button>
    </form>
  );
}
```

## 🌍 Idiomas
Você pode definir o idioma padrão e mensagens customizadas por campo:

```tsx
useFormValidation({
  lang: "en",
  messages: {
    en: {
      email: {
        required: "Email is required!",
        email: "Enter a valid email!",
      },
    },
    pt: {
      name: {
        onlyLetters: "Somente letras, por favor.",
      },
    },
  },
});
```

## 🧩 Validações Disponíveis

| Atributo                | Descrição                          |
|-------------------------|------------------------------------|
| `required`              | Campo obrigatório                  |
| `type="email"`          | Validação de email                 |
| `type="file"` + `accept`| Validação de tipo de arquivo       |
| `data-validate="rule"`  | Regras customizadas como `onlyLetters` |
| `data-equals-to="name"` | Campo deve ser igual a outro       |
| `minlength`             | Tamanho mínimo (`minLength` no HTML) |
| `maxlength`             | Tamanho máximo (`maxLength` no HTML) |
| `pattern`               | Expressão regular (`pattern` no HTML) |

## ✍️ Adicionando Validações Customizadas

```tsx
import { addValidationRule } from "react-form-validator";

addValidationRule("even", (value) => parseInt(value, 10) % 2 === 0, {
  pt: "O número deve ser par.",
  en: "The number must be even.",
});
```

## 🛠️ Mensagens Padrão Customizadas

Você pode sobrescrever mensagens padrão para todos os campos:

```tsx
useFormValidation({
  lang: "pt",
  defaultMessages: {
    pt: {
      required: "Preenchimento obrigatório!",
    },
  },
});
```

## 📦 Pronto para produção