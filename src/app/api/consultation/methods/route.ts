import {NextResponse} from 'next/server';
import {CONTACT_METHOD_LABELS, METHOD_LABELS, STORES} from '@/constants/consultation';

export async function GET() {
  return NextResponse.json({
    consultationMethods: Object.entries(METHOD_LABELS).map(([code, label]) => ({code, label})),
    contactMethods: Object.entries(CONTACT_METHOD_LABELS).map(([code, label]) => ({code, label})),
    stores: STORES,
  });
}
