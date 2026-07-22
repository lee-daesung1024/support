import {NextResponse} from 'next/server';import {sessionCookie} from '@/lib/mockStore';export async function POST(){const r=NextResponse.json({ok:true});r.cookies.delete(sessionCookie);return r}
