import React, { useState } from 'react';
import { useFlowAuth } from '../../lib/contexts/FlowAuthContext';
import { fcl } from '../../lib/flow-config';
import { Button } from '../ui/Button';
import { LoadingDots } from '../ui/LoadingDots';

interface ContractData {
  greeting?: string;
  contractInfo?: Record<string, string>;
}

export const ContractInteraction: React.FC = () => {
  const { user, isAuthenticated } = useFlowAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [contractData, setContractData] = useState<ContractData>({});
  const [error, setError] = useState<string | null>(null);
  const [newGreeting, setNewGreeting] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  const [isCalling, setIsCalling] = useState(false);

  // Read the current greeting from the contract
  const readGreeting = async () => {
    if (!isAuthenticated || !user?.addr) {
      setError('Please connect your wallet first');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      console.log('📖 Reading greeting from contract...');

      const script = `
        import HelloWorld from ${user.addr}

        access(all) fun main(): String {
          return HelloWorld.getGreeting()
        }
      `;

      const greeting = await fcl.query({
        cadence: script,
        args: [],
      });

      console.log('📝 Current greeting:', greeting);
      setContractData((prev) => ({ ...prev, greeting }));
    } catch (err: any) {
      console.error('❌ Failed to read greeting:', err);
      setError(err.message || 'Failed to read greeting');
    } finally {
      setIsLoading(false);
    }
  };

  // Read contract info
  const readContractInfo = async () => {
    if (!isAuthenticated || !user?.addr) {
      setError('Please connect your wallet first');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      console.log('📖 Reading contract info...');

      const script = `
        import HelloWorld from ${user.addr}

        access(all) fun main(): {String: String} {
          return HelloWorld.getContractInfo()
        }
      `;

      const contractInfo = await fcl.query({
        cadence: script,
        args: [],
      });

      console.log('📋 Contract info:', contractInfo);
      setContractData((prev) => ({ ...prev, contractInfo }));
    } catch (err: any) {
      console.error('❌ Failed to read contract info:', err);
      setError(err.message || 'Failed to read contract info');
    } finally {
      setIsLoading(false);
    }
  };

  // Call the sayHello function
  const callSayHello = async () => {
    if (!isAuthenticated || !user?.addr) {
      setError('Please connect your wallet first');
      return;
    }

    setIsCalling(true);
    setError(null);

    try {
      console.log('👋 Calling sayHello function...');

      const transaction = `
        import HelloWorld from ${user.addr}

        transaction() {
          prepare(signer: &Account) {
            // No preparation needed
          }

          execute {
            let message = HelloWorld.sayHello()
            log("📢 Message from contract: ".concat(message))
          }
        }
      `;

      const transactionId = await fcl.mutate({
        cadence: transaction,
        args: [],
        payer: fcl.authz,
        proposer: fcl.authz,
        authorizations: [fcl.authz],
        limit: 100,
      });

      console.log('📋 Transaction ID:', transactionId);

      // Subscribe to transaction status
      const unsub = fcl.tx(transactionId).subscribe((txStatus: any) => {
        console.log('📊 Transaction Status:', txStatus);

        if (txStatus.status === 4) {
          // SEALED
          console.log('✅ sayHello called successfully!');
          console.log('📋 Final transaction result:', txStatus);

          // Log events
          if (txStatus.events && txStatus.events.length > 0) {
            console.log('📢 Events emitted:');
            txStatus.events.forEach((event: any, index: number) => {
              console.log(`  ${index + 1}. ${event.type}:`, event.data);
            });
          }

          unsub();
          setIsCalling(false);
        } else if (txStatus.status === 5) {
          // EXPIRED
          console.error('❌ Transaction expired');
          setError('Transaction expired');
          unsub();
          setIsCalling(false);
        } else if (txStatus.errorMessage) {
          console.error('❌ Transaction failed:', txStatus.errorMessage);
          setError(txStatus.errorMessage);
          unsub();
          setIsCalling(false);
        }
      });
    } catch (err: any) {
      console.error('❌ sayHello call failed:', err);
      setError(err.message || 'sayHello call failed');
      setIsCalling(false);
    }
  };

  // Update the greeting
  const updateGreeting = async () => {
    if (!isAuthenticated || !user?.addr) {
      setError('Please connect your wallet first');
      return;
    }

    if (!newGreeting.trim()) {
      setError('Please enter a new greeting');
      return;
    }

    setIsUpdating(true);
    setError(null);

    try {
      console.log('🔄 Updating greeting to:', newGreeting);

      const transaction = `
        import HelloWorld from ${user.addr}

        transaction(newGreeting: String) {
          prepare(signer: &Account) {
            // No preparation needed
          }

          execute {
            HelloWorld.updateGreeting(newGreeting: newGreeting)
            log("🔄 Greeting updated to: ".concat(newGreeting))
          }
        }
      `;

      const transactionId = await fcl.mutate({
        cadence: transaction,
        args: (arg: any, t: any) => [arg(newGreeting, t.String)],
        payer: fcl.authz,
        proposer: fcl.authz,
        authorizations: [fcl.authz],
        limit: 100,
      });

      console.log('📋 Transaction ID:', transactionId);

      // Subscribe to transaction status
      const unsub = fcl.tx(transactionId).subscribe((txStatus: any) => {
        console.log('📊 Transaction Status:', txStatus);

        if (txStatus.status === 4) {
          // SEALED
          console.log('✅ Greeting updated successfully!');
          console.log('📋 Final transaction result:', txStatus);

          // Log events
          if (txStatus.events && txStatus.events.length > 0) {
            console.log('📢 Events emitted:');
            txStatus.events.forEach((event: any, index: number) => {
              console.log(`  ${index + 1}. ${event.type}:`, event.data);
            });
          }

          // Clear the input and refresh the greeting
          setNewGreeting('');
          readGreeting();

          unsub();
          setIsUpdating(false);
        } else if (txStatus.status === 5) {
          // EXPIRED
          console.error('❌ Transaction expired');
          setError('Transaction expired');
          unsub();
          setIsUpdating(false);
        } else if (txStatus.errorMessage) {
          console.error('❌ Transaction failed:', txStatus.errorMessage);
          setError(txStatus.errorMessage);
          unsub();
          setIsUpdating(false);
        }
      });
    } catch (err: any) {
      console.error('❌ Update greeting failed:', err);
      setError(err.message || 'Update greeting failed');
      setIsUpdating(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="bg-bolt-elements-background-depth-2 rounded-lg p-6">
        <h2 className="text-2xl font-bold text-bolt-elements-textPrimary mb-4">🔗 Contract Interaction</h2>

        {isAuthenticated ? (
          <div className="space-y-6">
            <div className="text-sm text-bolt-elements-textSecondary mb-4">
              <strong>Connected Account:</strong> {user?.addr}
            </div>

            {/* Read Operations */}
            <div className="bg-bolt-elements-background-depth-3 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-bolt-elements-textPrimary mb-3">📖 Read Contract Data</h3>

              <div className="space-y-3">
                <div className="flex space-x-3">
                  <Button
                    onClick={readGreeting}
                    disabled={isLoading}
                    className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-200"
                  >
                    {isLoading ? <LoadingDots /> : '📝 Get Greeting'}
                  </Button>

                  <Button
                    onClick={readContractInfo}
                    disabled={isLoading}
                    className="bg-purple-500 hover:bg-purple-600 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-200"
                  >
                    {isLoading ? <LoadingDots /> : '📋 Get Contract Info'}
                  </Button>
                </div>

                {contractData.greeting && (
                  <div className="bg-bolt-elements-background-depth-4 rounded p-3">
                    <p className="text-sm text-bolt-elements-textSecondary">Current Greeting:</p>
                    <p className="text-bolt-elements-textPrimary font-medium">{contractData.greeting}</p>
                  </div>
                )}

                {contractData.contractInfo && (
                  <div className="bg-bolt-elements-background-depth-4 rounded p-3">
                    <p className="text-sm text-bolt-elements-textSecondary mb-2">Contract Info:</p>
                    <div className="space-y-1">
                      {Object.entries(contractData.contractInfo).map(([key, value]) => (
                        <div key={key} className="flex justify-between">
                          <span className="text-bolt-elements-textSecondary text-sm">{key}:</span>
                          <span className="text-bolt-elements-textPrimary text-sm">{value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Write Operations */}
            <div className="bg-bolt-elements-background-depth-3 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-bolt-elements-textPrimary mb-3">✍️ Write Contract Data</h3>

              <div className="space-y-4">
                <div>
                  <Button
                    onClick={callSayHello}
                    disabled={isCalling}
                    className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-200"
                  >
                    {isCalling ? (
                      <div className="flex items-center space-x-2">
                        <LoadingDots />
                        <span>Calling...</span>
                      </div>
                    ) : (
                      '👋 Say Hello'
                    )}
                  </Button>
                  <p className="text-xs text-bolt-elements-textSecondary mt-1">
                    Calls the sayHello function and logs the message
                  </p>
                </div>

                <div>
                  <div className="flex space-x-3 mb-2">
                    <input
                      type="text"
                      value={newGreeting}
                      onChange={(e) => setNewGreeting(e.target.value)}
                      placeholder="Enter new greeting..."
                      className="flex-1 px-3 py-2 bg-bolt-elements-background-depth-4 border border-bolt-elements-borderColor rounded-lg text-bolt-elements-textPrimary placeholder-bolt-elements-textSecondary focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <Button
                      onClick={updateGreeting}
                      disabled={isUpdating || !newGreeting.trim()}
                      className="bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-200 disabled:opacity-50"
                    >
                      {isUpdating ? (
                        <div className="flex items-center space-x-2">
                          <LoadingDots />
                          <span>Updating...</span>
                        </div>
                      ) : (
                        '🔄 Update Greeting'
                      )}
                    </Button>
                  </div>
                  <p className="text-xs text-bolt-elements-textSecondary">
                    Updates the greeting message in the contract
                  </p>
                </div>
              </div>
            </div>

            {/* Error Display */}
            {error && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 text-red-400">
                <p className="font-medium">Error</p>
                <p className="text-sm mt-1">{error}</p>
              </div>
            )}

            {/* Instructions */}
            <div className="bg-bolt-elements-background-depth-3 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-bolt-elements-textPrimary mb-3">📚 Instructions</h3>
              <div className="space-y-2 text-sm text-bolt-elements-textSecondary">
                <p>1. First, deploy the HelloWorld contract using the deployment section above</p>
                <p>2. Use "Get Greeting" to read the current greeting from the contract</p>
                <p>3. Use "Say Hello" to call the contract function and see console logs</p>
                <p>4. Use "Update Greeting" to change the greeting message</p>
                <p>5. Check the browser console for detailed transaction logs and events</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-bolt-elements-textSecondary">
            Please connect your Flow wallet to interact with the contract.
          </div>
        )}
      </div>
    </div>
  );
};
