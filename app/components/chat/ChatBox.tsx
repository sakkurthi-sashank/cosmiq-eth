import React, { useState } from 'react';
import { ClientOnly } from 'remix-utils/client-only';
import { classNames } from '~/utils/classNames';
import { SendButton } from './SendButton.client';
import type { ProviderInfo } from '~/types/model';
import type { DesignScheme } from '~/types/design-scheme';
import type { ElementInfo } from '~/components/workbench/Inspector';

interface ChatBoxProps {
  isModelSettingsCollapsed: boolean;
  setIsModelSettingsCollapsed: (collapsed: boolean) => void;
  provider: any;
  providerList: any[];
  modelList: any[];
  apiKeys: Record<string, string>;
  isModelLoading: string | undefined;
  onApiKeysChange: (providerName: string, apiKey: string) => void;
  textareaRef: React.RefObject<HTMLTextAreaElement> | undefined;
  input: string;
  handlePaste: (e: React.ClipboardEvent) => void;
  TEXTAREA_MIN_HEIGHT: number;
  TEXTAREA_MAX_HEIGHT: number;
  isStreaming: boolean;
  handleSendMessage: (event: React.UIEvent, messageInput?: string) => void;

  chatStarted: boolean;
  exportChat?: () => void;
  setProvider?: ((provider: ProviderInfo) => void) | undefined;
  model?: string | undefined;
  setModel?: ((model: string) => void) | undefined;
  handleInputChange?: ((event: React.ChangeEvent<HTMLTextAreaElement>) => void) | undefined;
  handleStop?: (() => void) | undefined;
  chatMode?: 'discuss' | 'build';
  setChatMode?: (mode: 'discuss' | 'build') => void;
  designScheme?: DesignScheme;
  setDesignScheme?: (scheme: DesignScheme) => void;
  selectedElement?: ElementInfo | null;
  setSelectedElement?: ((element: ElementInfo | null) => void) | undefined;
}

