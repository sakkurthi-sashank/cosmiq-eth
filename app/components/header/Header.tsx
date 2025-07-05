import { useStore } from '@nanostores/react';
import { ClientOnly } from 'remix-utils/client-only';
import { chatStore } from '~/lib/stores/chat';
import { classNames } from '~/utils/classNames';
import { FlowAuthHeader } from '~/components/flow/FlowAuthHeader';

export function Header() {
  const chat = useStore(chatStore);

  return (
    <header
      className={classNames('flex items-center justify-between px-4 border-b h-[var(--header-height)]', {
        'border-transparent': !chat.started,
        'border-cosmiq-elements-borderColor': chat.started,
      })}
    >
      <div className="flex-1 flex justify-end">
        <ClientOnly fallback={null}>{() => <FlowAuthHeader />}</ClientOnly>
      </div>
    </header>
  );
}
