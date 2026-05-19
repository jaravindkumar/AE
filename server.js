const express = require('express');
const cors = require('cors');
const NodeCache = require('node-cache');
const { scrapeAllTrusts } = require('./ae-scraper');

const app = express();
const cache = new NodeCache({ stdTTL: 300 }); // 5 minute cache
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Get all A&E wait times
app.get('/api/ae-wait-times', async (req, res) => {
  try {
    const cached = cache.get('ae-data');
    if (cached) {
      return res.json({ data: cached, fromCache: true });
    }

    const data = await scrapeAllTrusts();
    cache.set('ae-data', data);
    res.json({ data, fromCache: false });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch wait times' });
  }
});

// Get nearest A&E by coordinates
app.get('/api/nearest', async (req, res) => {
  const { lat, lng, limit = 3 } = req.query;

  if (!lat || !lng) {
    return res.status(400).json({ error: 'lat and lng are required' });
  }

  try {
    const cached = cache.get('ae-data') || await scrapeAllTrusts();

    const withDistance = cached.map(trust => ({
      ...trust,
      distance: calculateDistance(
        parseFloat(lat), parseFloat(lng),
        trust.location.lat, trust.location.lng
      )
    }));

    withDistance.sort((a, b) => a.distance - b.distance);
    res.json({ data: withDistance.slice(0, parseInt(limit)) });
  } catch (error) {
    res.status(500).json({ error: 'Failed to find nearest A&E' });
  }
});

// Get single trust by ID
app.get('/api/ae-wait-times/:id', async (req, res) => {
  try {
    const cached = cache.get('ae-data') || await scrapeAllTrusts();
    const trust = cached.find(t => t.id === req.params.id);

    if (!trust) {
      return res.status(404).json({ error: 'Trust not found' });
    }

    res.json({ data: trust });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch trust data' });
  }
});

// Force refresh cache
app.post('/api/refresh', async (req, res) => {
  try {
    cache.del('ae-data');
    const data = await scrapeAllTrusts();
    cache.set('ae-data', data);
    res.json({ data, message: 'Cache refreshed' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to refresh data' });
  }
});

// Stats endpoint
app.get('/api/stats', async (req, res) => {
  try {
    const cached = cache.get('ae-data') || await scrapeAllTrusts();
    const stats = {
      totalTrusts: cached.length,
      averageWait: Math.round(cached.reduce((sum, t) => sum + t.waitTimeMinutes, 0) / cached.length),
      shortest: cached.reduce((min, t) => t.waitTimeMinutes < min.waitTimeMinutes ? t : min),
      longest: cached.reduce((max, t) => t.waitTimeMinutes > max.waitTimeMinutes ? t : max),
      byStatus: {
        low: cached.filter(t => t.status === 'low').length,
        medium: cached.filter(t => t.status === 'medium').length,
        high: cached.filter(t => t.status === 'high').length,
        critical: cached.filter(t => t.status === 'critical').length
      },
      lastUpdated: new Date().toISOString()
    };
    res.json({ data: stats });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
});

function calculateDistance(lat1, lng1, lat2, lng2) {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLng/2) * Math.sin(dLng/2);
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
}

app.listen(PORT, () => {
  console.log(`A&E Wait Times API running on port ${PORT}`);
});

module.exports = app;
