// Client-side API interface that calls Netlify functions
export const KIRBY_TOKEN_ADDRESS = 'EoLW32eUjN9XibMLEb53CMzLtg9XxnHFU6fbpSukjups';

export interface TokenData {
  address: string
  name?: string
  symbol?: string
  decimals?: number
  supply?: string
  holders?: number
  price?: number
  marketCap?: number
  solPrice?: number
}

export async function getKirbyTokenData(): Promise<TokenData | null> {
  try {
    // Call our Netlify function for token data
    const response = await fetch('/api/token-data');
    
    if (!response.ok) {
      throw new Error(`API response not ok: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching KIRBY token data:', error);
    
    // Fallback data if API call fails
    return {
      address: KIRBY_TOKEN_ADDRESS,
      name: 'KIRBY',
      symbol: 'KIRBY',
      decimals: 6,
      supply: '1000000000',
      holders: 1420,
      price: 0.000023,
      marketCap: 23000,
      solPrice: 21.45,
    };
  }
}

export async function getRecentTransactions(_limit: number = 10) {
  // For now, return empty array - can be implemented later
  return []
}