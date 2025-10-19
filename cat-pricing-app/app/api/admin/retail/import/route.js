export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import RetailPrice from '@/models/RetailPrice';
import Papa from 'papaparse';

export async function POST(req) {
  await connectDB();
  const form = await req.formData();
  const file = form.get('file');
  if (!file) return NextResponse.json({ error: 'No file' }, { status: 400 });

  // CSV expected headers: make, partNumber, price, unit (unit optional)
  const name = file.name || 'upload.csv';
  const text = await file.text();
  const parsed = Papa.parse(text, { header: true, skipEmptyLines: true });

  let count = 0;
  const effectiveDate = new Date(); effectiveDate.setHours(0,0,0,0);

  for (const r of parsed.data) {
    const partNumber = String(r.partNumber || r.part || '').toUpperCase().replace(/[\s-]/g, '');
    const make = (r.make || '').toString();
    const price = Number(r.price || 0);
    const unit = (r.unit || 'EA').toString();
    if (!partNumber || !Number.isFinite(price)) continue;

    await RetailPrice.create({
      partNumber, make, price, unit, effectiveDate, sourceDoc: name
    });
    count++;
  }

  return NextResponse.json({ ok: true, count });
}
