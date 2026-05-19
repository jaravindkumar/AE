# Quick Start Guide

## 30-Minute Setup

### Prerequisites
- Node.js 18+
- npm 8+
- Git

### 1. Install & Run

```bash
npm install
npm run dev          # Backend on :3001
npm run frontend     # Frontend on :3000
```

### 2. Test the API

```bash
curl http://localhost:3001/health
curl http://localhost:3001/api/ae-wait-times
curl http://localhost:3001/api/stats
```

### 3. Open the App

Visit: http://localhost:3000

### 4. Deploy

```bash
# Frontend
vercel --prod

# Backend
railway up
```

## Common Issues

**Port already in use:**
```bash
lsof -ti:3001 | xargs kill
```

**Missing dependencies:**
```bash
rm -rf node_modules && npm install
```
