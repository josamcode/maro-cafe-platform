import { OfferStrip } from '../offers/offer-strip';
import Link from 'next/link';
import { BranchList } from '../branches/branch-list';
import { AtMaroPrompt } from '../branches/at-maro-prompt';
import Image from 'next/image';
import {
  Button,
  Container,
  Heading,
  HeroMedia,
  Inline,
  Surface,
  Section,
  Stack,
  Text,
} from '@maro/ui';
import type { Locale, Theme } from '../../lib/locale';
import { FeaturedProducts } from '../curation/featured-products';
import { homeMessages } from './messages';
import { MenuLink } from '../menu/menu-link';
import { SiteHeader, SiteFooter } from '../site/site-shell';
import './home.css';

export function HomePage({ locale, theme }: { locale: Locale; theme: Theme }) {
  const t = homeMessages[locale];
  return (
    <>
      <SiteHeader locale={locale} theme={theme} />
      <main id="main-content">
        <Container>
          <section className="home-hero" aria-labelledby="home-title">
            <Stack gap="lg" className="home-hero-copy">
              <Stack>
                <Text tone="eyebrow" lang="en">
                  {t.eyebrow}
                </Text>
                <Heading as="h1" size="display" id="home-title" className="home-title">
                  {t.title}
                </Heading>
                <Text tone="muted">{t.intro}</Text>
              </Stack>
              <Inline className="home-hero-actions">
                <MenuLink locale={locale} />
                <Button asChild variant="outline">
                  <a href="#branches">{t.visit}</a>
                </Button>
              </Inline>
            </Stack>
            <HeroMedia
              main={
                <Image
                  src="/design-system/maro-mood.jpg"
                  alt={t.photoMood}
                  width={4096}
                  height={2731}
                  sizes="(max-width: 768px) 85vw, 38vw"
                  preload
                />
              }
              detail={
                <Image
                  src="/home/iced-coffee.jpg"
                  alt={t.photoDrinks}
                  width={960}
                  height={1280}
                  sizes="(max-width: 768px) 35vw, 16vw"
                />
              }
              caption={t.caption}
            />
          </section>
        </Container>
        <Container>
          <FeaturedProducts locale={locale} />
          <OfferStrip locale={locale} />
        </Container>
        <section id="at-maro" className="home-atmosphere">
          <Container>
            <div className="home-atmosphere-layout">
              <div className="home-atmosphere-image">
                <Image
                  src="/design-system/maro-mood.jpg"
                  alt={t.photoMood}
                  width={4096}
                  height={2731}
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
              <Stack>
                <Text tone="eyebrow">{t.atmosphereEyebrow}</Text>
                <Heading className="home-title">{t.atmosphereTitle}</Heading>
                <Text>{t.atmosphereText}</Text>
                <Inline>
                  <Button asChild variant="outline">
                    <a href="#branches">{t.visit}</a>
                  </Button>
                </Inline>
              </Stack>
            </div>
          </Container>
        </section>
        <Container>
          <Section id="branches">
            <Surface tone="dark" className="home-locations">
              <Stack className="home-locations-intro">
                <Text tone="eyebrow">{t.branchCount}</Text>
                <Heading>{t.branchTitle}</Heading>
                <Text>{t.branchIntro}</Text>
                <Button asChild variant="outline">
                  <Link href="/branches">{t.branches}</Link>
                </Button>
                <AtMaroPrompt locale={locale} />
              </Stack>
              <BranchList locale={locale} compact />
            </Surface>
          </Section>
        </Container>
      </main>
      <SiteFooter locale={locale} />
    </>
  );
}
