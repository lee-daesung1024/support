'use client';

import {useMemo, useState} from 'react';
import {useRouter} from 'next/navigation';
import {CATEGORIES, CONTACT_METHOD_LABELS, METHOD_LABELS, STORES} from '@/constants/consultation';
import type {ConsultationApplication, ConsultationApplicationInput, ConsultationMethod, ContactMethod} from '@/types/consultation';

type FormState = Omit<ConsultationApplicationInput, 'idempotencyKey' | 'website'> & {website: string};

const initialState: FormState = {
  stageName: '',
  storeName: '',
  email: '',
  phone: '',
  preferredContactMethod: '' as ContactMethod,
  contactNote: '',
  firstChoiceAt: '',
  secondChoiceAt: '',
  thirdChoiceAt: '',
  preferredConsultationMethod: '' as ConsultationMethod,
  preferredStaff: '',
  categories: [],
  note: '',
  specialRequest: '',
  privacyConsent: false,
  website: '',
};

export function ApplicationForm() {
  const router = useRouter();
  const [form, setForm] = useState<FormState>(initialState);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
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

  return (
    <main className="container narrow">
      <h1>相談タイムを申し込む</h1>
      <p className="notice">フォーム送信時点では予約確定ではありません。担当スタッフからの連絡をもって日時が確定します。</p>
      {error && <p className="error" role="alert">{error}</p>}
      <div className="card">
        <label>源氏名 <span className="required">必須</span><input value={form.stageName} onChange={(event) => update('stageName', event.target.value)} autoComplete="nickname" /></label>
        <label>所属店舗 <span className="required">必須</span><select value={form.storeName} onChange={(event) => update('storeName', event.target.value)}><option value="">選択してください</option>{STORES.map((store) => <option key={store} value={store}>{store}</option>)}</select></label>
        <label>メールアドレス <span className="required">必須</span><input type="email" value={form.email} onChange={(event) => update('email', event.target.value)} autoComplete="email" /></label>
        <label>電話番号 <span className="muted">任意</span><input type="tel" value={form.phone} onChange={(event) => update('phone', event.target.value)} autoComplete="tel" /></label>
        <label>希望連絡方法 <span className="required">必須</span><select value={form.preferredContactMethod} onChange={(event) => update('preferredContactMethod', event.target.value as ContactMethod)}><option value="">選択してください</option>{Object.entries(CONTACT_METHOD_LABELS).map(([code, label]) => <option key={code} value={code}>{label}</option>)}</select></label>
        <label>希望連絡方法の補足 <span className="muted">任意</span><input value={form.contactNote} onChange={(event) => update('contactNote', event.target.value)} placeholder="例：LINEは18時以降が返信しやすいです" /></label>
      </div>

      <div className="card">
        <h2>希望日時</h2>
        <label>第1希望日時 <span className="required">必須</span><input type="datetime-local" value={form.firstChoiceAt} onChange={(event) => update('firstChoiceAt', event.target.value)} /></label>
        <label>第2希望日時 <span className="muted">推奨</span><input type="datetime-local" value={form.secondChoiceAt} onChange={(event) => update('secondChoiceAt', event.target.value)} /></label>
        <label>第3希望日時 <span className="muted">任意</span><input type="datetime-local" value={form.thirdChoiceAt} onChange={(event) => update('thirdChoiceAt', event.target.value)} /></label>
        <label>希望相談方法 <span className="required">必須</span><select value={form.preferredConsultationMethod} onChange={(event) => update('preferredConsultationMethod', event.target.value as ConsultationMethod)}><option value="">選択してください</option>{Object.entries(METHOD_LABELS).map(([code, label]) => <option key={code} value={code}>{label}</option>)}</select></label>
        <label>希望担当者 <span className="muted">任意</span><input value={form.preferredStaff} onChange={(event) => update('preferredStaff', event.target.value)} placeholder="指定がなければ空欄でOK" /></label>
      </div>

      <div className="card">
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
        <button className="btn" type="button" disabled={submitting} onClick={submit}>{submitting ? '送信中...' : '申込内容を送信する'}</button>
      </div>
    </main>
  );
}
