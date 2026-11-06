# Dice Tarot — D100 × Tarot

[繁體中文](README.md) · [Play Dice Tarot](https://dice-tarot.vercel.app/)

Dice Tarot is a browser-based tarot app with Traditional Chinese and English interfaces. Roll percentile dice to select a position in the shuffled 78-card deck and use the cards as prompts for reflection.

## Run locally

Use Node.js 22.12 or later (Node.js 24 recommended).

```sh
npm ci
npm run dev
```

Open the address printed by Vite, usually http://127.0.0.1:5173.

## How to play

1. Choose a one-card reading, a Past / Present / Future spread, or a Situation / Challenge / Advice spread. Writing a question is optional.
2. Shuffle to set the deck order and card orientations. Hold the deck for about 1.3 seconds, or skip the ritual.
3. Roll the percentile dice. The tens and ones dice combine to form the result, with 00 + 0 counting as 100. The result selects a position in the remaining deck. Out-of-range rolls are logged and retried without reshuffling.
4. Read the upright or reversed interpretation. You can save the reading, view it again in your history, and export JSON or PNG.

Use the language selector in the header to switch between English and Traditional Chinese. The browser remembers your choice. The interface, card meanings, and PNG output follow the selected language. JSON exports retain the original reading data, including your question and the saved interpretation.

## Data and artwork

The app uses React, TypeScript, and Vite. Web Crypto supplies randomness for the shuffle and dice. Saved readings use IndexedDB and stay in the browser where they were created. Clearing site data removes them.

The 78 Rider–Waite–Smith card images are based on public-domain scans. The artwork sources and per-card credits are documented in [Artwork sources](docs/ARTWORK_SOURCES.md). The application code is distributed under the [MIT License](LICENSE).

## Checks and deployment

```sh
npm run typecheck
npm test
npx playwright install chromium
npm run test:e2e
npm run build
```

Deploy the generated `dist/` directory to a static host such as Vercel or Cloudflare Pages. For a Git-based deployment, set the build command to `npm run build` and the output directory to `dist`. Serve the site over HTTPS so the browser's cryptographic APIs are available.
