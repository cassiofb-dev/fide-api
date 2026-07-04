import { topListRepository } from '../repositories/top-list.repository';
import { scrapeTopList } from '../scraper';
import { verifySyncThrottle } from '../auth';
import { ListType, DataSource, ResourceType } from '../enums';

export class TopListService {
  async getTopList(listTypeStr: string | null, forceUpdate: boolean, request: Request) {
    const listType = listTypeStr || ListType.OPEN;

    // 1. Fetch cached list
    const cached = await topListRepository.findByType(listType);

    if (cached) {
      if (forceUpdate) {
        verifySyncThrottle(cached.updatedAt, request, ResourceType.LIST);
      } else {
        return {
          source: DataSource.CACHE,
          data: JSON.parse(cached.data),
          updatedAt: cached.updatedAt,
        };
      }
    }

    // 2. Scrape from FIDE
    const players = await scrapeTopList(listType);

    // 3. Save to database
    const now = new Date().toISOString();
    const saved = await topListRepository.upsert(listType, JSON.stringify(players), now);

    return {
      source: DataSource.SCRAPE,
      data: JSON.parse(saved.data),
      updatedAt: saved.updatedAt,
    };
  }
}

export const topListService = new TopListService();
