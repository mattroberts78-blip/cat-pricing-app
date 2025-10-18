'use client';
import { useEffect, useState } from 'react';

export default function SkuPage({ params }){
  const [data,setData]=useState(null);
  useEffect(()=>{
    fetch('/api/pricing/sku/'+encodeURIComponent(params.part)).then(r=>r.json()).then(setData);
  },[params.part]);
  if(!data) return <main><p>Loading…</p></main>;
  if(data.error) return <main><p>{data.error}</p></main>;
  return (
    <main>
      <h1>SKU {data.partNumber}</h1>
      <h3>Price: ${data.price?.toFixed(2)}</h3>
      <p><strong>Breakdown</strong></p>
      <ul>
        <li>Pt (USD): {data.breakdown.pt_usd.toFixed(2)}</li>
        <li>Pd (USD): {data.breakdown.pd_usd.toFixed(2)}</li>
        <li>Rh (USD): {data.breakdown.rh_usd.toFixed(2)}</li>
        <li>Recovery Rate: {data.breakdown.recoveryRate}</li>
        <li>Base: {data.breakdown.base.toFixed(2)}</li>
      </ul>
      <p>Metals as of {new Date(data.metals.asOfDate).toLocaleDateString()}</p>
    </main>
  );
}
