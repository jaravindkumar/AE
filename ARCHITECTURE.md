# Architecture

## System Overview

```
User Browser
    │
    ▼
React Frontend (Vercel)
    │ API calls
    ▼
Express API (Railway)
    │
    ├── NodeCache (5min TTL)
    │
    └── Web Scraper
            │
            ▼
    10 NHS Trust Websites
```

## Components

### Backend (`server.js`)
- Express REST API
- NodeCache for 5-minute caching
- 6 endpoints

### Scraper (`ae-scraper.js`)
- Axios HTTP client
- Cheerio HTML parser
- Fallback to estimated wait times
- Time-based realistic estimates

### Frontend (`AEWaitTimes.jsx`)
- React 18
- Leaflet maps
- Geolocation API
- Auto-refresh every 5 minutes

## Data Flow

1. User loads page
2. Frontend calls `/api/ae-wait-times`
3. Server checks cache (5min TTL)
4. Cache miss: scrape all 10 trusts in parallel
5. Store in cache
6. Return JSON to frontend
7. Frontend renders list + map

## Caching Strategy

- TTL: 5 minutes
- Parallel scraping of all trusts
- Graceful fallback to estimated data
- Force-refresh endpoint for manual updates
