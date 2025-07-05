import React, { useState } from 'react';
import { useFlowAuth } from '../../lib/contexts/FlowAuthContext';
import { Button } from '../ui/Button';
import Popover from '../ui/Popover';

export const FlowAuthHeader: React.FC = () => {
  const { user, logout, isLoading } = useFlowAuth();
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);

  if (!user?.addr) {
    return null;
  }

  const truncatedAddress = `${user.addr.slice(0, 6)}...${user.addr.slice(-4)}`;

  const handleLogout = async () => {
    await logout();
    setIsPopoverOpen(false);
  };

  return (
    <div className="flex items-center space-x-2">
      <Popover
        open={isPopoverOpen}
        onOpenChange={setIsPopoverOpen}
        trigger={
          <Button variant="outline" size="sm" className="flex items-center space-x-2 text-sm">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span>{truncatedAddress}</span>
          </Button>
        }
      >
        <div className="w-72 p-4 space-y-4">
          <div className="border-b border-cosmiq-elements-borderColor pb-4">
            <h3 className="font-medium text-cosmiq-elements-textPrimary mb-2">Flow Wallet Connected</h3>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm text-cosmiq-elements-textSecondary">Address:</span>
                <code className="text-sm bg-cosmiq-elements-background-depth-2 px-2 py-1 rounded">
                  {truncatedAddress}
                </code>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-cosmiq-elements-textSecondary">Network:</span>
                <span className="text-sm text-cosmiq-elements-textPrimary">Flow Testnet</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-cosmiq-elements-textSecondary">Status:</span>
                <span className="text-sm text-green-500 flex items-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-1"></div>
                  Connected
                </span>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Button
              onClick={() => {
                navigator.clipboard.writeText(user.addr);
                // Could add a toast notification here
              }}
              variant="outline"
              size="sm"
              className="w-full"
            >
              Copy Address
            </Button>

            <Button
              onClick={handleLogout}
              variant="outline"
              size="sm"
              className="w-full text-red-500 hover:text-red-600 hover:border-red-500"
              disabled={isLoading}
            >
              {isLoading ? 'Disconnecting...' : 'Disconnect Wallet'}
            </Button>
          </div>
        </div>
      </Popover>
    </div>
  );
};
