import { useContractAddress as useCtx } from '~/components/flow/ContractProvider';

/**
 * Provides quick access to the currently injected Flow contract address.
 * Returns `null` until the address is available.
 */
export const useContractAddress = () => {
  const { contractAddress } = useCtx();
  return contractAddress;
};
