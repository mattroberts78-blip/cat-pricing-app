export const metadata = { title: process.env.NEXT_PUBLIC_APP_NAME || 'Cat Pricing' };

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body style={{ fontFamily: 'system-ui, sans-serif', margin: 0 }}>
        <div style={{ maxWidth: 960, margin: '0 auto', padding: 16 }}>
          <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <a href="/" style={{ textDecoration: 'none', fontWeight: 700 }}>{process.env.NEXT_PUBLIC_APP_NAME || 'Cat Pricing'}</a>
            <nav style={{ display: 'flex', gap: 12 }}>
              <a href="/admin">Admin</a>
              <a href="/user">User</a>
            </nav>
          </header>
          {children}
        </div>
      </body>
    </html>
  );
}
