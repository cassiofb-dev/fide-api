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

import { ValidationError, SyncThrottleError, ERROR_MESSAGES } from './errors';
import { ResourceType } from './enums';

export function parseAndValidateFideId(idStr: string | null): number {
  if (!idStr) {
    throw new ValidationError(ERROR_MESSAGES.MISSING_FIDE_ID);
  }

  const fideId = parseInt(idStr, 10);
  if (isNaN(fideId)) {
    throw new ValidationError(ERROR_MESSAGES.INVALID_FIDE_ID);
  }

  return fideId;
}

export function verifySyncThrottle(updatedAtStr: string, request: Request, resourceName: ResourceType): void {
  const lastUpdated = new Date(updatedAtStr).getTime();
  const isRecent = Date.now() - lastUpdated < 10 * 60 * 1000;
  if (isRecent && !verifySyncPassword(request)) {
    const displayResourceName = resourceName === ResourceType.STATS ? 'these stats' : `this ${resourceName}`;
    throw new SyncThrottleError(ERROR_MESSAGES.SYNC_THROTTLE(displayResourceName));
  }
}

