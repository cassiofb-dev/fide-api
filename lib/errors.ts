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
