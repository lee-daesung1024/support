import {NextResponse} from 'next/server';export async function POST(){return NextResponse.json({ok:true,message:'モックコードを送信しました。開発環境では任意の6桁でログインできます。'})}