export const ChatBox: React.FC<ChatBoxProps> = (props) => {
  const [isInputFocused, setIsInputFocused] = useState(false);

  return (
    <div className="relative w-full max-w-4xl mx-auto p-4 z-50">
      {/* Selected Element Inspector */}
      {props.selectedElement && (
        <div className="mb-4 bg-gradient-to-br from-blue-50/90 via-indigo-50/90 to-cyan-50/90 dark:from-blue-900/30 dark:via-indigo-900/30 dark:to-cyan-900/30 backdrop-blur-sm border border-blue-200/60 dark:border-blue-700/60 rounded-2xl p-4 shadow-lg hover:shadow-xl transition-all duration-300 animate-in slide-in-from-top-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full animate-pulse shadow-lg"></div>
                <span className="text-sm font-semibold text-gray-800 dark:text-gray-200">Element Inspector</span>
              </div>
              <code className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-3 py-1.5 rounded-xl text-xs font-mono font-bold shadow-md">
                {props?.selectedElement?.tagName}
              </code>
              <span className="text-xs text-gray-600 dark:text-gray-400 font-medium">selected for inspection</span>
            </div>
            <button
              className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-semibold text-sm transition-all duration-200 hover:bg-blue-100/80 dark:hover:bg-blue-900/40 px-3 py-1.5 rounded-xl hover:scale-105 active:scale-95 shadow-sm hover:shadow-md"
              onClick={() => props.setSelectedElement?.(null)}
            >
              Clear
            </button>
          </div>
        </div>
      )}

      {/* Main Chat Container */}
      <div
        className={classNames(
          'bg-white/95 dark:bg-gray-900/95 backdrop-blur-2xl rounded-3xl shadow-2xl border overflow-hidden transition-all duration-500 ease-out',
          isInputFocused
            ? 'border-green-300/60 dark:border-green-600/60 shadow-green-500/20 shadow-2xl scale-[1.02] ring-4 ring-green-500/10'
            : 'border-gray-200/60 dark:border-gray-700/60 hover:border-gray-300/80 dark:hover:border-gray-600/80 hover:shadow-xl',
        )}
      >
        {/* Chat Input Area */}
        <div className="relative p-8">
          <textarea
            ref={props.textareaRef}
            className={classNames(
              'w-full pl-6 pt-6 pr-20 pb-6 outline-none resize-none bg-transparent text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 text-lg leading-relaxed',
              'transition-all duration-300 ease-in-out',
              'focus:ring-0 focus:border-transparent rounded-2xl border border-transparent',
              'hover:bg-gray-50/30 dark:hover:bg-gray-800/30',
              'font-medium',
            )}
            onFocus={() => setIsInputFocused(true)}
            onBlur={() => setIsInputFocused(false)}
            onKeyDown={(event) => {
              if (event.key === 'Enter') {
                if (event.shiftKey) {
                  return;
                }

                event.preventDefault();

                if (props.isStreaming) {
                  props.handleStop?.();
                  return;
                }

                // ignore if using input method engine
                if (event.nativeEvent.isComposing) {
                  return;
                }

                props.handleSendMessage?.(event);
              }
            }}
            value={props.input}
            onChange={(event) => {
              props.handleInputChange?.(event);
            }}
            onPaste={props.handlePaste}
            style={{
              minHeight: props.TEXTAREA_MIN_HEIGHT,
              maxHeight: props.TEXTAREA_MAX_HEIGHT,
            }}
            placeholder={
              props.chatMode === 'build'
                ? "Ask Cosmiq anything or describe what you'd like to build..."
                : 'Start a conversation or ask any question...'
            }
            translate="no"
          />

          {/* Send Button */}
          <ClientOnly>
            {() => (
              <div className="absolute top-1/2 right-6 -translate-y-1/2 flex items-center justify-center">
                <SendButton
                  show={props.input.length > 0 || props.isStreaming}
                  isStreaming={props.isStreaming}
                  disabled={!props.providerList || props.providerList.length === 0}
                  onClick={(event) => {
                    if (props.isStreaming) {
                      props.handleStop?.();
                      return;
                    }

                    if (props.input.length > 0) {
                      props.handleSendMessage?.(event);
                    }
                  }}
                />
              </div>
            )}
          </ClientOnly>
        </div>

        {/* Footer with shortcuts and indicators */}
        <div className="flex justify-between items-center px-8 py-5 bg-gradient-to-r from-gray-50/80 via-gray-50/60 to-gray-50/80 dark:from-gray-800/80 dark:via-gray-800/60 dark:to-gray-800/80 border-t border-gray-200/50 dark:border-gray-700/50 backdrop-blur-sm">
          <div className="flex gap-4 items-center">
            {/* Chat Mode Indicator */}
            <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-100/80 to-emerald-100/80 dark:from-green-900/40 dark:to-emerald-900/40 rounded-full border border-green-200/60 dark:border-green-700/60 shadow-sm hover:shadow-md transition-all duration-300">
              <div className="w-2.5 h-2.5 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full animate-pulse shadow-sm"></div>
              <span className="text-xs font-semibold text-green-700 dark:text-green-300 capitalize">
                {props.chatMode || 'build'} mode
              </span>
            </div>

            {/* Streaming Indicator */}
            {props.isStreaming && (
              <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-yellow-100/80 to-orange-100/80 dark:from-yellow-900/40 dark:to-orange-900/40 rounded-full border border-yellow-200/60 dark:border-yellow-700/60 shadow-sm hover:shadow-md transition-all duration-300 animate-in slide-in-from-right">
                <div className="flex gap-1">
                  <div className="w-1.5 h-1.5 bg-yellow-500 rounded-full animate-bounce"></div>
                  <div className="w-1.5 h-1.5 bg-yellow-500 rounded-full animate-bounce delay-100"></div>
                  <div className="w-1.5 h-1.5 bg-yellow-500 rounded-full animate-bounce delay-200"></div>
                </div>
                <span className="text-xs font-semibold text-yellow-700 dark:text-yellow-300">AI is thinking...</span>
              </div>
            )}
          </div>

          {/* Keyboard Shortcuts */}
          {props.input.length > 3 && (
            <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400 font-medium">
              <span>Press</span>
              <kbd className="px-2.5 py-1.5 bg-white/80 dark:bg-gray-800/80 border border-gray-300/60 dark:border-gray-600/60 rounded-lg font-mono text-xs shadow-sm backdrop-blur-sm">
                ⇧
              </kbd>
              <span>+</span>
              <kbd className="px-2.5 py-1.5 bg-white/80 dark:bg-gray-800/80 border border-gray-300/60 dark:border-gray-600/60 rounded-lg font-mono text-xs shadow-sm backdrop-blur-sm">
                ↵
              </kbd>
              <span>for new line</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
