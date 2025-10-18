'use client';
import { useState } from 'react';

export default function Login({ searchParams }) {
  const [u, setU] = useState('');
  const [p, setP] = useState('');
  async function submit(e) {
    e.preventDefault();
    const r = await fetch('/api/auth', { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify({ u, p }) });
    if (r.ok) {
      const next = new URLSearchParams(window.location.search).get('next') || '/';
      window.location.href = next;
    } else {
      alert('Invalid credentials');
    }
  }
  return (
    <main>
      <h1>Sign in</h1>
      <form onSubmit={submit}>
        <input placeholder="Username" value={u} onChange={e=>setU(e.target.value)} style={{display:'block', margin:'8px 0', padding:8, width:300}} />
        <input placeholder="Password" type="password" value={p} onChange={e=>setP(e.target.value)} style={{display:'block', margin:'8px 0', padding:8, width:300}} />
        <button>Sign in</button>
      </form>
    </main>
  );
}
