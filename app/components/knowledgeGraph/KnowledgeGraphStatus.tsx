import React, { useState, useEffect } from 'react';
import { useFlowAuth } from '../../lib/contexts/FlowAuthContext';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { Tooltip } from '../ui/Tooltip';

interface KnowledgeGraphData {
  knowledgeGraphId: string;
  ipfsCid: string;
  publishedAt: string;
}

interface KnowledgeGraphStatusProps {
  chatId: string;
  className?: string;
}

export const KnowledgeGraphStatus: React.FC<KnowledgeGraphStatusProps> = ({ chatId, className = '' }) => {
  const { user, isAuthenticated } = useFlowAuth();
  const [kgData, setKgData] = useState<KnowledgeGraphData | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    if (!user?.addr || !isAuthenticated || !chatId) {
      console.log('🔍 KnowledgeGraphStatus: Missing requirements', {
        userAddr: user?.addr,
        isAuthenticated,
        chatId,
      });
      setKgData(null);
      return;
    }

    // Check if this dapp has been published to Knowledge Graph
    const storageKey = `kg_${chatId}_${user.addr}`;
    const storedData = localStorage.getItem(storageKey);

    console.log('🔍 KnowledgeGraphStatus: Checking for data', {
      storageKey,
      hasData: !!storedData,
    });

    if (storedData) {
      try {
        const parsed = JSON.parse(storedData);
        setKgData(parsed);
        console.log('✅ KnowledgeGraphStatus: Found published metadata', {
          knowledgeGraphId: parsed.knowledgeGraphId,
          publishedAt: parsed.publishedAt,
        });
      } catch (error) {
        console.warn('❌ KnowledgeGraphStatus: Failed to parse Knowledge Graph data:', error);
        setKgData(null);
      }
    } else {
      setKgData(null);
      console.log('📭 KnowledgeGraphStatus: No published metadata found for this chat');
    }
  }, [user?.addr, isAuthenticated, chatId]);

  if (!isAuthenticated || !kgData) {
    return null;
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    // Could add a toast notification here
  };

  return (
    <Card className={`border-green-500/20 bg-green-500/5 ${className}`}>
      <div className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
            <h3 className="font-semibold text-green-700 dark:text-green-300">🌐 Published to Knowledge Graph</h3>
            <Badge variant="success" className="text-xs">
              The Graph
            </Badge>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300"
          >
            {isExpanded ? '▼' : '▶'}
          </Button>
        </div>

        <p className="text-sm text-green-600 dark:text-green-400 mb-3">
          This dapp's metadata has been published to The Graph's decentralized Knowledge Graph, making it discoverable
          and composable with other applications.
        </p>

        {isExpanded && (
          <div className="space-y-3 border-t border-green-500/20 pt-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-medium text-green-700 dark:text-green-300 uppercase tracking-wide">
                  Knowledge Graph ID
                </label>
                <div className="flex items-center space-x-2 mt-1">
                  <code className="text-xs bg-green-100 dark:bg-green-900/50 px-2 py-1 rounded flex-1 truncate">
                    {kgData.knowledgeGraphId}
                  </code>
                  <Tooltip content="Copy ID">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyToClipboard(kgData.knowledgeGraphId)}
                      className="text-green-600 hover:text-green-700 p-1"
                    >
                      📋
                    </Button>
                  </Tooltip>
                </div>
              </div>

              <div>
                <label className="text-xs font-medium text-green-700 dark:text-green-300 uppercase tracking-wide">
                  IPFS CID
                </label>
                <div className="flex items-center space-x-2 mt-1">
                  <code className="text-xs bg-green-100 dark:bg-green-900/50 px-2 py-1 rounded flex-1 truncate">
                    {kgData.ipfsCid}
                  </code>
                  <Tooltip content="Copy IPFS CID">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyToClipboard(kgData.ipfsCid)}
                      className="text-green-600 hover:text-green-700 p-1"
                    >
                      📋
                    </Button>
                  </Tooltip>
                </div>
              </div>
            </div>

            <div>
              <label className="text-xs font-medium text-green-700 dark:text-green-300 uppercase tracking-wide">
                Published At
              </label>
              <p className="text-sm text-green-600 dark:text-green-400 mt-1">{formatDate(kgData.publishedAt)}</p>
            </div>

            <div className="flex flex-wrap gap-2 pt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  window.open(`https://gateway.pinata.cloud/ipfs/${kgData.ipfsCid.replace('ipfs://', '')}`, '_blank')
                }
                className="text-green-600 border-green-500/30 hover:bg-green-50 dark:hover:bg-green-900/20"
              >
                🔗 View on IPFS
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={() => window.open('https://thegraph.com/explorer', '_blank')}
                className="text-green-600 border-green-500/30 hover:bg-green-50 dark:hover:bg-green-900/20"
              >
                🌐 Explore Knowledge Graph
              </Button>

              <Tooltip content="This dapp is now discoverable by other developers and can be composed with similar applications">
                <Button
                  variant="outline"
                  size="sm"
                  className="text-green-600 border-green-500/30 hover:bg-green-50 dark:hover:bg-green-900/20"
                >
                  ℹ️ What does this mean?
                </Button>
              </Tooltip>
            </div>

            <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-3 mt-3">
              <h4 className="text-sm font-semibold text-green-700 dark:text-green-300 mb-2">
                🎯 Benefits of Knowledge Graph Publishing
              </h4>
              <ul className="text-xs text-green-600 dark:text-green-400 space-y-1">
                <li>
                  • <strong>Discoverability:</strong> Other developers can find and learn from your dapp
                </li>
                <li>
                  • <strong>Composability:</strong> Your dapp can be combined with similar applications
                </li>
                <li>
                  • <strong>Transparency:</strong> Open metadata improves the entire ecosystem
                </li>
                <li>
                  • <strong>Innovation:</strong> Enables AI-powered dapp discovery and recommendations
                </li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};

export default KnowledgeGraphStatus;
