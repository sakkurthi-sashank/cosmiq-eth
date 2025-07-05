import * as fcl from '@onflow/fcl';

// Flow configuration
export const flowConfig = {
  // Flow testnet configuration
  'accessNode.api': 'https://rest-testnet.onflow.org',
  'discovery.wallet': 'https://fcl-discovery.onflow.org/testnet/authn',
  'flow.network': 'testnet',
  'app.detail.title': 'CosmiqETH',
  'app.detail.icon': 'https://cosmiq-eth.vercel.app/favicon.svg',
  'app.detail.description':
    'A Web3-inspired builder platform that generates working web applications from natural language prompts',
  'wallet.autoConnect': true,
  'walletconnect.projectId': '891352ea01a6423c5e916692be96aafc',
};

// Initialize FCL with configuration
export const initializeFlow = () => {
  fcl.config(flowConfig);
};

// Export FCL for use in components
export { fcl };
