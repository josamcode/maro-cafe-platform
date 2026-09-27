'use client';
import { useState } from 'react';
import Image from 'next/image';
import {
  Badge,
  Button,
  Checkbox,
  CollectionCard,
  DirectionArrow,
  IconButton,
  StartingPrice,
  SummaryRow,
  Container,
  Dialog,
  Disclosure,
  EmptyState,
  Field,
  FilterChip,
  Grid,
  Heading,
  HeroMedia,
  Inline,
  Input,
  Label,
  ProductCard,
  QuantityControl,
  RadioGroup,
  Section,
  Select,
  Skeleton,
  Stack,
  Surface,
  Switch,
  Tabs,
  Text,
  Textarea,
} from '@maro/ui';
import { messages, type Locale } from './messages';
export function DesignSystemShowcase() {
  const [locale, setLocale] = useState<Locale>('ar');
  const t = messages[locale];
  const dir = locale === 'ar' ? 'rtl' : 'ltr';
  const [category, setCategory] = useState('all');
  const [size, setSize] = useState('small');
  const [picked, setPicked] = useState(false);
  const [query, setQuery] = useState('');
  const [quantity, setQuantity] = useState(1);
  const options = [
    { value: 'faisal', label: t.faisal },
    { value: 'haram', label: t.haram },
    { value: 'sahl', label: t.sahl },
  ];
  const productVisible =
    (category === 'all' || category === 'coffee') &&
    (!query || t.product.toLowerCase().includes(query.toLowerCase()));
  return (
    <main id="main-content">
      <Container>
        <div className="ds-masthead">
          <Stack gap="sm">
            <Text tone="eyebrow">MARO / DESIGN SYSTEM / 01</Text>
            <Heading as="h1" size="section">
              A quieter kind of confidence.
            </Heading>
            <Text tone="muted">Warm materials. Clear choices. One shared language.</Text>
          </Stack>
          <Button
            variant="outline"
            onClick={() => setLocale(locale === 'ar' ? 'en' : 'ar')}
            aria-label={locale === 'ar' ? 'Switch preview to English' : 'Switch preview to Arabic'}
          >
            <span lang={locale === 'ar' ? 'en' : 'ar'}>{t.language}</span>
          </Button>
        </div>
      </Container>
      <div lang={locale} dir={dir} data-testid="localized-preview">
        <Container>
          <div className="ds-hero">
            <Stack className="ds-hero-copy" gap="lg">
              <Stack>
                <Text tone="eyebrow">{t.eyebrow}</Text>
                <Heading size="display" className="ds-hero-title">
                  {t.title}
                </Heading>
                <Text tone="muted">{t.intro}</Text>
              </Stack>
              <Inline>
                <Button asChild>
                  <a href="#product-pattern">{t.menu}</a>
                </Button>
                <Button asChild variant="outline">
                  <a href="#form-pattern">{t.branch}</a>
                </Button>
              </Inline>
              <Text tone="muted">{t.previewNotice}</Text>
            </Stack>
            <HeroMedia
              main={
                <Image
                  src="/design-system/maro-mood.jpg"
                  alt={locale === 'ar' ? 'لحظة من داخل MARO' : 'A moment inside MARO'}
                  width={4096}
                  height={2731}
                  sizes="(max-width: 768px) 85vw, 38vw"
                  preload
                />
              }
              detail={
                <Image
                  src="/home/iced-coffee.jpg"
                  alt={locale === 'ar' ? 'مشروبات باردة من MARO' : 'Iced drinks from MARO'}
                  width={960}
                  height={1280}
                  sizes="(max-width: 768px) 35vw, 16vw"
                />
              }
              caption={
                locale === 'ar' ? 'تفاصيل صغيرة. وقت أحلى.' : 'Little details. Better moments.'
              }
            />
          </div>
        </Container>
        <Container>
          <Section id="product-pattern">
            <Stack gap="lg">
              <SectionIntro
                number="01"
                title="Product & discovery"
                description="Photography does the talking. Name, price and next step stay together."
              />
              <div className="ds-product-layout">
                <Stack>
                  <Field label={t.search}>
                    {(props) => (
                      <Input
                        {...props}
                        type="search"
                        value={query}
                        onChange={(event) => setQuery(event.target.value)}
                        placeholder={t.searchPlaceholder}
                      />
                    )}
                  </Field>
                  <Inline role="group" aria-label={t.categoryLabel}>
                    {(['all', 'coffee', 'matcha'] as const).map((value) => (
                      <FilterChip
                        key={value}
                        selected={category === value}
                        onClick={() => setCategory(value)}
                      >
                        {t[value]}
                      </FilterChip>
                    ))}
                  </Inline>
                  <Tabs
                    key={locale}
                    dir={dir}
                    label={t.tabsLabel}
                    items={[
                      {
                        value: 'menu',
                        label: t.productsTab,
                        content: <Text tone="muted">{t.productDescription}</Text>,
                      },
                      {
                        value: 'visit',
                        label: t.visitTab,
                        content: <Text tone="muted">{t.visitText}</Text>,
                      },
                    ]}
                  />
                  <Surface tone="dark">
                    <Stack>
                      <Text tone="eyebrow">MARO MINI CAFÉ</Text>
                      <Heading size="section">{t.eyebrow}</Heading>
                      <Text>{t.intro}</Text>
                      <Button asChild>
                        <a href="#form-pattern">{t.branch}</a>
                      </Button>
                    </Stack>
                  </Surface>
                </Stack>
                <div>
                  {productVisible ? (
                    <ProductCard
                      image={
                        <Image
                          src="/design-system/maro-drink.jpg"
                          alt={t.product}
                          width={1600}
                          height={1200}
                          sizes="(max-width: 768px) 100vw, 40vw"
                        />
                      }
                      name={t.product}
                      description={t.productDescription}
                      price={85}
                      locale={locale}
                      action={
                        <Inline>
                          <Button
                            variant={picked ? 'outline' : 'default'}
                            onClick={() => setPicked(!picked)}
                            aria-pressed={picked}
                          >
                            {picked ? t.picked : t.pick}
                          </Button>
                          <Dialog
                            dir={dir}
                            lang={locale}
                            title={t.dialogTitle}
                            description={t.dialogDescription}
                            closeLabel={t.close}
                            trigger={<Button variant="quiet">{t.details}</Button>}
                          >
                            <RadioGroup
                              label={t.size}
                              name="dialog-size"
                              value={size}
                              onChange={setSize}
                              options={[
                                { value: 'small', label: t.small },
                                { value: 'large', label: t.large },
                              ]}
                            />
                            <Text>{t.previewNotice}</Text>
                          </Dialog>
                        </Inline>
                      }
                    />
                  ) : (
                    <EmptyState title={t.empty} description={t.emptyDescription} />
                  )}
                </div>
              </div>
            </Stack>
          </Section>
          <Section>
            <Stack gap="lg">
              <SectionIntro
                number="01B"
                title="Compact discovery"
                description="An action beside the summary, a prominent starting price and a mirrored direction arrow."
              />
              <Grid>
                <QuantityControl
                  value={quantity}
                  onChange={setQuantity}
                  locale={locale}
                  label={locale === 'ar' ? 'الكمية' : 'Quantity'}
                  increaseLabel={locale === 'ar' ? 'زوّد الكمية' : 'Increase quantity'}
                  decreaseLabel={locale === 'ar' ? 'قلّل الكمية' : 'Decrease quantity'}
                />
                <Disclosure
                  title={t.coffee}
                  meta={locale === 'ar' ? 'افتح القسم' : 'Open category'}
                >
                  <Text>{t.productDescription}</Text>
                </Disclosure>
                <ProductCard
                  compact
                  image={
                    <Image
                      src="/home/iced-coffee.jpg"
                      alt={t.product}
                      width={960}
                      height={1280}
                      sizes="(max-width: 768px) 88px, 400px"
                    />
                  }
                  name={t.product}
                  description={t.productDescription}
                  price={85}
                  pricePrefix={locale === 'ar' ? 'يبدأ من' : 'From'}
                  locale={locale}
                  action={
                    <Dialog
                      title={t.dialogTitle}
                      description={t.previewNotice}
                      closeLabel={t.close}
                      dir={dir}
                      lang={locale}
                      trigger={
                        <IconButton round variant="outline" label={t.details}>
                          <DirectionArrow />
                        </IconButton>
                      }
                    >
                      <Text>{t.previewNotice}</Text>
                    </Dialog>
                  }
                />
                <CollectionCard
                  name={t.coffee}
                  description={t.productDescription}
                  image={
                    <Image
                      src="/home/iced-coffee.jpg"
                      alt={t.product}
                      width={960}
                      height={1280}
                      sizes="(max-width: 768px) 100vw, 40vw"
                    />
                  }
                  price={
                    <StartingPrice
                      label={locale === 'ar' ? 'يبدأ من' : 'From'}
                      amount={85}
                      locale={locale}
                    />
                  }
                  action={
                    <Dialog
                      dir={dir}
                      lang={locale}
                      title={t.dialogTitle}
                      description={t.previewNotice}
                      closeLabel={t.close}
                      trigger={
                        <IconButton round variant="outline" label={t.details}>
                          <DirectionArrow />
                        </IconButton>
                      }
                    >
                      <Text>{t.productDescription}</Text>
                    </Dialog>
                  }
                />
                <Surface tone="dark">
                  <Stack>
                    <SummaryRow
                      name={t.faisal}
                      description={t.visitText}
                      action={<DirectionArrow />}
                    />
                    <Text tone="muted">{t.previewNotice}</Text>
                  </Stack>
                </Surface>
              </Grid>
            </Stack>
          </Section>
          <Section id="form-pattern">
            <Stack gap="lg">
              <SectionIntro
                number="02"
                title="Every interaction, considered"
                description="Shared controls with clear labels, visible focus and purposeful feedback."
              />
              <Grid>
                <Stack>
                  <Field label={t.branchLabel}>
                    {(props) => (
                      <Select
                        {...props}
                        dir={dir}
                        placeholder={t.branchPlaceholder}
                        options={options}
                      />
                    )}
                  </Field>
                  <Field label={t.phone} hint={t.phoneHint}>
                    {(props) => (
                      <Input
                        {...props}
                        type="tel"
                        dir="ltr"
                        autoComplete="tel"
                        placeholder="01X XXXX XXXX"
                      />
                    )}
                  </Field>
                  <Field label={t.notes}>
                    {(props) => <Textarea {...props} placeholder={t.notesPlaceholder} />}
                  </Field>
                </Stack>
                <Stack>
                  <RadioGroup
                    label={t.size}
                    name="size"
                    value={size}
                    onChange={setSize}
                    options={[
                      { value: 'small', label: t.small },
                      { value: 'large', label: t.large },
                    ]}
                  />
                  <Checkbox label={t.consent} />
                  <Switch label={t.preference} />
                  <Field label={t.invalidExample} error={t.phoneError}>
                    {(props) => <Input {...props} dir="ltr" defaultValue="012" />}
                  </Field>
                  <Field label={t.disabled}>
                    {(props) => <Input {...props} disabled placeholder={t.disabled} />}
                  </Field>
                </Stack>
              </Grid>
            </Stack>
          </Section>
          <Section>
            <Stack gap="lg">
              <SectionIntro
                number="03"
                title="Actions & states"
                description="One clear primary action. Quiet alternatives. No decorative urgency."
              />
              <Inline>
                <Button>{t.menu}</Button>
                <Button variant="outline">{t.branch}</Button>
                <Button variant="quiet">{t.details}</Button>
                <Button disabled>{t.disabled}</Button>
              </Inline>
              <Inline>
                <Badge tone="success">{t.available}</Badge>
                <Badge tone="danger">{t.unavailable}</Badge>
                <Badge>{t.previewNotice}</Badge>
              </Inline>
              <Grid>
                <EmptyState title={t.empty} description={t.emptyDescription} />
                <Stack>
                  <Label>{t.loading}</Label>
                  <Skeleton label={t.loading} />
                  <Skeleton label={t.loading} />
                </Stack>
              </Grid>
            </Stack>
          </Section>
        </Container>
      </div>
      <Container>
        <Section>
          <Stack gap="lg">
            <SectionIntro
              number="04"
              title="The MARO palette"
              description="Existing identity, given more breathing room. Gold is an accent, never body text on cream."
            />
            <div className="ds-swatches">
              {[
                { name: 'Ink', token: 'ink', hex: '#0C0B0A' },
                { name: 'Cream', token: 'cream', hex: '#F4ECDF' },
                { name: 'Gold', token: 'gold', hex: '#C9A876' },
                { name: 'Paper', token: 'paper', hex: '#FBF8F2' },
                { name: 'Muted text', token: 'muted', hex: '#655D51' },
              ].map((color) => (
                <Stack gap="sm" key={color.token}>
                  <div
                    className="ds-swatch"
                    style={{ background: 'var(--maro-' + color.token + ')' }}
                  />
                  <Text>{color.name}</Text>
                  <Text tone="muted">{color.hex}</Text>
                </Stack>
              ))}
            </div>
          </Stack>
        </Section>
        <Section>
          <Text tone="muted">
            Foundation v1 · Components are shared through @maro/ui. This is a design workbench, not
            the final homepage.
          </Text>
        </Section>
      </Container>
    </main>
  );
}
function SectionIntro({
  number,
  title,
  description,
}: {
  number: string;
  title: string;
  description: string;
}) {
  return (
    <div className="ds-section-intro" lang="en" dir="ltr">
      <Text tone="eyebrow">{number} / FOUNDATION</Text>
      <Heading>{title}</Heading>
      <Text tone="muted">{description}</Text>
    </div>
  );
}
