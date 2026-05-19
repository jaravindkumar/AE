const https = require('https');
const http = require('http');

const TRUSTS = [
  { id: 'kings',       shortName: "King's College",     borough: 'Southwark',     location: { lat: 51.4682, lng: -0.0878 } },
  { id: 'guys',        shortName: "Guy's & St Thomas'",  borough: 'Lambeth',       location: { lat: 51.4988, lng: -0.1179 } },
  { id: 'uch',         shortName: 'UCLH',               borough: 'Camden',         location: { lat: 51.5248, lng: -0.1340 } },
  { id: 'imperial',    shortName: 'Imperial College',   borough: 'Hammersmith',    location: { lat: 51.5141, lng: -0.1755 } },
  { id: 'barts',       shortName: 'Barts Health',       borough: 'Tower Hamlets',  location: { lat: 51.5178, lng: -0.0575 } },
  { id: 'royal-free',  shortName: 'Royal Free',         borough: 'Barnet',         location: { lat: 51.5530, lng: -0.1655 } },
  { id: 'whittington', shortName: 'Whittington',        borough: 'Islington',      location: { lat: 51.5642, lng: -0.1193 } },
  { id: 'lewisham',    shortName: 'Lewisham',           borough: 'Lewisham',       location: { lat: 51.4605, lng: -0.0133 } },
  { id: 'epsom',       shortName: 'Epsom & St Helier',  borough: 'Sutton',         location: { lat: 51.3667, lng: -0.2667 } },
  { id: 'croydon',     shortName: 'Croydon',            borough: 'Croydon',        location: { lat: 51.3762, lng: -0.1038 } },
];

function estimatedWait(seed) {
  const h = new Date().getHours();
  const base = h >= 18 && h <= 22 ? 150 : h >= 12 ? 120 : h >= 8 ? 90 : 60;
  // deterministic-ish per trust so it doesn't change on every call
  const variance = ((seed * 17) % 60) - 30;
  return Math.max(15, base + variance);
}

function getStatus(m) {
  if (m < 60) return 'low';
  if (m < 120) return 'medium';
  if (m < 180) return 'high';
  return 'critical';
}

module.exports = function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate');

  const data = TRUSTS.map((t, i) => {
    const w = estimatedWait(i + 1);
    return { ...t, waitTimeMinutes: w, status: getStatus(w), isLive: false, lastUpdated: new Date().toISOString() };
  });

  res.status(200).json({ data, fromCache: false });
};
