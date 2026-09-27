import { createHash, randomBytes, scrypt, timingSafeEqual } from 'node:crypto';
import { promisify } from 'node:util';
import { and, eq, gt, lt } from 'drizzle-orm';
import { staffUsers, staffSessions, type Database } from '@maro/database';

const derive = promisify(scrypt);
const digest = (token: string) => createHash('sha256').update(token).digest('hex');
export async function hashPassword(password: string) {
  const salt = randomBytes(16).toString('hex');
  const hash = (await derive(password, salt, 64)) as Buffer;
  return `scrypt:${salt}:${hash.toString('hex')}`;
}
export function createStaffAuth(db: Database) {
  return {
    async login(username: string, password: string) {
      const [user] = await db
        .select()
        .from(staffUsers)
        .where(and(eq(staffUsers.username, username), eq(staffUsers.active, true)));
      const [, salt, expected] = (user?.passwordHash ?? 'scrypt:missing:').split(':');
      const actual = (await derive(password, salt ?? 'missing', 64)) as Buffer;
      const expectedBytes = Buffer.from(expected ?? '', 'hex');
      if (
        !user ||
        expectedBytes.length !== actual.length ||
        !timingSafeEqual(actual, expectedBytes)
      )
        return null;
      const token = randomBytes(32).toString('base64url');
      const expiresAt = new Date(Date.now() + 8 * 60 * 60 * 1000);
      await db.delete(staffSessions).where(lt(staffSessions.expiresAt, new Date()));
      await db
        .insert(staffSessions)
        .values({ tokenHash: digest(token), userId: user.id, expiresAt });
      return { token, expiresAt: expiresAt.toISOString() };
    },
    async authenticate(token: string) {
      if (!/^[\w-]{43}$/.test(token)) return null;
      const [row] = await db
        .select({ id: staffUsers.id, username: staffUsers.username })
        .from(staffSessions)
        .innerJoin(staffUsers, eq(staffUsers.id, staffSessions.userId))
        .where(
          and(
            eq(staffSessions.tokenHash, digest(token)),
            gt(staffSessions.expiresAt, new Date()),
            eq(staffUsers.active, true),
          ),
        );
      return row ?? null;
    },
    async logout(token: string) {
      await db.delete(staffSessions).where(eq(staffSessions.tokenHash, digest(token)));
    },
  };
}
export type StaffAuth = ReturnType<typeof createStaffAuth>;
