import { getCloudflareContext } from '@opennextjs/cloudflare';

export function getSyncPassword(): string | undefined {
  try {
    const context = getCloudflareContext();
    if (context && context.env) {
      const pw = (context.env as any).FIDE_API_SYNC_PASSWORD;
      if (pw) return pw;
    }
  } catch (error) {
    // Context might not be available in all environment scopes (e.g. CLI, certain scripts)
  }
  return process.env.FIDE_API_SYNC_PASSWORD;
}

export function verifySyncPassword(request: Request): boolean {
  const expectedPassword = getSyncPassword();
  if (!expectedPassword) {
    // If no password is set, we default to allowing the sync (helpful for local setups without configured env)
    return true;
  }

  const { searchParams } = new URL(request.url);
  const paramPassword = searchParams.get('password') || searchParams.get('syncPassword') || searchParams.get('key');
  if (paramPassword === expectedPassword) {
    return true;
  }

  const headerPassword = request.headers.get('x-sync-password');
  if (headerPassword === expectedPassword) {
    return true;
  }

  const authHeader = request.headers.get('authorization');
  if (authHeader) {
    if (authHeader.toLowerCase().startsWith('bearer ')) {
      const token = authHeader.substring(7).trim();
      if (token === expectedPassword) {
        return true;
      }
    }
    if (authHeader.trim() === expectedPassword) {
      return true;
    }
  }

  return false;
}
