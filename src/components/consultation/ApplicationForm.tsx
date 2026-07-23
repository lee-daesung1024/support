'use client';

import {useMemo, useState} from 'react';
import {useRouter} from 'next/navigation';
import {CATEGORIES, CONTACT_METHOD_LABELS} from '@/constants/consultation';
import {formatPreference} from '@/validation/consultation';
import {DateTimePreferenceField} from '@/components/consultation/DateTimePreferenceField';
import type {ConsultationApplication, ConsultationApplicationInput, ContactMethod, DateTimePreference} from '@/types/consultation';

type FormState = Omit<ConsultationApplicationInput, 'idempotencyKey' | 'website'> & {website: string};

const initialState: FormState = {
  stageName: '',
  email: '',
  preferredContactMethod: '' as ContactMethod,
  firstChoice: {date: '', time: ''},
  secondChoice: undefined,
  thirdChoice: undefined,
  preferredStaff: 'おまかせ',
  categories: [],
  note: '',
  specialRequest: '',
  privacyConsent: false,
  website: '',
};

function preferenceKey(value?: DateTimePreference) {
  return value?.date && value.time ? `${value.date} ${value.time}` : '';
}

function preferenceComplete(value?: DateTimePreference) {
  return Boolean(value?.date && value.time);
}

export function ApplicationForm() {
  const router = useRouter();
  const [form, setForm] = useState<FormState>(initialState);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const idempotencyKey = useMemo(() => crypto.randomUUID(), []);

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((current) => ({...current, [key]: value}));
  }

  function toggleCategory(code: string) {
    setForm((current) => ({
      ...current,
      categories: current.categories.includes(code)
        ? current.categories.filter((category) => category !== code)
        : [...current.categories, code],
    }));
  }

  function duplicateErrors() {
    const entries = [
      ['firstChoice', form.firstChoice],
      ['secondChoice', form.secondChoice],
      ['thirdChoice', form.thirdChoice],
    ] as const;
    const selected = entries.filter(([, value]) => preferenceComplete(value));
    const counts = new Map<string, number>();
    selected.forEach(([, value]) => counts.set(preferenceKey(value), (counts.get(preferenceKey(value)) ?? 0) + 1));
    return Object.fromEntries(entries.map(([key, value]) => [key, counts.get(preferenceKey(value)) && counts.get(preferenceKey(value))! > 1 ? '同じ日時を複数の希望欄へ登録できません。' : '']));
  }

  function categoryLabels() {
    return form.categories.map((code) => CATEGORIES.find((category) => category.code === code)?.label ?? code).join('、');
  }

  function openConfirm() {
    setError('');
    const dateErrors = duplicateErrors();
    if (!form.stageName || !form.email || !form.preferredContactMethod || !form.firstChoice.date || !form.firstChoice.time || !form.categories.length || !form.privacyConsent) {
      setError('必須項目を入力してください。');
      return;
    }
    if (dateErrors.firstChoice || dateErrors.secondChoice || dateErrors.thirdChoice) {
      setError('希望日時の重複を確認してください。');
      return;
    }
    setConfirming(true);
    requestAnimationFrame(() => document.getElementById('application-confirm')?.scrollIntoView({behavior: 'smooth', block: 'start'}));
  }

  async function submit() {
    setSubmitting(true);
    setError('');
    try {
      const response = await fetch('/api/consultation/applications', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({...form, idempotencyKey}),
      });
      const payload = await response.json();
      if (!response.ok) {
        throw new Error(payload.message || '申込を受け付けできませんでした。');
      }
      sessionStorage.setItem('consultation_application_receipt', JSON.stringify(payload as ConsultationApplication));
      router.replace('/consultation/apply/complete');
    } catch (submitError) {
      setError((submitError as Error).message);
      setSubmitting(false);
    }
  }

  const dateErrors = duplicateErrors();

  if (confirming) {
    return (
      <section id="application-form" className="container narrow">
        <div id="application-confirm" className="card">
          <h2>申込内容を確認してください</h2>
          {error && <p className="error" role="alert">{error}</p>}
          <dl className="summary-list">
            <div><dt>源氏名</dt><dd>{form.stageName}</dd></div>
            <div><dt>メールアドレス</dt><dd>{form.email}</dd></div>
            <div><dt>希望連絡方法</dt><dd>{CONTACT_METHOD_LABELS[form.preferredContactMethod]}</dd></div>
            <div><dt>第1希望日時</dt><dd>{formatPreference(form.firstChoice)}</dd></div>
            <div><dt>第2希望日時</dt><dd>{formatPreference(form.secondChoice)}</dd></div>
            <div><dt>第3希望日時</dt><dd>{formatPreference(form.thirdChoice)}</dd></div>
            <div><dt>希望担当者</dt><dd>{form.preferredStaff || 'おまかせ'}</dd></div>
            <div><dt>相談カテゴリ</dt><dd>{categoryLabels()}</dd></div>
            <div><dt>相談内容</dt><dd>{form.note || '未入力'}</dd></div>
            <div><dt>配慮事項</dt><dd>{form.specialRequest || '未入力'}</dd></div>
          </dl>
          <button className="btn secondary" type="button" onClick={() => setConfirming(false)}>入力内容を修正する</button>{' '}
          <button className="btn" type="button" disabled={submitting} onClick={submit}>{submitting ? '送信中...' : 'この内容で申し込む'}</button>
        </div>
      </section>
    );
  }

  return (
    <section id="application-form" className="container narrow">
      <h1>相談タイム申込フォーム</h1>
      <p className="notice">フォーム送信時点では予約確定ではありません。担当スタッフからの連絡をもって日時が確定します。</p>
      {error && <p className="error" role="alert">{error}</p>}
      <div className="card">
        <h2>キャスト情報</h2>
        <label>源氏名 <span className="required">必須</span><input value={form.stageName} onChange={(event) => update('stageName', event.target.value)} autoComplete="nickname" /></label>
        <label>メールアドレス <span className="required">必須</span><input type="email" value={form.email} onChange={(event) => update('email', event.target.value)} autoComplete="email" /></label>
        <label>希望連絡方法 <span className="required">必須</span><select value={form.preferredContactMethod} onChange={(event) => update('preferredContactMethod', event.target.value as ContactMethod)}><option value="">選択してください</option>{Object.entries(CONTACT_METHOD_LABELS).map(([code, label]) => <option key={code} value={code}>{label}</option>)}</select></label>
      </div>

      <div className="card">
        <h2>相談内容</h2>
        <DateTimePreferenceField label="第1希望日時" required value={form.firstChoice} error={dateErrors.firstChoice} onChange={(value) => update('firstChoice', value ?? {date: '', time: ''})} />
        <DateTimePreferenceField label="第2希望日時" value={form.secondChoice} error={dateErrors.secondChoice} allowClear onChange={(value) => update('secondChoice', value)} />
        <DateTimePreferenceField label="第3希望日時" value={form.thirdChoice} error={dateErrors.thirdChoice} allowClear onChange={(value) => update('thirdChoice', value)} />
        <label>希望担当者 <span className="muted">任意</span><input value={form.preferredStaff} onChange={(event) => update('preferredStaff', event.target.value)} placeholder="指定がなければ、おまかせで受け付けます" /></label>
        <fieldset>
          <legend>相談カテゴリ <span className="required">1つ以上必須</span></legend>
          <div className="grid two">
            {CATEGORIES.map((category) => <label className="check" key={category.code}><input type="checkbox" checked={form.categories.includes(category.code)} onChange={() => toggleCategory(category.code)} />{category.label}</label>)}
          </div>
        </fieldset>
        <label>相談内容 <span className="muted">任意・最大1000文字</span><textarea value={form.note} maxLength={1000} autoComplete="off" rows={6} onChange={(event) => update('note', event.target.value)} placeholder="話したい内容や気になっていることがあれば入力してください。" /></label>
        <p className="muted">{form.note.length}/1000</p>
        <label>配慮してほしいこと <span className="muted">任意</span><textarea value={form.specialRequest} rows={3} onChange={(event) => update('specialRequest', event.target.value)} placeholder="例：できるだけ短時間がよい、人目につきにくい場所がよい など" /></label>
        <label className="honeypot">入力しないでください<input value={form.website} onChange={(event) => update('website', event.target.value)} tabIndex={-1} autoComplete="off" /></label>
        <label className="check"><input type="checkbox" checked={form.privacyConsent} onChange={(event) => update('privacyConsent', event.target.checked)} />個人情報の取り扱いに同意します <span className="required">必須</span></label>
        <button className="btn" type="button" onClick={openConfirm}>申込内容を確認する</button>
      </div>
    </section>
  );
}
