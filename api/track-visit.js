const ALLOWED_ORIGINS = new Set([
  'https://thermau5.github.io',
  'https://thermau5-github-io.vercel.app',
]);

// Vercel's edge network geolocates every request and passes the result in
// x-vercel-ip-* headers, so the browser doesn't need a third-party IP lookup.
function locationFromHeaders(req) {
  const decode = (value) => {
    if (!value) return '';
    try {
      return decodeURIComponent(value);
    } catch {
      return value;
    }
  };

  const countryCode = req.headers['x-vercel-ip-country'];
  let country = '';
  if (countryCode) {
    try {
      // Expand "US" -> "United States" to match the country names already
      // stored in the bin (previously sourced from ipapi.co's country_name).
      country = new Intl.DisplayNames(['en'], { type: 'region' }).of(countryCode) || countryCode;
    } catch {
      country = countryCode;
    }
  }

  const lat = parseFloat(req.headers['x-vercel-ip-latitude']);
  const lng = parseFloat(req.headers['x-vercel-ip-longitude']);

  return {
    city: decode(req.headers['x-vercel-ip-city']),
    country,
    region: decode(req.headers['x-vercel-ip-country-region']),
    lat: Number.isFinite(lat) ? lat : null,
    lng: Number.isFinite(lng) ? lng : null,
  };
}

export default async function handler(req, res) {
  const origin = req.headers.origin;
  if (origin && ALLOWED_ORIGINS.has(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Vary', 'Origin');
  }
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  if (req.method !== 'GET' && req.method !== 'POST') {
    res.setHeader('Allow', ['GET', 'POST']);
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const BIN_ID = process.env.JSONBIN_BIN_ID;
  const API_KEY = process.env.JSONBIN_API_KEY;
  const JSONBIN_URL = `https://api.jsonbin.io/v3/b/${BIN_ID}`;

  if (!BIN_ID || !API_KEY) {
    return res.status(500).json({ error: 'Server not configured with JSONBin env vars' });
  }

  try {
    // 1) Load existing data
    const latestResp = await fetch(`${JSONBIN_URL}/latest`, {
      headers: { 'X-Master-Key': API_KEY }
    });

    let visitorData;
    if (latestResp.ok) {
      const json = await latestResp.json();
      visitorData = json.record || {};
    } else {
      visitorData = {};
    }

    // 2) Normalize existing structure
    visitorData.totalVisits = visitorData.totalVisits || 0;
    visitorData.countries = visitorData.countries || {};
    visitorData.cities = visitorData.cities || {};
    visitorData.knownVisits = visitorData.knownVisits || 0;

    // GET returns current stats without recording a visit
    if (req.method === 'GET') {
      return res.status(200).json(visitorData);
    }

    // 3) Update totals. Prefer Vercel's geo headers; fall back to a
    // client-supplied body (local dev, where the headers are absent).
    const headerLocation = locationFromHeaders(req);
    const body = req.body || {};
    const city = headerLocation.city || body.city || '';
    const country = headerLocation.country || body.country || '';
    const region = headerLocation.region || body.region || '';
    const lat = headerLocation.lat ?? body.lat ?? null;
    const lng = headerLocation.lng ?? body.lng ?? null;

    visitorData.totalVisits += 1;

    const safeCountry = country || 'Unknown Country';
    const safeCity = city || 'Unknown City';
    const cityKey = `${safeCity}, ${safeCountry}`;

    if (!visitorData.cities[cityKey]) {
      visitorData.cities[cityKey] = {
        visits: 0,
        lat: lat,
        lng: lng,
        region: region
      };
    }
    visitorData.cities[cityKey].visits += 1;

    if (safeCountry !== 'Unknown Country') {
      if (!visitorData.countries[safeCountry]) {
        visitorData.countries[safeCountry] = 0;
      }
      visitorData.countries[safeCountry] += 1;
      visitorData.knownVisits += 1;
    }

    visitorData.lastVisit = new Date().toISOString();

    // 4) Save back to JSONBin
    const putResp = await fetch(JSONBIN_URL, {
      method: 'PUT',
      headers: {
        'X-Master-Key': API_KEY,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(visitorData)
    });

    if (!putResp.ok) {
      const text = await putResp.text();
      console.error('JSONBin PUT failed:', putResp.status, text);
      return res.status(502).json({ error: 'Failed to save to JSONBin' });
    }

    return res.status(200).json(visitorData);
  } catch (err) {
    console.error('track-visit error:', err);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}
