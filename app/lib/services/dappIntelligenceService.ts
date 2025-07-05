import { Graph, type Op, SystemIds } from '@graphprotocol/grc-20';
import type { DappMetadata, PublishedDapp } from './knowledgeGraphService';

interface DappAnalytics {
  totalDapps: number;
  categoryCounts: Record<string, number>;
  techStackPopularity: Record<string, number>;
  deploymentStats: {
    deployed: number;
    undeployed: number;
    deploymentRate: number;
  };
  userIntentDistribution: Record<string, number>;
  compositionTagFrequency: Record<string, number>;
  integrationPointsAnalysis: Record<string, number>;
}

interface DappRecommendation {
  dappId: string;
  name: string;
  category: string;
  similarityScore: number;
  recommendationReason: string;
  sharedTags: string[];
  sharedTechStack: string[];
}

interface DeveloperProfile {
  userAddress: string;
  dappCount: number;
  categories: string[];
  techStacks: string[];
  successRate: number;
  specializations: string[];
}

export interface IntelligenceQuery {
  query: string;
  filters?: {
    category?: string;
    techStack?: string[];
    userIntent?: string;
    deploymentStatus?: 'deployed' | 'undeployed' | 'all';
    dateRange?: {
      start: Date;
      end: Date;
    };
  };
  limit?: number;
}

export interface IntelligenceResult {
  matches: PublishedDapp[];
  analytics: DappAnalytics;
  recommendations: DappRecommendation[];
  insights: string[];
}

class DappIntelligenceService {
  private cachedDapps: PublishedDapp[] = [];
  private lastCacheUpdate: Date | null = null;
  private CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

  /**
   * Query dapps with AI-powered search and analytics
   */
  async queryDapps(query: IntelligenceQuery): Promise<IntelligenceResult> {
    const allDapps = await this.getAllDapps();

    // Filter based on query criteria
    let filteredDapps = this.filterDapps(allDapps, query);

    // Apply AI-powered search if query text provided
    if (query.query) {
      filteredDapps = this.performIntelligentSearch(filteredDapps, query.query);
    }

    // Apply limit
    if (query.limit) {
      filteredDapps = filteredDapps.slice(0, query.limit);
    }

    // Generate analytics
    const analytics = this.generateAnalytics(filteredDapps);

    // Generate recommendations
    const recommendations = this.generateRecommendations(filteredDapps, allDapps);

    // Generate insights
    const insights = this.generateInsights(filteredDapps, analytics);

    return {
      matches: filteredDapps,
      analytics,
      recommendations,
      insights,
    };
  }

  /**
   * Get trending categories and tech stacks
   */
  async getTrendingAnalysis(): Promise<{
    trendingCategories: Array<{ name: string; count: number; growth: number }>;
    trendingTechStacks: Array<{ name: string; count: number; growth: number }>;
    emergingPatterns: string[];
  }> {
    const allDapps = await this.getAllDapps();
    const now = new Date();
    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    const recentDapps = allDapps.filter((dapp) => new Date(dapp.generationTimestamp) >= oneWeekAgo);

    const olderDapps = allDapps.filter((dapp) => new Date(dapp.generationTimestamp) < oneWeekAgo);

    const trendingCategories = this.calculateTrends(recentDapps, olderDapps, 'category');
    const trendingTechStacks = this.calculateTechStackTrends(recentDapps, olderDapps);
    const emergingPatterns = this.identifyEmergingPatterns(recentDapps);

    return {
      trendingCategories,
      trendingTechStacks,
      emergingPatterns,
    };
  }

  /**
   * Find similar dapps based on multiple criteria
   */
  async findSimilarDapps(targetDapp: PublishedDapp): Promise<DappRecommendation[]> {
    const allDapps = await this.getAllDapps();
    const otherDapps = allDapps.filter((dapp) => dapp.knowledgeGraphId !== targetDapp.knowledgeGraphId);

    const similarities = otherDapps.map((dapp) => {
      const similarity = this.calculateSimilarity(targetDapp, dapp);
      return {
        dappId: dapp.knowledgeGraphId,
        name: dapp.name,
        category: dapp.category,
        similarityScore: similarity.score,
        recommendationReason: similarity.reason,
        sharedTags: similarity.sharedTags,
        sharedTechStack: similarity.sharedTechStack,
      };
    });

    return similarities
      .filter((sim) => sim.similarityScore > 0.3)
      .sort((a, b) => b.similarityScore - a.similarityScore)
      .slice(0, 10);
  }

