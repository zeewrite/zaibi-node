# Random Address Generator

A full-stack web app that generates realistic but fake addresses for the USA,
UK, Canada, and Australia. Built with Node.js + Express on the backend and
vanilla HTML / CSS / JavaScript on the frontend, using
[`@faker-js/faker`](https://fakerjs.dev/) for data generation.

## Features

- `GET /generate-address?country=USA` JSON API with country validation
- Supports **USA**, **UK**, **Canada**, and **Australia**
- Country-aware formatting: realistic postcodes, phone numbers, and state /
  province names per locale
- Batch generation via `&count=N` (up to 50 per request)
- Clean, responsive UI with dropdown + count selector
- One-click **copy to clipboard** for each generated address
- **Dark / light mode** toggle (respects `prefers-color-scheme`, remembers your choice)
- Mobile-responsive layout

## Project structure

```
random-address-generator/
├── backend/
│   ├── addressGenerator.js   # Per-country generators using @faker-js/faker
│   ├── server.js             # Express app + /generate-address endpoint
│   ├── package.json
│   └── test/
│       └── address.test.js   # Node built-in test runner
├── frontend/
│   ├── index.html
│   ├── styles.css
│   └── app.js
├── .gitignore
└── README.md
```

The Express server also serves the `frontend/` directory as static files, so
running the backend is enough to use the whole app.

## Requirements

- Node.js **18+** (tested on Node 22)
- npm (or pnpm / yarn)

## Run locally

```bash
cd backend
npm install
npm start
```

Then open [http://localhost:3000](http://localhost:3000).

For development with auto-reload on file save:

```bash
npm run dev
```

## API reference

### `GET /generate-address`

| Query param | Required | Description |
|-------------|----------|-------------|
| `country`   | yes      | One of `USA`, `UK`, `CA`, `AU` (aliases like `US`, `GB`, `CAN`, `AUS` also accepted) |
| `count`     | no       | Positive integer, max `50`. Defaults to `1`. |

**Example**

```bash
curl "http://localhost:3000/generate-address?country=USA"
```

```json
{
  "country": "USA",
  "countryName": "United States",
  "count": 1,
  "addresses": [
    {
      "country": "USA",
      "fullName": "Jordan Davis",
      "streetAddress": "4812 Oak Ridge Drive",
      "city": "Columbus",
      "state": "OH",
      "zipCode": "43215",
      "phoneNumber": "+1 (614) 555-0188"
    }
  ]
}
```

### `GET /countries`

Returns the list of supported countries.

### `GET /health`

Liveness check. Returns `{ "status": "ok" }`.

### Error responses

The API returns `400` with a JSON `{ error, message, supported? }` payload for:

- `missing_country` — no `country` provided
- `unsupported_country` — country is not one of the supported set
- `invalid_count` — `count` is not a positive integer
- `count_too_large` — `count` exceeds the per-request maximum

## Running tests

```bash
cd backend
npm test
```

## License

MIT
