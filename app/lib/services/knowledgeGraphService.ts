import { Graph, Ipfs, type Op, SystemIds, getWalletClient } from '@graphprotocol/grc-20';



const addressPrivateKey = import.meta.env.VITE_PRIVATE_KEY as `0x${string}`;
const addressEnv = import.meta.env.VITE_ADDRESS as `0x${string}`;

if (!addressPrivateKey) {
  throw new Error('PRIVATE_KEY environment variable is required');
}

if (!addressEnv) {
  throw new Error('ADDRESS environment variable is required');
}

const address = addressEnv;

interface PropertyDefinition {
  name: string;
  dataType: 'TEXT' | 'RELATION';
}

interface TypeDefinition {
  name: string;
  properties: string[];
}

export interface DappMetadata {
  name: string;
  description: string;
  category: string;
  originalPrompt: string;
  techStack: string[];
  smartContractFunctions: string[];
  deploymentAddress?: string;
  generationTimestamp: Date;
  userAddress: string;
  contractDeployed: boolean;
  userIntent?: string;
  integrationPoints?: string[];
  compositionTags?: string[];
}

export interface PublishedDapp extends DappMetadata {
  knowledgeGraphId: string;
  ipfsCid: string;
  txHash?: string;
  spaceId?: string;
}

export interface KnowledgeGraphSchema {
  properties: Record<string, string>;
  types: Record<string, string>;
  categories: Record<string, string>;
  spaceId: string;
}

class KnowledgeGraphService {
  private schema: KnowledgeGraphSchema | null = null;
  private initialized = false;

