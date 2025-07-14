import { ExternalLink, Star, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { TokenStats } from '@/components/TokenStats'
import './App.css'

function App() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="relative overflow-hidden bg-primary text-primary-foreground">
        <div className="relative max-w-7xl mx-auto px-6 py-16 sm:py-24">
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <div className="relative">
                <img
                  src="/logo.jpg"
                  alt="Kirby On Sol Logo"
                  className="w-20 h-20 sm:w-24 sm:h-24"
                />
                <Sparkles className="w-8 h-8 text-muted-foreground absolute -top-2 -right-2" />
              </div>
            </div>
            <h1 className="text-4xl sm:text-6xl font-bold mb-4 text-primary-foreground">
              Kirby On Sol
            </h1>
            <p className="text-xl sm:text-2xl mb-8 text-muted-foreground font-medium">
              Kirb got a bit too excited at Jupiter Studio
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center flex-wrap">
              <Button
                asChild
                size="lg"
                className="bg-primary text-primary-foreground font-bold hover:bg-primary/90"
              >
                <a
                  href="https://jup.ag/tokens/EoLW32eUjN9XibMLEb53CMzLtg9XxnHFU6fbpSukjups"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img src="/jupiter-logo.webp" alt="Jupiter" className="w-5 h-5 mr-2" />
                  Get $KIRBY
                  <ExternalLink className="w-4 h-4 ml-2" />
                </a>
              </Button>
              <Button
                asChild
                variant="secondary"
                size="lg"
                className="bg-secondary hover:bg-secondary/90 text-secondary-foreground"
              >
                <a
                  href="https://t.me/kirbyonjup"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img src="/telegram-logo.png" alt="Telegram" className="w-5 h-5 mr-2" />
                  Join Community
                  <ExternalLink className="w-4 h-4 ml-2" />
                </a>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="bg-secondary hover:bg-secondary/90 text-secondary-foreground border border-border"
              >
                <a
                  href="https://orb.helius.dev/address/EoLW32eUjN9XibMLEb53CMzLtg9XxnHFU6fbpSukjups/metadata?cluster=mainnet-beta"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center"
                >
                  <img src="/helius-logo-mark.svg" alt="Helius" className="w-5 h-5 mr-2" />
                  Explorer
                  <ExternalLink className="w-4 h-4 ml-2" />
                </a>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Token Statistics */}
      <TokenStats />

      {/* Community Section */}
      <section className="py-16 bg-background">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-8">
            Join the Creator Collective
          </h2>
          <p className="text-lg text-muted-foreground mb-12 max-w-2xl mx-auto">
            Connect with fellow creators, share memes, and be part of the Jupiter Studio community.
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Button
              asChild
              size="lg"
              className="bg-primary text-primary-foreground font-bold hover:bg-primary/90"
            >
              <a
                href="https://t.me/kirbyonjup"
                target="_blank"
                rel="noopener noreferrer"
              >
                <img src="/telegram-logo.png" alt="Telegram" className="w-6 h-6 mr-3" />
                Telegram Community
                <ExternalLink className="w-5 h-5 ml-3" />
              </a>
            </Button>
            <Button
              asChild
              size="lg"
              className="bg-secondary text-secondary-foreground font-bold hover:bg-secondary/90"
            >
              <a
                href="https://x.com/KirbyOnStudio"
                target="_blank"
                rel="noopener noreferrer"
              >
                <img src="/x-logo.png" alt="X" className="w-6 h-6 mr-3" />
                Follow on X
              </a>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-muted text-muted-foreground py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <Star className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-2xl font-bold mb-4 text-foreground">Kirby On Sol</h3>
            <p className="text-muted-foreground mb-6">
              Official website for $KIRBY launched on Jupiter Studio
            </p>
            <div className="flex justify-center space-x-6 mb-6">
              <a href="https://jup.ag/studio/EoLW32eUjN9XibMLEb53CMzLtg9XxnHFU6fbpSukjups" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground transition-colors">
                Jupiter Studio
              </a>
              <a href="https://t.me/kirbyonjup" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground transition-colors">
                Telegram
              </a>
              <a href="https://x.com/KirbyOnStudio" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground transition-colors">
                X (Twitter)
              </a>
            </div>
            <div className="flex justify-center items-center text-muted-foreground text-sm">
              <span>Powered by</span>
              <img src="/helius-logo-mark.svg" alt="Helius" className="w-4 h-4 mx-2" />
              <a href="https://helius.dev" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors">
                Helius
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default App
