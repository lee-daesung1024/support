import {CATEGORIES} from '@/constants/consultation';
import {ApplicationForm} from '@/components/consultation/ApplicationForm';
import {LandingFixedCta} from '@/components/consultation/LandingFixedCta';

const concerns = ['最近予約が減ってきた', '思うように稼げない', '常連さんや指名が減った', '写メ日記が苦手', 'お客様対応で困っている', 'スタッフに相談しづらい', '出勤のことで悩んでいる', '辞めようか迷っている', '誰かに話したいけど、何から話せばよいか分からない'];
const futures = ['指名やリピーターを増やすヒントが見つかる', '写メ日記やプロフィール改善の方向性が分かる', '自分に合った働き方が見つかる', '収入を上げるための考え方を整理できる', '苦手なお客様への対応方法が分かる', 'モヤモヤを言葉にすることで気持ちが軽くなる', '店舗へ改善してほしいことを伝えられる', '辞める前に他の選択肢を一緒に考えられる'];
const voiceExamples = ['最初は面談と聞いて少し嫌でしたが、実際は普通に話を聞いてもらう感じで安心しました。', '写メ日記の見せ方を相談して、何を変えればいいか分かるようになりました。', '辞めようか迷っていましたが、働き方を変える方法を一緒に考えてもらえました。', '無理に出勤を増やすよう言われなかったので安心しました。'];
const promises = ['説教や一方的な指導はしません', '無理な出勤をお願いしません', '話したくないことを無理に聞きません', '相談内容は必要な範囲で大切に扱います', 'あなたに合った方法を一緒に考えます'];
const consultTiming = ['退店しようか迷っている', '出勤を減らしたい', '収入が急に落ちた', 'お客様とのトラブルがあった', 'NG顧客について相談したい', 'スタッフとのやり取りで困っている', '精算や待遇について確認したい', '仕事とプライベートの両立が難しい', '気持ちが落ち込んでいる', '何となく働きづらいと感じている'];
const faqs = [
  ['売上が悪い人が利用するものですか？', 'いいえ。売上だけを理由に責めるための時間ではありません。困っていることや働き方を一緒に整理するための時間です。'],
  ['特に相談がなくても大丈夫ですか？', 'はい。近況を少し話したいという内容でも大丈夫です。'],
  ['怒られたり、説教されたりしませんか？', '相談タイムは、キャストを責めるための時間ではありません。まずは本人の話を聞くことを大切にします。'],
  ['時間はどれくらいですか？', '通常は5〜15分程度です。'],
  ['強制ですか？', '原則として強制ではありません。'],
  ['内容は誰に共有されますか？', '原則として、対応に必要なスタッフのみで取り扱います。緊急対応が必要な場合は、必要な範囲で責任者へ共有することがあります。'],
  ['申込後すぐ予約確定になりますか？', 'いいえ。担当スタッフからの連絡をもって日時確定となります。'],
  ['申込後に希望日時を変更できますか？', '返信時に担当スタッフへお伝えください。'],
];

