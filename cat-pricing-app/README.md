# Cat Pricing App (MVP)

A minimal private pricing app for catalytic converters. Admin sets daily metal prices and imports a CSV of SKUs with metal grams. Users can search by part number and see a price breakdown.

> **Security note:** This MVP uses a simple cookie-based gate with a single username/password from `.env.local`. Replace with NextAuth/SAML/Okta before production.

## Quick Start

1. Install Node.js 18+.
2. Create a MongoDB Atlas database (free tier is fine) and copy the connection string.
3. Download this project, run:

```bash
npm install
cp .env.example .env.local
# fill in MONGODB_URI, ADMIN_USERNAME, ADMIN_PASSWORD in .env.local
npm run dev
```

Open http://localhost:3000 and sign in with your admin creds.

### Admin Console

- Set today's metal prices (USD per gram) for **Pt**, **Pd**, **Rh**.
- Import CSV with headers:

```
partNumber,pt_g,pd_g,rh_g,oemMake,category,aliases
ABC123,1.1,2.2,0.3,Toyota,CAT,ABC-123;TOY-ABC123
```

### User Console

- Start typing a part number → suggestions list appears.
- Click a result to view the live price breakdown.

## Next Steps

- Replace simple auth with robust RBAC (NextAuth + roles).
- Add **customers** and **pricingRules** collections for per-customer pricing.
- Use **Atlas Search** with `autocomplete` index for fast fuzzy search.
- Add **quotes** + auditing.
- Build a nicer UI (Tailwind + shadcn/ui).

## License

MIT