  /**
   * Get developer profiles and insights
   */
  async getDeveloperProfiles(): Promise<DeveloperProfile[]> {
    const allDapps = await this.getAllDapps();
    const developerMap = new Map<string, PublishedDapp[]>();

    // Group dapps by developer
    allDapps.forEach((dapp) => {
      if (!developerMap.has(dapp.userAddress)) {
        developerMap.set(dapp.userAddress, []);
      }
      developerMap.get(dapp.userAddress)!.push(dapp);
    });

    // Generate profiles
    const profiles: DeveloperProfile[] = [];
    for (const [userAddress, dapps] of developerMap) {
      const profile = this.generateDeveloperProfile(userAddress, dapps);
      profiles.push(profile);
    }

    return profiles.sort((a, b) => b.dappCount - a.dappCount);
  }

  /**
   * Find collaboration opportunities
   */
  async findCollaborationOpportunities(userAddress: string): Promise<{
    potentialCollaborators: DeveloperProfile[];
    complementarySkills: string[];
    suggestedProjects: string[];
  }> {
    const allProfiles = await this.getDeveloperProfiles();
    const userProfile = allProfiles.find((p) => p.userAddress === userAddress);

    if (!userProfile) {
      return {
        potentialCollaborators: [],
        complementarySkills: [],
        suggestedProjects: [],
      };
    }

    const potentialCollaborators = this.findComplementaryDevelopers(userProfile, allProfiles);
    const complementarySkills = this.identifyComplementarySkills(userProfile, allProfiles);
    const suggestedProjects = this.generateProjectSuggestions(userProfile);

    return {
      potentialCollaborators,
      complementarySkills,
      suggestedProjects,
    };
  }


  private async getAllDapps(): Promise<PublishedDapp[]> {
    // Check cache first
    if (this.cachedDapps.length > 0 && this.lastCacheUpdate) {
      const timeSinceUpdate = Date.now() - this.lastCacheUpdate.getTime();
      if (timeSinceUpdate < this.CACHE_DURATION) {
        return this.cachedDapps;
      }
    }

    // For now, get from localStorage (in production, this would query the knowledge graph)
    const dapps = this.getDappsFromLocalStorage();

    // In production, this would be:
    // const dapps = await this.queryKnowledgeGraph();

    this.cachedDapps = dapps;
    this.lastCacheUpdate = new Date();

    return dapps;
  }

