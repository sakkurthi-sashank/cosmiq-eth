import { useStore } from '@nanostores/react';
import { ClientOnly } from 'remix-utils/client-only';
import { chatStore } from '~/lib/stores/chat';
import { classNames } from '~/utils/classNames';
import { FlowAuthHeader } from '~/components/flow/FlowAuthHeader';

export function Header() {
  const chat = useStore(chatStore);

  return (
    <header
      className={classNames('flex items-center justify-between px-4 border-b h-[var(--header-height)] relative', {
        'border-transparent': !chat.started,
        'border-cosmiq-elements-borderColor': chat.started,
      })}
    >
      {/* Logo */}
      <div className="flex items-center space-x-3">
        <div className="relative group">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 via-cyan-500/20 to-cyan-500/20 rounded-lg blur-sm opacity-0 group-hover:opacity-100 transition-all duration-300"></div>
        </div>
        <div>
          <span className="text-2xl font-bold bg-gradient-to-r from-green-400 via-green-500 to-green-600 bg-clip-text text-transparent">
            COSMIQ
          </span>
          <span className="text-2xl ">
            💨
          </span>
        </div>
      </div>

      {/* Right side content */}
      <div className="flex-1 flex justify-end">
        <ClientOnly fallback={null}>{() => <FlowAuthHeader />}</ClientOnly>
      </div>
    </header>
  );
}
