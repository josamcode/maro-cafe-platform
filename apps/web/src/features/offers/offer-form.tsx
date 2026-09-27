'use client';
import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import {
  Button,
  Checkbox,
  Field,
  Heading,
  Input,
  Select,
  Stack,
  Switch,
  Text,
  Textarea,
} from '@maro/ui';
import { offerWriteSchema, type Offer, type OfferWrite, type CatalogBranch } from '@maro/contracts';
import type { Locale } from '../../lib/locale';
import { useEditorExit } from '../admin/editor-exit';
import { adminMessages } from '../admin/messages';
import { offerMessages } from './messages';
import { saveOffer } from './actions';
import { OfferDateInput } from './date-input';
export function OfferForm({
  offer,
  branches,
  locale,
}: {
  offer?: Offer;
  branches: CatalogBranch[];
  locale: Locale;
}) {
  const t = offerMessages[locale],
    a = adminMessages[locale];
  const existing = offer
    ? {
        version: offer.version,
        title: offer.title,
        terms: offer.terms,
        startsOn: offer.startsOn,
        endsOn: offer.endsOn,
        context: offer.context,
        branchSlugs: offer.branchSlugs,
        published: offer.published,
      }
    : null;
  const initial: OfferWrite = offer
    ? { ...existing!, approved: false }
    : {
        version: 1,
        title: { ar: '', en: '' },
        terms: { ar: '', en: '' },
        startsOn: '',
        endsOn: '',
        context: 'both',
        branchSlugs: branches.map((b) => b.slug),
        published: false,
        approved: false,
      };
  const [draft, setDraft] = useState(initial);
  const [error, setError] = useState<number | null>(null);
  const [busy, start] = useTransition();
  const router = useRouter();
  const exit = useEditorExit(
    JSON.stringify(initial) !== JSON.stringify(draft),
    locale,
    '/admin/offers',
  );
  const validation = offerWriteSchema.safeParse(draft);
  const invalid = (field: string) =>
    error === 400 &&
    !validation.success &&
    validation.error.issues.some((issue) => issue.path[0] === field);
  function update<K extends keyof OfferWrite>(key: K, value: OfferWrite[K]) {
    setDraft((old) => ({ ...old, [key]: value }));
    setError(null);
  }
  return (
    <>
      <div className="admin-title">
        <Heading as="h1" size="section">
          {offer ? offer.title[locale] : t.new}
        </Heading>
      </div>
      <form
        className="admin-editor"
        noValidate
        onSubmit={(event) => {
          event.preventDefault();
          if (!validation.success) {
            setError(400);
            return;
          }
          start(async () => {
            const result = await saveOffer(offer?.id ?? null, validation.data);
            setError(result.error);
            if (!result.error) {
              router.push('/admin/offers?saved=1');
              router.refresh();
            }
          });
        }}
      >
        <fieldset className="admin-form-fields" disabled={busy}>
          <Stack>
            <div className="admin-fields">
              {(['ar', 'en'] as const).map((language) => (
                <Field
                  key={language}
                  label={language === 'ar' ? t.titleAr : t.titleEn}
                  error={
                    invalid('title') && !draft.title[language].trim() ? a.nameRequired : undefined
                  }
                >
                  {(props) => (
                    <Input
                      {...props}
                      dir={language === 'ar' ? 'rtl' : 'ltr'}
                      value={draft.title[language]}
                      maxLength={160}
                      onChange={(e) =>
                        update('title', { ...draft.title, [language]: e.target.value })
                      }
                    />
                  )}
                </Field>
              ))}
            </div>
            {(['ar', 'en'] as const).map((language) => (
              <Field
                key={language}
                label={language === 'ar' ? t.termsAr : t.termsEn}
                hint={t.termsHint}
                error={invalid('terms') && !draft.terms[language].trim() ? t.error : undefined}
              >
                {(props) => (
                  <Textarea
                    {...props}
                    dir={language === 'ar' ? 'rtl' : 'ltr'}
                    rows={3}
                    value={draft.terms[language]}
                    maxLength={1200}
                    onChange={(e) =>
                      update('terms', { ...draft.terms, [language]: e.target.value })
                    }
                  />
                )}
              </Field>
            ))}
            <div className="admin-fields">
              {(['startsOn', 'endsOn'] as const).map((field) => (
                <Field
                  key={field}
                  label={field === 'startsOn' ? t.starts : t.ends}
                  hint={t.dateHint}
                  error={invalid(field) ? t.error : undefined}
                >
                  {(props) => (
                    <OfferDateInput
                      {...props}
                      value={draft[field]}
                      onDateChange={(value) => update(field, value)}
                    />
                  )}
                </Field>
              ))}
            </div>
            <Field label={t.context}>
              {(props) => (
                <Select
                  {...props}
                  placeholder={t.context}
                  value={draft.context}
                  dir={locale === 'ar' ? 'rtl' : 'ltr'}
                  onValueChange={(value) => update('context', value as OfferWrite['context'])}
                  options={(['outside', 'inside', 'both'] as const).map((value) => ({
                    value,
                    label: t[value],
                  }))}
                />
              )}
            </Field>
            <fieldset className="admin-form-fields">
              <legend className="maro-label">{t.branches}</legend>
              <div className="admin-branch-options">
                {branches.map((branch) => (
                  <Checkbox
                    key={branch.slug}
                    label={branch.name[locale]}
                    checked={draft.branchSlugs.includes(branch.slug)}
                    onChange={(e) =>
                      update(
                        'branchSlugs',
                        e.target.checked
                          ? [...draft.branchSlugs, branch.slug]
                          : draft.branchSlugs.filter((slug) => slug !== branch.slug),
                      )
                    }
                  />
                ))}
              </div>
            </fieldset>
            <Switch
              label={t.publish}
              checked={draft.published}
              onChange={(e) => update('published', e.target.checked)}
            />
            {draft.published && (
              <Checkbox
                label={t.approval}
                checked={draft.approved}
                onChange={(e) => update('approved', e.target.checked)}
              />
            )}
            {error && (
              <Text role="alert">
                {error === 400
                  ? t.error
                  : error === 409
                    ? a.conflict
                    : error === 401
                      ? a.expired
                      : a.unavailable}
              </Text>
            )}
            {error === 409 && (
              <Button variant="outline" onClick={() => window.location.reload()}>
                {a.reload}
              </Button>
            )}
            {error === 401 && (
              <Button variant="outline" onClick={() => router.push('/admin')}>
                {a.login}
              </Button>
            )}
            <div className="admin-save">
              <Button type="submit" disabled={busy}>
                {busy ? a.saving : a.save}
              </Button>
              <Button variant="outline" onClick={exit.leave}>
                {a.cancel}
              </Button>
            </div>
          </Stack>
        </fieldset>
      </form>
      {exit.dialog}
    </>
  );
}
