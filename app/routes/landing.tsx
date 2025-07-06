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
      <header className="border-b border-gray-100 bg-white/95 backdrop-blur-lg sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <div className="relative group">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 via-cyan-500 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105">
                  <span className="text-white font-bold text-lg">C</span>
                </div>
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 via-green-500/20 to-cyan-500/20 rounded-xl blur-md opacity-0 group-hover:opacity-100 transition-all duration-300"></div>
              </div>
              <div>
                <span className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                  Cosmiq
                </span>
                <div className="text-xs text-gray-500 font-medium -mt-1">AI Web3 Builder</div>
              </div>
            </div>

            <nav className="hidden md:flex items-center space-x-8">
              <a
                href="#features"
                className="text-gray-600 hover:text-indigo-600 transition-colors font-medium relative group"
              >
                Features
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-indigo-600 transition-all duration-300 group-hover:w-full"></span>
              </a>
              <a
                href="#how-it-works"
                className="text-gray-600 hover:text-indigo-600 transition-colors font-medium relative group"
              >
                How It Works
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-indigo-600 transition-all duration-300 group-hover:w-full"></span>
              </a>
              <a
                href="#use-cases"
                className="text-gray-600 hover:text-indigo-600 transition-colors font-medium relative group"
              >
                Use Cases
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-indigo-600 transition-all duration-300 group-hover:w-full"></span>
              </a>
            </nav>

            <div className="flex items-center space-x-4">
              <Link to="/" className="hidden sm:block">
                <Button
                  variant="secondary"
                  className="text-gray-700 border-gray-300 hover:bg-gray-50 hover:border-gray-400 transition-all font-medium"
                >
                  Sign In
                </Button>
              </Link>
              <Link to="/">
                <Button className="bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-2.5 rounded-xl hover:from-green-600 hover:to-green-700 transform hover:scale-105 transition-all shadow-lg hover:shadow-xl font-semibold">
                  Start Building
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-24 px-8 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto text-center">
          <div className="mb-6">
            <span className="inline-block px-4 py-2 bg-gradient-to-r from-green-100 to-green-200 text-green-800 rounded-full text-sm font-semibold tracking-wide uppercase">
              🚀 Production-Ready Web3 Apps
            </span>
          </div>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold text-black mb-8 leading-[1.1] tracking-tight">
            Build Complete{' '}
            <span className="bg-gradient-to-r from-green-500 to-green-600 bg-clip-text text-transparent">
              Smart Contract
            </span>
            <br />
            <span className="bg-gradient-to-r from-black to-black bg-clip-text text-transparent">Integrated</span>{' '}
            <span className="bg-gradient-to-r from-green-500 to-green-600 bg-clip-text text-transparent">
              Web3 Apps
            </span>{' '}
            with{' '}
            <span className="bg-gradient-to-r from-blue-500 via-purple-500 to-cyan-500 bg-clip-text text-transparent">
              AI
            </span>
            .
          </h1>
          <p className="text-lg md:text-xl text-gray-600 mb-10 max-w-3xl mx-auto leading-relaxed font-medium">
            Deploy fully functional Web3 applications with integrated smart contracts and seamless blockchain
            connectivity—all through natural language commands.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
            <Link to="/">
              <Button className="bg-gradient-to-r from-green-500 to-green-600 text-white px-10 py-4 rounded-xl text-lg font-bold hover:from-green-600 hover:to-green-700 transform hover:scale-105 transition-all shadow-xl">
                Start Building Free
              </Button>
            </Link>
            <Button
              variant="secondary"
              className="px-10 py-4 rounded-xl text-lg font-semibold border-2 border-gray-300 hover:bg-gray-50 hover:border-gray-400 transition-all"
            >
              Watch Demo
            </Button>
          </div>

          <div className="max-w-3xl mx-auto mb-12">
            <video
              className="w-full rounded-2xl shadow-lg"
              controls
              autoPlay
              muted
              poster="/images/hero-poster.png"
              src="/video.mp4"
            >
              Your browser does not support the video tag.
            </video>
          </div>

          {/* Example Prompt */}
          <div className="max-w-2xl mx-auto">
            <p className="text-sm text-gray-500 mb-3 font-medium">Try this example:</p>
            <div className="bg-white border-2 border-gray-100 rounded-2xl p-6 text-left shadow-lg hover:shadow-xl transition-shadow">
              <p className="text-gray-800 italic font-medium">
                "Create a decentralized voting system with token-based governance and automatic proposal execution"
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-green-50/60 to-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-black mb-4">Powerful Features for Web3 Builders</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Everything you need to build, deploy, and scale Web3 applications with the power of AI
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-gradient-to-br from-green-50/70 to-green-100/40 backdrop-blur-sm border border-green-200/40 rounded-2xl p-8 h-full hover:from-green-50/80 hover:to-green-100/50 hover:border-green-200/60 transition-all duration-300 hover:shadow-lg hover:shadow-green-100/60"
              >
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-bold text-black mb-3">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-white to-blue-50/40">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-black mb-4">How It Works</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">From idea to deployed dApp in minutes, not months</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            <div className="text-center bg-gradient-to-br from-green-50/60 to-green-100/30 backdrop-blur-sm border border-green-200/30 rounded-2xl p-8 hover:from-green-50/70 hover:to-green-100/40 hover:border-green-200/50 transition-all duration-300 hover:shadow-lg hover:shadow-green-100/40">
              <div className="w-20 h-20 bg-gradient-to-br from-green-300 to-green-400 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-6 shadow-lg">
                1
              </div>
              <h3 className="text-xl font-bold text-black mb-4">Describe Your Idea</h3>
              <p className="text-gray-600 leading-relaxed">
                Tell our AI what Web3 app you want to build using natural language
              </p>
            </div>

            <div className="text-center bg-gradient-to-br from-green-50/60 to-green-100/30 backdrop-blur-sm border border-green-200/30 rounded-2xl p-8 hover:from-green-50/70 hover:to-green-100/40 hover:border-green-200/50 transition-all duration-300 hover:shadow-lg hover:shadow-green-100/40">
              <div className="w-20 h-20 bg-gradient-to-br from-green-300 to-green-400 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-6 shadow-lg">
                2
              </div>
              <h3 className="text-xl font-bold text-black mb-4">AI Generates Code</h3>
              <p className="text-gray-600 leading-relaxed">
                Our AI creates smart contracts, frontend code, and integration layers
              </p>
            </div>

            <div className="text-center bg-gradient-to-br from-green-50/60 to-green-100/30 backdrop-blur-sm border border-green-200/30 rounded-2xl p-8 hover:from-green-50/70 hover:to-green-100/40 hover:border-green-200/50 transition-all duration-300 hover:shadow-lg hover:shadow-green-100/40">
              <div className="w-20 h-20 bg-gradient-to-br from-green-300 to-green-400 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-6 shadow-lg">
                3
              </div>
              <h3 className="text-xl font-bold text-black mb-4">Review & Customize</h3>
              <p className="text-gray-600 leading-relaxed">
                Preview your app, make adjustments, and customize features as needed
              </p>
            </div>

            <div className="text-center bg-gradient-to-br from-green-50/60 to-green-100/30 backdrop-blur-sm border border-green-200/30 rounded-2xl p-8 hover:from-green-50/70 hover:to-green-100/40 hover:border-green-200/50 transition-all duration-300 hover:shadow-lg hover:shadow-green-100/40">
              <div className="w-20 h-20 bg-gradient-to-br from-green-300 to-green-400 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-6 shadow-lg">
                4
              </div>
              <h3 className="text-xl font-bold text-black mb-4">Deploy to Flow</h3>
              <p className="text-gray-600 leading-relaxed">
                One-click deployment to Flow blockchain with automatic optimization
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Use Cases Section */}
      <section id="use-cases" className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-slate-50 to-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <div className="mb-6">
              <span className="inline-block px-4 py-2 bg-indigo-100 text-indigo-800 rounded-full text-sm font-semibold tracking-wide uppercase">
                💡 Use Cases
              </span>
            </div>
            <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-6">What You Can Build</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              From DeFi protocols to gaming dApps, build any Web3 application you can imagine
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {useCases.map((useCase, index) => (
              <div
                key={index}
                className="bg-white rounded-3xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] border border-slate-200/50"
              >
                <div className="mb-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-white to-white rounded-2xl flex items-center justify-center mb-4">
                    <span className="text-white text-2xl">
                      {index === 0 ? '💰' : index === 1 ? '🎨' : index === 2 ? '🎮' : '🏛️'}
                    </span>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">{useCase.title}</h3>
                  <p className="text-gray-600 mb-6 leading-relaxed text-lg">{useCase.description}</p>
                </div>
                <div className="bg-gradient-to-r from-green-50 to-green-50 rounded-2xl p-6 border-l-4 border-green-500">
                  <p className="text-sm text-gray-700 font-medium">
                    <span className="text-green-600 font-semibold">Example:</span> {useCase.example}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Technology Stack */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-white to-green-50/30">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-black mb-4">Powered by Advanced Technology</h2>
          <p className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto">
            Built on cutting-edge AI models and optimized for the Flow blockchain ecosystem
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-grey-300 to-grey-400 rounded-xl mx-auto mb-4 flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                <span className="text-white text-2xl">🔷</span>
              </div>
              <h4 className="font-semibold text-black">Flow Blockchain</h4>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-grey-300 to-grey-400 rounded-xl mx-auto mb-4 flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                <span className="text-white text-2xl">🧠</span>
              </div>
              <h4 className="font-semibold text-black">Latest AI Models</h4>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-grey-300 to-grey-400 rounded-xl mx-auto mb-4 flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                <span className="text-white text-2xl">⚡</span>
              </div>
              <h4 className="font-semibold text-black">Cadence Smart Contracts</h4>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-grey-300 to-grey-400 rounded-xl mx-auto mb-4 flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                <span className="text-white text-2xl">🌐</span>
              </div>
              <h4 className="font-semibold text-black">Modern Web Stack</h4>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-50 to-gray-100 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-white/60 to-gray-100/60"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(59,130,246,0.05),transparent_50%)] opacity-60"></div>

        <div className="max-w-5xl mx-auto text-center relative">
          <div className="mb-8">
            <span className="inline-block px-6 py-3 bg-white/80 backdrop-blur-sm text-gray-700 rounded-full text-sm font-semibold tracking-wide uppercase border border-gray-200/50 shadow-sm">
              ✨ Start Your Web3 Journey
            </span>
          </div>

          <h2 className="text-4xl md:text-6xl font-extrabold text-gray-900 mb-8 leading-tight">
            Ready to Build the
            <br />
            <span className="bg-gradient-to-r from-green-600 to-green-700 bg-clip-text text-transparent">
              Future of Web3?
            </span>
          </h2>

          <p className="text-xl md:text-2xl text-gray-600 mb-12 leading-relaxed max-w-3xl mx-auto font-medium">
            Join thousands of developers building the next generation of Web3 applications with AI-powered tools
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-8">
            <Link to="/">
              <Button className="bg-gradient-to-r from-green-500 to-green-600 text-white px-12 py-5 rounded-2xl text-xl font-bold hover:from-green-600 hover:to-green-700 transform hover:scale-105 transition-all shadow-xl hover:shadow-green-500/20 min-w-[280px]">
                🚀 Start Building for Free
              </Button>
            </Link>
            <Button
              variant="secondary"
              className="border-2 border-gray-300 text-gray-700 px-12 py-5 rounded-2xl text-xl font-bold hover:bg-white hover:border-gray-400 transition-all backdrop-blur-sm min-w-[280px] bg-white/60"
            >
              📚 GitHub
            </Button>
          </div>

          <div className="flex flex-col sm:flex-row gap-8 justify-center items-center text-gray-500 text-sm">
            <div className="flex items-center gap-2">
              <span className="text-green-500">✓</span>
              <span>No credit card required</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-green-500">✓</span>
              <span>Deploy in minutes</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-green-500">✓</span>
              <span>Production-ready code</span>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gradient-to-b from-gray-50 to-white border-t border-gray-100 py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            <div className="md:col-span-2">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 via-cyan-500 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg">
                  <span className="text-white font-bold text-lg">C</span>
                </div>
                <span className="text-2xl font-bold text-gray-900">Cosmiq</span>
              </div>
              <p className="text-gray-600 text-lg leading-relaxed mb-6 max-w-md">
                Building the future of Web3 development with AI-powered tools and Flow blockchain integration.
              </p>
              <div className="flex space-x-4">
                <a
                  href="#"
                  className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-md hover:shadow-lg transition-all hover:scale-105 border border-gray-200"
                >
                  <span className="text-gray-600 text-lg">📧</span>
                </a>
                <a
                  href="#"
                  className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-md hover:shadow-lg transition-all hover:scale-105 border border-gray-200"
                >
                  <span className="text-gray-600 text-lg">🐦</span>
                </a>
                <a
                  href="#"
                  className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-md hover:shadow-lg transition-all hover:scale-105 border border-gray-200"
                >
                  <span className="text-gray-600 text-lg">💬</span>
                </a>
              </div>
            </div>

            <div>
              <h4 className="font-bold text-gray-900 mb-6 text-lg">Product</h4>
              <ul className="space-y-4">
                <li>
                  <a href="#features" className="text-gray-600 hover:text-green-600 transition-colors font-medium">
                    Features
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-600 hover:text-green-600 transition-colors font-medium">
                    Pricing
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-600 hover:text-green-600 transition-colors font-medium">
                    Changelog
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-600 hover:text-green-600 transition-colors font-medium">
                    API Reference
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-gray-900 mb-6 text-lg">Resources</h4>
              <ul className="space-y-4">
                <li>
                  <a href="#" className="text-gray-600 hover:text-green-600 transition-colors font-medium">
                    Documentation
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-600 hover:text-green-600 transition-colors font-medium">
                    Tutorials
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-600 hover:text-green-600 transition-colors font-medium">
                    Examples
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-600 hover:text-green-600 transition-colors font-medium">
                    Community
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-200 mt-12 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
              <p className="text-gray-500 text-sm">
                © 2025 Cosmiq. All rights reserved. Built with ❤️ for the Web3 community.
              </p>
              <div className="flex space-x-6 text-sm">
                <a href="#" className="text-gray-500 hover:text-green-600 transition-colors">
                  Privacy Policy
                </a>
                <a href="#" className="text-gray-500 hover:text-green-600 transition-colors">
                  Terms of Service
                </a>
                <a href="#" className="text-gray-500 hover:text-green-600 transition-colors">
                  Support
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
