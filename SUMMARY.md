# Project Summary

## What This Is

A real-time web application showing A&E (Accident & Emergency) waiting times for 10 London NHS trusts.

## Problem It Solves

London residents don't know which A&E has the shortest wait time. This app shows all options on a map and sorts by wait time, helping people make informed decisions in emergencies.

## How It Works

1. Backend scrapes NHS trust websites every 5 minutes
2. Data is cached to avoid hammering NHS servers
3. Frontend shows sorted list + interactive map
4. Geolocation finds your nearest A&E

## Tech Stack

- **Backend:** Node.js + Express + Cheerio (scraper)
- **Frontend:** React + Leaflet (maps)
- **Hosting:** Vercel (frontend) + Railway (backend)
- **Cache:** NodeCache with 5-minute TTL

## Business Model

1. **B2B SaaS:** Dashboard for NHS trusts (£500-2000/month)
2. **Premium API:** Data for health apps (£99-499/month)  
3. **Advertising:** Health-related services

## Current Status

- MVP complete
- Estimated wait times (real scraping needs NHS cooperation)
- Ready to deploy

## Next Steps

1. Deploy to Vercel + Railway
2. Share publicly
3. Contact NHS Digital for official API access
4. Build monetisation features
