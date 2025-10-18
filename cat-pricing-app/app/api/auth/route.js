import { NextResponse } from 'next/server';

export async function POST(req) {
  const { u, p } = await req.json();
  if (u === process.env.ADMIN_USERNAME && p === process.env.ADMIN_PASSWORD) {
    const res = NextResponse.json({ ok: true });
    res.cookies.set('session', 'ok', { httpOnly: true, sameSite: 'lax', path: '/' });
    return res;
  }
  return NextResponse.json({ error: 'bad creds' }, { status: 401 });
}

export async function DELETE() {
  const res = NextResponse.json({ ok: true });
  res.cookies.set('session', '', { httpOnly: true, expires: new Date(0), path: '/' });
  return res;
}
