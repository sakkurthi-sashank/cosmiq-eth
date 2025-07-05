import { json } from '@remix-run/cloudflare';
import { useState } from 'react';
import { ClientOnly } from 'remix-utils/client-only';
import { BaseChat } from '~/components/chat/BaseChat';
import { Chat } from '~/components/chat/Chat.client';
import { Header } from '~/components/header/Header';
import { AuthGuard } from '~/components/flow/AuthGuard';
import { FlowDemo } from '~/components/flow/FlowDemo';
import { Button } from '~/components/ui/Button';

export const loader = () => json({});

/**
 * Landing page component for cosmiq
 * A Web3-inspired builder platform that generates working web applications from natural language prompts
 */
export default function Index() {
  const [showFlowDemo, setShowFlowDemo] = useState(false);

  if (showFlowDemo) {
    return (
      <AuthGuard>
        <div className="relative">
          <FlowDemo />
          {/* Back to Chat Button */}
          <div className="fixed top-4 right-4 z-50">
            <Button
              onClick={() => setShowFlowDemo(false)}
              className="bg-cosmiq-elements-background-depth-2 hover:bg-cosmiq-elements-background-depth-3 text-cosmiq-elements-textPrimary border border-cosmiq-elements-borderColor rounded-lg px-4 py-2 shadow-lg"
            >
              ← Back to Chat
            </Button>
          </div>
        </div>
      </AuthGuard>
    );
  }

  return (
    <AuthGuard>
      <div className="flex flex-col h-full w-full bg-cosmiq-elements-background-depth-1">
        <Header />

        {/* Flow Demo Button */}
        <div className="absolute top-4 right-4 z-50">
          <Button
            onClick={() => setShowFlowDemo(true)}
            className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold px-4 py-2 rounded-lg shadow-lg transition-all duration-200 transform hover:scale-105"
          >
            🌊 Flow Demo
          </Button>
        </div>

        <ClientOnly fallback={<BaseChat />}>{() => <Chat />}</ClientOnly>
      </div>
    </AuthGuard>
  );
}
