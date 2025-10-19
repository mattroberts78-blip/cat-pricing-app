export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Converter from '@/models/Converter';
import Papa from 'papaparse';

export const dynamic = 'force-dynamic';

export async function POST(req) {
  await connectDB();
  const form = await req.formData();
  const file = form.get('file');
  if (!file) return NextResponse.json({ error: 'No file' }, { status: 400 });
  const text = await file.text();
  const parsed = Papa.parse(text, { header: true, skipEmptyLines: true });
  const rows = parsed.data;

  let upserted = 0;
  for (const r of rows) {
    const partNumber = String(r.partNumber || '').toUpperCase().replace(/[\s-]/g,'');
    if (!partNumber) continue;
    const doc = {
      partNumber,
      aliases: String(r.aliases||'').split(';').map(s=>s.trim()).filter(Boolean),
      oemMake: r.oemMake || undefined,
      category: r.category || 'CAT',
      metalContent: {
        pt_g: Number(r.pt_g || 0),
        pd_g: Number(r.pd_g || 0),
        rh_g: Number(r.rh_g || 0),
      },
      recoveryRate: r.recoveryRate ? Number(r.recoveryRate) : 0.9,
      status: 'active',
    };
    await Converter.updateOne({ partNumber }, { $set: doc }, { upsert: true });
    upserted++;
  }
  return NextResponse.json({ ok: true, upserted });
}
