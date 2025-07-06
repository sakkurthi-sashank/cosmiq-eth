import React, { createContext, useContext, useEffect, useState } from 'react';

interface ContractContextValue {
  contractAddress: string | null;
  setContractAddress: (addr: string) => void;
  clearContractAddress: () => void;
}

const ContractContext = createContext<ContractContextValue | undefined>(undefined);

export const ContractProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [contractAddress, setContractAddressState] = useState<string | null>(null);
  const DEFAULT_FALLBACK_ADDRESS = '0xafed809ec4e02497';

  // Helper functions
  const setContractAddress = (addr: string) => {
    setContractAddressState(addr);
    try {
      localStorage.setItem('flow_contract_address', addr);
    } catch {
      /* ignore */
    }
  };

  const clearContractAddress = () => {
    setContractAddressState(null);
    try {
      localStorage.removeItem('flow_contract_address');
    } catch {
      /* ignore */
    }
  };

  // Load on mount
  useEffect(() => {
    try {
      // Preferred: explicit flow_contract_address key
      const saved = localStorage.getItem('flow_contract_address');
      if (saved) {
        setContractAddressState(saved);
        return;
      }

      // Fallback: look for any contract_deployed_* key set to 'true'
      const deployedKey = Object.keys(localStorage).find(
        (k) => k.startsWith('contract_deployed_') && localStorage.getItem(k) === 'true',
      );
      if (deployedKey) {
        const parts = deployedKey.split('_');
        const possibleAddr = parts[parts.length - 1];
        if (possibleAddr?.startsWith('0x')) {
          setContractAddressState(possibleAddr);
          return;
        }
      }

      // Ultimate fallback to shared default
      setContractAddressState(DEFAULT_FALLBACK_ADDRESS);
    } catch {
      setContractAddressState(DEFAULT_FALLBACK_ADDRESS);
    }
  }, []);

  // Listen for broadcasts
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data?.type === 'CONTRACT_ADDRESS_INJECTION' && event.data.address) {
        setContractAddress(event.data.address);
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  const value: ContractContextValue = {
    contractAddress,
    setContractAddress,
    clearContractAddress,
  };

  return <ContractContext.Provider value={value}>{children}</ContractContext.Provider>;
};

export const useContractAddress = (): ContractContextValue => {
  const ctx = useContext(ContractContext);
  if (!ctx) throw new Error('useContractAddress must be used within a ContractProvider');
  return ctx;
};
