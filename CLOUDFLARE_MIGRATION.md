# Noirknull → Cloudflare migration

This repo is prepared for Cloudflare Workers + R2. The React/Vite storefront will be served by Cloudflare static assets, while Worker API routes use R2.

## 1. Create R2 storage

```bash
npx wrangler login
npx wrangler r2 bucket create noirknull-prod
```

## 2. Deploy the Cloudflare Worker

```bash
npm install
npm run build
npx wrangler deploy
```

The first deployment is intentionally on the Cloudflare `workers.dev` hostname so the existing `noirknull.in` site stays untouched during migration.

## 3. Set the one-time migration secret

```bash
npx wrangler secret put MIGRATION_TOKEN
```

Choose a random private value. Do not commit it.

## 4. Copy the existing Vercel data into R2

After the first Cloudflare deployment:

```bash
curl -X POST https://noirknull.in/api/migrate-from-vercel \
  -H "Authorization: Bearer YOUR_MIGRATION_TOKEN"
```

This pulls the existing shared store from the current Vercel deployment and copies all referenced `/api/media` objects into R2. The existing relative media URLs remain unchanged, so the storefront does not need a data rewrite.

## 5. Verify before cutover

Use the `workers.dev` URL shown by `npx wrangler deploy` and check:

- `/api/health`
- `/api/store`
- storefront
- `/admin`
- a product edit from one device appearing on another device

Do not delete or change the Vercel domain until these checks pass.

## 6. Final domain cutover

After the Cloudflare version is verified, edit `wrangler.jsonc` and uncomment the final `noirknull.in` Custom Domain configuration. Deploy again. Cloudflare Custom Domains can manage the hostname and certificates for the Worker.

Only after `https://noirknull.in` is serving the Cloudflare Worker successfully should you retire the Vercel deployment.

## 7. Automatic GitHub deployments

A GitHub Actions workflow is included. Add repository secrets named:

- `CLOUDFLARE_API_TOKEN`
- `CLOUDFLARE_ACCOUNT_ID`

Every push to `main` will then build and deploy Noirknull to Cloudflare.
