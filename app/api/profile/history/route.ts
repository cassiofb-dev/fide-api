import { NextResponse } from 'next/server';
import { runApiHandler, parseRetries } from '@/lib/api-helper';
import { playerService } from '@/lib/services/player.service';

export async function GET(request: Request) {
  return runApiHandler(async () => {
    const { searchParams } = new URL(request.url);
    const idStr = searchParams.get('id');
    const forceUpdate = searchParams.get('forceUpdate') === 'true';
    const retries = parseRetries(request);

    const result = await playerService.getPlayerHistory(idStr, forceUpdate, request, retries);
    return NextResponse.json(result);
  });
}
