import Link from 'next/link';
import { Button, Container, Inline, Stack, Text } from '@maro/ui';
import type { Locale, Theme } from '../../lib/locale';
import { homeMessages } from '../home/messages';
import { MenuLink } from '../menu/menu-link';
import { MobileNavigation } from '../home/mobile-navigation';
import { SitePreferences } from './site-preferences';
import { SocialIcon } from '../home/social-icon';
import '../home/home.css';

export function SiteHeader({ locale, theme }: { locale: Locale; theme: Theme }) {
  const t = homeMessages[locale];
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
              <MenuLink locale={locale} label={t.menu} variant="quiet" />
              <Button asChild variant="quiet">
                <Link href="/#branches">{t.branches}</Link>
              </Button>
              <Button asChild variant="quiet">
                <Link href="/#at-maro">{t.story}</Link>
              </Button>
            </Inline>
            <SitePreferences locale={locale} theme={theme} />
          </nav>
        </Container>
      </header>
    </>
  );
}

export function SiteFooter({ locale }: { locale: Locale }) {
  const t = homeMessages[locale];
  return (
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
  );
}
