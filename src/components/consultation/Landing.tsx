import Link from 'next/link';
import {CATEGORIES} from '@/constants/consultation';
import {LandingFixedCta} from '@/components/consultation/LandingFixedCta';

const faqs = [
  ['売上が悪い人が呼ばれるものですか？', 'いいえ。売上だけを理由に責めるための時間ではありません。働き方や困りごとを一緒に整理するための時間です。'],
  ['特に相談がなくても申し込めますか？', 'はい。近況を少し話したいという内容でも大丈夫です。'],
  ['相談時間はどれくらいですか？', '通常は5〜15分程度です。'],
  ['強制ですか？', '原則として強制ではありません。'],
  ['どんな方法で相談できますか？', '対面、電話、LINE、オンラインなど、店舗で利用可能な方法から希望を選べます。'],
  ['日時はこの場で確定しますか？', 'いいえ。フォーム送信後は申込受付となり、担当スタッフからの連絡をもって予約確定となります。'],
  ['内容は誰まで共有されますか？', '原則として対応に必要なスタッフのみで取り扱います。緊急対応が必要な場合は、必要な範囲で責任者へ共有することがあります。'],
];

export function Landing() {
  return (
    <main className="container lp">
      <section className="hero" data-lp-hero>
        <p className="step">キャストサポート</p>
        <h1>ひとりで抱えず、気軽に話せる時間を。</h1>
        <p>相談タイムは、あなたがもっと安心して働き、無理なく稼ぎやすくするためのサポートです。</p>
        <div className="chips">
          <span className="chip">5〜15分</span>
          <span className="chip">説教なし</span>
          <span className="chip">強制なし</span>
          <span className="chip">申込後に日時調整</span>
        </div>
        <p><Link className="btn hero-cta" href="/consultation/apply">相談タイムを申し込む</Link></p>
      </section>

      <section className="card">
        <h2>相談タイムは、評価のための面談ではありません</h2>
        <p>売上を責めたり、無理な出勤をお願いしたりする時間ではありません。困っていること、不安なこと、もっと良くしたいことを一緒に整理するための時間です。特に相談がない場合は、最近の近況を少し話すだけでも大丈夫です。</p>
        <div className="grid three">
          <div className="point-card"><h3>安心して話せる</h3></div>
          <div className="point-card"><h3>あなたに合わせて一緒に考える</h3></div>
          <div className="point-card"><h3>5〜15分で気軽に利用できる</h3></div>
        </div>
      </section>

      <section>
        <h2>こんな相談ができます</h2>
        <div className="grid three">
          {CATEGORIES.map((category) => (
            <div className="card" key={category.code}>{category.label}</div>
          ))}
        </div>
      </section>

      <section className="card">
        <h2>相談すると、こんなことにつながります</h2>
        <ul>
          {['今より働きやすくする方法が見つかる', '収入や指名を増やすヒントが見つかる', '不安やストレスを一人で抱え込まずに済む', 'お客様とのトラブルを早めに相談できる', '店舗に改善してほしいことを直接伝えられる', '自分に合った出勤や働き方を一緒に考えられる'].map((item) => <li key={item}>{item}</li>)}
        </ul>
      </section>

      <section className="card">
        <h2>安心して利用していただくためのお約束</h2>
        <ul>
          {['説教や一方的な指導はしません', '相談タイムへの参加は強制ではありません', '話したくないことを無理に聞きません', '相談内容は必要な範囲で大切に取り扱います', '本人の希望を無視して出勤を強制しません'].map((item) => <li key={item}>{item}</li>)}
        </ul>
        <p className="muted">安全確保、重大なトラブル、法令違反のおそれなど、緊急対応が必要な場合は、必要な範囲で責任者へ共有することがあります。</p>
      </section>

      <section className="grid two">
        {['本人情報を入力する', '希望日時を第1〜第3まで入力する', '相談したい内容を選ぶ', '店舗からの連絡で日時確定'].map((item, index) => (
          <div className="card" key={item}><span className="step">STEP {index + 1}</span><h3>{item}</h3></div>
        ))}
      </section>

      <section className="faq">
        <h2>よくある質問</h2>
        {faqs.map(([question, answer]) => (
          <details className="card" key={question}>
            <summary>{question}</summary>
            <p>{answer}</p>
          </details>
        ))}
      </section>

      <section className="card">
        <h2>少し話してみようかな、くらいで大丈夫です。</h2>
        <p>大きな悩みでなくても構いません。働きやすくするための時間として、気軽に利用してください。</p>
        <Link className="btn" href="/consultation/apply">相談タイムを申し込む</Link>
      </section>
      <LandingFixedCta />
    </main>
  );
}
