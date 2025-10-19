export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Converter from '@/models/Converter';
import MetalPrice from '@/models/MetalPrice';

function roundTo(n, inc) { return Math.round(n / inc) * inc; }

export async function GET(req, { params }) {
  await connectDB();
  const part = params.part.toUpperCase();
  const [sku, mp] = await Promise.all([
    Converter.findOne({ partNumber: part, status: 'active' }),
    MetalPrice.findOne().sort({ asOfDate: -1 })
  ]);
  if (!sku) return NextResponse.json({ error: 'SKU not found' }, { status: 404 });
  if (!mp) return NextResponse.json({ error: 'No metal prices set' }, { status: 400 });

  const pt = sku.metalContent.pt_g * mp.pt_per_gram;
  const pd = sku.metalContent.pd_g * mp.pd_per_gram;
  const rh = sku.metalContent.rh_g * mp.rh_per_gram;
  let base = (pt + pd + rh) * (sku.recoveryRate ?? 1);

  // Simple default rule for demo
  const marginPct = 0.08;
  const rounding = 1;
  let price = roundTo(base * (1 + marginPct), rounding);

  return NextResponse.json({
    partNumber: sku.partNumber,
    breakdown: { pt_usd: pt, pd_usd: pd, rh_usd: rh, recoveryRate: sku.recoveryRate, base },
    price,
    metals: { asOfDate: mp.asOfDate, pt: mp.pt_per_gram, pd: mp.pd_per_gram, rh: mp.rh_per_gram },
  });
}
