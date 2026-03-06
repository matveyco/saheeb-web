const DEFAULT_ALLOWED_ORIGINS = [
  'https://saheeb.com',
  'https://www.saheeb.com',
  'http://localhost:3333',
  'http://127.0.0.1:3333',
];

interface ParsedOrigin {
  origin: string | null;
  invalid: boolean;
  present: boolean;
}

function parseOrigin(value: string | null): ParsedOrigin {
  if (!value) {
    return {
      origin: null,
      invalid: false,
      present: false,
    };
  }

  try {
    return {
      origin: new URL(value).origin,
      invalid: false,
      present: true,
    };
  } catch {
    return {
      origin: null,
      invalid: true,
      present: true,
    };
  }
}

function getAllowedOrigins(): Set<string> {
  const envOrigins = process.env.ALLOWED_ORIGINS?.split(',')
    .map((entry) => entry.trim())
    .filter(Boolean);

  return new Set(envOrigins?.length ? envOrigins : DEFAULT_ALLOWED_ORIGINS);
}

export function validateOrigin(request: Request): boolean {
  const directOrigin = parseOrigin(request.headers.get('origin'));
  const refererOrigin = parseOrigin(request.headers.get('referer'));

  // Reject malformed origin/referer values deterministically.
  if (directOrigin.invalid || refererOrigin.invalid) {
    return false;
  }

  const requestOrigin = directOrigin.origin || refererOrigin.origin;

  if (!requestOrigin) {
    // Local non-browser calls in development may not send origin headers.
    return process.env.NODE_ENV === 'development' && !directOrigin.present && !refererOrigin.present;
  }

  return getAllowedOrigins().has(requestOrigin);
}

export function csrfErrorResponse() {
  return new Response(
    JSON.stringify({ error: 'Invalid request origin' }),
    {
      status: 403,
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );
}
