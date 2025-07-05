import React from 'react';
import { useFlowAuth } from '../../lib/contexts/FlowAuthContext';
import { ContractDeployment } from './ContractDeployment';
import { ContractInteraction } from './ContractInteraction';
import { WalletLogin } from './WalletLogin';

export const FlowDemo: React.FC = () => {
  const { isAuthenticated } = useFlowAuth();

  if (!isAuthenticated) {
    return <WalletLogin />;
  }

  return (
    <div className="min-h-screen bg-cosmiq-elements-background-depth-1">
      <div className="container mx-auto py-8 space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-cosmiq-elements-textPrimary">🌊 Flow Blockchain Demo</h1>
          <p className="text-lg text-cosmiq-elements-textSecondary max-w-2xl mx-auto">
            Deploy and interact with smart contracts on the Flow blockchain. This demo showcases a simple HelloWorld
            contract with console logging.
          </p>
        </div>

        {/* Demo Sections */}
        <div className="space-y-8">
          {/* Contract Deployment Section */}
          <ContractDeployment />

          {/* Contract Interaction Section */}
          <ContractInteraction />
        </div>

        {/* Footer */}
        <div className="text-center space-y-4 pt-8 border-t border-cosmiq-elements-borderColor">
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-cosmiq-elements-textPrimary">🎯 What This Demo Shows</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 max-w-4xl mx-auto">
              <div className="bg-cosmiq-elements-background-depth-2 rounded-lg p-4">
                <div className="text-2xl mb-2">🚀</div>
                <h4 className="font-semibold text-cosmiq-elements-textPrimary">Contract Deployment</h4>
                <p className="text-sm text-cosmiq-elements-textSecondary">
                  Deploy Cadence smart contracts to Flow testnet
                </p>
              </div>

              <div className="bg-cosmiq-elements-background-depth-2 rounded-lg p-4">
                <div className="text-2xl mb-2">📝</div>
                <h4 className="font-semibold text-cosmiq-elements-textPrimary">Console Logging</h4>
                <p className="text-sm text-cosmiq-elements-textSecondary">See transaction logs and events in real-time</p>
              </div>

              <div className="bg-cosmiq-elements-background-depth-2 rounded-lg p-4">
                <div className="text-2xl mb-2">🔗</div>
                <h4 className="font-semibold text-cosmiq-elements-textPrimary">Contract Interaction</h4>
                <p className="text-sm text-cosmiq-elements-textSecondary">Read and write data to deployed contracts</p>
              </div>

              <div className="bg-cosmiq-elements-background-depth-2 rounded-lg p-4">
                <div className="text-2xl mb-2">📊</div>
                <h4 className="font-semibold text-cosmiq-elements-textPrimary">Transaction Status</h4>
                <p className="text-sm text-cosmiq-elements-textSecondary">Track transaction lifecycle in real-time</p>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-cosmiq-elements-textPrimary">📚 Learn More About Flow</h3>
            <div className="flex flex-wrap justify-center gap-4">
              <a
                href="https://developers.flow.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors duration-200"
              >
                Flow Docs
              </a>
              <a
                href="https://cadence-lang.org/"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-lg transition-colors duration-200"
              >
                Cadence Language
              </a>
              <a
                href="https://play.onflow.org/"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition-colors duration-200"
              >
                Flow Playground
              </a>
              <a
                href="https://academy.ecdao.org/"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg transition-colors duration-200"
              >
                Emerald Academy
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
