import { getServerEnv } from '@/lib/env';

function shouldSkipValidation(): boolean {
  return process.env.NEXT_PHASE === 'phase-production-build';
}

export async function register() {
  if (shouldSkipValidation()) {
    return;
  }

  getServerEnv();
}
