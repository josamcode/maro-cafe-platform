import { and, asc, eq } from 'drizzle-orm';
import { branches, type Database } from '@maro/database';
import type { Branch } from '@maro/contracts';

const publicFields = {
  id: branches.id,
  slug: branches.slug,
  name: branches.name,
  address: branches.address,
  timezone: branches.timezone,
};
export interface BranchRepository {
  list(): Promise<Branch[]>;
  findBySlug(slug: string): Promise<Branch | undefined>;
}
export function createBranchRepository(db: Database): BranchRepository {
  return {
    list: () =>
      db
        .select(publicFields)
        .from(branches)
        .where(eq(branches.active, true))
        .orderBy(asc(branches.name)),
    async findBySlug(slug) {
      const [branch] = await db
        .select(publicFields)
        .from(branches)
        .where(and(eq(branches.slug, slug), eq(branches.active, true)))
        .limit(1);
      return branch;
    },
  };
}
