import { Handler } from '@netlify/functions';

export const handler: Handler = async (event, context) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Content-Type': 'application/json',
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  if (event.httpMethod !== 'GET') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method Not Allowed' }),
    };
  }

  try {
    const KIRBY_TOKEN_ADDRESS = 'EoLW32eUjN9XibMLEb53CMzLtg9XxnHFU6fbpSukjups';
    
    // Use the exact same API calls as solana-components
    const [priceResponse, tokenResponse] = await Promise.allSettled([
      // Jupiter Price API V3 - Fast, real-time price data
      fetch(`https://lite-api.jup.ag/price/v3?ids=${KIRBY_TOKEN_ADDRESS}`),
      // Jupiter Token API V2 - Rich market data (less frequent updates needed)
      fetch(`https://lite-api.jup.ag/tokens/v2/search?query=${KIRBY_TOKEN_ADDRESS}`)
    ]);

    let price = null;
    let change24h = null;
    let volume24h = null;
    let marketCap = null;

    // Extract price data from Price API V3 (exact copy from solana-components)
    if (priceResponse.status === 'fulfilled' && priceResponse.value.ok) {
      const priceData = await priceResponse.value.json();
      const priceInfo = priceData[KIRBY_TOKEN_ADDRESS];
      if (priceInfo) {
        price = priceInfo.usdPrice;
        change24h = priceInfo.priceChange24h;
      }
    }

    // Extract market data from Token API V2 (exact copy from solana-components)
    if (tokenResponse.status === 'fulfilled' && tokenResponse.value.ok) {
      const tokenData = await tokenResponse.value.json();
      const tokenInfo = tokenData[0]; // First result
      if (tokenInfo) {
        // Use Token API V2 data if Price API V3 failed
        if (price === null) price = tokenInfo.usdPrice;
        if (change24h === null) change24h = tokenInfo.stats24h?.priceChange;
        
        // Get market data from Token API V2
        marketCap = tokenInfo.mcap;
        if (tokenInfo.stats24h) {
          volume24h = (tokenInfo.stats24h.buyVolume || 0) + (tokenInfo.stats24h.sellVolume || 0);
        }
      }
    }

    // Get holder count from Helius if API key is available
    let holders = null;
    const heliusApiKey = process.env.HELIUS_API_KEY;
    if (heliusApiKey) {
      try {
        const heliusResponse = await fetch(`https://mainnet.helius-rpc.com/?api-key=${heliusApiKey}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            jsonrpc: '2.0',
            id: 1,
            method: 'getTokenAccounts',
            params: {
              mint: KIRBY_TOKEN_ADDRESS,
              limit: 1000,
            },
          }),
        });

        if (heliusResponse.ok) {
          const heliusData = await heliusResponse.json();
          if (heliusData.result?.token_accounts?.length) {
            holders = heliusData.result.token_accounts.length;
          }
        }
      } catch (error) {
        console.error('Helius API error:', error);
      }
    }

    // Calculate market cap if not provided by Jupiter
    const totalSupply = 1000000000; // 1B total supply
    if (marketCap === null && price !== null) {
      marketCap = price * totalSupply;
    }

    // Format response to match TokenChart API expectations
    const tokenData = {
      address: KIRBY_TOKEN_ADDRESS,
      name: 'KIRBY Token',
      symbol: 'KIRBY',
      decimals: 6,
      supply: totalSupply.toString(),
      holders,
      // TokenChart expects these specific field names
      current_price: price,
      price_change_24h: change24h,
      price_change_percentage_24h: change24h,
      market_cap: marketCap,
      total_volume: volume24h,
      // Legacy fields for backward compatibility
      price,
      marketCap,
      change24h,
      volume24h,
    };

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(tokenData),
    };
  } catch (error) {
    console.error('API Error:', error);
    
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        error: error instanceof Error ? error.message : 'Internal server error' 
      }),
    };
  }
};