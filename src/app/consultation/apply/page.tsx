import {ApplicationForm} from '@/components/consultation/ApplicationForm';

export const metadata = {robots: {index: false, follow: false}, title: '相談タイム申し込み'};

export default function Page() {
  return <ApplicationForm />;
}
