import { createConnection } from 'node:net';

async function checkPort(name: string, value: string | undefined, defaultPort: number) {
  if (!value) throw new Error(`${name} is required for integration tests.`);
  const url = new URL(value);
  await new Promise<void>((resolve, reject) => {
    const socket = createConnection({ host: url.hostname, port: Number(url.port || defaultPort) });
    socket.setTimeout(3000);
    socket.once('connect', () => {
      socket.destroy();
      resolve();
    });
    socket.once('timeout', () => {
      socket.destroy();
      reject(
        new Error(`${name} connection timed out. Start the local services with pnpm infra:up.`),
      );
    });
    socket.once('error', () => {
      socket.destroy();
      reject(new Error(`${name} is unreachable. Start the local services with pnpm infra:up.`));
    });
  });
}

export default async function setup() {
  await Promise.all([
    checkPort('DATABASE_URL', process.env.DATABASE_URL, 5432),
    checkPort('REDIS_URL', process.env.REDIS_URL, 6379),
  ]);
}