  async initializeSchema(): Promise<KnowledgeGraphSchema> {
    if (this.schema) return this.schema;

    const ops: Array<Op> = [];
    const properties: Record<string, string> = {};
    const types: Record<string, string> = {};
    const categories: Record<string, string> = {};

    // Create properties using proper GRC-20 approach
    const { id: descriptionPropertyId, ops: createDescriptionPropertyOps } = Graph.createProperty({
      name: 'description',
      dataType: 'TEXT',
    });
    properties.DESCRIPTION = descriptionPropertyId;
    ops.push(...createDescriptionPropertyOps);

    const { id: categoryPropertyId, ops: createCategoryPropertyOps } = Graph.createProperty({
      name: 'category',
      dataType: 'TEXT',
    });
    properties.CATEGORY = categoryPropertyId;
    ops.push(...createCategoryPropertyOps);

    const { id: originalPromptPropertyId, ops: createOriginalPromptPropertyOps } = Graph.createProperty({
      name: 'originalPrompt',
      dataType: 'TEXT',
    });
    properties.ORIGINAL_PROMPT = originalPromptPropertyId;
    ops.push(...createOriginalPromptPropertyOps);

    const { id: techStackPropertyId, ops: createTechStackPropertyOps } = Graph.createProperty({
      name: 'techStack',
      dataType: 'TEXT',
    });
    properties.TECH_STACK = techStackPropertyId;
    ops.push(...createTechStackPropertyOps);

    const { id: smartContractFunctionsPropertyId, ops: createSmartContractFunctionsPropertyOps } = Graph.createProperty({
      name: 'smartContractFunctions',
      dataType: 'TEXT',
    });
    properties.SMART_CONTRACT_FUNCTIONS = smartContractFunctionsPropertyId;
    ops.push(...createSmartContractFunctionsPropertyOps);

    const { id: deploymentAddressPropertyId, ops: createDeploymentAddressPropertyOps } = Graph.createProperty({
      name: 'deploymentAddress',
      dataType: 'TEXT',
    });
    properties.DEPLOYMENT_ADDRESS = deploymentAddressPropertyId;
    ops.push(...createDeploymentAddressPropertyOps);

    const { id: generationTimestampPropertyId, ops: createGenerationTimestampPropertyOps } = Graph.createProperty({
      name: 'generationTimestamp',
      dataType: 'TEXT',
    });
    properties.GENERATION_TIMESTAMP = generationTimestampPropertyId;
    ops.push(...createGenerationTimestampPropertyOps);

    const { id: userAddressPropertyId, ops: createUserAddressPropertyOps } = Graph.createProperty({
      name: 'userAddress',
      dataType: 'TEXT',
    });
    properties.USER_ADDRESS = userAddressPropertyId;
    ops.push(...createUserAddressPropertyOps);

    const { id: contractDeployedPropertyId, ops: createContractDeployedPropertyOps } = Graph.createProperty({
      name: 'contractDeployed',
      dataType: 'TEXT',
    });
    properties.CONTRACT_DEPLOYED = contractDeployedPropertyId;
    ops.push(...createContractDeployedPropertyOps);

    const { id: userIntentPropertyId, ops: createUserIntentPropertyOps } = Graph.createProperty({
      name: 'userIntent',
      dataType: 'TEXT',
    });
    properties.USER_INTENT = userIntentPropertyId;
    ops.push(...createUserIntentPropertyOps);

    const { id: integrationPointsPropertyId, ops: createIntegrationPointsPropertyOps } = Graph.createProperty({
      name: 'integrationPoints',
      dataType: 'TEXT',
    });
    properties.INTEGRATION_POINTS = integrationPointsPropertyId;
    ops.push(...createIntegrationPointsPropertyOps);

    const { id: compositionTagsPropertyId, ops: createCompositionTagsPropertyOps } = Graph.createProperty({
      name: 'compositionTags',
      dataType: 'TEXT',
    });
    properties.COMPOSITION_TAGS = compositionTagsPropertyId;
    ops.push(...createCompositionTagsPropertyOps);

    // Create relation properties
    const { id: createdByPropertyId, ops: createCreatedByPropertyOps } = Graph.createProperty({
      name: 'createdBy',
      dataType: 'RELATION',
    });
    properties.CREATED_BY = createdByPropertyId;
    ops.push(...createCreatedByPropertyOps);

    const { id: belongsToCategoryPropertyId, ops: createBelongsToCategoryPropertyOps } = Graph.createProperty({
      name: 'belongsToCategory',
      dataType: 'RELATION',
    });
    properties.BELONGS_TO_CATEGORY = belongsToCategoryPropertyId;
    ops.push(...createBelongsToCategoryPropertyOps);

    // Create types
    const { id: dappTypeId, ops: createDappTypeOps } = Graph.createType({
      name: 'CosmiqETH Dapp',
      properties: [
        SystemIds.NAME_PROPERTY,
        descriptionPropertyId,
        categoryPropertyId,
        originalPromptPropertyId,
        techStackPropertyId,
        smartContractFunctionsPropertyId,
        deploymentAddressPropertyId,
        generationTimestampPropertyId,
        userAddressPropertyId,
        contractDeployedPropertyId,
        userIntentPropertyId,
        integrationPointsPropertyId,
        compositionTagsPropertyId,
        createdByPropertyId,
        belongsToCategoryPropertyId,
      ],
    });
    types.DAPP = dappTypeId;
    ops.push(...createDappTypeOps);

    const { id: userTypeId, ops: createUserTypeOps } = Graph.createType({
      name: 'CosmiqETH User',
      properties: [SystemIds.NAME_PROPERTY, userAddressPropertyId],
    });
    types.USER = userTypeId;
    ops.push(...createUserTypeOps);

    const { id: categoryTypeId, ops: createCategoryTypeOps } = Graph.createType({
      name: 'Dapp Category',
      properties: [SystemIds.NAME_PROPERTY, descriptionPropertyId],
    });
    types.CATEGORY = categoryTypeId;
    ops.push(...createCategoryTypeOps);

    // Create category entities
    const categoryNames = this.getCategoryNames();
    for (const categoryName of categoryNames) {
      const { id: categoryEntityId, ops: createCategoryEntityOps } = Graph.createEntity({
        name: categoryName,
        description: `${categoryName} applications generated by CosmiqETH`,
        types: [categoryTypeId],
        values: [
          {
            property: SystemIds.NAME_PROPERTY,
            value: categoryName,
          },
          {
            property: descriptionPropertyId,
            value: `${categoryName} applications generated by CosmiqETH`,
          },
        ],
      });

      const key = categoryName.toLowerCase().replace(/[^a-z0-9]/g, '_');
      categories[key] = categoryEntityId;
      ops.push(...createCategoryEntityOps);
    }

    try {
      const smartAccountWalletClient = await getWalletClient({
        privateKey: addressPrivateKey,
      });

      const { id: spaceId } = await Graph.createSpace({
        editorAddress: address,
        name: 'CosmiqETH Dapp Metadata Space',
        network: 'TESTNET',
      });

      const { cid } = await Ipfs.publishEdit({
        name: 'CosmiqETH Knowledge Graph Schema',
        ops: ops,
        author: address,
        network: 'TESTNET',
      });

      const result = await fetch(`https://hypergraph-v2-testnet.up.railway.app/space/${spaceId}/edit/calldata`, {
        method: 'POST',
        body: JSON.stringify({ cid }),
      });

      const editResultJson = (await result.json()) as { to: `0x${string}`; data: `0x${string}` };
      const { to, data } = editResultJson;

      await smartAccountWalletClient.sendTransaction({
        // @ts-expect-error - TODO: fix the types error
        account: smartAccountWalletClient.account,
        to: to,
        value: 0n,
        data: data,
      });

      this.schema = { properties, types, categories, spaceId };
      this.initialized = true;

      return this.schema;
    } catch (error) {
      console.error('Failed to initialize Knowledge Graph schema:', error);
      throw error;
    }
  }

