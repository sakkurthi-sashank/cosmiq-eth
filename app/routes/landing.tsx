import { json } from '@remix-run/cloudflare';
import { Link } from '@remix-run/react';
import { Button } from '~/components/ui/Button';
import { Card } from '~/components/ui/Card';
import { GradientCard } from '~/components/ui/GradientCard';

export const loader = () => json({});

export default function Landing() {
  const features = [
    {
      icon: '🤖',
      title: 'AI-Powered Development',
      description:
        'Transform natural language descriptions into fully functional Web3 applications using cutting-edge AI models.',
    },
    {
      icon: '⛓️',
      title: 'Smart Contract Generation',
      description:
        'Automatically generate, deploy, and optimize smart contracts on Flow blockchain with best practices built-in.',
    },
    {
      icon: '🌐',
      title: 'Full-Stack Web3 Apps',
      description: 'Build complete dApps with seamless frontend-blockchain integration, not just smart contracts.',
    },
    {
      icon: '⚡',
      title: 'Flow Blockchain Integration',
      description: 'Native support for Flow blockchain with optimized performance and developer-friendly tools.',
    },
    {
      icon: '🔗',
      title: 'Seamless Connection',
      description:
        'Automatically connect your frontend application with deployed smart contracts using secure protocols.',
    },
    {
      icon: '🚀',
      title: 'One-Click Deploy',
      description: 'Deploy your complete Web3 application with a single command - from smart contracts to frontend.',
    },
  ];

  const useCases = [
    {
      title: 'DeFi Applications',
      description: 'Create decentralized finance apps, trading platforms, and yield farming protocols',
      example: '"Build a decentralized exchange with liquidity pools"',
    },
    {
      title: 'NFT Marketplaces',
      description: 'Launch NFT platforms with minting, trading, and royalty management',
      example: '"Create an NFT marketplace for digital art with auction features"',
    },
    {
      title: 'Gaming dApps',
      description: 'Develop blockchain games with in-game assets and token economies',
      example: '"Build a play-to-earn RPG game with NFT characters"',
    },
    {
      title: 'DAO Platforms',
      description: 'Build governance platforms and decentralized autonomous organizations',
      example: '"Create a DAO for community-driven project funding"',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">C</span>
              </div>
              <span className="text-xl font-bold text-black">CosmIQ</span>
            </div>
            <nav className="hidden md:flex space-x-8">
              <a href="#features" className="text-gray-600 hover:text-black transition-colors">
                Features
              </a>
              <a href="#how-it-works" className="text-gray-600 hover:text-black transition-colors">
                How It Works
              </a>
              <a href="#use-cases" className="text-gray-600 hover:text-black transition-colors">
                Use Cases
              </a>
            </nav>
            <Link to="/">
              <Button className="bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-2 rounded-lg hover:from-green-600 hover:to-green-700 transition-all">
                Start Building
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <div className="mb-8">
            <span className="inline-block px-4 py-2 bg-gradient-to-r from-green-100 to-green-200 text-green-800 rounded-full text-sm font-medium mb-4">
              🚀 The Future of Web3 Development
            </span>
          </div>
          <h1 className="text-5xl md:text-7xl font-bold text-black mb-6 leading-tight">
            Build Web3 Apps with
            <span className="bg-gradient-to-r from-green-500 to-green-600 bg-clip-text text-transparent">
              {' '}
              AI Magic
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-4xl mx-auto leading-relaxed">
            Transform your ideas into production-ready Web3 applications using natural language. Generate smart
            contracts, build frontends, and deploy to Flow blockchain - all powered by advanced AI.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <Link to="/">
              <Button className="bg-gradient-to-r from-green-500 to-green-600 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:from-green-600 hover:to-green-700 transform hover:scale-105 transition-all shadow-lg">
                Start Building Now
              </Button>
            </Link>
            <Button
              variant="secondary"
              className="px-8 py-4 rounded-xl text-lg font-semibold border border-gray-300 hover:bg-gray-50 transition-all"
            >
              Watch Demo
            </Button>
          </div>

          {/* Example Prompt */}
          <div className="max-w-3xl mx-auto">
            <p className="text-sm text-gray-500 mb-3">Try an example prompt:</p>
            <div className="bg-white border border-gray-200 rounded-xl p-6 text-left">
              <p className="text-black italic">
                "Create a decentralized voting system where users can create proposals, vote with tokens, and
                automatically execute approved proposals on Flow blockchain"
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-black mb-4">Powerful Features for Web3 Builders</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Everything you need to build, deploy, and scale Web3 applications with the power of AI
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <GradientCard key={index} className="p-8 h-full">
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-bold text-black mb-3">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </GradientCard>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-black mb-4">How It Works</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">From idea to deployed dApp in minutes, not months</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">
                1
              </div>
              <h3 className="text-xl font-bold text-black mb-3">Describe Your Idea</h3>
              <p className="text-gray-600">Tell our AI what Web3 app you want to build using natural language</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-green-600 to-green-700 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">
                2
              </div>
              <h3 className="text-xl font-bold text-black mb-3">AI Generates Code</h3>
              <p className="text-gray-600">Our AI creates smart contracts, frontend code, and integration layers</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-green-500 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">
                3
              </div>
              <h3 className="text-xl font-bold text-black mb-3">Review & Customize</h3>
              <p className="text-gray-600">Preview your app, make adjustments, and customize features as needed</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-green-300 to-green-400 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">
                4
              </div>
              <h3 className="text-xl font-bold text-black mb-3">Deploy to Flow</h3>
              <p className="text-gray-600">One-click deployment to Flow blockchain with automatic optimization</p>
            </div>
          </div>
        </div>
      </section>

      {/* Use Cases Section */}
      <section id="use-cases" className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-black mb-4">What You Can Build</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              From DeFi protocols to gaming dApps, build any Web3 application you can imagine
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {useCases.map((useCase, index) => (
              <Card key={index} className="p-8 hover:shadow-lg transition-shadow">
                <h3 className="text-2xl font-bold text-black mb-4">{useCase.title}</h3>
                <p className="text-gray-600 mb-4 leading-relaxed">{useCase.description}</p>
                <div className="bg-gray-50 rounded-lg p-4 border-l-4 border-green-500">
                  <p className="text-sm text-gray-600 italic">Example: {useCase.example}</p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Technology Stack */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-black mb-4">Powered by Advanced Technology</h2>
          <p className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto">
            Built on cutting-edge AI models and optimized for the Flow blockchain ecosystem
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-green-600 rounded-xl mx-auto mb-4 flex items-center justify-center">
                <span className="text-white text-2xl">🔷</span>
              </div>
              <h4 className="font-semibold text-black">Flow Blockchain</h4>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-green-600 to-green-700 rounded-xl mx-auto mb-4 flex items-center justify-center">
                <span className="text-white text-2xl">🧠</span>
              </div>
              <h4 className="font-semibold text-black">Latest AI Models</h4>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-green-500 rounded-xl mx-auto mb-4 flex items-center justify-center">
                <span className="text-white text-2xl">⚡</span>
              </div>
              <h4 className="font-semibold text-black">Cadence Smart Contracts</h4>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-green-300 to-green-400 rounded-xl mx-auto mb-4 flex items-center justify-center">
                <span className="text-white text-2xl">🌐</span>
              </div>
              <h4 className="font-semibold text-black">Modern Web Stack</h4>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-green-500 to-green-600">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">Ready to Build the Future?</h2>
          <p className="text-xl text-green-100 mb-8 leading-relaxed">
            Join thousands of developers who are already building the next generation of Web3 applications with AI
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/">
              <Button className="bg-white text-green-600 px-8 py-4 rounded-xl text-lg font-semibold hover:bg-gray-100 transform hover:scale-105 transition-all shadow-lg">
                Start Building for Free
              </Button>
            </Link>
            <Button
              variant="secondary"
              className="border-2 border-white text-white px-8 py-4 rounded-xl text-lg font-semibold hover:bg-white hover:text-green-600 transition-all"
            >
              View Documentation
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">C</span>
                </div>
                <span className="text-xl font-bold text-black">CosmIQ</span>
              </div>
              <p className="text-gray-600">
                Building the future of Web3 development with AI-powered tools and Flow blockchain integration.
              </p>
            </div>

            <div>
              <h4 className="font-semibold text-black mb-4">Product</h4>
              <ul className="space-y-2">
                <li>
                  <a href="#features" className="text-gray-600 hover:text-black transition-colors">
                    Features
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-600 hover:text-black transition-colors">
                    Pricing
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-600 hover:text-black transition-colors">
                    Changelog
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-black mb-4">Resources</h4>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="text-gray-600 hover:text-black transition-colors">
                    Documentation
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-600 hover:text-black transition-colors">
                    Tutorials
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-600 hover:text-black transition-colors">
                    Examples
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-black mb-4">Community</h4>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="text-gray-600 hover:text-black transition-colors">
                    Discord
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-600 hover:text-black transition-colors">
                    Twitter
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-600 hover:text-black transition-colors">
                    GitHub
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-200 mt-8 pt-8 text-center">
            <p className="text-gray-600">© 2025 CosmIQ. All rights reserved. Built with ❤️ for the Web3 community.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
