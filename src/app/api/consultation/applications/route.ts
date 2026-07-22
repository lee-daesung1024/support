import {NextRequest, NextResponse} from 'next/server';
import {assertRateLimit, createConsultationApplication} from '@/lib/applicationStore';
import {normalizeApplicationInput, validateApplicationInput} from '@/validation/consultation';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    assertRateLimit(request.headers.get('x-forwarded-for') ?? 'local');
    const input = normalizeApplicationInput(body);
    const errors = validateApplicationInput(input);
    if (errors.length) {
      return NextResponse.json({message: errors.join('\n')}, {status: 422});
    }
    const application = await createConsultationApplication(input);
    return NextResponse.json(application, {status: 201});
  } catch (error) {
    const status = (error as {status?: number}).status ?? 500;
    const message = status === 500 ? '申込を受け付けできませんでした。時間をおいて再度お試しください。' : (error as Error).message;
    return NextResponse.json({message}, {status});
  }
}
