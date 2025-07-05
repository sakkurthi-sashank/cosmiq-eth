import React, { useState, useEffect } from 'react';
import { useFlowAuth } from '../../lib/contexts/FlowAuthContext';
import {
  dappIntelligenceService,
  type IntelligenceQuery,
  type IntelligenceResult,
} from '../../lib/services/dappIntelligenceService';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { SearchInput } from '../ui/SearchInput';
import { Tabs } from '../ui/Tabs';
import { LoadingDots } from '../ui/LoadingDots';
import { Tooltip } from '../ui/Tooltip';

interface DappDiscoveryEngineProps {
  className?: string;
}

export const DappDiscoveryEngine: React.FC<DappDiscoveryEngineProps> = ({ className = '' }) => {
  const { user, isAuthenticated } = useFlowAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedTechStack, setSelectedTechStack] = useState<string[]>([]);
  const [deploymentFilter, setDeploymentFilter] = useState<'all' | 'deployed' | 'undeployed'>('all');
  const [searchResults, setSearchResults] = useState<IntelligenceResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'search' | 'trends' | 'insights'>('search');
  const [trendingData, setTrendingData] = useState<any>(null);

  const categories = [
    'E-commerce',
    'Social Media',
    'Gaming',
    'Finance',
    'Music',
    'Art/NFT',
    'Real Estate',
    'Supply Chain',
    'Productivity',
    'Other',
  ];

  const techStackOptions = [
    'React',
    'TypeScript',
    'Flow',
    'FCL',
    'Cadence',
    'Vite',
    'TailwindCSS',
    'Framer Motion',
    'Smart Contracts',
    'WebSocket',
    'AI/ML',
  ];

  useEffect(() => {
    if (activeTab === 'trends') {
      loadTrendingData();
    }
  }, [activeTab]);

  useEffect(() => {
    if (searchQuery || selectedCategory || selectedTechStack.length > 0) {
      performSearch();
    }
  }, [searchQuery, selectedCategory, selectedTechStack, deploymentFilter]);

  const loadTrendingData = async () => {
    try {
      setIsLoading(true);
      const trends = await dappIntelligenceService.getTrendingAnalysis();
      setTrendingData(trends);
    } catch (error) {
      console.error('Failed to load trending data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const performSearch = async () => {
    if (!searchQuery && !selectedCategory && selectedTechStack.length === 0) {
      setSearchResults(null);
      return;
    }

    try {
      setIsLoading(true);
      const query: IntelligenceQuery = {
        query: searchQuery,
        filters: {
          category: selectedCategory || undefined,
          techStack: selectedTechStack.length > 0 ? selectedTechStack : undefined,
          deploymentStatus: deploymentFilter,
        },
        limit: 20,
      };

      const result = await dappIntelligenceService.queryDapps(query);
      setSearchResults(result);
    } catch (error) {
      console.error('Search failed:', error);
      setSearchResults(null);
    } finally {
      setIsLoading(false);
    }
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('');
    setSelectedTechStack([]);
    setDeploymentFilter('all');
    setSearchResults(null);
  };

  const toggleTechStack = (tech: string) => {
    setSelectedTechStack((prev) => (prev.includes(tech) ? prev.filter((t) => t !== tech) : [...prev, tech]));
  };

  const renderSearchTab = () => (
    <div className="space-y-6">
      {/* Search Input */}
      <div className="space-y-4">
        <SearchInput
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search dapps by description, tech stack, or functionality..."
          className="w-full"
        />

        {/* Filters */}
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">Category</label>
            <div className="flex flex-wrap gap-2">
              <Button
                variant={selectedCategory === '' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedCategory('')}
              >
                All Categories
              </Button>
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedCategory(category)}
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">Technology Stack</label>
            <div className="flex flex-wrap gap-2">
              {techStackOptions.map((tech) => (
                <Button
                  key={tech}
                  variant={selectedTechStack.includes(tech) ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => toggleTechStack(tech)}
                >
                  {tech}
                  {selectedTechStack.includes(tech) && ' ✓'}
                </Button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">Deployment Status</label>
            <div className="flex gap-2">
              {(['all', 'deployed', 'undeployed'] as const).map((status) => (
                <Button
                  key={status}
                  variant={deploymentFilter === status ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setDeploymentFilter(status)}
                >
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </Button>
              ))}
            </div>
          </div>

          {(searchQuery || selectedCategory || selectedTechStack.length > 0 || deploymentFilter !== 'all') && (
            <Button variant="outline" size="sm" onClick={clearFilters}>
              Clear Filters
            </Button>
          )}
        </div>
      </div>

      {/* Loading */}
      {isLoading && (
        <Card className="p-8 text-center">
          <LoadingDots text="Analyzing dapp ecosystem..." />
        </Card>
      )}

      {/* Search Results */}
      {searchResults && !isLoading && (
        <div className="space-y-6">
          {/* Analytics Overview */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">📊 Search Analytics</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  {searchResults.analytics.totalDapps}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Total Dapps</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                  {searchResults.analytics.deploymentStats.deployed}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Deployed</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                  {Object.keys(searchResults.analytics.categoryCounts).length}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Categories</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                  {Math.round(searchResults.analytics.deploymentStats.deploymentRate)}%
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Success Rate</div>
              </div>
            </div>
          </Card>

          {/* AI Insights */}
          {searchResults.insights.length > 0 && (
            <Card className="p-6 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <span className="mr-2">🤖</span>
                AI Insights
              </h3>
              <div className="space-y-2">
                {searchResults.insights.map((insight, index) => (
                  <div key={index} className="flex items-start space-x-2">
                    <span className="text-blue-500 mt-1">•</span>
                    <span className="text-sm">{insight}</span>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* Dapp Results */}
          <div>
            <h3 className="text-lg font-semibold mb-4">🔍 Search Results ({searchResults.matches.length} found)</h3>
            {searchResults.matches.length === 0 ? (
              <Card className="p-8 text-center">
                <div className="text-4xl mb-4">🤷‍♀️</div>
                <h4 className="text-lg font-medium mb-2">No dapps found</h4>
                <p className="text-gray-600 dark:text-gray-400">
                  Try adjusting your search criteria or explore trending categories.
                </p>
              </Card>
            ) : (
              <div className="grid gap-4">
                {searchResults.matches.map((dapp) => (
                  <Card key={dapp.knowledgeGraphId} className="p-4 hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h4 className="font-semibold text-lg">{dapp.name}</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{dapp.description}</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant={dapp.contractDeployed ? 'success' : 'default'}>
                          {dapp.contractDeployed ? '🚀 Deployed' : '🛠️ Development'}
                        </Badge>
                        <Badge variant="outline">{dapp.category}</Badge>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div>
                        <span className="text-xs font-medium text-gray-500 uppercase">Tech Stack:</span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {dapp.techStack.map((tech) => (
                            <span key={tech} className="text-xs bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
                              {tech}
                            </span>
                          ))}
                        </div>
                      </div>

                      {dapp.smartContractFunctions.length > 0 && (
                        <div>
                          <span className="text-xs font-medium text-gray-500 uppercase">Functions:</span>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {dapp.smartContractFunctions.slice(0, 3).map((func) => (
                              <span key={func} className="text-xs bg-blue-100 dark:bg-blue-900/50 px-2 py-1 rounded">
                                {func}
                              </span>
                            ))}
                            {dapp.smartContractFunctions.length > 3 && (
                              <span className="text-xs text-gray-500">
                                +{dapp.smartContractFunctions.length - 3} more
                              </span>
                            )}
                          </div>
                        </div>
                      )}

                      <div className="flex justify-between items-center text-xs text-gray-500 pt-2 border-t border-gray-200 dark:border-gray-700">
                        <span>ID: {dapp.knowledgeGraphId.slice(0, 8)}...</span>
                        <span>{new Date(dapp.generationTimestamp).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>

          {/* Recommendations */}
          {searchResults.recommendations.length > 0 && (
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <span className="mr-2">💡</span>
                Recommended Similar Dapps
              </h3>
              <div className="grid gap-3">
                {searchResults.recommendations.slice(0, 5).map((rec) => (
                  <div
                    key={rec.dappId}
                    className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
                  >
                    <div>
                      <div className="font-medium">{rec.name}</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">{rec.recommendationReason}</div>
                      {rec.sharedTags.length > 0 && (
                        <div className="flex gap-1 mt-1">
                          {rec.sharedTags.map((tag) => (
                            <span key={tag} className="text-xs bg-green-100 dark:bg-green-900/50 px-2 py-1 rounded">
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium">{Math.round(rec.similarityScore * 100)}% match</div>
                      <Badge variant="outline">{rec.category}</Badge>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          )}
        </div>
      )}
    </div>
  );

  const renderTrendsTab = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold">📈 Trending Analysis</h3>

      {isLoading && (
        <Card className="p-8 text-center">
          <LoadingDots text="Analyzing trends..." />
        </Card>
      )}

      {trendingData && !isLoading && (
        <div className="space-y-6">
          {/* Trending Categories */}
          <Card className="p-6">
            <h4 className="font-semibold mb-4">🏆 Trending Categories</h4>
            <div className="space-y-3">
              {trendingData.trendingCategories.slice(0, 5).map((cat: any, index: number) => (
                <div key={cat.name} className="flex justify-between items-center">
                  <div className="flex items-center space-x-3">
                    <span className="text-lg font-bold text-gray-400">#{index + 1}</span>
                    <span className="font-medium">{cat.name}</span>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium">{cat.count} dapps</div>
                    <div className={`text-xs ${cat.growth > 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {cat.growth > 0 ? '↗' : '↘'} {Math.abs(cat.growth).toFixed(1)}%
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Trending Tech Stacks */}
          <Card className="p-6">
            <h4 className="font-semibold mb-4">⚡ Trending Technologies</h4>
            <div className="space-y-3">
              {trendingData.trendingTechStacks.slice(0, 5).map((tech: any, index: number) => (
                <div key={tech.name} className="flex justify-between items-center">
                  <div className="flex items-center space-x-3">
                    <span className="text-lg font-bold text-gray-400">#{index + 1}</span>
                    <span className="font-medium">{tech.name}</span>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium">{tech.count} uses</div>
                    <div className={`text-xs ${tech.growth > 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {tech.growth > 0 ? '↗' : '↘'} {Math.abs(tech.growth).toFixed(1)}%
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Emerging Patterns */}
          {trendingData.emergingPatterns.length > 0 && (
            <Card className="p-6 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20">
              <h4 className="font-semibold mb-4 flex items-center">
                <span className="mr-2">🌟</span>
                Emerging Patterns
              </h4>
              <div className="space-y-2">
                {trendingData.emergingPatterns.map((pattern: string, index: number) => (
                  <div key={index} className="flex items-start space-x-2">
                    <span className="text-purple-500 mt-1">•</span>
                    <span className="text-sm">{pattern}</span>
                  </div>
                ))}
              </div>
            </Card>
          )}
        </div>
      )}
    </div>
  );

  const renderInsightsTab = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold">🧠 Developer Insights</h3>

      <Card className="p-6">
        <h4 className="font-semibold mb-4">Coming Soon</h4>
        <div className="space-y-4">
          <div className="flex items-center space-x-3 text-gray-600 dark:text-gray-400">
            <span className="text-lg">👥</span>
            <span>Developer collaboration recommendations</span>
          </div>
          <div className="flex items-center space-x-3 text-gray-600 dark:text-gray-400">
            <span className="text-lg">🎯</span>
            <span>Market gap analysis</span>
          </div>
          <div className="flex items-center space-x-3 text-gray-600 dark:text-gray-400">
            <span className="text-lg">🚀</span>
            <span>Success pattern identification</span>
          </div>
          <div className="flex items-center space-x-3 text-gray-600 dark:text-gray-400">
            <span className="text-lg">🔮</span>
            <span>Predictive analytics</span>
          </div>
        </div>
      </Card>
    </div>
  );

  if (!isAuthenticated) {
    return (
      <Card className="p-8 text-center">
        <div className="text-4xl mb-4">🔐</div>
        <h3 className="text-lg font-semibold mb-2">Authentication Required</h3>
        <p className="text-gray-600 dark:text-gray-400">
          Please connect your wallet to access the Dapp Discovery Engine.
        </p>
      </Card>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">🌐 Dapp Discovery Engine</h2>
          <p className="text-gray-600 dark:text-gray-400">AI-powered insights into the CosmiqETH dapp ecosystem</p>
        </div>
        <Tooltip content="Track 2: Best Application Built on Hypergraph">
          <Badge variant="success" className="text-xs">
            Knowledge Graph Intelligence
          </Badge>
        </Tooltip>
      </div>

      <Tabs
        tabs={[
          { id: 'search', label: '🔍 Smart Search' },
          { id: 'trends', label: '📈 Trends' },
          { id: 'insights', label: '🧠 Insights' },
        ]}
        activeTab={activeTab}
        onTabChange={(tab) => setActiveTab(tab as any)}
      />

      {activeTab === 'search' && renderSearchTab()}
      {activeTab === 'trends' && renderTrendsTab()}
      {activeTab === 'insights' && renderInsightsTab()}
    </div>
  );
};

export default DappDiscoveryEngine;
