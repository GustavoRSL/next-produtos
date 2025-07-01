import { z } from "zod";

// Schema para telefone
export const phoneSchema = z.object({
  country: z.string().min(1, "País é obrigatório"),
  ddd: z
    .string()
    .min(2, "DDD deve ter pelo menos 2 dígitos")
    .max(3, "DDD deve ter no máximo 3 dígitos"),
  number: z
    .string()
    .min(8, "Número deve ter pelo menos 8 dígitos")
    .max(9, "Número deve ter no máximo 9 dígitos"),
});

// Schema para registro
export const registerSchema = z
  .object({
    name: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
    email: z.string().email("Email inválido"),
    password: z.string().min(6, "Senha deve ter pelo menos 6 caracteres"),
    verifyPassword: z.string().min(6, "Confirmação de senha é obrigatória"),
    phone: phoneSchema,
  })
  .refine((data) => data.password === data.verifyPassword, {
    message: "As senhas não coincidem",
    path: ["verifyPassword"],
  });

// Schema para login
export const loginSchema = z.object({
  email: z.string().email("Email inválido"),
  password: z.string().min(1, "Senha é obrigatória"),
});

// Types
export type RegisterFormData = z.infer<typeof registerSchema>;
export type LoginFormData = z.infer<typeof loginSchema>;
export type PhoneData = z.infer<typeof phoneSchema>;
