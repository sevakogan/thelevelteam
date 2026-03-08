/**
 * Company Billing — Zod validation schemas
 * Follows pattern from src/lib/marketing/validation.ts
 */

import { z } from "zod";

export const createCustomerSchema = z.object({
  company_name: z
    .string()
    .min(1, "Company name is required")
    .max(200, "Company name too long"),
  description: z.string().max(2000).default(""),
  recurring: z.boolean().default(false),
  amount: z.number().min(0, "Amount must be positive"),
  phone: z.string().max(30).default(""),
  email: z
    .string()
    .max(200)
    .default("")
    .refine(
      (val) => val === "" || z.string().email().safeParse(val).success,
      { message: "Invalid email format" }
    ),
  contract_enabled: z.boolean().default(false),
  contract_content: z.string().max(10000).default(""),
  job_id: z.string().uuid().nullable().default(null),
  tags: z.array(z.string().max(50)).max(20).default([]),
  due_date: z.string().nullable().default(null),
  notes: z.string().max(5000).default(""),
});

export type CreateCustomerFormData = z.infer<typeof createCustomerSchema>;

export const updateCustomerSchema = z.object({
  company_name: z.string().min(1).max(200).optional(),
  description: z.string().max(2000).optional(),
  recurring: z.boolean().optional(),
  amount: z.number().min(0).optional(),
  phone: z.string().max(30).optional(),
  email: z
    .string()
    .max(200)
    .optional()
    .refine(
      (val) => val === undefined || val === "" || z.string().email().safeParse(val).success,
      { message: "Invalid email format" }
    ),
  status: z.enum(["lead", "in_process", "done", "lost"]).optional(),
  contract_enabled: z.boolean().optional(),
  contract_content: z.string().max(10000).optional(),
  contract_signed: z.boolean().optional(),
  contract_signed_by: z.string().max(200).optional(),
  contract_signed_date: z.string().optional(),
  job_id: z.string().uuid().nullable().optional(),
  tags: z.array(z.string().max(50)).max(20).optional(),
  due_date: z.string().nullable().optional(),
  notes: z.string().max(5000).optional(),
});

export type UpdateCustomerFormData = z.infer<typeof updateCustomerSchema>;

export const billingSettingsSchema = z.object({
  company_name: z.string().min(1).max(200).default("TheLevelTeam"),
  company_tagline: z.string().max(500).default(""),
  company_email: z.string().max(200).default(""),
  company_phone: z.string().max(30).default(""),
  company_address: z.string().max(500).default(""),
  logo_url: z.string().max(500).default(""),
});

export type BillingSettingsFormData = z.infer<typeof billingSettingsSchema>;

export function validateCreateCustomer(data: unknown) {
  return createCustomerSchema.safeParse(data);
}

export function validateUpdateCustomer(data: unknown) {
  return updateCustomerSchema.safeParse(data);
}

export function validateBillingSettings(data: unknown) {
  return billingSettingsSchema.safeParse(data);
}

// ─── Jobs ──────────────────────────────────────

export const createJobSchema = z.object({
  name: z.string().min(1, "Job name is required").max(200, "Job name too long"),
  description: z.string().max(1000).default(""),
});

export type CreateJobFormData = z.infer<typeof createJobSchema>;

export function validateCreateJob(data: unknown) {
  return createJobSchema.safeParse(data);
}
