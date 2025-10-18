import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import MetalPrice from '@/models/MetalPrice';

export async function POST(req) {
  await connectDB();
  const { pt, pd, rh } = await req.json();
  if (![pt,pd,rh].every(v => typeof v === 'number' && isFinite(v))) {
    return NextResponse.json({ error: 'Invalid numbers' }, { status: 400 });
  }
  const asOfDate = new Date();
  asOfDate.setHours(0,0,0,0);
  const doc = await MetalPrice.findOneAndUpdate(
    { asOfDate },
    { pt_per_gram: pt, pd_per_gram: pd, rh_per_gram: rh, source: 'admin' },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );
  return NextResponse.json({ ok: true, id: doc._id });
}
