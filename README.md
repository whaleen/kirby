# Kirby On Sol

Official website for $KIRBY token launched on Jupiter Studio.

## Features

- **Modern React + TypeScript** setup with Vite
- **Shadcn/ui components** for consistent UI
- **Tailwind CSS** for styling with Kirby-themed colors
- **Helius SDK integration** for real-time blockchain data
- **Responsive design** optimized for all devices
- **SEO optimized** with proper metadata

## Tech Stack

- React 19
- TypeScript
- Tailwind CSS v4
- Shadcn/ui components
- Helius SDK for Solana data
- Vite for build tooling

## Getting Started

1. Install dependencies:

   ```bash
   npm install
   ```

2. Copy environment variables:

   ```bash
   cp .env.example .env
   ```

3. Add your Helius API key to `.env`:

   ```
   VITE_HELIUS_API_KEY=your-api-key-here
   ```

4. Start the development server:
   ```bash
   # For frontend only
   npm run dev
   
   # For full-stack with Netlify functions (recommended)
   npm run dev:netlify
   ```

## Building

```bash
npm run build
npm run preview
```

## Deployment

This site is configured for Netlify deployment with:
- Netlify Functions for API endpoints
- Real-time data from Jupiter and CoinGecko APIs
- Helius integration for blockchain data

Set these environment variables in Netlify:
- `HELIUS_API_KEY` - Your Helius API key for token data

## Features

- Real-time token statistics powered by Helius
- Community links and social media integration
- Jupiter Studio and Helius explorer integration

## Links

- **Website**: https://kirbyonstud.io
- **Telegram**: https://t.me/kirbyonjup
- **X (Twitter)**: https://x.com/KirbyOnStudio
- **Jupiter Studio**: https://jup.ag/studio/EoLW32eUjN9XibMLEb53CMzLtg9XxnHFU6fbpSukjups
- **Helius Explorer**: https://orb.helius.dev/address/EoLW32eUjN9XibMLEb53CMzLtg9XxnHFU6fbpSukjups/metadata?cluster=mainnet-beta
