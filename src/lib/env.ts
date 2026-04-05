import { z } from 'zod';

const envSchema = z.object({
  DATABASE_URL: z
    .string()
    .trim()
    .min(1, 'DATABASE_URL is required')
    .refine(
      (value) =>
        value.startsWith('postgres://') || value.startsWith('postgresql://'),
      'DATABASE_URL must start with postgres:// or postgresql://'
    ),
  ADMIN_USERNAME: z.string().trim().min(1, 'ADMIN_USERNAME is required'),
  ADMIN_PASSWORD: z
    .string()
    .trim()
    .min(12, 'ADMIN_PASSWORD must be at least 12 characters'),
  RESEND_API_KEY: z.string().trim().optional(),
  CLARITY_DATA_EXPORT_API_TOKEN: z.string().trim().optional(),
  META_CAPI_ACCESS_TOKEN: z.string().trim().optional(),
  META_CAPI_TEST_EVENT_CODE: z.string().trim().optional(),
});

export type ServerEnv = z.infer<typeof envSchema>;

let cachedEnv: ServerEnv | null = null;

function formatZodIssues(issues: z.ZodIssue[]): string {
  return issues
    .map((issue) => `${issue.path.join('.') || 'env'}: ${issue.message}`)
    .join('; ');
}

export function getServerEnv(): ServerEnv {
  if (cachedEnv) {
    return cachedEnv;
  }

  const parsed = envSchema.safeParse(process.env);
  if (!parsed.success) {
    const issues = formatZodIssues(parsed.error.issues);
    throw new Error(`Invalid server environment configuration: ${issues}`);
  }

  cachedEnv = parsed.data;
  return cachedEnv;
}
