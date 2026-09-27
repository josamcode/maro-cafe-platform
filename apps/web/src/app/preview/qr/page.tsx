import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { Button, Container, Grid, Heading, Inline, Stack, Text } from '@maro/ui';
import { menuBranches } from '../../../features/menu/catalog';
import { branchUrl, qrOrigin } from '../../../features/inside/qr';
import './qr.css';

export const metadata: Metadata = {
  title: 'Branch QR preview',
  robots: { index: false, follow: false },
};
export const dynamic = 'force-dynamic';

export default function QrPreview() {
  const origin = qrOrigin();
  const local = ['localhost', '127.0.0.1', '[::1]'].includes(new URL(origin).hostname);
  return (
    <main className="qr-preview" lang="en" dir="ltr">
      <Container>
        <Stack gap="lg">
          <Text tone="eyebrow">MARO · PRIVATE DEMO</Text>
          <Heading as="h1" size="section">
            From the table to the menu.
          </Heading>
          <Text>
            Open a branch link or download its QR. These are preview links, not verified visits or
            submitted orders.
          </Text>
          <Text role="status" className="qr-origin-note">
            {local
              ? 'These QR codes point to localhost and work on this computer only. Before scanning from a phone, set WEB_ORIGIN to a reachable preview URL or LAN address, restart the app and download fresh codes.'
              : `QR destination: ${origin}. Confirm this address is reachable from your phone before sharing or printing.`}
          </Text>
          <Grid>
            {Object.entries(menuBranches).map(([slug, name]) => (
              <article className="qr-branch" key={slug}>
                <Heading as="h2" size="title">
                  {name.en}
                </Heading>
                <Image
                  src={`/preview/qr/${slug}`}
                  alt={`${name.en} menu QR code`}
                  width={256}
                  height={256}
                  loading="eager"
                  unoptimized
                />
                <Text className="qr-destination">{branchUrl(slug)}</Text>
                <Inline>
                  <Button asChild>
                    <Link href={`/in/${slug}`}>Open menu</Link>
                  </Button>
                  <Button asChild variant="outline">
                    <a href={`/preview/qr/${slug}?download=1`} download>
                      Download SVG
                    </a>
                  </Button>
                </Inline>
              </article>
            ))}
          </Grid>
          <Stack gap="sm">
            <Heading as="h2" size="title">
              Walk through the experience
            </Heading>
            <Text>
              Start at the website, explore the menu and locations, then open a branch QR. Add a
              drink, adjust your picks and show the cashier view. The same browser keeps your picks
              between the two experiences.
            </Text>
            <Inline>
              <Button asChild variant="outline">
                <Link href="/">Open MARO website</Link>
              </Button>
            </Inline>
            <Text tone="muted">
              Before launch: confirm prices, product photography and branch details with MARO, agree
              how staff receive orders, and choose the final domain. Customer accounts, rewards,
              payments and POS integration are later stages.
            </Text>
          </Stack>
        </Stack>
      </Container>
    </main>
  );
}