  private getDappsFromLocalStorage(): PublishedDapp[] {
    const dapps: PublishedDapp[] = [];

    // Iterate through localStorage to find published dapps
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('kg_') && key.includes('_0x')) {
        try {
          const data = JSON.parse(localStorage.getItem(key) || '{}');
          if (data.knowledgeGraphId && data.ipfsCid) {
            // This is a published dapp, but we need to reconstruct the full metadata
            // In production, this would be queried from the knowledge graph
            const mockDapp: PublishedDapp = {
              knowledgeGraphId: data.knowledgeGraphId,
              ipfsCid: data.ipfsCid,
              name: `Dapp ${data.knowledgeGraphId.slice(0, 8)}`,
              description: 'AI-generated dapp',
              category: 'Other',
              originalPrompt: 'Sample prompt',
              techStack: ['React', 'TypeScript'],
              smartContractFunctions: [],
              generationTimestamp: new Date(data.publishedAt || Date.now()),
              userAddress: key.split('_').pop() || '0x0',
              contractDeployed: false,
              userIntent: 'general',
              integrationPoints: [],
              compositionTags: [],
            };
            dapps.push(mockDapp);
          }
        } catch (error) {
          console.warn(`Failed to parse localStorage item: ${key}`, error);
        }
      }
    }

    return dapps;
  }

  // Private methods for analysis and intelligence

  private filterDapps(dapps: PublishedDapp[], query: IntelligenceQuery): PublishedDapp[] {
    let filtered = dapps;

    if (query.filters?.category) {
      filtered = filtered.filter((dapp) => dapp.category === query.filters!.category);
    }

    if (query.filters?.techStack) {
      filtered = filtered.filter((dapp) => query.filters!.techStack!.some((tech) => dapp.techStack.includes(tech)));
    }

    if (query.filters?.userIntent) {
      filtered = filtered.filter((dapp) => dapp.userIntent === query.filters!.userIntent);
    }

    if (query.filters?.deploymentStatus && query.filters.deploymentStatus !== 'all') {
      const shouldBeDeployed = query.filters.deploymentStatus === 'deployed';
      filtered = filtered.filter((dapp) => dapp.contractDeployed === shouldBeDeployed);
    }

    if (query.filters?.dateRange) {
      filtered = filtered.filter((dapp) => {
        const dappDate = new Date(dapp.generationTimestamp);
        return dappDate >= query.filters!.dateRange!.start && dappDate <= query.filters!.dateRange!.end;
      });
    }

    return filtered;
  }

  private performIntelligentSearch(dapps: PublishedDapp[], searchQuery: string): PublishedDapp[] {
    const query = searchQuery.toLowerCase();

    return dapps.filter((dapp) => {
      const searchableText = [
        dapp.name,
        dapp.description,
        dapp.category,
        dapp.originalPrompt,
        ...(dapp.techStack || []),
        ...(dapp.smartContractFunctions || []),
        ...(dapp.integrationPoints || []),
        ...(dapp.compositionTags || []),
      ]
        .join(' ')
        .toLowerCase();

      return searchableText.includes(query);
    });
  }

  private generateAnalytics(dapps: PublishedDapp[]): DappAnalytics {
    const totalDapps = dapps.length;
    const categoryCounts: Record<string, number> = {};
    const techStackPopularity: Record<string, number> = {};
    const userIntentDistribution: Record<string, number> = {};
    const compositionTagFrequency: Record<string, number> = {};
    const integrationPointsAnalysis: Record<string, number> = {};

    let deployedCount = 0;

    dapps.forEach((dapp) => {
      // Category counts
      categoryCounts[dapp.category] = (categoryCounts[dapp.category] || 0) + 1;

      // Tech stack popularity
      dapp.techStack.forEach((tech) => {
        techStackPopularity[tech] = (techStackPopularity[tech] || 0) + 1;
      });

      // User intent distribution
      if (dapp.userIntent) {
        userIntentDistribution[dapp.userIntent] = (userIntentDistribution[dapp.userIntent] || 0) + 1;
      }

      // Composition tags
      (dapp.compositionTags || []).forEach((tag) => {
        compositionTagFrequency[tag] = (compositionTagFrequency[tag] || 0) + 1;
      });

      // Integration points
      (dapp.integrationPoints || []).forEach((point) => {
        integrationPointsAnalysis[point] = (integrationPointsAnalysis[point] || 0) + 1;
      });

      // Deployment stats
      if (dapp.contractDeployed) {
        deployedCount++;
      }
    });

    return {
      totalDapps,
      categoryCounts,
      techStackPopularity,
      deploymentStats: {
        deployed: deployedCount,
        undeployed: totalDapps - deployedCount,
        deploymentRate: totalDapps > 0 ? (deployedCount / totalDapps) * 100 : 0,
      },
      userIntentDistribution,
      compositionTagFrequency,
      integrationPointsAnalysis,
    };
  }

  private generateRecommendations(filteredDapps: PublishedDapp[], allDapps: PublishedDapp[]): DappRecommendation[] {
    if (filteredDapps.length === 0) return [];

    const recommendations: DappRecommendation[] = [];

    // Find similar dapps for each result
    filteredDapps.forEach((dapp) => {
      const similar = allDapps
        .filter((other) => other.knowledgeGraphId !== dapp.knowledgeGraphId)
        .map((other) => {
          const similarity = this.calculateSimilarity(dapp, other);
          return {
            dappId: other.knowledgeGraphId,
            name: other.name,
            category: other.category,
            similarityScore: similarity.score,
            recommendationReason: similarity.reason,
            sharedTags: similarity.sharedTags,
            sharedTechStack: similarity.sharedTechStack,
          };
        })
        .filter((sim) => sim.similarityScore > 0.4)
        .sort((a, b) => b.similarityScore - a.similarityScore)
        .slice(0, 3);

      recommendations.push(...similar);
    });

    // Remove duplicates and return top recommendations
    const uniqueRecommendations = Array.from(new Map(recommendations.map((r) => [r.dappId, r])).values());

    return uniqueRecommendations.slice(0, 10);
  }

  private generateInsights(dapps: PublishedDapp[], analytics: DappAnalytics): string[] {
    const insights: string[] = [];

    // Category insights
    const topCategory = Object.entries(analytics.categoryCounts).sort((a, b) => b[1] - a[1])[0];
    if (topCategory) {
      insights.push(`${topCategory[0]} is the most popular category with ${topCategory[1]} dapps`);
    }

    // Tech stack insights
    const topTech = Object.entries(analytics.techStackPopularity).sort((a, b) => b[1] - a[1])[0];
    if (topTech) {
      insights.push(`${topTech[0]} is the most popular technology, used in ${topTech[1]} projects`);
    }

    // Deployment insights
    if (analytics.deploymentStats.deploymentRate > 80) {
      insights.push(
        `High deployment rate: ${analytics.deploymentStats.deploymentRate.toFixed(1)}% of dapps are deployed`,
      );
    } else if (analytics.deploymentStats.deploymentRate < 30) {
      insights.push(
        `Low deployment rate: Only ${analytics.deploymentStats.deploymentRate.toFixed(1)}% of dapps are deployed`,
      );
    }

    // Integration insights
    const topIntegration = Object.entries(analytics.integrationPointsAnalysis).sort((a, b) => b[1] - a[1])[0];
    if (topIntegration) {
      insights.push(`${topIntegration[0]} is the most common integration pattern`);
    }

    return insights;
  }

  private calculateSimilarity(
    dapp1: PublishedDapp,
    dapp2: PublishedDapp,
  ): {
    score: number;
    reason: string;
    sharedTags: string[];
    sharedTechStack: string[];
  } {
    let score = 0;
    const reasons: string[] = [];
    const sharedTags = (dapp1.compositionTags || []).filter((tag) => (dapp2.compositionTags || []).includes(tag));
    const sharedTechStack = dapp1.techStack.filter((tech) => dapp2.techStack.includes(tech));

    // Category similarity
    if (dapp1.category === dapp2.category) {
      score += 0.3;
      reasons.push('same category');
    }

    // Tech stack similarity
    const techOverlap = sharedTechStack.length / Math.max(dapp1.techStack.length, dapp2.techStack.length);
    score += techOverlap * 0.25;
    if (techOverlap > 0.5) {
      reasons.push('similar tech stack');
    }

    // User intent similarity
    if (dapp1.userIntent === dapp2.userIntent) {
      score += 0.2;
      reasons.push('similar user intent');
    }

    // Composition tags similarity
    if (sharedTags.length > 0) {
      score +=
        (sharedTags.length / Math.max((dapp1.compositionTags || []).length, (dapp2.compositionTags || []).length)) *
        0.25;
      reasons.push('shared composition patterns');
    }

    return {
      score,
      reason: reasons.join(', '),
      sharedTags,
      sharedTechStack,
    };
  }

  private calculateTrends(
    recentDapps: PublishedDapp[],
    olderDapps: PublishedDapp[],
    field: keyof PublishedDapp,
  ): Array<{ name: string; count: number; growth: number }> {
    const recentCounts: Record<string, number> = {};
    const olderCounts: Record<string, number> = {};

    recentDapps.forEach((dapp) => {
      const value = dapp[field] as string;
      recentCounts[value] = (recentCounts[value] || 0) + 1;
    });

    olderDapps.forEach((dapp) => {
      const value = dapp[field] as string;
      olderCounts[value] = (olderCounts[value] || 0) + 1;
    });

    const trends: Array<{ name: string; count: number; growth: number }> = [];

    Object.keys(recentCounts).forEach((key) => {
      const recentCount = recentCounts[key];
      const olderCount = olderCounts[key] || 0;
      const growth = olderCount > 0 ? ((recentCount - olderCount) / olderCount) * 100 : 100;

      trends.push({
        name: key,
        count: recentCount,
        growth,
      });
    });

    return trends.sort((a, b) => b.growth - a.growth);
  }

  private calculateTechStackTrends(
    recentDapps: PublishedDapp[],
    olderDapps: PublishedDapp[],
  ): Array<{ name: string; count: number; growth: number }> {
    const recentTechCounts: Record<string, number> = {};
    const olderTechCounts: Record<string, number> = {};

    recentDapps.forEach((dapp) => {
      dapp.techStack.forEach((tech) => {
        recentTechCounts[tech] = (recentTechCounts[tech] || 0) + 1;
      });
    });

    olderDapps.forEach((dapp) => {
      dapp.techStack.forEach((tech) => {
        olderTechCounts[tech] = (olderTechCounts[tech] || 0) + 1;
      });
    });

    const trends: Array<{ name: string; count: number; growth: number }> = [];

    Object.keys(recentTechCounts).forEach((tech) => {
      const recentCount = recentTechCounts[tech];
      const olderCount = olderTechCounts[tech] || 0;
      const growth = olderCount > 0 ? ((recentCount - olderCount) / olderCount) * 100 : 100;

      trends.push({
        name: tech,
        count: recentCount,
        growth,
      });
    });

    return trends.sort((a, b) => b.growth - a.growth);
  }

  private identifyEmergingPatterns(recentDapps: PublishedDapp[]): string[] {
    const patterns: string[] = [];

    // Analyze composition tags for emerging patterns
    const tagFrequency: Record<string, number> = {};
    recentDapps.forEach((dapp) => {
      (dapp.compositionTags || []).forEach((tag) => {
        tagFrequency[tag] = (tagFrequency[tag] || 0) + 1;
      });
    });

    // Identify tags that appear in multiple recent dapps
    Object.entries(tagFrequency).forEach(([tag, count]) => {
      if (count >= 2) {
        patterns.push(`Rising trend: ${tag} pattern appearing in ${count} recent dapps`);
      }
    });

    return patterns;
  }

  private generateDeveloperProfile(userAddress: string, dapps: PublishedDapp[]): DeveloperProfile {
    const categories = [...new Set(dapps.map((d) => d.category))];
    const techStacks = [...new Set(dapps.flatMap((d) => d.techStack))];
    const deployedCount = dapps.filter((d) => d.contractDeployed).length;
    const successRate = dapps.length > 0 ? (deployedCount / dapps.length) * 100 : 0;

    // Identify specializations (categories with multiple dapps)
    const categoryCount: Record<string, number> = {};
    dapps.forEach((dapp) => {
      categoryCount[dapp.category] = (categoryCount[dapp.category] || 0) + 1;
    });

    const specializations = Object.entries(categoryCount)
      .filter(([_, count]) => count >= 2)
      .map(([category, _]) => category);

    return {
      userAddress,
      dappCount: dapps.length,
      categories,
      techStacks,
      successRate,
      specializations,
    };
  }

  private findComplementaryDevelopers(
    userProfile: DeveloperProfile,
    allProfiles: DeveloperProfile[],
  ): DeveloperProfile[] {
    return allProfiles
      .filter((profile) => profile.userAddress !== userProfile.userAddress)
      .filter((profile) => {
        // Find developers with complementary skills
        const hasComplementaryCategories = profile.categories.some((cat) => !userProfile.categories.includes(cat));
        const hasComplementaryTechStack = profile.techStacks.some((tech) => !userProfile.techStacks.includes(tech));

        return hasComplementaryCategories || hasComplementaryTechStack;
      })
      .sort((a, b) => b.successRate - a.successRate)
      .slice(0, 5);
  }

  private identifyComplementarySkills(userProfile: DeveloperProfile, allProfiles: DeveloperProfile[]): string[] {
    const allSkills = new Set<string>();

    allProfiles.forEach((profile) => {
      profile.techStacks.forEach((tech) => allSkills.add(tech));
    });

    return Array.from(allSkills)
      .filter((skill) => !userProfile.techStacks.includes(skill))
      .slice(0, 10);
  }

  private generateProjectSuggestions(userProfile: DeveloperProfile): string[] {
    const suggestions: string[] = [];

    // Suggest cross-category projects
    if (userProfile.categories.includes('Finance') && userProfile.categories.includes('Gaming')) {
      suggestions.push('GameFi platform combining your finance and gaming expertise');
    }

    if (userProfile.categories.includes('Art/NFT') && userProfile.categories.includes('Music')) {
      suggestions.push('NFT music platform leveraging your art and music experience');
    }

    // Suggest based on popular tech stacks
    if (userProfile.techStacks.includes('React') && !userProfile.techStacks.includes('Three.js')) {
      suggestions.push('3D interactive dapp using Three.js to expand your React skills');
    }

    return suggestions;
  }
}

export const dappIntelligenceService = new DappIntelligenceService();
