import { NextResponse } from 'next/server';
import { runApiHandler } from '@/lib/api-helper';
import { playerService } from '@/lib/services/player.service';

export async function GET(request: Request) {
  return runApiHandler(async () => {
    const { searchParams } = new URL(request.url);
    const idStr = searchParams.get('id');
    const forceUpdate = searchParams.get('forceUpdate') === 'true';
    const full = searchParams.get('full') === 'true';

    const result = await playerService.getPlayerProfile(idStr, forceUpdate, full, request);
    return NextResponse.json(result);
  });
}