  async publishDappMetadata(metadata: DappMetadata): Promise<PublishedDapp> {
    const schema = await this.initializeSchema();
    const ops: Array<Op> = [];

    const { id: userId, ops: createUserOps } = Graph.createEntity({
      name: `User ${metadata.userAddress.slice(0, 8)}...`,
      types: [schema.types.USER],
      values: [
        {
          property: schema.properties.USER_ADDRESS,
          value: metadata.userAddress,
        },
        {
          property: SystemIds.NAME_PROPERTY,
          value: `User ${metadata.userAddress.slice(0, 8)}...`,
        },
      ],
    });
    ops.push(...createUserOps);

    const dappValues = [
      {
        property: SystemIds.NAME_PROPERTY,
        value: metadata.name,
      },
      {
        property: schema.properties.DESCRIPTION,
        value: metadata.description,
      },
      {
        property: schema.properties.CATEGORY,
        value: metadata.category,
      },
      {
        property: schema.properties.ORIGINAL_PROMPT,
        value: metadata.originalPrompt,
      },
      {
        property: schema.properties.TECH_STACK,
        value: JSON.stringify(metadata.techStack),
      },
      {
        property: schema.properties.SMART_CONTRACT_FUNCTIONS,
        value: JSON.stringify(metadata.smartContractFunctions),
      },
      {
        property: schema.properties.GENERATION_TIMESTAMP,
        value: Graph.serializeDate(metadata.generationTimestamp),
      },
      {
        property: schema.properties.USER_ADDRESS,
        value: metadata.userAddress,
      },
      {
        property: schema.properties.CONTRACT_DEPLOYED,
        value: Graph.serializeCheckbox(metadata.contractDeployed),
      },
    ];

    if (metadata.deploymentAddress) {
      dappValues.push({
        property: schema.properties.DEPLOYMENT_ADDRESS,
        value: metadata.deploymentAddress,
      });
    }

    if (metadata.userIntent) {
      dappValues.push({
        property: schema.properties.USER_INTENT,
        value: metadata.userIntent,
      });
    }

    if (metadata.integrationPoints) {
      dappValues.push({
        property: schema.properties.INTEGRATION_POINTS,
        value: JSON.stringify(metadata.integrationPoints),
      });
    }

    if (metadata.compositionTags) {
      dappValues.push({
        property: schema.properties.COMPOSITION_TAGS,
        value: JSON.stringify(metadata.compositionTags),
      });
    }

    const categoryKey = metadata.category.toLowerCase().replace(/[^a-z0-9]/g, '_');
    const categoryId = schema.categories[categoryKey] || schema.categories.other;

    const { id: dappId, ops: createDappOps } = Graph.createEntity({
      name: metadata.name,
      description: metadata.description,
      types: [schema.types.DAPP],
      values: dappValues,
      relations: {
        [schema.properties.CREATED_BY]: {
          toEntity: userId,
        },
        [schema.properties.BELONGS_TO_CATEGORY]: {
          toEntity: categoryId,
        },
      },
    });
    ops.push(...createDappOps);

    try {
      const smartAccountWalletClient = await getWalletClient({
        privateKey: addressPrivateKey,
      });

      const { cid } = await Ipfs.publishEdit({
        name: `CosmiqETH Dapp: ${metadata.name}`,
        ops,
        author: metadata.userAddress as `0x${string}`,
        network: 'TESTNET',
      });

      const result = await fetch(`https://hypergraph-v2-testnet.up.railway.app/space/${schema.spaceId}/edit/calldata`, {
        method: 'POST',
        body: JSON.stringify({ cid }),
      });

      const editResultJson = (await result.json()) as { to: `0x${string}`; data: `0x${string}` };
      const { to, data } = editResultJson;

      const txResult = await smartAccountWalletClient.sendTransaction({
        // @ts-expect-error - TODO: fix the types error
        account: smartAccountWalletClient.account,
        to: to,
        value: 0n,
        data: data,
      });

      return {
        ...metadata,
        knowledgeGraphId: dappId,
        ipfsCid: cid,
        txHash: txResult,
        spaceId: schema.spaceId,
      };
    } catch (error) {
      console.error('Failed to publish dapp metadata:', error);
      throw error;
    }
  }

