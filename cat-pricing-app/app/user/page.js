'use client';
import { useEffect, useState } from 'react';

export default function User() {
  const [q,setQ]=useState('');
  const [hits,setHits]=useState([]);

  useEffect(()=>{
    const id=setTimeout(async()=>{
      if(!q) return setHits([]);
      const r=await fetch('/api/search?q='+encodeURIComponent(q));
      const j=await r.json();
      setHits(j.hits||[]);
    }, 120);
    return ()=>clearTimeout(id);
  },[q]);

  return (
    <main>
      <h1>Search</h1>
      <input placeholder="Start typing a part number..." value={q} onChange={e=>setQ(e.target.value)} style={{display:'block', width:'100%', maxWidth:480, padding:8}}/>
      {hits.length>0 && (
        <div style={{border:'1px solid #ddd', borderRadius:8, marginTop:8}}>
          {hits.map(h=> (
            <a key={h._id} href={'/user/sku/'+h.partNumber} style={{display:'block', padding:8, borderTop:'1px solid #eee', textDecoration:'none'}}>
              <div style={{fontFamily:'monospace'}}>{h.partNumber}</div>
              <div style={{fontSize:12, color:'#555'}}>{h.oemMake||''} · {h.category||''}</div>
            </a>
          ))}
        </div>
      )}
    </main>
  );
}
