'use client';
import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import {
  Button,
  Checkbox,
  Disclosure,
  Field,
  Heading,
  Input,
  Select,
  Stack,
  Switch,
  Text,
} from '@maro/ui';
import {
  productWriteSchema,
  catalogPriceSchema,
  type CatalogData,
  type CatalogProduct,
  type ProductWrite,
} from '@maro/contracts';
import type { Locale } from '../../lib/locale';
import { saveProduct } from './actions';
import { adminMessages } from './messages';
import { PhotoPicker } from './photo-picker';
import { ProductPicker } from './product-picker';
import { PriceInput } from './price-input';
import { useEditorExit } from './editor-exit';

export function ProductForm({
  data,
  product,
  locale,
}: {
  data: CatalogData;
  product?: CatalogProduct;
  locale: Locale;
}) {
  const t = adminMessages[locale];
  const router = useRouter();
  const initial: ProductWrite = product
    ? {
        name: product.name,
        categoryId: product.categoryId,
        prices: product.prices,
        media: product.media,
        active: product.active,
        version: product.version,
        featuredOrder: product.featuredOrder,
        pairingIds: product.pairingIds,
        branchSlugs: product.branchSlugs,
      }
    : {
        name: { ar: '', en: '' },
        categoryId: data.categories[0]!.id,
        prices: [{ label: 'standard', amount: 0 }],
        media: data.categories[0]!.media,
        active: false,
        version: 1,
        featuredOrder: null,
        pairingIds: [],
        branchSlugs: data.branches.map((b) => b.slug),
      };
  const [draft, setDraft] = useState(initial);
  const [error, setError] = useState<number | null>(null);
  const [invalid, setInvalid] = useState(false);
  const [busy, start] = useTransition();
  const dirty = JSON.stringify(draft) !== JSON.stringify(initial);
  const exit = useEditorExit(dirty, locale, '/admin');
  function update<K extends keyof ProductWrite>(key: K, value: ProductWrite[K]) {
    setDraft((previous) => ({ ...previous, [key]: value }));
    setError(null);
  }
  const mode = draft.prices.some((p) => p.label === 'small' || p.label === 'large')
    ? 'sized'
    : draft.prices.some((p) => p.label === 'single' || p.label === 'double')
      ? 'shots'
      : 'standard';
  return (
    <>
      <div className="admin-title">
        <Heading as="h1" size="section">
          {product ? product.name[locale] : t.newProduct}
        </Heading>
        <Button variant="quiet" disabled={busy} onClick={exit.leave}>
          {t.back}
        </Button>
      </div>
      <form
        className="admin-editor"
        noValidate
        onSubmit={(event) => {
          event.preventDefault();
          setInvalid(false);
          const parsed = productWriteSchema.safeParse(draft);
          if (!parsed.success) {
            setInvalid(true);
            return;
          }
          start(async () => {
            const result = await saveProduct(product?.id ?? null, parsed.data);
            setError(result.error);
            if (!result.error) {
              router.push('/admin?saved=1');
              router.refresh();
            }
          });
        }}
      >
        <fieldset disabled={busy} className="admin-form-fields">
          <Stack>
            <div className="admin-fields">
              <Field
                label={t.nameAr}
                error={invalid && !draft.name.ar.trim() ? t.nameRequired : undefined}
              >
                {(props) => (
                  <Input
                    {...props}
                    value={draft.name.ar}
                    dir="rtl"
                    maxLength={160}
                    onChange={(e) => update('name', { ...draft.name, ar: e.target.value })}
                  />
                )}
              </Field>
              <Field
                label={t.nameEn}
                error={invalid && !draft.name.en.trim() ? t.nameRequired : undefined}
              >
                {(props) => (
                  <Input
                    {...props}
                    value={draft.name.en}
                    dir="ltr"
                    maxLength={160}
                    onChange={(e) => update('name', { ...draft.name, en: e.target.value })}
                  />
                )}
              </Field>
            </div>
            <Field label={t.category}>
              {(props) => (
                <Select
                  {...props}
                  value={draft.categoryId}
                  placeholder={t.category}
                  dir={locale === 'ar' ? 'rtl' : 'ltr'}
                  onValueChange={(value) => update('categoryId', value)}
                  options={data.categories.map((c) => ({ value: c.id, label: c.name[locale] }))}
                />
              )}
            </Field>
            <PhotoPicker
              data={data}
              value={draft.media}
              locale={locale}
              onChange={(value) => update('media', value)}
            />
            <Checkbox
              label={t.photoVerified}
              checked={draft.media.status === 'verified'}
              onChange={(e) =>
                update('media', {
                  ...draft.media,
                  status: e.target.checked ? 'verified' : 'reference',
                  alt: draft.name.ar && draft.name.en ? draft.name : draft.media.alt,
                })
              }
            />
            <Field label={t.sizes}>
              {(props) => (
                <Select
                  {...props}
                  value={mode}
                  placeholder={t.sizes}
                  dir={locale === 'ar' ? 'rtl' : 'ltr'}
                  options={['standard', 'sized', 'shots'].map((value) => ({
                    value,
                    label: t[value as 'standard' | 'sized' | 'shots'],
                  }))}
                  onValueChange={(value) => {
                    const labels: ProductWrite['prices'][number]['label'][] =
                      value === 'sized'
                        ? ['small', 'large']
                        : value === 'shots'
                          ? ['single', 'double']
                          : ['standard'];
                    update(
                      'prices',
                      labels.map((label) => ({
                        label,
                        amount:
                          draft.prices.find((p) => p.label === label)?.amount ??
                          draft.prices[0]!.amount,
                      })),
                    );
                  }}
                />
              )}
            </Field>
            <div className="admin-fields">
              {draft.prices.map((price, index) => (
                <Field
                  key={price.label}
                  label={draft.prices.length === 1 ? t.price : `${t[price.label]} — ${t.price}`}
                  error={
                    invalid && !catalogPriceSchema.safeParse(price).success
                      ? t.priceRequired
                      : undefined
                  }
                >
                  {(props) => (
                    <PriceInput
                      {...props}
                      amount={price.amount}
                      onAmountChange={(amount) =>
                        update(
                          'prices',
                          draft.prices.map((p, i) => (i === index ? { ...p, amount } : p)),
                        )
                      }
                    />
                  )}
                </Field>
              ))}
            </div>
            <div>
              <Switch
                label={t.availability}
                checked={draft.active}
                onChange={(e) => update('active', e.target.checked)}
              />
              <Text tone="muted" className="admin-hint">
                {t.availabilityHint}
              </Text>
            </div>
            <Disclosure title={t.extra} meta={t.extraHint} className="admin-extra">
              <Stack>
                <Text>{t.branches}</Text>
                <div className="admin-branch-options">
                  {data.branches.map((b) => (
                    <Checkbox
                      key={b.slug}
                      label={b.name[locale]}
                      checked={draft.branchSlugs.includes(b.slug)}
                      onChange={(e) =>
                        update(
                          'branchSlugs',
                          e.target.checked
                            ? [...draft.branchSlugs, b.slug]
                            : draft.branchSlugs.filter((slug) => slug !== b.slug),
                        )
                      }
                    />
                  ))}
                </div>
                <Switch
                  label={t.featured}
                  checked={draft.featuredOrder !== null}
                  onChange={(e) => update('featuredOrder', e.target.checked ? 1 : null)}
                />
                {draft.featuredOrder !== null && (
                  <Field label={t.position}>
                    {(props) => (
                      <Select
                        {...props}
                        placeholder={t.position}
                        value={String(draft.featuredOrder)}
                        dir={locale === 'ar' ? 'rtl' : 'ltr'}
                        onValueChange={(value) => update('featuredOrder', Number(value))}
                        options={Array.from({ length: 6 }, (_, index) => ({
                          value: String(index + 1),
                          label: new Intl.NumberFormat(locale).format(index + 1),
                        }))}
                      />
                    )}
                  </Field>
                )}
                <ProductPicker
                  products={data.products.filter((p) => p.id !== product?.id && p.active)}
                  value={draft.pairingIds[0]}
                  onChange={(value) => update('pairingIds', value)}
                  locale={locale}
                />
              </Stack>
            </Disclosure>
            {invalid && !productWriteSchema.safeParse(draft).success && (
              <Text role="alert">{t.required}</Text>
            )}
            {error && (
              <Text role="alert">
                {error === 409
                  ? t.conflict
                  : error === 401
                    ? t.expired
                    : error === 400
                      ? t.required
                      : t.unavailable}
              </Text>
            )}
            {error === 409 && (
              <Button variant="outline" onClick={() => window.location.reload()}>
                {t.reload}
              </Button>
            )}
            {error === 401 && (
              <Button variant="outline" onClick={() => router.push('/admin')}>
                {t.login}
              </Button>
            )}
            <div className="admin-save">
              <Button type="submit" disabled={busy}>
                {busy ? t.saving : t.save}
              </Button>
              <Button variant="outline" disabled={busy} onClick={exit.leave}>
                {t.cancel}
              </Button>
            </div>
          </Stack>
        </fieldset>
      </form>
      {exit.dialog}
    </>
  );
}
