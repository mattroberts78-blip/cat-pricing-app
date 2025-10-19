export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Converter from '@/models/Converter';
import MetalPrice from '@/models/MetalPrice';
import RetailPrice from '@/models/RetailPrice';

function roundTo(n, inc) { return Math.round(n / inc) * inc; }

export async function GET(req) {
  await connectDB();
  const url = new URL(req.url);
  const part = (url.searchParams.get('part') || '').toUpperCase().replace(/[\s-]/g, '');
  if (!part) return NextResponse.json({ error: 'Missing part' }, { status: 400 });

  const [sku, mp, retail] = await Promise.all([
    Converter.findOne({ partNumber: part }),
    MetalPrice.findOne().sort({ asOfDate: -1 }),
    RetailPrice.findOne({ partNumber: part }).sort({ effectiveDate: -1 })
  ]);

  if (!sku) return NextResponse.json({ error: 'SKU not found' }, { status: 404 });
  if (!mp) return NextResponse.json({ error: 'No metal prices set' }, { status: 400 });

  const pt = sku.metalContent.pt_g * mp.pt_per_gram;
  const pd = sku.metalContent.pd_g * mp.pd_per_gram;
  const rh = sku.metalContent.rh_g * mp.rh_per_gram;
  const base = (pt + pd + rh) * (sku.recoveryRate ?? 1);

  // Demo margin/rounding for dynamic price; we’ll swap to per-customer rules later.
  const dynamic = roundTo(base * 1.08, 1);

  return NextResponse.json({
    partNumber: part,
    dynamic,
    retail, // may be null if not uploaded
    metals: { asOfDate: mp.asOfDate }
  });
}