export function Landing() {
  return (
    <>
      <header className="site-header"><div className="brand-mark" aria-hidden="true" /><strong>キャストサポート</strong></header>
      <main className="container lp">
        <section className="hero" data-lp-hero>
          <p className="step">あなたのためのキャストサポート</p>
          <h1>ひとりで頑張り続けなくて大丈夫。</h1>
          <p>仕事のこと、収入のこと、お客様のこと。少しでも気になることがあれば、気軽に話してください。相談タイムは、あなたがもっと安心して働くための時間です。</p>
          <div className="chips"><span className="chip">5〜15分</span><span className="chip">説教なし</span><span className="chip">強制なし</span><span className="chip">話せる範囲でOK</span></div>
          <p><a className="btn hero-cta" href="#application-form">相談タイムを申し込む</a></p>
        </section>

        <section className="section-soft"><h2>最近、こんなことで悩んでいませんか？</h2><div className="grid three">{concerns.map((item) => <div className="point-card" key={item}>{item}</div>)}</div></section>

        <section className="card"><h2>同じような悩みを抱えている女性は、あなただけではありません。</h2><p>仕事を続けていると、収入、お客様、出勤、人間関係など、さまざまな悩みが出てくることがあります。</p><p>自分だけで解決しようとしなくて大丈夫です。小さな悩みのうちに話してもらえるように、相談タイムを用意しました。</p></section>

        <section className="card"><h2>相談タイムは、評価のための面談ではありません。</h2><p>売上を責めたり、無理な出勤をお願いしたりする時間ではありません。困っていること、不安なこと、もっと良くしたいことを一緒に整理するための時間です。</p><p>特に相談がない場合は、最近の近況を少し話すだけでも大丈夫です。</p><div className="grid three"><div className="point-card"><h3>評価ではありません</h3><p>話したくないことを無理に聞きません。</p></div><div className="point-card"><h3>説教しません</h3><p>相談内容に合わせて一緒に考えます。</p></div><div className="point-card"><h3>雑談だけでも大丈夫</h3><p>5〜15分で短時間でも利用できます。</p></div></div></section>

        <section><h2>相談すると、こんな変化につながるかもしれません。</h2><div className="grid two">{futures.map((item) => <div className="card" key={item}><h3>相談後に得られる未来</h3><p>{item}</p></div>)}</div></section>

        <section className="card"><h2>実際に相談したキャストの声</h2><p className="muted">掲載例です。本番公開前に実データへ差し替えてください。</p><div className="grid two">{voiceExamples.map((voice) => <blockquote className="voice-card" key={voice}>「{voice}」</blockquote>)}</div></section>

        <section className="card"><h2>相談を担当するスタッフ</h2><div className="staff-card"><div className="staff-avatar" aria-hidden="true">CS</div><div><h3>キャストサポート担当</h3><p className="muted">サポートスタッフ</p><p>得意な相談内容：働き方、収入、写メ日記、お客様対応</p><p>無理に結論を出すのではなく、まずは今感じていることを整理できるようにお話を聞きます。</p></div></div></section>

        <section className="card"><h2>安心して話していただくために、私たちが約束すること</h2><ol>{promises.map((item) => <li key={item}>{item}</li>)}</ol><p className="muted">安全確保、重大なトラブル、法令違反のおそれなど、緊急対応が必要な場合は、必要な範囲で責任者へ共有することがあります。</p></section>

        <section className="grid two">{['相談内容を整理する', '一緒にできることを考える', '必要な対応を行う', '後日、状況を確認する'].map((item, index) => <div className="card" key={item}><span className="step">STEP {index + 1}</span><h3>{item}</h3><p>本人の意思を大切にしながら、必要に応じてサポートします。</p></div>)}</section>

        <section className="card"><h2>こんな時は、我慢せずに相談してください。</h2><div className="grid two">{consultTiming.map((item) => <div className="point-card" key={item}>{item}</div>)}</div><p className="notice">身の危険、暴力、脅迫、盗撮など、今すぐ対応が必要な場合は、申込フォームを待たず店舗へ直接連絡してください。</p></section>

        <section><h2>こんな相談ができます</h2><div className="grid three">{CATEGORIES.map((category) => <div className="card" key={category.code}>{category.label}</div>)}</div></section>

        <section className="faq"><h2>よくある質問</h2>{faqs.map(([question, answer]) => <details className="card" key={question}><summary>{question}</summary><p>{answer}</p></details>)}</section>

        <section className="card final-cta"><h2>一人で抱え込まず、少しだけ話してみませんか？</h2><p>大きな悩みでなくても構いません。話すだけでも、気持ちや考えが整理できることがあります。</p><p>あなたが安心して働けることを、私たちは大切にしています。</p><a className="btn" href="#application-form">相談タイムを申し込む</a></section>
      </main>
      <ApplicationForm />
      <footer className="container footer">© キャストサポート</footer>
      <LandingFixedCta />
    </>
  );
}
