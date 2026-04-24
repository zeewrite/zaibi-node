const { test } = require('node:test');
const assert = require('node:assert/strict');
const http = require('node:http');
const app = require('../server');
const { generateAddress, SUPPORTED_COUNTRIES } = require('../addressGenerator');

function listen() {
  return new Promise((resolve) => {
    const server = app.listen(0, () => resolve(server));
  });
}

function fetchJson(port, pathname) {
  return new Promise((resolve, reject) => {
    http
      .get({ host: '127.0.0.1', port, path: pathname }, (res) => {
        let body = '';
        res.on('data', (chunk) => (body += chunk));
        res.on('end', () => {
          try {
            resolve({ status: res.statusCode, body: JSON.parse(body) });
          } catch (err) {
            reject(err);
          }
        });
      })
      .on('error', reject);
  });
}

test('generateAddress returns expected shape for each country', () => {
  for (const { code } of SUPPORTED_COUNTRIES) {
    const addr = generateAddress(code);
    assert.equal(addr.country, code);
    for (const field of ['fullName', 'streetAddress', 'city', 'state', 'zipCode', 'phoneNumber']) {
      assert.ok(typeof addr[field] === 'string' && addr[field].length > 0, `${code} missing ${field}`);
    }
  }
});

test('GET /generate-address returns 400 without country', async () => {
  const server = await listen();
  try {
    const { port } = server.address();
    const res = await fetchJson(port, '/generate-address');
    assert.equal(res.status, 400);
    assert.equal(res.body.error, 'missing_country');
  } finally {
    server.close();
  }
});

test('GET /generate-address rejects unsupported country', async () => {
  const server = await listen();
  try {
    const { port } = server.address();
    const res = await fetchJson(port, '/generate-address?country=Narnia');
    assert.equal(res.status, 400);
    assert.equal(res.body.error, 'unsupported_country');
  } finally {
    server.close();
  }
});

test('GET /generate-address returns one address for USA', async () => {
  const server = await listen();
  try {
    const { port } = server.address();
    const res = await fetchJson(port, '/generate-address?country=USA');
    assert.equal(res.status, 200);
    assert.equal(res.body.country, 'USA');
    assert.equal(res.body.count, 1);
    assert.equal(res.body.addresses.length, 1);
  } finally {
    server.close();
  }
});

test('GET /generate-address supports count parameter', async () => {
  const server = await listen();
  try {
    const { port } = server.address();
    const res = await fetchJson(port, '/generate-address?country=UK&count=5');
    assert.equal(res.status, 200);
    assert.equal(res.body.count, 5);
    assert.equal(res.body.addresses.length, 5);
  } finally {
    server.close();
  }
});

test('GET /generate-address rejects invalid count', async () => {
  const server = await listen();
  try {
    const { port } = server.address();
    const res = await fetchJson(port, '/generate-address?country=USA&count=0');
    assert.equal(res.status, 400);
    assert.equal(res.body.error, 'invalid_count');
  } finally {
    server.close();
  }
});

test('GET /generate-address rejects count over max', async () => {
  const server = await listen();
  try {
    const { port } = server.address();
    const res = await fetchJson(port, '/generate-address?country=USA&count=999');
    assert.equal(res.status, 400);
    assert.equal(res.body.error, 'count_too_large');
  } finally {
    server.close();
  }
});

test('country aliases are accepted (US -> USA, GB -> UK)', async () => {
  const server = await listen();
  try {
    const { port } = server.address();
    const r1 = await fetchJson(port, '/generate-address?country=US');
    assert.equal(r1.status, 200);
    assert.equal(r1.body.country, 'USA');
    const r2 = await fetchJson(port, '/generate-address?country=gb');
    assert.equal(r2.status, 200);
    assert.equal(r2.body.country, 'UK');
  } finally {
    server.close();
  }
});
