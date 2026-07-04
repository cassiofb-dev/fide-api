import { NextResponse } from 'next/server';
import { ValidationError, SyncThrottleError } from './errors';

export async function runApiHandler(handler: () => Promise<Response | NextResponse>) {
  try {
    return await handler();
  } catch (error: any) {
    if (error instanceof ValidationError) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    if (error instanceof SyncThrottleError) {
      return NextResponse.json({ error: error.message }, { status: 401 });
    }
    console.error('API Handler Error:', error);
    return NextResponse.json(
      { error: error.message || 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}
