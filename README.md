# London A&E Wait Times

Real-time A&E (Accident & Emergency) waiting times for London NHS trusts.

## Features

- Live wait times for 10 London NHS trusts
- Map view with Leaflet
- Nearest A&E based on geolocation
- Auto-refreshes every 5 minutes
- Mobile responsive

## Quick Start

```bash
npm install
npm run dev          # Start backend on :3001
npm run frontend     # Start frontend on :3000
```

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | /health | Health check |
| GET | /api/ae-wait-times | All trust wait times |
| GET | /api/nearest?lat=&lng= | Nearest trusts |
| GET | /api/ae-wait-times/:id | Single trust |
| GET | /api/stats | Summary statistics |
| POST | /api/refresh | Force cache refresh |

## Deployment

- Frontend: Vercel (`vercel --prod`)
- Backend: Railway (`railway up`)
- Container: `docker-compose up`

## NHS Trusts Covered

1. King's College Hospital
2. Guy's & St Thomas'
3. UCLH
4. Imperial College
5. Barts Health
6. Royal Free
7. Whittington
8. Lewisham & Greenwich
9. Epsom & St Helier
10. Croydon

## Tech Stack

- Backend: Node.js, Express, Cheerio, Axios
- Frontend: React, Leaflet, react-leaflet
- Deployment: Vercel + Railway
