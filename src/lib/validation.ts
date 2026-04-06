import { z } from 'zod';

const localeSchema = z.enum(['ar', 'en']);
const waitlistUserTypeSchema = z.enum(['buyer', 'seller']);
const pageVariantSchema = z.enum(['organic_main', 'paid_lp', 'other']);
const funnelEventNameSchema = z.enum([
  'drive_page_view',
  'waitlist_view',
  'cta_click',
  'form_start',
  'form_submit_attempt',
  'validation_error',
  'waitlist_submit_success',
  'waitlist_submit_duplicate',
  'share_click',
  'privacy_click',
  'language_switch',
  'nav_exit',
]);

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

const optionalTrimmedString = (max: number) =>
  z
    .union([z.string().trim().min(1).max(max), z.literal(''), z.null()])
    .optional();

const funnelPayloadSchema = z.record(
  z.string(),
  z.union([z.string(), z.number(), z.boolean(), z.null()])
);

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
    email: emailSchema,
    phone: z.union([phoneSchema, z.literal('')]).optional(),
    userType: waitlistUserTypeSchema,
    consent: z.literal(true, {
      error: 'Consent is required',
    }),
    locale: localeSchema,
    utmSource: optionalTrimmedString(255),
    utmMedium: optionalTrimmedString(255),
    utmCampaign: optionalTrimmedString(255),
    utmContent: optionalTrimmedString(255),
    referrer: optionalTrimmedString(2048),
    landingPath: optionalTrimmedString(255),
    anonymousId: optionalTrimmedString(80),
    sessionId: optionalTrimmedString(80),
    pageVariant: pageVariantSchema.optional(),
    eventId: optionalTrimmedString(80),
    intentSource: optionalTrimmedString(120),
    consentTimestamp: consentTimestampSchema,
  })
  .transform((value) => ({
    name: value.name,
    email: value.email,
    phone: value.phone && value.phone.length > 0 ? value.phone : null,
    userType: value.userType,
    city: 'muscat',
    consent: value.consent,
    locale: value.locale,
    utmSource:
      value.utmSource && value.utmSource.length > 0 ? value.utmSource : null,
    utmMedium:
      value.utmMedium && value.utmMedium.length > 0 ? value.utmMedium : null,
    utmCampaign:
      value.utmCampaign && value.utmCampaign.length > 0
        ? value.utmCampaign
        : null,
    utmContent:
      value.utmContent && value.utmContent.length > 0
        ? value.utmContent
        : null,
    referrer:
      value.referrer && value.referrer.length > 0 ? value.referrer : null,
    landingPath:
      value.landingPath && value.landingPath.length > 0
        ? value.landingPath
        : null,
    anonymousId:
      value.anonymousId && value.anonymousId.length > 0
        ? value.anonymousId
        : null,
    sessionId:
      value.sessionId && value.sessionId.length > 0
        ? value.sessionId
        : null,
    pageVariant: value.pageVariant ?? null,
    eventId:
      value.eventId && value.eventId.length > 0 ? value.eventId : null,
    intentSource:
      value.intentSource && value.intentSource.length > 0
        ? value.intentSource
        : null,
    consentTimestamp: value.consentTimestamp,
  }));

export const funnelEventSchema = z
  .object({
    eventName: funnelEventNameSchema,
    path: z.string().trim().min(1, 'path is required').max(255),
    pageGroup: optionalTrimmedString(80),
    project: optionalTrimmedString(80),
    siteLocale: localeSchema,
    userType: waitlistUserTypeSchema.nullable().optional(),
    ctaLocation: optionalTrimmedString(120),
    destinationPath: optionalTrimmedString(255),
    formName: optionalTrimmedString(120),
    errorStage: optionalTrimmedString(80),
    utmSource: optionalTrimmedString(255),
    utmMedium: optionalTrimmedString(255),
    utmCampaign: optionalTrimmedString(255),
    utmContent: optionalTrimmedString(255),
    referrer: optionalTrimmedString(2048),
    landingPath: optionalTrimmedString(255),
    anonymousId: optionalTrimmedString(80),
    sessionId: optionalTrimmedString(80),
    pageVariant: pageVariantSchema.optional(),
    eventId: optionalTrimmedString(80),
    intentSource: optionalTrimmedString(120),
    payload: funnelPayloadSchema.optional(),
  })
  .transform((value) => ({
    eventName: value.eventName,
    path: value.path,
    pageGroup:
      value.pageGroup && value.pageGroup.length > 0 ? value.pageGroup : null,
    project: value.project && value.project.length > 0 ? value.project : null,
    siteLocale: value.siteLocale,
    userType: value.userType ?? null,
    ctaLocation:
      value.ctaLocation && value.ctaLocation.length > 0
        ? value.ctaLocation
        : null,
    destinationPath:
      value.destinationPath && value.destinationPath.length > 0
        ? value.destinationPath
        : null,
    formName:
      value.formName && value.formName.length > 0 ? value.formName : null,
    errorStage:
      value.errorStage && value.errorStage.length > 0
        ? value.errorStage
        : null,
    utmSource:
      value.utmSource && value.utmSource.length > 0 ? value.utmSource : null,
    utmMedium:
      value.utmMedium && value.utmMedium.length > 0 ? value.utmMedium : null,
    utmCampaign:
      value.utmCampaign && value.utmCampaign.length > 0
        ? value.utmCampaign
        : null,
    utmContent:
      value.utmContent && value.utmContent.length > 0
        ? value.utmContent
        : null,
    referrer:
      value.referrer && value.referrer.length > 0 ? value.referrer : null,
    landingPath:
      value.landingPath && value.landingPath.length > 0
        ? value.landingPath
        : null,
    anonymousId:
      value.anonymousId && value.anonymousId.length > 0
        ? value.anonymousId
        : null,
    sessionId:
      value.sessionId && value.sessionId.length > 0
        ? value.sessionId
        : null,
    pageVariant: value.pageVariant ?? null,
    eventId:
      value.eventId && value.eventId.length > 0 ? value.eventId : null,
    intentSource:
      value.intentSource && value.intentSource.length > 0
        ? value.intentSource
        : null,
    payload: value.payload ?? {},
  }));

export const funnelEventBatchSchema = z.array(funnelEventSchema).min(1).max(20);

export type ContactSubmissionInput = z.infer<typeof contactSubmissionSchema>;
export type WaitlistSubmissionInput = z.infer<typeof waitlistSubmissionSchema>;
export type FunnelEventInput = z.infer<typeof funnelEventSchema>;

export function getFirstValidationError(error: z.ZodError): string {
  return error.issues[0]?.message ?? 'Invalid request payload';
}
