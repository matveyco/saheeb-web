/**
 * CSRF Protection - Origin validation
 * Validates that requests come from allowed origins
 */

// Allowed origins - add your production domain
const ALLOWED_ORIGINS = [
  'https://saheeb.com',
  'https://www.saheeb.com',
  // Development
  'http://localhost:3333',
  'http://127.0.0.1:3333',
];

/**
 * Validate request origin for CSRF protection
 * Returns true if the request origin is valid
 */
export function validateOrigin(request: Request): boolean {
  const origin = request.headers.get('origin');
  const referer = request.headers.get('referer');

  // If no origin header, check referer
  const requestOrigin = origin || (referer ? new URL(referer).origin : null);

  // Allow requests without origin in development (e.g., Postman, curl)
  if (!requestOrigin) {
    // In production, you might want to reject these
    // For now, allow for API testing flexibility
    return process.env.NODE_ENV === 'development';
  }

  return ALLOWED_ORIGINS.includes(requestOrigin);
}

/**
 * Create a CSRF validation error response
 */
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
