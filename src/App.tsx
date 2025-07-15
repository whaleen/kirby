import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu'
import { TokenStats } from '@/components/TokenStats'
import { TokenChart } from '@/components/TokenChart'
import { HoldersPage } from '@/components/HoldersPage'
import { cn } from '@/lib/utils'
import './App.css'
import './styles/monochrome.css'

function App() {
  const [currentView, setCurrentView] = useState<'overview' | 'holders'>('overview');

  return (
    <div className="min-h-screen bg-background monochrome">
      {/* Top Navigation Bar */}
      <nav 
        className="border-b backdrop-blur supports-[backdrop-filter]:bg-background/60"
        style={{ backgroundColor: '#000100' }}
      >
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <img
                src="/logo.jpg"
                alt="Kirby On Studio"
                className="w-10 h-10 rounded-full"
              />
              <span className="font-bold text-lg text-white">Kirby On Studio</span>
            </div>

            {/* Navigation Menu */}
            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <NavigationMenuLink
                    className={cn(
                      navigationMenuTriggerStyle(),
                      "cursor-pointer !bg-gray-800 !text-white hover:!bg-gray-700",
                      currentView === 'overview' && "!bg-white !text-black hover:!bg-gray-100"
                    )}
                    onClick={() => setCurrentView('overview')}
                  >
                    Overview
                  </NavigationMenuLink>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <NavigationMenuLink
                    className={cn(
                      navigationMenuTriggerStyle(),
                      "cursor-pointer !bg-gray-800 !text-white hover:!bg-gray-700",
                      currentView === 'holders' && "!bg-white !text-black hover:!bg-gray-100"
                    )}
                    onClick={() => setCurrentView('holders')}
                  >
                    Holders
                  </NavigationMenuLink>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          </div>
        </div>
      </nav>

      {/* Header */}
      <header 
        className="relative"
        style={{ backgroundColor: '#000100' }}
      >
        {/* Kirby in Space GIF */}
        <img 
          src="/kirby-in-space.gif" 
          alt="Kirby in Space" 
          className="absolute top-4 right-4 h-40 w-auto z-10"
        />
        
        <div className="max-w-4xl mx-auto px-4 py-8 relative z-10">
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-2 text-white">
              Kirby On Studio
            </h1>
            <p className="text-lg mb-6 text-gray-300">
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

      {/* Main Content */}
      {currentView === 'overview' ? (
        <>
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
        </>
      ) : (
        <section className="py-8 bg-background">
          <div className="max-w-6xl mx-auto px-4">
            <HoldersPage />
          </div>
        </section>
      )}

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
