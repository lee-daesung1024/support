import {NextResponse} from 'next/server';
import {CONTACT_METHOD_LABELS, generateTimeSlots} from '@/constants/consultation';

export async function GET() {
  return NextResponse.json({
    contactMethods: Object.entries(CONTACT_METHOD_LABELS).map(([code, label]) => ({code, label})),
    timeSlots: generateTimeSlots(),
  });
}
