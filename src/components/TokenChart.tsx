import { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Area, AreaChart } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { type ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from './ui/chart';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { TrendingUp, TrendingDown, RefreshCw, DollarSign } from 'lucide-react';
import { cn } from '@/lib/utils';
import { getKirbyTokenData, type TokenData } from '@/lib/api';

// Types for price data
export interface PricePoint {
  timestamp: number;
  price: number;
  volume?: number;
  market_cap?: number;
}

export interface TokenChartData {
  symbol: string;
  name: string;
  current_price: number;
  price_change_24h: number;
  price_change_percentage_24h: number;
  market_cap?: number;
  total_volume?: number;
  prices: PricePoint[];
}

// Chart configuration options
export type ChartType = 'line' | 'area';
export type TimeRange = '1H' | '6H' | '12H' | '1D' | '7D' | 'ALL';
export type PriceDataSource = 'api' | 'geckoterminal';

export interface TokenChartProps {
  // Token identification
  tokenSymbol?: string;
  tokenAddress?: string;

  // Appearance
  chartType?: ChartType;
  timeRange?: TimeRange;
  height?: number;
  className?: string;

  // Features
  showVolume?: boolean;
  showMarketCap?: boolean;
  showPercentageChange?: boolean;
  showTimeRangeSelector?: boolean;
  showRefreshButton?: boolean;

  // Data source
  dataSource?: PriceDataSource;

  // API endpoints (when using 'api' data source)
  apiBaseUrl?: string;

  // Styling
  positiveColor?: string;
  negativeColor?: string;
  gridColor?: string;

  // Callbacks
  onDataLoad?: (data: TokenChartData) => void;
  onError?: (error: string) => void;
  onTimeRangeChange?: (range: TimeRange) => void;
}



// Time range configurations - optimized for week-old token
const timeRangeConfigs: Record<TimeRange, { days: number; label: string; points: number }> = {
  '1H': { days: 1 / 24, label: '1H', points: 12 },     // 1 hour, 5-min intervals
  '6H': { days: 6 / 24, label: '6H', points: 12 },     // 6 hours, 30-min intervals  
  '12H': { days: 12 / 24, label: '12H', points: 12 },  // 12 hours, 1-hour intervals
  '1D': { days: 1, label: '1D', points: 24 },        // 1 day, 1-hour intervals
  '7D': { days: 7, label: '7D', points: 7 },         // 7 days, 1-day intervals
  'ALL': { days: 7, label: 'ALL', points: 7 }        // All data (max 7 days for new token)
};

const mapTokenDataToChartData = (data: TokenData): TokenChartData => ({
  symbol: data.symbol ?? '',
  name: data.name ?? '',
  current_price: typeof data.price === 'number' ? data.price : (typeof data.price === 'string' ? parseFloat(data.price) : 0) || 0,
  price_change_24h: data.priceChange24h || 0,
  price_change_percentage_24h: data.priceChange24h || 0,
  market_cap: typeof data.marketCap === 'number' ? data.marketCap : (typeof data.marketCap === 'string' ? parseFloat(data.marketCap) : 0) || 0,
  total_volume: data.volume24h || 0,
  prices: [],
});

export function TokenChart({
  tokenSymbol = 'SOL',
  tokenAddress,
  chartType = 'area',
  timeRange = '7D',
  height = 300,
  className,
  showVolume = false,
  showMarketCap = false,
  showPercentageChange = true,
  showTimeRangeSelector = true,
  showRefreshButton = true,
  positiveColor = 'var(--chart-positive)',
  negativeColor = 'var(--chart-negative)',
  onDataLoad,
  onError,
  onTimeRangeChange
}: TokenChartProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [stats, setStats] = useState<TokenChartData | null>(null);
  const [chartData, setChartData] = useState<PricePoint[]>([]);
  const [currentTimeRange, setCurrentTimeRange] = useState<TimeRange>(timeRange);
  const [error, setError] = useState<string | null>(null);

  // Always use getKirbyTokenData for stats
  const fetchStats = async (): Promise<TokenData> => {
    const data = await getKirbyTokenData();
    if (!data) throw new Error('No token data available');
    return data;
  };

  // Always use GeckoTerminal for chart data
  const fetchGeckoTerminalChart = async (range: TimeRange): Promise<PricePoint[]> => {
    const days = timeRangeConfigs[range].days;

    // Select appropriate timeframe for GeckoTerminal API
    let timeframe = 'hour';
    if (days < 1) timeframe = 'minute';        // 1H, 6H, 12H use minute data
    else if (days <= 7) timeframe = 'hour';    // 1D, 7D, ALL use hour data
    else timeframe = 'day';                    // (not used for week-old token)

    // Use the pool address instead of token address for OHLCV data
    const KIRBY_POOL_ADDRESS = 'BU3u3cZgywn4B8KWBdpdBoQQzdP4tugjtc9a6Ga2tYbe'; // KIRBY/SOL pool
    const ohlcvResponse = await fetch(
      `https://api.geckoterminal.com/api/v2/networks/solana/pools/${KIRBY_POOL_ADDRESS}/ohlcv/${timeframe}`
    );

    let historicalData: PricePoint[] = [];

    if (ohlcvResponse.ok) {
      const ohlcvData = await ohlcvResponse.json();
      let ohlcvList = ohlcvData.data?.attributes?.ohlcv_list || ohlcvData.data || ohlcvData || [];

      if (Array.isArray(ohlcvList) && ohlcvList.length > 0) {
        historicalData = ohlcvList.map((arr: [number, number, number, number, number, number]) => ({
          timestamp: Number(arr[0]) * 1000, // seconds to ms
          price: Number(arr[4]),            // close price
          volume: Number(arr[5]),           // volume
          market_cap: 0
        }));

        // Sort by timestamp (oldest first for proper chart display)
        historicalData.sort((a, b) => a.timestamp - b.timestamp);
      }
    } else {
      throw new Error(`GeckoTerminal API failed with status ${ohlcvResponse.status}`);
    }

    return historicalData;
  };

  // Load both stats and chart data on mount and when dependencies change
  useEffect(() => {
    setIsLoading(true);
    setError(null);

    Promise.all([
      fetchStats(),
      fetchGeckoTerminalChart(currentTimeRange)
    ])
      .then(([statsData, chartPoints]) => {
        const chartStats = mapTokenDataToChartData(statsData);
        setStats(chartStats);

        // Add date and time fields for chart X axis
        const chartDataWithDate = chartPoints.map(point => ({
          ...point,
          date: new Date(point.timestamp).toLocaleDateString(),
          time: new Date(point.timestamp).toLocaleTimeString(),
        }));

        setChartData(chartDataWithDate);
        onDataLoad?.(chartStats);
      })
      .catch((err) => {
        const errorMessage = err instanceof Error ? err.message : 'Failed to fetch chart data';
        setError(errorMessage);
        onError?.(errorMessage);
      })
      .finally(() => setIsLoading(false));
  }, [tokenSymbol, tokenAddress, currentTimeRange]);

  // Handle time range change
  const handleTimeRangeChange = (newRange: TimeRange) => {
    setCurrentTimeRange(newRange);
    onTimeRangeChange?.(newRange);
  };

  // Handle refresh
  const handleRefresh = () => {
    setIsLoading(true);
    setError(null);
    Promise.all([
      fetchStats(),
      fetchGeckoTerminalChart(currentTimeRange)
    ])
      .then(([statsData, chartPoints]) => {
        const chartStats = mapTokenDataToChartData(statsData);
        setStats(chartStats);
        // Add date and time fields for chart X axis
        const chartDataWithDate = chartPoints.map(point => ({
          ...point,
          date: new Date(point.timestamp).toLocaleDateString(),
          time: new Date(point.timestamp).toLocaleTimeString(),
        }));
        setChartData(chartDataWithDate);
        onDataLoad?.(chartStats);
      })
      .catch((err) => {
        const errorMessage = err instanceof Error ? err.message : 'Failed to fetch chart data';
        setError(errorMessage);
        onError?.(errorMessage);
      })
      .finally(() => setIsLoading(false));
  };

  // Chart configuration
  const chartConfig: ChartConfig = {
    price: {
      label: 'Price',
      color: 'var(--chart-color-primary)',
    },
    volume: {
      label: 'Volume',
      color: 'var(--chart-color-secondary)',
    }
  };

  // Calculate price trend
  const isPositive = stats && stats.price_change_percentage_24h >= 0;

  if (error) {
    return (
      <Card className={cn('token-chart token-chart--error', className)}>
        <CardContent className="p-6">
          <div className="flex items-center justify-center h-48 text-center">
            <div>
              <div className="text-red-500 mb-2">Error loading chart data</div>
              <div className="text-sm text-muted-foreground mb-4">{error}</div>
              {showRefreshButton && (
                <Button variant="outline" size="sm" onClick={handleRefresh}>
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Retry
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={cn('token-chart', className)}>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="w-5 h-5" />
              {stats?.name || `${tokenSymbol} Price`}
              {showPercentageChange && stats && (
                <Badge variant={isPositive ? 'default' : 'destructive'} className="ml-2">
                  {isPositive ? (
                    <TrendingUp className="w-3 h-3 mr-1" />
                  ) : (
                    <TrendingDown className="w-3 h-3 mr-1" />
                  )}
                  {stats.price_change_percentage_24h?.toFixed(2) || '0.00'}%

                </Badge>
              )}

            </CardTitle>
            <CardDescription>
              {stats && (
                <div className="flex items-center gap-4 mt-1">
                  <span className={cn('token-chart__price text-2xl font-bold', isPositive ? 'token-chart__price--positive' : 'token-chart__price--negative')} style={{ color: isPositive ? positiveColor : negativeColor }}>
                    ${stats.current_price && typeof stats.current_price === 'number' ? (stats.current_price >= 0.01 ? stats.current_price.toFixed(2) : stats.current_price.toFixed(8)) : '0.00'}
                  </span>
                  {showMarketCap && stats.market_cap && (
                    <span className="text-sm text-muted-foreground">
                      MCap: ${(stats.market_cap / 1000000).toFixed(1)}M
                    </span>
                  )}
                  {showVolume && stats.total_volume && (
                    <span className="text-sm text-muted-foreground">
                      Vol: ${stats.total_volume >= 1000000 ? `${(stats.total_volume / 1000000).toFixed(1)}M` : `${(stats.total_volume / 1000).toFixed(0)}K`}
                    </span>
                  )}
                </div>
              )}
            </CardDescription>
          </div>

          <div className="flex items-center gap-2">
            {showRefreshButton && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleRefresh}
                disabled={isLoading}
              >
                <RefreshCw className={cn('w-4 h-4', isLoading && 'animate-spin')} />
              </Button>
            )}

            {showTimeRangeSelector && (
              <div className="flex items-center gap-1">
                {(Object.keys(timeRangeConfigs) as TimeRange[]).map((range) => (
                  <Button
                    key={range}
                    variant={currentTimeRange === range ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => handleTimeRangeChange(range)}
                    className="text-xs px-2"
                  >
                    {timeRangeConfigs[range].label}
                  </Button>
                ))}
              </div>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent>
        {isLoading ? (
          <div className="flex items-center justify-center h-48">
            <RefreshCw className="w-6 h-6 animate-spin" />
          </div>
        ) : (
          chartData.length === 0 ? (
            <div className="flex items-center justify-center h-48 text-muted-foreground">
              No chart data available.
            </div>
          ) : (
            <ChartContainer config={chartConfig} className="w-full">
              <ResponsiveContainer width="100%" height={height}>
                {chartType === 'area' ? (
                  <AreaChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--chart-grid)" className="token-chart__grid" />
                    <XAxis
                      dataKey="date"
                      axisLine={false}
                      tickLine={false}
                      className="text-xs"
                    />
                    <YAxis
                      axisLine={false}
                      tickLine={false}
                      className="text-xs"
                      domain={['dataMin', 'dataMax']}
                      tickFormatter={(value) => value >= 0.01 ? `$${value.toFixed(4)}` : `$${value.toPrecision(6)}`}
                    />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Area
                      type="monotone"
                      dataKey="price"
                      stroke="var(--chart-line-color)"
                      fill="var(--chart-line-color)"
                      fillOpacity={0.1}
                      strokeWidth={2}
                      className={cn('token-chart__area', isPositive ? 'token-chart__area--positive' : 'token-chart__area--negative')}
                    />
                  </AreaChart>
                ) : (
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--chart-grid)" className="token-chart__grid" />
                    <XAxis
                      dataKey="date"
                      axisLine={false}
                      tickLine={false}
                      className="text-xs"
                    />
                    <YAxis
                      axisLine={false}
                      tickLine={false}
                      className="text-xs"
                      domain={['dataMin', 'dataMax']}
                      tickFormatter={(value) => value >= 0.01 ? `$${value.toFixed(4)}` : `$${value.toPrecision(6)}`}
                    />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Line
                      type="monotone"
                      dataKey="price"
                      stroke="var(--chart-line-color)"
                      strokeWidth={2}
                      dot={false}
                      className={cn('token-chart__line', isPositive ? 'token-chart__line--positive' : 'token-chart__line--negative')}
                    />
                  </LineChart>
                )}
              </ResponsiveContainer>
            </ChartContainer>
          )
        )}
      </CardContent>
    </Card>
  );
}
