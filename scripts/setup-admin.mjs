import { mkdir, writeFile } from 'node:fs/promises';
import { randomBytes } from 'node:crypto';
import { eq } from 'drizzle-orm';
import { createDatabase, staffUsers } from '@maro/database';
import { hashPassword } from '@maro/backend';

if (process.env.NODE_ENV === 'production')
  throw new Error('Local credential setup is disabled in production.');
if (!process.env.DATABASE_URL) throw new Error('DATABASE_URL is required.');
const database = createDatabase(process.env.DATABASE_URL);
try {
  const [existing] = await database.db
    .select()
    .from(staffUsers)
    .where(eq(staffUsers.username, 'owner'));
  if (existing) console.log('Owner account already exists. Credentials were not changed.');
  else {
    const password = randomBytes(18).toString('base64url');
    await mkdir(new URL('../.local/', import.meta.url), { recursive: true });
    await writeFile(
      new URL('../.local/admin-access.txt', import.meta.url),
      `MARO local administration\nURL: http://localhost:3100/admin\nUsername: owner\nPassword: ${password}\n\nKeep this file private. It is excluded from Git.\n`,
      { flag: 'wx', mode: 0o600 },
    );
    await database.db
      .insert(staffUsers)
      .values({ username: 'owner', passwordHash: await hashPassword(password) });
    console.log(
      'Local owner account created. Credentials are in .local/admin-access.txt (not printed).',
    );
  }
} finally {
  await database.close();
}
