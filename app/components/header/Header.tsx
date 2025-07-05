import { useStore } from '@nanostores/react';
import { ClientOnly } from 'remix-utils/client-only';
import { chatStore } from '~/lib/stores/chat';
import { classNames } from '~/utils/classNames';
import { FlowAuthHeader } from '../flow/FlowAuthHeader';

export function Header() {
  const chat = useStore(chatStore);

  return (
    <header
      className={classNames('flex items-center justify-between px-4 border-b h-[var(--header-height)]', {
        'border-transparent': !chat.started,
        'border-bolt-elements-borderColor': chat.started,
      })}
    >
      <div className="flex-1"></div>
      <div className="text-xl font-bold text-bolt-elements-textPrimary">bolt</div>
      <div className="flex-1 flex justify-end">
        <ClientOnly fallback={null}>{() => <FlowAuthHeader />}</ClientOnly>
      </div>
    </header>
  );
}
