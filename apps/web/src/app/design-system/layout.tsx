import Link from 'next/link';
import { Button, Container, Inline } from '@maro/ui';
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div lang="en" dir="ltr">
      <header className="py-6">
        <Container>
          <Inline className="justify-between">
            <Button asChild variant="quiet">
              <Link href="/">MARO / Home</Link>
            </Button>
            <span>Design system</span>
          </Inline>
        </Container>
      </header>
      {children}
    </div>
  );
}
