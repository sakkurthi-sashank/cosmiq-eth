import { knowledgeGraphService, type DappMetadata } from './knowledgeGraphService';

// Store for capturing metadata during dapp generation
interface GenerationSession {
  chatId: string;
  originalPrompt: string;
  userAddress: string;
  startTime: Date;
  techStack?: string[];
  category?: string;
  userIntent?: string;
}

class DappMetadataCaptureService {
  private activeSessions = new Map<string, GenerationSession>();

  /**
   * Start capturing metadata for a new dapp generation session
   */
  startGenerationSession(chatId: string, originalPrompt: string, userAddress: string): void {
    const session: GenerationSession = {
      chatId,
      originalPrompt,
      userAddress,
      startTime: new Date()
    };

    this.activeSessions.set(chatId, session);
    localStorage.setItem(`generation_session_${chatId}`, JSON.stringify(session));
  }

  /**
   * Update generation session with additional metadata
   */
  updateGenerationSession(chatId: string, updates: Partial<GenerationSession>): void {
    const session = this.activeSessions.get(chatId);
    if (!session) {
      return;
    }

    const updatedSession = { ...session, ...updates };
    this.activeSessions.set(chatId, updatedSession);
    localStorage.setItem(`generation_session_${chatId}`, JSON.stringify(updatedSession));
  }

  /**
   * Get generation session data
   */
  getGenerationSession(chatId: string): GenerationSession | null {
    let session = this.activeSessions.get(chatId);

    if (!session) {
      const stored = localStorage.getItem(`generation_session_${chatId}`);
      if (stored) {
        try {
          session = JSON.parse(stored);
          if (session) {
            this.activeSessions.set(chatId, session);
          }
        } catch (error) {
          console.warn('Failed to parse stored generation session:', error);
        }
      }
    }

    return session || null;
  }

  /**
   * Finalize generation session and prepare for Knowledge Graph publishing
   */
  finalizeGenerationSession(
    chatId: string,
    files: Record<string, any>,
    contractDeployed: boolean = false,
    deploymentAddress?: string
  ): DappMetadata | null {
    const session = this.getGenerationSession(chatId);
    if (!session) {
      return null;
    }

    const metadata = knowledgeGraphService.extractDappMetadata(
      files,
      session.originalPrompt,
      session.userAddress,
      contractDeployed,
      deploymentAddress
    );

    const enhancedMetadata: DappMetadata = {
      ...metadata,
      originalPrompt: session.originalPrompt,
      generationTimestamp: session.startTime,
      userIntent: session.userIntent || metadata.userIntent,
      techStack: session.techStack || metadata.techStack,
      category: session.category || metadata.category
    };

    return enhancedMetadata;
  }

  /**
   * Auto-publish to Knowledge Graph when generation is complete
   */
  async autoPublishToKnowledgeGraph(
    chatId: string,
    files: Record<string, any>,
    contractDeployed: boolean = false,
    deploymentAddress?: string
  ): Promise<void> {
    try {
      const metadata = this.finalizeGenerationSession(chatId, files, contractDeployed, deploymentAddress);

      if (!metadata) {
        return;
      }

      const publishedDapp = await knowledgeGraphService.publishDappMetadata(metadata);

      localStorage.setItem(`kg_${chatId}_${metadata.userAddress}`, JSON.stringify({
        knowledgeGraphId: publishedDapp.knowledgeGraphId,
        ipfsCid: publishedDapp.ipfsCid,
        publishedAt: new Date().toISOString()
      }));

      this.endGenerationSession(chatId);

    } catch (error) {
      console.error('Failed to auto-publish to Knowledge Graph:', error);
      throw error;
    }
  }

  /**
   * End generation session and clean up
   */
  endGenerationSession(chatId: string): void {
    this.activeSessions.delete(chatId);
    localStorage.removeItem(`generation_session_${chatId}`);
  }

  /**
   * Enhanced prompt analysis for better metadata extraction
   */
  analyzePromptForMetadata(prompt: string): {
    category: string;
    userIntent: string;
    suggestedTechStack: string[];
    compositionTags: string[];
  } {
    const promptLower = prompt.toLowerCase();

    let category = 'Other';
    if (promptLower.match(/\b(marketplace|shop|store|buy|sell|commerce|payment|ecommerce)\b/)) {
      category = 'E-commerce';
    } else if (promptLower.match(/\b(social|chat|friend|post|share|community|forum)\b/)) {
      category = 'Social Media';
    } else if (promptLower.match(/\b(game|play|score|level|player|gaming|arcade)\b/)) {
      category = 'Gaming';
    } else if (promptLower.match(/\b(token|defi|finance|payment|loan|stake|yield|trading)\b/)) {
      category = 'Finance';
    } else if (promptLower.match(/\b(music|song|audio|playlist|artist|album|streaming)\b/)) {
      category = 'Music';
    } else if (promptLower.match(/\b(nft|art|collectible|gallery|artwork|creative)\b/)) {
      category = 'Art/NFT';
    } else if (promptLower.match(/\b(todo|task|productivity|note|organize|manage)\b/)) {
      category = 'Productivity';
    }

    let userIntent = 'general';
    if (promptLower.match(/\b(create|build|make|generate|develop)\b/)) {
      userIntent = 'creation';
    } else if (promptLower.match(/\b(manage|organize|track|monitor|control)\b/)) {
      userIntent = 'management';
    } else if (promptLower.match(/\b(connect|social|share|collaborate|network)\b/)) {
      userIntent = 'social';
    } else if (promptLower.match(/\b(trade|exchange|buy|sell|market|commerce)\b/)) {
      userIntent = 'commerce';
    } else if (promptLower.match(/\b(learn|educational|tutorial|guide|teach)\b/)) {
      userIntent = 'educational';
    }

    const suggestedTechStack = ['React', 'TypeScript'];
    if (promptLower.match(/\b(blockchain|web3|crypto|decentralized)\b/)) {
      suggestedTechStack.push('Flow', 'FCL', 'Cadence');
    }
    if (promptLower.match(/\b(realtime|chat|live|socket)\b/)) {
      suggestedTechStack.push('WebSocket', 'Real-time');
    }
    if (promptLower.match(/\b(ai|ml|machine learning|artificial intelligence)\b/)) {
      suggestedTechStack.push('AI/ML');
    }

    const compositionTags: string[] = [];
    if (promptLower.includes('decentralized')) compositionTags.push('decentralized');
    if (promptLower.includes('community')) compositionTags.push('community');
    if (promptLower.includes('reward')) compositionTags.push('rewards');
    if (promptLower.includes('staking')) compositionTags.push('staking');
    if (promptLower.includes('governance')) compositionTags.push('governance');
    if (promptLower.includes('marketplace')) compositionTags.push('marketplace');
    if (promptLower.includes('creator')) compositionTags.push('creator-economy');

    return {
      category,
      userIntent,
      suggestedTechStack,
      compositionTags
    };
  }

  /**
   * Get all generation sessions (for debugging/admin)
   */
  getAllActiveSessions(): GenerationSession[] {
    return Array.from(this.activeSessions.values());
  }
}

// Export singleton instance
export const dappMetadataCaptureService = new DappMetadataCaptureService();

// Export types
export type { GenerationSession };
