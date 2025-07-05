import { json } from '@remix-run/cloudflare';
import { ClientOnly } from 'remix-utils/client-only';
import { BaseChat } from '~/components/chat/BaseChat';
import { Chat } from '~/components/chat/Chat.client';
import { Header } from '~/components/header/Header';
import { AuthGuard } from '~/components/flow/AuthGuard';

export const loader = () => json({});

/**
 * Landing page component for cosmiq
 * A Web3-inspired builder platform that generates working web applications from natural language prompts
 */
export default function Index() {
  return (
    <AuthGuard>
      <div className="flex flex-col h-full w-full bg-cosmiq-elements-background-depth-1">
        <Header />
        <ClientOnly fallback={<BaseChat />}>{() => <Chat />}</ClientOnly>
      </div>
    </AuthGuard>
  );
}
