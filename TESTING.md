# Testing Guide

## API Tests

```bash
# Health check
curl http://localhost:3001/health

# All wait times
curl http://localhost:3001/api/ae-wait-times | jq .

# Nearest to central London
curl "http://localhost:3001/api/nearest?lat=51.5074&lng=-0.1278&limit=3" | jq .

# Single trust
curl http://localhost:3001/api/ae-wait-times/kings | jq .

# Statistics
curl http://localhost:3001/api/stats | jq .

# Force refresh
curl -X POST http://localhost:3001/api/refresh | jq .
```

## Frontend Tests

1. Open http://localhost:3000
2. Allow location access when prompted
3. Check "Nearest to You" section appears
4. Toggle between List and Map views
5. Click Refresh button
6. Check mobile view (resize browser)

## Expected Responses

### Health Check
```json
{"status":"ok","timestamp":"2024-01-01T12:00:00.000Z"}
```

### Wait Times
```json
{
  "data": [
    {
      "id": "kings",
      "name": "King's College Hospital...",
      "waitTimeMinutes": 95,
      "status": "medium",
      "isLive": false,
      "lastUpdated": "2024-01-01T12:00:00.000Z"
    }
  ],
  "fromCache": false
}
```
