import React from 'react';
import { useFlowAuth } from '~/lib/contexts/FlowAuthContext';
import { WalletLogin } from './WalletLogin';
import { LoadingOverlay } from '~/components/ui/LoadingOverlay';

interface AuthGuardProps {
  children: React.ReactNode;
}

export const AuthGuard: React.FC<AuthGuardProps> = ({ children }) => {
  const { isAuthenticated, isLoading } = useFlowAuth();

  if (isLoading) {
    return (
      <LoadingOverlay className="min-h-screen bg-cosmiq-elements-background-depth-1">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center animate-pulse">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-8 h-8 text-white">
              <path d="M12 2L2 7v10c0 5.55 3.84 9.95 9 11 5.16-1.05 9-5.45 9-11V7l-10-5z" />
              <path d="M8 12l2 2 4-4" />
            </svg>
          </div>
          <p className="text-cosmiq-elements-textSecondary">Checking wallet connection...</p>
        </div>
      </LoadingOverlay>
    );
  }

  if (!isAuthenticated) {
    return <WalletLogin />;
  }

  return <>{children}</>;
};
