import { z } from "zod";

const PHONE_E164_REGEX = /^\+[1-9]\d{1,14}$/;

export const leadFormSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name is too long"),
  email: z
    .string()
    .email("Please enter a valid email address"),
  phone: z
    .string()
    .regex(PHONE_E164_REGEX, "Phone must be in E.164 format (e.g. +14155551234)"),
  message: z
    .string()
    .max(1000, "Message is too long")
    .optional(),
  projectInterest: z
    .string()
    .max(100)
    .optional(),
  smsConsent: z.boolean(),
  emailConsent: z.boolean(),
  source: z
    .string()
    .max(50)
    .optional(),
});

export type LeadFormData = z.infer<typeof leadFormSchema>;

export function validateLeadForm(data: unknown) {
  return leadFormSchema.safeParse(data);
}
