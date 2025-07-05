import { useEffect } from 'react';
import { json, type LoaderFunctionArgs, type MetaFunction } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import KnowledgeGraphIntelligence from '~/components/knowledgeGraph/KnowledgeGraphIntelligence';

export const meta: MetaFunction = () => {
  return [
    { title: 'CosmiqETH Intelligence Platform' },
    {
      name: 'description',
      content: 'AI-powered insights into the Web3 ecosystem built on Hypergraph Knowledge Graph Framework',
    },
  ];
};

export async function loader({ request }: LoaderFunctionArgs) {
  return json({
    timestamp: new Date().toISOString(),
  });
}

export default function IntelligencePage() {
  const data = useLoaderData<typeof loader>();

  useEffect(() => {
    // Add any page-specific initialization here
    document.title = 'CosmiqETH Intelligence Platform';
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 dark:from-gray-900 dark:via-blue-900/20 dark:to-purple-900/20">
      {/* Header */}
      <header className="border-b border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <span className="text-2xl">🧠</span>
                <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Cosmiq Intelligence
                </h1>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <a
                href="https://docs.hypergraph.thegraph.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100 transition-colors"
              >
                📚 Hypergraph Docs
              </a>
              <button
                onClick={() => window.close()}
                className="inline-flex items-center px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                ← Back to Cosmiq
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <KnowledgeGraphIntelligence className="w-full" />
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 dark:border-gray-800 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Powered by Hypergraph Knowledge Graph Framework
              </span>
              <span className="text-xs text-gray-500 dark:text-gray-500">
                Last updated: {new Date(data.timestamp).toLocaleString()}
              </span>
            </div>

            <div className="flex items-center space-x-6">
              <a
                href="https://thegraph.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100 transition-colors"
              >
                The Graph
              </a>
              <a
                href="https://github.com/geobrowser/create-types-and-properties"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100 transition-colors"
              >
                GRC-20 Reference
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
