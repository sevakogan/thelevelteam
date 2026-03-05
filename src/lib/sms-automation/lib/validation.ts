import { z } from 'zod';

/**
 * Validation schema for lead form submission
 */
export const leadFormSchema = z.object({
  name: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(255, 'Name must be less than 255 characters'),
  email: z
    .string()
    .email('Please enter a valid email address')
    .max(255, 'Email must be less than 255 characters'),
  phone: z
    .string()
    .min(10, 'Phone number must be at least 10 digits')
    .max(20, 'Phone number must be less than 20 characters')
    .regex(/^\+?[\d\s\-\(\)]+$/, 'Phone number contains invalid characters'),
  message: z
    .string()
    .max(5000, 'Message must be less than 5000 characters')
    .optional(),
  projectInterest: z
    .string()
    .max(255, 'Project interest must be less than 255 characters')
    .optional(),
  source: z
    .string()
    .max(255, 'Source must be less than 255 characters')
    .optional(),
  smsConsent: z.boolean().default(true),
  emailConsent: z.boolean().default(true),
});

export type LeadFormData = z.infer<typeof leadFormSchema>;

/**
 * Validation schema for drip message
 */
export const dripMessageSchema = z.object({
  delayDays: z
    .number()
    .int()
    .min(0, 'Delay must be 0 or greater')
    .max(365, 'Delay must be 365 days or less'),
  subject: z
    .string()
    .min(1, 'Subject is required')
    .max(255, 'Subject must be less than 255 characters')
    .optional(),
  body: z
    .string()
    .min(1, 'Message body is required')
    .max(10000, 'Message body must be less than 10000 characters'),
  type: z.enum(['sms', 'email']),
  variables: z.record(z.string(), z.string()).optional(),
});

export type DripMessage = z.infer<typeof dripMessageSchema>;

/**
 * Validation schema for drip campaign
 */
export const campaignSchema = z.object({
  name: z
    .string()
    .min(1, 'Campaign name is required')
    .max(255, 'Campaign name must be less than 255 characters'),
  channel: z.enum(['sms', 'email', 'both']),
  messages: z.array(dripMessageSchema),
  isActive: z.boolean().default(true),
});

export type CampaignData = z.infer<typeof campaignSchema>;

/**
 * Validation schema for SMS send request
 */
export const sendSmsSchema = z.object({
  leadId: z.string().uuid().optional(),
  phone: z.string().min(10),
  body: z.string().min(1).max(1600, 'SMS must be 1600 characters or less'),
});

export type SendSmsData = z.infer<typeof sendSmsSchema>;

/**
 * Validation schema for email send request
 */
export const sendEmailSchema = z.object({
  leadId: z.string().uuid().optional(),
  email: z.string().email(),
  subject: z.string().min(1).max(255),
  body: z.string().min(1),
  html: z.string().optional(),
});

export type SendEmailData = z.infer<typeof sendEmailSchema>;

/**
 * Validation schema for lead status update
 */
export const updateLeadSchema = z.object({
  name: z.string().min(2).max(255).optional(),
  email: z.string().email().optional(),
  phone: z.string().min(10).optional(),
  status: z
    .enum([
      'incoming',
      'followed_up',
      'qualified',
      'proposal_sent',
      'negotiation',
      'won',
      'lost',
      'unsubscribed',
    ])
    .optional(),
  smsConsent: z.boolean().optional(),
  emailConsent: z.boolean().optional(),
  projectInterest: z.string().max(255).optional(),
});

export type UpdateLeadData = z.infer<typeof updateLeadSchema>;

/**
 * Validation helper to safely parse and handle validation errors
 */
export function validateData<T>(schema: z.ZodSchema, data: unknown): { valid: true; data: T } | { valid: false; errors: Record<string, string> } {
  try {
    const parsed = schema.parse(data);
    return { valid: true, data: parsed as T };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors: Record<string, string> = {};
      error.issues.forEach((err) => {
        const path = err.path.join('.');
        errors[path] = err.message;
      });
      return { valid: false, errors };
    }
    return {
      valid: false,
      errors: { general: 'Validation failed' },
    };
  }
}
