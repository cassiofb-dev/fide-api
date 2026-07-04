import { db } from '../db';
import { topLists } from '../schema';

export class TopListRepository {
  async findByType(listType: string) {
    return db.query.topLists.findFirst({
      where: (topLists, { eq }) => eq(topLists.listType, listType),
    });
  }

  async upsert(listType: string, data: string, updatedAt: string) {
    const [saved] = await db.insert(topLists)
      .values({
        listType,
        data,
        updatedAt,
      })
      .onConflictDoUpdate({
        target: topLists.listType,
        set: {
          data,
          updatedAt,
        },
      })
      .returning();
    return saved;
  }
}

export const topListRepository = new TopListRepository();
