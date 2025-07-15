import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from './ui/table';
import { RefreshCw, Copy, Users, Lock, Droplets, ExternalLink } from 'lucide-react';
import { cn } from '@/lib/utils';

// Token account data structure from Helius API
interface TokenAccount {
  address: string;
  mint: string;
  owner: string;
  amount: number;
  delegated_amount: number;
  frozen: boolean;
}

// Processed holder data for display
interface HolderData {
  owner: string;
  balance: number;
  balanceFormatted: string;
  percentage: number;
  tokenAccount: string;
  frozen: boolean;
  usdValue: number;
  usdValueFormatted: string;
}

export interface HoldersPageProps {
  className?: string;
}

const KIRBY_TOKEN_ADDRESS = 'EoLW32eUjN9XibMLEb53CMzLtg9XxnHFU6fbpSukjups';
const TOTAL_SUPPLY = 1000000000; // 1B tokens
const DECIMALS = 6;

// Fetch token holders from Helius API  
async function fetchTokenHolders(currentPrice?: number): Promise<HolderData[]> {
  const heliusApiKey = import.meta.env.VITE_HELIUS_API_KEY;
  if (!heliusApiKey) {
    throw new Error('Helius API key not configured');
  }

  const allHolders: TokenAccount[] = [];
  let page = 1;
  let hasMore = true;
  const maxPages = 10; // Limit to 10k holders for performance

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
        allHolders.push(...heliusData.result.token_accounts);
        hasMore = heliusData.result.token_accounts.length === 1000;
        page++;
      } else {
        hasMore = false;
      }
    } else {
      hasMore = false;
    }
  }

  // Process and aggregate holders data by owner
  const ownerBalances = new Map<string, { balance: number; accounts: TokenAccount[]; frozen: boolean }>();

  // Aggregate all token accounts by owner
  allHolders.forEach((account: TokenAccount) => {
    const balance = account.amount / Math.pow(10, DECIMALS);
    const existing = ownerBalances.get(account.owner);

    if (existing) {
      existing.balance += balance;
      existing.accounts.push(account);
      existing.frozen = existing.frozen || account.frozen; // frozen if any account is frozen
    } else {
      ownerBalances.set(account.owner, {
        balance: balance,
        accounts: [account],
        frozen: account.frozen
      });
    }
  });

  // Convert to processedHolders format
  const processedHolders: HolderData[] = Array.from(ownerBalances.entries())
    .map(([owner, data]) => {
      const balance = data.balance;
      const percentage = (balance / TOTAL_SUPPLY) * 100;
      const usdValue = currentPrice ? balance * currentPrice : 0;

      return {
        owner: owner,
        balance: balance,
        balanceFormatted: balance >= 1000000
          ? `${(balance / 1000000).toFixed(1)}M`
          : balance >= 1000
            ? `${(balance / 1000).toFixed(1)}K`
            : balance.toFixed(2),
        percentage: percentage,
        tokenAccount: `${data.accounts.length} account${data.accounts.length > 1 ? 's' : ''}`, // Show account count
        frozen: data.frozen,
        usdValue: usdValue,
        usdValueFormatted: usdValue >= 1000
          ? `$${(usdValue / 1000).toFixed(1)}K`
          : usdValue >= 1
            ? `$${usdValue.toFixed(2)}`
            : `$${usdValue.toFixed(4)}`
      };
    })
    // Sort by balance descending
    .sort((a, b) => b.balance - a.balance);

  return processedHolders;
}

// Truncate wallet address for display
function truncateAddress(address: string): string {
  return `${address.slice(0, 4)}...${address.slice(-4)}`;
}

// Copy address to clipboard
async function copyToClipboard(text: string): Promise<void> {
  await navigator.clipboard.writeText(text);
}

// Special wallet addresses with icons
const SPECIAL_WALLETS = {
  'GPshF6WikktzrB9NVWSfLRR2Dpzy11AXX3DKPct4kSN': { icon: Lock, label: 'Locked' },
  'HLnpSz9h2S4hiLQ43rnSD9XkcUThA7B8hQMKmDaiTLcC': { icon: Droplets, label: 'Liquidity' }
} as const;

