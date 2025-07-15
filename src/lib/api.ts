// Client-side API interface that calls Netlify functions
export const KIRBY_TOKEN_ADDRESS =
  'EoLW32eUjN9XibMLEb53CMzLtg9XxnHFU6fbpSukjups'

export interface TokenData {
  address: string
  name?: string
  symbol?: string
  decimals?: number
  supply?: string
  holders?: number | string
  price?: number
  marketCap?: number
  solPrice?: number
  priceChange24h?: number
  volume24h?: number
}

export async function getKirbyTokenData(): Promise<TokenData | null> {
  try {
    const KIRBY_TOKEN_ADDRESS = 'EoLW32eUjN9XibMLEb53CMzLtg9XxnHFU6fbpSukjups';
    
    // Call Jupiter APIs directly from client (like solana-components does)
    const [priceResponse, tokenResponse] = await Promise.allSettled([
      // Jupiter Price API V3 - Fast, real-time price data
      fetch(`https://lite-api.jup.ag/price/v3?ids=${KIRBY_TOKEN_ADDRESS}`),
      // Jupiter Token API V2 - Rich market data
      fetch(`https://lite-api.jup.ag/tokens/v2/search?query=${KIRBY_TOKEN_ADDRESS}`)
    ]);

    let price = null;
    let change24h = null;
    let marketCap = null;
    let volume24h = null;

    // Extract price data from Price API V3 (exact copy from solana-components)
    if (priceResponse.status === 'fulfilled' && priceResponse.value.ok) {
      const priceData = await priceResponse.value.json();
      console.group('🚀 JUPITER PRICE API V3');
      console.log('Full response:', priceData);
      const priceInfo = priceData[KIRBY_TOKEN_ADDRESS];
      if (priceInfo) {
        console.log('Price data extracted:', {
          usdPrice: priceInfo.usdPrice,
          priceChange24h: priceInfo.priceChange24h,
          available_fields: Object.keys(priceInfo)
        });
        price = priceInfo.usdPrice;
        change24h = priceInfo.priceChange24h;
      }
      console.groupEnd();
    }

    // Extract market data from Token API V2 (exact copy from solana-components)
    if (tokenResponse.status === 'fulfilled' && tokenResponse.value.ok) {
      const tokenData = await tokenResponse.value.json();
      console.group('📊 JUPITER TOKEN API V2');
      console.log('Full response:', tokenData);
      const tokenInfo = tokenData[0]; // First result
      if (tokenInfo) {
        console.log('Token data extracted:', {
          usdPrice: tokenInfo.usdPrice,
          mcap: tokenInfo.mcap,
          stats24h: tokenInfo.stats24h,
          available_fields: Object.keys(tokenInfo)
        });
        
        // Use Token API V2 data if Price API V3 failed
        if (price === null) price = tokenInfo.usdPrice;
        if (change24h === null) change24h = tokenInfo.stats24h?.priceChange;
        
        // Get market data from Token API V2
        marketCap = tokenInfo.mcap;
        volume24h = (tokenInfo.stats24h?.buyVolume || 0) + (tokenInfo.stats24h?.sellVolume || 0);
        
        console.log('Final extracted values:', {
          price: price,
          change24h: change24h,
          marketCap: marketCap,
          volume24h: volume24h
        });
      }
      console.groupEnd();
    }

    // Calculate market cap if not provided by Jupiter
    const totalSupply = 1000000000; // 1B total supply
    if (marketCap === null && price !== null) {
      marketCap = price * totalSupply;
    }

    // Get holders count from Helius DAS API with pagination
    let holders: number | string | null = null;
    const heliusApiKey = import.meta.env.VITE_HELIUS_API_KEY;
    if (heliusApiKey) {
      try {
        // First, let's test the getAsset method to see what data we can get
        const getAssetResponse = await fetch(`https://mainnet.helius-rpc.com/?api-key=${heliusApiKey}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            jsonrpc: '2.0',
            id: 'my-request-id',
            method: 'getAsset',
            params: {
              id: KIRBY_TOKEN_ADDRESS,
            },
          }),
        });

        if (getAssetResponse.ok) {
          const assetData = await getAssetResponse.json();
          console.group('🌐 HELIUS GET ASSET API');
          console.log('Full response:', assetData);
          if (assetData.result) {
            console.log('Asset data extracted:', {
              id: assetData.result.id,
              content: assetData.result.content,
              authorities: assetData.result.authorities,
              supply: assetData.result.supply,
              available_fields: Object.keys(assetData.result)
            });
          }
          console.groupEnd();
        }
        let totalHolders = 0;
        let page = 1;
        let hasMore = true;
        const maxPages = 5; // Limit to 5 pages (5000 holders max) for performance
        
        while (hasMore && page <= maxPages) {
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
                page: page,
              },
            }),
          });

          if (heliusResponse.ok) {
            const heliusData = await heliusResponse.json();
            if (heliusData.result?.token_accounts?.length) {
              totalHolders += heliusData.result.token_accounts.length;
              // If we got less than 1000, we've reached the end
              hasMore = heliusData.result.token_accounts.length === 1000;
              page++;
            } else {
              hasMore = false;
            }
          } else {
            hasMore = false;
          }
        }
        
        holders = totalHolders > 0 ? (page > maxPages ? `${totalHolders}+` : totalHolders) : null;
        
        console.group('👥 HELIUS TOKEN ACCOUNTS API');
        console.log('Pagination summary:', {
          totalPages: page - 1,
          maxPagesReached: page > maxPages,
          totalHolders: totalHolders,
          finalHoldersValue: holders
        });
        console.groupEnd();
      } catch (error) {
        console.error('Helius API error:', error);
      }
    }

    const result: TokenData = {
      address: KIRBY_TOKEN_ADDRESS,
      name: 'KIRBY',
      symbol: 'KIRBY',
      decimals: 6,
      supply: totalSupply.toString(),
      holders: holders || undefined,
      price: price || undefined,
      marketCap: marketCap || undefined,
      priceChange24h: change24h || undefined,
      volume24h: volume24h || undefined,
    };

    return result;
  } catch (error) {
    console.error('Error fetching KIRBY token data:', error)
    
    // NO FALLBACK - return null so component shows "No Data"
    return null
  }
}

export async function getRecentTransactions(_limit: number = 10) {
  // For now, return empty array - can be implemented later
  return []
}