  async updateDappMetadata(
    knowledgeGraphId: string,
    updates: Partial<DappMetadata>,
    authorAddress: string,
  ): Promise<string> {
    const schema = await this.initializeSchema();
    const ops: Array<Op> = [];

    if (updates.deploymentAddress) {
      const { ops: updateAddressOps } = Graph.updateEntity({
        id: knowledgeGraphId,
        values: [
          {
            property: schema.properties.DEPLOYMENT_ADDRESS,
            value: updates.deploymentAddress,
          },
        ],
      });
      ops.push(...updateAddressOps);
    }

    if (updates.contractDeployed !== undefined) {
      const { ops: updateDeployedOps } = Graph.updateEntity({
        id: knowledgeGraphId,
        values: [
          {
            property: schema.properties.CONTRACT_DEPLOYED,
            value: Graph.serializeCheckbox(updates.contractDeployed),
          },
        ],
      });
      ops.push(...updateDeployedOps);
    }

    try {
      const smartAccountWalletClient = await getWalletClient({
        privateKey: addressPrivateKey,
      });

      const { cid } = await Ipfs.publishEdit({
        name: `Update CosmiqETH Dapp: ${knowledgeGraphId}`,
        ops,
        author: authorAddress as `0x${string}`,
        network: 'TESTNET',
      });

      const result = await fetch(`https://hypergraph-v2-testnet.up.railway.app/space/${schema.spaceId}/edit/calldata`, {
        method: 'POST',
        body: JSON.stringify({ cid }),
      });

      const editResultJson = (await result.json()) as { to: `0x${string}`; data: `0x${string}` };
      const { to, data } = editResultJson;

      await smartAccountWalletClient.sendTransaction({
        // @ts-expect-error - TODO: fix the types error
        account: smartAccountWalletClient.account,
        to: to,
        value: 0n,
        data: data,
      });

      return cid;
    } catch (error) {
      console.error('Failed to update dapp metadata:', error);
      throw error;
    }
  }

  async findSimilarDapps(metadata: DappMetadata): Promise<string[]> {
    return [];
  }

  extractDappMetadata(
    files: Record<string, any>,
    originalPrompt: string,
    userAddress: string,
    contractDeployed: boolean = false,
    deploymentAddress?: string,
  ): DappMetadata {
    let dappName = 'Untitled Dapp';
    if (files['package.json']) {
      try {
        const pkg = JSON.parse(files['package.json'].content);
        dappName = pkg.name || 'Untitled Dapp';
      } catch (e) {
        console.warn('Failed to parse package.json for dapp name');
      }
    }

    const category = this.categorizeFromPrompt(originalPrompt);
    const userIntent = this.extractUserIntent(originalPrompt);
    const techStack = this.extractTechStack(files);
    const smartContractFunctions = this.extractSmartContractFunctions(files);
    const compositionTags = this.generateCompositionTags(originalPrompt, smartContractFunctions);
    const integrationPoints = this.identifyIntegrationPoints(files, smartContractFunctions);

    return {
      name: dappName,
      description: `AI-generated ${category.toLowerCase()} application: ${originalPrompt.slice(0, 100)}...`,
      category,
      originalPrompt,
      techStack,
      smartContractFunctions,
      deploymentAddress,
      generationTimestamp: new Date(),
      userAddress,
      contractDeployed,
      userIntent,
      integrationPoints,
      compositionTags,
    };
  }

