import React, { useState, useEffect } from 'react';
import { useFlowAuth } from '../../lib/contexts/FlowAuthContext';
import { fcl } from '../../lib/flow-config';
import { Button } from '../ui/Button';
import { LoadingDots } from '../ui/LoadingDots';

interface TransactionStatus {
  status: number;
  statusString: string;
  errorMessage?: string;
}

interface DeploymentResult {
  transactionId: string;
  status: TransactionStatus;
  events?: any[];
  logs?: string[];
}

export const ContractDeployment: React.FC = () => {
  const { user, isAuthenticated } = useFlowAuth();
  const [isDeploying, setIsDeploying] = useState(false);
  const [deploymentResult, setDeploymentResult] = useState<DeploymentResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [contractCode, setContractCode] = useState<string>('');

  // Load the contract code
  useEffect(() => {
    const loadContractCode = async () => {
      try {
        // In a real app, you'd load this from a file or API
        // For now, we'll embed the contract code
        const code = `
// HelloWorld.cdc - A simple Hello World smart contract for Flow blockchain
access(all) contract HelloWorld {

    // Public variable to store the greeting message
    access(all) var greeting: String

    // Event that gets emitted when the contract is deployed
    access(all) event ContractDeployed(message: String)

    // Event that gets emitted when greeting is updated
    access(all) event GreetingUpdated(newGreeting: String)

    // Event that gets emitted when hello function is called
    access(all) event HelloCalled(message: String)

    // Initialize the contract with a default greeting
    init() {
        self.greeting = "Hello, World from Flow Blockchain!"

        // Emit deployment event
        emit ContractDeployed(message: "HelloWorld contract successfully deployed!")

        // Log to console (this will appear in transaction logs)
        log("🎉 HelloWorld contract deployed successfully!")
        log("📝 Initial greeting: ".concat(self.greeting))
    }

    // Public function to get the current greeting
    access(all) view fun getGreeting(): String {
        return self.greeting
    }

    // Public function to say hello and log the message
    access(all) fun sayHello(): String {
        let message = "Hello from Flow! Current greeting: ".concat(self.greeting)

        // Emit event
        emit HelloCalled(message: message)

        // Log to console
        log("👋 Hello function called!")
        log("💬 Message: ".concat(message))

        return message
    }

    // Function to update the greeting message
    access(all) fun updateGreeting(newGreeting: String) {
        let oldGreeting = self.greeting
        self.greeting = newGreeting

        // Emit event
        emit GreetingUpdated(newGreeting: newGreeting)

        // Log to console
        log("🔄 Greeting updated!")
        log("📝 Old greeting: ".concat(oldGreeting))
        log("📝 New greeting: ".concat(newGreeting))
    }

    // Function to get contract info
    access(all) view fun getContractInfo(): {String: String} {
        return {
            "name": "HelloWorld",
            "description": "A simple Hello World smart contract for Flow blockchain",
            "version": "1.0.0",
            "greeting": self.greeting
        }
    }
}`;
        setContractCode(code);
      } catch (err) {
        console.error('Error loading contract code:', err);
        setError('Failed to load contract code');
      }
    };

    loadContractCode();
  }, []);

  const deployContract = async () => {
    if (!isAuthenticated || !user?.addr) {
      setError('Please connect your wallet first');
      return;
    }

    setIsDeploying(true);
    setError(null);
    setDeploymentResult(null);

    try {
      console.log('🚀 Starting contract deployment...');

      // Convert contract code to hex
      const codeHex = Buffer.from(contractCode.trim(), 'utf8').toString('hex');

      // Create deployment transaction
      const deploymentTransaction = `
        transaction(code: String) {
          prepare(signer: auth(AddContract) &Account) {
            // Deploy the contract
            signer.contracts.add(
              name: "HelloWorld",
              code: code.decodeHex()
            )
          }
        }
      `;

      console.log('📝 Sending deployment transaction...');

      // Send the transaction
      const transactionId = await fcl.mutate({
        cadence: deploymentTransaction,
        args: (arg: any, t: any) => [arg(codeHex, t.String)],
        payer: fcl.authz,
        proposer: fcl.authz,
        authorizations: [fcl.authz],
        limit: 1000,
      });

      console.log('📋 Transaction ID:', transactionId);

      // Subscribe to transaction status
      const unsub = fcl.tx(transactionId).subscribe((txStatus: any) => {
        console.log('📊 Transaction Status:', txStatus);

        const result: DeploymentResult = {
          transactionId,
          status: {
            status: txStatus.status,
            statusString: txStatus.statusString || getStatusString(txStatus.status),
            errorMessage: txStatus.errorMessage,
          },
          events: txStatus.events || [],
          logs: txStatus.logs || [],
        };

        setDeploymentResult(result);

        // Check for completion
        if (txStatus.status === 4) {
          // SEALED
          console.log('✅ Contract deployment completed successfully!');
          console.log('📋 Final transaction result:', txStatus);

          // Log events
          if (txStatus.events && txStatus.events.length > 0) {
            console.log('📢 Events emitted:');
            txStatus.events.forEach((event: any, index: number) => {
              console.log(`  ${index + 1}. ${event.type}:`, event.data);
            });
          }

          // Log any console messages from the contract
          if (txStatus.logs && txStatus.logs.length > 0) {
            console.log('📝 Contract logs:');
            txStatus.logs.forEach((log: string, index: number) => {
              console.log(`  ${index + 1}. ${log}`);
            });
          }

          unsub();
          setIsDeploying(false);
        } else if (txStatus.status === 5) {
          // EXPIRED
          console.error('❌ Transaction expired');
          setError('Transaction expired');
          unsub();
          setIsDeploying(false);
        } else if (txStatus.errorMessage) {
          console.error('❌ Transaction failed:', txStatus.errorMessage);
          setError(txStatus.errorMessage);
          unsub();
          setIsDeploying(false);
        }
      });
    } catch (err: any) {
      console.error('❌ Contract deployment failed:', err);
      setError(err.message || 'Contract deployment failed');
      setIsDeploying(false);
    }
  };

  const getStatusString = (status: number): string => {
    switch (status) {
      case 0:
        return 'UNKNOWN';
      case 1:
        return 'PENDING';
      case 2:
        return 'FINALIZED';
      case 3:
        return 'EXECUTED';
      case 4:
        return 'SEALED';
      case 5:
        return 'EXPIRED';
      default:
        return 'UNKNOWN';
    }
  };

  const getStatusColor = (status: number): string => {
    switch (status) {
      case 1:
        return 'text-yellow-500';
      case 2:
        return 'text-blue-500';
      case 3:
        return 'text-green-500';
      case 4:
        return 'text-green-600';
      case 5:
        return 'text-red-500';
      default:
        return 'text-gray-500';
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="bg-cosmiq-elements-background-depth-2 rounded-lg p-6">
        <h2 className="text-2xl font-bold text-cosmiq-elements-textPrimary mb-4">🚀 Smart Contract Deployment</h2>

        <div className="space-y-4">
          <div className="bg-cosmiq-elements-background-depth-3 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-cosmiq-elements-textPrimary mb-2">HelloWorld Contract</h3>
            <p className="text-cosmiq-elements-textSecondary mb-4">
              Deploy a simple Hello World smart contract to the Flow blockchain. This contract will log messages to the
              console when deployed and executed.
            </p>

            {isAuthenticated ? (
              <div className="space-y-3">
                <div className="text-sm text-cosmiq-elements-textSecondary">
                  <strong>Connected Account:</strong> {user?.addr}
                </div>

                <Button
                  onClick={deployContract}
                  disabled={isDeploying}
                  className="bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:hover:scale-100"
                >
                  {isDeploying ? (
                    <div className="flex items-center space-x-2">
                      <LoadingDots />
                      <span>Deploying Contract...</span>
                    </div>
                  ) : (
                    '🚀 Deploy HelloWorld Contract'
                  )}
                </Button>
              </div>
            ) : (
              <div className="text-cosmiq-elements-textSecondary">
                Please connect your Flow wallet to deploy the contract.
              </div>
            )}
          </div>

          {/* Error Display */}
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 text-red-400">
              <p className="font-medium">Deployment Failed</p>
              <p className="text-sm mt-1">{error}</p>
            </div>
          )}

          {/* Deployment Result */}
          {deploymentResult && (
            <div className="bg-cosmiq-elements-background-depth-3 rounded-lg p-4 space-y-3">
              <h3 className="text-lg font-semibold text-cosmiq-elements-textPrimary">📊 Deployment Status</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-cosmiq-elements-textSecondary">Transaction ID:</p>
                  <p className="font-mono text-xs text-cosmiq-elements-textPrimary break-all">
                    {deploymentResult.transactionId}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-cosmiq-elements-textSecondary">Status:</p>
                  <p className={`font-semibold ${getStatusColor(deploymentResult.status.status)}`}>
                    {deploymentResult.status.statusString} ({deploymentResult.status.status})
                  </p>
                </div>
              </div>

              {deploymentResult.status.status === 4 && (
                <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-3">
                  <p className="text-green-400 font-medium">✅ Contract Deployed Successfully!</p>
                  <p className="text-green-300 text-sm mt-1">Check the browser console for detailed logs and events.</p>
                </div>
              )}

              {deploymentResult.events && deploymentResult.events.length > 0 && (
                <div>
                  <p className="text-sm text-cosmiq-elements-textSecondary mb-2">Events:</p>
                  <div className="bg-cosmiq-elements-background-depth-4 rounded p-3 max-h-32 overflow-y-auto">
                    {deploymentResult.events.map((event, index) => (
                      <div key={index} className="text-xs text-cosmiq-elements-textSecondary mb-1">
                        <span className="text-cosmiq-elements-textPrimary">{event.type}:</span>
                        <span className="ml-2">{JSON.stringify(event.data)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Contract Code Preview */}
          <div className="bg-cosmiq-elements-background-depth-3 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-cosmiq-elements-textPrimary mb-3">📝 Contract Code Preview</h3>
            <div className="bg-cosmiq-elements-background-depth-4 rounded p-3 max-h-64 overflow-y-auto">
              <pre className="text-xs text-cosmiq-elements-textSecondary whitespace-pre-wrap">{contractCode}</pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
