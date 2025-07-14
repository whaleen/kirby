import { ExternalLink, Star, Users, Sparkles, Rocket } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { TokenStats } from '@/components/TokenStats'
import './App.css'

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-50 to-indigo-100">
      {/* Header */}
      <header className="relative overflow-hidden bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 text-white">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative max-w-7xl mx-auto px-6 py-16 sm:py-24">
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <div className="relative">
                <img 
                  src="/logo.jpg" 
                  alt="Kirby On Sol Logo" 
                  className="w-20 h-20 sm:w-24 sm:h-24 rounded-full shadow-lg animate-pulse"
                />
                <Sparkles className="w-8 h-8 text-pink-200 absolute -top-2 -right-2 animate-bounce" />
              </div>
            </div>
            <h1 className="text-4xl sm:text-6xl font-bold mb-4 bg-gradient-to-r from-yellow-200 to-pink-200 bg-clip-text text-transparent">
              Kirby On Sol
            </h1>
            <p className="text-xl sm:text-2xl mb-8 text-pink-100 font-medium">
              Kirb got a bit too excited at Jupiter Studio
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center flex-wrap">
              <Button 
                asChild
                size="lg"
                className="bg-yellow-400 text-purple-900 font-bold hover:bg-yellow-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              >
                <a 
                  href="https://jup.ag/studio/EoLW32eUjN9XibMLEb53CMzLtg9XxnHFU6fbpSukjups" 
                  target="_blank" 
                  rel="noopener noreferrer"
                >
                  <Rocket className="w-5 h-5 mr-2" />
                  Get $KIRBY
                  <ExternalLink className="w-4 h-4 ml-2" />
                </a>
              </Button>
              <Button 
                asChild
                variant="secondary"
                size="lg"
                className="bg-white/20 backdrop-blur-sm border border-white/30 hover:bg-white/30 text-white"
              >
                <a 
                  href="https://t.me/kirbyonjup" 
                  target="_blank" 
                  rel="noopener noreferrer"
                >
                  <Users className="w-5 h-5 mr-2" />
                  Join Community
                  <ExternalLink className="w-4 h-4 ml-2" />
                </a>
              </Button>
              <Button 
                asChild
                variant="outline"
                size="lg"
                className="bg-white/10 backdrop-blur-sm border border-orange-300/50 hover:bg-white/20 text-white hover:text-white"
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

      {/* Token Info Section */}
      <section className="py-16 bg-white/70 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-4">
              About $KIRBY
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              A community-driven token that raised $100K in just 2 hours! Now the second-largest holding 
              in Jupiter Exchange's @litterboxtrust with 69,420 $KIRBY transactions.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="bg-gradient-to-br from-pink-400 to-purple-500 border-0 text-white shadow-xl hover:shadow-2xl transition-shadow">
              <CardHeader className="text-center pb-4">
                <Star className="w-12 h-12 mx-auto mb-4 text-yellow-300 fill-current" />
                <CardTitle className="text-xl font-bold">Community Driven</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <CardDescription className="text-pink-100">
                  Built by and for the Jupiter Studio creator collective
                </CardDescription>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-br from-purple-500 to-indigo-500 border-0 text-white shadow-xl hover:shadow-2xl transition-shadow">
              <CardHeader className="text-center pb-4">
                <Rocket className="w-12 h-12 mx-auto mb-4 text-yellow-300" />
                <CardTitle className="text-xl font-bold">Studio Summer</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <CardDescription className="text-purple-100">
                  Part of the collaborative workspace initiative
                </CardDescription>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-br from-indigo-500 to-pink-500 border-0 text-white shadow-xl hover:shadow-2xl transition-shadow">
              <CardHeader className="text-center pb-4">
                <Sparkles className="w-12 h-12 mx-auto mb-4 text-yellow-300" />
                <CardTitle className="text-xl font-bold">Meme Culture</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <CardDescription className="text-indigo-100">
                  Terribly made memes using Microsoft Paint
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Token Statistics */}
      <TokenStats />

      {/* Community Section */}
      <section className="py-16 bg-gradient-to-r from-purple-500/10 to-pink-500/10">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-8">
            Join the Creator Collective
          </h2>
          <p className="text-lg text-gray-600 mb-12 max-w-2xl mx-auto">
            Connect with fellow creators, share memes, and be part of the Jupiter Studio community.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Button 
              asChild
              size="lg"
              className="bg-blue-500 text-white font-bold hover:bg-blue-600 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              <a 
                href="https://t.me/kirbyonjup" 
                target="_blank" 
                rel="noopener noreferrer"
              >
                <Users className="w-6 h-6 mr-3" />
                Telegram Community
                <ExternalLink className="w-5 h-5 ml-3" />
              </a>
            </Button>
            <Button 
              asChild
              size="lg"
              className="bg-gray-900 text-white font-bold hover:bg-gray-800 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              <a 
                href="https://x.com/KirbyOnStudio" 
                target="_blank" 
                rel="noopener noreferrer"
              >
                <ExternalLink className="w-6 h-6 mr-3" />
                Follow on X
              </a>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <Star className="w-8 h-8 text-yellow-300 fill-current" />
            </div>
            <h3 className="text-2xl font-bold mb-4">Kirby On Sol</h3>
            <p className="text-gray-400 mb-6">
              Official website for $KIRBY launched on Jupiter Studio
            </p>
            <div className="flex justify-center space-x-6 mb-6">
              <a href="https://jup.ag/studio/EoLW32eUjN9XibMLEb53CMzLtg9XxnHFU6fbpSukjups" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
                Jupiter Studio
              </a>
              <a href="https://t.me/kirbyonjup" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
                Telegram
              </a>
              <a href="https://x.com/KirbyOnStudio" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
                X (Twitter)
              </a>
            </div>
            <div className="flex justify-center items-center text-gray-500 text-sm">
              <span>Powered by</span>
              <img src="/helius-logo-mark.svg" alt="Helius" className="w-4 h-4 mx-2" />
              <a href="https://helius.dev" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
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
