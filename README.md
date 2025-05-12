
# React Form Validation Hook

Uma biblioteca leve, poderosa e extensível para validação de formulários em React com suporte a atributos HTML e validações customizadas.

---

## ✨ Destaques

- Validação baseada em atributos (`required`, `type="email"`, `data-*`)
- Mensagens de erro globais e personalizáveis
- Regras customizadas com `addValidationRule`
- Suporte a campos de texto, email, checkbox, file, e mais
- Pronto para usar com Tailwind CSS (ou qualquer outro estilo)

---

## 🚀 Instalação

```bash
npm install react-form-validation-lib
```

---

## 🔧 Uso Básico

```tsx
import React from "react";
import { useFormValidation } from "react-form-validation-lib";

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

---

## 🧩 Validações Disponíveis

| Atributo                | Descrição                          |
|-------------------------|------------------------------------|
| `required`              | Campo obrigatório                  |
| `type="email"`          | Validação de email                 |
| `type="file"` + `accept`| Validação de tipo de arquivo       |
| `data-validate="rule"`  | Regras customizadas como `onlyLetters` |
| `data-equals-to="name"` | Campo deve ser igual a outro       |
| `data-minlength`        | Tamanho mínimo                     |
| `data-maxlength`        | Tamanho máximo                     |
| `data-pattern`          | Expressão regular customizada      |

---

## ✍️ Adicionando Validações Customizadas

```ts
import { addValidationRule } from "react-form-validation-lib";

addValidationRule("even", (value) => parseInt(value, 10) % 2 === 0, "O número deve ser par.");
```

---

## 🧪 Exemplo com Tailwind CSS

```tsx
<input
  name="email"
  type="email"
  required
  className="border p-2 rounded w-full"
/>
{errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
```

---

## 🔗 Links

- [GitHub Repository](https://github.com/seu-usuario/react-form-validation-lib)
- [Issues / Bugs](https://github.com/seu-usuario/react-form-validation-lib/issues)

---

## 📜 Licença

MIT © [Seu Nome]
