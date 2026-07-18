import { topListRepository } from '../repositories/top-list.repository';
import { scrapeTopList } from '../scraper';
import { verifySyncThrottle } from '../auth';
import { ListType, DataSource, ResourceType } from '../enums';
import { isEmpty } from '../utils';

export class TopListService {
  async getTopList(listTypeStr: string | null, forceUpdate: boolean, request: Request, retries?: number) {
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
    let players: any = [];
    try {
      players = await scrapeTopList(listType, retries);
    } catch (error) {
      if (cached) {
        return {
          source: DataSource.CACHE,
          data: JSON.parse(cached.data),
          updatedAt: cached.updatedAt,
        };
      }
      throw error;
    }

    if (isEmpty(players) && cached) {
      return {
        source: DataSource.CACHE,
        data: JSON.parse(cached.data),
        updatedAt: cached.updatedAt,
      };
    }

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
