import { z } from 'zod';

const localeSchema = z.enum(['ar', 'en']);

const phoneRegex = /^\+?[0-9\s\-()]{8,20}$/;

const consentTimestampSchema = z
  .string()
  .trim()
  .min(1, 'consentTimestamp is required')
  .refine(
    (value) => !Number.isNaN(Date.parse(value)),
    'consentTimestamp must be a valid ISO date string'
  )
  .transform((value) => new Date(value));

const nameSchema = z
  .string()
  .trim()
  .min(2, 'Name must be at least 2 characters')
  .max(120, 'Name must be at most 120 characters');

const emailSchema = z
  .string()
  .trim()
  .email('Invalid email format')
  .max(255, 'Email must be at most 255 characters');

const phoneSchema = z
  .string()
  .trim()
  .regex(phoneRegex, 'Invalid phone format')
  .max(50, 'Phone must be at most 50 characters');

const subjectSchema = z
  .string()
  .trim()
  .min(2, 'Subject must be at least 2 characters')
  .max(150, 'Subject must be at most 150 characters');

const messageSchema = z
  .string()
  .trim()
  .min(10, 'Message must be at least 10 characters')
  .max(5000, 'Message must be at most 5000 characters');

export const contactSubmissionSchema = z
  .object({
    name: nameSchema,
    email: emailSchema,
    phone: z.union([phoneSchema, z.literal('')]).optional(),
    subject: z.union([subjectSchema, z.literal('')]).optional(),
    message: messageSchema,
    consent: z.literal(true, {
      error: 'Consent is required',
    }),
    locale: localeSchema,
    consentTimestamp: consentTimestampSchema,
  })
  .transform((value) => ({
    name: value.name,
    email: value.email,
    phone: value.phone && value.phone.length > 0 ? value.phone : null,
    subject: value.subject && value.subject.length > 0 ? value.subject : null,
    message: value.message,
    consent: value.consent,
    locale: value.locale,
    consentTimestamp: value.consentTimestamp,
  }));

export const waitlistSubmissionSchema = z
  .object({
    name: nameSchema,
    phone: phoneSchema,
    email: z.union([emailSchema, z.literal('')]).optional(),
    userType: z.enum(['buyer', 'seller', 'dealer']),
    city: z
      .string()
      .trim()
      .min(2, 'City is required')
      .max(100, 'City must be at most 100 characters'),
    consent: z.literal(true, {
      error: 'Consent is required',
    }),
    locale: localeSchema,
    consentTimestamp: consentTimestampSchema,
  })
  .transform((value) => ({
    name: value.name,
    phone: value.phone,
    email: value.email && value.email.length > 0 ? value.email : null,
    userType: value.userType,
    city: value.city,
    consent: value.consent,
    locale: value.locale,
    consentTimestamp: value.consentTimestamp,
  }));

export type ContactSubmissionInput = z.infer<typeof contactSubmissionSchema>;
export type WaitlistSubmissionInput = z.infer<typeof waitlistSubmissionSchema>;

export function getFirstValidationError(error: z.ZodError): string {
  return error.issues[0]?.message ?? 'Invalid request payload';
}
