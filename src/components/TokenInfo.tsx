import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { RefreshCw, ExternalLink, Shield, TrendingUp, TrendingDown, Users, DollarSign, Activity, Calendar, Award, FileText, Database } from 'lucide-react';
import { cn } from '@/lib/utils';

// Jupiter Token API response interface
interface JupiterTokenData {
  id: string;
  name: string;
  symbol: string;
  icon: string;
  decimals: number;
  website: string;
  dev: string;
  circSupply: number;
  totalSupply: number;
  tokenProgram: string;
  launchpad: string;
  metaLaunchpad: string;
  partnerConfig: string;
  firstPool: {
    id: string;
    createdAt: string;
  };
  holderCount: number;
  audit: {
    mintAuthorityDisabled: boolean;
    freezeAuthorityDisabled: boolean;
    topHoldersPercentage: number;
    devBalancePercentage: number;
    devMigrations: number;
  };
  organicScore: number;
  organicScoreLabel: string;
  isVerified: boolean;
  tags: string[];
  graduatedPool: string;
  graduatedAt: string;
  fdv: number;
  mcap: number;
  usdPrice: number;
  priceBlockId: number;
  liquidity: number;
  stats5m: {
    priceChange: number;
    holderChange: number;
    liquidityChange: number;
    volumeChange: number;
    buyVolume: number;
    sellVolume: number;
    buyOrganicVolume: number;
    numBuys: number;
    numSells: number;
    numTraders: number;
    numNetBuyers: number;
  };
  stats1h: {
    priceChange: number;
    holderChange: number;
    liquidityChange: number;
    volumeChange: number;
    buyVolume: number;
    sellVolume: number;
    buyOrganicVolume: number;
    sellOrganicVolume: number;
    numBuys: number;
    numSells: number;
    numTraders: number;
    numOrganicBuyers: number;
    numNetBuyers: number;
  };
  stats6h: {
    priceChange: number;
    holderChange: number;
    liquidityChange: number;
    volumeChange: number;
    buyVolume: number;
    sellVolume: number;
    buyOrganicVolume: number;
    sellOrganicVolume: number;
    numBuys: number;
    numSells: number;
    numTraders: number;
    numOrganicBuyers: number;
    numNetBuyers: number;
  };
  stats24h: {
    priceChange: number;
    holderChange: number;
    liquidityChange: number;
    volumeChange: number;
    buyVolume: number;
    sellVolume: number;
    buyOrganicVolume: number;
    sellOrganicVolume: number;
    numBuys: number;
    numSells: number;
    numTraders: number;
    numOrganicBuyers: number;
    numNetBuyers: number;
  };
  ctLikes: number;
  smartCtLikes: number;
  bondingCurve: number;
  updatedAt: string;
}

// Helius Asset API response interface
interface HeliusAssetData {
  interface: string;
  id: string;
  content: {
    json_uri: string;
    files: Array<{
      uri: string;
      cdn_uri: string;
      mime: string;
    }>;
    metadata: {
      description: string;
      name: string;
      symbol: string;
      token_standard: string;
    };
    links: {
      image: string;
    };
  };
  authorities: Array<{
    address: string;
    scopes: string[];
  }>;
  compression: {
    eligible: boolean;
    compressed: boolean;
    data_hash: string;
    creator_hash: string;
    asset_hash: string;
    tree: string;
    seq: number;
    leaf_id: number;
  };
  grouping: any[];
  royalty: {
    royalty_model: string;
    target: string | null;
    percent: number;
    basis_points: number;
    primary_sale_happened: boolean;
    locked: boolean;
  };
  creators: any[];
  ownership: {
    frozen: boolean;
    delegated: boolean;
    delegate: string | null;
    ownership_model: string;
    owner: string;
  };
  supply: any;
  mutable: boolean;
  burnt: boolean;
  token_info: {
    symbol: string;
    supply: number;
    decimals: number;
    token_program: string;
    price_info: {
      price_per_token: number;
      currency: string;
    };
  };
}

export interface TokenInfoProps {
  className?: string;
}

