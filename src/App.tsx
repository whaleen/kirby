import { Button } from '@/components/ui/button'
import { TokenStats } from '@/components/TokenStats'
import { TokenChart } from '@/components/TokenChart'
import './App.css'
import './styles/monochrome.css'

function App() {
  return (
    <div className="min-h-screen bg-background monochrome">
      {/* Header */}
      <header className="bg-secondary">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="text-center">
            <div className="flex justify-center mb-4">
              <img
                src="/logo.jpg"
                alt="Kirby On Studio"
                className="w-16 h-16"
              />
            </div>
            <h1 className="text-3xl font-bold mb-2 text-foreground">
              Kirby On Studio
            </h1>
            <p className="text-lg mb-6 text-muted-foreground">
              Kirb got a bit too excited at Jupiter Studio
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button
                asChild
                size="default"
                className="bg-primary text-primary-foreground font-medium hover:bg-accent"
              >
                <a
                  href="https://jup.ag/tokens/EoLW32eUjN9XibMLEb53CMzLtg9XxnHFU6fbpSukjups"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img src="/jupiter-logo.webp" alt="Jupiter" className="w-4 h-4 mr-2" />
                  Get $KIRBY
                </a>
              </Button>
              <Button
                asChild
                variant="secondary"
                size="default"
                className="bg-muted hover:bg-accent text-foreground"
              >
                <a
                  href="https://t.me/kirbyonjup"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img src="/telegram-logo.png" alt="Telegram" className="w-4 h-4 mr-2" />
                  Telegram
                </a>
              </Button>
              <Button
                asChild
                variant="secondary"
                size="default"
                className="bg-muted hover:bg-accent text-foreground"
              >
                <a
                  href="https://orb.helius.dev/address/EoLW32eUjN9XibMLEb53CMzLtg9XxnHFU6fbpSukjups/metadata?cluster=mainnet-beta"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img src="/helius-logo-mark.svg" alt="Helius" className="w-4 h-4 mr-2" />
                  View on Helius
                </a>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Token Statistics */}
      <TokenStats />

      {/* Token Chart */}
      <section className="py-8 bg-background">
        <div className="max-w-4xl mx-auto px-4">
          <div className="mb-4">
            <h2 className="text-xl font-bold text-foreground mb-2">
              Price Chart
            </h2>
          </div>
          <TokenChart
            tokenSymbol="KIRBY"
            tokenAddress="EoLW32eUjN9XibMLEb53CMzLtg9XxnHFU6fbpSukjups"
            showMarketCap={true}
            showVolume={true}
            height={320}
            timeRange="7D"
            className="token-chart"
          />
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-muted py-6">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center">
            <div className="flex justify-center space-x-4 mb-4 text-sm">
              <a href="https://jup.ag/studio/EoLW32eUjN9XibMLEb53CMzLtg9XxnHFU6fbpSukjups" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground">
                View on Jupiter Studio
              </a>
              <a href="https://orb.helius.dev/address/EoLW32eUjN9XibMLEb53CMzLtg9XxnHFU6fbpSukjups/metadata?cluster=mainnet-beta" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground">
                View on Helius Explorer
              </a>
              <a href="https://t.me/kirbyonjup" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground">
                Telegram
              </a>
              <a href="https://x.com/KirbyOnStudio" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground">
                X
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default App
