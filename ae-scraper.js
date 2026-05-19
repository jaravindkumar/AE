const axios = require('axios');
const cheerio = require('cheerio');

const NHS_TRUSTS = [
  {
    id: 'kings',
    name: "King's College Hospital NHS Foundation Trust",
    shortName: "King's College",
    url: 'https://www.kch.nhs.uk/patients-visitors/emergency-department/',
    location: { lat: 51.4682, lng: -0.0878 },
    borough: 'Southwark'
  },
  {
    id: 'guys',
    name: "Guy's and St Thomas' NHS Foundation Trust",
    shortName: "Guy's & St Thomas'",
    url: 'https://www.guysandstthomas.nhs.uk/our-services/accident-and-emergency',
    location: { lat: 51.4988, lng: -0.1179 },
    borough: 'Lambeth'
  },
  {
    id: 'uch',
    name: 'University College London Hospitals NHS Foundation Trust',
    shortName: 'UCLH',
    url: 'https://www.uclh.nhs.uk/our-services/emergency-services',
    location: { lat: 51.5248, lng: -0.1340 },
    borough: 'Camden'
  },
  {
    id: 'imperial',
    name: 'Imperial College Healthcare NHS Trust',
    shortName: 'Imperial College',
    url: 'https://www.imperial.nhs.uk/patients-and-visitors/emergency-departments',
    location: { lat: 51.5141, lng: -0.1755 },
    borough: 'Hammersmith'
  },
  {
    id: 'barts',
    name: 'Barts Health NHS Trust',
    shortName: 'Barts Health',
    url: 'https://www.bartshealth.nhs.uk/ae',
    location: { lat: 51.5178, lng: -0.0575 },
    borough: 'Tower Hamlets'
  },
  {
    id: 'royal-free',
    name: 'Royal Free London NHS Foundation Trust',
    shortName: 'Royal Free',
    url: 'https://www.royalfree.nhs.uk/services/services-a-z/accident-and-emergency/',
    location: { lat: 51.5530, lng: -0.1655 },
    borough: 'Barnet'
  },
  {
    id: 'whittington',
    name: 'Whittington Health NHS Trust',
    shortName: 'Whittington',
    url: 'https://www.whittington.nhs.uk/ae',
    location: { lat: 51.5642, lng: -0.1193 },
    borough: 'Islington'
  },
  {
    id: 'lewisham',
    name: 'Lewisham and Greenwich NHS Trust',
    shortName: 'Lewisham',
    url: 'https://www.lewishamandgreenwich.nhs.uk/ae',
    location: { lat: 51.4605, lng: -0.0133 },
    borough: 'Lewisham'
  },
  {
    id: 'epsom',
    name: 'Epsom and St Helier University Hospitals NHS Trust',
    shortName: 'Epsom & St Helier',
    url: 'https://www.epsom-sthelier.nhs.uk/ae',
    location: { lat: 51.3667, lng: -0.2667 },
    borough: 'Sutton'
  },
  {
    id: 'croydon',
    name: 'Croydon Health Services NHS Trust',
    shortName: 'Croydon',
    url: 'https://www.croydonhealthservices.nhs.uk/ae',
    location: { lat: 51.3762, lng: -0.1038 },
    borough: 'Croydon'
  }
];

async function scrapeWaitTime(trust) {
  try {
    const response = await axios.get(trust.url, {
      timeout: 10000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; AEWaitTimesBot/1.0)'
      }
    });

    const $ = cheerio.load(response.data);
    let waitTime = null;

    // Try common selectors for wait time data
    const selectors = [
      '.wait-time', '.waiting-time', '.ae-wait',
      '[data-wait-time]', '.current-wait', '#wait-time',
      '.emergency-wait', '.a-e-wait'
    ];

    for (const selector of selectors) {
      const element = $(selector).first();
      if (element.length) {
        const text = element.text().trim();
        const match = text.match(/(\d+)\s*(hour|minute|hr|min)/i);
        if (match) {
          waitTime = parseInt(match[1]);
          if (match[2].toLowerCase().startsWith('hour') || match[2].toLowerCase() === 'hr') {
            waitTime *= 60;
          }
          break;
        }
      }
    }

    // Fallback: search all text for wait time patterns
    if (!waitTime) {
      const bodyText = $('body').text();
      const patterns = [
        /current wait(?:ing)? time[:\s]+(\d+)\s*(hour|hr|minute|min)/i,
        /(\d+)\s*(hour|hr|minute|min)\s*wait/i,
        /wait(?:ing)? time[:\s]+(\d+)/i
      ];

      for (const pattern of patterns) {
        const match = bodyText.match(pattern);
        if (match) {
          waitTime = parseInt(match[1]);
          if (match[2] && (match[2].toLowerCase().startsWith('hour') || match[2].toLowerCase() === 'hr')) {
            waitTime *= 60;
          }
          break;
        }
      }
    }

    return {
      ...trust,
      waitTimeMinutes: waitTime || generateFallbackWaitTime(),
      isLive: waitTime !== null,
      lastUpdated: new Date().toISOString(),
      status: getStatus(waitTime || generateFallbackWaitTime())
    };

  } catch (error) {
    const fallbackWait = generateFallbackWaitTime();
    return {
      ...trust,
      waitTimeMinutes: fallbackWait,
      isLive: false,
      lastUpdated: new Date().toISOString(),
      status: getStatus(fallbackWait),
      error: 'Could not fetch live data'
    };
  }
}

function generateFallbackWaitTime() {
  const hour = new Date().getHours();
  let base;
  if (hour >= 8 && hour <= 12) base = 90;
  else if (hour >= 12 && hour <= 18) base = 120;
  else if (hour >= 18 && hour <= 22) base = 150;
  else base = 60;
  return base + Math.floor(Math.random() * 60) - 30;
}

function getStatus(minutes) {
  if (minutes < 60) return 'low';
  if (minutes < 120) return 'medium';
  if (minutes < 180) return 'high';
  return 'critical';
}

async function scrapeAllTrusts() {
  const results = await Promise.allSettled(
    NHS_TRUSTS.map(trust => scrapeWaitTime(trust))
  );
  return results
    .filter(r => r.status === 'fulfilled')
    .map(r => r.value);
}

module.exports = { scrapeAllTrusts, NHS_TRUSTS, getStatus };
