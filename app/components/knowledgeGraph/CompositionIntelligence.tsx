import React, { useState, useEffect } from 'react';
import { useFlowAuth } from '../../lib/contexts/FlowAuthContext';
import { dappIntelligenceService } from '../../lib/services/dappIntelligenceService';
import type { PublishedDapp } from '../../lib/services/knowledgeGraphService';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { LoadingDots } from '../ui/LoadingDots';
import { Tooltip } from '../ui/Tooltip';

interface CompositionIntelligenceProps {
  className?: string;
}

interface CompositionPattern {
  id: string;
  name: string;
  description: string;
  dapps: PublishedDapp[];
  integrationPoints: string[];
  benefits: string[];
  implementation: string;
}

interface CrossProjectOpportunity {
  primaryDapp: PublishedDapp;
  secondaryDapp: PublishedDapp;
  synergy: string;
  potentialValue: 'High' | 'Medium' | 'Low';
  integrationComplexity: 'Simple' | 'Moderate' | 'Complex';
  sharedComponents: string[];
}

export const CompositionIntelligence: React.FC<CompositionIntelligenceProps> = ({ className = '' }) => {
  const { user, isAuthenticated } = useFlowAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedDapp, setSelectedDapp] = useState<PublishedDapp | null>(null);
  const [allDapps, setAllDapps] = useState<PublishedDapp[]>([]);
  const [compositionPatterns, setCompositionPatterns] = useState<CompositionPattern[]>([]);
  const [crossProjectOpportunities, setCrossProjectOpportunities] = useState<CrossProjectOpportunity[]>([]);
  const [activeView, setActiveView] = useState<'patterns' | 'opportunities' | 'builder'>('patterns');

  useEffect(() => {
    loadDappsAndAnalyze();
  }, []);

  const loadDappsAndAnalyze = async () => {
    try {
      setIsLoading(true);

      const result = await dappIntelligenceService.queryDapps({
        query: '',
        filters: {},
        limit: 100,
      });

      const realDapps = result.matches;
      setAllDapps(realDapps);

      if (realDapps.length > 0) {
        const patterns = analyzeCompositionPatterns(realDapps);
        setCompositionPatterns(patterns);

        const opportunities = findCrossProjectOpportunities(realDapps);
        setCrossProjectOpportunities(opportunities);
      }
    } catch (error) {
      console.error('Failed to load and analyze dapps:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const analyzeCompositionPatterns = (dapps: PublishedDapp[]): CompositionPattern[] => {
    const patterns: CompositionPattern[] = [];

    if (dapps.length === 0) return patterns;

    const nftDapps = dapps.filter((d) => d.category === 'Art/NFT' || d.compositionTags?.includes('minting'));
    const musicDapps = dapps.filter((d) => d.category === 'Music');

    if (nftDapps.length > 0 && musicDapps.length > 0) {
      patterns.push({
        id: 'nft-music',
        name: 'Music NFT Ecosystem',
        description: 'Combine NFT marketplace with music streaming for artist monetization',
        dapps: [...nftDapps, ...musicDapps],
        integrationPoints: ['Smart contract interoperability', 'Cross-platform metadata', 'Unified wallet experience'],
        benefits: ['Artist revenue diversification', 'Fan engagement through ownership', 'Royalty automation'],
        implementation: 'Create shared metadata standards and cross-contract function calls',
      });
    }

    const defiDapps = dapps.filter((d) => d.category === 'Finance' || d.compositionTags?.includes('staking'));
    const otherDapps = dapps.filter((d) => d.category !== 'Finance');

    if (defiDapps.length > 0 && otherDapps.length > 0) {
      patterns.push({
        id: 'defi-integration',
        name: 'DeFi Monetization Layer',
        description: 'Add staking and yield farming to any dapp for user retention',
        dapps: [...defiDapps, ...otherDapps.slice(0, 2)],
        integrationPoints: ['Token reward mechanisms', 'Liquidity pool integration', 'Governance tokens'],
        benefits: ['User retention through rewards', 'Protocol-owned liquidity', 'Decentralized governance'],
        implementation: 'Implement reward token standards and cross-contract yield distribution',
      });
    }

    const marketplaceDapps = dapps.filter(
      (d) =>
        d.compositionTags?.includes('marketplace') ||
        d.smartContractFunctions.includes('buy') ||
        d.smartContractFunctions.includes('sell'),
    );
    const creatorDapps = dapps.filter((d) => d.compositionTags?.includes('creator-economy'));

    if (marketplaceDapps.length > 0 && creatorDapps.length > 0) {
      patterns.push({
        id: 'creator-marketplace',
        name: 'Creator Economy Marketplace',
        description: 'Unified platform for creators to monetize across different mediums',
        dapps: [...marketplaceDapps, ...creatorDapps],
        integrationPoints: ['Creator profile standards', 'Revenue sharing protocols', 'Cross-medium discovery'],
        benefits: ['Simplified creator onboarding', 'Diversified revenue streams', 'Enhanced fan experience'],
        implementation: 'Develop unified creator identity and revenue distribution smart contracts',
      });
    }

    return patterns;
  };

  const findCrossProjectOpportunities = (dapps: PublishedDapp[]): CrossProjectOpportunity[] => {
    const opportunities: CrossProjectOpportunity[] = [];

    if (dapps.length < 2) return opportunities;

    for (let i = 0; i < dapps.length; i++) {
      for (let j = i + 1; j < dapps.length; j++) {
        const dapp1 = dapps[i];
        const dapp2 = dapps[j];

        const sharedTech = dapp1.techStack.filter((tech) => dapp2.techStack.includes(tech));
        const sharedTags = (dapp1.compositionTags || []).filter((tag) => (dapp2.compositionTags || []).includes(tag));

        if (sharedTech.length >= 2 || sharedTags.length >= 1) {
          const opportunity = generateOpportunity(dapp1, dapp2, sharedTech, sharedTags);
          opportunities.push(opportunity);
        }
      }
    }

    return opportunities.sort((a, b) => {
      const valueScore = { High: 3, Medium: 2, Low: 1 };
      return valueScore[b.potentialValue] - valueScore[a.potentialValue];
    });
  };

  const generateOpportunity = (
    dapp1: PublishedDapp,
    dapp2: PublishedDapp,
    sharedTech: string[],
    sharedTags: string[],
  ): CrossProjectOpportunity => {
    const categoryPairs = [dapp1.category, dapp2.category].sort().join(' + ');

    const synergyMap: Record<string, string> = {
      'Art/NFT + Finance': 'NFT-backed lending and staking rewards',
      'Art/NFT + Gaming': 'In-game NFT marketplace and achievements',
      'Art/NFT + Music': 'Music NFTs with collectible artwork',
      'Finance + Gaming': 'Play-to-earn with DeFi yield farming',
      'Finance + Music': 'Music streaming with token rewards',
      'Gaming + Music': 'Rhythm games with music NFTs',
      'Gaming + Social Media': 'Social gaming with community features',
      'Finance + Social Media': 'Social trading and investment clubs',
      'E-commerce + Finance': 'Marketplace with integrated payments',
      'E-commerce + Social Media': 'Social shopping and recommendations',
    };

    const synergy = synergyMap[categoryPairs] || `Integration between ${dapp1.category} and ${dapp2.category}`;

    // Determine potential value based on shared components
    let potentialValue: 'High' | 'Medium' | 'Low' = 'Low';
    if (sharedTech.length >= 3 || sharedTags.length >= 2) {
      potentialValue = 'High';
    } else if (sharedTech.length >= 2 || sharedTags.length >= 1) {
      potentialValue = 'Medium';
    }

    // Determine integration complexity
    let integrationComplexity: 'Simple' | 'Moderate' | 'Complex' = 'Complex';
    if (sharedTech.includes('React') && sharedTech.includes('Flow')) {
      integrationComplexity = 'Simple';
    } else if (sharedTech.length >= 2) {
      integrationComplexity = 'Moderate';
    }

    return {
      primaryDapp: dapp1,
      secondaryDapp: dapp2,
      synergy,
      potentialValue,
      integrationComplexity,
      sharedComponents: [...sharedTech, ...sharedTags],
    };
  };

  const renderPatternsView = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">🧩 Composition Patterns</h3>
        <Badge variant="outline" className="text-xs">
          {compositionPatterns.length} patterns found
        </Badge>
      </div>

      {compositionPatterns.length === 0 ? (
        <Card className="p-8 text-center">
          <div className="text-4xl mb-4">📊</div>
          <h4 className="text-lg font-semibold mb-2">No Composition Patterns Found</h4>
          <p className="text-gray-600 dark:text-gray-400">
            Create more dapps in different categories to discover composition patterns and integration opportunities.
          </p>
        </Card>
      ) : (
        <div className="space-y-4">
          {compositionPatterns.map((pattern) => (
            <Card key={pattern.id} className="p-6">
              <div className="space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="text-lg font-semibold">{pattern.name}</h4>
                    <p className="text-gray-600 dark:text-gray-400">{pattern.description}</p>
                  </div>
                  <Badge variant="success" className="text-xs">
                    {pattern.dapps.length} dapps
                  </Badge>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <h5 className="font-medium mb-2">💡 Integration Points</h5>
                    <ul className="space-y-1">
                      {pattern.integrationPoints.map((point, index) => (
                        <li key={index} className="text-sm text-gray-600 dark:text-gray-400 flex items-start">
                          <span className="text-blue-500 mr-2">•</span>
                          {point}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h5 className="font-medium mb-2">🎯 Benefits</h5>
                    <ul className="space-y-1">
                      {pattern.benefits.map((benefit, index) => (
                        <li key={index} className="text-sm text-gray-600 dark:text-gray-400 flex items-start">
                          <span className="text-green-500 mr-2">•</span>
                          {benefit}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                  <h5 className="font-medium mb-2">🔧 Implementation</h5>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{pattern.implementation}</p>
                </div>

                <div>
                  <h5 className="font-medium mb-2">📱 Involved Dapps</h5>
                  <div className="flex flex-wrap gap-2">
                    {pattern.dapps.map((dapp) => (
                      <Badge
                        key={dapp.knowledgeGraphId}
                        variant="outline"
                        className="text-xs cursor-pointer hover:bg-blue-50 dark:hover:bg-blue-900/20"
                        onClick={() => setSelectedDapp(dapp)}
                      >
                        {dapp.name}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );

  const renderOpportunitiesView = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">🤝 Cross-Project Opportunities</h3>
        <Badge variant="outline" className="text-xs">
          {crossProjectOpportunities.length} opportunities
        </Badge>
      </div>

      {crossProjectOpportunities.length === 0 ? (
        <Card className="p-8 text-center">
          <div className="text-4xl mb-4">🔍</div>
          <h4 className="text-lg font-semibold mb-2">No Cross-Project Opportunities Found</h4>
          <p className="text-gray-600 dark:text-gray-400">
            Create more dapps with shared technologies or complementary features to discover collaboration
            opportunities.
          </p>
        </Card>
      ) : (
        <div className="space-y-4">
          {crossProjectOpportunities.map((opportunity, index) => (
            <Card key={index} className="p-6">
              <div className="space-y-4">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <h4 className="text-lg font-semibold">{opportunity.primaryDapp.name}</h4>
                      <span className="text-gray-400">+</span>
                      <h4 className="text-lg font-semibold">{opportunity.secondaryDapp.name}</h4>
                    </div>
                    <p className="text-gray-600 dark:text-gray-400">{opportunity.synergy}</p>
                  </div>
                  <div className="flex space-x-2">
                    <Badge
                      variant={
                        opportunity.potentialValue === 'High'
                          ? 'success'
                          : opportunity.potentialValue === 'Medium'
                            ? 'default'
                            : 'outline'
                      }
                      className="text-xs"
                    >
                      {opportunity.potentialValue} Value
                    </Badge>
                    <Badge
                      variant={
                        opportunity.integrationComplexity === 'Simple'
                          ? 'success'
                          : opportunity.integrationComplexity === 'Moderate'
                            ? 'default'
                            : 'outline'
                      }
                      className="text-xs"
                    >
                      {opportunity.integrationComplexity}
                    </Badge>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <h5 className="font-medium mb-2">Primary Dapp</h5>
                    <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
                      <div className="font-medium text-sm">{opportunity.primaryDapp.name}</div>
                      <div className="text-xs text-gray-600 dark:text-gray-400">{opportunity.primaryDapp.category}</div>
                      <div className="text-xs text-gray-500 mt-1">{opportunity.primaryDapp.description}</div>
                    </div>
                  </div>

                  <div>
                    <h5 className="font-medium mb-2">Secondary Dapp</h5>
                    <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
                      <div className="font-medium text-sm">{opportunity.secondaryDapp.name}</div>
                      <div className="text-xs text-gray-600 dark:text-gray-400">
                        {opportunity.secondaryDapp.category}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">{opportunity.secondaryDapp.description}</div>
                    </div>
                  </div>
                </div>

                <div>
                  <h5 className="font-medium mb-2">🔗 Shared Components</h5>
                  <div className="flex flex-wrap gap-2">
                    {opportunity.sharedComponents.map((component, idx) => (
                      <Badge key={idx} variant="outline" className="text-xs">
                        {component}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );

  const renderBuilderView = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold">🏗️ Composition Builder</h3>

      <Card className="p-8 text-center">
        <div className="text-4xl mb-4">🚧</div>
        <h4 className="text-lg font-semibold mb-2">Coming Soon</h4>
        <p className="text-gray-600 dark:text-gray-400">
          Interactive composition builder to create new dapps by combining existing ones.
        </p>
      </Card>
    </div>
  );

  if (!isAuthenticated) {
    return (
      <Card className="p-8 text-center">
        <div className="text-4xl mb-4">🔐</div>
        <h3 className="text-lg font-semibold mb-2">Authentication Required</h3>
        <p className="text-gray-600 dark:text-gray-400">
          Please connect your wallet to access the Composition Intelligence.
        </p>
      </Card>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">🧩 Composition Intelligence</h2>
          <p className="text-gray-600 dark:text-gray-400">Discover patterns and opportunities for dapp integration</p>
        </div>
        <Tooltip content="Track 2: Best Application Built on Hypergraph">
          <Badge variant="success" className="text-xs">
            Knowledge Graph Intelligence
          </Badge>
        </Tooltip>
      </div>

      {isLoading ? (
        <Card className="p-8 text-center">
          <LoadingDots text="Analyzing composition patterns..." />
        </Card>
      ) : (
        <>
          <div className="flex space-x-4 mb-6">
            <Button
              variant={activeView === 'patterns' ? 'default' : 'outline'}
              onClick={() => setActiveView('patterns')}
            >
              📊 Patterns
            </Button>
            <Button
              variant={activeView === 'opportunities' ? 'default' : 'outline'}
              onClick={() => setActiveView('opportunities')}
            >
              🤝 Opportunities
            </Button>
            <Button variant={activeView === 'builder' ? 'default' : 'outline'} onClick={() => setActiveView('builder')}>
              🏗️ Builder
            </Button>
          </div>

          {activeView === 'patterns' && renderPatternsView()}
          {activeView === 'opportunities' && renderOpportunitiesView()}
          {activeView === 'builder' && renderBuilderView()}
        </>
      )}
    </div>
  );
};

export default CompositionIntelligence;
