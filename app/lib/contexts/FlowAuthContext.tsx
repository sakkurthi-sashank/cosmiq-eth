import React, { createContext, useContext, useEffect, useState } from 'react';
import { fcl } from '../flow-config';
import type { CurrentUser } from '@onflow/typedefs';

interface FlowAuthContextType {
  user: CurrentUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: () => Promise<void>;
  logout: () => Promise<void>;
  error: string | null;
}

const FlowAuthContext = createContext<FlowAuthContextType | undefined>(undefined);

export const useFlowAuth = () => {
  const context = useContext(FlowAuthContext);

  if (context === undefined) {
    throw new Error('useFlowAuth must be used within a FlowAuthProvider');
  }

  return context;
};

interface FlowAuthProviderProps {
  children: React.ReactNode;
}

export const FlowAuthProvider: React.FC<FlowAuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<CurrentUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Subscribe to authentication state changes
    const unsubscribe = fcl.currentUser.subscribe((user: CurrentUser) => {
      setUser(user);
      setIsLoading(false);

      if (user.loggedIn) {
        console.log('🔐 Flow User Authenticated:', {
          addr: user.addr,
          cid: user.cid,
          f_type: user.f_type,
          f_vsn: user.f_vsn,
          services: user.services,
          loggedIn: user.loggedIn,
        });

        // Log public address
        if (user.addr) {
          console.log('📍 Flow Public Address:', user.addr);
        }

        /*
         * Note: Private keys are never exposed for security reasons
         * Flow wallets maintain custody of private keys
         */
        console.log('🔒 Private Key: Not available (secured by wallet)');

        setError(null);
      } else {
        console.log('🚪 Flow User Logged Out');
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const login = async () => {
    try {
      setError(null);
      setIsLoading(true);
      console.log('🔄 Initiating Flow wallet connection...');

      await fcl.authenticate();

      console.log('✅ Flow wallet connection successful!');
    } catch (error) {
      console.error('❌ Flow authentication error:', error);
      setError(error instanceof Error ? error.message : 'Authentication failed');
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      setError(null);
      console.log('🔄 Logging out from Flow wallet...');

      await fcl.unauthenticate();

      console.log('✅ Flow wallet logout successful!');
    } catch (error) {
      console.error('❌ Flow logout error:', error);
      setError(error instanceof Error ? error.message : 'Logout failed');
    }
  };

  const value: FlowAuthContextType = {
    user,
    isAuthenticated: user?.loggedIn ?? false,
    isLoading,
    login,
    logout,
    error,
  };

  return <FlowAuthContext.Provider value={value}>{children}</FlowAuthContext.Provider>;
};
