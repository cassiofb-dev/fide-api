export class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ValidationError';
  }
}

export class SyncThrottleError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'SyncThrottleError';
  }
}

export class FideConnectionError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'FideConnectionError';
  }
}

export class PlayerNotFoundError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'PlayerNotFoundError';
  }
}

export const ERROR_MESSAGES = {
  DB_BINDING_MISSING: "D1 Database binding ('fide-db') is not available in the Cloudflare context or process.env. Make sure you have configured the D1 binding correctly in wrangler.jsonc.",
  MISSING_FIDE_ID: "Missing player FIDE ID",
  INVALID_FIDE_ID: "Invalid player FIDE ID",
  INVALID_RETRIES: "Invalid retries parameter",
  PLAYER_NOT_FOUND: (fideId: number) => `Player with ID ${fideId} not found on FIDE.`,
  SYNC_THROTTLE: (displayResourceName: string) => `Syncing ${displayResourceName} again within 10 minutes requires a valid sync password.`,
  SAVE_PLAYER_FAILED: "Failed to retrieve player after saving",
  FIDE_CONNECTION_GENERIC: "Failed to fetch from FIDE",
  FIDE_TOP_LIST_FAILED: (statusText: string) => `Failed to fetch top list from FIDE: ${statusText}`,
  FIDE_PROFILE_FAILED: (statusText: string) => `Failed to fetch player profile from FIDE: ${statusText}`,
  FIDE_HISTORY_FAILED: (statusText: string) => `Failed to fetch rating history from FIDE: ${statusText}`,
  FIDE_HISTORY_INVALID: "Invalid rating history data format from FIDE",
  FIDE_STATS_FAILED: (statusText: string) => `Failed to fetch stats from FIDE: ${statusText}`,
  FIDE_STATS_INVALID: "Invalid stats data format from FIDE",
  
  // UI Messages
  UI_FIDE_CONNECTION_ERROR: "Connection error: Unable to reach FIDE after several retries.",
  UI_PLAYER_NOT_FOUND: "Player profile not found on FIDE.",
};



