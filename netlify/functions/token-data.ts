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
    
    // Get token info from Jupiter API
    const [jupiterPriceResponse, coingeckoResponse] = await Promise.allSettled([
      fetch(`https://price.jup.ag/v4/price?ids=${KIRBY_TOKEN_ADDRESS}`),
      fetch('https://api.coingecko.com/api/v3/simple/price?ids=solana&vs_currencies=usd&include_24hr_change=true')
    ]);

    let price = 0.000023; // fallback
    let marketCap = 23000;
    let holders = 1420;

    // Try to get real price from Jupiter
    if (jupiterPriceResponse.status === 'fulfilled' && jupiterPriceResponse.value.ok) {
      const jupiterData = await jupiterPriceResponse.value.json();
      const tokenPrice = jupiterData.data?.[KIRBY_TOKEN_ADDRESS];
      if (tokenPrice?.price) {
        price = tokenPrice.price;
      }
    }

    // Get SOL price for market cap calculation
    let solPrice = 21.45;
    if (coingeckoResponse.status === 'fulfilled' && coingeckoResponse.value.ok) {
      const cgData = await coingeckoResponse.value.json();
      if (cgData.solana?.usd) {
        solPrice = cgData.solana.usd;
      }
    }

    // Try to get holder count from Helius if API key is available
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

    // Calculate market cap (assuming 1B total supply)
    const totalSupply = 1000000000;
    marketCap = price * totalSupply;

    const tokenData = {
      address: KIRBY_TOKEN_ADDRESS,
      name: 'KIRBY',
      symbol: 'KIRBY',
      decimals: 6,
      supply: totalSupply.toString(),
      holders,
      price,
      marketCap,
      solPrice,
    };

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(tokenData),
    };
  } catch (error) {
    console.error('API Error:', error);
    
    // Return fallback data on error
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        address: 'EoLW32eUjN9XibMLEb53CMzLtg9XxnHFU6fbpSukjups',
        name: 'KIRBY',
        symbol: 'KIRBY',
        decimals: 6,
        supply: '1000000000',
        holders: 1420,
        price: 0.000023,
        marketCap: 23000,
        solPrice: 21.45,
      }),
    };
  }
};