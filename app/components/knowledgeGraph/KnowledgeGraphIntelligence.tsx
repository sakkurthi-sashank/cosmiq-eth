import React, { useState } from 'react';
import { useFlowAuth } from '../../lib/contexts/FlowAuthContext';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { Tabs } from '../ui/Tabs';
import { Tooltip } from '../ui/Tooltip';
import DappDiscoveryEngine from './DappDiscoveryEngine';
import CompositionIntelligence from './CompositionIntelligence';
import DeveloperInsightsDashboard from './DeveloperInsightsDashboard';
import { KnowledgeGraphStatus } from './KnowledgeGraphStatus';

interface KnowledgeGraphIntelligenceProps {
  className?: string;
}

export const KnowledgeGraphIntelligence: React.FC<KnowledgeGraphIntelligenceProps> = ({ className = '' }) => {
  const { user, isAuthenticated } = useFlowAuth();
  const [activeTab, setActiveTab] = useState<'overview' | 'discovery' | 'composition' | 'insights'>('overview');

  const renderOverview = () => (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 px-4 py-2 rounded-full">
          <Badge variant="success" className="text-xs">
            Knowledge Graph Intelligence
          </Badge>
        </div>
        <h1 className="text-4xl font-bold bg-gradient-to-r from-green-600 to-green-600 bg-clip-text text-transparent">
          Cosmiq Intelligence Platform
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          AI-powered insights into the Web3 ecosystem built on Hypergraph's Knowledge Graph Framework
        </p>
      </div>

      {/* Feature Cards */}
      <div className="grid md:grid-cols-3 gap-6">
        <Card
          className="p-6 hover:shadow-lg transition-shadow cursor-pointer"
          onClick={() => setActiveTab('discovery')}
        >
          <div className="text-center space-y-3">
            <div className="text-4xl">🔍</div>
            <h3 className="text-xl font-semibold">Smart Discovery</h3>
            <p className="text-gray-600 dark:text-gray-400">
              AI-powered search and analytics for exploring the dapp ecosystem
            </p>
            <div className="flex justify-center space-x-2">
              <Badge variant="outline" className="text-xs">
                Search
              </Badge>
              <Badge variant="outline" className="text-xs">
                Analytics
              </Badge>
              <Badge variant="outline" className="text-xs">
                Trends
              </Badge>
            </div>
          </div>
        </Card>

        <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setActiveTab('insights')}>
          <div className="text-center space-y-3">
            <div className="text-4xl">📊</div>
            <h3 className="text-xl font-semibold">Developer Insights</h3>
            <p className="text-gray-600 dark:text-gray-400">
              Comprehensive analytics and market opportunities for developers
            </p>
            <div className="flex justify-center space-x-2">
              <Badge variant="outline" className="text-xs">
                Metrics
              </Badge>
              <Badge variant="outline" className="text-xs">
                Gaps
              </Badge>
              <Badge variant="outline" className="text-xs">
                Success
              </Badge>
            </div>
          </div>
        </Card>
      </div>

      {/* Value Proposition */}
      <Card className="p-8 bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20">
        <div className="text-center space-y-6">
          <h2 className="text-2xl font-bold">Why Knowledge Graph Intelligence?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="space-y-2">
              <div className="text-3xl">🌐</div>
              <h3 className="font-semibold">Composable by Design</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Built on Hypergraph's GRC-20 standard, enabling seamless integration with any knowledge graph
                application
              </p>
            </div>
            <div className="space-y-2">
              <div className="text-3xl">🔒</div>
              <h3 className="font-semibold">Privacy-First</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                End-to-end encrypted data storage with user-controlled access and decentralized architecture
              </p>
            </div>
            <div className="space-y-2">
              <div className="text-3xl">⚡</div>
              <h3 className="font-semibold">Real-time Intelligence</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Live analytics and insights that update automatically as new dapps are published to the network
              </p>
            </div>
          </div>
        </div>
      </Card>

      {/* Technical Architecture */}
      <Card className="p-8">
        <div className="space-y-6">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Technical Architecture</h2>
            <p className="text-gray-600 dark:text-gray-400">
              Built on The Graph's Hypergraph Knowledge Graph Framework
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">🏗️ Core Components</h3>
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <span className="text-blue-500 mt-1">•</span>
                  <div>
                    <span className="font-medium">GRC-20 Schema:</span>
                    <span className="text-gray-600 dark:text-gray-400 ml-2">
                      Structured dapp metadata with properties, types, and relations
                    </span>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <span className="text-blue-500 mt-1">•</span>
                  <div>
                    <span className="font-medium">Intelligence Service:</span>
                    <span className="text-gray-600 dark:text-gray-400 ml-2">
                      AI-powered analytics and recommendation engine
                    </span>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <span className="text-blue-500 mt-1">•</span>
                  <div>
                    <span className="font-medium">Composition Engine:</span>
                    <span className="text-gray-600 dark:text-gray-400 ml-2">
                      Pattern recognition and integration opportunity identification
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold text-lg">🔗 Integration Points</h3>
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <span className="text-green-500 mt-1">•</span>
                  <div>
                    <span className="font-medium">Knowledge Graph API:</span>
                    <span className="text-gray-600 dark:text-gray-400 ml-2">
                      Query and publish structured data using standard protocols
                    </span>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <span className="text-green-500 mt-1">•</span>
                  <div>
                    <span className="font-medium">Cross-Space Compatibility:</span>
                    <span className="text-gray-600 dark:text-gray-400 ml-2">
                      Works with any Hypergraph space or application
                    </span>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <span className="text-green-500 mt-1">•</span>
                  <div>
                    <span className="font-medium">External APIs:</span>
                    <span className="text-gray-600 dark:text-gray-400 ml-2">
                      Extensible integration with blockchain data and web APIs
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Knowledge Graph Status */}
      <KnowledgeGraphStatus />

      {/* Call to Action */}
      <div className="text-center space-y-4">
        <h2 className="text-2xl font-bold">Ready to Explore?</h2>
        <p className="text-gray-600 dark:text-gray-400">Start discovering insights in the CosmiqETH ecosystem</p>
        <div className="flex justify-center space-x-4">
          <Button variant="default" size="lg" onClick={() => setActiveTab('discovery')}>
            🔍 Start Discovery
          </Button>
        </div>
      </div>
    </div>
  );

  if (!isAuthenticated) {
    return (
      <div className={`space-y-6 ${className}`}>
        <Card className="p-8 text-center">
          <div className="text-4xl mb-4">🔐</div>
          <h3 className="text-lg font-semibold mb-2">Authentication Required</h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Connect your wallet to access the Knowledge Graph Intelligence Platform
          </p>
          <Button variant="default" onClick={() => (window.location.href = '/')}>
            Go to CosmiqETH to Connect Wallet
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      <Tabs
        tabs={[
          { id: 'overview', label: '🏠 Overview' },
          { id: 'discovery', label: '🔍 Discovery' },
          { id: 'insights', label: '📊 Insights' },
        ]}
        activeTab={activeTab}
        onTabChange={(tab) => setActiveTab(tab as any)}
      />

      <div className="min-h-[600px]">
        {activeTab === 'overview' && renderOverview()}
        {activeTab === 'discovery' && <DappDiscoveryEngine />}
        {activeTab === 'insights' && <DeveloperInsightsDashboard />}
      </div>
    </div>
  );
};

export default KnowledgeGraphIntelligence;