// Fetch Jupiter Token API data
async function fetchJupiterTokenData(): Promise<JupiterTokenData | null> {
  try {
    const response = await fetch(`https://lite-api.jup.ag/tokens/v2/search?query=EoLW32eUjN9XibMLEb53CMzLtg9XxnHFU6fbpSukjups`);
    if (!response.ok) throw new Error('Failed to fetch token data');
    
    const data = await response.json();
    return data[0] || null; // First result
  } catch (error) {
    console.error('Error fetching Jupiter token data:', error);
    return null;
  }
}

// Fetch Helius Asset API data
async function fetchHeliusAssetData(): Promise<HeliusAssetData | null> {
  try {
    const heliusApiKey = import.meta.env.VITE_HELIUS_API_KEY;
    if (!heliusApiKey) return null;

    const response = await fetch(`https://mainnet.helius-rpc.com/?api-key=${heliusApiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        jsonrpc: '2.0',
        id: 'token-info-request',
        method: 'getAsset',
        params: {
          id: 'EoLW32eUjN9XibMLEb53CMzLtg9XxnHFU6fbpSukjups',
        },
      }),
    });

    if (!response.ok) throw new Error('Failed to fetch Helius asset data');
    
    const data = await response.json();
    return data.result || null;
  } catch (error) {
    console.error('Error fetching Helius asset data:', error);
    return null;
  }
}

// Format large numbers
function formatNumber(num: number | undefined | null, decimals = 2): string {
  if (num === undefined || num === null || isNaN(num)) return 'N/A';
  if (num >= 1000000) return `${(num / 1000000).toFixed(decimals)}M`;
  if (num >= 1000) return `${(num / 1000).toFixed(decimals)}K`;
  return num.toFixed(decimals);
}

// Format percentage with color
function formatPercentage(value: number | undefined | null, showSign = true): { text: string; isPositive: boolean } {
  if (value === undefined || value === null || isNaN(value)) {
    return { text: 'N/A', isPositive: true };
  }
  const isPositive = value >= 0;
  const sign = showSign ? (isPositive ? '+' : '') : '';
  return {
    text: `${sign}${value.toFixed(2)}%`,
    isPositive
  };
}

export function TokenInfo({ className }: TokenInfoProps) {
  const [tokenData, setTokenData] = useState<JupiterTokenData | null>(null);
  const [heliusData, setHeliusData] = useState<HeliusAssetData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load token data
  const loadTokenData = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const [jupiterData, heliusAssetData] = await Promise.allSettled([
        fetchJupiterTokenData(),
        fetchHeliusAssetData()
      ]);

      if (jupiterData.status === 'fulfilled') {
        setTokenData(jupiterData.value);
      }
      if (heliusAssetData.status === 'fulfilled') {
        setHeliusData(heliusAssetData.value);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch token data';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // Load data on mount
  useEffect(() => {
    loadTokenData();
  }, []);

  if (error) {
    return (
      <Card className={cn('token-info token-info--error', className)}>
        <CardContent className="p-6">
          <div className="flex items-center justify-center h-48 text-center">
            <div>
              <div className="text-red-500 mb-2">Error loading token data</div>
              <div className="text-sm text-muted-foreground mb-4">{error}</div>
              <Button variant="outline" size="sm" onClick={loadTokenData}>
                <RefreshCw className="w-4 h-4 mr-2" />
                Retry
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (isLoading) {
    return (
      <Card className={cn('token-info', className)}>
        <CardContent className="p-6">
          <div className="flex items-center justify-center h-48">
            <RefreshCw className="w-6 h-6 animate-spin" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!tokenData) {
    return (
      <Card className={cn('token-info', className)}>
        <CardContent className="p-6">
          <div className="flex items-center justify-center h-48 text-muted-foreground">
            No token data available.
          </div>
        </CardContent>
      </Card>
    );
  }

  const priceChange24h = formatPercentage(tokenData?.stats24h?.priceChange);
  const organicScoreColor = (tokenData?.organicScore ?? 0) >= 70 ? 'text-green-600' : 
                           (tokenData?.organicScore ?? 0) >= 40 ? 'text-yellow-600' : 'text-red-600';

  return (
    <div className={cn('token-info space-y-6', className)}>
      {/* Header with Token Info */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <img 
                src={tokenData.icon} 
                alt={tokenData.name} 
                className="w-16 h-16 rounded-full"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/logo.jpg'; // Fallback to local logo
                }}
              />
              <div>
                <CardTitle className="flex items-center gap-2 text-2xl">
                  {tokenData.name} ({tokenData.symbol})
                  {tokenData.isVerified && (
                    <Badge variant="default" className="bg-blue-600">
                      <Shield className="w-3 h-3 mr-1" />
                      Verified
                    </Badge>
                  )}
                </CardTitle>
                <CardDescription className="text-lg">
                  ${tokenData.usdPrice.toFixed(6)} 
                  <span className={cn('ml-2', priceChange24h.isPositive ? 'text-green-600' : 'text-red-600')}>
                    {priceChange24h.isPositive ? <TrendingUp className="w-4 h-4 inline mr-1" /> : <TrendingDown className="w-4 h-4 inline mr-1" />}
                    {priceChange24h.text}
                  </span>
                </CardDescription>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={loadTokenData} disabled={isLoading}>
                <RefreshCw className={cn('w-4 h-4', isLoading && 'animate-spin')} />
              </Button>
              <Button variant="outline" size="sm" asChild>
                <a href={tokenData.website} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="w-4 h-4" />
                </a>
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Market Data Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <DollarSign className="w-4 h-4" />
              Market Cap
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${formatNumber(tokenData.mcap)}</div>
            <p className="text-xs text-muted-foreground">FDV: ${formatNumber(tokenData.fdv)}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Activity className="w-4 h-4" />
              Liquidity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${formatNumber(tokenData.liquidity)}</div>
            <p className="text-xs text-muted-foreground">Available liquidity</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Users className="w-4 h-4" />
              Holders
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{tokenData.holderCount.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Token holders</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Award className="w-4 h-4" />
              Organic Score
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className={cn('text-2xl font-bold', organicScoreColor)}>
              {tokenData.organicScore.toFixed(1)}
            </div>
            <p className="text-xs text-muted-foreground capitalize">{tokenData.organicScoreLabel}</p>
          </CardContent>
        </Card>
      </div>

      {/* Trading Statistics */}
      <Card>
        <CardHeader>
          <CardTitle>Trading Statistics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { label: '5 Minutes', data: tokenData.stats5m },
              { label: '1 Hour', data: tokenData.stats1h },
              { label: '6 Hours', data: tokenData.stats6h },
              { label: '24 Hours', data: tokenData.stats24h }
            ].map(({ label, data }) => {
              const priceChange = formatPercentage(data.priceChange);
              return (
                <div key={label} className="space-y-2">
                  <h4 className="font-semibold text-sm">{label}</h4>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span>Price Change:</span>
                      <span className={cn(priceChange.isPositive ? 'text-green-600' : 'text-red-600')}>
                        {priceChange.text}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Buy Volume:</span>
                      <span>${formatNumber(data.buyVolume)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Sell Volume:</span>
                      <span>${formatNumber(data.sellVolume)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Traders:</span>
                      <span>{data.numTraders}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Security Audit */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Security Audit
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span>Mint Authority:</span>
                <Badge variant={tokenData.audit.mintAuthorityDisabled ? "default" : "destructive"}>
                  {tokenData.audit.mintAuthorityDisabled ? "Disabled ✓" : "Enabled ⚠️"}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span>Freeze Authority:</span>
                <Badge variant={tokenData.audit.freezeAuthorityDisabled ? "default" : "destructive"}>
                  {tokenData.audit.freezeAuthorityDisabled ? "Disabled ✓" : "Enabled ⚠️"}
                </Badge>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span>Top Holders %:</span>
                <span>{tokenData.audit.topHoldersPercentage.toFixed(2)}%</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Dev Balance %:</span>
                <span>{tokenData.audit.devBalancePercentage.toFixed(2)}%</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Launch Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Launch Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-semibold mb-2">Launchpad</h4>
              <div className="space-y-1 text-sm">
                <div>Platform: <Badge variant="outline">{tokenData.launchpad}</Badge></div>
                <div>Meta: <Badge variant="outline">{tokenData.metaLaunchpad}</Badge></div>
                <div>Bonding Curve: {tokenData.bondingCurve}%</div>
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Timeline</h4>
              <div className="space-y-1 text-sm">
                <div>First Pool: {new Date(tokenData.firstPool.createdAt).toLocaleDateString()}</div>
                <div>Graduated: {new Date(tokenData.graduatedAt).toLocaleDateString()}</div>
                <div>Last Update: {new Date(tokenData.updatedAt).toLocaleDateString()}</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tags */}
      {tokenData.tags.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Tags</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {tokenData.tags.map((tag) => (
                <Badge key={tag} variant="secondary" className="capitalize">
                  {tag.replace('-', ' ')}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Helius Asset Data */}
      {heliusData && (
        <>
          {/* Token Metadata */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Token Metadata
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold mb-2">Basic Information</h4>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span>Interface:</span>
                      <Badge variant="outline">{heliusData.interface}</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>Token Standard:</span>
                      <Badge variant="outline">{heliusData.content.metadata.token_standard}</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>Mutable:</span>
                      <Badge variant={heliusData.mutable ? "destructive" : "default"}>
                        {heliusData.mutable ? "Yes ⚠️" : "No ✓"}
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>Burnt:</span>
                      <Badge variant={heliusData.burnt ? "destructive" : "default"}>
                        {heliusData.burnt ? "Yes" : "No"}
                      </Badge>
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Supply Information</h4>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span>Total Supply:</span>
                      <span>{formatNumber(heliusData.token_info.supply / Math.pow(10, heliusData.token_info.decimals))}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Decimals:</span>
                      <span>{heliusData.token_info.decimals}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Program:</span>
                      <span className="font-mono text-xs">{heliusData.token_info.token_program.slice(0, 8)}...</span>
                    </div>
                    {heliusData.token_info.price_info && (
                      <div className="flex justify-between">
                        <span>Helius Price:</span>
                        <span>${heliusData.token_info.price_info.price_per_token.toFixed(6)}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Technical Details */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="w-5 h-5" />
                Technical Details
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold mb-2">Authorities</h4>
                  <div className="space-y-1 text-sm">
                    {heliusData.authorities.map((auth, index) => (
                      <div key={index} className="flex justify-between">
                        <span>Authority:</span>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs">{auth.address.slice(0, 8)}...</span>
                          <Badge variant="outline" className="text-xs">
                            {auth.scopes.join(', ')}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Ownership</h4>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span>Ownership Model:</span>
                      <Badge variant="outline">{heliusData.ownership.ownership_model}</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>Frozen:</span>
                      <Badge variant={heliusData.ownership.frozen ? "destructive" : "default"}>
                        {heliusData.ownership.frozen ? "Yes ⚠️" : "No ✓"}
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>Delegated:</span>
                      <Badge variant={heliusData.ownership.delegated ? "secondary" : "default"}>
                        {heliusData.ownership.delegated ? "Yes" : "No"}
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>

              {heliusData.content.files.length > 0 && (
                <div className="mt-4">
                  <h4 className="font-semibold mb-2">Media Files</h4>
                  <div className="space-y-2">
                    {heliusData.content.files.map((file, index) => (
                      <div key={index} className="flex items-center justify-between p-2 bg-muted rounded">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-xs">{file.mime}</Badge>
                          <span className="text-sm font-mono">{file.uri.slice(0, 50)}...</span>
                        </div>
                        <Button variant="ghost" size="sm" asChild>
                          <a href={file.uri} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {heliusData.content.json_uri && (
                <div className="mt-4">
                  <h4 className="font-semibold mb-2">Metadata URI</h4>
                  <div className="flex items-center justify-between p-2 bg-muted rounded">
                    <span className="text-sm font-mono">{heliusData.content.json_uri}</span>
                    <Button variant="ghost" size="sm" asChild>
                      <a href={heliusData.content.json_uri} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}