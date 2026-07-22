import {NextResponse} from 'next/server';import {CATEGORIES} from '@/constants/consultation';export async function GET(){return NextResponse.json(CATEGORIES)}
