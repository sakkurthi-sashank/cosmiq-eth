import React, { useState, useEffect } from 'react';
import { useFlowAuth } from '../../lib/contexts/FlowAuthContext';
import { dappIntelligenceService } from '../../lib/services/dappIntelligenceService';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { LoadingDots } from '../ui/LoadingDots';
import { Tooltip } from '../ui/Tooltip';
import { Progress } from '../ui/Progress';

interface DeveloperInsightsDashboardProps {
  className?: string;
}

interface EcosystemMetrics {
  totalDapps: number;
  totalDevelopers: number;
  deploymentRate: number;
  growthRate: number;
  topCategories: Array<{ name: string; count: number; percentage: number }>;
  topTechStacks: Array<{ name: string; count: number; percentage: number }>;
  recentActivity: Array<{ date: string; dappsCreated: number; deploymentsCount: number }>;
}

interface MarketGap {
  category: string;
  description: string;
  opportunity: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  estimatedDemand: 'High' | 'Medium' | 'Low';
}

interface SuccessPattern {
  pattern: string;
  description: string;
  examples: string[];
  successRate: number;
  keyFactors: string[];
}

export const DeveloperInsightsDashboard: React.FC<DeveloperInsightsDashboardProps> = ({ className = '' }) => {
  const { user, isAuthenticated } = useFlowAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [ecosystemMetrics, setEcosystemMetrics] = useState<EcosystemMetrics | null>(null);
  const [marketGaps, setMarketGaps] = useState<MarketGap[]>([]);
  const [successPatterns, setSuccessPatterns] = useState<SuccessPattern[]>([]);
  const [selectedTimeRange, setSelectedTimeRange] = useState<'7d' | '30d' | '90d'>('30d');

  useEffect(() => {
    loadDashboardData();
  }, [selectedTimeRange]);

  const loadDashboardData = async () => {
    try {
      setIsLoading(true);

      // Get real data from the knowledge graph
      const result = await dappIntelligenceService.queryDapps({
        query: '',
        filters: {},
        limit: 100,
      });

      const realDapps = result.matches;
      const analytics = result.analytics;

      if (realDapps.length > 0) {
        // Generate real metrics from actual data
        const metrics = generateMetricsFromRealData(realDapps, analytics);
        setEcosystemMetrics(metrics);

        // Generate market gaps from real data
        const gaps = identifyMarketGaps(analytics);
        setMarketGaps(gaps);

        // Generate success patterns from real data
        const patterns = identifySuccessPatterns(realDapps);
        setSuccessPatterns(patterns);
      } else {
        // Empty state
        setEcosystemMetrics({
          totalDapps: 0,
          totalDevelopers: 0,
          deploymentRate: 0,
          growthRate: 0,
          topCategories: [],
          topTechStacks: [],
          recentActivity: [],
        });
        setMarketGaps([]);
        setSuccessPatterns([]);
      }
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const generateMetricsFromRealData = (dapps: any[], analytics: any): EcosystemMetrics => {
    const totalDapps = dapps.length;
    const uniqueDevelopers = new Set(dapps.map((dapp) => dapp.userAddress));
    const totalDevelopers = uniqueDevelopers.size;
    const deploymentRate = analytics.deploymentStats.deploymentRate;

    const now = new Date();
    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const recentDapps = dapps.filter((dapp) => new Date(dapp.generationTimestamp) >= oneWeekAgo);
    const growthRate = totalDapps > 0 ? (recentDapps.length / totalDapps) * 100 : 0;

    // Top categories from real data
    const topCategories = Object.entries(analytics.categoryCounts)
      .map(([name, count]) => ({
        name,
        count: count as number,
        percentage: ((count as number) / totalDapps) * 100,
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    // Top tech stacks from real data
    const topTechStacks = Object.entries(analytics.techStackPopularity)
      .map(([name, count]) => ({
        name,
        count: count as number,
        percentage: ((count as number) / totalDapps) * 100,
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    // Recent activity from real data
    const recentActivity = Array.from({ length: 7 }, (_, i) => {
      const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
      const dayDapps = dapps.filter((dapp) => {
        const dappDate = new Date(dapp.generationTimestamp);
        return dappDate.toDateString() === date.toDateString();
      });
      const deployments = dayDapps.filter((dapp) => dapp.contractDeployed);

      return {
        date: date.toISOString().split('T')[0],
        dappsCreated: dayDapps.length,
        deploymentsCount: deployments.length,
      };
    }).reverse();

    return {
      totalDapps,
      totalDevelopers,
      deploymentRate,
      growthRate,
      topCategories,
      topTechStacks,
      recentActivity,
    };
  };

  const identifyMarketGaps = (analytics: any): MarketGap[] => {
    const gaps: MarketGap[] = [];

    // Common categories with low representation
    const commonCategories = ['E-commerce', 'Education', 'Healthcare', 'Supply Chain', 'Real Estate', 'Productivity'];

    commonCategories.forEach((category) => {
      const count = analytics.categoryCounts[category] || 0;
      if (count < 2) {
        gaps.push({
          category,
          description: `Limited ${category.toLowerCase()} solutions in the ecosystem`,
          opportunity: `Build innovative ${category.toLowerCase()} dapps`,
          difficulty: 'Medium',
          estimatedDemand: 'High',
        });
      }
    });

    return gaps.slice(0, 5);
  };

  const identifySuccessPatterns = (dapps: any[]): SuccessPattern[] => {
    const patterns: SuccessPattern[] = [];

    if (dapps.length === 0) return patterns;

    // Pattern 1: Multi-tech stack usage
    const deployedDapps = dapps.filter((dapp) => dapp.contractDeployed);
    const multiTechDapps = deployedDapps.filter((dapp) => dapp.techStack.length >= 3);

    if (multiTechDapps.length > 0) {
      patterns.push({
        pattern: 'Multi-Technology Integration',
        description: 'Dapps using multiple technologies tend to have higher deployment rates',
        examples: multiTechDapps.slice(0, 3).map((dapp) => dapp.name),
        successRate: deployedDapps.length > 0 ? (multiTechDapps.length / deployedDapps.length) * 100 : 0,
        keyFactors: ['Technology diversity', 'Feature richness', 'Developer experience'],
      });
    }

    // Pattern 2: Popular categories
    const popularCategories = ['Finance', 'Art/NFT', 'Gaming'];
    const popularCategoryDapps = dapps.filter((dapp) => popularCategories.includes(dapp.category));

    if (popularCategoryDapps.length > 0) {
      patterns.push({
        pattern: 'Popular Category Focus',
        description: 'Dapps in trending categories show consistent engagement',
        examples: popularCategoryDapps.slice(0, 3).map((dapp) => dapp.name),
        successRate:
          popularCategoryDapps.length > 0
            ? (popularCategoryDapps.filter((d) => d.contractDeployed).length / popularCategoryDapps.length) * 100
            : 0,
        keyFactors: ['Market demand', 'User adoption', 'Ecosystem support'],
      });
    }

    return patterns;
  };

  const renderOverviewCards = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <Card className="p-6 text-center">
        <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">{ecosystemMetrics?.totalDapps || 0}</div>
        <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">Total Dapps</div>
        <div className="text-xs text-green-600 mt-2">+{ecosystemMetrics?.growthRate.toFixed(1) || 0}% this week</div>
      </Card>

      <Card className="p-6 text-center">
        <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">
          {ecosystemMetrics?.totalDevelopers || 0}
        </div>
        <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">Active Developers</div>
        <div className="text-xs text-blue-600 mt-2">
          Avg.{' '}
          {ecosystemMetrics?.totalDevelopers > 0
            ? (ecosystemMetrics.totalDapps / ecosystemMetrics.totalDevelopers).toFixed(1)
            : 0}{' '}
          dapps per dev
        </div>
      </Card>

      <Card className="p-6 text-center">
        <div className="text-3xl font-bold text-green-600 dark:text-green-400">
          {ecosystemMetrics?.deploymentRate.toFixed(1) || 0}%
        </div>
        <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">Deployment Rate</div>
        <div className="text-xs text-gray-500 mt-2">Of created dapps</div>
      </Card>

      <Card className="p-6 text-center">
        <div className="text-3xl font-bold text-orange-600 dark:text-orange-400">{marketGaps.length}</div>
        <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">Market Gaps</div>
        <div className="text-xs text-orange-600 mt-2">Identified opportunities</div>
      </Card>
    </div>
  );

  const renderCategoryBreakdown = () => (
    <Card className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">📊 Category Distribution</h3>
        <Badge variant="outline" className="text-xs">
          Top 5
        </Badge>
      </div>

      {ecosystemMetrics?.topCategories.length === 0 ? (
        <div className="text-center py-4">
          <p className="text-gray-600 dark:text-gray-400">No categories to display yet</p>
        </div>
      ) : (
        <div className="space-y-3">
          {ecosystemMetrics?.topCategories.map((category, index) => (
            <div key={category.name} className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <span className="text-sm font-medium text-gray-500">#{index + 1}</span>
                <span className="font-medium">{category.name}</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-24 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div className="bg-blue-500 h-2 rounded-full" style={{ width: `${category.percentage}%` }} />
                </div>
                <span className="text-sm text-gray-600 dark:text-gray-400 min-w-[3rem]">
                  {category.count} ({category.percentage.toFixed(1)}%)
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </Card>
  );

  const renderTechStackAnalysis = () => (
    <Card className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">⚡ Technology Stack Popularity</h3>
        <Badge variant="outline" className="text-xs">
          Top 5
        </Badge>
      </div>

      {ecosystemMetrics?.topTechStacks.length === 0 ? (
        <div className="text-center py-4">
          <p className="text-gray-600 dark:text-gray-400">No tech stacks to display yet</p>
        </div>
      ) : (
        <div className="space-y-3">
          {ecosystemMetrics?.topTechStacks.map((tech, index) => (
            <div key={tech.name} className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <span className="text-sm font-medium text-gray-500">#{index + 1}</span>
                <span className="font-medium">{tech.name}</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-24 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div className="bg-purple-500 h-2 rounded-full" style={{ width: `${tech.percentage}%` }} />
                </div>
                <span className="text-sm text-gray-600 dark:text-gray-400 min-w-[3rem]">
                  {tech.count} ({tech.percentage.toFixed(1)}%)
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </Card>
  );





  const renderActivityChart = () => (
    <Card className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">📅 Recent Activity</h3>
        <div className="flex space-x-2">
          {(['7d', '30d', '90d'] as const).map((range) => (
            <Button
              key={range}
              variant={selectedTimeRange === range ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedTimeRange(range)}
            >
              {range}
            </Button>
          ))}
        </div>
      </div>

      {ecosystemMetrics?.recentActivity.length === 0 ? (
        <div className="text-center py-4">
          <p className="text-gray-600 dark:text-gray-400">No recent activity to display</p>
        </div>
      ) : (
        <div className="space-y-2">
          {ecosystemMetrics?.recentActivity.map((day, index) => (
            <div
              key={index}
              className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-800 last:border-b-0"
            >
              <span className="text-sm text-gray-600 dark:text-gray-400">{day.date}</span>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <span className="text-sm">📱</span>
                  <span className="text-sm font-medium">{day.dappsCreated}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm">🚀</span>
                  <span className="text-sm font-medium">{day.deploymentsCount}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </Card>
  );

  if (!isAuthenticated) {
    return (
      <Card className="p-8 text-center">
        <div className="text-4xl mb-4">🔐</div>
        <h3 className="text-lg font-semibold mb-2">Authentication Required</h3>
        <p className="text-gray-600 dark:text-gray-400">
          Please connect your wallet to access the Developer Insights Dashboard.
        </p>
      </Card>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">📊 Developer Insights Dashboard</h2>
          <p className="text-gray-600 dark:text-gray-400">
            Comprehensive analytics and market opportunities for developers
          </p>
        </div>
        <Tooltip content="Track 2: Best Application Built on Hypergraph">
          <Badge variant="success" className="text-xs">
            Knowledge Graph Intelligence
          </Badge>
        </Tooltip>
      </div>

      {isLoading ? (
        <Card className="p-8 text-center">
          <LoadingDots text="Loading developer insights..." />
        </Card>
      ) : (
        <div className="space-y-6">
          {/* Overview Cards */}
          {renderOverviewCards()}

          {/* Charts and Analysis */}
          <div className="grid lg:grid-cols-2 gap-6">
            {renderCategoryBreakdown()}
            {renderTechStackAnalysis()}
          </div>

          {/* Activity Chart */}
          {renderActivityChart()}
        </div>
      )}
    </div>
  );
};

export default DeveloperInsightsDashboard;
