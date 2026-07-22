import {NextResponse} from 'next/server';import {requireSession} from '@/lib/mockStore';export async function GET(){const s=await requireSession();return NextResponse.json(s.stores)}
