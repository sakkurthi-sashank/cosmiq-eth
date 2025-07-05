import React from 'react';
import { useFlowAuth } from '~/lib/contexts/FlowAuthContext';
import { Button } from '~/components/ui/Button';
import { LoadingDots } from '~/components/ui/LoadingDots';

export const WalletLogin: React.FC = () => {
  const { login, isLoading, error } = useFlowAuth();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-cosmiq-elements-background-depth-1 px-4">
      <div className="max-w-md w-full space-y-8 text-center mx-auto">
        <span className="text-2xl font-bold bg-gradient-to-r from-green-400 via-green-500 to-green-600 bg-clip-text text-transparent">
          COSMIQ
        </span>
        <span className="text-2xl ">💨</span>

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
            className="w-full bg-green-500 text-white font-semibold py-4 px-6 rounded-lg transition-all duration-200 transform hover:bg-green-500 disabled:opacity-50"
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
      </div>
    </div>
  );
};
