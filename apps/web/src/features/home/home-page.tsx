import Image from 'next/image';
import Link from 'next/link';
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
import { changeLocale } from './actions';
import { homeMessages } from './messages';
import { MenuBrowser } from './menu-browser';
import { MobileNavigation } from './mobile-navigation';
import { ThemeControl } from './theme-control';
import { SocialIcon } from './social-icon';
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
      <a className="home-skip maro-button maro-button-primary" href="#main-content">
        {t.skip}
      </a>
      <header className="home-header">
        <Container>
          <nav className="home-nav" aria-label={t.nav}>
            <MobileNavigation locale={locale} />
            <Link className="home-wordmark" href="/" aria-label="MARO" lang="en" dir="ltr">
              MARO<span>MINI CAFÉ</span>
            </Link>
            <Inline className="home-nav-links">
              <MenuBrowser locale={locale} label={t.menu} variant="quiet" />
              <Button asChild variant="quiet">
                <a href="#branches">{t.branches}</a>
              </Button>
              <Button asChild variant="quiet">
                <a href="#at-maro">{t.story}</a>
              </Button>
            </Inline>
            <Inline className="home-preferences">
              <ThemeControl locale={locale} theme={theme} />
              <form action={changeLocale} className="home-language">
                <input type="hidden" name="locale" value={locale === 'ar' ? 'en' : 'ar'} />
                <Button type="submit" variant="quiet" size="sm" aria-label={t.switchLabel}>
                  <span className="home-language-full" lang={locale === 'ar' ? 'en' : 'ar'}>
                    {t.language}
                  </span>
                  <span className="home-language-short" lang={locale === 'ar' ? 'en' : 'ar'}>
                    {t.shortLanguage}
                  </span>
                </Button>
              </form>
            </Inline>
          </nav>
        </Container>
      </header>
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
                <MenuBrowser locale={locale} />
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
                        <MenuBrowser
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
                <MenuBrowser locale={locale} label={t.fullMenu} variant="outline" />
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
      <footer className="home-footer">
        <Container>
          <div className="home-footer-main">
            <Stack gap="sm">
              <span className="home-wordmark" lang="en" dir="ltr">
                MARO
              </span>
              <Text>{t.footer}</Text>
            </Stack>
            <Stack gap="sm" className="home-footer-connect">
              <Text tone="eyebrow">{t.keepInTouch}</Text>
              <Inline>
                <Button asChild variant="outline">
                  <a href="tel:+201158750004">
                    <SocialIcon kind="phone" />
                    {t.contact}
                  </a>
                </Button>
                <Button asChild variant="outline">
                  <a
                    href="https://www.instagram.com/maro_mini_cafe/"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <SocialIcon kind="instagram" />
                    {t.instagram}
                  </a>
                </Button>
                <Button asChild variant="outline">
                  <a
                    href="https://www.facebook.com/Marocaffe7/"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <SocialIcon kind="facebook" />
                    {t.facebook}
                  </a>
                </Button>
              </Inline>
            </Stack>
          </div>
          <div className="home-footer-bottom">
            <Text tone="muted" className="home-note">
              {t.preview}
            </Text>
          </div>
        </Container>
      </footer>
    </>
  );
}
