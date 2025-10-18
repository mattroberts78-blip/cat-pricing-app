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
