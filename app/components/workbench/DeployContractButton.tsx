import React, { useState, useMemo } from 'react';
import { useStore } from '@nanostores/react';
import { useFlowAuth } from '../../lib/contexts/FlowAuthContext';
import { workbenchStore } from '../../lib/stores/workbench';
import { getCadenceFiles } from '../../utils/getLanguageFromExtension';
import { Button } from '../ui/Button';
import { LoadingDots } from '../ui/LoadingDots';
import { fcl } from '../../lib/flow-config';

interface DeployContractButtonProps {
  className?: string;
}

export const DeployContractButton: React.FC<DeployContractButtonProps> = ({ className }) => {
  const { user, isAuthenticated } = useFlowAuth();
  const files = useStore(workbenchStore.files);
  const [isDeploying, setIsDeploying] = useState(false);
  const [deploymentStatus, setDeploymentStatus] = useState<'idle' | 'deploying' | 'success' | 'error'>('idle');
  const [deploymentMessage, setDeploymentMessage] = useState<string>('');
  const [deployedAddress, setDeployedAddress] = useState<string>('');

  // Detect Cadence smart contract files
  const cadenceFiles = useMemo(() => {
    return getCadenceFiles(files);
  }, [files]);

  // Don't show the button if no Cadence files are present
  if (cadenceFiles.length === 0 || !isAuthenticated) {
    return null;
  }

  // Function to extract contract name from Cadence code
  const extractContractName = (contractCode: string): string => {
    // Match contract declaration: access(all) contract ContractName {
    const contractMatch = contractCode.match(/access\(all\)\s+contract\s+(\w+)/);
    if (contractMatch && contractMatch[1]) {
      return contractMatch[1];
    }

    // Fallback: try to match just "contract ContractName"
    const fallbackMatch = contractCode.match(/contract\s+(\w+)/);
    if (fallbackMatch && fallbackMatch[1]) {
      return fallbackMatch[1];
    }

    // Default fallback name
    return 'DeployedContract';
  };

  const handleDeploy = async () => {
    if (!user?.addr) {
      setDeploymentMessage('Please connect your Flow wallet first');
      setDeploymentStatus('error');
      return;
    }

    setIsDeploying(true);
    setDeploymentStatus('deploying');
    setDeploymentMessage('Preparing smart contract deployment...');

    try {
      // Log deployment initiation
      console.log('🚀 Initiating smart contract deployment...');
      console.log('📄 Cadence files found:', cadenceFiles);
      console.log('👤 Deploying with account:', user.addr);

      // Get the first Cadence file content for deployment
      const primaryContract = cadenceFiles[0];
      const contractFile = files[primaryContract];

      if (!contractFile || contractFile.type !== 'file') {
        throw new Error('Contract file not found');
      }

      setDeploymentMessage('Reading smart contract code...');

      // Extract the actual contract name from the code
      const contractName = extractContractName(contractFile.content);
      console.log('📝 Extracted contract name:', contractName);

      // Log contract content for verification
      console.log('📜 Contract code:', contractFile.content);

      setDeploymentMessage(`Deploying ${contractName} to Flow Testnet...`);

      // Phase 2: Deployment Execution via Parent App
      // This simulates the parent app deployment process
      const deploymentTransaction = `
        transaction(name: String, code: String) {
          prepare(signer: auth(Contracts) &Account) {
            signer.contracts.add(name: name, code: code.utf8)
          }
        }
      `;

      const transactionId = await fcl.mutate({
        cadence: deploymentTransaction,
        args: (arg, t) => [arg(contractName, t.String), arg(contractFile.content, t.String)],
        proposer: fcl.currentUser,
        payer: fcl.currentUser,
        authorizations: [fcl.currentUser],
        limit: 1000,
      });

      console.log('📋 Transaction ID:', transactionId);
      setDeploymentMessage('Transaction submitted, waiting for confirmation...');

      // Wait for transaction to be sealed
      const sealedTransaction = await fcl.tx(transactionId).onceSealed();
      console.log('✅ Transaction sealed:', sealedTransaction);

      // Phase 3: Address Propagation & Integration
      // Capture the deployed contract address
      const contractAddress = user.addr; // In Flow, contracts are deployed to the user's account
      setDeployedAddress(contractAddress);

      console.log('🎯 Contract deployed at address:', contractAddress);
      console.log('📄 Contract name:', contractName);
      console.log('🔗 Address ready for injection into frontend components');

      setDeploymentStatus('success');
      setDeploymentMessage(`${contractName} successfully deployed to ${contractAddress}`);

      // Here's where the address would be automatically injected into frontend components
      // This is handled by the parent CosmIQ app according to the three-phase workflow
      console.log('🔄 Phase 3: Address propagation initiated');
      console.log('💉 Ready to inject address into contract interaction components');
    } catch (error) {
      console.error('❌ Deployment failed:', error);
      setDeploymentStatus('error');
      setDeploymentMessage(error instanceof Error ? error.message : 'Deployment failed');
    } finally {
      setIsDeploying(false);
    }
  };

  const getStatusColor = () => {
    switch (deploymentStatus) {
      case 'deploying':
        return 'from-blue-500 to-purple-600';
      case 'success':
        return 'from-green-500 to-emerald-600';
      case 'error':
        return 'from-red-500 to-pink-600';
      default:
        return 'from-blue-500 to-purple-600';
    }
  };

  const getStatusIcon = () => {
    switch (deploymentStatus) {
      case 'deploying':
        return <LoadingDots text="Deploying" />;
      case 'success':
        return '✅';
      case 'error':
        return '❌';
      default:
        return '🚀';
    }
  };

  return (
    <div
      className={`bg-cosmiq-elements-background-depth-2 border-b border-cosmiq-elements-borderColor p-4 ${className}`}
    >
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <div className="flex items-center space-x-3">
            <div className="text-2xl">{getStatusIcon()}</div>
            <div>
              <h3 className="text-lg font-semibold text-cosmiq-elements-textPrimary">Smart Contract Deployment</h3>
              <p className="text-sm text-cosmiq-elements-textSecondary">
                {cadenceFiles.length} Cadence contract{cadenceFiles.length > 1 ? 's' : ''} detected
              </p>
              {deploymentMessage && (
                <p
                  className={`text-sm mt-1 ${
                    deploymentStatus === 'error'
                      ? 'text-red-400'
                      : deploymentStatus === 'success'
                        ? 'text-green-400'
                        : 'text-cosmiq-elements-textSecondary'
                  }`}
                >
                  {deploymentMessage}
                </p>
              )}
              {deployedAddress && (
                <p className="text-xs text-cosmiq-elements-textTertiary mt-1">
                  Deployed to:{' '}
                  <code className="bg-cosmiq-elements-background-depth-3 px-2 py-1 rounded">{deployedAddress}</code>
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          {deploymentStatus === 'success' && (
            <div className="text-sm text-green-400 bg-green-500/10 px-3 py-1 rounded-full">Deployed ✓</div>
          )}

          <Button
            onClick={handleDeploy}
            disabled={isDeploying || deploymentStatus === 'success'}
            className={`bg-gradient-to-r ${getStatusColor()} hover:opacity-90 text-white font-semibold px-6 py-2 rounded-lg transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:hover:scale-100`}
          >
            {isDeploying ? 'Deploying...' : deploymentStatus === 'success' ? 'Deployed' : 'Deploy Contract'}
          </Button>
        </div>
      </div>

      {/* Contract Files List */}
      {cadenceFiles.length > 0 && (
        <div className="mt-3 pt-3 border-t border-cosmiq-elements-borderColor/50">
          <div className="flex flex-wrap gap-2">
            {cadenceFiles.map((filePath) => (
              <div
                key={filePath}
                className="text-xs bg-cosmiq-elements-background-depth-3 text-cosmiq-elements-textSecondary px-2 py-1 rounded"
              >
                {filePath.split('/').pop()}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
