import { NextResponse } from 'next/server';
import { runApiHandler } from '@/lib/api-helper';
import { topListService } from '@/lib/services/top-list.service';

export async function GET(request: Request) {
  return runApiHandler(async () => {
    const { searchParams } = new URL(request.url);
    const listType = searchParams.get('list');
    const forceUpdate = searchParams.get('forceUpdate') === 'true';

    const result = await topListService.getTopList(listType, forceUpdate, request);
    return NextResponse.json(result);
  });
}
