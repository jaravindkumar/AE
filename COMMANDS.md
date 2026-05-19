# Commands Reference

## Development

```bash
# Install
npm install

# Run backend
npm run dev

# Run frontend
REACT_APP_API_URL=http://localhost:3001 npm run frontend

# Run both (separate terminals)
npm run dev &
npm run frontend
```

## Git

```bash
git status
git add .
git commit -m "message"
git push origin main
git log --oneline
```

## Docker

```bash
docker-compose up
docker-compose up --build
docker-compose down
```

## Deployment

```bash
# Vercel
vercel login
vercel --prod

# Railway
railway login
railway link
railway up
```

## API

```bash
curl http://localhost:3001/health
curl http://localhost:3001/api/ae-wait-times
curl "http://localhost:3001/api/nearest?lat=51.5074&lng=-0.1278"
curl -X POST http://localhost:3001/api/refresh
```
