import React from 'react';
import { useFlowAuth } from '~/lib/contexts/FlowAuthContext';
import { Button } from '~/components/ui/Button';
import { LoadingDots } from '~/components/ui/LoadingDots';

export const WalletLogin: React.FC = () => {
  const { login, isLoading, error } = useFlowAuth();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-cosmiq-elements-background-depth-1 px-4">
      <div className="max-w-md w-full space-y-8 text-center">
        {/* Flow Logo/Brand */}
        <div className="flex flex-col items-center space-y-4">
          <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-10 h-10 text-white">
              <path d="M12 2L2 7v10c0 5.55 3.84 9.95 9 11 5.16-1.05 9-5.45 9-11V7l-10-5z" />
              <path d="M8 12l2 2 4-4" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-cosmiq-elements-textPrimary">Connect Flow Wallet</h1>
        </div>

        {/* Description */}
        <div className="space-y-4">
          <p className="text-lg text-cosmiq-elements-textSecondary">
            Connect your Flow wallet to access CosmiqETH and start building amazing applications.
          </p>

          <div className="bg-cosmiq-elements-background-depth-2 rounded-lg p-4 text-left">
            <h3 className="font-semibold text-cosmiq-elements-textPrimary mb-2">What you'll get:</h3>
            <ul className="space-y-1 text-sm text-cosmiq-elements-textSecondary">
              <li>🚀 Access to AI-powered development tools</li>
              <li>💎 Secure Web3 authentication</li>
              <li>🔧 Build applications on Flow blockchain</li>
              <li>🎨 Create and deploy smart contracts</li>
            </ul>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 text-red-400">
            <p className="font-medium">Connection Failed</p>
            <p className="text-sm mt-1">{error}</p>
          </div>
        )}

        {/* Connect Button */}
        <div className="space-y-4">
          <Button
            onClick={login}
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold py-4 px-6 rounded-lg transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:hover:scale-100"
          >
            {isLoading ? (
              <div className="flex items-center justify-center space-x-2">
                <LoadingDots text={''} />
                <span>Connecting...</span>
              </div>
            ) : (
              'Connect Flow Wallet'
            )}
          </Button>

          <p className="text-xs text-cosmiq-elements-textSecondary">
            By connecting, you agree to our Terms of Service and Privacy Policy. Your wallet will remain secure and
            private.
          </p>
        </div>

        {/* Supported Wallets */}
        <div className="pt-8 border-t border-cosmiq-elements-borderColor">
          <p className="text-sm text-cosmiq-elements-textSecondary mb-4">Supported Flow wallets:</p>
          <div className="flex justify-center space-x-4">
            <div className="bg-cosmiq-elements-background-depth-2 rounded-lg p-3">
              <span className="text-sm font-medium text-cosmiq-elements-textPrimary">Blocto</span>
            </div>
            <div className="bg-cosmiq-elements-background-depth-2 rounded-lg p-3">
              <span className="text-sm font-medium text-cosmiq-elements-textPrimary">Lilico</span>
            </div>
            <div className="bg-cosmiq-elements-background-depth-2 rounded-lg p-3">
              <span className="text-sm font-medium text-cosmiq-elements-textPrimary">Dapper</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
