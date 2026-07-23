'use client';

import Link from 'next/link';
import {useEffect, useState} from 'react';
import {CATEGORIES, CONTACT_METHOD_LABELS} from '@/constants/consultation';
import {formatPreference} from '@/validation/consultation';
import type {ConsultationApplication} from '@/types/consultation';

export function ApplicationComplete() {
  const [application, setApplication] = useState<ConsultationApplication | null>(null);

  useEffect(() => {
    const stored = sessionStorage.getItem('consultation_application_receipt');
    if (stored) setApplication(JSON.parse(stored) as ConsultationApplication);
  }, []);

  if (!application) {
    return <main className="container narrow"><h1>受付内容を表示できません</h1><p>申込完了後に表示される画面です。</p><Link className="btn" href="/consultation/apply">申し込みフォームへ</Link></main>;
  }

  const categoryLabels = application.categories.map((code) => CATEGORIES.find((category) => category.code === code)?.label ?? code).join('、');

  return (
    <main className="container narrow">
      <h1>相談タイムのお申し込みを受け付けました</h1>
      <div className="card">
        <p className="notice">現在はまだ日時確定前です。<br />担当スタッフからの連絡をもって確定となります。<br /><br />入力したメールアドレスへ<br />受付内容を送信しました。</p>
        <dl className="summary-list">
          <div><dt>受付番号</dt><dd>{application.receiptNumber}</dd></div>
          <div><dt>源氏名</dt><dd>{application.stageName}</dd></div>
          <div><dt>第1希望日時</dt><dd>{formatPreference(application.firstChoice)}</dd></div>
          <div><dt>第2希望日時</dt><dd>{formatPreference(application.secondChoice)}</dd></div>
          <div><dt>第3希望日時</dt><dd>{formatPreference(application.thirdChoice)}</dd></div>
          <div><dt>希望連絡方法</dt><dd>{CONTACT_METHOD_LABELS[application.preferredContactMethod]}</dd></div>
          <div><dt>相談カテゴリ</dt><dd>{categoryLabels}</dd></div>
        </dl>
        <Link className="btn secondary" href="/consultation">相談タイムTOPへ戻る</Link>
      </div>
    </main>
  );
}
