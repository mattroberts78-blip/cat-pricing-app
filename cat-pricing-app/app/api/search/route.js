export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Converter from '@/models/Converter';

export async function GET(req) {
  await connectDB();
  const q = (new URL(req.url).searchParams.get('q') || '').toUpperCase().replace(/[\s-]/g,'');
  if (!q) return NextResponse.json({ hits: [] });
  const hits = await Converter.find({
    $or: [
      { partNumber: { $regex: '^' + q } },
      { aliases: { $elemMatch: { $regex: '^' + q, $options: 'i' } } }
    ]
  }).limit(10).select('partNumber oemMake category');
  return NextResponse.json({ hits });
}