export function HoldersPage({ className }: HoldersPageProps) {
  const [holders, setHolders] = useState<HolderData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [copyingAddress, setCopyingAddress] = useState<string | null>(null);
  // const [currentPrice, setCurrentPrice] = useState<number | null>(null);

  // Load holders data
  const loadHolders = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // First get current price from our existing API
      const { getKirbyTokenData } = await import('@/lib/api');
      const tokenData = await getKirbyTokenData();
      const price = tokenData?.price || 0;
      // setCurrentPrice(price);

      // Then fetch holders with price
      const holdersData = await fetchTokenHolders(price);
      setHolders(holdersData);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch holders data';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // Load holders on mount
  useEffect(() => {
    loadHolders();
  }, []);

  // Separate special wallets from regular holders
  const specialWallets = holders.filter(holder =>
    SPECIAL_WALLETS[holder.owner as keyof typeof SPECIAL_WALLETS]
  );
  const regularHolders = holders.filter(holder =>
    !SPECIAL_WALLETS[holder.owner as keyof typeof SPECIAL_WALLETS]
  );

  const holdersPerPage = 50;
  const totalPages = Math.ceil(regularHolders.length / holdersPerPage);
  const startIndex = (currentPage - 1) * holdersPerPage;
  const paginatedHolders = regularHolders.slice(startIndex, startIndex + holdersPerPage);

  // Handle copy address
  const handleCopy = async (address: string) => {
    setCopyingAddress(address);
    try {
      await copyToClipboard(address);
      setTimeout(() => setCopyingAddress(null), 1000);
    } catch (err) {
      console.error('Failed to copy address:', err);
      setCopyingAddress(null);
    }
  };

  if (error) {
    return (
      <Card className={cn('holders-page holders-page--error', className)}>
        <CardContent className="p-6">
          <div className="flex items-center justify-center h-48 text-center">
            <div>
              <div className="text-red-500 mb-2">Error loading holders data</div>
              <div className="text-sm text-muted-foreground mb-4">{error}</div>
              <Button variant="outline" size="sm" onClick={loadHolders}>
                <RefreshCw className="w-4 h-4 mr-2" />
                Retry
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={cn('holders-page', className)}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              KIRBY Token Holders
              <Badge variant="secondary" className="ml-2">
                {holders.length.toLocaleString()} total holders
              </Badge>
            </CardTitle>
            <CardDescription>
              Top token holders ranked by balance
            </CardDescription>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={loadHolders}
            disabled={isLoading}
          >
            <RefreshCw className={cn('w-4 h-4', isLoading && 'animate-spin')} />
          </Button>
        </div>
      </CardHeader>

      <CardContent>
        {isLoading ? (
          <div className="flex items-center justify-center h-48">
            <RefreshCw className="w-6 h-6 animate-spin" />
          </div>
        ) : (
          <>
            {/* Special Wallets Section */}
            {specialWallets.length > 0 && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                  Special Wallets
                  <Badge variant="outline" className="text-xs">
                    {specialWallets.length}
                  </Badge>
                </h3>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Type</TableHead>
                      <TableHead>Wallet Address</TableHead>
                      <TableHead className="text-right">Balance</TableHead>
                      <TableHead className="text-right">USD Value</TableHead>
                      <TableHead className="text-right">Percentage</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {specialWallets.map((holder, index) => {
                      const isCopying = copyingAddress === holder.owner;
                      const walletInfo = SPECIAL_WALLETS[holder.owner as keyof typeof SPECIAL_WALLETS];
                      const IconComponent = walletInfo.icon;

                      return (
                        <TableRow key={`${holder.owner}-${index}`} className="bg-muted/20">
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <IconComponent className="w-4 h-4" />
                              <span className="font-medium">{walletInfo.label}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <span className="font-mono text-sm">
                                {truncateAddress(holder.owner)}
                              </span>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-6 w-6 p-0"
                                onClick={() => handleCopy(holder.owner)}
                                disabled={isCopying}
                              >
                                <Copy className={cn('w-3 h-3', isCopying && 'text-green-500')} />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-6 w-6 p-0"
                                asChild
                              >
                                <a
                                  href={`https://orb.helius.dev/address/${holder.owner}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                >
                                  <ExternalLink className="w-3 h-3" />
                                </a>
                              </Button>
                            </div>
                          </TableCell>
                          <TableCell className="text-right font-mono">
                            {holder.balanceFormatted}
                          </TableCell>
                          <TableCell className="text-right font-mono text-green-600">
                            {holder.usdValueFormatted}
                          </TableCell>
                          <TableCell className="text-right">
                            {holder.percentage < 0.01 ? '<0.01%' : `${holder.percentage.toFixed(2)}%`}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            )}

            {/* Regular Holders Table */}
            <div className="mb-4">
              <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                Regular Holders
                <Badge variant="outline" className="text-xs">
                  {regularHolders.length.toLocaleString()}
                </Badge>
              </h3>
            </div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-16">Rank</TableHead>
                  <TableHead>Wallet Address</TableHead>
                  <TableHead className="text-right">Balance</TableHead>
                  <TableHead className="text-right">USD Value</TableHead>
                  <TableHead className="text-right">Percentage</TableHead>
                  <TableHead className="w-24">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedHolders.map((holder, index) => {
                  const rank = startIndex + index + 1;
                  const isCopying = copyingAddress === holder.owner;

                  return (
                    <TableRow key={holder.owner}>
                      <TableCell className="font-medium">#{rank}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-sm">
                            {truncateAddress(holder.owner)}
                          </span>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 w-6 p-0"
                            onClick={() => handleCopy(holder.owner)}
                            disabled={isCopying}
                          >
                            <Copy className={cn('w-3 h-3', isCopying && 'text-green-500')} />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 w-6 p-0"
                            asChild
                          >
                            <a
                              href={`https://orb.helius.dev/address/${holder.owner}`}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          </Button>
                        </div>
                      </TableCell>
                      <TableCell className="text-right font-mono">
                        {holder.balanceFormatted}
                      </TableCell>
                      <TableCell className="text-right font-mono text-green-600">
                        {holder.usdValueFormatted}
                      </TableCell>
                      <TableCell className="text-right">
                        {holder.percentage < 0.01 ? '<0.01%' : `${holder.percentage.toFixed(2)}%`}
                      </TableCell>
                      <TableCell>
                        {holder.frozen ? (
                          <Badge variant="destructive" className="text-xs">Frozen</Badge>
                        ) : (
                          <Badge variant="secondary" className="text-xs">Active</Badge>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between mt-4">
                <div className="text-sm text-muted-foreground">
                  Showing {startIndex + 1}-{Math.min(startIndex + holdersPerPage, regularHolders.length)} of {regularHolders.length} regular holders
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    disabled={currentPage === 1}
                  >
                    Previous
                  </Button>
                  <span className="text-sm">
                    Page {currentPage} of {totalPages}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                    disabled={currentPage === totalPages}
                  >
                    Next
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}
