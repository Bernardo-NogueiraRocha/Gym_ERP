import z from "zod";

export function isValidCPF(cpf: string): boolean {
  const digits = cpf.replace(/\D/g, "");

  if (digits.length !== 11) {
    return false;
  }

  // Reject repeated digits:
  // 00000000000, 11111111111, etc.
  if (/^(\d)\1{10}$/.test(digits)) {
    return false;
  }

  let sum = 0;

  for (let i = 0; i < 9; i++) {
    sum += Number(digits[i]) * (10 - i);
  }

  let remainder = (sum * 10) % 11;

  if (remainder === 10) {
    remainder = 0;
  }

  if (remainder !== Number(digits[9])) {
    return false;
  }

  sum = 0;

  for (let i = 0; i < 10; i++) {
    sum += Number(digits[i]) * (11 - i);
  }

  remainder = (sum * 10) % 11;

  if (remainder === 10) {
    remainder = 0;
  }

  return remainder === Number(digits[10]);
}

export function formatCPF(value: string) {
  const digits = value.replace(/\D/g, "").slice(0, 11);

  return digits
    .replace(/^(\d{3})(\d)/, "$1.$2")
    .replace(/^(\d{3})\.(\d{3})(\d)/, "$1.$2.$3")
    .replace(/^(\d{3})\.(\d{3})\.(\d{3})(\d)/, "$1.$2.$3-$4");
}

export function formatPhone(value: string) {
  const digits = value.replace(/\D/g, "").slice(0, 11);

  return digits
    .replace(/^(\d{2})(\d)/, "($1) $2")
    .replace(/^(\(\d{2}\) \d{5})(\d)/, "$1-$2");
}

export function isValidPhone(phone: string): boolean {
  const digits = phone.replace(/\D/g, "");

  return /^[1-9]{2}9\d{8}$/.test(digits);
}


export const cpfSchema = z
  .string()
  .transform((value) => value.replace(/\D/g, ""))
  .refine(isValidCPF, {
    message: "Invalid CPF",
  });

export const phoneSchema = z
  .string()
  .transform((value) => value.replace(/\D/g, ""))
  .refine((value) => /^\d{11}$/.test(value), {
    message: "Phone number must have DDD + 9 digits",
  });

// The sign-up form always submits a string, using "" for an untouched field.
// Treat that as "not provided" instead of failing the optional phone rule.
export const optionalPhoneSchema = z.preprocess(
  (value) => (typeof value === "string" && value.trim() === "" ? undefined : value),
  phoneSchema.optional(),
);

export const registerStudentSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "The name must have at least 2 characters.")
    .max(100),

  // Better Auth stores emails lowercased; normalize here so duplicate checks
  // and the stored value agree.
  email: z.preprocess(
    (value) => (typeof value === "string" ? value.trim().toLowerCase() : value),
    z.email(),
  ),

  password: z
    .string()
    .min(8, "Password must have at least 8 characters."),

  cpf: cpfSchema,

  phone: optionalPhoneSchema,
});

export type RegisterStudentInput = z.infer<typeof registerStudentSchema>;