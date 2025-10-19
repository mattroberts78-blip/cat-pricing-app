const [fileRetail, setFileRetail] = useState(null);
const [part, setPart] = useState('');
const [cmp, setCmp] = useState(null);

async function importRetail(e){
  e.preventDefault();
  if(!fileRetail) return;
  const fd = new FormData();
  fd.append('file', fileRetail);
  const r = await fetch('/api/admin/retail/import', { method: 'POST', body: fd });
  const j = await r.json();
  alert(r.ok ? `Parsed ${j.count} items` : 'Import failed');
}

async function compareOne(e){
  e.preventDefault();
  const r = await fetch('/api/admin/compare?part='+encodeURIComponent(part));
  const j = await r.json();
  setCmp(j);
}

'use client';
import { useState } from 'react';

export default function Admin() {
  const [pt,setPt]=useState('');
  const [pd,setPd]=useState('');
  const [rh,setRh]=useState('');
  const [file,setFile]=useState(null);

  async function saveMetals(e){
    e.preventDefault();
    const r = await fetch('/api/admin/metal-prices', { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify({ pt: parseFloat(pt), pd: parseFloat(pd), rh: parseFloat(rh) })});
    alert(r.ok ? 'Saved' : 'Failed');
  }

  async function importCsv(e){
    e.preventDefault();
    if(!file) return;
    const fd = new FormData();
    fd.append('file', file);
    const r = await fetch('/api/admin/converters/import', { method: 'POST', body: fd });
    const j = await r.json();
    alert(r.ok ? `Imported ${j.upserted} items` : 'Import failed');
  }

  return (
    <main>
      <h1>Admin Console</h1>

      <section style={{marginTop:24}}>
        <h2>1) Set Today&apos;s Metals (USD per gram)</h2>
        <form onSubmit={saveMetals}>
          <input placeholder="Platinum (pt)" value={pt} onChange={e=>setPt(e.target.value)} style={{marginRight:8}}/>
          <input placeholder="Palladium (pd)" value={pd} onChange={e=>setPd(e.target.value)} style={{marginRight:8}}/>
          <input placeholder="Rhodium (rh)" value={rh} onChange={e=>setRh(e.target.value)} style={{marginRight:8}}/>
          <button>Save</button>
        </form>
      </section>

      <section style={{marginTop:24}}>
        <h2>2) Import Converters CSV</h2>
        <p>CSV headers: partNumber, pt_g, pd_g, rh_g, oemMake, category, aliases (semicolon-separated)</p>
        <input type="file" accept=".csv" onChange={e=>setFile(e.target.files?.[0]||null)} />
        <button onClick={importCsv} style={{marginLeft:8}}>Upload</button>
      </section>
    </main>
  );
}
<section style={{marginTop:24}}>
  <h2>Import Retail Price List (CSV)</h2>
  <p>CSV headers: make, partNumber, price, unit (unit optional)</p>
  <input type="file" accept=".csv" onChange={e=>setFileRetail(e.target.files?.[0]||null)} />
  <button onClick={importRetail} style={{marginLeft:8}}>Upload</button>
</section>
<section style={{marginTop:24}}>
  <h2>Compare One Part</h2>
  <form onSubmit={compareOne}>
    <input placeholder="Part number" value={part} onChange={e=>setPart(e.target.value)} />
    <button style={{marginLeft:8}}>Compare</button>
  </form>
  {cmp && !cmp.error && (
    <div style={{marginTop:12}}>
      <div><strong>Part:</strong> {cmp.partNumber}</div>
      <div><strong>Dynamic Price:</strong> ${cmp.dynamic?.toFixed(2)}</div>
      <div><strong>Retail (latest):</strong> {cmp.retail?.price?.toFixed?.(2) ?? '—'}</div>
      <div><strong>Metals as of:</strong> {new Date(cmp.metals.asOfDate).toLocaleDateString()}</div>
    </div>
  )}
  {cmp && cmp.error && <p style={{color:'crimson'}}>{cmp.error}</p>}
</section>
