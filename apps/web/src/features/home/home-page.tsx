import Image from 'next/image';
import {
  Button,
  Container,
  Grid,
  Heading,
  HeroMedia,
  Inline,
  CollectionCard,
  StartingPrice,
  SummaryRow,
  Surface,
  DirectionArrow,
  Section,
  Stack,
  Text,
} from '@maro/ui';
import type { Locale, Theme } from '../../lib/locale';
import menu from '../../content/menu.snapshot.json';
import { homeMessages } from './messages';
import { MenuLink } from '../menu/menu-link';
import { SiteHeader, SiteFooter } from '../site/site-shell';
import './home.css';

export function HomePage({ locale, theme }: { locale: Locale; theme: Theme }) {
  const t = homeMessages[locale];
  const collections = [
    {
      id: 'hot',
      name: t.hot,
      description: t.hotDescription,
      image: '/home/coffee-moment.jpg',
      alt: t.photoHot,
    },
    {
      id: 'iced',
      name: t.iced,
      description: t.icedDescription,
      image: '/home/iced-coffee.jpg',
      alt: t.photoDrinks,
    },
    {
      id: 'milkshake',
      name: t.shakes,
      description: t.shakesDescription,
      image: '/home/milkshake.jpg',
      alt: t.photoShake,
    },
  ];
  const branches = [
    { name: t.faisal, area: t.faisalArea, url: 'https://maps.app.goo.gl/ZaSq4xeTkhSkxjcN6' },
    { name: t.sahl, area: t.sahlArea, url: 'https://maps.app.goo.gl/W1ksi3C4dRJuXTLk8' },
    { name: t.haram, area: t.haramArea, url: 'https://maps.app.goo.gl/7dMZ25kGE4Evoz8i7' },
  ];
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
          <Section id="discover">
            <Stack gap="lg">
              <div className="home-section-heading">
                <Stack gap="sm">
                  <Text tone="eyebrow">{t.picksEyebrow}</Text>
                  <Heading>{t.picksTitle}</Heading>
                  <Text tone="muted">{t.picksIntro}</Text>
                </Stack>
              </div>
              <Grid>
                {collections.map((collection) => {
                  const prices = menu.categories
                    .find((c) => c.id === collection.id)!
                    .items.flatMap((i) => i.prices.map((p) => p.amount));
                  return (
                    <CollectionCard
                      key={collection.id}
                      name={collection.name}
                      description={collection.description}
                      image={
                        <Image
                          src={collection.image}
                          alt={collection.alt}
                          width={800}
                          height={1000}
                          sizes="(max-width: 640px) 100vw, (max-width: 960px) 50vw, 33vw"
                        />
                      }
                      price={
                        <StartingPrice
                          label={t.from}
                          amount={Math.min(...prices)}
                          locale={locale}
                        />
                      }
                      action={
                        <MenuLink
                          locale={locale}
                          initialCategory={collection.id}
                          label={collection.name}
                          variant="outline"
                          compact
                        />
                      }
                    />
                  );
                })}
              </Grid>
              <div className="home-menu-more">
                <MenuLink locale={locale} label={t.fullMenu} variant="outline" />
                <Text tone="muted" className="home-note">
                  {t.collectionNote} {t.menuDescription}
                </Text>
              </div>
            </Stack>
          </Section>
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
                <Text tone="muted" className="home-note">
                  {t.mapsHint}
                </Text>
              </Stack>
              <div className="home-branch-list">
                {branches.map((branch, index) => (
                  <article key={branch.url}>
                    <a
                      className="home-branch"
                      href={branch.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`${t.directions} — ${branch.name}`}
                    >
                      <span className="home-branch-number" aria-hidden="true">
                        {new Intl.NumberFormat(locale === 'ar' ? 'ar-EG' : 'en-EG', {
                          minimumIntegerDigits: 2,
                        }).format(index + 1)}
                      </span>
                      <SummaryRow
                        name={branch.name}
                        description={branch.area}
                        action={
                          <span className="home-branch-arrow">
                            <DirectionArrow />
                          </span>
                        }
                      />
                    </a>
                  </article>
                ))}
              </div>
            </Surface>
          </Section>
        </Container>
      </main>
      <SiteFooter locale={locale} />
    </>
  );
}
