import {NextResponse} from 'next/server';import {sessionCookie} from '@/lib/mockStore';
export async function POST(){const res=NextResponse.json({ok:true});res.cookies.set(sessionCookie,'mock-session',{httpOnly:true,secure:process.env.NODE_ENV==='production',sameSite:'lax',path:'/',maxAge:60*60*8});return res}
