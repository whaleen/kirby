// Server-side Helius SDK implementation
// This file should be used in API routes/endpoints only, not in client components
import { Helius } from 'helius-sdk';

const HELIUS_API_KEY = process.env.HELIUS_API_KEY || '';
export const helius = new Helius(HELIUS_API_KEY);

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
}

export async function getKirbyTokenDataFromHelius(): Promise<TokenData | null> {
  try {
    // Get token metadata
    const tokenInfo = await helius.rpc.getAsset({
      id: KIRBY_TOKEN_ADDRESS,
    });

    // Get token accounts for holder count (simplified)
    const tokenAccounts = await helius.rpc.getTokenAccounts({
      mint: KIRBY_TOKEN_ADDRESS,
      limit: 1000, // Get up to 1000 holders for count
    });

    return {
      address: KIRBY_TOKEN_ADDRESS,
      name: tokenInfo?.content?.metadata?.name || 'KIRBY',
      symbol: tokenInfo?.content?.metadata?.symbol || 'KIRBY',
      decimals: 6, // Standard for most Solana tokens
      supply: '1000000000', // 1B total supply (placeholder)
      holders: tokenAccounts?.token_accounts?.length || 0,
      price: 0.000023, // Placeholder price
      marketCap: 23000, // Placeholder market cap
    };
  } catch (error) {
    console.error('Error fetching KIRBY token data from Helius:', error);
    throw error;
  }
}

export async function getRecentTransactionsFromHelius(limit: number = 10) {
  try {
    const transactions = await helius.rpc.getSignaturesForAsset({
      id: KIRBY_TOKEN_ADDRESS,
      limit,
      page: 1,
    });

    return transactions || [];
  } catch (error) {
    console.error('Error fetching recent transactions from Helius:', error);
    throw error;
  }
}