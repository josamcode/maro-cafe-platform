import { createDatabase } from '@maro/database';
import { hashPassword } from '@maro/backend';

const username = process.env.MARO_ADMIN_USERNAME?.trim();
const password = process.env.MARO_ADMIN_PASSWORD;
if (!process.env.DATABASE_URL) throw new Error('DATABASE_URL is required.');
if (!username || !/^[a-zA-Z0-9._-]{3,80}$/.test(username))
  throw new Error(
    'MARO_ADMIN_USERNAME must contain 3–80 letters, digits, dots, underscores or dashes.',
  );
if (!password || password.length < 16 || password.length > 128)
  throw new Error('MARO_ADMIN_PASSWORD must contain 16–128 characters.');

const database = createDatabase(process.env.DATABASE_URL);
try {
  const result = await database.pool.query(
    'INSERT INTO staff_users (username, password_hash) VALUES ($1, $2) ON CONFLICT (username) DO NOTHING RETURNING id',
    [username, await hashPassword(password)],
  );
  console.log(
    result.rowCount
      ? 'Staff account created.'
      : 'Staff account already exists; credentials unchanged.',
  );
} finally {
  await database.close();
}
