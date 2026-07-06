import { NextResponse } from 'next/server';
import { ValidationError, SyncThrottleError, FideConnectionError, PlayerNotFoundError } from './errors';

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
    if (error instanceof FideConnectionError) {
      return NextResponse.json({ error: 'FIDE_CONNECTION_ERROR', message: error.message }, { status: 502 });
    }
    if (error instanceof PlayerNotFoundError) {
      return NextResponse.json({ error: 'PLAYER_NOT_FOUND', message: error.message }, { status: 404 });
    }
    console.error('API Handler Error:', error);
    return NextResponse.json(
      { error: error.message || 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}
