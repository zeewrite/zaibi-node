const path = require('path');
const express = require('express');
const cors = require('cors');
const { generateAddress, SUPPORTED_COUNTRIES } = require('./addressGenerator');

const app = express();
const PORT = process.env.PORT || 3000;
const MAX_BATCH = 50;

app.use(cors());
app.use(express.json());

const frontendDir = path.resolve(__dirname, '..', 'frontend');
app.use(express.static(frontendDir));

app.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.get('/countries', (_req, res) => {
  res.json({ countries: SUPPORTED_COUNTRIES });
});

app.get('/generate-address', (req, res) => {
  const rawCountry = typeof req.query.country === 'string' ? req.query.country : '';
  const country = rawCountry.trim().toUpperCase();
  const rawCount = req.query.count;
  let count = 1;

  if (rawCount !== undefined) {
    const parsed = Number.parseInt(Array.isArray(rawCount) ? rawCount[0] : rawCount, 10);
    if (!Number.isFinite(parsed) || parsed < 1) {
      return res.status(400).json({
        error: 'invalid_count',
        message: '"count" must be a positive integer.',
      });
    }
    if (parsed > MAX_BATCH) {
      return res.status(400).json({
        error: 'count_too_large',
        message: `"count" must be <= ${MAX_BATCH}.`,
      });
    }
    count = parsed;
  }

  if (!country) {
    return res.status(400).json({
      error: 'missing_country',
      message: '"country" query parameter is required.',
      supported: SUPPORTED_COUNTRIES.map((c) => c.code),
    });
  }

  const match = SUPPORTED_COUNTRIES.find(
    (c) => c.code === country || c.aliases.includes(country),
  );

  if (!match) {
    return res.status(400).json({
      error: 'unsupported_country',
      message: `Country "${rawCountry}" is not supported.`,
      supported: SUPPORTED_COUNTRIES.map((c) => c.code),
    });
  }

  try {
    const addresses = Array.from({ length: count }, () => generateAddress(match.code));
    res.json({
      country: match.code,
      countryName: match.name,
      count: addresses.length,
      addresses,
    });
  } catch (err) {
    console.error('generator_error', err);
    res.status(500).json({
      error: 'generator_error',
      message: 'Failed to generate address.',
    });
  }
});

app.use((_req, res) => {
  res.status(404).json({ error: 'not_found' });
});

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Random address generator listening on http://localhost:${PORT}`);
  });
}

module.exports = app;
