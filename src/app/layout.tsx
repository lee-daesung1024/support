import './globals.css';import type {Metadata} from 'next';
export const metadata:Metadata={title:'相談タイム｜キャストサポート',description:'ひとりで抱えず、気軽に話せる相談タイムの予約サイトです。',openGraph:{title:'相談タイム｜キャストサポート',description:'安心して働くための相談・サポート時間をブラウザから予約できます。'},robots:{index:true,follow:true}};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="ja"><body>{children}</body></html>}
