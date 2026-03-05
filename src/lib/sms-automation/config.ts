import { z } from 'zod';

/**
 * Widget settings validation schema.
 * Used by the Settings UI to validate form inputs.
 */
export const settingsFormSchema = z.object({
  twilio: z.object({
    accountSid: z.string().min(1, 'Twilio Account SID is required'),
    authToken: z.string().min(1, 'Twilio Auth Token is required'),
    phoneNumber: z.string().min(10, 'Twilio phone number is required'),
  }),
  sendgrid: z.object({
    apiKey: z.string().min(1, 'SendGrid API key is required'),
    fromEmail: z
      .string()
      .email('Invalid from email address')
      .min(1, 'From email is required'),
    replyToEmail: z.string().email('Invalid reply-to email').optional(),
  }),
  slack: z
    .object({
      webhookUrl: z.string().url('Invalid Slack webhook URL').optional(),
    })
    .optional(),
  admin: z.object({
    password: z.string().min(8, 'Admin password must be at least 8 characters'),
  }),
  branding: z
    .object({
      companyName: z.string().min(1, 'Company name is required').optional(),
      primaryColor: z
        .string()
        .regex(/^#[0-9A-F]{6}$/i, 'Invalid color format')
        .default('#3b82f6'),
      logoUrl: z.string().url('Invalid logo URL').optional(),
    })
    .optional(),
});

export type SettingsFormData = z.infer<typeof settingsFormSchema>;

/**
 * Validate settings form data.
 * Returns parsed data or throws with descriptive errors.
 */
export function validateSettingsForm(data: unknown): SettingsFormData {
  try {
    return settingsFormSchema.parse(data);
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new Error(
        `Invalid settings: ${error.issues.map((e) => e.message).join(', ')}`
      );
    }
    throw error;
  }
}
