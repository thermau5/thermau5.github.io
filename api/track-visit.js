export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { city, country, region, lat, lng } = req.body || {};

  if (!country) {
    return res.status(400).json({ error: 'Country is required' });
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

    // 3) Update totals
    visitorData.totalVisits += 1;

    const safeCountry = country || 'Unknown Country';
    const safeCity = city || 'Unknown City';
    const cityKey = `${safeCity}, ${safeCountry}`;

    if (!visitorData.cities[cityKey]) {
      visitorData.cities[cityKey] = {
        visits: 0,
        lat: lat || null,
        lng: lng || null,
        region: region || ''
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

