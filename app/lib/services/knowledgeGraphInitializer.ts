import { Graph, Ipfs, type Op, SystemIds, getWalletClient } from '@graphprotocol/grc-20';

// Get environment variables
const addressPrivateKey = import.meta.env.VITE_PRIVATE_KEY as `0x${string}`;
const addressEnv = import.meta.env.VITE_ADDRESS as `0x${string}`;

if (!addressPrivateKey) {
  throw new Error('PRIVATE_KEY environment variable is required');
}

if (!addressEnv) {
  throw new Error('ADDRESS environment variable is required');
}

if (!addressEnv.startsWith('0x')) {
  throw new Error('ADDRESS must start with 0x');
}

// Type guard to ensure proper typing
function isValidAddress(addr: string): addr is `0x${string}` {
  return addr.startsWith('0x') && addr.length === 42;
}

if (!isValidAddress(addressEnv)) {
  throw new Error('ADDRESS must be a valid Ethereum address (0x followed by 40 hex characters)');
}

const address = addressEnv;

export interface InitializationResult {
  propertiesCreated: number;
  typesCreated: number;
  categoriesCreated: number;
  spaceId: string;
  ipfsCid: string;
  txResult: string;
  success: boolean;
}

export class KnowledgeGraphInitializer {
  async initializeCosmiqETHSchema(): Promise<InitializationResult> {
    const ops: Array<Op> = [];
    let propertiesCreated = 0;
    let typesCreated = 0;
    let categoriesCreated = 0;

    const properties: Record<string, string> = {};
    const types: Record<string, string> = {};

    // Create custom properties for CosmiqETH dapps
    const { id: descriptionPropertyId, ops: createDescriptionPropertyOps } = Graph.createProperty({
      name: 'description',
      dataType: 'TEXT',
    });
    properties.DESCRIPTION = descriptionPropertyId;
    ops.push(...createDescriptionPropertyOps);
    propertiesCreated++;

    const { id: categoryPropertyId, ops: createCategoryPropertyOps } = Graph.createProperty({
      name: 'category',
      dataType: 'TEXT',
    });
    properties.CATEGORY = categoryPropertyId;
    ops.push(...createCategoryPropertyOps);
    propertiesCreated++;

    const { id: originalPromptPropertyId, ops: createOriginalPromptPropertyOps } = Graph.createProperty({
      name: 'originalPrompt',
      dataType: 'TEXT',
    });
    properties.ORIGINAL_PROMPT = originalPromptPropertyId;
    ops.push(...createOriginalPromptPropertyOps);
    propertiesCreated++;

    const { id: techStackPropertyId, ops: createTechStackPropertyOps } = Graph.createProperty({
      name: 'techStack',
      dataType: 'TEXT',
    });
    properties.TECH_STACK = techStackPropertyId;
    ops.push(...createTechStackPropertyOps);
    propertiesCreated++;

    const { id: smartContractFunctionsPropertyId, ops: createSmartContractFunctionsPropertyOps } = Graph.createProperty(
      {
        name: 'smartContractFunctions',
        dataType: 'TEXT',
      },
    );
    properties.SMART_CONTRACT_FUNCTIONS = smartContractFunctionsPropertyId;
    ops.push(...createSmartContractFunctionsPropertyOps);
    propertiesCreated++;

    const { id: deploymentAddressPropertyId, ops: createDeploymentAddressPropertyOps } = Graph.createProperty({
      name: 'deploymentAddress',
      dataType: 'TEXT',
    });
    properties.DEPLOYMENT_ADDRESS = deploymentAddressPropertyId;
    ops.push(...createDeploymentAddressPropertyOps);
    propertiesCreated++;

    const { id: generationTimestampPropertyId, ops: createGenerationTimestampPropertyOps } = Graph.createProperty({
      name: 'generationTimestamp',
      dataType: 'TEXT',
    });
    properties.GENERATION_TIMESTAMP = generationTimestampPropertyId;
    ops.push(...createGenerationTimestampPropertyOps);
    propertiesCreated++;

    const { id: userAddressPropertyId, ops: createUserAddressPropertyOps } = Graph.createProperty({
      name: 'userAddress',
      dataType: 'TEXT',
    });
    properties.USER_ADDRESS = userAddressPropertyId;
    ops.push(...createUserAddressPropertyOps);
    propertiesCreated++;

    const { id: contractDeployedPropertyId, ops: createContractDeployedPropertyOps } = Graph.createProperty({
      name: 'contractDeployed',
      dataType: 'TEXT',
    });
    properties.CONTRACT_DEPLOYED = contractDeployedPropertyId;
    ops.push(...createContractDeployedPropertyOps);
    propertiesCreated++;

    const { id: userIntentPropertyId, ops: createUserIntentPropertyOps } = Graph.createProperty({
      name: 'userIntent',
      dataType: 'TEXT',
    });
    properties.USER_INTENT = userIntentPropertyId;
    ops.push(...createUserIntentPropertyOps);
    propertiesCreated++;

    // Create relation properties
    const { id: createdByPropertyId, ops: createCreatedByPropertyOps } = Graph.createProperty({
      name: 'createdBy',
      dataType: 'RELATION',
    });
    properties.CREATED_BY = createdByPropertyId;
    ops.push(...createCreatedByPropertyOps);
    propertiesCreated++;

    const { id: belongsToCategoryPropertyId, ops: createBelongsToCategoryPropertyOps } = Graph.createProperty({
      name: 'belongsToCategory',
      dataType: 'RELATION',
    });
    properties.BELONGS_TO_CATEGORY = belongsToCategoryPropertyId;
    ops.push(...createBelongsToCategoryPropertyOps);
    propertiesCreated++;

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
        createdByPropertyId,
        belongsToCategoryPropertyId,
      ],
    });
    types.DAPP = dappTypeId;
    ops.push(...createDappTypeOps);
    typesCreated++;

    const { id: userTypeId, ops: createUserTypeOps } = Graph.createType({
      name: 'CosmiqETH User',
      properties: [SystemIds.NAME_PROPERTY, userAddressPropertyId],
    });
    types.USER = userTypeId;
    ops.push(...createUserTypeOps);
    typesCreated++;

    const { id: categoryTypeId, ops: createCategoryTypeOps } = Graph.createType({
      name: 'Dapp Category',
      properties: [SystemIds.NAME_PROPERTY, descriptionPropertyId],
    });
    types.CATEGORY = categoryTypeId;
    ops.push(...createCategoryTypeOps);
    typesCreated++;

    console.log({
      propertiesCreated,
      typesCreated,
      properties,
      types,
    });

    try {
      const smartAccountWalletClient = await getWalletClient({
        privateKey: addressPrivateKey,
      });

      const { id: spaceId } = await Graph.createSpace({
        editorAddress: address,
        name: 'CosmiqETH Knowledge Graph v1',
        network: 'TESTNET',
      });

      console.log('spaceId', spaceId);

      const { cid } = await Ipfs.publishEdit({
        name: 'Create CosmiqETH properties and types',
        ops: ops,
        author: address,
        network: 'TESTNET',
      });

      console.log('IPFS CID', cid);

      const result = await fetch(`https://hypergraph-v2-testnet.up.railway.app/space/${spaceId}/edit/calldata`, {
        method: 'POST',
        body: JSON.stringify({ cid }),
      });

      console.log('edit result', result);

      const editResultJson = (await result.json()) as { to: `0x${string}`; data: `0x${string}` };
      console.log('editResultJson', editResultJson);
      const { to, data } = editResultJson;

      console.log('to', to);
      console.log('data', data);

      const txResult = await smartAccountWalletClient.sendTransaction({
        // @ts-expect-error - TODO: fix the types error
        account: smartAccountWalletClient.account,
        to: to,
        value: 0n,
        data: data,
      });

      console.log('txResult', txResult);

      const initResult: InitializationResult = {
        propertiesCreated,
        typesCreated,
        categoriesCreated,
        spaceId,
        ipfsCid: cid,
        txResult: txResult,
        success: true,
      };

      this.storeInitializationResult(initResult, properties, types);
      return initResult;
    } catch (error) {
      console.error('Failed to initialize Knowledge Graph schema:', error);
      return {
        propertiesCreated: 0,
        typesCreated: 0,
        categoriesCreated: 0,
        spaceId: '',
        ipfsCid: '',
        txResult: '',
        success: false,
      };
    }
  }

  private storeInitializationResult(
    result: InitializationResult,
    properties: Record<string, string>,
    types: Record<string, string>,
  ): void {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(
        'kg_schema_initialized',
        JSON.stringify({
          ...result,
          timestamp: new Date().toISOString(),
          properties,
          types,
        }),
      );
    }
  }

  getStoredInitializationResult():
    | (InitializationResult & {
        timestamp: string;
        properties: Record<string, string>;
        types: Record<string, string>;
      })
    | null {
    if (typeof localStorage === 'undefined') {
      return null;
    }

    const stored = localStorage.getItem('kg_schema_initialized');
    if (!stored) {
      return null;
    }

    try {
      return JSON.parse(stored);
    } catch (error) {
      console.warn('Failed to parse stored initialization result:', error);
      return null;
    }
  }

  clearStoredInitialization(): void {
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem('kg_schema_initialized');
    }
  }
}

export const knowledgeGraphInitializer = new KnowledgeGraphInitializer();
