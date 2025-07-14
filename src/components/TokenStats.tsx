import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ExternalLink, TrendingUp, Users, Coins, DollarSign } from 'lucide-react';
import { getKirbyTokenData, type TokenData } from '@/lib/api';

export function TokenStats() {
  const [tokenData, setTokenData] = useState<TokenData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTokenData() {
      try {
        const data = await getKirbyTokenData();
        setTokenData(data);
      } catch (error) {
        console.error('Failed to fetch token data:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchTokenData();
  }, []);

  if (loading) {
    return (
      <section className="py-16 bg-white/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-4">
              Token Statistics
            </h2>
            <div className="animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto"></div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (!tokenData) {
    return null;
  }

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  const formatPrice = (price: number) => {
    if (price < 0.01) {
      return price.toExponential(2);
    }
    return price.toFixed(4);
  };

  return (
    <section className="py-16 bg-white/50 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-4">
            Token Statistics
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Real-time data for $KIRBY token powered by Helius
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="border-2 border-pink-200 hover:border-pink-300 transition-colors">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Price</CardTitle>
              <DollarSign className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                ${formatPrice(tokenData.price || 0)}
              </div>
              <CardDescription className="text-xs text-gray-500">
                Current market price
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="border-2 border-purple-200 hover:border-purple-300 transition-colors">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Market Cap</CardTitle>
              <TrendingUp className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">
                ${formatNumber(tokenData.marketCap || 0)}
              </div>
              <CardDescription className="text-xs text-gray-500">
                Total market value
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="border-2 border-blue-200 hover:border-blue-300 transition-colors">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Holders</CardTitle>
              <Users className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">
                {formatNumber(tokenData.holders || 0)}
              </div>
              <CardDescription className="text-xs text-gray-500">
                Unique token holders
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="border-2 border-orange-200 hover:border-orange-300 transition-colors">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Supply</CardTitle>
              <Coins className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">
                {formatNumber(parseInt(tokenData.supply || '0') / Math.pow(10, tokenData.decimals || 6))}
              </div>
              <CardDescription className="text-xs text-gray-500">
                Total $KIRBY in circulation
              </CardDescription>
            </CardContent>
          </Card>
        </div>

        <div className="text-center">
          <Button asChild variant="outline" size="lg" className="border-orange-200 hover:bg-orange-50">
            <a 
              href="https://orb.helius.dev/address/EoLW32eUjN9XibMLEb53CMzLtg9XxnHFU6fbpSukjups/metadata?cluster=mainnet-beta"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center"
            >
              <img src="/helius-logo-mark.svg" alt="Helius" className="w-5 h-5 mr-2" />
              View on Helius Explorer
              <ExternalLink className="w-4 h-4 ml-2" />
            </a>
          </Button>
        </div>
      </div>
    </section>
  );
}