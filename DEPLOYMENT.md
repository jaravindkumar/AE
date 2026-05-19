# Deployment Guide

## Vercel (Frontend)

```bash
npm i -g vercel
vercel login
vercel link
vercel --prod
```

## Railway (Backend)

```bash
npm i -g @railway/cli
railway login
railway link
railway up
```

## Environment Variables

### Vercel Dashboard
- `REACT_APP_API_URL` = your Railway URL

### Railway Dashboard
- `NODE_ENV` = production
- `PORT` = 3001 (auto-set)

## Docker (Self-hosted)

```bash
docker-compose up --build -d
```

## CI/CD (GitHub Actions)

Automatic on push to `main`. Set these secrets:
- `VERCEL_TOKEN` - from vercel.com/account/tokens
- `RAILWAY_TOKEN` - from railway.app/account

## Rollback

```bash
git revert <commit-hash>
git push origin main
```

## Monitoring

- Vercel: vercel.com/dashboard
- Railway: railway.app/dashboard
- Health: GET /health