  private getCategoryNames(): string[] {
    return [
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
  }

  private categorizeFromPrompt(prompt: string): string {
    const promptLower = prompt.toLowerCase();

    if (
      promptLower.includes('marketplace') ||
      promptLower.includes('shop') ||
      promptLower.includes('buy') ||
      promptLower.includes('sell')
    ) {
      return 'E-commerce';
    }
    if (
      promptLower.includes('social') ||
      promptLower.includes('chat') ||
      promptLower.includes('friend') ||
      promptLower.includes('post')
    ) {
      return 'Social Media';
    }
    if (
      promptLower.includes('game') ||
      promptLower.includes('play') ||
      promptLower.includes('score') ||
      promptLower.includes('level')
    ) {
      return 'Gaming';
    }
    if (
      promptLower.includes('token') ||
      promptLower.includes('defi') ||
      promptLower.includes('finance') ||
      promptLower.includes('payment')
    ) {
      return 'Finance';
    }
    if (
      promptLower.includes('music') ||
      promptLower.includes('song') ||
      promptLower.includes('audio') ||
      promptLower.includes('playlist')
    ) {
      return 'Music';
    }
    if (
      promptLower.includes('nft') ||
      promptLower.includes('art') ||
      promptLower.includes('collectible') ||
      promptLower.includes('gallery')
    ) {
      return 'Art/NFT';
    }
    if (
      promptLower.includes('todo') ||
      promptLower.includes('task') ||
      promptLower.includes('productivity') ||
      promptLower.includes('note')
    ) {
      return 'Productivity';
    }

    return 'Other';
  }

  private extractUserIntent(prompt: string): string {
    if (prompt.includes('create') || prompt.includes('build') || prompt.includes('make')) {
      return 'creation';
    }
    if (prompt.includes('manage') || prompt.includes('organize') || prompt.includes('track')) {
      return 'management';
    }
    if (prompt.includes('connect') || prompt.includes('social') || prompt.includes('share')) {
      return 'social';
    }
    if (prompt.includes('trade') || prompt.includes('exchange') || prompt.includes('buy') || prompt.includes('sell')) {
      return 'commerce';
    }

    return 'general';
  }

  private extractTechStack(files: Record<string, any>): string[] {
    const techStack: string[] = ['React', 'TypeScript'];

    if (files['package.json']) {
      try {
        const pkg = JSON.parse(files['package.json'].content);
        const deps = { ...pkg.dependencies, ...pkg.devDependencies };

        if (deps['@onflow/fcl']) techStack.push('Flow', 'FCL');
        if (deps['vite']) techStack.push('Vite');
        if (deps['tailwindcss']) techStack.push('TailwindCSS');
        if (deps['framer-motion']) techStack.push('Framer Motion');
      } catch (e) {
        console.warn('Failed to parse package.json for tech stack');
      }
    }

    const hasContract = Object.keys(files).some((path) => path.endsWith('.cdc'));
    if (hasContract) {
      techStack.push('Cadence', 'Smart Contracts');
    }

    return [...new Set(techStack)];
  }

  private extractSmartContractFunctions(files: Record<string, any>): string[] {
    const functions: string[] = [];

    for (const [path, file] of Object.entries(files)) {
      if (path.endsWith('.cdc') && file.content) {
        const functionMatches = file.content.match(/access\(all\)\s+fun\s+(\w+)/g);
        if (functionMatches) {
          functionMatches.forEach((match: string) => {
            const funcName = match.match(/fun\s+(\w+)/)?.[1];
            if (funcName && !functions.includes(funcName)) {
              functions.push(funcName);
            }
          });
        }
      }
    }

    return functions;
  }

  private generateCompositionTags(prompt: string, functions: string[]): string[] {
    const tags: string[] = [];

    if (functions.includes('mint')) tags.push('minting');
    if (functions.includes('buy') || functions.includes('sell')) tags.push('marketplace');
    if (functions.includes('transfer')) tags.push('transferable');
    if (functions.includes('create')) tags.push('creation');
    if (functions.includes('vote')) tags.push('governance');

    const promptLower = prompt.toLowerCase();
    if (promptLower.includes('decentralized')) tags.push('decentralized');
    if (promptLower.includes('community')) tags.push('community');
    if (promptLower.includes('reward')) tags.push('rewards');
    if (promptLower.includes('staking')) tags.push('staking');

    return [...new Set(tags)];
  }

  private identifyIntegrationPoints(files: Record<string, any>, functions: string[]): string[] {
    const integrationPoints: string[] = [];

    if (functions.includes('mint') && functions.includes('transfer')) {
      integrationPoints.push('NFT marketplace integration');
    }
    if (functions.includes('vote') || functions.includes('propose')) {
      integrationPoints.push('DAO governance integration');
    }
    if (functions.includes('stake') || functions.includes('reward')) {
      integrationPoints.push('DeFi staking integration');
    }
    if (functions.includes('create') && functions.includes('buy')) {
      integrationPoints.push('Creator economy integration');
    }

    const hasAPI = Object.keys(files).some((path) => path.includes('api') || path.includes('route'));
    if (hasAPI) {
      integrationPoints.push('External API integration');
    }

    const hasAuth = Object.keys(files).some((path) => path.includes('auth') || path.includes('login'));
    if (hasAuth) {
      integrationPoints.push('Multi-wallet integration');
    }

    return integrationPoints;
  }
}

export const knowledgeGraphService = new KnowledgeGraphService();
