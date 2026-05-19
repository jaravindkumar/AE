const TRUSTS = [
  { id: 'kings',       shortName: "King's College",     borough: 'Southwark',     url: 'https://www.kch.nhs.uk/patients-visitors/emergency-department/',                              location: { lat: 51.4682, lng: -0.0878 } },
  { id: 'guys',        shortName: "Guy's & St Thomas'",  borough: 'Lambeth',       url: 'https://www.guysandstthomas.nhs.uk/our-services/accident-and-emergency',                     location: { lat: 51.4988, lng: -0.1179 } },
  { id: 'uch',         shortName: 'UCLH',               borough: 'Camden',         url: 'https://www.uclh.nhs.uk/our-services/emergency-services',                                    location: { lat: 51.5248, lng: -0.1340 } },
  { id: 'imperial',    shortName: 'Imperial College',   borough: 'Hammersmith',    url: 'https://www.imperial.nhs.uk/patients-and-visitors/emergency-departments',                    location: { lat: 51.5141, lng: -0.1755 } },
  { id: 'barts',       shortName: 'Barts Health',       borough: 'Tower Hamlets',  url: 'https://www.bartshealth.nhs.uk/ae',                                                          location: { lat: 51.5178, lng: -0.0575 } },
  { id: 'royal-free',  shortName: 'Royal Free',         borough: 'Barnet',         url: 'https://www.royalfree.nhs.uk/services/services-a-z/accident-and-emergency/',                location: { lat: 51.5530, lng: -0.1655 } },
  { id: 'whittington', shortName: 'Whittington',        borough: 'Islington',      url: 'https://www.whittington.nhs.uk/default.asp?c=26328',                                        location: { lat: 51.5642, lng: -0.1193 } },
  { id: 'lewisham',    shortName: 'Lewisham',           borough: 'Lewisham',       url: 'https://www.lewishamandgreenwich.nhs.uk/patients-and-visitors/emergency-care',              location: { lat: 51.4605, lng: -0.0133 } },
  { id: 'epsom',       shortName: 'Epsom & St Helier',  borough: 'Sutton',         url: 'https://www.epsom-sthelier.nhs.uk/accident-and-emergency',                                  location: { lat: 51.3667, lng: -0.2667 } },
  { id: 'croydon',     shortName: 'Croydon',            borough: 'Croydon',        url: 'https://www.croydonhealthservices.nhs.uk/patients-visitors/emergency-department/',          location: { lat: 51.3762, lng: -0.1038 } },
];

function getStatus(m) {
  if (m < 60) return 'low';
  if (m < 120) return 'medium';
  if (m < 180) return 'high';
  return 'critical';
}

function estimatedWait(seed) {
  const h = new Date().getHours();
  const base = h >= 18 && h <= 22 ? 150 : h >= 12 ? 120 : h >= 8 ? 90 : 60;
  return Math.max(15, base + ((seed * 17) % 60) - 30);
}

function parseWaitFromHtml(html) {
  const patterns = [
    /current\s+wait(?:ing)?\s+time[^0-9]*(\d+)\s*(hour|hr|h|minute|min|m)/gi,
    /(\d+)\s*(hour|hr|h|minute|min|m)[^a-z]*wait/gi,
    /wait(?:ing)?\s+time[^0-9]*(\d+)\s*(hour|hr|h|minute|min|m)/gi,
    /(\d+)\s*(hour|hr|h)\s*(\d+)?\s*(minute|min|m)?/gi,
  ];
  for (const pattern of patterns) {
    pattern.lastIndex = 0;
    const m = pattern.exec(html);
    if (m) {
      const val = parseInt(m[1]);
      const unit = (m[2] || '').toLowerCase();
      if (unit.startsWith('h')) return val * 60 + (parseInt(m[3]) || 0);
      return val;
    }
  }
  return null;
}

async function scrape(trust, index) {
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 6000);
    const res = await fetch(trust.url, {
      signal: controller.signal,
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; NHSWaitBot/1.0)' }
    });
    clearTimeout(timer);
    const html = await res.text();
    const wait = parseWaitFromHtml(html);
    if (wait && wait > 0 && wait < 600) {
      return { ...trust, waitTimeMinutes: wait, status: getStatus(wait), isLive: true, lastUpdated: new Date().toISOString() };
    }
  } catch {}
  const w = estimatedWait(index + 1);
  return { ...trust, waitTimeMinutes: w, status: getStatus(w), isLive: false, lastUpdated: new Date().toISOString() };
}

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate=600');

  const data = await Promise.all(TRUSTS.map((t, i) => scrape(t, i)));
  res.status(200).json({ data, fromCache: false });
};
